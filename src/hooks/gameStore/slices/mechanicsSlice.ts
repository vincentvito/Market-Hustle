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
import { DEFAULT_ENCOUNTER_STATE, rollForEncounter, resolveTax } from '@/lib/game/encounters'
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
  MarketEvent,
  InvestmentResultEvent,
  MilestoneCelebrationEvent,
  CelebrationEvent,
  OperationId,
  OperationState,
  LuxuryAssetId,
  PEAbilityId,
  UsedPEAbility,
  PendingAbilityEffects,
} from '@/lib/game/types'
import { getLuxuryAsset, LUXURY_ASSETS } from '@/lib/game/lifestyleAssets'
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
import { callIncrementGamesPlayed } from '@/lib/game/authBridge'
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
  selectRandomEventWithDirector,
  selectRandomChainWithDirector,
  selectRandomStartup,
  selectOutcome,
  selectOutcomeWithBonus,
  getRandomDuration,
} from '../helpers'

// Import Game Director system
import {
  createInitialDirectorState,
  DEFAULT_DIRECTOR_CONFIG,
  getDirectorModifiers,
  updateDirectorState,
  prepareDirectorForDay,
  isExcitingEvent,
  // Second-order effects (ripples)
  createRippleFromEvent,
  updateRipples,
  addRipple,
  applyCounterRipple,
  isHighImpactEvent,
  type DirectorState,
  type DirectorConfig,
} from '@/lib/game/director'
import { getEventSentiment } from '@/lib/game/sentimentHelpers'

// Helper to record game completion to localStorage and Supabase
function saveGameResult(
  isWin: boolean,
  finalNetWorth: number,
  daysSurvived: number,
  gameDuration: GameDuration,
  gameOverReason?: string,
  _isLoggedIn?: boolean,
  _isUsingProTrial?: boolean,
  username?: string | null
): void {
  const userState = loadUserState()

  const entry: GameHistoryEntry = {
    gameId: generateGameId(),
    date: new Date().toISOString(),
    duration: gameDuration as 30 | 45 | 60,
    finalNetWorth,
    profitPercent: (finalNetWorth / 50000) * 100,
    daysSurvived,
    outcome: isWin ? 'win' : mapGameOverReasonToOutcome(gameOverReason || 'BANKRUPT'),
  }

  const updatedState = recordGameEnd(userState, entry, isWin)
  saveUserState(updatedState)

  // Sync to Supabase with username (fire-and-forget)
  if (username) {
    fetch('/api/profile/record-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        finalNetWorth,
        gameData: {
          gameId: entry.gameId,
          duration: entry.duration,
          profitPercent: entry.profitPercent,
          daysSurvived: entry.daysSurvived,
          outcome: entry.outcome,
        },
      }),
    }).catch((err) => console.error('Error recording game:', err))
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
  cash: 50000,
  creditCardDebt: 50000,
  trustFundBalance: 0,
  holdings: {},
  prices: {},
  prevPrices: {},
  priceHistory: {},
  costBasis: {},
  initialNetWorth: 0,

  // Heat/Suspicion tracking
  wifeSuspicion: 0,
  wifeSuspicionFrozenUntilDay: null,
  fbiHeat: 0,

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
  showPortfolioBeforeAdvance: typeof window !== 'undefined' ? localStorage.getItem('showPortfolioBeforeAdvance') === 'true' : false,
  portfolioAdvancePending: false,

  // Feedback state
  activeSellToast: null,
  activeBuyMessage: null,
  activeInvestmentBuyMessage: null,
  activeInvestmentResultToast: null,
  activeErrorMessage: null,

  // Settings & achievements
  showSettings: false,
  pendingAchievement: null,

  // Action bar modal states
  showActionsModal: false,
  activeActionsTab: 'buy' as 'staff' | 'dark' | 'buy' | 'peops',
  showGiftsModal: false,

  // Operations state (PE-based villain actions)
  operationStates: {
    lobby_congress: { operationId: 'lobby_congress', lastUsedDay: null, timesUsed: 0 },
    execute_coup: { operationId: 'execute_coup', lastUsedDay: null, timesUsed: 0 },
    plant_story: { operationId: 'plant_story', lastUsedDay: null, timesUsed: 0 },
  },

  // Luxury assets state
  ownedLuxury: [],

  // Portfolio navigation state (for clicking assets in portfolio)
  pendingLifestyleAssetId: null,
  pendingLuxuryAssetId: null,

  // PE Abilities state (new one-time villain actions)
  usedPEAbilities: [],
  pendingAbilityEffects: null,
  pendingPhase2Effects: null,  // Two-phase effects (e.g., Project Chimera Day N+2)

  // Game Director state (narrative pacing system)
  directorState: createInitialDirectorState(100000),
  directorConfig: DEFAULT_DIRECTOR_CONFIG,

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
      cash: 50000,
      creditCardDebt: 50000,
      trustFundBalance: 0,
      holdings: {},
      // Reset margin trading positions
      leveragedPositions: [],
      shortPositions: [],
      prices,
      prevPrices,
      priceHistory,
      costBasis: {},
      initialNetWorth: 0,  // Net worth = 50k cash - 50k debt = 0
      // Reset heat/suspicion
      wifeSuspicion: 0,
      wifeSuspicionFrozenUntilDay: null,
      fbiHeat: 0,
      event: null,
      message: '',
      gameOverReason: '',
      selectedAsset: null,
      buyQty: 1,
      newsHistory: [openingEvent?.headline || 'MARKETS OPEN - GOOD LUCK TRADER'],
      showPortfolio: false,
      portfolioAdvancePending: false,
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
      // Operations state (PE-based villain actions)
      operationStates: {
        lobby_congress: { operationId: 'lobby_congress', lastUsedDay: null, timesUsed: 0 },
        execute_coup: { operationId: 'execute_coup', lastUsedDay: null, timesUsed: 0 },
        plant_story: { operationId: 'plant_story', lastUsedDay: null, timesUsed: 0 },
      },
      // Luxury assets state
      ownedLuxury: [],
      // PE Abilities state
      usedPEAbilities: [],
      pendingAbilityEffects: null,
      pendingPhase2Effects: null,
      userTier: effectiveTier,
      gamesRemaining: remainingAfterStart,
      limitType,
      showDailyLimitModal: false,
      showAnonymousLimitModal: false,
      isUsingProTrial: willUseProTrial,
      // Game Director state
      directorState: createInitialDirectorState(100000),
      directorConfig: DEFAULT_DIRECTOR_CONFIG,
    })

    // Record play timestamp for retention tracking (localStorage + Supabase)
    try {
      const playLog: string[] = JSON.parse(localStorage.getItem('mh_play_log') || '[]')
      playLog.push(new Date().toISOString())
      // Keep last 500 entries
      localStorage.setItem('mh_play_log', JSON.stringify(playLog.slice(-500)))
    } catch { /* silent */ }

    // Fire-and-forget API call for logged-in users
    if (storeIsLoggedIn) {
      fetch('/api/game-plays', { method: 'POST' }).catch(() => {})
    }
  },

  nextDay: () => {
    const { prices, priceHistory, newsHistory, day, cash, holdings, activeChains, usedChainIds, activeInvestments, usedStartupIds, ownedLifestyle, lifestylePrices, activePEExitOffer, activeEscalations, hasReached1M, reachedMilestones, activeStories, usedStoryIds, gossipState, assetMoods, usedFlavorHeadlines, leveragedPositions, shortPositions, ownedLuxury, operationStates, pendingAbilityEffects, pendingPhase2Effects, usedPEAbilities, directorState, directorConfig, gameDuration, initialNetWorth } = get()
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
    // STEP -1: APPLY PENDING PE ABILITY EFFECTS (from previous day's trigger)
    // ===========================================================================
    let clearedPendingEffects = false
    let revealedUsedPEAbilities = usedPEAbilities
    if (pendingAbilityEffects) {
      // Apply price effects from the ability
      Object.entries(pendingAbilityEffects.effects).forEach(([assetId, effect]) => {
        effects[assetId] = (effects[assetId] || 0) + effect
      })

      // Add news headline (use stored eventHeadline from rumor → event buildup)
      const prefix = pendingAbilityEffects.isBackfire ? '⚠️' : '🎯'
      const fallbackName = pendingAbilityEffects.abilityId.replace(/_/g, ' ').toUpperCase()
      const eventHeadline = pendingAbilityEffects.eventHeadline
        || (pendingAbilityEffects.isBackfire ? `BACKFIRE: ${fallbackName} OPERATION EXPOSED` : `${fallbackName} SUCCESSFUL`)

      todayNewsItems.push({
        headline: `${prefix} ${eventHeadline}`,
        effects: pendingAbilityEffects.effects,
        labelType: 'breaking',
      })

      // Reveal the didBackfire outcome now that effects are applied
      revealedUsedPEAbilities = usedPEAbilities.map(u =>
        u.abilityId === pendingAbilityEffects.abilityId
          ? { ...u, didBackfire: pendingAbilityEffects.isBackfire }
          : u
      )

      clearedPendingEffects = true
    }

    // ===========================================================================
    // STEP -0.5: APPLY PENDING PHASE 2 EFFECTS (two-phase abilities like Chimera)
    // ===========================================================================
    let clearedPhase2Effects = false
    if (pendingPhase2Effects && newDay >= pendingPhase2Effects.triggerOnDay) {
      // Apply phase 2 price effects
      Object.entries(pendingPhase2Effects.effects).forEach(([assetId, effect]) => {
        effects[assetId] = (effects[assetId] || 0) + effect
      })

      // Add phase 2 news headline
      todayNewsItems.push({
        headline: `📈 ${pendingPhase2Effects.headline}`,
        effects: pendingPhase2Effects.effects,
        labelType: 'breaking',
      })

      clearedPhase2Effects = true
    }

    // ===========================================================================
    // STEP 0.5: LUXURY ASSET DAILY COSTS (itemized per asset)
    // ===========================================================================
    const luxuryCostLabels: Record<string, string> = {
      private_jet: 'JET MAINTENANCE',
      mega_yacht: 'YACHT UPKEEP',
      la_lakers: 'TEAM PAYROLL',
      art_collection: 'ART INSURANCE',
    }

    let luxuryDailyCost = 0
    ownedLuxury.forEach(id => {
      const asset = getLuxuryAsset(id)
      if (asset && asset.dailyCost > 0) {
        luxuryDailyCost += asset.dailyCost
        const label = luxuryCostLabels[id] || `${asset.name.toUpperCase()} COSTS`
        todayNewsItems.push({
          headline: `${label}: -$${asset.dailyCost.toLocaleString('en-US')}`,
          effects: {},
          labelType: 'none'
        })
      }
    })

    if (luxuryDailyCost > 0) {
      cashChange -= luxuryDailyCost
    }

    // Calculate if we can afford tomorrow's costs (for warning)
    const projectedCash = cash + cashChange
    const canAffordTomorrow = projectedCash >= luxuryDailyCost
    if (luxuryDailyCost > 0 && !canAffordTomorrow && projectedCash > 0) {
      todayNewsItems.push({
        headline: `⚠️ WARNING: Low cash - daily costs may bankrupt you tomorrow!`,
        effects: {},
        labelType: 'none'
      })
    }

    // ===========================================================================
    // PE PASSIVE BONUSES (calculated once, applied in effects)
    // ===========================================================================
    const ownsTenutaLuna = ownedLifestyle.some(o => o.assetId === 'pe_tenuta_luna')
    const ownsApexMedia = ownedLifestyle.some(o => o.assetId === 'pe_apex_media')
    // Note: Iron Oak's +5% positive event frequency is not yet implemented
    const ownsArtCollection = ownedLuxury.includes('art_collection')

    // Negative event damage reduction (Tenuta -10%, Apex -20%, stacks)
    let negativeReduction = 0
    if (ownsTenutaLuna) negativeReduction += 0.10
    if (ownsApexMedia) negativeReduction += 0.20

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
        headline: `RENTAL INCOME: +$${Math.round(propertyIncome).toLocaleString('en-US')}`,
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
              : `$${Math.round(lossAmount).toLocaleString('en-US')}`
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
        headline: `PE RETURNS: +$${Math.round(peReturns).toLocaleString('en-US')}`,
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

    // ===========================================================================
    // GAME DIRECTOR: Prepare modifiers for event selection
    // ===========================================================================
    // Prepare director state for this day (updates phase)
    let preparedDirectorState = prepareDirectorForDay(directorState, newDay, gameDuration)

    // IMPORTANT: Decay existing ripples BEFORE event selection
    // This ensures yesterday's ripples affect today's events with decayed strength
    preparedDirectorState = {
      ...preparedDirectorState,
      secondOrder: updateRipples(preparedDirectorState.secondOrder, newDay),
    }

    // Get recent categories from news history for variety enforcement
    const recentCategoriesForDirector = newsHistory
      .slice(-5)
      .map(headline => {
        // Extract category from headline (simplified - relies on event effects)
        const matchingEvent = EVENTS.find(e => e.headline === headline)
        return matchingEvent?.category
      })
      .filter((cat): cat is string => typeof cat === 'string')

    // Generate director modifiers
    const directorModifiers = getDirectorModifiers(
      preparedDirectorState,
      directorConfig,
      {
        day: newDay,
        gameDuration,
        recentCategories: recentCategoriesForDirector,
      }
    )

    // Adjust event probability based on director (dopamine debt increases chance)
    const directorEventBoost = preparedDirectorState.dopamineDebt > 0.7 ? 0.15 : 0
    const chainProbabilityBoost = (directorModifiers.chainProbabilityMultiplier - 1) * 0.1

    // Track if we started a new chain (for director state update)
    let chainStartedToday = false
    let eventFiredToday: MarketEvent | null = null

    // 3. Determine if we should start a new chain or fire a single event
    // Skip entirely if story already fired today (prevents headline stacking)
    // 30% chance for chain, 70% for single event (when event happens)
    // No new chain if one is already active
    const hasActiveChain = updatedChains.length > 0
    const eventRoll = Math.random()

    // Compute blocked categories (active stories + active chains) to prevent conflicts
    const blockedCategories = getActiveTopics(updatedStories, updatedChains)

    // Director can force an event type
    const forceChain = directorModifiers.forceEventType === 'chain' && !hasActiveChain
    const forceEvent = directorModifiers.forceEventType === 'spike'

    // Only roll for chain/event if no story fired today (prevents stacking)
    // Director boost increases event probability
    if (!storyFiredToday && (eventRoll < (0.45 + directorEventBoost) || forceChain || forceEvent)) {
      // Event happens (45% base chance + director boost)
      const chainOrSingleRoll = Math.random()

      // Adjusted chain probability with director influence
      const adjustedChainProb = 0.30 + chainProbabilityBoost

      if (!hasActiveChain && (forceChain || (!forceEvent && chainOrSingleRoll < adjustedChainProb))) {
        // Start a new chain (director-influenced probability)
        // Use director-aware selection with category boosts, preferences, and ripple modifiers
        const newChain = selectRandomChainWithDirector(
          updatedUsedChainIds,
          blockedCategories,
          updatedAssetMoods,
          newDay,
          directorModifiers,
          preparedDirectorState.secondOrder
        )
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
          chainStartedToday = true
          // Record mood from chain rumor for conflict prevention
          updatedAssetMoods = recordChainRumorMood(newChain, newDay, updatedAssetMoods)
        }
      } else {
        // Single event - use director-aware selection with sentiment bias, volatility scaling, and ripple modifiers
        const e = selectRandomEventWithDirector(
          updatedEscalations,
          newDay,
          blockedCategories,
          updatedAssetMoods,
          directorModifiers,
          preparedDirectorState.secondOrder
        )

        if (e) {
          // Single events = NEWS
          todayNewsItems.push({ headline: e.headline, effects: e.effects, labelType: 'news' })
          hasMarketNews = true
          eventFiredToday = e
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
          ? `💀 LOST $${inv.amount.toLocaleString('en-US')} ON ${inv.startupName}`
          : `${isProfit ? '🎉' : '😓'} ${inv.startupName}: ${isProfit ? '+' : ''}$${Math.round(profitLoss).toLocaleString('en-US')} (${profitLossPct >= 0 ? '+' : ''}${profitLossPct.toFixed(0)}%)`

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
          ? `${inv.outcome.headline} - YOUR $${inv.amount.toLocaleString('en-US')} INVESTMENT LOST`
          : `${inv.outcome.headline} - YOU MADE $${Math.round(payout).toLocaleString('en-US')}!`
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
    // STEP 5.5: APPLY PE PASSIVE BONUSES TO EFFECTS
    // ===========================================================================
    // Negative event damage reduction (Tenuta -10%, Apex -20%, stacks)
    if (negativeReduction > 0) {
      Object.keys(effects).forEach(assetId => {
        if (effects[assetId] < 0) {
          effects[assetId] = effects[assetId] * (1 - negativeReduction)
        }
      })
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
    // Include luxury assets at base price (fixed prices, no market fluctuation)
    const luxuryValue = ownedLuxury.reduce((sum, id) => {
      const asset = getLuxuryAsset(id)
      return sum + (asset?.basePrice || 0)
    }, 0)
    const currentCash = cash + cashChange
    const { trustFundBalance } = get()
    const nw = Math.round((currentCash + portfolioValue + startupValue + lifestyleValue + leveragedValue + luxuryValue + trustFundBalance - shortLiability) * 100) / 100

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
      // Minimum 6 days between any startup offers (reduced from 8 for better accessibility)
      const cooldownDays = 6
      const daysSinceLastOffer = lastStartupOfferDay ? newDay - lastStartupOfferDay : Infinity
      const cooldownPassed = daysSinceLastOffer >= cooldownDays

      // ========== NET WORTH GATES ==========
      const angelNetWorthGate = 250_000
      const vcNetWorthGate = 1_000_000

      // ========== HARD CAPS (base) ==========
      const angelCap = 2  // Base: 2 Angel offers per game
      const vcCap = 2     // Base: 2 VC offers per game

      // ========== BASE PROBABILITIES ==========
      // Modestly increased for better accessibility (was 2.5% Angel, 4% VC)
      let angelBaseChance = 0.035  // 3.5%
      let vcBaseChance = 0.055     // 5.5%

      // Private Jet luxury asset: +20% Angel frequency, +40% VC frequency
      const ownsJet = ownedLuxury.includes('private_jet')
      if (ownsJet) {
        angelBaseChance *= 1.20
        vcBaseChance *= 1.40
      }

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
    // GAME DIRECTOR: Update director state at end of day
    // ===========================================================================
    // Determine if this was an "exciting" day for dopamine tracking
    const hadExcitingEvent = isExcitingEvent(
      eventFiredToday ? Object.values(eventFiredToday.effects).reduce((sum, e) => sum + Math.abs(e), 0) : null,
      chainStartedToday,
      chainResolvedToday
    )

    // Update director state with today's results
    let updatedDirectorState = updateDirectorState(
      preparedDirectorState,
      {
        day: newDay,
        gameDuration,
        netWorth: nw,
        initialNetWorth,
        hadMarketEvent: hadExcitingEvent || hasMarketNews,
        eventEffects: eventFiredToday?.effects || null,
        hadChainResolution: chainResolvedToday,
      },
      directorConfig
    )

    // ===========================================================================
    // SECOND-ORDER EFFECTS: Create new ripples from today's events
    // ===========================================================================
    // Note: Ripple decay already happened at start of day (before event selection)
    // New ripples created here will affect TOMORROW's event selection
    if (eventFiredToday) {
      const newRipple = createRippleFromEvent(
        eventFiredToday.headline,
        eventFiredToday.category,
        eventFiredToday.effects,
        newDay,
        updatedDirectorState.currentPhase
      )
      if (newRipple) {
        updatedDirectorState = {
          ...updatedDirectorState,
          secondOrder: addRipple(updatedDirectorState.secondOrder, newRipple),
        }
      }

      // Apply counter-ripple if event sentiment opposes current ripple sentiment
      // (bullish events weaken bearish ripples, bearish events weaken bullish ripples)
      const eventSentiment = getEventSentiment(eventFiredToday)
      if (eventSentiment === 'bullish' || eventSentiment === 'bearish') {
        updatedDirectorState = {
          ...updatedDirectorState,
          secondOrder: applyCounterRipple(updatedDirectorState.secondOrder, eventSentiment),
        }
      }
    }

    // ===========================================================================
    // HEAT/SUSPICION: No longer apply natural decay (removed in rework)
    // ===========================================================================
    const { wifeSuspicion, creditCardDebt } = get()
    // Wife heat no longer decays naturally - only increases on losses
    const newWifeSuspicion = wifeSuspicion

    // ===========================================================================
    // CREDIT CARD DEBT: Apply daily interest
    // ===========================================================================
    // Apply 1% daily interest to credit card debt
    const dailyInterest = creditCardDebt * 0.01
    const newCreditCardDebt = creditCardDebt + dailyInterest

    // ===========================================================================
    // FBI HEAT: Calculate daily accumulation from risky positions
    // ===========================================================================
    const { fbiHeat } = get()
    // leveragedPositions and shortPositions already destructured at top of function

    // Clean books: no open short or leveraged positions = FBI heat cools -2%/day
    let fbiHeatIncrease: number

    if (shortPositions.length === 0 && leveragedPositions.length === 0) {
      fbiHeatIncrease = -2
    } else {
      // Base rate: +1% per day just for playing
      fbiHeatIncrease = 1

      // Each open short: +3% per day
      fbiHeatIncrease += shortPositions.length * 3

      // Each leveraged position: +2% per day base
      leveragedPositions.forEach(pos => {
        let positionHeat = 2  // Base heat per leveraged position

        // Leverage bonus: higher leverage = more heat
        // 2x leverage = +0% bonus
        // 5x leverage = +1% bonus
        // 10x leverage = +2% bonus
        if (pos.leverage >= 10) {
          positionHeat += 2
        } else if (pos.leverage >= 5) {
          positionHeat += 1
        }

        fbiHeatIncrease += positionHeat
      })
    }

    // Apply heat change (clamp 0-100%)
    const newFBIHeat = Math.min(100, Math.max(0, fbiHeat + fbiHeatIncrease))

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
      creditCardDebt: newCreditCardDebt,
      wifeSuspicion: newWifeSuspicion,
      fbiHeat: newFBIHeat,
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
      // Clear pending PE ability effects after they've been applied
      pendingAbilityEffects: clearedPendingEffects ? null : pendingAbilityEffects,
      // Reveal didBackfire on usedPEAbilities now that effects have been applied
      usedPEAbilities: revealedUsedPEAbilities,
      // Clear pending phase 2 effects after they've been applied
      pendingPhase2Effects: clearedPhase2Effects ? null : pendingPhase2Effects,
      // Update Game Director state
      directorState: updatedDirectorState,
    })

    // 9. Check win/lose conditions
    // Re-calculate net worth after all updates (includes margin positions)
    const finalNetWorth = get().getNetWorth()
    // Note: gameDuration already destructured at top of function

    if (finalNetWorth < -25000) {
      // Determine specific game over reason based on what caused the loss
      let gameOverReason = 'BANKRUPT'  // Default: no margin positions

      if (finalNetWorth < -1_000_000) {
        gameOverReason = 'ECONOMIC_CATASTROPHE'
      } else if (shortPositions.length > 0 && shortPositions.length > leveragedPositions.length) {
        gameOverReason = 'SHORT_SQUEEZED'
      } else if (leveragedPositions.length > 0 || shortPositions.length > 0) {
        // Only show MARGIN_CALLED if player actually has margin/short positions
        gameOverReason = 'MARGIN_CALLED'
      }

      // Record game result before showing game over screen
      saveGameResult(false, finalNetWorth, newDay - 1, gameDuration, gameOverReason, get().isLoggedIn, get().isUsingProTrial, get().username)
      set({ screen: 'gameover', gameOverReason, isUsingProTrial: false })
    } else if (newDay > gameDuration) {
      // Player survived the full duration - WIN!
      saveGameResult(true, finalNetWorth, gameDuration, gameDuration, undefined, get().isLoggedIn, get().isUsingProTrial, get().username)
      set({ screen: 'win', isUsingProTrial: false })
    }
  },

  // Called when user clicks "Next Day" - checks for encounter before advancing
  triggerNextDay: () => {
    const { day, cash, encounterState, pendingStartupOffer, gameDuration, isCelebrationDay, ownedLuxury, showPortfolioBeforeAdvance, holdings } = get()
    const netWorth = get().getNetWorth()

    // Show portfolio recap before advancing if setting is on and player has positions
    const hasPositions = Object.values(holdings).some(qty => qty > 0)
    if (showPortfolioBeforeAdvance && hasPositions) {
      set({ showPortfolio: true, portfolioAdvancePending: true })
      return
    }

    // Skip encounter check on celebration days - let the player enjoy their moment!
    if (isCelebrationDay) {
      get().nextDay()
      return
    }

    // Art Collection reduces Tax Event probability
    const ownsArtCollection = ownedLuxury.includes('art_collection')
    const { wifeSuspicion, fbiHeat } = get()

    // Check if an encounter should trigger
    const encounterType = rollForEncounter(day + 1, encounterState, cash, { netWorth, gameLength: gameDuration, ownsArtCollection, wifeSuspicion, fbiHeat })

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
      activeBuyMessage: `SHORTED ${qty} ${asset?.name} @ $${price.toLocaleString('en-US')}`,
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

    // If covering short at a loss, cool FBI heat
    if (profitLoss < 0) {
      const { fbiHeat } = get()
      // Cooling mechanism: Closing short at loss reduces FBI heat by 5%
      // (Looks like a bad trader, not suspicious)
      const newFBIHeat = Math.max(0, fbiHeat - 5)
      set({ fbiHeat: newFBIHeat })
    }

    const asset = ASSETS.find(a => a.id === position.assetId)
    const plSign = profitLoss >= 0 ? '+' : ''
    const emoji = profitLoss >= 0 ? '📈' : '📉'
    const tradeMessage = `${emoji} COVERED ${position.qty} ${asset?.name}: ${plSign}$${Math.abs(profitLoss).toLocaleString('en-US')}`

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

    // If closing leveraged position at a loss, increase wife suspicion
    if (profitLoss < 0) {
      const heatIncrease = Math.min(15, Math.abs(profitLoss) / 10000)

      const { wifeSuspicion } = get()
      const newWifeSuspicion = Math.min(100, wifeSuspicion + heatIncrease)
      set({ wifeSuspicion: newWifeSuspicion })
    }

    // Closing ANY leveraged position reduces FBI heat by 3% (cleaning up risky positions)
    const { fbiHeat } = get()
    const newFBIHeat = Math.max(0, fbiHeat - 3)
    set({ fbiHeat: newFBIHeat })

    const asset = ASSETS.find(a => a.id === position.assetId)
    const plSign = profitLoss >= 0 ? '+' : ''
    const emoji = profitLoss >= 0 ? '🚀' : '💸'

    const newPositions = leveragedPositions.filter(p => p.id !== positionId)

    // Allow negative afterDebt (underwater position) - bankruptcy check at end-of-day
    const warningMessage = afterDebt < 0 ? ' (UNDERWATER!)' : ''
    const tradeMessage = `${emoji} CLOSED ${position.leverage}x ${asset?.name}: ${plSign}$${Math.abs(profitLoss).toLocaleString('en-US')}${warningMessage}`

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
    const { cash, day, pendingStartupOffer, activeInvestments, usedStartupIds, ownedLuxury } = get()

    if (!pendingStartupOffer) return
    if (amount > cash) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

    // Private jet gives outcome bonus for startup investments
    const hasPrivateJet = ownedLuxury.includes('private_jet')
    const outcomeBonus = hasPrivateJet ? 0.10 : 0  // 10% reduction in failure rate

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
      activeInvestmentBuyMessage: `INVESTED $${amount.toLocaleString('en-US')} IN ${pendingStartupOffer.name}`,
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
    const { cash, lifestylePrices, ownedLifestyle, ownedLuxury, day } = get()
    const asset = LIFESTYLE_ASSETS.find(a => a.id === assetId)
    if (!asset) return

    let price = lifestylePrices[assetId] || asset.basePrice

    // Yacht gives -20% discount on PE purchases
    const ownsYacht = ownedLuxury.includes('mega_yacht')
    if (asset.category === 'private_equity' && ownsYacht) {
      price = Math.floor(price * 0.80)
    }

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
    const plFormatted = `${plSign}$${Math.abs(profitLoss).toLocaleString('en-US')}`
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
    const plFormatted = `${plSign}$${Math.abs(profitLoss).toLocaleString('en-US')}`
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

  setShowPortfolio: (show: boolean) => set({ showPortfolio: show, ...(show ? {} : { portfolioAdvancePending: false }) }),
  setShowPortfolioBeforeAdvance: (show: boolean) => {
    set({ showPortfolioBeforeAdvance: show })
    if (typeof window !== 'undefined') {
      localStorage.setItem('showPortfolioBeforeAdvance', String(show))
    }
  },
  confirmAdvance: () => {
    set({ showPortfolio: false, portfolioAdvancePending: false })
    // Now run the real advance logic (duplicated encounter check from triggerNextDay)
    const { day, cash, encounterState, pendingStartupOffer, gameDuration, isCelebrationDay, ownedLuxury } = get()
    const netWorth = get().getNetWorth()
    if (isCelebrationDay) {
      get().nextDay()
      return
    }
    const ownsArtCollection = ownedLuxury.includes('art_collection')
    const { wifeSuspicion, fbiHeat } = get()
    const encounterType = rollForEncounter(day + 1, encounterState, cash, { netWorth, gameLength: gameDuration, ownsArtCollection, wifeSuspicion, fbiHeat })
    if (encounterType) {
      set({
        pendingEncounter: { type: encounterType },
        queuedStartupOffer: pendingStartupOffer,
        pendingStartupOffer: null,
      })
    } else {
      get().nextDay()
    }
  },
  setSelectedNews: (news) => set({ selectedNews: news }),
  setShowSettings: (show: boolean) => set({ showSettings: show }),
  setShowActionsModal: (show: boolean) => set({ showActionsModal: show }),
  setActiveActionsTab: (tab: 'staff' | 'dark' | 'buy' | 'peops') => set({ activeActionsTab: tab }),
  setShowGiftsModal: (show: boolean) => set({ showGiftsModal: show }),

  // ============================================================================
  // GIFT ACTIONS
  // ============================================================================

  buyGift: (giftId: string) => {
    const { cash, wifeSuspicion, day } = get()
    const { GIFTS, getGift } = require('@/lib/game/gifts')
    const gift = getGift(giftId)

    if (!gift) {
      set({ activeErrorMessage: 'GIFT NOT FOUND' })
      return
    }

    if (cash < gift.cost) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

    // Calculate new wife suspicion (can't go below 0)
    const newSuspicion = Math.max(0, wifeSuspicion - gift.heatReduction)

    // If gift freezes heat, set freeze day
    const freezeDay = gift.freezeDays ? day + gift.freezeDays : null

    set({
      cash: Math.round((cash - gift.cost) * 100) / 100,
      wifeSuspicion: newSuspicion,
      wifeSuspicionFrozenUntilDay: freezeDay,
      activeBuyMessage: `BOUGHT ${gift.name} - Suspicion reduced by ${gift.heatReduction}%`,
      showGiftsModal: false,
    })
  },

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
      usedTax: encounterState.usedTax || encounterType === 'tax',
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
        // Need to liquidate assets - use full net worth to check bankruptcy
        const { ownedLifestyle, lifestylePrices, leveragedPositions, shortPositions, ownedLuxury } = get()
        const currentNetWorth = get().getNetWorth()

        // Only declare bankruptcy if net worth after penalty would be <= 0
        if (currentNetWorth - amountNeeded <= 0) {
          // Truly bankrupt — can't cover the penalty even with all assets
          const { day, gameDuration } = get()
          saveGameResult(false, 0, day, gameDuration, 'BANKRUPT', get().isLoggedIn, get().isUsingProTrial, get().username)
          set({
            cash: 0,
            holdings: {},
            ownedLifestyle: [],
            ownedLuxury: [],
            leveragedPositions: [],
            shortPositions: [],
            encounterState: newEncounterState,
            pendingEncounter: null,
            pendingLiquidation: null,
            queuedStartupOffer: null,
            screen: 'gameover',
            gameOverReason: 'BANKRUPT',
            isUsingProTrial: false,
            message: `${result.headline} — Assets seized, still couldn't cover the debt.`,
          })
          return
        }

        // Player CAN cover it — auto-liquidate assets to cover the shortfall
        const shortfall = amountNeeded - cash
        let remainingShortfall = shortfall
        let newOwnedLifestyle = [...ownedLifestyle]
        let newOwnedLuxury = [...ownedLuxury]
        let newLeveragedPositions = [...leveragedPositions]
        let newShortPositions = [...shortPositions]

        // 1. Sell luxury assets first (fixed price, no market impact)
        for (const luxuryId of [...newOwnedLuxury]) {
          if (remainingShortfall <= 0) break
          const asset = getLuxuryAsset(luxuryId)
          if (asset) {
            remainingShortfall -= asset.basePrice
            newOwnedLuxury = newOwnedLuxury.filter(id => id !== luxuryId)
          }
        }

        // 2. Sell lifestyle assets
        for (const owned of [...newOwnedLifestyle]) {
          if (remainingShortfall <= 0) break
          const value = lifestylePrices[owned.assetId] || 0
          if (value > 0) {
            remainingShortfall -= value
            newOwnedLifestyle = newOwnedLifestyle.filter(o => o.assetId !== owned.assetId)
          }
        }

        // 3. Close leveraged positions (collect equity = currentValue - debt)
        for (const pos of [...newLeveragedPositions]) {
          if (remainingShortfall <= 0) break
          const currentPrice = prices[pos.assetId] || 0
          const equity = (currentPrice * pos.qty) - pos.debtAmount
          if (equity > 0) {
            remainingShortfall -= equity
            newLeveragedPositions = newLeveragedPositions.filter(p => p.id !== pos.id)
          }
        }

        // 4. Close short positions (recover profit: cashReceived - currentLiability)
        for (const pos of [...newShortPositions]) {
          if (remainingShortfall <= 0) break
          const currentPrice = prices[pos.assetId] || 0
          const liability = currentPrice * pos.qty
          const profit = pos.cashReceived - liability
          if (profit > 0) {
            remainingShortfall -= profit
            newShortPositions = newShortPositions.filter(p => p.id !== pos.id)
          }
        }

        // 5. Sell trading holdings (largest first)
        const sortedHoldings = Object.entries(newHoldings)
          .map(([id, qty]) => ({ id, qty, value: (prices[id] || 0) * qty }))
          .sort((a, b) => b.value - a.value)

        for (const holding of sortedHoldings) {
          if (remainingShortfall <= 0) break
          const price = prices[holding.id] || 0
          if (price <= 0) continue

          if (holding.value <= remainingShortfall) {
            // Sell all shares of this holding
            remainingShortfall -= holding.value
            delete newHoldings[holding.id]
          } else {
            // Sell partial — only what's needed
            const sharesToSell = Math.ceil(remainingShortfall / price)
            remainingShortfall -= sharesToSell * price
            newHoldings[holding.id] = holding.qty - sharesToSell
            if (newHoldings[holding.id] <= 0) {
              delete newHoldings[holding.id]
            }
          }
        }

        // All cash goes to penalty, any excess from liquidation is returned
        const excessFromLiquidation = Math.max(0, -remainingShortfall)
        newCash = Math.round(excessFromLiquidation * 100) / 100
        finalHeadline = `${result.headline} (Assets liquidated to cover penalty)`

        // Liquidation causes significant suspicion spike
        const { wifeSuspicion } = get()
        const newWifeSuspicion = Math.min(100, wifeSuspicion + 15)

        // Apply all the liquidation changes
        set({
          ownedLifestyle: newOwnedLifestyle,
          ownedLuxury: newOwnedLuxury,
          leveragedPositions: newLeveragedPositions,
          shortPositions: newShortPositions,
          wifeSuspicion: newWifeSuspicion,
        })
      }
    } else if (result.cashChange) {
      // Standard cash change (non-liquidation encounters)
      newCash = Math.max(0, cash + result.cashChange)
    }

    // Check for game over conditions
    if (result.gameOver) {
      const { day, gameDuration } = get()
      const finalNetWorth = get().getNetWorth()
      saveGameResult(false, finalNetWorth, day, gameDuration, result.gameOverReason || 'BANKRUPT', get().isLoggedIn, get().isUsingProTrial, get().username)
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
  // LUXURY ASSET ACTIONS
  // ============================================================================

  buyLuxuryAsset: (assetId: LuxuryAssetId) => {
    const { cash, ownedLuxury, wifeSuspicion } = get()
    const asset = getLuxuryAsset(assetId)
    if (!asset) return

    // Check if already owned
    if (ownedLuxury.includes(assetId)) {
      set({ activeErrorMessage: 'ALREADY OWNED' })
      return
    }

    // Luxury assets have fixed prices (no market fluctuation)
    const effectivePrice = asset.basePrice

    if (cash < effectivePrice) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

    // Increase wife suspicion by 5% for luxury purchase
    const newWifeSuspicion = Math.min(100, wifeSuspicion + 5)

    set({
      cash: cash - effectivePrice,
      ownedLuxury: [...ownedLuxury, assetId],
      wifeSuspicion: newWifeSuspicion,
      activeBuyMessage: `${asset.emoji} ${asset.name.toUpperCase()} ACQUIRED`,
    })
  },

  sellLuxuryAsset: (assetId: LuxuryAssetId) => {
    const { cash, ownedLuxury } = get()
    const asset = getLuxuryAsset(assetId)
    if (!asset) return

    if (!ownedLuxury.includes(assetId)) {
      set({ activeErrorMessage: 'NOT OWNED' })
      return
    }

    // Sell at 80% of purchase price (20% depreciation)
    const sellPrice = Math.floor(asset.basePrice * 0.80)

    set({
      cash: cash + sellPrice,
      ownedLuxury: ownedLuxury.filter(id => id !== assetId),
      activeBuyMessage: `${asset.emoji} SOLD FOR $${sellPrice.toLocaleString('en-US')}`,
    })
  },

  // ============================================================================
  // PORTFOLIO NAVIGATION ACTIONS
  // ============================================================================

  setPendingLifestyleAsset: (assetId: string | null) => {
    set({ pendingLifestyleAssetId: assetId })
  },

  setPendingLuxuryAsset: (assetId: LuxuryAssetId | null) => {
    set({ pendingLuxuryAssetId: assetId })
  },

  // ============================================================================
  // PE ABILITY ACTIONS (One-time villain operations)
  // ============================================================================

  executePEAbility: (abilityId, peAssetId) => {
    const { cash, day, ownedLifestyle, usedPEAbilities, todayNews, wifeSuspicion, fbiHeat } = get()

    // Import ability data and headlines
    const { PE_ABILITIES, getPEAbilities } = require('@/lib/game/lifestyleAssets')
    const { ABILITY_HEADLINES } = require('@/lib/game/abilityHeadlines')
    const ability = PE_ABILITIES[abilityId]
    if (!ability) {
      set({ activeErrorMessage: 'INVALID ABILITY' })
      return
    }

    // Check if player owns the PE company
    const ownsPE = ownedLifestyle.some(o => o.assetId === peAssetId)
    if (!ownsPE) {
      set({ activeErrorMessage: 'MUST OWN COMPANY' })
      return
    }

    // Check if ability is available for this PE
    const peAbilities = getPEAbilities(peAssetId)
    if (!peAbilities.some((a: { id: string }) => a.id === abilityId)) {
      set({ activeErrorMessage: 'ABILITY NOT AVAILABLE' })
      return
    }

    // Check if ability already used
    if (usedPEAbilities.some(u => u.abilityId === abilityId)) {
      set({ activeErrorMessage: 'ABILITY ALREADY USED' })
      return
    }

    // Check if player has enough cash
    if (cash < ability.cost) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

    // Deduct cost
    const newCash = cash - ability.cost

    // Roll for backfire
    const didBackfire = Math.random() < ability.backfireChance

    // Determine effects
    const effects = didBackfire ? (ability.backfireEffects.priceEffects || {}) : ability.successEffects

    // Get headlines for rumor → event buildup
    const headlines = ABILITY_HEADLINES[abilityId]
    const rumorHeadline = headlines?.rumor || `${ability.name.toUpperCase()} OPERATION UNDERWAY`
    const eventHeadline = didBackfire
      ? (headlines?.backfire || `${ability.name.toUpperCase()} OPERATION EXPOSED`)
      : (headlines?.success || `${ability.name.toUpperCase()} SUCCESSFUL`)

    // Create pending effects for next day
    const pendingEffects = {
      abilityId,
      effects,
      isBackfire: didBackfire,
      peAssetId,
      eventHeadline, // Pre-computed headline for Day N+1
      additionalConsequences: didBackfire ? {
        losePE: ability.backfireEffects.losePE,
        fine: ability.backfireEffects.fine,
        triggerEncounter: ability.backfireEffects.triggerEncounter,
        gameOverRisk: ability.backfireEffects.gameOverRisk,
      } : undefined,
    }

    // Record ability as used (didBackfire is null until effects are applied next day)
    const newUsedAbilities = [...usedPEAbilities, {
      abilityId,
      usedOnDay: day,
      didBackfire: null,  // Outcome hidden until next day when pendingAbilityEffects are applied
    }]

    // Handle immediate backfire consequences
    let finalCash = newCash
    let updatedOwnedLifestyle = [...ownedLifestyle]
    // Don't reveal outcome in the message - always show "INITIATED"
    let message = `🎯 ${ability.emoji} ${ability.name.toUpperCase()} INITIATED`

    if (didBackfire) {
      // Apply fine immediately
      if (ability.backfireEffects.fine) {
        finalCash -= ability.backfireEffects.fine
        message += ` -$${(ability.backfireEffects.fine / 1_000_000).toFixed(0)}M FINE`
      }

      // Lose PE asset immediately
      if (ability.backfireEffects.losePE) {
        updatedOwnedLifestyle = updatedOwnedLifestyle.filter(o => o.assetId !== peAssetId)
        message += ' - ASSET SEIZED'
      }

      // Check for game over risk
      if (ability.backfireEffects.gameOverRisk && Math.random() < ability.backfireEffects.gameOverRisk) {
        set({
          screen: 'gameover',
          gameOverReason: 'FBI_INVESTIGATION',
          message: '🚔 FBI INVESTIGATION - GAME OVER',
        })
        return
      }
    }

    // Add rumor to today's news (shows immediately on Day N)
    const rumorNewsItem = {
      headline: `🕵️ ${rumorHeadline}`,
      effects: {}, // Rumors have no immediate market effect
      labelType: 'rumor' as const,
    }

    // Queue phase 2 effects if ability has them and didn't backfire
    const phase2Effects = (!didBackfire && ability.phase2Effects) ? {
      abilityId,
      effects: ability.phase2Effects.effects,
      headline: ability.phase2Effects.headline,
      triggerOnDay: day + 2, // Day N+2 (Day N = today, Day N+1 = phase 1, Day N+2 = phase 2)
    } : null

    // Increase wife suspicion by 10% for PE ability execution
    const newWifeSuspicion = Math.min(100, wifeSuspicion + 10)

    // FBI heat: +5% on success, +15% on backfire
    const fbiHeatIncrease = didBackfire ? 15 : 5
    const newFBIHeat = Math.min(100, fbiHeat + fbiHeatIncrease)

    set({
      cash: finalCash,
      usedPEAbilities: newUsedAbilities,
      pendingAbilityEffects: pendingEffects,
      pendingPhase2Effects: phase2Effects,
      ownedLifestyle: updatedOwnedLifestyle,
      wifeSuspicion: newWifeSuspicion,
      fbiHeat: newFBIHeat,
      activeBuyMessage: message,
      todayNews: [...todayNews, rumorNewsItem], // Add rumor to news
    })
  },

  canExecutePEAbility: (abilityId, peAssetId) => {
    const { cash, ownedLifestyle, usedPEAbilities } = get()

    // Import ability data
    const { PE_ABILITIES, getPEAbilities } = require('@/lib/game/lifestyleAssets')
    const ability = PE_ABILITIES[abilityId]
    if (!ability) return false

    // Check ownership
    const ownsPE = ownedLifestyle.some(o => o.assetId === peAssetId)
    if (!ownsPE) return false

    // Check ability availability for this PE
    const peAbilities = getPEAbilities(peAssetId)
    if (!peAbilities.some((a: { id: string }) => a.id === abilityId)) return false

    // Check if already used
    if (usedPEAbilities.some(u => u.abilityId === abilityId)) return false

    // Check cash
    if (cash < ability.cost) return false

    return true
  },

  getPEAbilityStatus: (abilityId) => {
    const { usedPEAbilities } = get()
    const used = usedPEAbilities.find(u => u.abilityId === abilityId)

    return {
      isUsed: !!used,
      usedOnDay: used?.usedOnDay ?? null,
      didBackfire: used?.didBackfire ?? null,
    }
  },

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  getNetWorth: () => {
    const { cash, holdings, prices, activeInvestments, ownedLifestyle, lifestylePrices, leveragedPositions, shortPositions, ownedLuxury, creditCardDebt, trustFundBalance } = get()

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
    // Include luxury assets at base price (fixed prices, no market fluctuation)
    const luxuryValue = ownedLuxury.reduce((sum, id) => {
      const asset = getLuxuryAsset(id)
      return sum + (asset?.basePrice || 0)
    }, 0)

    // Net worth = cash + portfolio + leveragedEquity + startups + lifestyle + luxury + trust - shortLiability - creditCardDebt
    // Note: shortPositions added to cash when opened, so we subtract liability
    return Math.round((cash + portfolio + leveragedValue + startupValue + lifestyleValue + luxuryValue + trustFundBalance - shortLiability - creditCardDebt) * 100) / 100 || 0
  },

  getTotalDebt: () => {
    const { leveragedPositions, creditCardDebt } = get()
    // Total debt = sum of all leveraged position debts + credit card debt
    const leverageDebt = leveragedPositions.reduce((sum, pos) => sum + pos.debtAmount, 0)
    return leverageDebt + creditCardDebt
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

  // ============================================================================
  // HEAT/SUSPICION MANAGEMENT
  // ============================================================================

  increaseWifeHeat: (amount: number) => {
    const { wifeSuspicion } = get()
    set({ wifeSuspicion: Math.min(100, wifeSuspicion + amount) })
  },

  decreaseWifeHeat: (amount: number) => {
    const { wifeSuspicion } = get()
    set({ wifeSuspicion: Math.max(0, wifeSuspicion - amount) })
  },

  increaseFBIHeat: (amount: number) => {
    const { fbiHeat } = get()
    set({ fbiHeat: Math.min(100, fbiHeat + amount) })
  },

  decreaseFBIHeat: (amount: number) => {
    const { fbiHeat } = get()
    set({ fbiHeat: Math.max(0, fbiHeat - amount) })
  },

  // ============================================================================
  // CREDIT CARD DEBT ACTIONS
  // ============================================================================

  setCreditCardDebt: (newDebt: number) => {
    const { cash, creditCardDebt } = get()
    const repayAmount = creditCardDebt - newDebt

    // Deduct from cash
    set({
      creditCardDebt: newDebt,
      cash: cash - repayAmount
    })
  },

  depositToTrust: (amount: number) => {
    const { cash, trustFundBalance } = get()
    const deposit = Math.min(amount, cash)
    if (deposit <= 0) return
    set({
      cash: Math.round((cash - deposit) * 100) / 100,
      trustFundBalance: Math.round((trustFundBalance + deposit) * 100) / 100,
    })
  },

  withdrawFromTrust: (amount: number) => {
    const { cash, trustFundBalance } = get()
    const withdrawal = Math.min(amount, trustFundBalance)
    if (withdrawal <= 0) return
    set({
      cash: Math.round((cash + withdrawal) * 100) / 100,
      trustFundBalance: Math.round((trustFundBalance - withdrawal) * 100) / 100,
    })
  },
})
