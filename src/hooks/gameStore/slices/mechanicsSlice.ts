/**
 * Mechanics Slice
 *
 * Handles all game state and mechanics: prices, holdings, events, trading, etc.
 * This is the core game engine containing the game loop (nextDay), trading,
 * and all game-related computations.
 */

import type { MechanicsSliceCreator } from '../types'
import { ASSETS } from '@/lib/game/assets'
import { EVENTS, CATEGORY_WEIGHTS, QUIET_NEWS, LIFESTYLE_EFFECTS, expandLifestyleEffects } from '@/lib/game/events'
import { EVENT_CHAINS, CHAIN_CATEGORY_WEIGHTS } from '@/lib/game/eventChains'
import { ANGEL_STARTUPS, VC_STARTUPS } from '@/lib/game/startups'
import { LIFESTYLE_ASSETS } from '@/lib/game/lifestyleAssets'
import { checkMilestone, getAllReachedMilestones } from '@/lib/game/milestones'
import { STORIES, getStoryById, selectRandomStory } from '@/lib/game/stories'
import { DEFAULT_GOSSIP_STATE, shouldShowGossip, createGossipNewsItem, isMarketSideways, hasMajorEventToday } from '@/lib/game/gossip'
import { selectFlavorEvent } from '@/lib/game/flavorEvents'
import { DEFAULT_ENCOUNTER_STATE, rollForEncounter } from '@/lib/game/encounters'
import type { EncounterResult } from '@/lib/game/encounters'
import type {
  GameDuration,
  NewsItem,
  ActiveChain,
  ActiveInvestment,
  ActiveEscalation,
  ActiveStory,
  DayCandle,
  EncounterState,
  EncounterType,
  LeveragedPosition,
  ShortPosition,
  SoldPosition,
  NearMissNotification,
  NearMissType,
  OwnedLifestyleItem,
} from '@/lib/game/types'
import {
  recordEventMood,
  recordChainOutcomeMood,
  recordChainRumorMood,
  recordStoryMood,
  decayMoods,
  resolveChainWithMood,
} from '@/lib/game/sentimentHelpers'
import {
  loadUserState,
  saveUserState,
  incrementGamesPlayed,
  incrementAnonymousGames,
} from '@/lib/game/persistence'
import { callIncrementGamesPlayed, callRecordGameEnd, callUseProTrialGame } from '@/lib/game/authBridge'
import {
  canStartGame,
  getRemainingGames,
  getLimitType,
  generateGameId,
  type GameOutcome,
  type GameHistoryEntry,
} from '@/lib/game/userState'
import { recordGameEnd } from '@/lib/game/persistence'

// Import helpers from our helpers file
import {
  initPrices,
  initLifestylePrices,
  generatePositionId,
  mapGameOverReasonToOutcome,
  getActiveTopics,
  selectRandomEvent,
  selectRandomChain,
  selectRandomStartup,
  selectOutcome,
  getRandomDuration,
} from '../helpers'

// Helper to record game completion to localStorage and Supabase
function saveGameResult(
  isWin: boolean,
  finalNetWorth: number,
  daysSurvived: number,
  gameDuration: GameDuration,
  gameOverReason?: string,
  isLoggedIn?: boolean,
  isUsingProTrial?: boolean
): void {
  const userState = loadUserState()

  const entry: GameHistoryEntry = {
    gameId: generateGameId(),
    date: new Date().toISOString(),
    duration: gameDuration as 30 | 45 | 60,
    finalNetWorth,
    profitPercent: ((finalNetWorth - 100000) / 100000) * 100,
    daysSurvived,
    outcome: isWin ? 'win' : mapGameOverReasonToOutcome(gameOverReason || 'BANKRUPT'),
  }

  const updatedState = recordGameEnd(userState, entry, isWin)
  saveUserState(updatedState)

  // Sync to Supabase for logged-in users (fire-and-forget)
  if (isLoggedIn) {
    callRecordGameEnd(finalNetWorth, isWin, {
      gameId: entry.gameId,
      duration: entry.duration,
      profitPercent: entry.profitPercent,
      daysSurvived: entry.daysSurvived,
      outcome: entry.outcome,
    })

    // If this was a Pro trial game, consume one trial
    if (isUsingProTrial) {
      callUseProTrialGame()
    }
  }
}

export const createMechanicsSlice: MechanicsSliceCreator = (set, get) => ({
  // ============================================================================
  // GAME STATE
  // ============================================================================

  // Core game state
  screen: 'title',
  day: 1,
  gameDuration: 30,
  cash: 100000,
  holdings: {},
  prices: {},
  prevPrices: {},
  priceHistory: {},
  costBasis: {},
  initialNetWorth: 100000,

  // Margin trading positions (Pro tier)
  leveragedPositions: [],
  shortPositions: [],

  // Events & news
  event: null,
  message: '',
  gameOverReason: '',
  newsHistory: ['MARKET OPEN - GOOD LUCK TRADER'],
  todayNews: [],
  rumors: [],
  selectedNews: null,

  // Chains & stories
  activeChains: [],
  usedChainIds: [],
  activeStories: [],
  usedStoryIds: [],
  activeEscalations: [],
  assetMoods: [],
  usedFlavorHeadlines: [],

  // Startups
  activeInvestments: [],
  usedStartupIds: [],
  pendingStartupOffer: null,
  queuedStartupOffer: null,

  // Lifestyle
  ownedLifestyle: [],
  lifestylePrices: {},

  // Milestones
  hasReached1M: false,
  reachedMilestones: [],
  activeMilestone: null,
  milestonePhase: 'idle',

  // Gossip & encounters
  gossipState: DEFAULT_GOSSIP_STATE,
  encounterState: DEFAULT_ENCOUNTER_STATE,
  pendingEncounter: null,

  // Near-miss
  soldPositions: [],
  activeNearMiss: null,
  lastNearMissDay: 0,

  // UI state
  selectedAsset: null,
  buyQty: 1,
  showPortfolio: false,

  // Feedback state
  activeSellToast: null,
  activeBuyMessage: null,
  activeInvestmentBuyMessage: null,
  activeInvestmentResultToast: null,

  // Settings & achievements
  showSettings: false,
  pendingAchievement: null,

  // ============================================================================
  // GAME CONTROL ACTIONS
  // ============================================================================

  startGame: (duration?: GameDuration) => {
    // Load user state for limits and settings
    const userState = loadUserState()

    // Use store's userTier (synced from Supabase) as authoritative source
    // This ensures Pro status from payment is respected
    const storeUserTier = get().userTier
    const storeIsLoggedIn = get().isLoggedIn

    // Determine effective tier: Pro users, OR free users with trial games remaining
    // This gives trial users full Pro experience
    const effectiveTier = get().getEffectiveTier()
    const willUseProTrial = storeUserTier === 'free' && storeIsLoggedIn && get().hasProTrialRemaining()

    // Check game limits based on user state:
    // - Pro users (paid or trial): unlimited
    // - Registered free users (logged in, no trial): 3 games/day
    // - Anonymous users (not logged in): 10 games lifetime
    if (effectiveTier !== 'pro' && !canStartGame(userState, storeIsLoggedIn)) {
      const limitType = getLimitType(userState, storeIsLoggedIn)
      if (limitType === 'anonymous') {
        // Anonymous user hit 10 lifetime games - show signup modal
        set({
          showAnonymousLimitModal: true,
          showDailyLimitModal: false,
          gamesRemaining: 0,
          limitType: 'anonymous',
        })
      } else {
        // Registered free user hit 3 daily games - show upgrade modal
        set({
          showDailyLimitModal: true,
          showAnonymousLimitModal: false,
          gamesRemaining: 0,
          limitType: 'daily',
        })
      }
      return
    }

    // Pro users (paid or trial) can play any duration mode
    // Free users can only play 30-day mode
    const storeSelectedDuration = get().selectedDuration
    let gameDuration: GameDuration = duration ?? storeSelectedDuration ?? userState.selectedDuration ?? 30
    if (effectiveTier === 'free' && gameDuration !== 30) {
      gameDuration = 30
    }

    // Update games played counter based on user type
    let updatedUserState: typeof userState
    if (!storeIsLoggedIn || userState.isAnonymous) {
      // Anonymous user - increment lifetime counter (localStorage only)
      updatedUserState = incrementAnonymousGames(userState)
    } else {
      // Registered user - increment daily counter
      // Also sync to Supabase (fire-and-forget, doesn't block game start)
      if (effectiveTier !== 'pro') {
        callIncrementGamesPlayed()
      }
      updatedUserState = incrementGamesPlayed(userState)
    }
    saveUserState(updatedUserState)

    // Update remaining games count for UI
    const remainingAfterStart = getRemainingGames(updatedUserState, storeIsLoggedIn)
    const limitType = getLimitType(updatedUserState, storeIsLoggedIn)

    // Generate base prices (yesterday's close)
    const prevPrices = initPrices()

    // Generate Day 1 opening event (no active escalations or blocked categories yet)
    const openingEvent = selectRandomEvent([], 1, new Set())
    const todayNewsItems: NewsItem[] = openingEvent
      ? [{ headline: openingEvent.headline, effects: openingEvent.effects, labelType: 'news' }]
      : [{ headline: 'MARKETS OPEN - GOOD LUCK TRADER', effects: {}, labelType: 'news' }]

    // Track escalation if opening event triggers one
    const activeEscalations: ActiveEscalation[] = []
    if (openingEvent?.escalates) {
      activeEscalations.push({
        categories: openingEvent.escalates.categories,
        boost: openingEvent.escalates.boost,
        expiresDay: 1 + openingEvent.escalates.duration,
      })
    }

    // Generate lifestyle asset prices
    const lifestylePrices = initLifestylePrices()

    // Calculate Day 1 prices with event effects
    const prices: Record<string, number> = {}
    const priceHistory: Record<string, DayCandle[]> = {}
    ASSETS.forEach(asset => {
      let change = (Math.random() - 0.5) * asset.volatility * 2
      if (openingEvent?.effects[asset.id]) {
        change += openingEvent.effects[asset.id]
      }
      const newPrice = prevPrices[asset.id] * (1 + change)
      prices[asset.id] = Math.max(0.01, Math.round(newPrice * 100) / 100)

      // Initialize price history with Day 1 candle
      // Open = prevPrice (yesterday's close), Close = today's price
      // For Day 1, we simulate intraday range based on volatility
      const open = prevPrices[asset.id]
      const close = prices[asset.id]
      const volatilityRange = open * asset.volatility * 0.5
      const high = Math.max(open, close) + Math.random() * volatilityRange
      const low = Math.min(open, close) - Math.random() * volatilityRange
      priceHistory[asset.id] = [{
        day: 1,
        open: Math.round(open * 100) / 100,
        high: Math.round(Math.max(high, open, close) * 100) / 100,
        low: Math.round(Math.max(0.01, Math.min(low, open, close)) * 100) / 100,
        close: close,
      }]
    })

    set({
      screen: 'game',
      day: 1,
      gameDuration,
      cash: 100000,
      holdings: {},
      // Reset margin trading positions
      leveragedPositions: [],
      shortPositions: [],
      prices,
      prevPrices,
      priceHistory,
      costBasis: {},
      initialNetWorth: 100000,
      event: null,
      message: '',
      gameOverReason: '',
      selectedAsset: null,
      buyQty: 1,
      newsHistory: [openingEvent?.headline || 'MARKETS OPEN - GOOD LUCK TRADER'],
      showPortfolio: false,
      activeChains: [],
      usedChainIds: [],
      todayNews: todayNewsItems,
      rumors: [],
      selectedNews: null,
      activeInvestments: [],
      usedStartupIds: [],
      pendingStartupOffer: null,
      ownedLifestyle: [],
      lifestylePrices,
      activeEscalations,
      hasReached1M: false,
      reachedMilestones: [],
      activeMilestone: null,
      milestonePhase: 'idle',
      activeStories: [],
      usedStoryIds: [],
      gossipState: DEFAULT_GOSSIP_STATE,
      encounterState: DEFAULT_ENCOUNTER_STATE,
      pendingEncounter: null,
      queuedStartupOffer: null,
      soldPositions: [],
      activeNearMiss: null,
      lastNearMissDay: 0,
      assetMoods: [],
      usedFlavorHeadlines: [],
      userTier: effectiveTier,
      gamesRemaining: remainingAfterStart,
      limitType,
      showDailyLimitModal: false,
      showAnonymousLimitModal: false,
      isUsingProTrial: willUseProTrial,
    })
  },

  nextDay: () => {
    const { prices, priceHistory, newsHistory, day, cash, holdings, activeChains, usedChainIds, activeInvestments, usedStartupIds, ownedLifestyle, lifestylePrices, activeEscalations, hasReached1M, reachedMilestones, activeStories, usedStoryIds, gossipState, soldPositions, lastNearMissDay, assetMoods, usedFlavorHeadlines } = get()
    let effects: Record<string, number> = {}
    let updatedEscalations = [...activeEscalations]
    const todayNewsItems: NewsItem[] = []
    let updatedChains = [...activeChains]
    const updatedUsedChainIds = [...usedChainIds]
    let updatedInvestments = [...activeInvestments]
    const updatedUsedStartupIds = [...usedStartupIds]
    let cashChange = 0
    let updatedGossipState = { ...gossipState }
    // Track asset moods for sentiment conflict prevention
    let updatedAssetMoods = decayMoods([...assetMoods], day + 1) // Decay old moods first
    // Track used flavor headlines (meme/celebrity news)
    let updatedFlavorHeadlines = [...usedFlavorHeadlines]

    const newDay = day + 1

    // 0a. Process lifestyle asset income/costs
    let propertyIncome = 0
    let jetCosts = 0
    let teamRevenue = 0
    let hasMarketNews = false // Track if we generated actual market news

    ownedLifestyle.forEach(owned => {
      const asset = LIFESTYLE_ASSETS.find(a => a.id === owned.assetId)
      if (asset) {
        let dailyCashFlow: number

        if (asset.category === 'jet') {
          // Jets use FIXED daily cost (dailyReturn is already a dollar amount, negative)
          dailyCashFlow = asset.dailyReturn
          jetCosts += Math.abs(dailyCashFlow)
        } else {
          // Properties and teams use % of PURCHASE price
          dailyCashFlow = owned.purchasePrice * asset.dailyReturn
          if (asset.category === 'property') {
            propertyIncome += dailyCashFlow
          } else if (asset.category === 'team') {
            teamRevenue += dailyCashFlow
          }
        }

        cashChange += dailyCashFlow
      }
    })

    // Add lifestyle news if there's any cash flow (no label - these are personal finance)
    if (propertyIncome > 0) {
      todayNewsItems.push({
        headline: `RENTAL INCOME: +$${Math.round(propertyIncome).toLocaleString()}`,
        effects: {},
        labelType: 'none'
      })
    }
    if (jetCosts > 0) {
      todayNewsItems.push({
        headline: `JET MAINTENANCE: -$${Math.round(jetCosts).toLocaleString()}`,
        effects: {},
        labelType: 'none'
      })
    }
    if (teamRevenue > 0) {
      todayNewsItems.push({
        headline: `TEAM REVENUE: +$${Math.round(teamRevenue).toLocaleString()}`,
        effects: {},
        labelType: 'none'
      })
    }

    // 0b. Initialize lifestyle prices with base volatility (event effects applied later in step 5b)
    const newLifestylePrices: Record<string, number> = {}
    const lifestyleBaseChanges: Record<string, number> = {} // Store random volatility for later
    LIFESTYLE_ASSETS.forEach(asset => {
      const currentPrice = lifestylePrices[asset.id] || asset.basePrice
      const change = (Math.random() - 0.5) * asset.volatility * 2
      lifestyleBaseChanges[asset.id] = change
      newLifestylePrices[asset.id] = currentPrice // Will be updated with effects in step 5b
    })

    // 0c. Get categories of chains resolving today (before story processing)
    // Only block stories in the same category as resolving chains (not ALL stories)
    const chainsResolvingToday = updatedChains.filter(chain => chain.daysRemaining <= 1)
    const resolvingChainCategories = new Set(chainsResolvingToday.map(c => c.category))

    // 0e. Process multi-stage stories (Phase 1: runs alongside existing system)
    let updatedStories = [...activeStories]
    const updatedUsedStoryIds = [...usedStoryIds]

    // Advance active stories by one stage
    const advancedStories: ActiveStory[] = []
    updatedStories.forEach(activeStory => {
      const story = getStoryById(activeStory.storyId)
      if (!story) return

      const nextStage = activeStory.currentStage + 1

      // Check if this is the final stage (has branches)
      const currentStageDef = story.stages[nextStage]
      if (!currentStageDef) return // Story complete, don't advance

      if (currentStageDef.branches) {
        // Stage with branches - resolve with probability
        // Supports 2-branch (positive/negative) or 3-branch (positive/neutral/negative)
        const roll = Math.random()
        const { positive, neutral, negative } = currentStageDef.branches
        let outcome: { headline: string; effects: Record<string, number>; continues?: boolean }

        if (neutral) {
          // 3-branch resolution: positive → neutral → negative
          if (roll < positive.probability) {
            outcome = positive
          } else if (roll < positive.probability + neutral.probability) {
            outcome = neutral
          } else {
            outcome = negative
          }
        } else {
          // 2-branch resolution: positive → negative
          outcome = roll < positive.probability ? positive : negative
        }

        // Add resolution headline to news (BREAKING if major spike ≥100%)
        const maxStoryEffect = Math.max(...Object.values(outcome.effects).map(Math.abs), 0)
        const storyLabelType = maxStoryEffect >= 1.0 ? 'breaking' : 'news'
        todayNewsItems.push({ headline: outcome.headline, effects: outcome.effects, labelType: storyLabelType })
        hasMarketNews = true

        // Record mood from story resolution
        updatedAssetMoods = recordStoryMood(outcome, newDay, updatedAssetMoods)

        // Merge effects
        Object.entries(outcome.effects).forEach(([assetId, effect]) => {
          effects[assetId] = (effects[assetId] || 0) + effect
        })

        // Check if story continues to next stage or ends here
        const hasMoreStages = story.stages[nextStage + 1] !== undefined
        if (outcome.continues && hasMoreStages) {
          // Story continues to next stage (intermediate branching)
          advancedStories.push({
            ...activeStory,
            currentStage: nextStage,
            lastAdvanceDay: newDay,
          })
        } else {
          // Story ends here - mark as used
          if (!updatedUsedStoryIds.includes(activeStory.storyId)) {
            updatedUsedStoryIds.push(activeStory.storyId)
          }
        }
      } else {
        // Intermediate stage - show headline and apply effects (middle stages = DEVELOPING)
        todayNewsItems.push({ headline: currentStageDef.headline, effects: currentStageDef.effects, labelType: 'developing' })
        hasMarketNews = true

        // Record mood from story intermediate stage
        updatedAssetMoods = recordStoryMood(currentStageDef, newDay, updatedAssetMoods)

        // Merge effects
        Object.entries(currentStageDef.effects).forEach(([assetId, effect]) => {
          effects[assetId] = (effects[assetId] || 0) + effect
        })

        // Advance to next stage
        advancedStories.push({
          ...activeStory,
          currentStage: nextStage,
          lastAdvanceDay: newDay,
        })
      }
    })

    updatedStories = advancedStories

    // Track if active story advanced today (to avoid stacking with chains/events)
    // Only check advancedStories - these are stories that actually fired a headline TODAY
    // Don't check activeStories.length - that would block events whenever ANY story exists
    let storyFiredToday = advancedStories.length > 0

    // Maybe start a new story (7% chance per day, max 1 concurrent)
    // Results in ~1-2 stories per 30-day game, making them feel special
    // Block stories in categories with active chains OR chains resolving today
    // (This prevents story+chain conflicts but allows unrelated stories to start)
    const activeChainCategories = new Set(updatedChains.map(c => c.category))
    // Merge in resolving chain categories to block those story categories today
    resolvingChainCategories.forEach(cat => activeChainCategories.add(cat))
    if (updatedStories.length < 1 && Math.random() < 0.07) {
      const newStory = selectRandomStory(updatedUsedStoryIds, updatedStories, activeChainCategories, updatedAssetMoods, newDay)
      if (newStory) {
        // Show first stage (rumor) of the new story
        const firstStage = newStory.stages[0]
        todayNewsItems.push({ headline: firstStage.headline, effects: firstStage.effects, labelType: 'rumor' })
        hasMarketNews = true
        storyFiredToday = true // Mark that a story fired

        // Record mood from story start
        updatedAssetMoods = recordStoryMood(firstStage, newDay, updatedAssetMoods)

        // Apply first stage effects
        Object.entries(firstStage.effects).forEach(([assetId, effect]) => {
          effects[assetId] = (effects[assetId] || 0) + effect
        })

        // Add to active stories (at stage 0, will advance to 1 tomorrow)
        updatedStories.push({
          storyId: newStory.id,
          currentStage: 0,
          startDay: newDay,
          lastAdvanceDay: newDay,
        })
      }
    }

    // 1. Process active chains - decrement days and check for resolution
    const chainsToResolve: ActiveChain[] = []
    const remainingChains: ActiveChain[] = []

    updatedChains.forEach(chain => {
      if (chain.daysRemaining <= 1) {
        chainsToResolve.push(chain)
      } else {
        remainingChains.push({
          ...chain,
          daysRemaining: chain.daysRemaining - 1,
        })
      }
    })

    // 2. Resolve chains that have completed
    // Use mood-aware resolution: if one outcome conflicts with current mood
    // and the other doesn't, pick the non-conflicting one (narrative momentum)
    const chainResolvedToday = chainsToResolve.length > 0
    chainsToResolve.forEach(activeChain => {
      const chainDef = EVENT_CHAINS.find(c => c.id === activeChain.chainId)
      if (chainDef) {
        const outcome = resolveChainWithMood(chainDef, updatedAssetMoods, newDay)
        // Chain resolution = NEWS (or BREAKING if major spike ≥100%)
        const maxChainEffect = Math.max(...Object.values(outcome.effects).map(Math.abs), 0)
        const chainLabelType = maxChainEffect >= 1.0 ? 'breaking' : 'news'
        todayNewsItems.push({ headline: outcome.headline, effects: outcome.effects, labelType: chainLabelType })
        hasMarketNews = true
        // Merge effects into the daily effects pool
        Object.entries(outcome.effects).forEach(([assetId, effect]) => {
          effects[assetId] = (effects[assetId] || 0) + effect
        })
        updatedUsedChainIds.push(activeChain.chainId)
        // Record mood from chain outcome for conflict prevention
        updatedAssetMoods = recordChainOutcomeMood(outcome, newDay, updatedAssetMoods)
      }
    })

    updatedChains = remainingChains

    // 3. Determine if we should start a new chain or fire a single event
    // Skip entirely if story already fired today (prevents headline stacking)
    // 30% chance for chain, 70% for single event (when event happens)
    // No new chain if one is already active
    const hasActiveChain = updatedChains.length > 0
    const eventRoll = Math.random()

    // Compute blocked categories (active stories + active chains) to prevent conflicts
    const blockedCategories = getActiveTopics(updatedStories, updatedChains)

    // Only roll for chain/event if no story fired today (prevents stacking)
    if (!storyFiredToday && eventRoll < 0.45) {
      // Event happens (45% base chance)
      const chainOrSingleRoll = Math.random()

      if (!hasActiveChain && chainOrSingleRoll < 0.30) {
        // Start a new chain (30% of events = ~13.5% overall)
        // Pass blocked categories and assetMoods to avoid starting chain that conflicts
        const newChain = selectRandomChain(updatedUsedChainIds, blockedCategories, updatedAssetMoods, newDay)
        if (newChain) {
          const activeChain: ActiveChain = {
            chainId: newChain.id,
            startDay: newDay,
            daysRemaining: newChain.duration,
            rumor: newChain.rumor,
            category: newChain.category,
            subcategory: newChain.subcategory,
          }
          updatedChains.push(activeChain)
          updatedUsedChainIds.push(newChain.id)
          // Chain rumor is displayed via the 'rumors' state in NewsPanel
          // Don't add to todayNewsItems to avoid duplication
          hasMarketNews = true
          // Record mood from chain rumor for conflict prevention
          updatedAssetMoods = recordChainRumorMood(newChain, newDay, updatedAssetMoods)
        }
      } else {
        // Single event (70% of events) - use escalation-adjusted probabilities
        // Pass blocked categories and assetMoods to avoid event that conflicts
        const e = selectRandomEvent(updatedEscalations, newDay, blockedCategories, updatedAssetMoods)
        if (e) {
          // Single events = NEWS
          todayNewsItems.push({ headline: e.headline, effects: e.effects, labelType: 'news' })
          hasMarketNews = true
          Object.entries(e.effects).forEach(([assetId, effect]) => {
            effects[assetId] = (effects[assetId] || 0) + effect
          })
          // If this event triggers escalation, add it
          if (e.escalates) {
            updatedEscalations.push({
              categories: e.escalates.categories,
              boost: e.escalates.boost,
              expiresDay: newDay + e.escalates.duration,
            })
          }
          // Record mood from event for conflict prevention
          updatedAssetMoods = recordEventMood(e, newDay, updatedAssetMoods)
        }
      }
    }

    // Clean up expired escalations
    updatedEscalations = updatedEscalations.filter(esc => esc.expiresDay > newDay)

    // 4. Process startup investments - resolve completed ones, show hints
    const investmentsToResolve: ActiveInvestment[] = []
    const remainingInvestments: ActiveInvestment[] = []

    updatedInvestments.forEach(inv => {
      if (day + 1 >= inv.resolvesDay) {
        investmentsToResolve.push(inv)
      } else {
        // Check if we should show a mid-game hint (around halfway point)
        const daysInvested = (day + 1) - inv.investedDay
        const totalDays = inv.resolvesDay - inv.investedDay
        const halfwayPoint = Math.floor(totalDays / 2)

        if (!inv.hintShown && daysInvested >= halfwayPoint && inv.outcome) {
          const startup = [...ANGEL_STARTUPS, ...VC_STARTUPS].find(s => s.id === inv.startupId)
          if (startup) {
            // Show positive hint if outcome is good, negative if bad
            const isPositive = inv.outcome.multiplier >= 1
            const hints = isPositive ? startup.hints.positive : startup.hints.negative
            const hint = hints[Math.floor(Math.random() * hints.length)]
            // Hints already contain company name, display directly
            todayNewsItems.push({ headline: hint, effects: {}, labelType: 'rumor' })
            inv.hintShown = true
          }
        }
        remainingInvestments.push(inv)
      }
    })

    // Resolve completed investments
    // Track the most significant result for toast (largest absolute profit/loss)
    let mostSignificantInvestmentResult: {
      message: string
      profitLossPct: number
      isProfit: boolean
    } | null = null
    let maxAbsoluteChange = 0

    investmentsToResolve.forEach(inv => {
      if (inv.outcome) {
        const payout = inv.amount * inv.outcome.multiplier
        cashChange += payout

        // Calculate profit/loss for toast
        const profitLoss = payout - inv.amount
        const profitLossPct = ((payout - inv.amount) / inv.amount) * 100
        const isProfit = profitLoss >= 0

        // Build result message
        const resultMessage = inv.outcome.multiplier === 0
          ? `💀 LOST $${inv.amount.toLocaleString()} ON ${inv.startupName}`
          : `${isProfit ? '🎉' : '😓'} ${inv.startupName}: ${isProfit ? '+' : ''}$${Math.round(profitLoss).toLocaleString()} (${profitLossPct >= 0 ? '+' : ''}${profitLossPct.toFixed(0)}%)`

        // Track most significant result (largest absolute profit/loss)
        const absoluteChange = Math.abs(profitLoss)
        if (absoluteChange > maxAbsoluteChange) {
          maxAbsoluteChange = absoluteChange
          mostSignificantInvestmentResult = {
            message: resultMessage,
            profitLossPct,
            isProfit,
          }
        }

        // Add news headline (startup resolution = NEWS)
        const headlineWithAmount = inv.outcome.multiplier === 0
          ? `${inv.outcome.headline} - YOUR $${inv.amount.toLocaleString()} INVESTMENT LOST`
          : `${inv.outcome.headline} - YOU MADE $${Math.round(payout).toLocaleString()}!`
        todayNewsItems.push({ headline: headlineWithAmount, effects: inv.outcome.marketEffects || {}, labelType: 'news' })

        // Merge market effects
        if (inv.outcome.marketEffects) {
          Object.entries(inv.outcome.marketEffects).forEach(([assetId, effect]) => {
            effects[assetId] = (effects[assetId] || 0) + effect
          })
        }
      }
    })

    updatedInvestments = remainingInvestments

    // 5. If no market news today, add quiet news (lifestyle income doesn't count as market news)
    if (!hasMarketNews) {
      const randomQuiet = QUIET_NEWS[Math.floor(Math.random() * QUIET_NEWS.length)]
      todayNewsItems.push({ headline: randomQuiet, effects: {}, labelType: 'news' })
    }

    // 5a. SECONDARY SLOT: Meme/flavor events (~30% of non-quiet days)
    // Creates funny juxtapositions like "NATO ARTICLE 5" + "BEZOS PARTYING IN MIAMI"
    if (hasMarketNews && Math.random() < 0.30) {
      const flavor = selectFlavorEvent(updatedFlavorHeadlines)
      if (flavor) {
        todayNewsItems.push({
          headline: flavor.headline,
          effects: flavor.effects,
          labelType: 'gossip',
        })
        updatedFlavorHeadlines.push(flavor.headline)

        // Apply flavor event effects (they sum with primary event effects)
        if (Object.keys(flavor.effects).length > 0) {
          Object.entries(flavor.effects).forEach(([assetId, effect]) => {
            effects[assetId] = (effects[assetId] || 0) + effect
          })
        }
      }
    }

    // 5b. Wall St Gossip - social proof messages during sideways markets
    // Calculate price changes for sideways detection
    const priceChanges: Record<string, number> = {}
    ASSETS.forEach(asset => {
      const effect = effects[asset.id] || 0
      priceChanges[asset.id] = effect // Use the effect as approximation
    })

    const isSideways = isMarketSideways(priceChanges)
    const hasMajorEvent = hasMajorEventToday(todayNewsItems)
    const gameLength = get().gameDuration

    // Calculate current net worth for gossip scaling
    let currentPortfolioValue = 0
    Object.entries(holdings).forEach(([id, qty]) => {
      currentPortfolioValue += (prices[id] || 0) * qty
    })
    const currentNetWorth = cash + currentPortfolioValue

    if (shouldShowGossip({
      day: newDay,
      gameLength,
      gossipState: updatedGossipState,
      isSidewaysMarket: isSideways,
      hasMajorEvent,
    })) {
      const gossipNews = createGossipNewsItem(currentNetWorth)
      todayNewsItems.push(gossipNews)
      updatedGossipState = {
        gossipCount: updatedGossipState.gossipCount + 1,
        lastGossipDay: newDay,
      }
    }

    // 5b. Apply lifestyle asset effects from today's news headlines
    // Collect all lifestyle effects from headlines
    const lifestyleEffects: Record<string, number> = {}
    todayNewsItems.forEach(newsItem => {
      const effectsDef = LIFESTYLE_EFFECTS[newsItem.headline]
      if (effectsDef) {
        const expanded = expandLifestyleEffects(effectsDef)
        Object.entries(expanded).forEach(([assetId, effect]) => {
          lifestyleEffects[assetId] = (lifestyleEffects[assetId] || 0) + effect
        })
      }
    })

    // Now calculate final lifestyle prices: current price * (1 + volatility + event effects)
    LIFESTYLE_ASSETS.forEach(asset => {
      const currentPrice = lifestylePrices[asset.id] || asset.basePrice
      const volatilityChange = lifestyleBaseChanges[asset.id] || 0
      const eventEffect = lifestyleEffects[asset.id] || 0
      const totalChange = volatilityChange + eventEffect
      newLifestylePrices[asset.id] = Math.round(currentPrice * (1 + totalChange))
    })

    // 6. Calculate new prices and update price history
    const newPrices: Record<string, number> = {}
    const newPriceHistory: Record<string, DayCandle[]> = {}
    ASSETS.forEach(asset => {
      const open = prices[asset.id] // Today's open = yesterday's close
      let close: number

      // Normal price calculation with volatility and additive effects
      let change = (Math.random() - 0.5) * asset.volatility * 2
      if (effects[asset.id]) change += effects[asset.id]
      close = prices[asset.id] * (1 + change)
      close = Math.max(0.01, Math.round(close * 100) / 100)
      newPrices[asset.id] = close

      // Generate intraday high/low based on volatility
      const volatilityRange = open * asset.volatility * 0.5
      const high = Math.max(open, close) + Math.random() * volatilityRange
      const low = Math.min(open, close) - Math.random() * volatilityRange

      // Add new candle to history
      const existingHistory = priceHistory[asset.id] || []
      newPriceHistory[asset.id] = [
        ...existingHistory,
        {
          day: newDay,
          open: Math.round(open * 100) / 100,
          high: Math.round(Math.max(high, open, close) * 100) / 100,
          low: Math.round(Math.max(0.01, Math.min(low, open, close)) * 100) / 100,
          close: close,
        }
      ]
    })

    // 7. Calculate full net worth (must match getNetWorth() calculation)
    let portfolioValue = 0
    Object.entries(holdings).forEach(([id, qty]) => {
      portfolioValue += (newPrices[id] || 0) * qty
    })
    // Include startup investments at face value
    const startupValue = updatedInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    // Include lifestyle assets at new prices
    let lifestyleValue = 0
    ownedLifestyle.forEach(item => {
      lifestyleValue += newLifestylePrices[item.assetId] || 0
    })
    const currentCash = cash + cashChange
    const nw = Math.round((currentCash + portfolioValue + startupValue + lifestyleValue) * 100) / 100

    // Check if reaching $1M milestone for the first time ever in this game
    let newHasReached1M = hasReached1M
    if (!hasReached1M && nw >= 1000000) {
      todayNewsItems.unshift({ headline: '🎉 $1M CLUB! VCs will now pitch you their hottest deals.', effects: {} })
      newHasReached1M = true
    }

    // Check for milestone achievements (dopamine celebration)
    let newReachedMilestones = [...reachedMilestones]
    let newActiveMilestone: { id: string; title: string; tier: string; scarcityMessage: string } | null = null
    let newMilestonePhase: 'idle' | 'takeover' | 'persist' = 'idle'

    const milestone = checkMilestone(nw, reachedMilestones)
    if (milestone) {
      // Mark all milestones up to this one as reached (handles skipping multiple)
      newReachedMilestones = getAllReachedMilestones(nw, reachedMilestones)
      newActiveMilestone = {
        id: milestone.id,
        title: milestone.title,
        tier: milestone.tier,
        scarcityMessage: milestone.scarcityMessage,
      }
      newMilestonePhase = 'takeover'
    }

    // Near-miss detection: Check sold positions from 3-7 days ago for significant price moves
    let newActiveNearMiss: NearMissNotification | null = null
    let newLastNearMissDay = lastNearMissDay
    const updatedSoldPositions = [...soldPositions]

    // Only check if cooldown has passed (3 days since last near-miss notification)
    if (newDay - lastNearMissDay >= 3) {
      for (const sp of updatedSoldPositions) {
        // Skip if already shown or outside 3-7 day window
        if (sp.notificationShown) continue
        const daysSinceSale = newDay - sp.soldDay
        if (daysSinceSale < 3 || daysSinceSale > 7) continue

        const currentPrice = newPrices[sp.assetId]
        if (!currentPrice) continue

        const pctChange = ((currentPrice - sp.soldPrice) / sp.soldPrice) * 100
        const cashDiff = sp.soldQty * (currentPrice - sp.soldPrice)

        // Determine if this qualifies for a near-miss notification
        let type: NearMissType | null = null
        if (pctChange >= 50) type = 'missed_moon'
        else if (pctChange >= 25) type = 'missed_gain'
        else if (pctChange <= -30) type = 'bullet_dodged'
        else if (pctChange <= -15) type = 'lucky_exit'

        // Only trigger 30% of qualifying events to avoid notification fatigue
        if (type && Math.random() < 0.3) {
          // Format the near-miss message
          let message: string
          const absChange = Math.abs(pctChange).toFixed(0)
          const absCashDiff = Math.abs(cashDiff)
          const cashFormatted = absCashDiff >= 1000000
            ? `$${(absCashDiff / 1000000).toFixed(1)}M`
            : absCashDiff >= 1000
            ? `$${(absCashDiff / 1000).toFixed(0)}K`
            : `$${Math.round(absCashDiff)}`

          if (type === 'missed_moon') {
            message = `${sp.assetName} is up ${absChange}% since you sold — you missed ${cashFormatted}`
          } else if (type === 'missed_gain') {
            message = `${sp.assetName} would have made you +${cashFormatted} (up ${absChange}%)`
          } else if (type === 'bullet_dodged') {
            message = `${sp.assetName} crashed ${absChange}% after you sold — you avoided losing ${cashFormatted}`
          } else {
            message = `${sp.assetName} dropped ${absChange}% since you sold`
          }

          newActiveNearMiss = {
            type,
            assetName: sp.assetName,
            message,
            cashDiff,
            percentChange: pctChange,
          }
          sp.notificationShown = true
          newLastNearMissDay = newDay
          break // Only one near-miss per day
        }
      }
    }

    let newStartupOffer: typeof get extends () => { pendingStartupOffer: infer T } ? T : never = null

    // Only offer startups up to gameDuration - 6 (max duration is 6 days, must resolve by end)
    // Note: gameLength is already defined earlier in this function
    if (newDay <= gameLength - 6) {
      // Angel: 8% chance per day (~2 offers per game)
      if (Math.random() < 0.08) {
        newStartupOffer = selectRandomStartup('angel', updatedUsedStartupIds)
      }

      // VC: 15% base chance + jet bonus, if net worth > $1M (overrides angel if both trigger)
      // Calculate jet bonus from owned jets (uses highest bonus, jets don't stack)
      let vcBonus = 0
      ownedLifestyle.forEach(owned => {
        const asset = LIFESTYLE_ASSETS.find(a => a.id === owned.assetId)
        if (asset?.vcDealBoost && asset.vcDealBoost > vcBonus) {
          vcBonus = asset.vcDealBoost
        }
      })
      const vcChance = 0.15 + vcBonus // Base 15% + jet bonus (up to 25%)

      if (nw >= 1000000 && Math.random() < vcChance) {
        const vcOffer = selectRandomStartup('vc', updatedUsedStartupIds)
        if (vcOffer) newStartupOffer = vcOffer
      }
    }

    // 8. Update state
    const headlines = todayNewsItems.map(n => n.headline)
    set({
      prevPrices: { ...prices },
      prices: newPrices,
      priceHistory: newPriceHistory,
      lifestylePrices: newLifestylePrices,
      event: null,
      day: newDay,
      cash: Math.round(currentCash * 100) / 100,
      message: '',
      activeSellToast: null,
      activeBuyMessage: null,
      activeInvestmentBuyMessage: null,
      activeInvestmentResultToast: mostSignificantInvestmentResult,
      selectedAsset: null,
      buyQty: 1,
      newsHistory: [...headlines, ...newsHistory].slice(0, 10),
      activeChains: updatedChains,
      usedChainIds: updatedUsedChainIds,
      todayNews: todayNewsItems,
      rumors: updatedChains,
      selectedNews: null,
      activeInvestments: updatedInvestments,
      usedStartupIds: updatedUsedStartupIds,
      pendingStartupOffer: newStartupOffer,
      activeEscalations: updatedEscalations,
      hasReached1M: newHasReached1M,
      reachedMilestones: newReachedMilestones,
      activeMilestone: newActiveMilestone,
      milestonePhase: newMilestonePhase,
      activeStories: updatedStories,
      usedStoryIds: updatedUsedStoryIds,
      gossipState: updatedGossipState,
      soldPositions: updatedSoldPositions,
      activeNearMiss: newActiveNearMiss,
      lastNearMissDay: newLastNearMissDay,
      assetMoods: updatedAssetMoods,
      usedFlavorHeadlines: updatedFlavorHeadlines,
    })

    // 9. Check win/lose conditions
    // Re-calculate net worth after all updates (includes margin positions)
    const finalNetWorth = get().getNetWorth()
    const { shortPositions, leveragedPositions } = get()

    const { gameDuration } = get()

    if (finalNetWorth < 0) {
      // Margin trading bankruptcy - determine specific reason
      let gameOverReason = 'MARGIN_CALLED'

      // Check for catastrophic failure (> $1M in debt)
      if (finalNetWorth < -1_000_000) {
        gameOverReason = 'ECONOMIC_CATASTROPHE'
      } else if (shortPositions.length > leveragedPositions.length) {
        // More shorts than leveraged = short squeeze likely cause
        gameOverReason = 'SHORT_SQUEEZED'
      }

      // Record game result before showing game over screen
      saveGameResult(false, finalNetWorth, newDay - 1, gameDuration, gameOverReason, get().isLoggedIn, get().isUsingProTrial)
      set({ screen: 'gameover', gameOverReason, isUsingProTrial: false })
    } else if (finalNetWorth <= 0) {
      // Regular bankruptcy (net worth exactly 0)
      saveGameResult(false, finalNetWorth, newDay - 1, gameDuration, 'BANKRUPT', get().isLoggedIn, get().isUsingProTrial)
      set({ screen: 'gameover', gameOverReason: 'BANKRUPT', isUsingProTrial: false })
    } else if (newDay > gameDuration) {
      // Player survived the full duration - WIN!
      saveGameResult(true, finalNetWorth, gameDuration, gameDuration, undefined, get().isLoggedIn, get().isUsingProTrial)
      set({ screen: 'win', isUsingProTrial: false })
    }
  },

  // Called when user clicks "Next Day" - checks for encounter before advancing
  triggerNextDay: () => {
    const { day, cash, encounterState, pendingStartupOffer, gameDuration } = get()
    const netWorth = get().getNetWorth()

    // Check if an encounter should trigger
    const encounterType = rollForEncounter(day + 1, encounterState, cash, netWorth, gameDuration)

    if (encounterType) {
      // Encounter triggered - show popup and queue any pending startup offer
      set({
        pendingEncounter: { type: encounterType },
        // If there was a startup offer pending, queue it for after the encounter
        queuedStartupOffer: pendingStartupOffer,
        pendingStartupOffer: null,
      })
    } else {
      // No encounter - proceed with normal nextDay
      get().nextDay()
    }
  },

  setScreen: (screen) => set({ screen }),

  // ============================================================================
  // TRADING ACTIONS
  // ============================================================================

  buy: (assetId: string, qty: number) => {
    const { cash, prices, holdings, costBasis } = get()
    const price = prices[assetId]
    const maxQty = Math.floor(cash / price)

    if (qty > maxQty) {
      set({ message: 'NOT ENOUGH CASH' })
      return
    }

    if (qty < 1) return

    const cost = qty * price
    const asset = ASSETS.find(a => a.id === assetId)

    // Update cost basis (weighted average)
    const existingBasis = costBasis[assetId] || { totalCost: 0, totalQty: 0 }
    const newCostBasis = {
      ...costBasis,
      [assetId]: {
        totalCost: existingBasis.totalCost + cost,
        totalQty: existingBasis.totalQty + qty,
      },
    }

    set({
      cash: Math.round((cash - cost) * 100) / 100,
      holdings: { ...holdings, [assetId]: (holdings[assetId] || 0) + qty },
      costBasis: newCostBasis,
      activeBuyMessage: `BOUGHT ${qty} ${asset?.name}`,
      buyQty: 1,
      selectedAsset: null,
    })
  },

  sell: (assetId: string, qty: number) => {
    const { cash, holdings, prices, costBasis, soldPositions, day } = get()
    const owned = holdings[assetId] || 0

    if (qty > owned || qty < 1) {
      set({ message: 'NOTHING TO SELL' })
      return
    }

    const price = prices[assetId]
    const revenue = qty * price
    const asset = ASSETS.find(a => a.id === assetId)

    // Calculate P/L for the trade
    const existingBasis = costBasis[assetId] || { totalCost: 0, totalQty: 0 }
    const avgCost = existingBasis.totalQty > 0 ? existingBasis.totalCost / existingBasis.totalQty : price
    const costOfSold = avgCost * qty
    const profitLoss = revenue - costOfSold
    const profitLossPct = avgCost > 0 ? ((price - avgCost) / avgCost) * 100 : 0

    // Determine emoji based on P/L percentage
    let emoji: string
    if (profitLossPct >= 50) emoji = '🚀'
    else if (profitLossPct >= 10) emoji = '💰'
    else if (profitLossPct > 0) emoji = '📈'
    else if (profitLossPct === 0) emoji = '➡️'
    else if (profitLossPct > -10) emoji = '📉'
    else if (profitLossPct > -50) emoji = '💸'
    else emoji = '🔥'

    // Format the message
    const plSign = profitLoss >= 0 ? '+' : ''
    const plFormatted = Math.abs(profitLoss) >= 1000
      ? `${plSign}$${(profitLoss / 1000).toFixed(1)}K`
      : `${plSign}$${Math.round(profitLoss)}`
    const pctFormatted = `${profitLossPct >= 0 ? '+' : ''}${profitLossPct.toFixed(0)}%`
    const tradeMessage = `${emoji} SOLD ${qty} ${asset?.name}: ${plFormatted} (${pctFormatted})`

    // Proportionally reduce cost basis
    const remainingQty = owned - qty
    let newCostBasis = { ...costBasis }

    if (remainingQty <= 0) {
      // Sold all - remove cost basis
      delete newCostBasis[assetId]
    } else {
      // Proportionally reduce cost basis
      newCostBasis[assetId] = {
        totalCost: avgCost * remainingQty,
        totalQty: remainingQty,
      }
    }

    // Track sold position for near-miss detection
    const newSoldPosition: SoldPosition = {
      assetId,
      assetName: asset?.name || assetId,
      soldDay: day,
      soldPrice: price,
      soldQty: qty,
      notificationShown: false,
    }
    // Keep only last 20 sold positions to limit memory
    const updatedSoldPositions = [...soldPositions, newSoldPosition].slice(-20)

    set({
      cash: Math.round((cash + revenue) * 100) / 100,
      holdings: { ...holdings, [assetId]: owned - qty },
      costBasis: newCostBasis,
      activeSellToast: {
        message: tradeMessage,
        profitLossPct,
        isProfit: profitLoss >= 0,
      },
      buyQty: 1,
      selectedAsset: null,
      soldPositions: updatedSoldPositions,
    })
  },

  selectAsset: (id: string | null) => set({ selectedAsset: id, buyQty: 1 }),
  setBuyQty: (qty: number) => set({ buyQty: qty }),

  // ============================================================================
  // MARGIN TRADING ACTIONS (Pro Tier)
  // ============================================================================

  buyWithLeverage: (assetId: string, qty: number, leverage) => {
    // If 1x leverage, use regular buy (no debt tracking needed)
    if (leverage === 1) {
      get().buy(assetId, qty)
      return
    }

    const { cash, prices, leveragedPositions, day } = get()
    const price = prices[assetId]
    const totalCost = qty * price
    const downPayment = totalCost / leverage  // e.g., 10x = 10% down
    const debtAmount = totalCost - downPayment

    if (downPayment > cash) {
      set({ message: 'NOT ENOUGH CASH FOR MARGIN' })
      return
    }

    const asset = ASSETS.find(a => a.id === assetId)

    const newPosition: LeveragedPosition = {
      id: generatePositionId(),
      assetId,
      qty,
      entryPrice: price,
      leverage,
      debtAmount,
      purchaseDay: day,
    }

    set({
      cash: Math.round((cash - downPayment) * 100) / 100,
      leveragedPositions: [...leveragedPositions, newPosition],
      activeBuyMessage: `BOUGHT ${qty} ${asset?.name} @ ${leverage}x LEVERAGE`,
    })
  },

  shortSell: (assetId: string, qty: number) => {
    const { cash, prices, shortPositions, day } = get()
    const price = prices[assetId]
    const cashReceived = qty * price

    const asset = ASSETS.find(a => a.id === assetId)

    const newPosition: ShortPosition = {
      id: generatePositionId(),
      assetId,
      qty,
      entryPrice: price,
      cashReceived,
      openDay: day,
    }

    set({
      cash: Math.round((cash + cashReceived) * 100) / 100,
      shortPositions: [...shortPositions, newPosition],
      activeBuyMessage: `SHORTED ${qty} ${asset?.name} @ $${price.toLocaleString()}`,
    })
  },

  coverShort: (positionId: string) => {
    const { cash, prices, shortPositions } = get()
    const position = shortPositions.find(p => p.id === positionId)
    if (!position) return

    const currentPrice = prices[position.assetId]
    const coverCost = position.qty * currentPrice
    const profitLoss = position.cashReceived - coverCost
    const profitLossPct = (profitLoss / position.cashReceived) * 100

    if (coverCost > cash) {
      set({ message: 'NOT ENOUGH CASH TO COVER' })
      return
    }

    const asset = ASSETS.find(a => a.id === position.assetId)
    const plSign = profitLoss >= 0 ? '+' : ''
    const emoji = profitLoss >= 0 ? '📈' : '📉'
    const tradeMessage = `${emoji} COVERED ${position.qty} ${asset?.name}: ${plSign}$${Math.abs(profitLoss).toLocaleString()}`

    const newShortPositions = shortPositions.filter(p => p.id !== positionId)

    set({
      cash: Math.round((cash - coverCost) * 100) / 100,
      shortPositions: newShortPositions,
      activeSellToast: {
        message: tradeMessage,
        profitLossPct,
        isProfit: profitLoss >= 0,
      },
    })
  },

  closeLeveragedPosition: (positionId: string) => {
    const { cash, prices, leveragedPositions } = get()
    const position = leveragedPositions.find(p => p.id === positionId)
    if (!position) return

    const currentPrice = prices[position.assetId]
    const saleProceeds = position.qty * currentPrice
    const afterDebt = saleProceeds - position.debtAmount
    // Profit/loss = what you get back - what you originally put in
    const originalDownPayment = position.qty * position.entryPrice / position.leverage
    const profitLoss = afterDebt - originalDownPayment
    const profitLossPct = originalDownPayment > 0 ? (profitLoss / originalDownPayment) * 100 : 0

    const asset = ASSETS.find(a => a.id === position.assetId)
    const plSign = profitLoss >= 0 ? '+' : ''
    const emoji = profitLoss >= 0 ? '🚀' : '💸'

    const newPositions = leveragedPositions.filter(p => p.id !== positionId)

    // Allow negative afterDebt (underwater position) - bankruptcy check at end-of-day
    const warningMessage = afterDebt < 0 ? ' (UNDERWATER!)' : ''
    const tradeMessage = `${emoji} CLOSED ${position.leverage}x ${asset?.name}: ${plSign}$${Math.abs(profitLoss).toLocaleString()}${warningMessage}`

    set({
      cash: Math.round((cash + afterDebt) * 100) / 100,
      leveragedPositions: newPositions,
      activeSellToast: {
        message: tradeMessage,
        profitLossPct,
        isProfit: profitLoss >= 0,
      },
    })
  },

  // ============================================================================
  // STARTUP ACTIONS
  // ============================================================================

  investInStartup: (amount: number) => {
    const { cash, day, pendingStartupOffer, activeInvestments, usedStartupIds } = get()

    if (!pendingStartupOffer) return
    if (amount > cash) {
      set({ message: 'NOT ENOUGH CASH' })
      return
    }

    // Pre-determine the outcome at investment time
    const outcome = selectOutcome(pendingStartupOffer)
    let duration = getRandomDuration(pendingStartupOffer)

    // Ensure investment resolves before game ends
    const maxResolvesDay = get().gameDuration
    if (day + duration > maxResolvesDay) {
      duration = Math.max(1, maxResolvesDay - day)
    }

    const newInvestment: ActiveInvestment = {
      startupId: pendingStartupOffer.id,
      startupName: pendingStartupOffer.name,
      amount,
      investedDay: day,
      resolvesDay: day + duration,
      hintShown: false,
      outcome,
    }

    set({
      cash: Math.round((cash - amount) * 100) / 100,
      activeInvestments: [...activeInvestments, newInvestment],
      usedStartupIds: [...usedStartupIds, pendingStartupOffer.id],
      pendingStartupOffer: null,
      activeInvestmentBuyMessage: `INVESTED $${amount.toLocaleString()} IN ${pendingStartupOffer.name}`,
    })
  },

  dismissStartupOffer: () => {
    set({ pendingStartupOffer: null })
  },

  // ============================================================================
  // LIFESTYLE ACTIONS
  // ============================================================================

  buyLifestyle: (assetId: string) => {
    const { cash, lifestylePrices, ownedLifestyle, day } = get()
    const asset = LIFESTYLE_ASSETS.find(a => a.id === assetId)
    if (!asset) return

    const price = lifestylePrices[assetId] || asset.basePrice

    if (cash < price) {
      set({ message: 'NOT ENOUGH CASH' })
      return
    }

    // Check if already owned
    if (ownedLifestyle.some(o => o.assetId === assetId)) {
      set({ message: 'ALREADY OWNED' })
      return
    }

    const newOwned: OwnedLifestyleItem = {
      assetId,
      purchasePrice: price,
      purchaseDay: day,
    }

    set({
      cash: Math.round((cash - price) * 100) / 100,
      ownedLifestyle: [...ownedLifestyle, newOwned],
      activeBuyMessage: `PURCHASED ${asset.name}`,
    })
  },

  sellLifestyle: (assetId: string) => {
    const { cash, lifestylePrices, ownedLifestyle } = get()
    const asset = LIFESTYLE_ASSETS.find(a => a.id === assetId)
    if (!asset) return

    // Check if owned
    const ownedItem = ownedLifestyle.find(o => o.assetId === assetId)
    if (!ownedItem) {
      set({ message: 'NOT OWNED' })
      return
    }

    const salePrice = lifestylePrices[assetId] || asset.basePrice
    const profitLoss = salePrice - ownedItem.purchasePrice
    const profitLossPct = ((salePrice / ownedItem.purchasePrice) - 1) * 100

    // Determine emoji based on P/L
    let emoji: string
    if (profitLossPct >= 50) emoji = '🚀'
    else if (profitLossPct >= 10) emoji = '💰'
    else if (profitLossPct > 0) emoji = '📈'
    else if (profitLossPct === 0) emoji = '➡️'
    else if (profitLossPct > -10) emoji = '📉'
    else if (profitLossPct > -50) emoji = '💸'
    else emoji = '🔥'

    const plSign = profitLoss >= 0 ? '+' : ''
    const plFormatted = `${plSign}$${Math.abs(profitLoss).toLocaleString()}`
    const pctFormatted = `${profitLossPct >= 0 ? '+' : ''}${profitLossPct.toFixed(0)}%`
    const saleMessage = `${emoji} SOLD ${asset.name}: ${plFormatted} (${pctFormatted})`

    set({
      cash: Math.round((cash + salePrice) * 100) / 100,
      ownedLifestyle: ownedLifestyle.filter(o => o.assetId !== assetId),
      activeSellToast: {
        message: saleMessage,
        profitLossPct,
        isProfit: profitLoss >= 0,
      },
    })
  },

  // ============================================================================
  // UI ACTIONS
  // ============================================================================

  setShowPortfolio: (show: boolean) => set({ showPortfolio: show }),
  setSelectedNews: (news) => set({ selectedNews: news }),
  setShowSettings: (show: boolean) => set({ showSettings: show }),

  // ============================================================================
  // FEEDBACK ACTIONS
  // ============================================================================

  clearSellToast: () => set({ activeSellToast: null }),
  clearBuyMessage: () => set({ activeBuyMessage: null }),
  clearInvestmentBuyMessage: () => set({ activeInvestmentBuyMessage: null }),
  clearInvestmentResultToast: () => set({ activeInvestmentResultToast: null }),
  clearPendingAchievement: () => set({ pendingAchievement: null }),
  triggerAchievement: (id: string) => set({ pendingAchievement: id }),

  // ============================================================================
  // MILESTONE ACTIONS
  // ============================================================================

  clearMilestone: () => set({ milestonePhase: 'idle', activeMilestone: null }),

  // ============================================================================
  // NEAR-MISS ACTIONS
  // ============================================================================

  clearNearMiss: () => set({ activeNearMiss: null }),

  // ============================================================================
  // ENCOUNTER ACTIONS
  // ============================================================================

  confirmEncounterResult: (result: EncounterResult, encounterType: EncounterType) => {
    const { pendingEncounter, encounterState, cash, day, queuedStartupOffer, holdings, prices } = get()

    if (!pendingEncounter) return

    // Update encounter state
    const newEncounterState: EncounterState = {
      encounterCount: encounterState.encounterCount + 1,
      lastEncounterDay: day + 1,
      usedSEC: encounterState.usedSEC || encounterType === 'sec',
      usedKidney: encounterState.usedKidney || encounterType === 'kidney',
      divorceCount: encounterState.divorceCount + (encounterType === 'divorce' ? 1 : 0),
    }

    let newCash = cash
    let newHoldings = { ...holdings }
    let finalHeadline = result.headline

    // Handle forced liquidation (SEC/Divorce penalties)
    if (result.liquidationRequired !== undefined && result.liquidationRequired > 0) {
      const amountNeeded = result.liquidationRequired

      if (cash >= amountNeeded) {
        // Cash covers it
        newCash = cash - amountNeeded
      } else {
        // Need to liquidate assets
        const shortfall = amountNeeded - cash
        newCash = 0

        // Calculate total portfolio value
        let portfolioValue = 0
        Object.entries(holdings).forEach(([id, qty]) => {
          portfolioValue += (prices[id] || 0) * qty
        })

        if (portfolioValue < shortfall) {
          // Can't cover the penalty even with all assets → Bankruptcy
          const { day, gameDuration } = get()
          saveGameResult(false, 0, day, gameDuration, 'BANKRUPT', get().isLoggedIn, get().isUsingProTrial)
          set({
            cash: 0,
            holdings: {},
            encounterState: newEncounterState,
            pendingEncounter: null,
            queuedStartupOffer: null,
            screen: 'gameover',
            gameOverReason: 'BANKRUPT',
            isUsingProTrial: false,
            message: `${result.headline} — Assets seized, still couldn't cover the debt.`,
          })
          return
        }

        // Proportional liquidation: sell enough of each holding to cover shortfall
        const liquidationRatio = shortfall / portfolioValue
        let totalLiquidated = 0

        Object.entries(holdings).forEach(([id, qty]) => {
          const price = prices[id] || 0
          const holdingValue = price * qty
          const valueToLiquidate = holdingValue * liquidationRatio
          const qtyToSell = Math.ceil(valueToLiquidate / price)  // Round up to ensure we cover
          const actualQtyToSell = Math.min(qtyToSell, qty)

          newHoldings[id] = qty - actualQtyToSell
          totalLiquidated += actualQtyToSell * price

          // Clean up zero holdings
          if (newHoldings[id] <= 0) {
            delete newHoldings[id]
          }
        })

        // Any excess from rounding goes back to cash
        newCash = totalLiquidated - shortfall
        finalHeadline = `${result.headline} (Assets liquidated to cover penalty)`
      }
    } else if (result.cashChange) {
      // Standard cash change (non-liquidation encounters)
      newCash = Math.max(0, cash + result.cashChange)
    }

    // Check for game over conditions
    if (result.gameOver) {
      const { day, gameDuration } = get()
      const finalNetWorth = get().getNetWorth()
      saveGameResult(false, finalNetWorth, day, gameDuration, result.gameOverReason || 'BANKRUPT', get().isLoggedIn, get().isUsingProTrial)
      set({
        cash: Math.round(newCash * 100) / 100,
        holdings: newHoldings,
        encounterState: newEncounterState,
        pendingEncounter: null,
        queuedStartupOffer: null,
        isUsingProTrial: false,
        screen: 'gameover',
        gameOverReason: result.gameOverReason || 'UNKNOWN',
        message: finalHeadline,
      })
      return
    }

    // Clear encounter and continue with the day
    set({
      cash: Math.round(newCash * 100) / 100,
      holdings: newHoldings,
      encounterState: newEncounterState,
      pendingEncounter: null,
      message: finalHeadline,
    })

    // Now advance the day normally
    get().nextDay()

    // After nextDay, restore any queued startup offer (it will now show)
    // Note: nextDay may have generated a new startup offer, so only restore if none exists
    const currentState = get()
    if (queuedStartupOffer && !currentState.pendingStartupOffer) {
      set({ pendingStartupOffer: queuedStartupOffer })
    }

    // Clear queued offer
    set({ queuedStartupOffer: null })
  },

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  getNetWorth: () => {
    const { cash, holdings, prices, activeInvestments, ownedLifestyle, lifestylePrices, leveragedPositions, shortPositions } = get()

    // Portfolio value (regular holdings)
    let portfolio = 0
    Object.entries(holdings).forEach(([id, qty]) => {
      portfolio += (prices[id] || 0) * qty
    })

    // Leveraged positions: equity = currentPrice × qty - debt
    const leveragedValue = leveragedPositions.reduce((sum, pos) => {
      const currentPrice = prices[pos.assetId] || 0
      const positionValue = currentPrice * pos.qty
      return sum + (positionValue - pos.debtAmount)
    }, 0)

    // Short positions: liability = currentPrice × qty (fluctuates with price)
    // Player owes shares back at current market price
    const shortLiability = shortPositions.reduce((sum, pos) => {
      const currentPrice = prices[pos.assetId] || 0
      return sum + (currentPrice * pos.qty)
    }, 0)

    // Include active startup investments at face value
    const startupValue = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    // Include lifestyle assets at current market value
    const lifestyleValue = ownedLifestyle.reduce((sum, owned) => {
      return sum + (lifestylePrices[owned.assetId] || 0)
    }, 0)

    // Net worth = cash + portfolio + leveragedEquity + startups + lifestyle - shortLiability
    // Note: shortPositions added to cash when opened, so we subtract liability
    return Math.round((cash + portfolio + leveragedValue + startupValue + lifestyleValue - shortLiability) * 100) / 100
  },

  getPortfolioValue: () => {
    const { holdings, prices, activeInvestments, ownedLifestyle, lifestylePrices } = get()
    let total = 0
    Object.entries(holdings).forEach(([id, qty]) => {
      total += (prices[id] || 0) * qty
    })
    // Include active startup investments at face value
    const startupValue = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    // Include lifestyle assets at current market value
    const lifestyleValue = ownedLifestyle.reduce((sum, owned) => {
      return sum + (lifestylePrices[owned.assetId] || 0)
    }, 0)
    return total + startupValue + lifestyleValue
  },

  getPriceChange: (id: string) => {
    const { prices, prevPrices } = get()
    const curr = prices[id]
    const prev = prevPrices[id]
    if (!prev) return 0
    return ((curr - prev) / prev) * 100
  },

  getPortfolioChange: () => {
    const { holdings, prices } = get()
    const portfolioValue = get().getPortfolioValue()
    if (portfolioValue === 0) return 0

    let weightedChange = 0
    Object.entries(holdings).forEach(([id, qty]) => {
      if (qty > 0) {
        const currentValue = (prices[id] || 0) * qty
        const weight = currentValue / portfolioValue
        const priceChange = get().getInvestmentChange(id)
        weightedChange += weight * priceChange
      }
    })
    return weightedChange
  },

  // Get P/L % for an asset based on cost basis
  getInvestmentChange: (id: string) => {
    const { costBasis, prices } = get()
    const basis = costBasis[id]
    if (!basis || basis.totalQty === 0) return 0

    const avgCost = basis.totalCost / basis.totalQty
    const currentPrice = prices[id] || 0
    if (avgCost === 0) return 0

    return ((currentPrice - avgCost) / avgCost) * 100
  },

  // Get average purchase price for an asset
  getAvgCost: (id: string) => {
    const { costBasis } = get()
    const basis = costBasis[id]
    if (!basis || basis.totalQty === 0) return 0
    return basis.totalCost / basis.totalQty
  },

  // Get total portfolio change from Day 1 (initial net worth)
  getTotalPortfolioChange: () => {
    const { initialNetWorth } = get()
    const currentNetWorth = get().getNetWorth()
    if (initialNetWorth === 0) return 0
    return ((currentNetWorth - initialNetWorth) / initialNetWorth) * 100
  },
})
