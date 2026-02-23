import type { MechanicsSliceCreator } from '../types'
import { ASSETS } from '@/lib/game/assets'
import { EVENTS, CATEGORY_WEIGHTS, QUIET_NEWS, LIFESTYLE_EFFECTS, expandLifestyleEffects, rollForPEExit, ASSET_EVENT_MULTIPLIERS } from '@/lib/game/events'
import { EVENT_CHAINS, CHAIN_CATEGORY_WEIGHTS } from '@/lib/game/eventChains'
import { SCHEDULED_EVENTS } from '@/lib/game/scheduledEvents'
import { ANGEL_STARTUPS, VC_STARTUPS } from '@/lib/game/startups'
import { LIFESTYLE_ASSETS } from '@/lib/game/lifestyleAssets'
import { checkMilestone, getAllReachedMilestones } from '@/lib/game/milestones'
import { STORIES, getStoryById, selectRandomStory } from '@/lib/game/stories'
import { DEFAULT_GOSSIP_STATE, shouldShowGossip, createGossipNewsItem, isMarketSideways, hasMajorEventToday } from '@/lib/game/gossip'
import { isDev } from '@/lib/env'
import { selectFlavorEvent } from '@/lib/game/flavorEvents'
import { DEFAULT_ENCOUNTER_STATE, rollForEncounter, resolveTax, shouldSkipScriptedEncounter } from '@/lib/game/encounters'
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
  NewsLabelType,
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
  incrementAnonymousGames,
} from '@/lib/game/persistence'
import { getScriptedGame, getScriptedGameNumber } from '@/lib/game/scriptedGames'
import {
  getRemainingGames,
  getLimitType,
  generateGameId,
  type GameOutcome,
  type GameHistoryEntry,
} from '@/lib/game/userState'
import { recordGameEnd } from '@/lib/game/persistence'

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

import {
  createInitialDirectorState,
  DEFAULT_DIRECTOR_CONFIG,
  getDirectorModifiers,
  updateDirectorState,
  prepareDirectorForDay,
  isExcitingEvent,
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
import { capture } from '@/lib/posthog'

if (typeof window !== 'undefined') {
  setTimeout(() => retryQueuedScores(), 3000)
}

function detectLabelType(headline: string, defaultLabel: NewsLabelType): NewsLabelType {
  if (/^(?:🎯|⚠️)\s*BREAKING:|^BREAKING:/.test(headline)) return 'breaking'
  if (/^📰\s*DEVELOPING:|^DEVELOPING:/.test(headline)) return 'developing'
  if (headline.startsWith('STUDY:')) return 'study'
  if (headline.startsWith('REPORT:')) return 'report'
  if (headline.startsWith('JUST IN:')) return 'flavor'
  return defaultLabel
}

function appendTradeLog(
  get: () => { tradeLog: TradeLogEntry[]; day: number },
  set: (state: Partial<{ tradeLog: TradeLogEntry[] }>) => void,
  entry: Omit<TradeLogEntry, 'day'>
) {
  const { tradeLog, day } = get()
  set({ tradeLog: [...tradeLog, { ...entry, day }] })
  capture('trade_executed', {
    action: entry.action,
    asset_name: entry.assetName,
    category: entry.category,
    quantity: entry.quantity,
    price: entry.price,
    total_value: entry.totalValue,
    leverage: entry.leverage,
    profit_loss: entry.profitLoss,
  })
}

async function submitScore(
  username: string,
  finalNetWorth: number,
  gameData: { gameId: string; duration: number; profitPercent: number; daysSurvived: number; outcome: string },
  tradeLog?: TradeLogEntry[],
  retries = 3,
): Promise<void> {
  const body = JSON.stringify({
    username,
    finalNetWorth,
    gameData,
    tradeLogs: tradeLog,
  })

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch('/api/profile/record-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
      if (res.ok) return // Success
      console.error(`Score submit attempt ${attempt}/${retries} failed: ${res.status}`)
    } catch (err) {
      console.error(`Score submit attempt ${attempt}/${retries} error:`, err)
    }
    if (attempt < retries) {
      await new Promise(r => setTimeout(r, attempt * 1000))
    }
  }
  queueFailedScore({ username, finalNetWorth, gameData, tradeLogs: tradeLog })
}

function queueFailedScore(payload: Record<string, unknown>): void {
  try {
    const queue = JSON.parse(localStorage.getItem('mh_score_queue') || '[]')
    queue.push({ ...payload, queuedAt: Date.now() })
    localStorage.setItem('mh_score_queue', JSON.stringify(queue.slice(-10)))
  } catch { /* localStorage full or unavailable */ }
}

// Retry any queued scores from previous sessions
function retryQueuedScores(): void {
  try {
    const queue = JSON.parse(localStorage.getItem('mh_score_queue') || '[]')
    if (queue.length === 0) return

    // Clear queue immediately to prevent double-retries
    localStorage.removeItem('mh_score_queue')

    for (const item of queue) {
      // Skip scores older than 7 days
      if (Date.now() - item.queuedAt > 7 * 24 * 60 * 60 * 1000) continue
      fetch('/api/profile/record-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      }).catch(() => {
        // Re-queue on failure
        queueFailedScore(item)
      })
    }
  } catch { /* ignore */ }
}

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

  capture('game_ended', {
    net_worth: finalNetWorth,
    outcome: entry.outcome,
    days_survived: daysSurvived,
    duration: gameDuration,
    profit_percent: entry.profitPercent,
    total_trades: tradeLog?.length ?? 0,
  })

  // Skip room games — room results stay in room leaderboard only
  const { useRoom } = require('@/hooks/useRoom')
  const isRoomGame = !!useRoom.getState().roomId

  const scoreData = {
    finalNetWorth,
    gameData: {
      gameId: entry.gameId,
      duration: entry.duration,
      profitPercent: entry.profitPercent,
      daysSurvived: entry.daysSurvived,
      outcome: entry.outcome,
    },
  }

  console.log('[SaveGameResult] username:', username, 'isRoomGame:', isRoomGame)

  if (username && !isRoomGame) {
    console.log('[SaveGameResult] Submitting score immediately for', username)
    submitScore(username, finalNetWorth, scoreData.gameData, tradeLog)
      const { useGame } = require('@/hooks/useGame')
    useGame.setState({ pendingScore: null })
  } else if (!username && !isRoomGame) {
    console.log('[SaveGameResult] No username — storing pendingScore:', scoreData)
    const { useGame } = require('@/hooks/useGame')
    useGame.setState({ pendingScore: scoreData })
  } else {
    console.log('[SaveGameResult] Score not submitted — room game')
  }
}

export const createMechanicsSlice: MechanicsSliceCreator = (set, get) => ({
  pendingScore: null,

  screen: 'title',
  day: 1,
  gameDuration: 30,
  cash: 50000,
  creditCardDebt: 50000,
  trustFundBalance: 0,
  holdings: {},
  prices: {},
  prevPrices: {},
  initialPrices: {},
  priceHistory: {},
  costBasis: {},
  initialNetWorth: 0,

  wifeSuspicion: 0,
  wifeSuspicionFrozenUntilDay: null,
  fbiHeat: 0,

  leveragedPositions: [],
  shortPositions: [],

  event: null,
  message: '',
  gameOverReason: '',
  pendingGameOver: null as { reason: string; netWorth: number } | null,
  newsHistory: ['MARKET OPEN - GOOD LUCK TRADER'],
  todayNews: [],
  rumors: [],
  selectedNews: null,

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

  activeInvestments: [],
  usedStartupIds: [],
  pendingStartupOffer: null,
  queuedStartupOffer: null,
  startupOfferCounts: { angel: 0, vc: 0 },
  lastStartupOfferDay: null,

  ownedLifestyle: [],
  lifestylePrices: {},
  activePEExitOffer: null,

  hasReached1M: false,
  reachedMilestones: [],
  activeMilestone: null,
  milestonePhase: 'idle',

  celebrationQueue: [],
  activeCelebration: null,
  isCelebrationDay: false,

  gossipState: DEFAULT_GOSSIP_STATE,
  encounterState: DEFAULT_ENCOUNTER_STATE,
  pendingEncounter: null,
  pendingShitcoin: null,
  pendingLiquidation: null,

  selectedAsset: null,
  buyQty: 1,
  showPortfolio: false,
  showPortfolioBeforeAdvance: typeof window !== 'undefined' ? localStorage.getItem('showPortfolioBeforeAdvance') === 'true' : false,
  portfolioAdvancePending: false,

  activeSellToast: null,
  activeBuyMessage: null,
  activeInvestmentBuyMessage: null,
  activeInvestmentResultToast: null,
  activeErrorMessage: null,

  showSettings: false,
  pendingAchievement: null,

  showActionsModal: false,
  activeActionsTab: 'leverage' as 'leverage' | 'buy' | 'casino',
  showGiftsModal: false,

  operationStates: {
    lobby_congress: { operationId: 'lobby_congress', lastUsedDay: null, timesUsed: 0 },
    execute_coup: { operationId: 'execute_coup', lastUsedDay: null, timesUsed: 0 },
    plant_story: { operationId: 'plant_story', lastUsedDay: null, timesUsed: 0 },
  },

  ownedLuxury: [],

  pendingLifestyleAssetId: null,
  pendingLuxuryAssetId: null,

  usedPEAbilities: [],
  pendingAbilityEffects: null,
  pendingStoryArc: null,
  pendingPhase2Effects: null,

  isPresident: false,
  usedPresidentialAbilities: [],
  hasPardoned: false,
  pendingElection: null,
  pendingInflationEffect: null,

  directorState: createInitialDirectorState(100000),
  directorConfig: DEFAULT_DIRECTOR_CONFIG,

  activeScript: null,
  scriptedGameNumber: null,
  preloadedScenario: null,

  tradeLog: [],

  startGame: (duration?: GameDuration, options?: { cash?: number; debt?: number; skipLimits?: boolean }) => {
    const userState = loadUserState()

    const storeUserTier = get().userTier
    const storeIsLoggedIn = get().isLoggedIn
    const effectiveTier = get().getEffectiveTier()

    const skipLimits = options?.skipLimits === true

    const beginGame = (remaining?: number) => {
      const storeSelectedDuration = get().selectedDuration
      let gameDuration: GameDuration = duration ?? storeSelectedDuration ?? userState.selectedDuration ?? 30

      // Logged-in users are handled server-side by /api/profile/increment-played
      const updatedUserState = !storeIsLoggedIn && userState.isAnonymous
        ? incrementAnonymousGames(userState)
        : userState
      saveUserState(updatedUserState)

      const remainingAfterStart = remaining ?? getRemainingGames(updatedUserState, storeIsLoggedIn)
      const limitType = getLimitType(updatedUserState, storeIsLoggedIn)

    const scriptedGameNumber = gameDuration === 30
      ? getScriptedGameNumber(userState.totalGamesPlayed)
      : null
    let activeScript = scriptedGameNumber ? getScriptedGame(scriptedGameNumber) : null

    const preloadedScenario = get().preloadedScenario
    if (preloadedScenario) {
      activeScript = preloadedScenario
    }

    if (activeScript) {
      gameDuration = (activeScript.days.length as GameDuration) || 30
    }

    // Use fixed initial prices for scripted games if provided, otherwise random
    const prevPrices = activeScript?.initialPrices
      ? { ...activeScript.initialPrices }
      : initPrices()

    let openingEvent: MarketEvent | null = null
    let todayNewsItems: NewsItem[]
    const activeEscalations: ActiveEscalation[] = []

    if (activeScript) {
      const day1 = activeScript.days[0]
      todayNewsItems = day1.news.map(n => ({
        headline: n.headline,
        effects: n.effects,
        labelType: n.labelType,
      }))
      if (day1.flavorHeadline) {
        const flavorLabel = day1.flavorHeadline.startsWith('@') ? 'gossip' as const : detectLabelType(day1.flavorHeadline, 'flavor')
        todayNewsItems.push({ headline: day1.flavorHeadline, effects: {}, labelType: flavorLabel })
      }
      const day1Effects: Record<string, number> = {}
      day1.news.forEach(n => {
        Object.entries(n.effects).forEach(([assetId, effect]) => {
          day1Effects[assetId] = (day1Effects[assetId] || 0) + effect
        })
      })
      if (day1.priceNudges) {
        day1.priceNudges.forEach(({ assetId, nudge }) => {
          day1Effects[assetId] = (day1Effects[assetId] || 0) + nudge
        })
      }
      openingEvent = {
        headline: day1.news[0]?.headline || 'MARKETS OPEN',
        effects: day1Effects,
      } as MarketEvent
    } else {
      openingEvent = selectRandomEvent([], 1, new Set())
      todayNewsItems = openingEvent
        ? [{ headline: openingEvent.headline, effects: openingEvent.effects, labelType: 'news' }]
        : [{ headline: 'MARKETS OPEN - GOOD LUCK TRADER', effects: {}, labelType: 'news' }]

      if (openingEvent?.escalates) {
        activeEscalations.push({
          categories: openingEvent.escalates.categories,
          boost: openingEvent.escalates.boost,
          expiresDay: 1 + openingEvent.escalates.duration,
        })
      }
    }

    const lifestylePrices = initLifestylePrices()

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
      cash: options?.cash ?? 50000,
      creditCardDebt: options?.debt ?? 50000,
      trustFundBalance: 0,
      holdings: {},
      leveragedPositions: [],
      shortPositions: [],
      prices,
      prevPrices,
      initialPrices: { ...prevPrices },
      priceHistory,
      costBasis: {},
      initialNetWorth: (options?.cash ?? 50000) - (options?.debt ?? 50000),
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
      celebrationQueue: [],
      activeCelebration: null,
      isCelebrationDay: false,
      activeStories: [],
      usedStoryIds: [],
      lastStoryStartDay: 0,
      gossipState: DEFAULT_GOSSIP_STATE,
      encounterState: DEFAULT_ENCOUNTER_STATE,
      pendingEncounter: null,
      pendingShitcoin: null,
      pendingLiquidation: null,
      queuedStartupOffer: null,
      activeScheduledEvent: null,
      usedScheduledEventIds: [],
      assetMoods: [],
      categoryCooldowns: [],
      usedFlavorHeadlines: [],
      usedEventHeadlines: [],
      operationStates: {
        lobby_congress: { operationId: 'lobby_congress', lastUsedDay: null, timesUsed: 0 },
        execute_coup: { operationId: 'execute_coup', lastUsedDay: null, timesUsed: 0 },
        plant_story: { operationId: 'plant_story', lastUsedDay: null, timesUsed: 0 },
      },
      ownedLuxury: [],
      usedPEAbilities: [],
      pendingAbilityEffects: null,
      pendingStoryArc: null,
      pendingPhase2Effects: null,
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
      isUsingProTrial: false,
      directorState: createInitialDirectorState(100000),
      directorConfig: DEFAULT_DIRECTOR_CONFIG,
      activeScript,
      scriptedGameNumber,
      preloadedScenario: null,
      tradeLog: [],
    })

    {
      const { useRoom } = require('@/hooks/useRoom')
      capture('game_started', {
        duration: duration,
        is_multiplayer: !!useRoom.getState().roomId,
        starting_cash: 100000,
        tier: effectiveTier,
        is_scripted: !!activeScript,
      })
    }

    try {
      const playLog: string[] = JSON.parse(localStorage.getItem('mh_play_log') || '[]')
      playLog.push(new Date().toISOString())
      // Keep last 500 entries
      localStorage.setItem('mh_play_log', JSON.stringify(playLog.slice(-500)))
    } catch { /* silent */ }

    if (storeIsLoggedIn) {
      fetch('/api/game-plays', { method: 'POST' }).catch(() => {})
    }
    } // end beginGame

    const isDev = process.env.NODE_ENV === 'development'

    if (!skipLimits && !isDev && !storeIsLoggedIn) {
      fetch('/api/game/guest-start', { method: 'POST' })
        .then(res => res.json())
        .then((data: { allowed: boolean; remaining: number }) => {
          if (!data.allowed) {
            set({ showAnonymousLimitModal: true, showDailyLimitModal: false, gamesRemaining: 0, limitType: 'anonymous' })
            return
          }
          beginGame(data.remaining)
        })
        .catch(() => {
          beginGame()
        })
      return
    }

    if (!skipLimits && !isDev && storeIsLoggedIn && storeUserTier !== 'pro') {
      fetch('/api/profile/increment-played', { method: 'POST' })
        .then(res => {
          if (res.status === 429) {
            set({ showDailyLimitModal: true, showAnonymousLimitModal: false, gamesRemaining: 0, limitType: 'daily' })
            return
          }
          if (res.ok) {
            beginGame(0)
          }
        })
        .catch(() => {
          beginGame()
        })
      return
    }

    beginGame()
  },

  nextDay: () => {
    const { prices, priceHistory, newsHistory, day, cash, holdings, activeChains, usedChainIds, activeInvestments, usedStartupIds, ownedLifestyle, lifestylePrices, activePEExitOffer, activeEscalations, hasReached1M, reachedMilestones, activeStories, usedStoryIds, lastStoryStartDay, gossipState, assetMoods, categoryCooldowns, usedFlavorHeadlines, usedEventHeadlines, leveragedPositions, shortPositions, ownedLuxury, operationStates, pendingAbilityEffects, pendingStoryArc, pendingPhase2Effects, usedPEAbilities, pendingInflationEffect, directorState, directorConfig, gameDuration, initialNetWorth, creditCardDebt, activeScheduledEvent, usedScheduledEventIds, initialPrices } = get()
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

    let clearedPendingEffects = false
    let revealedUsedPEAbilities = usedPEAbilities
    if (pendingAbilityEffects) {
      Object.entries(pendingAbilityEffects.effects).forEach(([assetId, effect]) => {
        effects[assetId] = (effects[assetId] || 0) + effect
      })

      const fallbackName = pendingAbilityEffects.abilityId.replace(/_/g, ' ').toUpperCase()
      const eventHeadline = pendingAbilityEffects.eventHeadline
        || (pendingAbilityEffects.isBackfire ? `BACKFIRE: ${fallbackName} OPERATION EXPOSED` : `${fallbackName} SUCCESSFUL`)

      todayNewsItems.push({
        headline: eventHeadline,
        effects: pendingAbilityEffects.effects,
        labelType: 'breaking',
      })

      // Skip for presidential abilities which use different tracking
      if (pendingAbilityEffects.peAssetId !== 'presidential') {
        revealedUsedPEAbilities = usedPEAbilities.map(u =>
          u.abilityId === pendingAbilityEffects.abilityId
            ? { ...u, didBackfire: pendingAbilityEffects.isBackfire }
            : u
        )
      }

      clearedPendingEffects = true
    }

    let storyFiredToday = false

    let updatedPendingStoryArc = pendingStoryArc
    let storyArcPEToRemove: string | null = null
    let queuedPhase2Effects: typeof pendingPhase2Effects = null
    let storyArcFBIHeat = 0
    let storyArcTriggeredEncounter: 'sec' | null = null

    if (pendingStoryArc) {
      const nextPhase = pendingStoryArc.currentPhase + 1

      if (nextPhase === 2) {
        // Silent execution abilities (empty part1) show this as RUMOR instead of DEVELOPING
        const isSilentExecution = !pendingStoryArc.part1Headline
        const labelType = isSilentExecution ? 'rumor' as const : 'developing' as const
        todayNewsItems.push({
          headline: pendingStoryArc.part2Headline,
          effects: {}, // No effects yet
          labelType,
        })
        updatedPendingStoryArc = { ...pendingStoryArc, currentPhase: 2 as const }
        storyFiredToday = true

      } else if (nextPhase === 3) {
        todayNewsItems.push({
          headline: pendingStoryArc.part3Headline,
          effects: pendingStoryArc.effects,
          labelType: 'breaking',
        })

        Object.entries(pendingStoryArc.effects).forEach(([assetId, effect]) => {
          effects[assetId] = (effects[assetId] || 0) + effect
        })

        storyArcFBIHeat = pendingStoryArc.fbiHeatIncrease

        if (pendingStoryArc.storyOutcome === 'unfavorable' && pendingStoryArc.additionalConsequences) {
          const conseq = pendingStoryArc.additionalConsequences

          if (conseq.fine) {
            cashChange -= conseq.fine
          }

          if (conseq.losePE) {
            storyArcPEToRemove = pendingStoryArc.peAssetId
          }

          if (conseq.triggerEncounter === 'sec') {
            storyArcTriggeredEncounter = 'sec'
          }

          if (conseq.gameOverRisk && Math.random() < conseq.gameOverRisk) {
            // Defer so the player sees the day page before game over
            set({ pendingGameOver: { reason: 'FBI_INVESTIGATION', netWorth: get().getNetWorth() } })
          }
        }

        revealedUsedPEAbilities = revealedUsedPEAbilities.map(u =>
          u.abilityId === pendingStoryArc.abilityId
            ? { ...u, didBackfire: pendingStoryArc.storyOutcome === 'unfavorable' }
            : u
        )

        if (pendingStoryArc.abilityId === 'project_chimera' && pendingStoryArc.storyOutcome === 'favorable') {
          const { PE_ABILITIES } = require('@/lib/game/lifestyleAssets')
          const ability = PE_ABILITIES.project_chimera
          if (ability?.phase2Effects) {
            queuedPhase2Effects = {
              abilityId: pendingStoryArc.abilityId,
              effects: ability.phase2Effects.effects,
              headline: ability.phase2Effects.headline,
              triggerOnDay: newDay + 1,
            }
          }
        }

        updatedPendingStoryArc = null
        storyFiredToday = true
      }
    }

    let clearedPhase2Effects = false
    if (pendingPhase2Effects && newDay >= pendingPhase2Effects.triggerOnDay) {
      Object.entries(pendingPhase2Effects.effects).forEach(([assetId, effect]) => {
        effects[assetId] = (effects[assetId] || 0) + effect
      })

      todayNewsItems.push({
        headline: `📈 ${pendingPhase2Effects.headline}`,
        effects: pendingPhase2Effects.effects,
        labelType: 'breaking',
      })

      clearedPhase2Effects = true
    }

    let clearedInflationEffect = false
    if (pendingInflationEffect && newDay >= pendingInflationEffect.triggerOnDay) {
      Object.entries(pendingInflationEffect.effects).forEach(([assetId, effect]) => {
        effects[assetId] = (effects[assetId] || 0) + effect
      })

      todayNewsItems.push({
        headline: `📉 ${pendingInflationEffect.headline}`,
        effects: pendingInflationEffect.effects,
        labelType: 'breaking',
      })

      clearedInflationEffect = true
    }

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
          luxuryDailyCost += asset.dailyCost
          const label = luxuryCostLabels[id] || `${asset.name.toUpperCase()} COSTS`
          todayNewsItems.push({
            headline: `${label}: -$${asset.dailyCost.toLocaleString('en-US')}`,
            effects: {},
            labelType: 'none'
          })
        } else {
          luxuryDailyCost += asset.dailyCost
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

    const ownsTenutaLuna = ownedLifestyle.some(o => o.assetId === 'pe_tenuta_luna')
    const ownsApexMedia = ownedLifestyle.some(o => o.assetId === 'pe_apex_media')
    const ownsArtCollection = ownedLuxury.includes('art_collection')

    // Negative event damage reduction (Tenuta -10%, Apex -20%, stacks)
    let negativeReduction = 0
    if (ownsTenutaLuna) negativeReduction += 0.10
    if (ownsApexMedia) negativeReduction += 0.20

    let propertyIncome = 0
    let peReturns = 0
    let hasMarketNews = false

    if (isScripted) {
      const scriptedDay = get().activeScript!.days[newDay - 1]
      if (scriptedDay) {
        scriptedDay.news.forEach(n => {
          todayNewsItems.push({ headline: n.headline, effects: n.effects, labelType: detectLabelType(n.headline, n.labelType) })
          Object.entries(n.effects).forEach(([assetId, effect]) => {
            effects[assetId] = (effects[assetId] || 0) + effect
          })
        })
        if (scriptedDay.flavorHeadline) {
          const scriptedFlavorLabel = scriptedDay.flavorHeadline.startsWith('@') ? 'gossip' as const : detectLabelType(scriptedDay.flavorHeadline, 'flavor')
          todayNewsItems.push({ headline: scriptedDay.flavorHeadline, effects: {}, labelType: scriptedFlavorLabel })
        }
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
        let dailyCashFlow = owned.purchasePrice * asset.dailyReturn

        if (asset.category === 'property') {
          dailyCashFlow = Math.max(0, dailyCashFlow)
          propertyIncome += dailyCashFlow
        } else if (asset.category === 'private_equity') {
          peReturns += dailyCashFlow
        }
        cashChange += dailyCashFlow
      }
    })

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
      updatedOwnedLifestyle = updatedOwnedLifestyle.filter(o => !failedPEThisDay.includes(o.assetId))
    }

    if (storyArcPEToRemove) {
      updatedOwnedLifestyle = updatedOwnedLifestyle.filter(o => o.assetId !== storyArcPEToRemove)
    }

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

    if (newPEExitOffer && newPEExitOffer.expiresDay <= newDay) {
      newPEExitOffer = null
    }

    if (!newPEExitOffer) {
      // FIX: Shuffle PE assets to avoid order-dependent bias
      // (previously first asset in array had disproportionate exit chances)
      const peAssets = updatedOwnedLifestyle.filter(o => {
        const asset = LIFESTYLE_ASSETS.find(a => a.id === o.assetId)
        return asset?.category === 'private_equity'
      })
      const shuffledPE = [...peAssets].sort(() => Math.random() - 0.5)

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
        let storyLabelType: NewsLabelType
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
        if (isDev) {
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
          if (isDev) {
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
        if (isDev) {
          console.debug(`[Story] STARTED: "${newStory.id}" — "${firstStage.headline}" (category=${newStory.category}, stages=${newStory.stages.length}, day=${newDay})`)
        }
      }
    }

    // Scheduled events resolve before chains/events so mood influences same-day selection
    let updatedScheduledEvent: ActiveScheduledEvent | null = activeScheduledEvent ? { ...activeScheduledEvent } : null

    if (updatedScheduledEvent && !updatedScheduledEvent.resolved) {
      const scheduledDef = SCHEDULED_EVENTS.find(e => e.id === updatedScheduledEvent!.eventId)
      if (scheduledDef) {
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

        todayNewsItems.push({ headline: selectedOutcome.headline, effects: selectedOutcome.effects, labelType: 'breaking' })
        hasMarketNews = true
        updateRippleCandidate(selectedOutcome.headline, scheduledDef.category, selectedOutcome.effects)
        Object.entries(selectedOutcome.effects).forEach(([assetId, effect]) => {
          effects[assetId] = (effects[assetId] || 0) + effect
        })

        updatedAssetMoods = recordChainOutcomeMood(selectedOutcome, newDay, updatedAssetMoods)

        updatedUsedScheduledEventIds.push(updatedScheduledEvent!.eventId)
        updatedScheduledEvent = null
      }
    }

    if (!isScripted && !updatedScheduledEvent && !storyFiredToday) {
      const scheduledRoll = Math.random()
      if (scheduledRoll < 0.08) {
        const scheduledBlockedCats = getActiveTopics(updatedStories, updatedChains)
        const newScheduled = selectRandomScheduledEvent(
          scheduledBlockedCats,
          updatedScheduledEvent,
          newDay,
          gameDuration,
          updatedUsedScheduledEventIds,
        )
        if (newScheduled) {
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
          updatedScheduledEvent = {
            eventId: newScheduled.id,
            startDay: newDay,
            resolved: false,
            category: newScheduled.category,
          }
        }
      }
    }

    const chainsToResolve: ActiveChain[] = []
    const remainingChains: ActiveChain[] = []

    updatedChains.forEach(chain => {
      if (chain.daysRemaining <= 1) {
        chainsToResolve.push(chain)
      } else {
        if (isDev) {
          console.debug(`[Chain] TICK: "${chain.rumor}" (id=${chain.chainId}, daysRemaining=${chain.daysRemaining} -> ${chain.daysRemaining - 1}, day=${newDay})`)
        }
        remainingChains.push({
          ...chain,
          daysRemaining: chain.daysRemaining - 1,
        })
      }
    })

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
        Object.entries(outcome.effects).forEach(([assetId, effect]) => {
          effects[assetId] = (effects[assetId] || 0) + effect
        })
        updatedUsedChainIds.push(activeChain.chainId)
        updatedAssetMoods = recordChainOutcomeMood(outcome, newDay, updatedAssetMoods)
        updatedCategoryCooldowns.push({ category: activeChain.category, expiresDay: newDay + 1 })
        if (isDev) {
          console.debug(`[Chain] RESOLVED: "${activeChain.rumor}" -> "${outcome.headline}" (id=${activeChain.chainId}, day=${newDay}, label=${chainLabelType}, cooldown ${activeChain.category} until day ${newDay + 1})`)
        }
      } else {
        // Defensive: chain definition was removed or not found (e.g., hot-reload during dev).
        // Generate a fallback resolution so the rumor doesn't silently vanish.
        if (isDev) {
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

    let preparedDirectorState = prepareDirectorForDay(directorState, newDay, gameDuration)

    // Decay existing ripples before event selection so yesterday's ripples affect today with decayed strength
    preparedDirectorState = {
      ...preparedDirectorState,
      secondOrder: updateRipples(preparedDirectorState.secondOrder, newDay),
    }

    const recentCategoriesForDirector = newsHistory
      .slice(-5)
      .map(headline => {
        // Extract category from headline (simplified - relies on event effects)
        const matchingEvent = EVENTS.find(e => e.headline === headline)
        return matchingEvent?.category
      })
      .filter((cat): cat is string => typeof cat === 'string')

    const directorModifiers = getDirectorModifiers(
      preparedDirectorState,
      directorConfig,
      {
        day: newDay,
        gameDuration,
        recentCategories: recentCategoriesForDirector,
      }
    )

    const directorEventBoost = preparedDirectorState.dopamineDebt > 0.7 ? 0.15 : 0
    const chainProbabilityBoost = (directorModifiers.chainProbabilityMultiplier - 1) * 0.3

    let chainStartedToday = false
    let eventFiredToday: MarketEvent | null = null

    const hasActiveChain = updatedChains.length >= 2
    const eventRoll = Math.random()

    const PHASE_EVENT_CHANCE: Record<string, number> = {
      setup: 0.55,
      rising_action: 0.55,
      midpoint: 0.55,
      escalation: 0.60,
      climax: 0.65,
      resolution: 0.35,
    }
    const baseEventChance = PHASE_EVENT_CHANCE[preparedDirectorState.currentPhase] ?? 0.45

    const blockedCategories = getActiveTopics(updatedStories, updatedChains, pendingStoryArc)
    updatedCategoryCooldowns.forEach(cd => {
      if (cd.expiresDay > newDay) blockedCategories.add(cd.category)
    })
    updatedCategoryCooldowns = updatedCategoryCooldowns.filter(cd => cd.expiresDay > newDay)

    let forceChain = directorModifiers.forceEventType === 'chain' && !hasActiveChain
    let forceEvent = directorModifiers.forceEventType === 'spike'

    if (newDay === 1 && !forceChain) forceEvent = true

    // Guarantee a chain starts on day 2 for non-scripted games
    if (newDay === 2 && !isScripted && updatedChains.length === 0 && !hasActiveChain) {
      forceChain = true
      forceEvent = false
    }

    if (!isScripted && !storyFiredToday && (eventRoll < (baseEventChance + directorEventBoost) || forceChain || forceEvent)) {
      const chainOrSingleRoll = Math.random()
      const adjustedChainProb = 0.50 + chainProbabilityBoost

      if (!hasActiveChain && (forceChain || (!forceEvent && chainOrSingleRoll < adjustedChainProb))) {
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
            category: newChain.category,
            subcategory: newChain.subcategory,
            predictionLine: chainPredictionLine,
          }
          updatedChains.push(activeChain)
          updatedUsedChainIds.push(newChain.id)
          if (newChain.excludeStories) {
            updatedUsedStoryIds.push(...newChain.excludeStories)
          }
          if (newChain.excludeChains) {
            updatedUsedChainIds.push(...newChain.excludeChains)
          }
          if (isDev) {
            console.debug(`[Chain] STARTED: "${newChain.rumor}" (id=${newChain.id}, duration=${newChain.duration}, day=${newDay})`)
          }
          // Rumor is displayed via 'rumors' state in NewsPanel, not todayNewsItems
          hasMarketNews = true
          chainStartedToday = true
          updatedAssetMoods = recordChainRumorMood(newChain, newDay, updatedAssetMoods)
        }
      } else {
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
          todayNewsItems.push({ headline: e.headline, effects: e.effects, labelType: detectLabelType(e.headline, 'news') })
          hasMarketNews = true
          eventFiredToday = e
          updateRippleCandidate(e.headline, e.category, e.effects)
          updatedUsedEventHeadlines.push(e.headline)
          Object.entries(e.effects).forEach(([assetId, effect]) => {
            effects[assetId] = (effects[assetId] || 0) + effect
          })
          if (e.escalates) {
            updatedEscalations.push({
              categories: e.escalates.categories,
              boost: e.escalates.boost,
              expiresDay: newDay + e.escalates.duration,
            })
          }
          updatedAssetMoods = recordEventMood(e, newDay, updatedAssetMoods)
        }
      }
    }

    updatedEscalations = updatedEscalations.filter(esc => esc.expiresDay > newDay)

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

    let mostSignificantInvestmentResult: {
      message: string
      profitLossPct: number
      isProfit: boolean
    } | null = null
    let maxAbsoluteChange = 0

    const investmentCelebrationEvents: InvestmentResultEvent[] = []

    investmentsToResolve.forEach(inv => {
      if (inv.outcome) {
        const payout = inv.amount * inv.outcome.multiplier
        cashChange += payout

        const profitLoss = payout - inv.amount
        const profitLossPct = ((payout - inv.amount) / inv.amount) * 100
        const isProfit = profitLoss >= 0

        const resultMessage = inv.outcome.multiplier === 0
          ? `💀 LOST $${inv.amount.toLocaleString('en-US')} ON ${inv.startupName}`
          : `${isProfit ? '🎉' : '😓'} ${inv.startupName}: ${isProfit ? '+' : ''}$${Math.round(profitLoss).toLocaleString('en-US')} (${profitLossPct >= 0 ? '+' : ''}${profitLossPct.toFixed(0)}%)`

        const absoluteChange = Math.abs(profitLoss)
        if (absoluteChange > maxAbsoluteChange) {
          maxAbsoluteChange = absoluteChange
          mostSignificantInvestmentResult = {
            message: resultMessage,
            profitLossPct,
            isProfit,
          }
        }

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

        const headlineWithAmount = inv.outcome.multiplier === 0
          ? `${inv.outcome.headline} - YOUR $${inv.amount.toLocaleString('en-US')} INVESTMENT LOST`
          : isProfit
            ? `${inv.outcome.headline} - YOU MADE $${Math.round(profitLoss).toLocaleString('en-US')}!`
            : `${inv.outcome.headline} - YOU LOST $${Math.round(Math.abs(profitLoss)).toLocaleString('en-US')}!`
        todayNewsItems.push({ headline: headlineWithAmount, effects: inv.outcome.marketEffects || {}, labelType: 'news', baseHeadline: inv.outcome.headline })

        if (inv.outcome.marketEffects) {
          Object.entries(inv.outcome.marketEffects).forEach(([assetId, effect]) => {
            effects[assetId] = (effects[assetId] || 0) + effect
          })
        }
      }
    })

    updatedInvestments = remainingInvestments

    // 4b. Process pending shitcoin - resolve after 2 days
    const { pendingShitcoin } = get()
    let resolvedShitcoin = false
    if (pendingShitcoin && day + 1 >= pendingShitcoin.resolvesDay) {
      resolvedShitcoin = true
      if (pendingShitcoin.outcome === 'moon') {
        cashChange += pendingShitcoin.profit
        const profitFormatted = pendingShitcoin.profit.toLocaleString('en-US')
        todayNewsItems.push({
          headline: `$YOURCOIN TO THE MOON: Your shitcoin pumped hard before you dumped — +$${profitFormatted} profit`,
          effects: {},
          labelType: 'breaking',
        })
      } else {
        todayNewsItems.push({
          headline: 'RUG PULLED: $YOURCOIN went to zero. The dev vanished with your $5K.',
          effects: {},
          labelType: 'news',
        })
      }
    }

    // 4c. Add "minting" news on the day a shitcoin was just created
    const currentPendingShitcoin = get().pendingShitcoin
    if (!resolvedShitcoin && currentPendingShitcoin && currentPendingShitcoin.investedDay === newDay) {
      todayNewsItems.push({
        headline: '$YOURCOIN IS LIVE: Your meme coin just launched — the market will decide its fate in the coming days...',
        effects: {},
        labelType: 'news',
      })
    }

    if (!hasMarketNews) {
      const unusedQuiet = QUIET_NEWS.filter(q => !updatedUsedEventHeadlines.includes(q.headline))
      const quietPool = unusedQuiet.length > 0 ? unusedQuiet : QUIET_NEWS
      const randomQuiet = quietPool[Math.floor(Math.random() * quietPool.length)]
      todayNewsItems.push({ headline: randomQuiet.headline, effects: randomQuiet.effects, labelType: 'news' })
      updatedUsedEventHeadlines.push(randomQuiet.headline)
    }

    if (!isScripted && hasMarketNews && Math.random() < 0.30) {
      const flavor = selectFlavorEvent(updatedFlavorHeadlines)
      if (flavor) {
        todayNewsItems.push({
          headline: flavor.headline,
          effects: flavor.effects,
          labelType: detectLabelType(flavor.headline, 'flavor'),
        })
        updatedFlavorHeadlines.push(flavor.headline)

        if (Object.keys(flavor.effects).length > 0) {
          Object.entries(flavor.effects).forEach(([assetId, effect]) => {
            effects[assetId] = (effects[assetId] || 0) + effect
          })
        }
      }
    }

    const priceChanges: Record<string, number> = {}
    ASSETS.forEach(asset => {
      const effect = effects[asset.id] || 0
      priceChanges[asset.id] = effect // Use the effect as approximation
    })

    const isSideways = isMarketSideways(priceChanges)
    const hasMajorEvent = hasMajorEventToday(todayNewsItems)
    const gameLength = get().gameDuration

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

    // 1.3x bump to lifestyle event effects so they don't feel disconnected from market events
    const LIFESTYLE_EFFECT_MULTIPLIER = 1.3
    LIFESTYLE_ASSETS.forEach(asset => {
      const currentPrice = lifestylePrices[asset.id] || asset.basePrice
      const volatilityChange = lifestyleBaseChanges[asset.id] || 0
      const eventEffect = (lifestyleEffects[asset.id] || 0) * LIFESTYLE_EFFECT_MULTIPLIER
      const totalChange = volatilityChange + eventEffect
      newLifestylePrices[asset.id] = Math.round(currentPrice * (1 + totalChange))
    })

    if (negativeReduction > 0) {
      Object.keys(effects).forEach(assetId => {
        if (effects[assetId] < 0) {
          effects[assetId] = effects[assetId] * (1 - negativeReduction)
        }
      })
      todayNewsItems.forEach(newsItem => {
        Object.keys(newsItem.effects).forEach(assetId => {
          if (newsItem.effects[assetId] < 0) {
            newsItem.effects[assetId] = newsItem.effects[assetId] * (1 - negativeReduction)
          }
        })
      })
    }

    // Riskier assets swing harder; applied after PE bonuses so reduction still works proportionally
    for (const assetId of Object.keys(effects)) {
      const multiplier = ASSET_EVENT_MULTIPLIERS[assetId] || 1.0
      effects[assetId] = effects[assetId] * multiplier
      // Cap negative effects at -85% (price can't drop below 15% in one day)
      if (effects[assetId] < -0.85) effects[assetId] = -0.85
    }
    todayNewsItems.forEach(newsItem => {
      Object.keys(newsItem.effects).forEach(assetId => {
        const multiplier = ASSET_EVENT_MULTIPLIERS[assetId] || 1.0
        newsItem.effects[assetId] = newsItem.effects[assetId] * multiplier
        if (newsItem.effects[assetId] < -0.85) newsItem.effects[assetId] = -0.85
      })
    })

    const newPrices: Record<string, number> = {}
    const newPriceHistory: Record<string, DayCandle[]> = {}
    ASSETS.forEach(asset => {
      const open = prices[asset.id]
      let close: number

      let change = (Math.random() - 0.5) * asset.volatility * 2
      if (effects[asset.id]) {
        change = change * 0.08 + effects[asset.id]
      } else {
        // Gentle mean reversion toward opening price on no-event days
        const openPrice = initialPrices[asset.id]
        if (openPrice > 0) {
          const displacement = (prices[asset.id] - openPrice) / openPrice
          if (Math.abs(displacement) > 0.15) {
            const REVERSION_STRENGTH = 0.07
            change += -displacement * REVERSION_STRENGTH
          }
        }
      }
      close = prices[asset.id] * (1 + change)
      close = Math.max(0.01, Math.round(close * 100) / 100)
      newPrices[asset.id] = close

      const volatilityRange = open * asset.volatility * 0.5
      const high = Math.max(open, close) + Math.random() * volatilityRange
      const low = Math.min(open, close) - Math.random() * volatilityRange

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

    // Must match getNetWorth() calculation
    let portfolioValue = 0
    Object.entries(holdings).forEach(([id, qty]) => {
      portfolioValue += (newPrices[id] || 0) * qty
    })
    const startupValue = updatedInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    let lifestyleValue = 0
    ownedLifestyle.forEach(item => {
      lifestyleValue += newLifestylePrices[item.assetId] || 0
    })
    let leveragedValue = 0
    leveragedPositions.forEach(pos => {
      const currentPrice = newPrices[pos.assetId] || 0
      const positionValue = currentPrice * pos.qty
      leveragedValue += (positionValue - pos.debtAmount)
    })
    let shortUnrealizedPL = 0
    shortPositions.forEach(pos => {
      const currentPrice = newPrices[pos.assetId] || 0
      shortUnrealizedPL += pos.cashReceived - currentPrice * pos.qty
    })
    const luxuryValue = ownedLuxury.reduce((sum, id) => {
      const asset = getLuxuryAsset(id)
      return sum + (asset?.basePrice || 0)
    }, 0)
    const currentCash = cash + cashChange
    const { trustFundBalance } = get()
    const nw = Math.round((currentCash + portfolioValue + startupValue + lifestyleValue + leveragedValue + luxuryValue + trustFundBalance + shortUnrealizedPL - creditCardDebt) * 100) / 100

    let newHasReached1M = hasReached1M
    if (!hasReached1M && nw >= 1000000) {
      todayNewsItems.unshift({ headline: '🎉 $1M CLUB! VCs will now pitch you their hottest deals.', effects: {} })
      newHasReached1M = true
    }

    let newReachedMilestones = [...reachedMilestones]
    let newActiveMilestone: { id: string; title: string; tier: string; scarcityMessage: string } | null = null
    let newMilestonePhase: 'idle' | 'takeover' | 'persist' = 'idle'
    let milestoneCelebrationEvent: MilestoneCelebrationEvent | null = null

    const milestone = checkMilestone(nw, reachedMilestones)
    if (milestone) {
      newReachedMilestones = getAllReachedMilestones(nw, reachedMilestones)
      newActiveMilestone = {
        id: milestone.id,
        title: milestone.title,
        tier: milestone.tier,
        scarcityMessage: milestone.scarcityMessage,
      }
      newMilestonePhase = 'takeover'

      milestoneCelebrationEvent = {
        type: 'milestone',
        id: milestone.id,
        title: milestone.title,
        tier: milestone.tier,
        scarcityMessage: milestone.scarcityMessage,
        netWorth: nw,
      }
    }

    const newCelebrationQueue: CelebrationEvent[] = [
      ...investmentCelebrationEvents,
    ]
    const hasCelebrations = newCelebrationQueue.length > 0
    const newActiveCelebration = newCelebrationQueue.length > 0 ? newCelebrationQueue.shift()! : null

    let newStartupOffer: typeof get extends () => { pendingStartupOffer: infer T } ? T : never = null

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

      const cooldownDays = 3
      const daysSinceLastOffer = lastStartupOfferDay ? newDay - lastStartupOfferDay : Infinity
      const cooldownPassed = daysSinceLastOffer >= cooldownDays

      const angelNetWorthGate = 50_000
      const vcNetWorthGate = 1_000_000

      const angelCap = 3
      const vcCap = 2

      let angelBaseChance = 0.18
      let vcBaseChance = 0.055

      const ownsJet = ownedLuxury.includes('private_jet')
      if (ownsJet) {
        angelBaseChance *= 1.30
        vcBaseChance *= 1.30
      }

      if (cooldownPassed) {
        let selectedTier: 'angel' | 'vc' | null = null

        if (nw >= angelNetWorthGate && updatedOfferCounts.angel < angelCap) {
          if (Math.random() < angelBaseChance) {
            const angelOffer = selectRandomStartup('angel', updatedUsedStartupIds)
            if (angelOffer) {
              newStartupOffer = angelOffer
              selectedTier = 'angel'
            }
          }
        }

        if (nw >= vcNetWorthGate && updatedOfferCounts.vc < vcCap) {
          if (Math.random() < vcBaseChance) {
            const vcOffer = selectRandomStartup('vc', updatedUsedStartupIds)
            if (vcOffer) {
              newStartupOffer = vcOffer
              selectedTier = 'vc'
            }
          }
        }

        if (selectedTier === 'angel') {
          updatedOfferCounts.angel++
        } else if (selectedTier === 'vc') {
          updatedOfferCounts.vc++
        }
      }
    }

    const totalEffectsMagnitude = Object.keys(effects).length > 0
      ? Object.values(effects).reduce((sum, e) => sum + Math.abs(e), 0)
      : null
    const hadExcitingEvent = isExcitingEvent(
      totalEffectsMagnitude,
      chainStartedToday,
      chainResolvedToday
    )

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

    // New ripples created here will affect tomorrow's event selection
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

    const HIGH_IMPACT_THRESHOLD = 0.15

    if (updatedDirectorState.activeTheme === 'none') {
      let seedCategory: string | null = null

      const storyStartedToday = updatedStories.find(s => s.startDay === newDay)
      if (storyStartedToday) {
        const storyDef = getStoryById(storyStartedToday.storyId)
        if (storyDef) seedCategory = storyDef.category
      }

      if (!seedCategory && chainStartedToday) {
        const newChain = updatedChains.find(c => c.startDay === newDay)
        if (newChain) seedCategory = newChain.category
      }

      if (!seedCategory && chainResolvedToday && chainsToResolve.length > 0) {
        seedCategory = chainsToResolve[0].category
      }

      if (!seedCategory && eventFiredToday) {
        const totalImpact = Object.values(eventFiredToday.effects)
          .reduce((sum, e) => sum + Math.abs(e), 0)
        if (totalImpact >= HIGH_IMPACT_THRESHOLD) {
          seedCategory = eventFiredToday.category
        }
      }

      if (seedCategory) {
        const theme = categoryToTheme(seedCategory)
        if (theme) {
          const remainingDays = gameDuration - newDay + 1
          const duration = Math.max(5, Math.ceil(remainingDays * 0.7))
          updatedDirectorState = startTheme(updatedDirectorState, theme, duration)
        }
      }
    } else {
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

    const { wifeSuspicion } = get()
    const newWifeSuspicion = wifeSuspicion

    const dailyInterest = creditCardDebt * 0.0175
    const newCreditCardDebt = creditCardDebt + dailyInterest

    const newFBIHeat = 0

    if (isDev) {
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
      pendingAbilityEffects: clearedPendingEffects ? null : pendingAbilityEffects,
      pendingStoryArc: updatedPendingStoryArc,
      usedPEAbilities: revealedUsedPEAbilities,
      pendingPhase2Effects: queuedPhase2Effects || (clearedPhase2Effects ? null : pendingPhase2Effects),
      pendingInflationEffect: clearedInflationEffect ? null : pendingInflationEffect,
      pendingShitcoin: resolvedShitcoin ? null : get().pendingShitcoin,
      directorState: updatedDirectorState,
    })

    const finalNetWorth = get().getNetWorth()

    const finalCash = get().cash
    if (finalNetWorth < 0 && finalCash <= 0 && !get().pendingGameOver) {
      let gameOverReason = 'BANKRUPT'

      if (finalNetWorth < -1_000_000) {
        gameOverReason = 'ECONOMIC_CATASTROPHE'
      } else if (shortPositions.length > 0 && shortPositions.length > leveragedPositions.length) {
        gameOverReason = 'SHORT_SQUEEZED'
      } else if (leveragedPositions.length > 0 || shortPositions.length > 0) {
        gameOverReason = 'MARGIN_CALLED'
      }

      // Defer so the player sees their negative net worth before game over
      set({ pendingGameOver: { reason: gameOverReason, netWorth: finalNetWorth } })
    } else if (newDay > gameDuration) {
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

  triggerNextDay: () => {
    const { day, cash, encounterState, pendingStartupOffer, gameDuration, isCelebrationDay, ownedLuxury, showPortfolioBeforeAdvance, holdings, pendingGameOver, activeScript } = get()
    const netWorth = get().getNetWorth()

    if (pendingGameOver) {
      saveGameResult(false, pendingGameOver.netWorth, day, gameDuration, pendingGameOver.reason, get().isLoggedIn, get().isUsingProTrial, get().username, get().tradeLog)
      set({ screen: 'gameover', gameOverReason: pendingGameOver.reason, pendingGameOver: null, isUsingProTrial: false })
      return
    }

    const hasPositions = Object.values(holdings).some(qty => qty > 0)
    if (showPortfolioBeforeAdvance && hasPositions) {
      set({ showPortfolio: true, portfolioAdvancePending: true })
      return
    }

    if (isCelebrationDay) {
      get().nextDay()
      return
    }

    if (activeScript) {
      const nextDayNum = day + 1
      const nextScriptedDay = activeScript.days[nextDayNum - 1]
      if (nextScriptedDay?.encounter && !shouldSkipScriptedEncounter(nextScriptedDay.encounter, encounterState, netWorth)) {
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

  setScreen: (screen) => set({ screen }),

  setPreloadedScenario: (scenario) => set({ preloadedScenario: scenario }),

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

    const existingBasis = costBasis[assetId] || { totalCost: 0, totalQty: 0 }
    const avgCost = existingBasis.totalQty > 0 ? existingBasis.totalCost / existingBasis.totalQty : price
    const costOfSold = avgCost * qty
    const profitLoss = revenue - costOfSold
    const profitLossPct = avgCost > 0 ? ((price - avgCost) / avgCost) * 100 : 0

    let emoji: string
    if (profitLossPct >= 50) emoji = '🚀'
    else if (profitLossPct >= 10) emoji = '💰'
    else if (profitLossPct > 0) emoji = '📈'
    else if (profitLossPct === 0) emoji = '➡️'
    else if (profitLossPct > -10) emoji = '📉'
    else if (profitLossPct > -50) emoji = '💸'
    else emoji = '🔥'

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

    const remainingQty = owned - qty
    let newCostBasis = { ...costBasis }

    if (remainingQty <= 0) {
      delete newCostBasis[assetId]
    } else {
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

  buyWithLeverage: (assetId: string, qty: number, leverage) => {
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

    const totalShortProceeds = shortPositions.reduce((sum, pos) => sum + pos.cashReceived, 0)
    const totalExposureAfter = totalShortProceeds + positionValue

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

    if (profitLoss < 0 && Math.abs(profitLoss) > cash) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH TO COVER LOSSES' })
      return
    }

    if (profitLoss < 0) {
      const { fbiHeat } = get()
      const newFBIHeat = Math.max(0, fbiHeat - 5)
      set({ fbiHeat: newFBIHeat })
    }

    const asset = ASSETS.find(a => a.id === position.assetId)
    const plSign = profitLoss >= 0 ? '+' : ''
    const emoji = profitLoss >= 0 ? '📈' : '📉'
    const tradeMessage = `${emoji} COVERED ${position.qty} ${asset?.name}: ${plSign}$${Math.abs(profitLoss).toLocaleString('en-US')}`

    const newShortPositions = shortPositions.filter(p => p.id !== positionId)

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
    const originalDownPayment = position.qty * position.entryPrice / position.leverage
    const profitLoss = afterDebt - originalDownPayment
    const profitLossPct = originalDownPayment > 0 ? (profitLoss / originalDownPayment) * 100 : 0

    if (profitLoss < 0) {
      const heatIncrease = Math.min(15, Math.abs(profitLoss) / 10000)

      const { wifeSuspicion } = get()
      const newWifeSuspicion = Math.min(100, wifeSuspicion + heatIncrease)
      set({ wifeSuspicion: newWifeSuspicion })
    }

    const { fbiHeat } = get()
    const newFBIHeat = Math.max(0, fbiHeat - 3)
    set({ fbiHeat: newFBIHeat })

    const asset = ASSETS.find(a => a.id === position.assetId)
    const plSign = profitLoss >= 0 ? '+' : ''
    const emoji = profitLoss >= 0 ? '🚀' : '💸'

    const newPositions = leveragedPositions.filter(p => p.id !== positionId)

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

  investInStartup: (amount: number) => {
    const { cash, day, pendingStartupOffer, activeInvestments, usedStartupIds, ownedLuxury } = get()

    if (!pendingStartupOffer) return
    if (amount > cash) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

    // Private jet gives 10% reduction in failure rate
    const hasPrivateJet = ownedLuxury.includes('private_jet')
    const outcomeBonus = hasPrivateJet ? 0.10 : 0

    let outcome = selectOutcomeWithBonus(pendingStartupOffer, outcomeBonus)

    const { scriptedGameNumber } = get()
    if (scriptedGameNumber === 1) {
      const forcedMultiplier = 10 + Math.floor(Math.random() * 11) // 10-20x
      const positiveOutcomes = pendingStartupOffer.outcomes.filter(o => o.multiplier > 0)
      if (positiveOutcomes.length > 0) {
        const baseOutcome = positiveOutcomes[Math.floor(Math.random() * positiveOutcomes.length)]
        outcome = { ...baseOutcome, multiplier: forcedMultiplier }
      }
    }

    let duration = getRandomDuration(pendingStartupOffer)

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
      set({
        pendingStartupOffer: null,
        usedStartupIds: [...usedStartupIds, pendingStartupOffer.id]
      })
    } else {
      set({ pendingStartupOffer: null })
    }
  },

  liquidateForStartup: (amount: number) => {
    const { pendingStartupOffer, cash } = get()
    if (!pendingStartupOffer || amount <= cash) return

    set({
      pendingLiquidation: {
        amountNeeded: amount,
        reason: 'startup_investment',
        headline: `Sold assets to invest in ${pendingStartupOffer.name}`,
        startupInvestmentAmount: amount,
        startupOffer: pendingStartupOffer,
      },
      pendingStartupOffer: null,
    })
  },

  cancelStartupLiquidation: () => {
    const { pendingLiquidation } = get()
    if (!pendingLiquidation || pendingLiquidation.reason !== 'startup_investment') return

    set({
      pendingLiquidation: null,
      pendingStartupOffer: pendingLiquidation.startupOffer || null,
    })
  },

  buyLifestyle: (assetId: string) => {
    const { cash, lifestylePrices, ownedLifestyle, ownedLuxury, day } = get()
    const asset = LIFESTYLE_ASSETS.find(a => a.id === assetId)
    if (!asset) return

    let price = lifestylePrices[assetId] || asset.basePrice

    const ownsYacht = ownedLuxury.includes('mega_yacht')
    if (asset.category === 'private_equity' && ownsYacht) {
      price = Math.floor(price * 0.80)
    }

    if (cash < price) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

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

    const ownedItem = ownedLifestyle.find(o => o.assetId === assetId)
    if (!ownedItem) {
      set({ activeErrorMessage: 'NOT OWNED' })
      return
    }

    const salePrice = lifestylePrices[assetId] || asset.basePrice
    const profitLoss = salePrice - ownedItem.purchasePrice
    const profitLossPct = ((salePrice / ownedItem.purchasePrice) - 1) * 100

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

  setShowPortfolio: (show: boolean) => set({ showPortfolio: show, ...(show ? {} : { portfolioAdvancePending: false }) }),
  setShowPortfolioBeforeAdvance: (show: boolean) => {
    set({ showPortfolioBeforeAdvance: show })
    if (typeof window !== 'undefined') {
      localStorage.setItem('showPortfolioBeforeAdvance', String(show))
    }
  },
  confirmAdvance: () => {
    set({ showPortfolio: false, portfolioAdvancePending: false })

    const { pendingGameOver } = get()
    if (pendingGameOver) {
      const { day, gameDuration } = get()
      saveGameResult(false, pendingGameOver.netWorth, day, gameDuration, pendingGameOver.reason, get().isLoggedIn, get().isUsingProTrial, get().username)
      set({ screen: 'gameover', gameOverReason: pendingGameOver.reason, pendingGameOver: null, isUsingProTrial: false })
      return
    }

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
      if (nextScriptedDay?.encounter && !shouldSkipScriptedEncounter(nextScriptedDay.encounter, encounterState, netWorth)) {
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

    const newSuspicion = Math.max(0, wifeSuspicion - gift.heatReduction)
    const freezeDay = gift.freezeDays ? day + gift.freezeDays : null

    set({
      cash: Math.round((cash - gift.cost) * 100) / 100,
      wifeSuspicion: newSuspicion,
      wifeSuspicionFrozenUntilDay: freezeDay,
      activeBuyMessage: `BOUGHT ${gift.name} - Suspicion reduced by ${gift.heatReduction}%`,
      showGiftsModal: false,
    })
  },

  clearSellToast: () => set({ activeSellToast: null }),
  clearBuyMessage: () => set({ activeBuyMessage: null }),
  clearInvestmentBuyMessage: () => set({ activeInvestmentBuyMessage: null }),
  clearInvestmentResultToast: () => set({ activeInvestmentResultToast: null }),
  clearErrorMessage: () => set({ activeErrorMessage: null }),
  clearPendingAchievement: () => set({ pendingAchievement: null }),
  triggerAchievement: (id: string) => {
    capture('achievement_unlocked', { achievement_id: id })
    set({ pendingAchievement: id })
  },

  clearMilestone: () => set({ milestonePhase: 'idle', activeMilestone: null }),

  dismissCelebration: () => {
    const { celebrationQueue } = get()

    if (celebrationQueue.length > 0) {
      const [next, ...rest] = celebrationQueue
      set({
        celebrationQueue: rest,
        activeCelebration: next,
      })
    } else {
      set({
        activeCelebration: null,
        isCelebrationDay: false,
      })
    }
  },

  confirmEncounterResult: (result: EncounterResult, encounterType: EncounterType, pendingShitcoinData?: { outcome: 'moon' | 'rug'; profit: number } | null) => {
    const { pendingEncounter, encounterState, cash, day, queuedStartupOffer, holdings, prices } = get()

    if (!pendingEncounter) return

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

    if (result.liquidationRequired !== undefined && result.liquidationRequired > 0) {
      const amountNeeded = result.liquidationRequired

      if (cash >= amountNeeded) {
        newCash = cash - amountNeeded
      } else {
        const { ownedLifestyle, lifestylePrices, leveragedPositions, shortPositions, ownedLuxury } = get()
        const currentNetWorth = get().getNetWorth()

        if (currentNetWorth - amountNeeded <= 0) {
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
        return
      }
    } else if (result.cashChange !== undefined) {
      newCash = cash + result.cashChange
    }

    if (result.gameOver) {
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

    const shitcoinToStore = pendingShitcoinData
      ? {
          investedDay: day + 1,
          resolvesDay: day + 1 + 2,
          outcome: pendingShitcoinData.outcome,
          profit: pendingShitcoinData.profit,
        }
      : get().pendingShitcoin

    set({
      cash: Math.round(newCash * 100) / 100,
      holdings: newHoldings,
      encounterState: newEncounterState,
      pendingEncounter: null,
      pendingShitcoin: shitcoinToStore,
      message: finalHeadline,
    })

    // Mid-day encounters (story arc backfire) skip nextDay since day was already processed
    if (pendingEncounter?.skipNextDayOnResolve) {
      // SEC penalty may have caused bankruptcy; nextDay() won't run to check
      const nw = get().getNetWorth()
      const c = get().cash
      if (nw < 0 && c <= 0 && !get().pendingGameOver) {
        set({ pendingGameOver: { reason: 'BANKRUPT', netWorth: nw } })
      }
      return
    }

    get().nextDay()

    const currentState = get()
    if (queuedStartupOffer && !currentState.pendingStartupOffer) {
      set({ pendingStartupOffer: queuedStartupOffer })
    }

    set({ queuedStartupOffer: null })
  },

  confirmLiquidationSelection: (selectedAssets: Array<{ type: 'luxury' | 'lifestyle' | 'leveraged' | 'short' | 'trading'; id: string; currentValue: number; quantity: number }>) => {
    const { pendingLiquidation, cash, holdings, prices, costBasis, ownedLifestyle, ownedLuxury, leveragedPositions, shortPositions, wifeSuspicion, queuedStartupOffer } = get()

    if (!pendingLiquidation) return

    const { amountNeeded, headline, encounterState: newEncounterState } = pendingLiquidation

    let totalLiquidated = 0
    let newHoldings = { ...holdings }
    let newCostBasis = { ...costBasis }
    let newOwnedLifestyle = [...ownedLifestyle]
    let newOwnedLuxury = [...ownedLuxury]
    let newLeveragedPositions = [...leveragedPositions]
    let newShortPositions = [...shortPositions]

    selectedAssets.forEach(asset => {
      if (asset.type === 'luxury') {
        newOwnedLuxury = newOwnedLuxury.filter(id => id !== asset.id)
        totalLiquidated += asset.currentValue
      } else if (asset.type === 'lifestyle') {
        newOwnedLifestyle = newOwnedLifestyle.filter(owned => owned.assetId !== asset.id)
        totalLiquidated += asset.currentValue
      } else if (asset.type === 'leveraged') {
        newLeveragedPositions = newLeveragedPositions.filter(p => p.id !== asset.id)
        totalLiquidated += asset.currentValue
      } else if (asset.type === 'short') {
        newShortPositions = newShortPositions.filter(p => p.id !== asset.id)
        totalLiquidated += asset.currentValue
      } else {
        const currentQty = newHoldings[asset.id] || 0
        const price = prices[asset.id] || 0
        const qtyToSell = Math.min(asset.quantity, currentQty)
        newHoldings[asset.id] = currentQty - qtyToSell
        totalLiquidated += qtyToSell * price

        if (newHoldings[asset.id] <= 0) {
          delete newHoldings[asset.id]
          delete newCostBasis[asset.id]
        }
      }
    })

    if (pendingLiquidation.reason === 'startup_investment') {
      const cashAfterSale = cash + totalLiquidated
      set({
        cash: Math.round(cashAfterSale * 100) / 100,
        holdings: newHoldings,
        costBasis: newCostBasis,
        ownedLifestyle: newOwnedLifestyle,
        ownedLuxury: newOwnedLuxury,
        leveragedPositions: newLeveragedPositions,
        shortPositions: newShortPositions,
        pendingLiquidation: null,
        pendingStartupOffer: pendingLiquidation.startupOffer || null,
      })
      get().investInStartup(amountNeeded)
    } else {
      const newCash = cash + totalLiquidated - amountNeeded
      const finalHeadline = `${headline} (Assets seized to cover penalty)`
      const newWifeSuspicion = Math.min(100, wifeSuspicion + 15)

      set({
        cash: Math.round(newCash * 100) / 100,
        holdings: newHoldings,
        costBasis: newCostBasis,
        ownedLifestyle: newOwnedLifestyle,
        ownedLuxury: newOwnedLuxury,
        leveragedPositions: newLeveragedPositions,
        shortPositions: newShortPositions,
        wifeSuspicion: newWifeSuspicion,
        encounterState: pendingLiquidation.encounterState,
        pendingLiquidation: null,
        message: finalHeadline,
      })

      get().nextDay()

      const currentState = get()
      if (queuedStartupOffer && !currentState.pendingStartupOffer) {
        set({ pendingStartupOffer: queuedStartupOffer })
      }
      set({ queuedStartupOffer: null })
    }
  },

  buyLuxuryAsset: (assetId: LuxuryAssetId) => {
    const { cash, ownedLuxury, wifeSuspicion } = get()
    const asset = getLuxuryAsset(assetId)
    if (!asset) return

    if (ownedLuxury.includes(assetId)) {
      set({ activeErrorMessage: 'ALREADY OWNED' })
      return
    }

    const effectivePrice = asset.basePrice

    if (cash < effectivePrice) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

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

    const sellPrice = Math.floor(asset.basePrice * 0.80)

    set({
      cash: cash + sellPrice,
      ownedLuxury: ownedLuxury.filter(id => id !== assetId),
      activeBuyMessage: `${asset.emoji} SOLD FOR $${sellPrice.toLocaleString('en-US')}`,
    })
  },

  setPendingLifestyleAsset: (assetId: string | null) => {
    set({ pendingLifestyleAssetId: assetId })
  },

  setPendingLuxuryAsset: (assetId: LuxuryAssetId | null) => {
    set({ pendingLuxuryAssetId: assetId })
  },

  executePEAbility: (abilityId, peAssetId) => {
    const { cash, day, ownedLifestyle, usedPEAbilities, todayNews, wifeSuspicion, fbiHeat } = get()

    const { PE_ABILITIES, getPEAbilities } = require('@/lib/game/lifestyleAssets')
    const { ABILITY_HEADLINES } = require('@/lib/game/abilityHeadlines')
    const ability = PE_ABILITIES[abilityId]
    if (!ability) {
      set({ activeErrorMessage: 'INVALID ABILITY' })
      return
    }

    const ownsPE = ownedLifestyle.some(o => o.assetId === peAssetId)
    if (!ownsPE) {
      set({ activeErrorMessage: 'MUST OWN COMPANY' })
      return
    }

    const peAbilities = getPEAbilities(peAssetId)
    if (!peAbilities.some((a: { id: string }) => a.id === abilityId)) {
      set({ activeErrorMessage: 'ABILITY NOT AVAILABLE' })
      return
    }

    if (!ability.repeatable && usedPEAbilities.some(u => u.abilityId === abilityId)) {
      set({ activeErrorMessage: 'ABILITY ALREADY USED' })
      return
    }

    if (ability.repeatable && get().pendingStoryArc) {
      set({ activeErrorMessage: 'TIP ALREADY IN PROGRESS' })
      return
    }

    if (cash < ability.cost) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

    if (abilityId === 'run_for_president') {
      const isWin = Math.random() < 0.5

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

    if (abilityId === 'insider_tip') {
      const { INSIDER_TIP_SCENARIOS } = require('@/lib/game/lifestyleAssets')

      const scenario = INSIDER_TIP_SCENARIOS[Math.floor(Math.random() * INSIDER_TIP_SCENARIOS.length)]

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

    const newCash = cash - ability.cost

    const isUnfavorable = Math.random() < ability.backfireChance
    const storyOutcome = isUnfavorable ? 'unfavorable' : 'favorable'

    const effects = isUnfavorable ? (ability.backfireEffects.priceEffects || {}) : ability.successEffects

    const headlines = ABILITY_HEADLINES[abilityId]
    const part1Headline = headlines?.part1 || `${ability.name.toUpperCase()} OPERATION UNDERWAY`
    const part2Headline = headlines?.part2 || `${ability.name.toUpperCase()} DEVELOPING...`
    const part3Headline = isUnfavorable
      ? (headlines?.backfirePart3 || `${ability.name.toUpperCase()} OPERATION EXPOSED`)
      : (headlines?.successPart3 || `${ability.name.toUpperCase()} SUCCESSFUL`)

    // FBI heat stored but not applied until Day N+2 when outcome is revealed
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
      fbiHeatIncrease,
      additionalConsequences: isUnfavorable ? {
        losePE: ability.backfireEffects.losePE,
        fine: ability.backfireEffects.fine,
        triggerEncounter: ability.backfireEffects.triggerEncounter,
        gameOverRisk: ability.backfireEffects.gameOverRisk,
      } : undefined,
    }

    const newUsedAbilities = [...usedPEAbilities, {
      abilityId,
      usedOnDay: day,
      didBackfire: null,
    }]

    const message = `🎯 ${ability.emoji} ${ability.name.toUpperCase()} INITIATED`

    const newWifeSuspicion = Math.min(100, wifeSuspicion + 10)
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

    const { PE_ABILITIES, getPEAbilities } = require('@/lib/game/lifestyleAssets')
    const ability = PE_ABILITIES[abilityId]
    if (!ability) return false

    const ownsPE = ownedLifestyle.some(o => o.assetId === peAssetId)
    if (!ownsPE) return false

    const peAbilities = getPEAbilities(peAssetId)
    if (!peAbilities.some((a: { id: string }) => a.id === abilityId)) return false

    if (ability.repeatable) {
      if (pendingStoryArc) return false
    } else {
      if (usedPEAbilities.some(u => u.abilityId === abilityId)) return false
    }

    if (cash < ability.cost) return false

    return true
  },

  getPEAbilityStatus: (abilityId) => {
    const { usedPEAbilities, pendingStoryArc } = get()
    const { PE_ABILITIES } = require('@/lib/game/lifestyleAssets')
    const ability = PE_ABILITIES[abilityId]

    if (ability?.repeatable) {
      const isPending = pendingStoryArc?.abilityId === abilityId
      return {
        isUsed: isPending,
        usedOnDay: isPending ? pendingStoryArc.startDay : null,
        didBackfire: null,
      }
    }

    const used = usedPEAbilities.find(u => u.abilityId === abilityId)
    return {
      isUsed: !!used,
      usedOnDay: used?.usedOnDay ?? null,
      didBackfire: used?.didBackfire ?? null,
    }
  },

  confirmElectionResult: () => {
    const { pendingElection, lifestylePrices, fbiHeat } = get()
    if (!pendingElection) return

    if (pendingElection.result === 'win') {
      set({
        isPresident: true,
        pendingElection: null,
        activeBuyMessage: '🏛️ MR. PRESIDENT - THE OVAL OFFICE AWAITS',
      })
    } else {
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

    const { PRESIDENTIAL_ABILITIES } = require('@/lib/game/presidentialAbilities')
    const ability = PRESIDENTIAL_ABILITIES[abilityId]

    if (!ability) {
      set({ activeErrorMessage: 'INVALID ABILITY' })
      return
    }

    if (!isPresident) {
      set({ activeErrorMessage: 'MUST BE PRESIDENT' })
      return
    }

    if (usedPresidentialAbilities.some(u => u.abilityId === abilityId)) {
      set({ activeErrorMessage: 'ABILITY ALREADY USED' })
      return
    }

    if (cash < ability.cost) {
      set({ activeErrorMessage: 'NOT ENOUGH CASH' })
      return
    }

    let newCash = cash - ability.cost
    let newFbiHeat = fbiHeat
    let hasPardoned = false
    let updatedLifestylePrices = { ...lifestylePrices }
    let pendingInflation = null

    if (ability.cashGain) {
      newCash += ability.cashGain
    }

    if (ability.fbiReset) {
      newFbiHeat = 0
    }

    if (ability.permanentImmunity) {
      hasPardoned = true
    }

    if (ability.apexBoost) {
      const apexPrice = lifestylePrices['pe_apex_media'] || 12_000_000_000
      updatedLifestylePrices['pe_apex_media'] = apexPrice * (1 + ability.apexBoost)
    }

    if (ability.delayedEffect) {
      pendingInflation = {
        triggerOnDay: day + ability.delayedEffect.daysDelay,
        effects: ability.delayedEffect.effects,
        headline: ability.delayedEffect.headline,
      }
    }

    const pendingEffects = Object.keys(ability.effects).length > 0 ? {
      abilityId,
      effects: ability.effects,
      isBackfire: false,
      peAssetId: 'presidential',
      eventHeadline: `🏛️ PRESIDENT SIGNS ${ability.name.toUpperCase()} INTO LAW`,
    } : null

    const rumorNewsItem = {
      headline: `🏛️ PRESIDENT PREPARING TO SIGN ${ability.name.toUpperCase()}`,
      effects: {},
      labelType: 'breaking' as const,
    }

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

    const { PRESIDENTIAL_ABILITIES } = require('@/lib/game/presidentialAbilities')
    const ability = PRESIDENTIAL_ABILITIES[abilityId]
    if (!ability) return false

    if (!isPresident) return false
    if (usedPresidentialAbilities.some(u => u.abilityId === abilityId)) return false
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

  getNetWorth: () => {
    const { cash, holdings, prices, activeInvestments, ownedLifestyle, lifestylePrices, leveragedPositions, shortPositions, ownedLuxury, creditCardDebt, trustFundBalance } = get()

    let portfolio = 0
    Object.entries(holdings).forEach(([id, qty]) => {
      portfolio += (prices[id] || 0) * qty
    })

    const leveragedValue = leveragedPositions.reduce((sum, pos) => {
      const currentPrice = prices[pos.assetId] || 0
      const positionValue = currentPrice * pos.qty
      return sum + (positionValue - pos.debtAmount)
    }, 0)

    const shortUnrealizedPL = shortPositions.reduce((sum, pos) => {
      const currentPrice = prices[pos.assetId] || 0
      return sum + (pos.cashReceived - currentPrice * pos.qty)
    }, 0)

    const startupValue = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    const lifestyleValue = ownedLifestyle.reduce((sum, owned) => {
      return sum + (lifestylePrices[owned.assetId] || 0)
    }, 0)
    const luxuryValue = ownedLuxury.reduce((sum, id) => {
      const asset = getLuxuryAsset(id)
      return sum + (asset?.basePrice || 0)
    }, 0)

    return Math.round((cash + portfolio + leveragedValue + startupValue + lifestyleValue + luxuryValue + trustFundBalance + shortUnrealizedPL - creditCardDebt) * 100) / 100 || 0
  },

  getTotalDebt: () => {
    const { leveragedPositions, creditCardDebt } = get()
    const leverageDebt = leveragedPositions.reduce((sum, pos) => sum + pos.debtAmount, 0)
    return leverageDebt + creditCardDebt
  },

  getPortfolioValue: () => {
    const { holdings, prices, activeInvestments, ownedLifestyle, lifestylePrices } = get()
    let total = 0
    Object.entries(holdings).forEach(([id, qty]) => {
      total += (prices[id] || 0) * qty
    })
    const startupValue = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0)
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

  getInvestmentChange: (id: string) => {
    const { costBasis, prices } = get()
    const basis = costBasis[id]
    if (!basis || basis.totalQty === 0) return 0

    const avgCost = basis.totalCost / basis.totalQty
    const currentPrice = prices[id] || 0
    if (avgCost === 0) return 0

    return ((currentPrice - avgCost) / avgCost) * 100
  },

  getAvgCost: (id: string) => {
    const { costBasis } = get()
    const basis = costBasis[id]
    if (!basis || basis.totalQty === 0) return 0
    return basis.totalCost / basis.totalQty
  },

  getTotalPortfolioChange: () => {
    const currentNetWorth = get().getNetWorth()
    return (currentNetWorth / 50000) * 100
  },

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

  setCreditCardDebt: (newDebt: number) => {
    const { cash, creditCardDebt } = get()
    const repayAmount = creditCardDebt - newDebt

    set({
      creditCardDebt: newDebt,
      cash: cash - repayAmount
    })
  },

  borrowCreditCardDebt: (amount: number) => {
    const { cash, creditCardDebt } = get()
    const netWorth = get().getNetWorth()
    const maxBorrowable = Math.max(0, netWorth - creditCardDebt)
    const actualBorrow = Math.min(amount, maxBorrowable)
    if (actualBorrow <= 0) return
    set({
      creditCardDebt: Math.round((creditCardDebt + actualBorrow) * 100) / 100,
      cash: Math.round((cash + actualBorrow) * 100) / 100,
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
