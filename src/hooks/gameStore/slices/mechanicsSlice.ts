/**
 * Mechanics Slice
 *
 * Handles all game state and mechanics: prices, holdings, events, trading, etc.
 * This is the core game engine containing the game loop (nextDay), trading,
 * and all game-related computations.
 */

import type { MechanicsSliceCreator } from '../types'
import { ASSETS } from '@/lib/game/assets'
import { EVENTS, CATEGORY_WEIGHTS, QUIET_NEWS, LIFESTYLE_EFFECTS, expandLifestyleEffects, rollForPEExit } from '@/lib/game/events'
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
  OwnedLifestyleItem,
  PEExitOffer,
  StrategyId,
  StrategyTier,
  ActiveStrategy,
  PolicyId,
  MarketEvent,
  ActiveDestabilization,
  DestabilizationTargetId,
  InvestmentResultEvent,
  MilestoneCelebrationEvent,
  CelebrationEvent,
} from '@/lib/game/types'
import {
  STRATEGIES,
  POLICIES,
  POLICY_PUSH_CONFIG,
  DESTABILIZATION_TARGETS,
  calculateTotalDailyCost,
  getActiveTier,
  canAffordStrategy as checkCanAffordStrategy,
  meetsNetWorthGate,
  canUseAbility,
  getDestabilizationTarget,
} from '@/lib/game/strategies'
import { getStrategyUnlocks } from '@/lib/game/lifestyleAssets'
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
import { callIncrementGamesPlayed, callRecordGameEnd } from '@/lib/game/authBridge'
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
  selectOutcomeWithBonus,
  getRandomDuration,
} from '../helpers'

// Helper to record game completion to localStorage and Supabase
function saveGameResult(
  isWin: boolean,
  finalNetWorth: number,
  daysSurvived: number,
  gameDuration: GameDuration,
  gameOverReason?: string,
  isLoggedIn?: boolean
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
  startupOfferCounts: { angel: 0, vc: 0 },
  lastStartupOfferDay: null,

  // Lifestyle
  ownedLifestyle: [],
  lifestylePrices: {},
  activePEExitOffer: null,

  // Milestones
  hasReached1M: false,
  reachedMilestones: [],
  activeMilestone: null,
  milestonePhase: 'idle',

  // Celebration queue (investment results + milestones)
  celebrationQueue: [],
  activeCelebration: null,
  isCelebrationDay: false,

  // Gossip & encounters
  gossipState: DEFAULT_GOSSIP_STATE,
  encounterState: DEFAULT_ENCOUNTER_STATE,
  pendingEncounter: null,
  pendingLiquidation: null,

  // UI state
  selectedAsset: null,
  buyQty: 1,
  showPortfolio: false,

  // Feedback state
  activeSellToast: null,
  activeBuyMessage: null,
  activeInvestmentBuyMessage: null,
  activeInvestmentResultToast: null,
  activeErrorMessage: null,

  // Settings & achievements
  showSettings: false,
  pendingAchievement: null,

  // Strategies
  activeStrategies: [],
  scheduledNextEvent: null,
  plantedBoostActive: null,
  queuedPolicyPush: null,
  activePolicies: [],
  policyPushAttempts: 0,
  lastPolicyPushDay: null,
  activeDestabilization: null,
  showStrategiesPanel: false,
  strategyCostMessage: null,

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

    // Determine effective tier for limit checks
    const effectiveTier = storeUserTier === 'pro' ? 'pro' : 'free'

    // Check game limits based on user state:
    // - Pro users: unlimited
    // - Registered free users (logged in): 3 games/day
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

    // Free users can only play 30-day mode
    // Use store's selectedDuration if available, otherwise localStorage
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
      startupOfferCounts: { angel: 0, vc: 0 },
      lastStartupOfferDay: null,
      ownedLifestyle: [],
      lifestylePrices,
      activeEscalations,
      hasReached1M: false,
      reachedMilestones: [],
      activeMilestone: null,
      milestonePhase: 'idle',
      // Reset celebration queue
      celebrationQueue: [],
      activeCelebration: null,
      isCelebrationDay: false,
      activeStories: [],
      usedStoryIds: [],
      gossipState: DEFAULT_GOSSIP_STATE,
      encounterState: DEFAULT_ENCOUNTER_STATE,
      pendingEncounter: null,
      pendingLiquidation: null,
      queuedStartupOffer: null,
      assetMoods: [],
      usedFlavorHeadlines: [],
      // Reset strategies
      activeStrategies: [],
      scheduledNextEvent: null,
      plantedBoostActive: null,
      queuedPolicyPush: null,
      activePolicies: [],
      policyPushAttempts: 0,
      lastPolicyPushDay: null,
      activeDestabilization: null,
      showStrategiesPanel: false,
      strategyCostMessage: null,
      userTier: effectiveTier,
      gamesRemaining: remainingAfterStart,
      limitType,
      showDailyLimitModal: false,
      showAnonymousLimitModal: false,
    })
  },

  nextDay: () => {
    const { prices, priceHistory, newsHistory, day, cash, holdings, activeChains, usedChainIds, activeInvestments, usedStartupIds, ownedLifestyle, lifestylePrices, activePEExitOffer, activeEscalations, hasReached1M, reachedMilestones, activeStories, usedStoryIds, gossipState, assetMoods, usedFlavorHeadlines, activeStrategies, plantedBoostActive, activePolicies, leveragedPositions, shortPositions } = get()
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

    // ===========================================================================
    // STEP 0: STRATEGY DAILY COSTS (processed BEFORE any income)
    // ===========================================================================
    const totalStrategyCost = calculateTotalDailyCost(activeStrategies)
    let newStrategyCostMessage: string | null = null

    if (totalStrategyCost > 0) {
      cashChange -= totalStrategyCost
      newStrategyCostMessage = `-$${totalStrategyCost.toLocaleString()} (${activeStrategies.length} active)`
      todayNewsItems.push({
        headline: `STRATEGY COSTS: -$${totalStrategyCost.toLocaleString()}`,
        effects: {},
        labelType: 'none'
      })
    }

    // Calculate if we can afford tomorrow's costs (for warning)
    const projectedCash = cash + cashChange
    const canAffordTomorrow = projectedCash >= totalStrategyCost
    if (activeStrategies.length > 0 && !canAffordTomorrow && projectedCash > 0) {
      todayNewsItems.push({
        headline: `⚠️ WARNING: Low cash - strategy costs may bankrupt you tomorrow!`,
        effects: {},
        labelType: 'none'
      })
    }

    // 0a. Process lifestyle asset income/costs
    let propertyIncome = 0
    let peReturns = 0
    let hasMarketNews = false // Track if we generated actual market news

    ownedLifestyle.forEach(owned => {
      const asset = LIFESTYLE_ASSETS.find(a => a.id === owned.assetId)
      if (asset) {
        // Properties and PE use % of PURCHASE price
        let dailyCashFlow = owned.purchasePrice * asset.dailyReturn

        // Properties: floor at 0% (never negative income)
        if (asset.category === 'property') {
          dailyCashFlow = Math.max(0, dailyCashFlow)
          propertyIncome += dailyCashFlow
        } else if (asset.category === 'private_equity') {
          // PE: can go negative during bad conditions (future enhancement)
          peReturns += dailyCashFlow
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
    // 0a2. PE FAILURE CHECK - high-risk PE investments can fail completely
    // NOTE: PE RETURNS news is generated AFTER this check to avoid showing phantom income
    const failedPEThisDay: string[] = []
    let updatedOwnedLifestyle = [...ownedLifestyle]

    ownedLifestyle.forEach(owned => {
      const asset = LIFESTYLE_ASSETS.find(a => a.id === owned.assetId)
      if (asset?.category === 'private_equity' && asset.failureChancePerDay) {
        if (Math.random() < asset.failureChancePerDay) {
          failedPEThisDay.push(owned.assetId)
        }
      }
    })

    // Process PE failures - 100% total loss, dramatic news
    if (failedPEThisDay.length > 0) {
      failedPEThisDay.forEach(assetId => {
        const asset = LIFESTYLE_ASSETS.find(a => a.id === assetId)
        const owned = ownedLifestyle.find(o => o.assetId === assetId)
        if (asset && owned) {
          // CRITICAL FIX: Deduct phantom income from failed asset
          // (income was added earlier but asset failed same day)
          const failedIncome = owned.purchasePrice * asset.dailyReturn
          cashChange -= failedIncome
          peReturns -= failedIncome

          // Dramatic failure news with loss amount
          const lossAmount = owned.purchasePrice
          const formattedLoss = lossAmount >= 1_000_000_000
            ? `$${(lossAmount / 1_000_000_000).toFixed(1)}B`
            : lossAmount >= 1_000_000
              ? `$${(lossAmount / 1_000_000).toFixed(1)}M`
              : `$${Math.round(lossAmount).toLocaleString()}`
          todayNewsItems.push({
            headline: `💀 ${asset.name.toUpperCase()} COLLAPSES - ${formattedLoss} LOST`,
            effects: {},
            labelType: 'breaking'
          })
        }
      })
      // Remove failed assets from portfolio - NO salvage value (100% loss)
      updatedOwnedLifestyle = updatedOwnedLifestyle.filter(o => !failedPEThisDay.includes(o.assetId))
    }

    // Generate PE RETURNS news AFTER failure check (shows actual income, not phantom)
    if (peReturns > 0) {
      todayNewsItems.push({
        headline: `PE RETURNS: +$${Math.round(peReturns).toLocaleString()}`,
        effects: {},
        labelType: 'none'
      })
    }

    // 0a3. PE EXIT OFFER CHECK - Acquisition or IPO opportunities
    // Only check if no current offer is pending (one at a time)
    let newPEExitOffer: PEExitOffer | null = activePEExitOffer

    // If existing offer expired, clear it
    if (newPEExitOffer && newPEExitOffer.expiresDay <= newDay) {
      newPEExitOffer = null
    }

    // Only roll for new offers if no pending offer
    if (!newPEExitOffer) {
      // FIX: Shuffle PE assets to avoid order-dependent bias
      // (previously first asset in array had disproportionate exit chances)
      const peAssets = updatedOwnedLifestyle.filter(o => {
        const asset = LIFESTYLE_ASSETS.find(a => a.id === o.assetId)
        return asset?.category === 'private_equity'
      })
      const shuffledPE = [...peAssets].sort(() => Math.random() - 0.5)

      // Check each owned PE asset for exit opportunity
      for (const owned of shuffledPE) {
        const asset = LIFESTYLE_ASSETS.find(a => a.id === owned.assetId)
        if (!asset) continue

        const exitRoll = rollForPEExit(asset.riskTier)
        if (exitRoll) {
          const offerAmount = Math.round(owned.purchasePrice * exitRoll.multiplier)
          newPEExitOffer = {
            assetId: owned.assetId,
            type: exitRoll.type,
            multiplier: exitRoll.multiplier,
            offerAmount,
            expiresDay: newDay + 2, // 2 days to decide
          }
          // Add news about the offer
          const headline = exitRoll.headline.replace('{ASSET}', asset.name.toUpperCase())
          todayNewsItems.push({
            headline: exitRoll.type === 'ipo' ? `🚀 ${headline}` : `💰 ${headline}`,
            effects: {},
            labelType: 'breaking'
          })
          break // Only one offer at a time
        }
      }
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
        let e = selectRandomEvent(updatedEscalations, newDay, blockedCategories, updatedAssetMoods)

        // ===========================================================================
        // LOBBYING BIAS: Re-roll events that hurt player's holdings
        // ===========================================================================
        const lobbyingTier = getActiveTier('lobbying', activeStrategies)
        if (e && lobbyingTier !== 'off') {
          const favorBonus = lobbyingTier === 'elite' ? 0.35 : 0.15

          // Check if event is net-negative for player's holdings
          let netEffectOnHoldings = 0
          Object.entries(e.effects).forEach(([assetId, effect]) => {
            if (holdings[assetId] && holdings[assetId] > 0) {
              netEffectOnHoldings += effect * holdings[assetId]
            }
          })

          // If event hurts holdings, chance to re-roll for a better one
          if (netEffectOnHoldings < -0.05 && Math.random() < favorBonus) {
            // Try to find a more favorable event (up to 3 attempts)
            for (let i = 0; i < 3; i++) {
              const altEvent = selectRandomEvent(updatedEscalations, newDay, blockedCategories, updatedAssetMoods)
              if (altEvent) {
                let altNetEffect = 0
                Object.entries(altEvent.effects).forEach(([assetId, effect]) => {
                  if (holdings[assetId] && holdings[assetId] > 0) {
                    altNetEffect += effect * holdings[assetId]
                  }
                })
                if (altNetEffect > netEffectOnHoldings) {
                  e = altEvent
                  break
                }
              }
            }
          }

          // Check active policy bonus
          activePolicies.forEach(policyId => {
            const policy = POLICIES.find(p => p.id === policyId)
            if (policy?.effect.category === e?.category && policy?.effect.positiveBoost) {
              // Policy boosts this category - extra chance for positive effect
              if (Math.random() < policy.effect.positiveBoost) {
                // Flip negative effects to positive for this category
                Object.entries(e!.effects).forEach(([assetId, effect]) => {
                  if (effect < 0) {
                    effects[assetId] = (effects[assetId] || 0) + Math.abs(effect) * 0.5
                  }
                })
              }
            }
          })
        }

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

    // Collect celebration events for investment results
    const investmentCelebrationEvents: InvestmentResultEvent[] = []

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

        // Create celebration event for this investment result
        investmentCelebrationEvents.push({
          type: 'investment_result',
          startupName: inv.startupName,
          investedAmount: inv.amount,
          returnAmount: payout,
          multiplier: inv.outcome.multiplier,
          profitLoss,
          profitLossPct,
          isProfit,
          headline: inv.outcome.headline,
        })

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

    // ===========================================================================
    // STRATEGY EFFECT PROCESSING (before price calculation)
    // ===========================================================================

    // 5a. Media Control damage reduction - reduce negative effects on held assets
    const mediaControlTier = getActiveTier('mediaControl', activeStrategies)
    if (mediaControlTier !== 'off') {
      const reductionFactor = mediaControlTier === 'elite' ? 0.40 : 0.20

      // Check for active Spin ability (additional 50% reduction this turn)
      const mediaControl = activeStrategies.find(s => s.strategyId === 'mediaControl')
      const spinActiveToday = mediaControl?.abilitiesUsed.spin === newDay

      Object.entries(effects).forEach(([assetId, effect]) => {
        // Only reduce negative effects on assets the player holds
        if (effect < 0 && holdings[assetId] && holdings[assetId] > 0) {
          let reduction = reductionFactor
          if (spinActiveToday) {
            reduction = 0.5 + (reductionFactor * 0.5) // Spin halves remaining damage
          }
          effects[assetId] = effect * (1 - reduction)
        }
      })

      if (spinActiveToday) {
        todayNewsItems.push({
          headline: `📺 MEDIA SPIN: Negative coverage softened`,
          effects: {},
          labelType: 'none'
        })
      }
    }

    // 5b. Process Lobbying active policies (additional positive event chance)
    activePolicies.forEach(policyId => {
      const policy = POLICIES.find(p => p.id === policyId)
      if (policy?.effect.globalNegativeReduction) {
        // Market Manipulation policy - reduce all negative effects
        Object.entries(effects).forEach(([assetId, effect]) => {
          if (effect < 0) {
            effects[assetId] = effect * (1 - policy.effect.globalNegativeReduction!)
          }
        })
      }
    })

    // 5c. Process Plant effect (Media Control Elite)
    let newPlantedBoostActive = plantedBoostActive
    if (plantedBoostActive && plantedBoostActive.appliedDay === newDay) {
      const asset = ASSETS.find(a => a.id === plantedBoostActive.assetId)
      if (asset) {
        if (plantedBoostActive.didBackfire) {
          // Backfire: negative effect instead
          effects[plantedBoostActive.assetId] = (effects[plantedBoostActive.assetId] || 0) - 0.20
          todayNewsItems.push({
            headline: `📰 PLANTED STORY BACKFIRES - ${asset.name.toUpperCase()} investigation launched`,
            effects: { [plantedBoostActive.assetId]: -0.20 },
            labelType: 'breaking'
          })
        } else {
          effects[plantedBoostActive.assetId] = (effects[plantedBoostActive.assetId] || 0) + plantedBoostActive.boostAmount
          todayNewsItems.push({
            headline: `📰 POSITIVE COVERAGE: ${asset.name.toUpperCase()} gets glowing press`,
            effects: { [plantedBoostActive.assetId]: plantedBoostActive.boostAmount },
            labelType: 'news'
          })
        }
      }
      newPlantedBoostActive = null // Clear after processing
    }

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
    // Include leveraged positions (value minus debt)
    let leveragedValue = 0
    leveragedPositions.forEach(pos => {
      const currentPrice = newPrices[pos.assetId] || 0
      const positionValue = currentPrice * pos.qty
      leveragedValue += (positionValue - pos.debtAmount)
    })
    // Include short position liabilities
    let shortLiability = 0
    shortPositions.forEach(pos => {
      const currentPrice = newPrices[pos.assetId] || 0
      shortLiability += currentPrice * pos.qty
    })
    const currentCash = cash + cashChange
    const nw = Math.round((currentCash + portfolioValue + startupValue + lifestyleValue + leveragedValue - shortLiability) * 100) / 100

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
    let milestoneCelebrationEvent: MilestoneCelebrationEvent | null = null

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

      // Create milestone celebration event for the overlay
      milestoneCelebrationEvent = {
        type: 'milestone',
        id: milestone.id,
        title: milestone.title,
        tier: milestone.tier,
        scarcityMessage: milestone.scarcityMessage,
        netWorth: nw,
      }
    }

    // Build celebration queue: investments only (milestones use NewsPanel takeover instead)
    const newCelebrationQueue: CelebrationEvent[] = [
      ...investmentCelebrationEvents,
    ]
    const hasCelebrations = newCelebrationQueue.length > 0
    // Pop first celebration as active (if any)
    const newActiveCelebration = newCelebrationQueue.length > 0 ? newCelebrationQueue.shift()! : null

    let newStartupOffer: typeof get extends () => { pendingStartupOffer: infer T } ? T : never = null

    // Get current tracking state for caps and cooldowns
    const { startupOfferCounts, lastStartupOfferDay } = get()
    let updatedOfferCounts = { ...startupOfferCounts }

    // Only offer startups up to gameDuration - 6 (max duration is 6 days, must resolve by end)
    // IMPORTANT: Suppress new startup offers on celebration days - let the player savor their win!
    // Note: gameLength is already defined earlier in this function
    if (!hasCelebrations && newDay <= gameLength - 6) {

      // ========== COOLDOWN CHECK ==========
      // Minimum 8 days between any startup offers
      const cooldownDays = 8
      const daysSinceLastOffer = lastStartupOfferDay ? newDay - lastStartupOfferDay : Infinity
      const cooldownPassed = daysSinceLastOffer >= cooldownDays

      // ========== NET WORTH GATES ==========
      const angelNetWorthGate = 250_000
      const vcNetWorthGate = 1_000_000

      // ========== HARD CAPS (base) ==========
      // Private Jet can increase these caps
      const privateJetTier = getActiveTier('privateJet', activeStrategies)

      let angelCap = 2  // Base: 2 Angel offers per game
      let vcCap = 2     // Base: 2 VC offers per game

      if (privateJetTier === 'active') {
        angelCap = 3  // +1 Angel cap
      } else if (privateJetTier === 'elite') {
        angelCap = 3  // +1 Angel cap
        vcCap = 3     // +1 VC cap
      }

      // ========== BASE PROBABILITIES ==========
      // Much lower than before for scarcity (was 8% Angel, 15% VC)
      const angelBaseChance = 0.025  // 2.5%
      const vcBaseChance = 0.04      // 4%

      // ========== ATTEMPT OFFER GENERATION ==========
      if (cooldownPassed) {
        let selectedTier: 'angel' | 'vc' | null = null

        // Angel offer check (requires $250K+ net worth)
        if (nw >= angelNetWorthGate && updatedOfferCounts.angel < angelCap) {
          if (Math.random() < angelBaseChance) {
            const angelOffer = selectRandomStartup('angel', updatedUsedStartupIds)
            if (angelOffer) {
              newStartupOffer = angelOffer
              selectedTier = 'angel'
            }
          }
        }

        // VC offer check (requires $1M+ net worth, overrides angel if both trigger)
        if (nw >= vcNetWorthGate && updatedOfferCounts.vc < vcCap) {
          if (Math.random() < vcBaseChance) {
            const vcOffer = selectRandomStartup('vc', updatedUsedStartupIds)
            if (vcOffer) {
              newStartupOffer = vcOffer
              selectedTier = 'vc'
            }
          }
        }

        // Update count for whichever tier was actually selected
        if (selectedTier === 'angel') {
          updatedOfferCounts.angel++
        } else if (selectedTier === 'vc') {
          updatedOfferCounts.vc++
        }
      }
    }

    // ===========================================================================
    // DESTABILIZATION EFFECTS: Boost commodities from targeted region
    // ===========================================================================
    const { activeDestabilization } = get()
    const destabTier = getActiveTier('destabilization', activeStrategies)

    if (activeDestabilization && destabTier !== 'off') {
      const target = getDestabilizationTarget(activeDestabilization.targetId)
      if (target) {
        const boost = destabTier === 'elite' ? 0.40 : 0.20

        // Boost affected asset prices
        target.affectedAssets.forEach(assetId => {
          if (newPrices[assetId]) {
            const extraReturn = newPrices[assetId] * boost * (Math.random() * 0.5 + 0.5)
            newPrices[assetId] += extraReturn
          }
        })

        // 10% daily chance to trigger geopolitical event news
        if (Math.random() < 0.10) {
          todayNewsItems.push({
            headline: `💀 INSTABILITY IN ${target.name.toUpperCase()}: Markets react`,
            effects: Object.fromEntries(target.affectedAssets.map(a => [a, 0.05])),
            labelType: 'none'
          })
        }
      }
    }

    // 8. Update state
    const headlines = todayNewsItems.map(n => n.headline)
    set({
      prevPrices: { ...prices },
      prices: newPrices,
      priceHistory: newPriceHistory,
      lifestylePrices: newLifestylePrices,
      ownedLifestyle: updatedOwnedLifestyle,
      activePEExitOffer: newPEExitOffer,
      event: null,
      day: newDay,
      cash: Math.round(currentCash * 100) / 100,
      message: '',
      activeSellToast: null,
      activeBuyMessage: null,
      activeInvestmentBuyMessage: null,
      // Use overlay for investment results when there are celebrations, otherwise use toast
      activeInvestmentResultToast: hasCelebrations ? null : mostSignificantInvestmentResult,
      activeErrorMessage: null,
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
      startupOfferCounts: updatedOfferCounts,
      lastStartupOfferDay: newStartupOffer ? newDay : lastStartupOfferDay,
      activeEscalations: updatedEscalations,
      hasReached1M: newHasReached1M,
      reachedMilestones: newReachedMilestones,
      activeMilestone: newActiveMilestone,
      milestonePhase: newMilestonePhase,
      // Celebration queue (investment results + milestones shown as overlays)
      celebrationQueue: newCelebrationQueue,
      activeCelebration: newActiveCelebration,
      isCelebrationDay: hasCelebrations,
      activeStories: updatedStories,
      usedStoryIds: updatedUsedStoryIds,
      gossipState: updatedGossipState,
      assetMoods: updatedAssetMoods,
      usedFlavorHeadlines: updatedFlavorHeadlines,
      // Strategy state updates
      strategyCostMessage: newStrategyCostMessage,
      plantedBoostActive: newPlantedBoostActive,
    })

    // 9. Check win/lose conditions
    // Re-calculate net worth after all updates (includes margin positions)
    const finalNetWorth = get().getNetWorth()
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
      saveGameResult(false, finalNetWorth, newDay - 1, gameDuration, gameOverReason, get().isLoggedIn)
      set({ screen: 'gameover', gameOverReason })
    } else if (finalNetWorth <= 0) {
      // Regular bankruptcy (net worth exactly 0)
      saveGameResult(false, finalNetWorth, newDay - 1, gameDuration, 'BANKRUPT', get().isLoggedIn)
      set({ screen: 'gameover', gameOverReason: 'BANKRUPT' })
    } else if (newDay > gameDuration) {
      // Player survived the full duration - WIN!
      saveGameResult(true, finalNetWorth, gameDuration, gameDuration, undefined, get().isLoggedIn)
      set({ screen: 'win' })
    }
  },

  // Called when user clicks "Next Day" - checks for encounter before advancing
  triggerNextDay: () => {
    const { day, cash, encounterState, pendingStartupOffer, gameDuration, isCelebrationDay } = get()
    const netWorth = get().getNetWorth()

    // Skip encounter check on celebration days - let the player enjoy their moment!
    if (isCelebrationDay) {
      get().nextDay()
      return
    }

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
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
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
    const { cash, holdings, prices, costBasis } = get()
    const owned = holdings[assetId] || 0

    if (qty > owned || qty < 1) {
      set({ activeErrorMessage: 'NOTHING TO SELL' })
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
    const absValue = Math.abs(profitLoss)
    let plFormatted: string
    if (absValue >= 1_000_000_000) {
      plFormatted = `${plSign}$${(profitLoss / 1_000_000_000).toFixed(1)}B`
    } else if (absValue >= 1_000_000) {
      plFormatted = `${plSign}$${(profitLoss / 1_000_000).toFixed(1)}M`
    } else if (absValue >= 1_000) {
      plFormatted = `${plSign}$${(profitLoss / 1_000).toFixed(1)}K`
    } else {
      plFormatted = `${plSign}$${Math.round(profitLoss)}`
    }
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
      set({ activeErrorMessage: 'NOT ENOUGH CASH FOR MARGIN' })
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
      set({ activeErrorMessage: 'NOT ENOUGH CASH TO COVER' })
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
    const { cash, day, pendingStartupOffer, activeInvestments, usedStartupIds, activeStrategies } = get()

    if (!pendingStartupOffer) return
    if (amount > cash) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

    // Check Private Jet tier for outcome improvement
    const privateJetTier = getActiveTier('privateJet', activeStrategies)
    let outcomeBonus = 0
    if (privateJetTier === 'elite') {
      outcomeBonus = 0.10  // 10% reduction in failure rate
    } else if (privateJetTier === 'active') {
      outcomeBonus = 0.05  // 5% reduction in failure rate
    }

    // Pre-determine the outcome at investment time (with Private Jet bonus if applicable)
    const outcome = selectOutcomeWithBonus(pendingStartupOffer, outcomeBonus)
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
    const { pendingStartupOffer, usedStartupIds } = get()
    if (pendingStartupOffer) {
      // Add dismissed startup to usedStartupIds so it doesn't reappear
      set({
        pendingStartupOffer: null,
        usedStartupIds: [...usedStartupIds, pendingStartupOffer.id]
      })
    } else {
      set({ pendingStartupOffer: null })
    }
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
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

    // Check if already owned
    if (ownedLifestyle.some(o => o.assetId === assetId)) {
      set({ activeErrorMessage: 'ALREADY OWNED' })
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
      set({ activeErrorMessage: 'NOT OWNED' })
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

  // PE Exit Offer Actions
  acceptPEExitOffer: () => {
    const { cash, ownedLifestyle, activePEExitOffer } = get()
    if (!activePEExitOffer) return

    const asset = LIFESTYLE_ASSETS.find(a => a.id === activePEExitOffer.assetId)
    const owned = ownedLifestyle.find(o => o.assetId === activePEExitOffer.assetId)
    if (!asset || !owned) return

    const profitLoss = activePEExitOffer.offerAmount - owned.purchasePrice
    const profitLossPct = ((activePEExitOffer.offerAmount / owned.purchasePrice) - 1) * 100

    const exitType = activePEExitOffer.type === 'ipo' ? 'IPO' : 'ACQUISITION'
    const emoji = activePEExitOffer.type === 'ipo' ? '🚀' : '💰'
    const plSign = profitLoss >= 0 ? '+' : ''
    const plFormatted = `${plSign}$${Math.abs(profitLoss).toLocaleString()}`
    const pctFormatted = `${profitLossPct >= 0 ? '+' : ''}${profitLossPct.toFixed(0)}%`
    const saleMessage = `${emoji} ${exitType}: ${asset.name} - ${plFormatted} (${pctFormatted})`

    set({
      cash: Math.round((cash + activePEExitOffer.offerAmount) * 100) / 100,
      ownedLifestyle: ownedLifestyle.filter(o => o.assetId !== activePEExitOffer.assetId),
      activePEExitOffer: null,
      activeSellToast: {
        message: saleMessage,
        profitLossPct,
        isProfit: profitLoss >= 0,
      },
    })
  },

  declinePEExitOffer: () => {
    set({ activePEExitOffer: null })
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
  clearErrorMessage: () => set({ activeErrorMessage: null }),
  clearPendingAchievement: () => set({ pendingAchievement: null }),
  triggerAchievement: (id: string) => set({ pendingAchievement: id }),

  // ============================================================================
  // MILESTONE ACTIONS
  // ============================================================================

  clearMilestone: () => set({ milestonePhase: 'idle', activeMilestone: null }),

  // ============================================================================
  // CELEBRATION ACTIONS
  // ============================================================================

  dismissCelebration: () => {
    const { celebrationQueue } = get()

    if (celebrationQueue.length > 0) {
      // Pop next celebration from queue
      const [next, ...rest] = celebrationQueue
      set({
        celebrationQueue: rest,
        activeCelebration: next,
      })
    } else {
      // Queue empty - clear celebration state
      set({
        activeCelebration: null,
        isCelebrationDay: false,
      })
    }
  },

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
        // Need to liquidate assets - check if player has enough
        const shortfall = amountNeeded - cash

        // Get lifestyle assets for potential liquidation
        const { ownedLifestyle, lifestylePrices } = get()

        // Calculate total liquidatable value (holdings + lifestyle assets)
        let holdingsValue = 0
        Object.entries(holdings).forEach(([id, qty]) => {
          holdingsValue += (prices[id] || 0) * qty
        })

        let lifestyleValue = 0
        ownedLifestyle.forEach(owned => {
          lifestyleValue += lifestylePrices[owned.assetId] || 0
        })

        const totalLiquidatableValue = holdingsValue + lifestyleValue

        if (totalLiquidatableValue < shortfall) {
          // Can't cover the penalty even with all assets → Bankruptcy
          const { day, gameDuration } = get()
          saveGameResult(false, 0, day, gameDuration, 'BANKRUPT', get().isLoggedIn)
          set({
            cash: 0,
            holdings: {},
            ownedLifestyle: [],
            encounterState: newEncounterState,
            pendingEncounter: null,
            pendingLiquidation: null,
            queuedStartupOffer: null,
            screen: 'gameover',
            gameOverReason: 'BANKRUPT',
            message: `${result.headline} — Assets seized, still couldn't cover the debt.`,
          })
          return
        }

        // Player can cover it - show liquidation selection UI
        const reason = encounterType === 'sec' ? 'sec' : 'divorce'
        set({
          pendingLiquidation: {
            amountNeeded: shortfall, // Only need to liquidate the shortfall
            reason: reason as 'sec' | 'divorce',
            headline: result.headline,
            encounterType,
            encounterState: newEncounterState,
          },
          pendingEncounter: null, // Clear the encounter popup
        })
        return // Wait for player to select assets
      }
    } else if (result.cashChange) {
      // Standard cash change (non-liquidation encounters)
      newCash = Math.max(0, cash + result.cashChange)
    }

    // Check for game over conditions
    if (result.gameOver) {
      const { day, gameDuration } = get()
      const finalNetWorth = get().getNetWorth()
      saveGameResult(false, finalNetWorth, day, gameDuration, result.gameOverReason || 'BANKRUPT', get().isLoggedIn)
      set({
        cash: Math.round(newCash * 100) / 100,
        holdings: newHoldings,
        encounterState: newEncounterState,
        pendingEncounter: null,
        queuedStartupOffer: null,
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
  // LIQUIDATION SELECTION (Player chooses which assets to sell)
  // ============================================================================

  confirmLiquidationSelection: (selectedAssets: Array<{ type: 'lifestyle' | 'trading'; id: string; currentValue: number; quantity: number }>) => {
    const { pendingLiquidation, cash, holdings, prices, ownedLifestyle, queuedStartupOffer } = get()

    if (!pendingLiquidation) return

    const { amountNeeded, headline, encounterState: newEncounterState } = pendingLiquidation

    // Calculate total value being liquidated
    let totalLiquidated = 0
    let newHoldings = { ...holdings }
    let newOwnedLifestyle = [...ownedLifestyle]

    // Process each selected asset
    selectedAssets.forEach(asset => {
      if (asset.type === 'lifestyle') {
        // Remove lifestyle asset
        newOwnedLifestyle = newOwnedLifestyle.filter(owned => owned.assetId !== asset.id)
        totalLiquidated += asset.currentValue
      } else {
        // Sell trading holdings
        const currentQty = newHoldings[asset.id] || 0
        const price = prices[asset.id] || 0
        const qtyToSell = Math.min(asset.quantity, currentQty)
        newHoldings[asset.id] = currentQty - qtyToSell
        totalLiquidated += qtyToSell * price

        if (newHoldings[asset.id] <= 0) {
          delete newHoldings[asset.id]
        }
      }
    })

    // Calculate new cash: current cash goes to penalty, excess from liquidation returns
    const newCash = Math.max(0, totalLiquidated - amountNeeded)
    const finalHeadline = `${headline} (Assets seized to cover penalty)`

    // Clear liquidation and update state
    set({
      cash: Math.round(newCash * 100) / 100,
      holdings: newHoldings,
      ownedLifestyle: newOwnedLifestyle,
      encounterState: newEncounterState,
      pendingLiquidation: null,
      message: finalHeadline,
    })

    // Advance the day normally
    get().nextDay()

    // Restore any queued startup offer
    const currentState = get()
    if (queuedStartupOffer && !currentState.pendingStartupOffer) {
      set({ pendingStartupOffer: queuedStartupOffer })
    }
    set({ queuedStartupOffer: null })
  },

  // ============================================================================
  // STRATEGY ACTIONS
  // ============================================================================

  activateStrategy: (strategyId: StrategyId, tier: 'active' | 'elite') => {
    const { cash, activeStrategies, day, ownedLifestyle } = get()
    const def = STRATEGIES[strategyId]
    const netWorth = get().getNetWorth()

    // Check PE ownership requirement (for ownership-gated strategies)
    if (def.unlockRequirement.type === 'pe_ownership') {
      const unlocks = getStrategyUnlocks(ownedLifestyle)
      const isUnlocked = strategyId === 'lobbying' ? unlocks.lobbying :
                         strategyId === 'mediaControl' ? unlocks.mediaControl :
                         strategyId === 'destabilization' ? unlocks.destabilization : true
      if (!isUnlocked) {
        set({ activeErrorMessage: `🔒 REQUIRES ${def.unlockRequirement.assetName?.toUpperCase()}` })
        return
      }
    }

    // Check net worth gate (only for non-ownership-gated strategies like Private Jet)
    if (def.netWorthGate[tier] > 0 && !meetsNetWorthGate(strategyId, tier, netWorth)) {
      set({ activeErrorMessage: `NEED ${tier === 'active' ? '$1M' : '$10M'} NET WORTH FOR ${tier.toUpperCase()}` })
      return
    }

    // Calculate upfront cost
    const currentTier = getActiveTier(strategyId, activeStrategies)
    let upfrontCost = def.tiers[tier].upfrontCost

    if (tier === 'elite' && currentTier === 'active') {
      // Upgrading from active - only pay elite upfront
      upfrontCost = def.tiers.elite.upfrontCost
    } else if (tier === 'elite' && currentTier === 'off') {
      // Direct to elite - pay both
      upfrontCost = def.tiers.active.upfrontCost + def.tiers.elite.upfrontCost
    }

    if (cash < upfrontCost) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH FOR STRATEGY' })
      return
    }

    const newStrategy: ActiveStrategy = {
      strategyId,
      tier,
      activatedDay: day,
      abilitiesUsed: {},
    }

    // Remove existing strategy of same type if upgrading
    const filteredStrategies = activeStrategies.filter(s => s.strategyId !== strategyId)

    set({
      cash: cash - upfrontCost,
      activeStrategies: [...filteredStrategies, newStrategy],
      activeBuyMessage: `${def.emoji} ${def.name.toUpperCase()} ${tier.toUpperCase()} ACTIVATED`,
    })
  },

  deactivateStrategy: (strategyId: StrategyId) => {
    const { activeStrategies } = get()
    const def = STRATEGIES[strategyId]

    set({
      activeStrategies: activeStrategies.filter(s => s.strategyId !== strategyId),
      activeBuyMessage: `${def.emoji} ${def.name.toUpperCase()} DEACTIVATED`,
    })
  },

  upgradeStrategy: (strategyId: StrategyId) => {
    const { activeStrategies } = get()
    const currentTier = getActiveTier(strategyId, activeStrategies)

    if (currentTier !== 'active') {
      set({ activeErrorMessage: 'STRATEGY MUST BE ACTIVE TO UPGRADE' })
      return
    }

    // Use activateStrategy to handle upgrade
    get().activateStrategy(strategyId, 'elite')
  },

  useSpin: () => {
    const { activeStrategies, day, todayNews } = get()
    const mediaControl = activeStrategies.find(s => s.strategyId === 'mediaControl')

    if (!mediaControl || mediaControl.tier !== 'elite') {
      set({ activeErrorMessage: 'REQUIRES MEDIA CONTROL ELITE' })
      return
    }

    if (mediaControl.abilitiesUsed.spin !== undefined) {
      set({ activeErrorMessage: 'SPIN ALREADY USED THIS GAME' })
      return
    }

    // Find the most recent negative news - effect will be applied via damage reduction
    // Mark as used
    const updated = activeStrategies.map(s =>
      s.strategyId === 'mediaControl'
        ? { ...s, abilitiesUsed: { ...s.abilitiesUsed, spin: day } }
        : s
    )

    set({
      activeStrategies: updated,
      activeBuyMessage: '📺 SPIN DEPLOYED - DAMAGE HALVED',
    })
  },

  usePlant: (assetId: string) => {
    const { activeStrategies, day } = get()
    const mediaControl = activeStrategies.find(s => s.strategyId === 'mediaControl')

    if (!mediaControl || mediaControl.tier !== 'elite') {
      set({ activeErrorMessage: 'REQUIRES MEDIA CONTROL ELITE' })
      return
    }

    if (mediaControl.abilitiesUsed.plant !== undefined) {
      set({ activeErrorMessage: 'PLANT ALREADY USED THIS GAME' })
      return
    }

    // 15% backfire chance
    const willBackfire = Math.random() < 0.15
    const boostAmount = 0.10 + Math.random() * 0.05 // 10-15%

    // Schedule the planted story for next day
    set({
      plantedBoostActive: {
        assetId,
        appliedDay: day + 1,
        didBackfire: willBackfire,
        boostAmount,
      },
    })

    // Mark as used
    const updated = activeStrategies.map(s =>
      s.strategyId === 'mediaControl'
        ? { ...s, abilitiesUsed: { ...s.abilitiesUsed, plant: day } }
        : s
    )

    set({
      activeStrategies: updated,
      activeBuyMessage: '📰 POSITIVE STORY PLANTED FOR TOMORROW',
    })
  },

  pushPolicy: (policyId: PolicyId) => {
    const { activeStrategies, day, activePolicies, cash, policyPushAttempts, lastPolicyPushDay } = get()
    const lobbying = activeStrategies.find(s => s.strategyId === 'lobbying')

    // 1. Must have Lobbying Elite
    if (!lobbying || lobbying.tier !== 'elite') {
      set({ activeErrorMessage: 'REQUIRES LOBBYING ELITE' })
      return
    }

    // 2. Check cooldown (15 days since last attempt)
    if (lastPolicyPushDay !== null && day - lastPolicyPushDay < POLICY_PUSH_CONFIG.cooldownDays) {
      const daysLeft = POLICY_PUSH_CONFIG.cooldownDays - (day - lastPolicyPushDay)
      set({ activeErrorMessage: `COOLDOWN: ${daysLeft} DAY${daysLeft > 1 ? 'S' : ''} REMAINING` })
      return
    }

    // 3. Get cost/success for current attempt count
    const config = POLICY_PUSH_CONFIG.getConfig(policyPushAttempts)

    // 4. Check affordability
    if (cash < config.cost) {
      set({ activeErrorMessage: `NEED $${config.cost.toLocaleString()} TO PUSH POLICY` })
      return
    }

    // 5. Validate policy exists and meets tier requirement
    const policy = POLICIES.find(p => p.id === policyId)
    if (!policy) return

    if (policy.requiredTier === 'elite' && lobbying.tier !== 'elite') {
      set({ activeErrorMessage: 'POLICY REQUIRES ELITE TIER' })
      return
    }

    // 6. Deduct cost
    const newCash = cash - config.cost

    // 7. Roll for success
    const roll = Math.random()
    const success = roll < config.successRate

    if (success) {
      set({
        cash: newCash,
        policyPushAttempts: policyPushAttempts + 1,
        lastPolicyPushDay: day,
        activePolicies: [...activePolicies, policyId],
        activeBuyMessage: `🏛️ ${policy.name.toUpperCase()} POLICY ENACTED!`,
      })
    } else {
      set({
        cash: newCash,
        policyPushAttempts: policyPushAttempts + 1,
        lastPolicyPushDay: day,
        activeErrorMessage: `🏛️ POLICY BLOCKED IN COMMITTEE (-$${config.cost.toLocaleString()})`,
      })
    }
  },

  setShowStrategiesPanel: (show: boolean) => {
    set({ showStrategiesPanel: show })
  },

  clearStrategyCostMessage: () => {
    set({ strategyCostMessage: null })
  },

  // Destabilization actions
  selectDestabilizationTarget: (targetId: DestabilizationTargetId) => {
    const { activeStrategies, day } = get()
    const destab = activeStrategies.find(s => s.strategyId === 'destabilization')

    if (!destab) {
      set({ activeErrorMessage: 'REQUIRES DESTABILIZATION STRATEGY' })
      return
    }

    const target = getDestabilizationTarget(targetId)
    if (!target) return

    set({
      activeDestabilization: {
        targetId,
        activatedDay: day,
      },
      activeBuyMessage: `💀 TARGETING ${target.name.toUpperCase()}`,
    })
  },

  executeCoup: () => {
    const { activeStrategies, activeDestabilization, prices, todayNews } = get()
    const destab = activeStrategies.find(s => s.strategyId === 'destabilization')

    if (!destab || destab.tier !== 'elite') {
      set({ activeErrorMessage: 'REQUIRES DESTABILIZATION ELITE' })
      return
    }

    if (destab.abilitiesUsed.coupUsed) {
      set({ activeErrorMessage: 'COUP ALREADY EXECUTED THIS GAME' })
      return
    }

    if (!activeDestabilization) {
      set({ activeErrorMessage: 'SELECT A TARGET REGION FIRST' })
      return
    }

    const target = getDestabilizationTarget(activeDestabilization.targetId)
    if (!target) {
      set({ activeErrorMessage: 'INVALID TARGET REGION' })
      return
    }

    // MAJOR MARKET SHOCK: Apply +50-80% spike to affected assets
    const coupBoost = 0.50 + Math.random() * 0.30
    const newPrices = { ...prices }

    target.affectedAssets.forEach(assetId => {
      if (newPrices[assetId]) {
        newPrices[assetId] = newPrices[assetId] * (1 + coupBoost)
      }
    })

    // Generate dramatic news headline
    const coupHeadlines = [
      `💀 COUP D'ÉTAT IN ${target.name.toUpperCase()} - MARKETS IN TURMOIL`,
      `💀 MILITARY TAKEOVER IN ${target.name.toUpperCase()} - COMMODITIES SPIKE`,
      `💀 REGIME CHANGE IN ${target.name.toUpperCase()} - CHAOS ERUPTS`,
    ]
    const headline = coupHeadlines[Math.floor(Math.random() * coupHeadlines.length)]

    // Mark coup as used
    const updated = activeStrategies.map(s =>
      s.strategyId === 'destabilization'
        ? { ...s, abilitiesUsed: { ...s.abilitiesUsed, coupUsed: true } }
        : s
    )

    set({
      activeStrategies: updated,
      prices: newPrices,
      todayNews: [...todayNews, {
        headline,
        effects: Object.fromEntries(target.affectedAssets.map(a => [a, coupBoost])),
        labelType: 'breaking' as const,
      }],
      activeBuyMessage: `💀 COUP EXECUTED - ${target.name.toUpperCase()} DESTABILIZED (+${Math.round(coupBoost * 100)}%)`,
    })
  },

  executeTargetedElimination: (sectorId: string) => {
    const { activeStrategies, prices, todayNews } = get()
    const destab = activeStrategies.find(s => s.strategyId === 'destabilization')

    if (!destab || destab.tier !== 'elite') {
      set({ activeErrorMessage: 'REQUIRES DESTABILIZATION ELITE' })
      return
    }

    if (destab.abilitiesUsed.eliminationUsed) {
      set({ activeErrorMessage: 'ELIMINATION ALREADY EXECUTED THIS GAME' })
      return
    }

    // Define sector targets with affected assets and headlines
    const ELIMINATION_SECTORS: Record<string, { assets: string[], headlines: string[] }> = {
      tech: {
        assets: ['nasdaq'],
        headlines: [
          '💀 TECH MOGUL DIES IN MYSTERIOUS ACCIDENT',
          '💀 SILICON VALLEY CEO FOUND DEAD - INVESTIGATION LAUNCHED',
          '💀 TECH TITAN KILLED IN PRIVATE PLANE CRASH',
        ]
      },
      energy: {
        assets: ['oil', 'uranium'],
        headlines: [
          '💀 ENERGY CEO FOUND DEAD - FOUL PLAY SUSPECTED',
          '💀 OIL BARON ASSASSINATED IN BROAD DAYLIGHT',
          '💀 ENERGY EXECUTIVE DIES UNDER SUSPICIOUS CIRCUMSTANCES',
        ]
      },
      finance: {
        assets: ['sp500', 'bonds'],
        headlines: [
          '💀 WALL STREET LEGEND KILLED IN PRIVATE JET CRASH',
          '💀 BANK CEO FOUND DEAD IN PENTHOUSE',
          '💀 HEDGE FUND TITAN DIES - SUICIDE OR MURDER?',
        ]
      },
      mining: {
        assets: ['gold', 'lithium'],
        headlines: [
          '💀 MINING BARON KILLED IN UNDERGROUND "ACCIDENT"',
          '💀 RARE EARTH MOGUL DIES IN EXPLOSION - SABOTAGE?',
          '💀 GOLD MINE OWNER ASSASSINATED',
        ]
      },
      crypto: {
        assets: ['bitcoin', 'ethereum'],
        headlines: [
          '💀 CRYPTO FOUNDER DISAPPEARS - BILLIONS MISSING',
          '💀 EXCHANGE CEO FOUND DEAD - KEYS LOST FOREVER',
          '💀 BLOCKCHAIN PIONEER KILLED - MARKET PANICS',
        ]
      },
    }

    const sector = ELIMINATION_SECTORS[sectorId]
    if (!sector) {
      set({ activeErrorMessage: 'INVALID SECTOR TARGET' })
      return
    }

    // Apply -25% crash to affected assets
    const crashAmount = -0.25
    const newPrices = { ...prices }
    sector.assets.forEach(assetId => {
      if (newPrices[assetId]) {
        newPrices[assetId] = newPrices[assetId] * (1 + crashAmount)
      }
    })

    // Random headline
    const headline = sector.headlines[Math.floor(Math.random() * sector.headlines.length)]

    // Mark ability as used
    const updated = activeStrategies.map(s =>
      s.strategyId === 'destabilization'
        ? { ...s, abilitiesUsed: { ...s.abilitiesUsed, eliminationUsed: true } }
        : s
    )

    set({
      activeStrategies: updated,
      prices: newPrices,
      todayNews: [...todayNews, {
        headline,
        effects: Object.fromEntries(sector.assets.map(a => [a, crashAmount])),
        labelType: 'breaking' as const,
      }],
      activeBuyMessage: `💀 TARGET ELIMINATED - ${sectorId.toUpperCase()} SECTOR IN FREEFALL (-25%)`,
    })
  },

  // ============================================================================
  // STRATEGY COMPUTED PROPERTIES
  // ============================================================================

  getStrategyTier: (strategyId: StrategyId): StrategyTier => {
    const { activeStrategies } = get()
    return getActiveTier(strategyId, activeStrategies)
  },

  canAffordStrategy: (strategyId: StrategyId, tier: 'active' | 'elite'): boolean => {
    const { cash, activeStrategies } = get()
    const currentTier = getActiveTier(strategyId, activeStrategies)
    return checkCanAffordStrategy(strategyId, tier, cash, currentTier)
  },

  meetsStrategyGate: (strategyId: StrategyId, tier: 'active' | 'elite'): boolean => {
    const netWorth = get().getNetWorth()
    return meetsNetWorthGate(strategyId, tier, netWorth)
  },

  getTotalDailyStrategyCost: (): number => {
    const { activeStrategies } = get()
    return calculateTotalDailyCost(activeStrategies)
  },

  canUseSpin: (): boolean => {
    const { activeStrategies } = get()
    return canUseAbility('spin', activeStrategies)
  },

  canUsePlant: (): boolean => {
    const { activeStrategies } = get()
    return canUseAbility('plant', activeStrategies)
  },

  canPushPolicy: (): boolean => {
    const { activeStrategies, day, lastPolicyPushDay } = get()
    const lobbying = activeStrategies.find(s => s.strategyId === 'lobbying')

    // Must have Lobbying Elite
    if (!lobbying || lobbying.tier !== 'elite') return false

    // Check cooldown
    if (lastPolicyPushDay !== null && day - lastPolicyPushDay < POLICY_PUSH_CONFIG.cooldownDays) {
      return false
    }

    return true
  },

  getPolicyPushInfo: () => {
    const { policyPushAttempts, lastPolicyPushDay, day, cash } = get()
    const config = POLICY_PUSH_CONFIG.getConfig(policyPushAttempts)

    let cooldownRemaining = 0
    if (lastPolicyPushDay !== null) {
      cooldownRemaining = Math.max(0, POLICY_PUSH_CONFIG.cooldownDays - (day - lastPolicyPushDay))
    }

    return {
      pushNumber: policyPushAttempts + 1,
      cost: config.cost,
      successRate: config.successRate,
      cooldownRemaining,
      canAfford: cash >= config.cost,
    }
  },

  canExecuteCoup: (): boolean => {
    const { activeStrategies } = get()
    return canUseAbility('coup', activeStrategies)
  },

  canExecuteElimination: (): boolean => {
    const { activeStrategies } = get()
    return canUseAbility('elimination', activeStrategies)
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
