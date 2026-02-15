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
import { SCHEDULED_EVENTS } from '@/lib/game/scheduledEvents'
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
  ActiveScheduledEvent,
  TradeLogEntry,
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
import { getScriptedGame, getScriptedGameNumber } from '@/lib/game/scriptedGames'
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
  selectRandomScheduledEvent,
  categoryToTheme,
  themeToCategory,
  PE_ABILITY_TOPICS,
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
  startTheme,
  type DirectorState,
  type DirectorConfig,
} from '@/lib/game/director'
import { getEventSentiment, deriveSentiment } from '@/lib/game/sentimentHelpers'

// Helper to append a trade log entry to the store
function appendTradeLog(
  get: () => { tradeLog: TradeLogEntry[]; day: number },
  set: (state: Partial<{ tradeLog: TradeLogEntry[] }>) => void,
  entry: Omit<TradeLogEntry, 'day'>
) {
  const { tradeLog, day } = get()
  set({ tradeLog: [...tradeLog, { ...entry, day }] })
}

// Helper to record game completion to localStorage and Supabase
function saveGameResult(
  isWin: boolean,
  finalNetWorth: number,
  daysSurvived: number,
  gameDuration: GameDuration,
  gameOverReason?: string,
  _isLoggedIn?: boolean,
  _isUsingProTrial?: boolean,
  username?: string | null,
  tradeLog?: TradeLogEntry[]
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
        tradeLogs: tradeLog,
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
  pendingGameOver: null as { reason: string; netWorth: number } | null,
  newsHistory: ['MARKET OPEN - GOOD LUCK TRADER'],
  todayNews: [],
  rumors: [],
  selectedNews: null,

  // Chains & stories
  activeChains: [],
  usedChainIds: [],
  activeStories: [],
  usedStoryIds: [],
  lastStoryStartDay: 0,
  activeEscalations: [],
  activeScheduledEvent: null,
  usedScheduledEventIds: [],
  assetMoods: [],
  categoryCooldowns: [],
  usedFlavorHeadlines: [],
  usedEventHeadlines: [],

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
  activeActionsTab: 'leverage' as 'leverage' | 'buy' | 'casino',
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
  pendingStoryArc: null,  // 3-part story arc for PE abilities
  pendingPhase2Effects: null,  // Two-phase effects (e.g., Project Chimera Day N+2)

  // Presidential state (endgame after winning election)
  isPresident: false,
  usedPresidentialAbilities: [],
  hasPardoned: false,
  pendingElection: null,
  pendingInflationEffect: null,

  // Game Director state (narrative pacing system)
  directorState: createInitialDirectorState(100000),
  directorConfig: DEFAULT_DIRECTOR_CONFIG,

  // Scripted game state (curated first 3 games for new players)
  activeScript: null,
  scriptedGameNumber: null,
  preloadedScenario: null,

  // Trade log accumulator (sent to server at game end)
  tradeLog: [],

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

    // Check if this should be a scripted game (first 3 games ever)
    const scriptedGameNumber = getScriptedGameNumber(userState.totalGamesPlayed)
    let activeScript = scriptedGameNumber ? getScriptedGame(scriptedGameNumber) : null

    // Check if an admin-authored scenario was preloaded (takes priority over scripted games)
    const preloadedScenario = get().preloadedScenario
    if (preloadedScenario) {
      activeScript = preloadedScenario
    }

    // Force duration to match script length for scripted/scenario games
    if (activeScript) {
      gameDuration = (activeScript.days.length as GameDuration) || 30
    }

    // Generate base prices (yesterday's close)
    // Use fixed initial prices for scripted games if provided, otherwise normal random
    const prevPrices = activeScript?.initialPrices
      ? { ...activeScript.initialPrices }
      : initPrices()

    // Generate Day 1 opening event
    let openingEvent: MarketEvent | null = null
    let todayNewsItems: NewsItem[]
    const activeEscalations: ActiveEscalation[] = []

    if (activeScript) {
      // Scripted game: use day 1 content from the script
      const day1 = activeScript.days[0]
      todayNewsItems = day1.news.map(n => ({
        headline: n.headline,
        effects: n.effects,
        labelType: n.labelType,
      }))
      if (day1.flavorHeadline) {
        todayNewsItems.push({ headline: day1.flavorHeadline, effects: {}, labelType: day1.flavorHeadline.startsWith('@') ? 'gossip' : 'flavor' })
      }
      // Build combined effects for day 1 price calculation
      const day1Effects: Record<string, number> = {}
      day1.news.forEach(n => {
        Object.entries(n.effects).forEach(([assetId, effect]) => {
          day1Effects[assetId] = (day1Effects[assetId] || 0) + effect
        })
      })
      // Apply price nudges
      if (day1.priceNudges) {
        day1.priceNudges.forEach(({ assetId, nudge }) => {
          day1Effects[assetId] = (day1Effects[assetId] || 0) + nudge
        })
      }
      // Create a synthetic opening event for price calculation
      openingEvent = {
        headline: day1.news[0]?.headline || 'MARKETS OPEN',
        effects: day1Effects,
      } as MarketEvent
    } else {
      // Normal game: random opening event
      openingEvent = selectRandomEvent([], 1, new Set())
      todayNewsItems = openingEvent
        ? [{ headline: openingEvent.headline, effects: openingEvent.effects, labelType: 'news' }]
        : [{ headline: 'MARKETS OPEN - GOOD LUCK TRADER', effects: {}, labelType: 'news' }]

      // Track escalation if opening event triggers one
      if (openingEvent?.escalates) {
        activeEscalations.push({
          categories: openingEvent.escalates.categories,
          boost: openingEvent.escalates.boost,
          expiresDay: 1 + openingEvent.escalates.duration,
        })
      }
    }

    // Generate lifestyle asset prices
    const lifestylePrices = initLifestylePrices()

    // Calculate Day 1 prices with event effects
    const prices: Record<string, number> = {}
    const priceHistory: Record<string, DayCandle[]> = {}
    ASSETS.forEach(asset => {
      let change = (Math.random() - 0.5) * asset.volatility * 2
      if (openingEvent?.effects[asset.id]) {
        change = change * 0.08 + openingEvent.effects[asset.id]
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
      pendingGameOver: null,
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
      lastStoryStartDay: 0,
      gossipState: DEFAULT_GOSSIP_STATE,
      encounterState: DEFAULT_ENCOUNTER_STATE,
      pendingEncounter: null,
      pendingLiquidation: null,
      queuedStartupOffer: null,
      activeScheduledEvent: null,
      usedScheduledEventIds: [],
      assetMoods: [],
      categoryCooldowns: [],
      usedFlavorHeadlines: [],
      usedEventHeadlines: [],
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
      pendingStoryArc: null,
      pendingPhase2Effects: null,
      // Presidential state
      isPresident: false,
      usedPresidentialAbilities: [],
      hasPardoned: false,
      pendingElection: null,
      pendingInflationEffect: null,
      userTier: effectiveTier,
      gamesRemaining: remainingAfterStart,
      limitType,
      showDailyLimitModal: false,
      showAnonymousLimitModal: false,
      isUsingProTrial: willUseProTrial,
      // Game Director state
      directorState: createInitialDirectorState(100000),
      directorConfig: DEFAULT_DIRECTOR_CONFIG,
      // Scripted game state
      activeScript,
      scriptedGameNumber,
      preloadedScenario: null, // Clear after use so next game isn't affected
      // Reset trade log for new game
      tradeLog: [],
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
    const { prices, priceHistory, newsHistory, day, cash, holdings, activeChains, usedChainIds, activeInvestments, usedStartupIds, ownedLifestyle, lifestylePrices, activePEExitOffer, activeEscalations, hasReached1M, reachedMilestones, activeStories, usedStoryIds, lastStoryStartDay, gossipState, assetMoods, categoryCooldowns, usedFlavorHeadlines, usedEventHeadlines, leveragedPositions, shortPositions, ownedLuxury, operationStates, pendingAbilityEffects, pendingStoryArc, pendingPhase2Effects, usedPEAbilities, pendingInflationEffect, directorState, directorConfig, gameDuration, initialNetWorth, creditCardDebt, activeScheduledEvent, usedScheduledEventIds } = get()
    let effects: Record<string, number> = {}
    let updatedEscalations = [...activeEscalations]
    const todayNewsItems: NewsItem[] = []
    // Track the most impactful event of the day for ripple creation
    // (covers stories, chains, scheduled events — not just single events)
    let bestRippleCandidate: { headline: string; category: string; effects: Record<string, number> } | null = null
    function updateRippleCandidate(headline: string, category: string, eventEffects: Record<string, number>) {
      const impact = Object.values(eventEffects).reduce((sum, e) => sum + Math.abs(e), 0)
      const currentBest = bestRippleCandidate
        ? Object.values(bestRippleCandidate.effects).reduce((sum, e) => sum + Math.abs(e), 0)
        : 0
      if (impact > currentBest) {
        bestRippleCandidate = { headline, category, effects: eventEffects }
      }
    }
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
    // Track used single event headlines (prevents same news twice per game)
    const updatedUsedEventHeadlines = [...usedEventHeadlines]
    // Track used scheduled event IDs (prevents same calendar event twice per game)
    const updatedUsedScheduledEventIds = [...usedScheduledEventIds]
    // Category cooldowns: block same-category events after story/chain resolution
    let updatedCategoryCooldowns = [...categoryCooldowns]

    const newDay = day + 1
    const isScripted = !!get().activeScript

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
      // Skip for presidential abilities (peAssetId === 'presidential') as they use different tracking
      if (pendingAbilityEffects.peAssetId !== 'presidential') {
        revealedUsedPEAbilities = usedPEAbilities.map(u =>
          u.abilityId === pendingAbilityEffects.abilityId
            ? { ...u, didBackfire: pendingAbilityEffects.isBackfire }
            : u
        )
      }

      clearedPendingEffects = true
    }

    // Track if a story/arc headline fired today (prevents stacking with chains/events)
    let storyFiredToday = false

    // ===========================================================================
    // STEP -0.75: PROCESS 3-PART STORY ARC (PE abilities)
    // Day N: Part 1 shown → Day N+1: Part 2 → Day N+2: Part 3 + effects
    // ===========================================================================
    let updatedPendingStoryArc = pendingStoryArc
    let storyArcPEToRemove: string | null = null  // PE asset to remove from backfire
    let queuedPhase2Effects: typeof pendingPhase2Effects = null
    let storyArcFBIHeat = 0  // FBI heat from story arc resolution (applied when Part 3 completes)
    let storyArcTriggeredEncounter: 'sec' | null = null  // Encounter triggered by story arc backfire

    if (pendingStoryArc) {
      const nextPhase = pendingStoryArc.currentPhase + 1

      if (nextPhase === 2) {
        // Day N+1: Show Part 2 headline
        // Silent execution abilities (empty part1) show this as RUMOR instead of DEVELOPING
        const isSilentExecution = !pendingStoryArc.part1Headline
        const prefix = isSilentExecution ? '🕵️' : '📰'
        const labelType = isSilentExecution ? 'rumor' as const : 'developing' as const
        todayNewsItems.push({
          headline: `${prefix} ${pendingStoryArc.part2Headline}`,
          effects: {}, // No effects yet
          labelType,
        })
        updatedPendingStoryArc = { ...pendingStoryArc, currentPhase: 2 as const }
        storyFiredToday = true

      } else if (nextPhase === 3) {
        // Day N+2: Resolution - Apply effects
        const prefix = pendingStoryArc.storyOutcome === 'unfavorable' ? '⚠️' : '🎯'
        todayNewsItems.push({
          headline: `${prefix} ${pendingStoryArc.part3Headline}`,
          effects: pendingStoryArc.effects,
          labelType: 'breaking',
        })

        // Apply price effects
        Object.entries(pendingStoryArc.effects).forEach(([assetId, effect]) => {
          effects[assetId] = (effects[assetId] || 0) + effect
        })

        // Apply FBI heat now that outcome is revealed (was hidden until Part 3)
        storyArcFBIHeat = pendingStoryArc.fbiHeatIncrease

        // Apply backfire consequences if unfavorable
        if (pendingStoryArc.storyOutcome === 'unfavorable' && pendingStoryArc.additionalConsequences) {
          const conseq = pendingStoryArc.additionalConsequences

          // Apply fine
          if (conseq.fine) {
            cashChange -= conseq.fine
          }

          // Mark PE asset for removal (will be filtered later in the function)
          if (conseq.losePE) {
            storyArcPEToRemove = pendingStoryArc.peAssetId
          }

          // Trigger encounter (SEC investigation)
          if (conseq.triggerEncounter === 'sec') {
            storyArcTriggeredEncounter = 'sec'
          }

          // Check for game over risk
          if (conseq.gameOverRisk && Math.random() < conseq.gameOverRisk) {
            // Defer game over - let nextDay() finish so the player sees the day page first.
            // triggerNextDay() will show game over on the next ADVANCE click.
            set({ pendingGameOver: { reason: 'FBI_INVESTIGATION', netWorth: get().getNetWorth() } })
          }
        }

        // Reveal didBackfire in usedPEAbilities
        revealedUsedPEAbilities = revealedUsedPEAbilities.map(u =>
          u.abilityId === pendingStoryArc.abilityId
            ? { ...u, didBackfire: pendingStoryArc.storyOutcome === 'unfavorable' }
            : u
        )

        // Queue Phase 2 effects for project_chimera if favorable
        if (pendingStoryArc.abilityId === 'project_chimera' && pendingStoryArc.storyOutcome === 'favorable') {
          const { PE_ABILITIES } = require('@/lib/game/lifestyleAssets')
          const ability = PE_ABILITIES.project_chimera
          if (ability?.phase2Effects) {
            queuedPhase2Effects = {
              abilityId: pendingStoryArc.abilityId,
              effects: ability.phase2Effects.effects,
              headline: ability.phase2Effects.headline,
              triggerOnDay: newDay + 1, // Day N+3
            }
          }
        }

        // Clear the story arc
        updatedPendingStoryArc = null
        storyFiredToday = true
      }
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
    // STEP -0.4: APPLY PENDING INFLATION EFFECT (Print Money aftermath)
    // ===========================================================================
    let clearedInflationEffect = false
    if (pendingInflationEffect && newDay >= pendingInflationEffect.triggerOnDay) {
      // Apply inflation crash effects
      Object.entries(pendingInflationEffect.effects).forEach(([assetId, effect]) => {
        effects[assetId] = (effects[assetId] || 0) + effect
      })

      // Add inflation news headline
      todayNewsItems.push({
        headline: `📉 ${pendingInflationEffect.headline}`,
        effects: pendingInflationEffect.effects,
        labelType: 'breaking',
      })

      clearedInflationEffect = true
    }

    // ===========================================================================
    // STEP 0.5: LUXURY ASSET DAILY COSTS (itemized per asset)
    // ===========================================================================
    const luxuryCostLabels: Record<string, string> = {
      private_jet: 'JET MAINTENANCE',
      mega_yacht: 'YACHT UPKEEP',
      la_lakers: 'TEAM PAYROLL',
      art_collection: 'ART INSURANCE',
      ferrari_f1_team: 'F1 TEAM COSTS',
      greenland: 'GREENLAND ADMIN',
    }

    let luxuryDailyCost = 0
    ownedLuxury.forEach(id => {
      const asset = getLuxuryAsset(id)
      if (asset && asset.dailyCost !== 0) {
        if (asset.dailyCost > 0) {
          // Cost - deduct from cash
          luxuryDailyCost += asset.dailyCost
          const label = luxuryCostLabels[id] || `${asset.name.toUpperCase()} COSTS`
          todayNewsItems.push({
            headline: `${label}: -$${asset.dailyCost.toLocaleString('en-US')}`,
            effects: {},
            labelType: 'none'
          })
        } else {
          // Income - add to cash (dailyCost is negative, so add to reduce net cost)
          luxuryDailyCost += asset.dailyCost // Adding negative = reducing costs
          const label = `${asset.name.toUpperCase()} INCOME`
          todayNewsItems.push({
            headline: `${label}: +$${Math.abs(asset.dailyCost).toLocaleString('en-US')}`,
            effects: {},
            labelType: 'none'
          })
        }
      }
    })

    if (luxuryDailyCost !== 0) {
      cashChange -= luxuryDailyCost
    }

    // Calculate if we can afford tomorrow's costs (for warning) - only warn if net cost is positive
    const projectedCash = cash + cashChange
    const canAffordTomorrow = projectedCash >= Math.max(0, luxuryDailyCost)
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

    // ===========================================================================
    // SCRIPTED GAME: Inject predetermined content for first 3 games
    // ===========================================================================
    if (isScripted) {
      const scriptedDay = get().activeScript!.days[newDay - 1]
      if (scriptedDay) {
        // Add scripted news headlines
        scriptedDay.news.forEach(n => {
          todayNewsItems.push({ headline: n.headline, effects: n.effects, labelType: n.labelType })
          Object.entries(n.effects).forEach(([assetId, effect]) => {
            effects[assetId] = (effects[assetId] || 0) + effect
          })
        })
        // Add scripted flavor/gossip headline
        if (scriptedDay.flavorHeadline) {
          todayNewsItems.push({ headline: scriptedDay.flavorHeadline, effects: {}, labelType: scriptedDay.flavorHeadline.startsWith('@') ? 'gossip' : 'flavor' })
        }
        // Apply invisible price nudges
        if (scriptedDay.priceNudges) {
          scriptedDay.priceNudges.forEach(({ assetId, nudge }) => {
            effects[assetId] = (effects[assetId] || 0) + nudge
          })
        }
        hasMarketNews = true
      }
    }

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

    // Remove PE asset from story arc backfire (if applicable)
    if (storyArcPEToRemove) {
      updatedOwnedLifestyle = updatedOwnedLifestyle.filter(o => o.assetId !== storyArcPEToRemove)
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

        // Determine label based on whether story continues or ends here
        const hasMoreStages = story.stages[nextStage + 1] !== undefined
        let storyLabelType: import('@/lib/game/types').NewsLabelType
        if (outcome.continues && hasMoreStages) {
          storyLabelType = 'developing' // Mid-story branch → DEVELOPING label
        } else {
          const maxStoryEffect = Math.max(...Object.values(outcome.effects).map(Math.abs), 0)
          storyLabelType = maxStoryEffect >= 0.30 ? 'breaking' : 'news'
        }
        todayNewsItems.push({ headline: outcome.headline, effects: outcome.effects, labelType: storyLabelType })
        hasMarketNews = true
        updateRippleCandidate(outcome.headline, story.category, outcome.effects)

        // Record mood from story resolution
        updatedAssetMoods = recordStoryMood(outcome, newDay, updatedAssetMoods)

        // Merge effects
        Object.entries(outcome.effects).forEach(([assetId, effect]) => {
          effects[assetId] = (effects[assetId] || 0) + effect
        })
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[Story] ADVANCE: "${activeStory.storyId}" stage ${activeStory.currentStage}->${nextStage} — "${outcome.headline}" (label=${storyLabelType}, continues=${!!outcome.continues}, day=${newDay})`)
        }
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
          // Block same-category standalone events for 2 days after story resolution
          updatedCategoryCooldowns.push({ category: story.category, expiresDay: newDay + 2 })
          if (process.env.NODE_ENV === 'development') {
            console.debug(`[Story] RESOLVED: "${activeStory.storyId}" (day=${newDay}, cooldown ${story.category} until day ${newDay + 2})`)
          }
        }
      } else {
        // Intermediate stage - show headline and apply effects (middle stages = DEVELOPING)
        todayNewsItems.push({ headline: currentStageDef.headline, effects: currentStageDef.effects, labelType: 'developing' })
        hasMarketNews = true
        updateRippleCandidate(currentStageDef.headline, story.category, currentStageDef.effects)

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
    // Also inherits true from STEP -0.75 if a PE ability story arc fired a headline today
    storyFiredToday = storyFiredToday || advancedStories.length > 0

    // Story scheduling: escalating probability instead of flat 7%
    // First story eligible from day 4 (after setup phase)
    // After 14+ days with no new story: 40% chance/day
    // After 17+ days: 80% chance/day
    // Allows up to 2 concurrent stories (topic-blocking prevents same-category overlap)
    const activeChainCategories = new Set(updatedChains.map(c => c.category))
    // Merge in resolving chain categories to block those story categories today
    resolvingChainCategories.forEach(cat => activeChainCategories.add(cat))

    const STORY_SCHEDULE_INTERVAL = 14
    const FIRST_STORY_DAY = 3
    const MAX_CONCURRENT_STORIES = 2
    let updatedLastStoryStartDay = lastStoryStartDay
    const daysSinceLastStory = newDay - updatedLastStoryStartDay
    const storyOverdue = newDay >= FIRST_STORY_DAY && daysSinceLastStory >= STORY_SCHEDULE_INTERVAL + 3
    const storyDue = newDay >= FIRST_STORY_DAY && daysSinceLastStory >= STORY_SCHEDULE_INTERVAL
    const storyChance = storyOverdue ? 0.80 : (storyDue ? 0.40 : 0.07)

    // Pass active theme category for theme-aware story selection
    // Use directorState (from previous day) since preparedDirectorState isn't created yet
    const themeCategory = directorState.activeTheme !== 'none'
      ? themeToCategory(directorState.activeTheme)
      : null

    if (!isScripted && updatedStories.length < MAX_CONCURRENT_STORIES && Math.random() < storyChance) {
      const newStory = selectRandomStory(updatedUsedStoryIds, updatedStories, activeChainCategories, updatedAssetMoods, newDay, themeCategory, pendingStoryArc)
      if (newStory) {
        // Show first stage (rumor) of the new story
        const firstStage = newStory.stages[0]
        todayNewsItems.push({ headline: firstStage.headline, effects: firstStage.effects, labelType: 'rumor' })
        hasMarketNews = true
        storyFiredToday = true // Mark that a story fired
        updateRippleCandidate(firstStage.headline, newStory.category, firstStage.effects)

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
        updatedLastStoryStartDay = newDay
        // Cross-exclude: block chains that are mutually exclusive with this story
        if (newStory.excludeChains) {
          updatedUsedChainIds.push(...newStory.excludeChains)
        }
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[Story] STARTED: "${newStory.id}" — "${firstStage.headline}" (category=${newStory.category}, stages=${newStory.stages.length}, day=${newDay})`)
        }
      }
    }

    // ===========================================================================
    // STEP 0f: Process Scheduled Events (calendar events with advance notice)
    // Resolution fires BEFORE chains/events so its mood influences same-day selection
    // ===========================================================================
    let updatedScheduledEvent: ActiveScheduledEvent | null = activeScheduledEvent ? { ...activeScheduledEvent } : null

    // Phase 1: Resolve active scheduled event (Day N+1 — outcome)
    if (updatedScheduledEvent && !updatedScheduledEvent.resolved) {
      const scheduledDef = SCHEDULED_EVENTS.find(e => e.id === updatedScheduledEvent!.eventId)
      if (scheduledDef) {
        // Roll outcome using probability weights (always fires — can't skip a Fed decision)
        const roll = Math.random()
        let cumulative = 0
        let selectedOutcome = scheduledDef.outcomes[scheduledDef.outcomes.length - 1]
        for (const outcome of scheduledDef.outcomes) {
          cumulative += outcome.probability
          if (roll < cumulative) {
            selectedOutcome = outcome
            break
          }
        }

        // Apply outcome effects
        todayNewsItems.push({ headline: selectedOutcome.headline, effects: selectedOutcome.effects, labelType: 'breaking' })
        hasMarketNews = true
        updateRippleCandidate(selectedOutcome.headline, scheduledDef.category, selectedOutcome.effects)
        Object.entries(selectedOutcome.effects).forEach(([assetId, effect]) => {
          effects[assetId] = (effects[assetId] || 0) + effect
        })

        // Record mood from outcome for conflict prevention
        updatedAssetMoods = recordChainOutcomeMood(selectedOutcome, newDay, updatedAssetMoods)

        // Track this event as used for deduplication
        updatedUsedScheduledEventIds.push(updatedScheduledEvent!.eventId)
        // Clear the scheduled event
        updatedScheduledEvent = null
      }
    }

    // Phase 2: Roll for new scheduled event (~8% chance, independent of chain/event rolls)
    if (!isScripted && !updatedScheduledEvent && !storyFiredToday) {
      const scheduledRoll = Math.random()
      if (scheduledRoll < 0.08) {
        // Use blocked categories from active stories/chains
        const scheduledBlockedCats = getActiveTopics(updatedStories, updatedChains)
        const newScheduled = selectRandomScheduledEvent(
          scheduledBlockedCats,
          updatedScheduledEvent,
          newDay,
          gameDuration,
          updatedUsedScheduledEventIds,
        )
        if (newScheduled) {
          // Apply announcement effects (tiny pre-positioning)
          let predictionLine: string | undefined
          if (newScheduled.predictionMarket) {
            const hint = newScheduled.predictionMarket
            const isMiss = Math.random() < (hint.missRate ?? 0.30)
            const displayLabel = isMiss ? hint.missLabel : hint.label
            const displayProb = isMiss
              ? Math.round((0.55 + Math.random() * 0.15) * 100)
              : Math.round((hint.inflatedProbability + (Math.random() * 0.10 - 0.05)) * 100)
            predictionLine = `PREDICTION MARKET: ${displayProb}% CHANCE OF ${displayLabel}`
          }
          todayNewsItems.push({
            headline: newScheduled.announcement.headline,
            effects: newScheduled.announcement.effects,
            labelType: 'scheduled',
            predictionLine,
          })
          hasMarketNews = true
          Object.entries(newScheduled.announcement.effects).forEach(([assetId, effect]) => {
            effects[assetId] = (effects[assetId] || 0) + effect
          })
          // Create active scheduled event
          updatedScheduledEvent = {
            eventId: newScheduled.id,
            startDay: newDay,
            resolved: false,
            category: newScheduled.category,
          }
        }
      }
    }

    // 1. Process active chains - decrement days and check for resolution
    const chainsToResolve: ActiveChain[] = []
    const remainingChains: ActiveChain[] = []

    updatedChains.forEach(chain => {
      if (chain.daysRemaining <= 1) {
        chainsToResolve.push(chain)
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[Chain] TICK: "${chain.rumor}" (id=${chain.chainId}, daysRemaining=${chain.daysRemaining} -> ${chain.daysRemaining - 1}, day=${newDay})`)
        }
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
        // Chain resolutions are narrative payoffs — lower threshold for BREAKING label
        const maxChainEffect = Math.max(...Object.values(outcome.effects).map(Math.abs), 0)
        const chainLabelType = maxChainEffect >= 0.30 ? 'breaking' : 'news'
        todayNewsItems.push({ headline: outcome.headline, effects: outcome.effects, labelType: chainLabelType })
        hasMarketNews = true
        updateRippleCandidate(outcome.headline, activeChain.category, outcome.effects)
        // Merge effects into the daily effects pool
        Object.entries(outcome.effects).forEach(([assetId, effect]) => {
          effects[assetId] = (effects[assetId] || 0) + effect
        })
        updatedUsedChainIds.push(activeChain.chainId)
        // Record mood from chain outcome for conflict prevention
        updatedAssetMoods = recordChainOutcomeMood(outcome, newDay, updatedAssetMoods)
        // Block same-category standalone events for 2 days after chain resolution
        updatedCategoryCooldowns.push({ category: activeChain.category, expiresDay: newDay + 1 })
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[Chain] RESOLVED: "${activeChain.rumor}" -> "${outcome.headline}" (id=${activeChain.chainId}, day=${newDay}, label=${chainLabelType}, cooldown ${activeChain.category} until day ${newDay + 1})`)
        }
      } else {
        // Defensive: chain definition was removed or not found (e.g., hot-reload during dev).
        // Generate a fallback resolution so the rumor doesn't silently vanish.
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Chain] RESOLUTION FAILED: chainDef not found for id="${activeChain.chainId}" (rumor="${activeChain.rumor}", day=${newDay})`)
        }
        todayNewsItems.push({
          headline: `${activeChain.rumor} — SITUATION RESOLVED`,
          effects: {},
          labelType: 'news',
        })
        updatedUsedChainIds.push(activeChain.chainId)
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
    const chainProbabilityBoost = (directorModifiers.chainProbabilityMultiplier - 1) * 0.3

    // Track if we started a new chain (for director state update)
    let chainStartedToday = false
    let eventFiredToday: MarketEvent | null = null

    // 3. Determine if we should start a new chain or fire a single event
    // Skip entirely if story already fired today (prevents headline stacking)
    // 50% chance for chain, 50% for single event (when event happens)
    // No new chain if 2 are already active
    const hasActiveChain = updatedChains.length >= 2
    const eventRoll = Math.random()

    // Phase-based event probability: escalates through the game
    const PHASE_EVENT_CHANCE: Record<string, number> = {
      setup: 0.55,
      rising_action: 0.55,
      midpoint: 0.55,
      escalation: 0.60,
      climax: 0.65,
      resolution: 0.35,
    }
    const baseEventChance = PHASE_EVENT_CHANCE[preparedDirectorState.currentPhase] ?? 0.45

    // Compute blocked categories (active stories + active chains) to prevent conflicts
    const blockedCategories = getActiveTopics(updatedStories, updatedChains, pendingStoryArc)
    // Add category cooldowns from recently resolved stories/chains
    updatedCategoryCooldowns.forEach(cd => {
      if (cd.expiresDay > newDay) blockedCategories.add(cd.category)
    })
    // Clean up expired cooldowns
    updatedCategoryCooldowns = updatedCategoryCooldowns.filter(cd => cd.expiresDay > newDay)

    // Director can force an event type
    let forceChain = directorModifiers.forceEventType === 'chain' && !hasActiveChain
    let forceEvent = directorModifiers.forceEventType === 'spike'

    // Opening hook: guarantee the player sees market action on day 1
    if (newDay === 1 && !forceChain) forceEvent = true

    // Early engagement: guarantee a chain starts on day 2 for non-scripted games
    if (newDay === 2 && !isScripted && updatedChains.length === 0 && !hasActiveChain) {
      forceChain = true
      forceEvent = false
    }

    // Only roll for chain/event if no story fired today (prevents stacking)
    // Director boost increases event probability
    if (!isScripted && !storyFiredToday && (eventRoll < (baseEventChance + directorEventBoost) || forceChain || forceEvent)) {
      // Event happens (phase-based chance + director boost)
      const chainOrSingleRoll = Math.random()

      // Adjusted chain probability with director influence
      const adjustedChainProb = 0.50 + chainProbabilityBoost

      if (!hasActiveChain && (forceChain || (!forceEvent && chainOrSingleRoll < adjustedChainProb))) {
        // Start a new chain (director-influenced probability)
        // Use director-aware selection with category boosts, preferences, and ripple modifiers
        const newChain = selectRandomChainWithDirector(
          updatedUsedChainIds,
          blockedCategories,
          updatedAssetMoods,
          newDay,
          directorModifiers,
          preparedDirectorState.secondOrder,
          gameDuration
        )
        if (newChain) {
          let chainPredictionLine: string | undefined
          if (newChain.predictionMarket) {
            const hint = newChain.predictionMarket
            const isMiss = Math.random() < (hint.missRate ?? 0.30)
            const displayLabel = isMiss ? hint.missLabel : hint.label
            const displayProb = isMiss
              ? Math.round((0.55 + Math.random() * 0.15) * 100)
              : Math.round((hint.inflatedProbability + (Math.random() * 0.10 - 0.05)) * 100)
            chainPredictionLine = `PREDICTION MARKET: ${displayProb}% CHANCE OF ${displayLabel}`
          }
          const activeChain: ActiveChain = {
            chainId: newChain.id,
            startDay: newDay,
            daysRemaining: newChain.duration,
            rumor: newChain.rumor,
            developing: newChain.developing,
            category: newChain.category,
            subcategory: newChain.subcategory,
            predictionLine: chainPredictionLine,
          }
          updatedChains.push(activeChain)
          updatedUsedChainIds.push(newChain.id)
          // Cross-exclude: block stories and chains that are mutually exclusive with this chain
          if (newChain.excludeStories) {
            updatedUsedStoryIds.push(...newChain.excludeStories)
          }
          if (newChain.excludeChains) {
            updatedUsedChainIds.push(...newChain.excludeChains)
          }
          if (process.env.NODE_ENV === 'development') {
            console.debug(`[Chain] STARTED: "${newChain.rumor}" (id=${newChain.id}, duration=${newChain.duration}, day=${newDay})`)
          }
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
          preparedDirectorState.secondOrder,
          updatedUsedEventHeadlines
        )

        if (e) {
          // Single events = NEWS
          todayNewsItems.push({ headline: e.headline, effects: e.effects, labelType: 'news' })
          hasMarketNews = true
          eventFiredToday = e
          updateRippleCandidate(e.headline, e.category, e.effects)
          updatedUsedEventHeadlines.push(e.headline)
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
            remainingInvestments.push({ ...inv, hintShown: true })
            return
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
      // Prefer unused quiet news, fall back to all if exhausted
      const unusedQuiet = QUIET_NEWS.filter(q => !updatedUsedEventHeadlines.includes(q.headline))
      const quietPool = unusedQuiet.length > 0 ? unusedQuiet : QUIET_NEWS
      const randomQuiet = quietPool[Math.floor(Math.random() * quietPool.length)]
      todayNewsItems.push({ headline: randomQuiet.headline, effects: randomQuiet.effects, labelType: 'news' })
      updatedUsedEventHeadlines.push(randomQuiet.headline)
    }

    // 5a. SECONDARY SLOT: Meme/flavor events (~30% of non-quiet days)
    // Creates funny juxtapositions like "NATO ARTICLE 5" + "BEZOS PARTYING IN MIAMI"
    if (!isScripted && hasMarketNews && Math.random() < 0.30) {
      const flavor = selectFlavorEvent(updatedFlavorHeadlines)
      if (flavor) {
        todayNewsItems.push({
          headline: flavor.headline,
          effects: flavor.effects,
          labelType: 'flavor',
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

    if (!isScripted && shouldShowGossip({
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
      // Sync news "EXPECTED IMPACT" display with PE-reduced effects
      todayNewsItems.forEach(newsItem => {
        Object.keys(newsItem.effects).forEach(assetId => {
          if (newsItem.effects[assetId] < 0) {
            newsItem.effects[assetId] = newsItem.effects[assetId] * (1 - negativeReduction)
          }
        })
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
      if (effects[asset.id]) {
        change = change * 0.08 + effects[asset.id]
      }
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
    // Short positions: unrealized P/L (net-settlement model)
    let shortUnrealizedPL = 0
    shortPositions.forEach(pos => {
      const currentPrice = newPrices[pos.assetId] || 0
      shortUnrealizedPL += pos.cashReceived - currentPrice * pos.qty
    })
    // Include luxury assets at base price (fixed prices, no market fluctuation)
    const luxuryValue = ownedLuxury.reduce((sum, id) => {
      const asset = getLuxuryAsset(id)
      return sum + (asset?.basePrice || 0)
    }, 0)
    const currentCash = cash + cashChange
    const { trustFundBalance } = get()
    const nw = Math.round((currentCash + portfolioValue + startupValue + lifestyleValue + leveragedValue + luxuryValue + trustFundBalance + shortUnrealizedPL - creditCardDebt) * 100) / 100

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

    // Scripted games: force startup offer on explicitly scripted days
    if (isScripted) {
      const scriptedDayForStartup = get().activeScript!.days[newDay - 1]
      if (scriptedDayForStartup?.startupOffer && !hasCelebrations) {
        const startup = selectRandomStartup(scriptedDayForStartup.startupOffer.tier, updatedUsedStartupIds)
        if (startup) {
          newStartupOffer = startup
          if (scriptedDayForStartup.startupOffer.tier === 'angel') updatedOfferCounts.angel++
          else updatedOfferCounts.vc++
        }
      }
    }

    // Only offer startups up to gameDuration - 6 (max duration is 6 days, must resolve by end)
    // IMPORTANT: Suppress new startup offers on celebration days - let the player savor their win!
    // Note: gameLength is already defined earlier in this function
    if (!isScripted && !hasCelebrations && newDay <= gameLength - 6) {

      // ========== COOLDOWN CHECK ==========
      // Minimum 6 days between any startup offers (reduced from 8 for better accessibility)
      const cooldownDays = 6
      const daysSinceLastOffer = lastStartupOfferDay ? newDay - lastStartupOfferDay : Infinity
      const cooldownPassed = daysSinceLastOffer >= cooldownDays

      // ========== NET WORTH GATES ==========
      const angelNetWorthGate = 50_000
      const vcNetWorthGate = 1_000_000

      // ========== HARD CAPS (base) ==========
      const angelCap = 2  // Base: 2 Angel offers per game
      const vcCap = 2     // Base: 2 VC offers per game

      // ========== BASE PROBABILITIES ==========
      // Modestly increased for better accessibility (was 2.5% Angel, 4% VC)
      let angelBaseChance = 0.035  // 3.5%
      let vcBaseChance = 0.055     // 5.5%

      // Private Jet luxury asset: +30% deal frequency
      const ownsJet = ownedLuxury.includes('private_jet')
      if (ownsJet) {
        angelBaseChance *= 1.30
        vcBaseChance *= 1.30
      }

      // ========== ATTEMPT OFFER GENERATION ==========
      if (cooldownPassed) {
        let selectedTier: 'angel' | 'vc' | null = null

        // Angel offer check (requires $50K+ net worth)
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
    const totalEffectsMagnitude = Object.keys(effects).length > 0
      ? Object.values(effects).reduce((sum, e) => sum + Math.abs(e), 0)
      : null
    const hadExcitingEvent = isExcitingEvent(
      totalEffectsMagnitude,
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
        eventEffects: Object.keys(effects).length > 0 ? effects : null,
        hadChainResolution: chainResolvedToday,
      },
      directorConfig
    )

    // ===========================================================================
    // SECOND-ORDER EFFECTS: Create new ripples from today's events
    // ===========================================================================
    // Note: Ripple decay already happened at start of day (before event selection)
    // New ripples created here will affect TOMORROW's event selection
    // Use single event if available, otherwise fall back to most impactful story/chain/scheduled event
    const rippleSource = eventFiredToday || bestRippleCandidate
    if (rippleSource) {
      const newRipple = createRippleFromEvent(
        rippleSource.headline,
        rippleSource.category,
        rippleSource.effects,
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
      const eventSentiment = eventFiredToday
        ? getEventSentiment(eventFiredToday)
        : deriveSentiment(rippleSource.effects)
      if (eventSentiment === 'bullish' || eventSentiment === 'bearish') {
        updatedDirectorState = {
          ...updatedDirectorState,
          secondOrder: applyCounterRipple(updatedDirectorState.secondOrder, eventSentiment),
        }
      }
    }

    // ===========================================================================
    // GAME DIRECTOR: Theme activation from today's content
    // ===========================================================================
    // The first significant content (story, chain, spike event, chain resolution)
    // sets the game's narrative theme. Matching content refreshes the theme.
    const HIGH_IMPACT_THRESHOLD = 0.15  // Total |effects| to qualify as theme-setting

    if (updatedDirectorState.activeTheme === 'none') {
      // THEME SEEDING: First significant content sets the theme
      let seedCategory: string | null = null

      // 1. Story that started today (strongest narrative signal)
      const storyStartedToday = updatedStories.find(s => s.startDay === newDay)
      if (storyStartedToday) {
        const storyDef = getStoryById(storyStartedToday.storyId)
        if (storyDef) seedCategory = storyDef.category
      }

      // 2. Chain that started today
      if (!seedCategory && chainStartedToday) {
        const newChain = updatedChains.find(c => c.startDay === newDay)
        if (newChain) seedCategory = newChain.category
      }

      // 3. Chain that resolved today (often the biggest headlines)
      if (!seedCategory && chainResolvedToday && chainsToResolve.length > 0) {
        seedCategory = chainsToResolve[0].category
      }

      // 4. High-impact single event / spike (total |effects| > threshold)
      if (!seedCategory && eventFiredToday) {
        const totalImpact = Object.values(eventFiredToday.effects)
          .reduce((sum, e) => sum + Math.abs(e), 0)
        if (totalImpact >= HIGH_IMPACT_THRESHOLD) {
          seedCategory = eventFiredToday.category
        }
      }

      // Activate theme if we found a category that maps to a theme
      if (seedCategory) {
        const theme = categoryToTheme(seedCategory)
        if (theme) {
          const remainingDays = gameDuration - newDay + 1
          const duration = Math.max(5, Math.ceil(remainingDays * 0.7))
          updatedDirectorState = startTheme(updatedDirectorState, theme, duration)
        }
      }
    } else {
      // THEME REFRESH: Matching content refreshes strength and extends duration
      const activeThemeCategory = themeToCategory(updatedDirectorState.activeTheme)
      if (activeThemeCategory) {
        const matchingContentFired =
          // Story started matching theme
          updatedStories.some(s => {
            const def = getStoryById(s.storyId)
            return def?.category === activeThemeCategory && s.startDay === newDay
          }) ||
          // Chain started matching theme
          (chainStartedToday && updatedChains.find(c => c.startDay === newDay)?.category === activeThemeCategory) ||
          // Chain resolved matching theme
          (chainResolvedToday && chainsToResolve.some(c => c.category === activeThemeCategory)) ||
          // Single event matching theme
          (eventFiredToday?.category === activeThemeCategory)

        if (matchingContentFired) {
          updatedDirectorState = {
            ...updatedDirectorState,
            themeStrength: Math.min(1.0, updatedDirectorState.themeStrength + 0.3),
            themeDaysRemaining: Math.max(updatedDirectorState.themeDaysRemaining, 5),
          }
        }
      }
    }

    // ===========================================================================
    // HEAT/SUSPICION: No longer apply natural decay (removed in rework)
    // ===========================================================================
    const { wifeSuspicion } = get()
    // Wife heat no longer decays naturally - only increases on losses
    const newWifeSuspicion = wifeSuspicion

    // ===========================================================================
    // CREDIT CARD DEBT: Apply daily interest
    // ===========================================================================
    // Apply 1.75% daily interest to credit card debt
    const dailyInterest = creditCardDebt * 0.0175
    const newCreditCardDebt = creditCardDebt + dailyInterest

    // ===========================================================================
    // FBI HEAT: DISABLED (kept for future use - always 0)
    // ===========================================================================
    const newFBIHeat = 0

    // 8. Update state
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Chain] STATE day=${newDay}: activeChains=${updatedChains.length}, todayNews=${todayNewsItems.length}, headlines=[${todayNewsItems.map(n => n.headline.substring(0, 50)).join(' | ')}]`)
    }
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
      lastStoryStartDay: updatedLastStoryStartDay,
      gossipState: updatedGossipState,
      activeScheduledEvent: updatedScheduledEvent,
      usedScheduledEventIds: updatedUsedScheduledEventIds,
      assetMoods: updatedAssetMoods,
      categoryCooldowns: updatedCategoryCooldowns,
      usedFlavorHeadlines: updatedFlavorHeadlines,
      usedEventHeadlines: updatedUsedEventHeadlines,
      // Clear pending PE ability effects after they've been applied (for Presidential abilities)
      pendingAbilityEffects: clearedPendingEffects ? null : pendingAbilityEffects,
      // Update 3-part story arc (for PE abilities)
      pendingStoryArc: updatedPendingStoryArc,
      // Reveal didBackfire on usedPEAbilities now that effects have been applied
      usedPEAbilities: revealedUsedPEAbilities,
      // Clear pending phase 2 effects after they've been applied, or use newly queued effects
      pendingPhase2Effects: queuedPhase2Effects || (clearedPhase2Effects ? null : pendingPhase2Effects),
      // Clear pending inflation effect after it's been applied (Print Money aftermath)
      pendingInflationEffect: clearedInflationEffect ? null : pendingInflationEffect,
      // Update Game Director state
      directorState: updatedDirectorState,
    })

    // 9. Check win/lose conditions (must run BEFORE 8.5's potential early return)
    // Re-calculate net worth after all updates (includes margin positions)
    const finalNetWorth = get().getNetWorth()
    // Note: gameDuration already destructured at top of function

    const finalCash = get().cash
    if (finalNetWorth < 0 && finalCash <= 0 && !get().pendingGameOver) {
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

      // Don't show game over immediately - let the player see their negative net worth first.
      // On the next ADVANCE click, triggerNextDay() will show the game over screen.
      set({ pendingGameOver: { reason: gameOverReason, netWorth: finalNetWorth } })
    } else if (newDay > gameDuration) {
      // Player survived the full duration - WIN!
      saveGameResult(true, finalNetWorth, gameDuration, gameDuration, undefined, get().isLoggedIn, get().isUsingProTrial, get().username, get().tradeLog)
      set({ screen: 'win', isUsingProTrial: false })
    }

    // 8.5. Trigger SEC encounter from story arc backfire (if applicable)
    // This must happen AFTER the main set() so all effects are applied
    // The encounter popup will block until resolved, then day continues without double-advancing
    if (storyArcTriggeredEncounter === 'sec') {
      set({
        pendingEncounter: {
          type: 'sec',
          skipNextDayOnResolve: true,  // Don't call nextDay() again when resolved
        },
      })
      return  // Exit early - encounter must be resolved before continuing
    }
  },

  // Called when user clicks "Next Day" - checks for encounter before advancing
  triggerNextDay: () => {
    const { day, cash, encounterState, pendingStartupOffer, gameDuration, isCelebrationDay, ownedLuxury, showPortfolioBeforeAdvance, holdings, pendingGameOver, activeScript } = get()
    const netWorth = get().getNetWorth()

    // If there's a pending game over (player saw their negative net worth last turn), now show game over
    if (pendingGameOver) {
      saveGameResult(false, pendingGameOver.netWorth, day, gameDuration, pendingGameOver.reason, get().isLoggedIn, get().isUsingProTrial, get().username, get().tradeLog)
      set({ screen: 'gameover', gameOverReason: pendingGameOver.reason, pendingGameOver: null, isUsingProTrial: false })
      return
    }

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

    // Scripted games: only trigger encounters on explicitly scripted days
    if (activeScript) {
      const nextDayNum = day + 1
      const nextScriptedDay = activeScript.days[nextDayNum - 1]
      if (nextScriptedDay?.encounter) {
        set({
          pendingEncounter: { type: nextScriptedDay.encounter },
          queuedStartupOffer: pendingStartupOffer,
          pendingStartupOffer: null,
        })
        return
      }
      get().nextDay()
      return
    }

    // Art Collection reduces Tax Event probability
    const ownsArtCollection = ownedLuxury.includes('art_collection')
    const { wifeSuspicion, fbiHeat, hasPardoned } = get()

    // Check if an encounter should trigger
    const encounterType = rollForEncounter(day + 1, encounterState, cash, { netWorth, gameLength: gameDuration, ownsArtCollection, wifeSuspicion, fbiHeat, hasPardoned })

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

  setPreloadedScenario: (scenario) => set({ preloadedScenario: scenario }),

  // ============================================================================
  // TRADING ACTIONS
  // ============================================================================

  buy: (assetId: string, qty: number) => {
    const { cash, prices, holdings, costBasis } = get()
    const price = prices[assetId]
    const cost = qty * price

    if (cost > cash) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

    if (qty <= 0) return
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

    appendTradeLog(get, set, {
      assetId, assetName: asset?.name || assetId, action: 'buy', category: 'stock',
      quantity: qty, price, totalValue: cost,
    })
  },

  sell: (assetId: string, qty: number) => {
    const { cash, holdings, prices, costBasis } = get()
    const owned = holdings[assetId] || 0

    if (qty > owned || qty <= 0) {
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

    appendTradeLog(get, set, {
      assetId, assetName: asset?.name || assetId, action: 'sell', category: 'stock',
      quantity: qty, price, totalValue: revenue, profitLoss,
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

    appendTradeLog(get, set, {
      assetId, assetName: asset?.name || assetId, action: 'leverage_buy', category: 'stock',
      quantity: qty, price, totalValue: totalCost, leverage,
    })
  },

  shortSell: (assetId: string, qty: number) => {
    const { cash, prices, shortPositions, day } = get()
    const price = prices[assetId]
    const positionValue = qty * price

    // Total short exposure (existing + new)
    const totalShortProceeds = shortPositions.reduce((sum, pos) => sum + pos.cashReceived, 0)
    const totalExposureAfter = totalShortProceeds + positionValue

    // Limit: total short exposure cannot exceed available capital
    if (totalExposureAfter > cash) {
      set({ activeErrorMessage: 'NOT ENOUGH COLLATERAL FOR SHORT' })
      return
    }

    const cashReceived = positionValue
    const asset = ASSETS.find(a => a.id === assetId)

    const newPosition: ShortPosition = {
      id: generatePositionId(),
      assetId,
      qty,
      entryPrice: price,
      cashReceived,
      openDay: day,
    }

    // Cash stays unchanged - short proceeds held in escrow (net-settlement on cover)
    set({
      shortPositions: [...shortPositions, newPosition],
      activeBuyMessage: `SHORTED ${qty} ${asset?.name} @ $${price.toLocaleString('en-US')}`,
    })

    appendTradeLog(get, set, {
      assetId, assetName: asset?.name || assetId, action: 'short_sell', category: 'stock',
      quantity: qty, price, totalValue: positionValue,
    })
  },

  coverShort: (positionId: string) => {
    const { cash, prices, shortPositions } = get()
    const position = shortPositions.find(p => p.id === positionId)
    if (!position) return

    const currentPrice = prices[position.assetId]
    if (currentPrice == null) return
    const coverCost = position.qty * currentPrice
    const profitLoss = position.cashReceived - coverCost
    const profitLossPct = position.cashReceived > 0 ? (profitLoss / position.cashReceived) * 100 : 0

    // Net-settlement: profitable shorts always coverable, losing shorts need cash for the loss
    if (profitLoss < 0 && Math.abs(profitLoss) > cash) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH TO COVER LOSSES' })
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

    // Net-settlement: cash += profitLoss (positive for profitable shorts, negative for losing)
    set({
      cash: Math.round((cash + profitLoss) * 100) / 100,
      shortPositions: newShortPositions,
      activeSellToast: {
        message: tradeMessage,
        profitLossPct,
        isProfit: profitLoss >= 0,
      },
    })

    appendTradeLog(get, set, {
      assetId: position.assetId, assetName: asset?.name || position.assetId,
      action: 'cover_short', category: 'stock',
      quantity: position.qty, price: currentPrice, totalValue: coverCost, profitLoss,
    })
  },

  closeLeveragedPosition: (positionId: string) => {
    const { cash, prices, leveragedPositions } = get()
    const position = leveragedPositions.find(p => p.id === positionId)
    if (!position) return

    const currentPrice = prices[position.assetId]
    if (currentPrice == null) return
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

    appendTradeLog(get, set, {
      assetId: position.assetId, assetName: asset?.name || position.assetId,
      action: 'leverage_close', category: 'stock',
      quantity: position.qty, price: currentPrice, totalValue: saleProceeds,
      leverage: position.leverage, profitLoss,
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

    const tradeCategory = asset.category === 'private_equity' ? 'private_equity' : 'property'
    const tradeAction = asset.category === 'private_equity' ? 'buy_pe' : 'buy_property'
    appendTradeLog(get, set, {
      assetId, assetName: asset.name, action: tradeAction, category: tradeCategory,
      quantity: 1, price, totalValue: price,
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

    const sellCategory = asset.category === 'private_equity' ? 'private_equity' : 'property'
    const sellAction = asset.category === 'private_equity' ? 'sell_pe' : 'sell_property'
    appendTradeLog(get, set, {
      assetId, assetName: asset.name, action: sellAction, category: sellCategory,
      quantity: 1, price: salePrice, totalValue: salePrice, profitLoss,
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

    appendTradeLog(get, set, {
      assetId: activePEExitOffer.assetId, assetName: asset.name,
      action: 'pe_exit', category: 'private_equity',
      quantity: 1, price: activePEExitOffer.offerAmount, totalValue: activePEExitOffer.offerAmount,
      profitLoss,
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

    // Defensive: if pending game over was set, handle it before advancing
    const { pendingGameOver } = get()
    if (pendingGameOver) {
      const { day, gameDuration } = get()
      saveGameResult(false, pendingGameOver.netWorth, day, gameDuration, pendingGameOver.reason, get().isLoggedIn, get().isUsingProTrial, get().username)
      set({ screen: 'gameover', gameOverReason: pendingGameOver.reason, pendingGameOver: null, isUsingProTrial: false })
      return
    }

    // Now run the real advance logic (duplicated encounter check from triggerNextDay)
    const { day, cash, encounterState, pendingStartupOffer, gameDuration, isCelebrationDay, ownedLuxury, activeScript: activeScriptForAdvance } = get()
    const netWorth = get().getNetWorth()
    if (isCelebrationDay) {
      get().nextDay()
      return
    }
    // Scripted games: only trigger encounters on explicitly scripted days
    if (activeScriptForAdvance) {
      const nextDayNum = day + 1
      const nextScriptedDay = activeScriptForAdvance.days[nextDayNum - 1]
      if (nextScriptedDay?.encounter) {
        set({
          pendingEncounter: { type: nextScriptedDay.encounter },
          queuedStartupOffer: pendingStartupOffer,
          pendingStartupOffer: null,
        })
        return
      }
      get().nextDay()
      return
    }
    const ownsArtCollection = ownedLuxury.includes('art_collection')
    const { wifeSuspicion, fbiHeat, hasPardoned } = get()
    const encounterType = rollForEncounter(day + 1, encounterState, cash, { netWorth, gameLength: gameDuration, ownsArtCollection, wifeSuspicion, fbiHeat, hasPardoned })
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
  setActiveActionsTab: (tab: 'leverage' | 'buy' | 'casino') => set({ activeActionsTab: tab }),
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
          // Defer game over - let the player see their $0 balance on the day page first.
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
            pendingGameOver: { reason: 'BANKRUPT', netWorth: 0 },
            message: `${result.headline} — Assets seized, still couldn't cover the debt.`,
          })
          return
        }

        // Player CAN cover it — let them choose which assets to liquidate
        set({
          pendingLiquidation: {
            amountNeeded: amountNeeded,
            reason: encounterType as 'sec' | 'divorce' | 'tax',
            headline: result.headline,
            encounterType: encounterType,
            encounterState: newEncounterState,
          },
          pendingEncounter: null,
        })
        return // Exit early - let LiquidationSelectionOverlay handle it
      }
    } else if (result.cashChange !== undefined) {
      // Standard cash change (non-liquidation encounters)
      newCash = cash + result.cashChange
    }

    // Check for game over conditions
    if (result.gameOver) {
      // Defer game over - let the player see the day page first.
      // triggerNextDay() will show game over on the next ADVANCE click.
      set({
        cash: Math.round(newCash * 100) / 100,
        holdings: newHoldings,
        encounterState: newEncounterState,
        pendingEncounter: null,
        queuedStartupOffer: null,
        pendingGameOver: { reason: result.gameOverReason || 'UNKNOWN', netWorth: get().getNetWorth() },
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

    // If encounter was triggered mid-day (from story arc backfire), skip nextDay
    // because the day was already processed before the encounter popup appeared
    if (pendingEncounter?.skipNextDayOnResolve) {
      // Bankruptcy check: the SEC encounter penalty may have pushed the player bankrupt,
      // and nextDay() won't run to check, so we must check here
      const nw = get().getNetWorth()
      const c = get().cash
      if (nw < 0 && c <= 0 && !get().pendingGameOver) {
        set({ pendingGameOver: { reason: 'BANKRUPT', netWorth: nw } })
      }
      return
    }

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

  confirmLiquidationSelection: (selectedAssets: Array<{ type: 'luxury' | 'lifestyle' | 'leveraged' | 'short' | 'trading'; id: string; currentValue: number; quantity: number }>) => {
    const { pendingLiquidation, cash, holdings, prices, costBasis, ownedLifestyle, ownedLuxury, leveragedPositions, shortPositions, wifeSuspicion, queuedStartupOffer } = get()

    if (!pendingLiquidation) return

    const { amountNeeded, headline, encounterState: newEncounterState } = pendingLiquidation

    // Calculate total value being liquidated
    let totalLiquidated = 0
    let newHoldings = { ...holdings }
    let newCostBasis = { ...costBasis }
    let newOwnedLifestyle = [...ownedLifestyle]
    let newOwnedLuxury = [...ownedLuxury]
    let newLeveragedPositions = [...leveragedPositions]
    let newShortPositions = [...shortPositions]

    // Process each selected asset
    selectedAssets.forEach(asset => {
      if (asset.type === 'luxury') {
        // Remove luxury asset
        newOwnedLuxury = newOwnedLuxury.filter(id => id !== asset.id)
        totalLiquidated += asset.currentValue
      } else if (asset.type === 'lifestyle') {
        // Remove lifestyle asset
        newOwnedLifestyle = newOwnedLifestyle.filter(owned => owned.assetId !== asset.id)
        totalLiquidated += asset.currentValue
      } else if (asset.type === 'leveraged') {
        // Close leveraged position (equity value)
        newLeveragedPositions = newLeveragedPositions.filter(p => p.id !== asset.id)
        totalLiquidated += asset.currentValue
      } else if (asset.type === 'short') {
        // Close short position (profit value)
        newShortPositions = newShortPositions.filter(p => p.id !== asset.id)
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
          delete newCostBasis[asset.id]  // Clean up cost basis too
        }
      }
    })

    // Calculate new cash: existing cash + liquidated value - penalty amount
    const newCash = cash + totalLiquidated - amountNeeded
    const finalHeadline = `${headline} (Assets seized to cover penalty)`

    // Liquidation causes significant suspicion spike
    const newWifeSuspicion = Math.min(100, wifeSuspicion + 15)

    // Clear liquidation and update state
    set({
      cash: Math.round(newCash * 100) / 100,
      holdings: newHoldings,
      costBasis: newCostBasis,
      ownedLifestyle: newOwnedLifestyle,
      ownedLuxury: newOwnedLuxury,
      leveragedPositions: newLeveragedPositions,
      shortPositions: newShortPositions,
      wifeSuspicion: newWifeSuspicion,
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

    // Check if ability already used (skip for repeatable abilities like insider_tip)
    if (!ability.repeatable && usedPEAbilities.some(u => u.abilityId === abilityId)) {
      set({ activeErrorMessage: 'ABILITY ALREADY USED' })
      return
    }

    // For repeatable abilities, block while a story arc is pending (can't stack)
    if (ability.repeatable && get().pendingStoryArc) {
      set({ activeErrorMessage: 'TIP ALREADY IN PROGRESS' })
      return
    }

    // Check if player has enough cash
    if (cash < ability.cost) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

    // =========================================================================
    // SPECIAL CASE: Run for President (triggers election popup instead of normal flow)
    // =========================================================================
    if (abilityId === 'run_for_president') {
      // Pre-compute election result (50/50)
      const isWin = Math.random() < 0.5

      // Deduct cost and trigger election popup
      set({
        cash: cash - ability.cost,
        pendingElection: { result: isWin ? 'win' : 'loss' },
        usedPEAbilities: [...usedPEAbilities, {
          abilityId,
          usedOnDay: day,
          didBackfire: !isWin,
        }],
        activeBuyMessage: '🗳️ ELECTION DAY - YOUR FATE IS BEING DECIDED...',
      })
      return
    }

    // =========================================================================
    // SPECIAL CASE: Insider Tip (Smokey's on K) — randomly pick a bill scenario
    // =========================================================================
    if (abilityId === 'insider_tip') {
      const { INSIDER_TIP_SCENARIOS } = require('@/lib/game/lifestyleAssets')

      // Pick random scenario
      const scenario = INSIDER_TIP_SCENARIOS[Math.floor(Math.random() * INSIDER_TIP_SCENARIOS.length)]

      // Roll for outcome (15% backfire, hidden until Part 3)
      const isUnfavorable = Math.random() < ability.backfireChance
      const storyOutcome = isUnfavorable ? 'unfavorable' : 'favorable'
      const effects = isUnfavorable ? (scenario.backfireEffects.priceEffects || {}) : scenario.successEffects

      const part3Headline = isUnfavorable ? scenario.headlines.backfirePart3 : scenario.headlines.successPart3
      const fbiHeatIncrease = isUnfavorable ? 15 : 5

      const pendingStoryArc = {
        abilityId: 'insider_tip' as PEAbilityId,
        peAssetId,
        category: scenario.topic.category,
        subcategory: scenario.topic.subcategory,
        storyOutcome: storyOutcome as 'favorable' | 'unfavorable',
        currentPhase: 1 as const,
        startDay: day,
        part1Headline: '',  // Silent execution
        part2Headline: scenario.headlines.part2,
        part3Headline,
        effects,
        fbiHeatIncrease,
        additionalConsequences: isUnfavorable ? {
          fine: scenario.backfireEffects.fine,
          triggerEncounter: scenario.backfireEffects.triggerEncounter,
        } : undefined,
      }

      const newUsedAbilities = [...usedPEAbilities, {
        abilityId: 'insider_tip' as PEAbilityId,
        usedOnDay: day,
        didBackfire: null,
      }]

      const hintMessage = `🍖 Your man at Smokey's leans in: "Keep your eye on ${scenario.sectorHint} tomorrow..."`

      set({
        cash: cash - ability.cost,
        usedPEAbilities: newUsedAbilities,
        pendingStoryArc,
        wifeSuspicion: Math.min(100, wifeSuspicion + 10),
        activeBuyMessage: hintMessage,
      })
      return
    }

    // Deduct cost
    const newCash = cash - ability.cost

    // Roll for outcome (hidden until Part 3 on Day N+2)
    const isUnfavorable = Math.random() < ability.backfireChance
    const storyOutcome = isUnfavorable ? 'unfavorable' : 'favorable'

    // Determine effects based on outcome
    const effects = isUnfavorable ? (ability.backfireEffects.priceEffects || {}) : ability.successEffects

    // Get headlines for 3-part story arc
    const headlines = ABILITY_HEADLINES[abilityId]
    const part1Headline = headlines?.part1 || `${ability.name.toUpperCase()} OPERATION UNDERWAY`
    const part2Headline = headlines?.part2 || `${ability.name.toUpperCase()} DEVELOPING...`
    const part3Headline = isUnfavorable
      ? (headlines?.backfirePart3 || `${ability.name.toUpperCase()} OPERATION EXPOSED`)
      : (headlines?.successPart3 || `${ability.name.toUpperCase()} SUCCESSFUL`)

    // Create 3-part story arc (replaces pendingAbilityEffects for PE abilities)
    // FBI heat is stored but not applied until Day N+2 when outcome is revealed
    const fbiHeatIncrease = isUnfavorable ? 15 : 5
    const abilityTopics = PE_ABILITY_TOPICS[abilityId]
    const pendingStoryArc = {
      abilityId,
      peAssetId,
      category: abilityTopics.category,
      subcategory: abilityTopics.subcategory,
      storyOutcome: storyOutcome as 'favorable' | 'unfavorable',
      currentPhase: 1 as const,
      startDay: day,
      part1Headline,
      part2Headline,
      part3Headline,
      effects,
      fbiHeatIncrease,  // Applied on Day N+2 when outcome revealed
      additionalConsequences: isUnfavorable ? {
        losePE: ability.backfireEffects.losePE,
        fine: ability.backfireEffects.fine,
        triggerEncounter: ability.backfireEffects.triggerEncounter,
        gameOverRisk: ability.backfireEffects.gameOverRisk,
      } : undefined,
    }

    // Record ability as used (didBackfire is null until Part 3 on Day N+2)
    const newUsedAbilities = [...usedPEAbilities, {
      abilityId,
      usedOnDay: day,
      didBackfire: null,  // Outcome hidden until Day N+2 when Part 3 resolves
    }]

    // Message - don't reveal outcome yet
    const message = `🎯 ${ability.emoji} ${ability.name.toUpperCase()} INITIATED`

    // Increase wife suspicion by 10% for PE ability execution (immediate)
    const newWifeSuspicion = Math.min(100, wifeSuspicion + 10)

    // Note: FBI heat is NOT applied here - it's stored in pendingStoryArc.fbiHeatIncrease
    // and applied on Day N+2 when the outcome is revealed (to avoid leaking hidden outcome)

    // Silent execution abilities (e.g. Smokey's on K) skip Part 1 headline — RUMOR fires next day
    if (ability.silentExecution) {
      set({
        cash: newCash,
        usedPEAbilities: newUsedAbilities,
        pendingStoryArc,
        wifeSuspicion: newWifeSuspicion,
        activeBuyMessage: message,
      })
    } else {
      const part1NewsItem = {
        headline: `🕵️ ${part1Headline}`,
        effects: {}, // No effects until Part 3
        labelType: 'rumor' as const,
      }
      set({
        cash: newCash,
        usedPEAbilities: newUsedAbilities,
        pendingStoryArc,
        wifeSuspicion: newWifeSuspicion,
        activeBuyMessage: message,
        todayNews: [...todayNews, part1NewsItem],
      })
    }
  },

  canExecutePEAbility: (abilityId, peAssetId) => {
    const { cash, ownedLifestyle, usedPEAbilities, pendingStoryArc } = get()

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

    // Repeatable abilities: block only while a story arc is pending (can't stack)
    if (ability.repeatable) {
      if (pendingStoryArc) return false
    } else {
      // One-time abilities: block if already used
      if (usedPEAbilities.some(u => u.abilityId === abilityId)) return false
    }

    // Check cash
    if (cash < ability.cost) return false

    return true
  },

  getPEAbilityStatus: (abilityId) => {
    const { usedPEAbilities, pendingStoryArc } = get()
    const { PE_ABILITIES } = require('@/lib/game/lifestyleAssets')
    const ability = PE_ABILITIES[abilityId]

    // Repeatable abilities: "used" only means "currently in progress"
    if (ability?.repeatable) {
      const isPending = pendingStoryArc?.abilityId === abilityId
      return {
        isUsed: isPending,
        usedOnDay: isPending ? pendingStoryArc.startDay : null,
        didBackfire: null,
      }
    }

    // One-time abilities: original behavior
    const used = usedPEAbilities.find(u => u.abilityId === abilityId)
    return {
      isUsed: !!used,
      usedOnDay: used?.usedOnDay ?? null,
      didBackfire: used?.didBackfire ?? null,
    }
  },

  // ============================================================================
  // PRESIDENTIAL ACTIONS (Endgame after winning election)
  // ============================================================================

  confirmElectionResult: () => {
    const { pendingElection, lifestylePrices, fbiHeat } = get()
    if (!pendingElection) return

    if (pendingElection.result === 'win') {
      // Victory: become president
      set({
        isPresident: true,
        pendingElection: null,
        activeBuyMessage: '🏛️ MR. PRESIDENT - THE OVAL OFFICE AWAITS',
      })
    } else {
      // Loss: Apex Media -50%, FBI heat +40
      const currentApexPrice = lifestylePrices['pe_apex_media'] || 12_000_000_000
      const newApexPrice = currentApexPrice * 0.5

      set({
        pendingElection: null,
        lifestylePrices: {
          ...lifestylePrices,
          pe_apex_media: newApexPrice,
        },
        fbiHeat: Math.min(100, fbiHeat + 40),
        activeBuyMessage: '📉 CAMPAIGN COLLAPSES - MEDIA EMPIRE IN SHAMBLES',
      })
    }
  },

  executePresidentialAbility: (abilityId) => {
    const {
      cash,
      day,
      isPresident,
      usedPresidentialAbilities,
      fbiHeat,
      lifestylePrices,
      todayNews,
    } = get()

    // Import presidential abilities
    const { PRESIDENTIAL_ABILITIES } = require('@/lib/game/presidentialAbilities')
    const ability = PRESIDENTIAL_ABILITIES[abilityId]

    if (!ability) {
      set({ activeErrorMessage: 'INVALID ABILITY' })
      return
    }

    // Validate: must be president
    if (!isPresident) {
      set({ activeErrorMessage: 'MUST BE PRESIDENT' })
      return
    }

    // Validate: not already used
    if (usedPresidentialAbilities.some(u => u.abilityId === abilityId)) {
      set({ activeErrorMessage: 'ABILITY ALREADY USED' })
      return
    }

    // Validate: has enough cash
    if (cash < ability.cost) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

    // Deduct cost
    let newCash = cash - ability.cost
    let newFbiHeat = fbiHeat
    let hasPardoned = false
    let updatedLifestylePrices = { ...lifestylePrices }
    let pendingInflation = null

    // Handle special effects
    if (ability.cashGain) {
      newCash += ability.cashGain
    }

    if (ability.fbiReset) {
      newFbiHeat = 0
    }

    if (ability.permanentImmunity) {
      hasPardoned = true
    }

    // Ban Social Media: Apex Media +100%
    if (ability.apexBoost) {
      const apexPrice = lifestylePrices['pe_apex_media'] || 12_000_000_000
      updatedLifestylePrices['pe_apex_media'] = apexPrice * (1 + ability.apexBoost)
    }

    // Print Money: Queue delayed inflation
    if (ability.delayedEffect) {
      pendingInflation = {
        triggerOnDay: day + ability.delayedEffect.daysDelay,
        effects: ability.delayedEffect.effects,
        headline: ability.delayedEffect.headline,
      }
    }

    // Create pending effects for next day (like regular PE abilities)
    const pendingEffects = Object.keys(ability.effects).length > 0 ? {
      abilityId, // Now properly typed as PEAbilityId | PresidentialAbilityId
      effects: ability.effects,
      isBackfire: false,
      peAssetId: 'presidential',
      eventHeadline: `🏛️ PRESIDENT SIGNS ${ability.name.toUpperCase()} INTO LAW`,
    } : null

    // Add rumor to today's news
    const rumorNewsItem = {
      headline: `🏛️ PRESIDENT PREPARING TO SIGN ${ability.name.toUpperCase()}`,
      effects: {},
      labelType: 'breaking' as const,
    }

    // Build state update
    const stateUpdate: any = {
      cash: newCash,
      usedPresidentialAbilities: [...usedPresidentialAbilities, { abilityId, usedOnDay: day }],
      fbiHeat: newFbiHeat,
      lifestylePrices: updatedLifestylePrices,
      activeBuyMessage: `🏛️ ${ability.emoji} ${ability.name.toUpperCase()} SIGNED INTO LAW`,
      todayNews: [...todayNews, rumorNewsItem],
    }

    if (hasPardoned) {
      stateUpdate.hasPardoned = true
    }

    if (pendingInflation) {
      stateUpdate.pendingInflationEffect = pendingInflation
    }

    if (pendingEffects) {
      stateUpdate.pendingAbilityEffects = pendingEffects
    }

    set(stateUpdate)
  },

  canExecutePresidentialAbility: (abilityId) => {
    const { cash, isPresident, usedPresidentialAbilities } = get()

    // Import presidential abilities
    const { PRESIDENTIAL_ABILITIES } = require('@/lib/game/presidentialAbilities')
    const ability = PRESIDENTIAL_ABILITIES[abilityId]
    if (!ability) return false

    // Must be president
    if (!isPresident) return false

    // Must not have used this ability
    if (usedPresidentialAbilities.some(u => u.abilityId === abilityId)) return false

    // Must have enough cash
    if (cash < ability.cost) return false

    return true
  },

  getPresidentialAbilityStatus: (abilityId) => {
    const { usedPresidentialAbilities } = get()
    const used = usedPresidentialAbilities.find(u => u.abilityId === abilityId)

    return {
      isUsed: !!used,
      usedOnDay: used?.usedOnDay ?? null,
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

    // Short positions: unrealized P/L (positive = profitable, price dropped)
    // Cash is NOT inflated by short proceeds, so we add the P/L directly
    const shortUnrealizedPL = shortPositions.reduce((sum, pos) => {
      const currentPrice = prices[pos.assetId] || 0
      return sum + (pos.cashReceived - currentPrice * pos.qty)
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

    // Net worth = cash + portfolio + leveragedEquity + startups + lifestyle + luxury + trust + shortPL - creditCardDebt
    return Math.round((cash + portfolio + leveragedValue + startupValue + lifestyleValue + luxuryValue + trustFundBalance + shortUnrealizedPL - creditCardDebt) * 100) / 100 || 0
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

  // Get total portfolio change from Day 1 (based on $50K starting cash)
  getTotalPortfolioChange: () => {
    const currentNetWorth = get().getNetWorth()
    return (currentNetWorth / 50000) * 100
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

  // Casino gambling - apply cash change from roulette/blackjack
  applyCasinoResult: (cashDelta: number) => {
    const { cash } = get()
    set({ cash: Math.max(0, Math.round((cash + cashDelta) * 100) / 100) })
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
