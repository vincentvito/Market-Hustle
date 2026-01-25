import { create } from 'zustand'
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
import type { GameState, GameDuration, MarketEvent, GameScreen, ActiveChain, EventChain, EventChainOutcome, NewsItem, Startup, ActiveInvestment, StartupOutcome, OwnedLifestyleItem, ActiveEscalation, ActiveStory, DayCandle, GossipState, EncounterState, EncounterType, RouletteColor, PendingEncounter, SoldPosition, NearMissNotification, NearMissType, AssetMood, LeverageLevel, LeveragedPosition, ShortPosition } from '@/lib/game/types'
import {
  hasEventConflict,
  hasChainConflict,
  recordEventMood,
  recordChainOutcomeMood,
  recordChainRumorMood,
  recordStoryMood,
  decayMoods,
  resolveChainWithMood,
  MAX_CONFLICT_RETRIES,
} from '@/lib/game/sentimentHelpers'
import { loadUserState, saveUserState, incrementGamesPlayed, setSelectedDuration as persistSelectedDuration } from '@/lib/game/persistence'
import { canStartGame, getRemainingGames, type UserTier, type GameDuration as UserGameDuration } from '@/lib/game/userState'

interface GameStore extends GameState {
  // User tier state (loaded from persistence)
  userTier: UserTier
  selectedDuration: GameDuration
  selectedTheme: 'retro' | 'modern3' | 'retro2' | 'bloomberg'

  // Daily limit modal (free tier)
  showDailyLimitModal: boolean
  gamesRemaining: number
  setShowDailyLimitModal: (show: boolean) => void

  // Duration selection (persisted)
  setSelectedDuration: (duration: GameDuration) => void

  // Theme selection (persisted)
  setSelectedTheme: (theme: 'retro' | 'modern3' | 'retro2' | 'bloomberg') => void

  // Initialize from localStorage (call on app mount)
  initializeFromStorage: () => void

  // Actions
  startGame: (duration?: GameDuration) => void
  buy: (assetId: string, qty: number) => void
  sell: (assetId: string, qty: number) => void
  nextDay: () => void
  selectAsset: (id: string | null) => void
  setBuyQty: (qty: number) => void
  setShowPortfolio: (show: boolean) => void
  setScreen: (screen: GameScreen) => void
  setSelectedNews: (news: NewsItem | null) => void
  // Startup actions
  investInStartup: (amount: number) => void
  dismissStartupOffer: () => void
  // Lifestyle actions
  buyLifestyle: (assetId: string) => void
  sellLifestyle: (assetId: string) => void
  // Margin trading actions (Pro tier)
  buyWithLeverage: (assetId: string, qty: number, leverage: LeverageLevel) => void
  shortSell: (assetId: string, qty: number) => void
  coverShort: (positionId: string) => void
  closeLeveragedPosition: (positionId: string) => void
  // Settings & Achievements
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  pendingAchievement: string | null
  clearPendingAchievement: () => void
  triggerAchievement: (id: string) => void // For testing
  // Milestone actions
  clearMilestone: () => void
  // Encounter actions
  confirmEncounterResult: (result: EncounterResult, encounterType: EncounterType) => void  // Called after player sees result
  triggerNextDay: () => void  // Called when user clicks Next Day button
  // Near-miss actions
  clearNearMiss: () => void  // Dismiss near-miss notification
  // Trade feedback actions
  activeSellToast: {
    message: string
    profitLossPct: number
    isProfit: boolean
  } | null
  activeBuyMessage: string | null
  clearSellToast: () => void
  clearBuyMessage: () => void
  // Investment feedback actions
  activeInvestmentBuyMessage: string | null
  activeInvestmentResultToast: {
    message: string
    profitLossPct: number
    isProfit: boolean
  } | null
  clearInvestmentBuyMessage: () => void
  clearInvestmentResultToast: () => void

  // Computed
  getNetWorth: () => number
  getPortfolioValue: () => number
  getPriceChange: (id: string) => number
  getPortfolioChange: () => number
  getInvestmentChange: (id: string) => number // P/L % from cost basis
  getAvgCost: (id: string) => number // average purchase price
  getTotalPortfolioChange: () => number // change from Day 1
}

function initPrices(): Record<string, number> {
  const p: Record<string, number> = {}
  ASSETS.forEach(a => {
    p[a.id] = Math.round(a.basePrice * (0.9 + Math.random() * 0.2) * 100) / 100
  })
  return p
}

function initLifestylePrices(): Record<string, number> {
  const p: Record<string, number> = {}
  LIFESTYLE_ASSETS.forEach(a => {
    // Lifestyle assets have smaller initial variance (5% either way)
    p[a.id] = Math.round(a.basePrice * (0.95 + Math.random() * 0.1))
  })
  return p
}

// Helper to generate unique position IDs for margin trading
function generatePositionId(): string {
  return `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Helper to get categories that are currently "in use" by active stories or chains
// These categories should be blocked from single events to prevent conflicts
function getActiveTopics(activeStories: ActiveStory[], activeChains: ActiveChain[]): Set<string> {
  const topics = new Set<string>()

  // Add story categories (and subcategories if present)
  activeStories.forEach(active => {
    const story = getStoryById(active.storyId)
    if (story) {
      topics.add(story.category)
      if (story.subcategory) topics.add(story.subcategory)
    }
  })

  // Add chain categories
  activeChains.forEach(chain => {
    topics.add(chain.category)
  })

  return topics
}

function selectRandomEvent(
  activeEscalations: ActiveEscalation[],
  currentDay: number,
  blockedCategories: Set<string>,
  assetMoods: AssetMood[] = []
): MarketEvent | null {
  // Build adjusted weights based on active escalations
  const adjustedWeights: Record<string, number> = { ...CATEGORY_WEIGHTS }

  // Apply escalation boosts (only non-expired ones)
  activeEscalations
    .filter(esc => esc.expiresDay > currentDay)
    .forEach(esc => {
      esc.categories.forEach(cat => {
        if (adjustedWeights[cat] !== undefined) {
          adjustedWeights[cat] *= esc.boost
        }
      })
    })

  // Zero out blocked categories (active stories/chains)
  blockedCategories.forEach(cat => {
    if (adjustedWeights[cat] !== undefined) {
      adjustedWeights[cat] = 0
    }
  })

  // Check if any categories remain
  const remainingWeight = Object.values(adjustedWeights).reduce((a, b) => a + b, 0)
  if (remainingWeight === 0) {
    return null // All categories blocked, caller should use quiet news
  }

  // Normalize weights to sum to 1
  const normalizedWeights: Record<string, number> = {}
  for (const [cat, weight] of Object.entries(adjustedWeights)) {
    normalizedWeights[cat] = weight / remainingWeight
  }

  // Try to find a non-conflicting event (retry up to MAX_CONFLICT_RETRIES times)
  for (let attempt = 0; attempt < MAX_CONFLICT_RETRIES; attempt++) {
    const rand = Math.random()
    let cumulative = 0
    let selectedCategory = 'economic'

    for (const [category, weight] of Object.entries(normalizedWeights)) {
      cumulative += weight
      if (rand <= cumulative) {
        selectedCategory = category
        break
      }
    }

    const categoryEvents = EVENTS.filter(e => e.category === selectedCategory)
    if (categoryEvents.length === 0) continue

    const event = categoryEvents[Math.floor(Math.random() * categoryEvents.length)]

    // Check for sentiment conflict with current market mood
    if (!hasEventConflict(event, assetMoods, currentDay)) {
      return event // No conflict, use this event
    }
    // Conflict found, retry with a different event
  }

  // After MAX_CONFLICT_RETRIES attempts, return null (caller will use quiet news)
  return null
}

function selectRandomChain(
  usedChainIds: string[],
  blockedCategories: Set<string>,
  assetMoods: AssetMood[] = [],
  currentDay: number = 1
): EventChain | null {
  // Build adjusted weights, zeroing out blocked categories
  const adjustedWeights: Record<string, number> = { ...CHAIN_CATEGORY_WEIGHTS }
  blockedCategories.forEach(cat => {
    if (adjustedWeights[cat] !== undefined) {
      adjustedWeights[cat] = 0
    }
  })

  // Check if any categories remain
  const remainingWeight = Object.values(adjustedWeights).reduce((a, b) => a + b, 0)
  if (remainingWeight === 0) {
    return null // All categories blocked
  }

  // Normalize weights
  const normalizedWeights: Record<string, number> = {}
  for (const [cat, weight] of Object.entries(adjustedWeights)) {
    normalizedWeights[cat] = weight / remainingWeight
  }

  // Try to find a non-conflicting chain (retry up to MAX_CONFLICT_RETRIES times)
  for (let attempt = 0; attempt < MAX_CONFLICT_RETRIES; attempt++) {
    // Select category based on weights
    const rand = Math.random()
    let cumulative = 0
    let selectedCategory = 'geopolitical'

    for (const [category, weight] of Object.entries(normalizedWeights)) {
      cumulative += weight
      if (rand <= cumulative) {
        selectedCategory = category
        break
      }
    }

    // Get available chains in this category (not used yet, not blocked)
    let availableChains = EVENT_CHAINS.filter(
      c => c.category === selectedCategory && !usedChainIds.includes(c.id)
    )

    if (availableChains.length === 0) {
      // Try any non-blocked category
      availableChains = EVENT_CHAINS.filter(
        c => !usedChainIds.includes(c.id) && !blockedCategories.has(c.category)
      )
    }

    if (availableChains.length === 0) return null

    const chain = availableChains[Math.floor(Math.random() * availableChains.length)]

    // Check for sentiment conflict with current market mood
    if (!hasChainConflict(chain, assetMoods, currentDay)) {
      return chain // No conflict, use this chain
    }
    // Conflict found, retry with a different chain
  }

  // After MAX_CONFLICT_RETRIES attempts, return null (no chain starts today)
  return null
}

// Startup helper functions
function selectRandomStartup(tier: 'angel' | 'vc', usedStartupIds: string[]): Startup | null {
  const pool = tier === 'angel' ? ANGEL_STARTUPS : VC_STARTUPS
  const available = pool.filter(s => !usedStartupIds.includes(s.id))
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}

function selectOutcome(startup: Startup): StartupOutcome {
  const roll = Math.random()
  let cumulative = 0
  for (const outcome of startup.outcomes) {
    cumulative += outcome.probability
    if (roll <= cumulative) {
      return outcome
    }
  }
  return startup.outcomes[startup.outcomes.length - 1]
}

function getRandomDuration(startup: Startup): number {
  const [min, max] = startup.duration
  return min + Math.floor(Math.random() * (max - min + 1))
}

export const useGame = create<GameStore>((set, get) => ({
  // Initial state
  screen: 'title',
  day: 1,
  gameDuration: 30,
  cash: 100000,
  // User tier (loaded from persistence on first use)
  // DEV MODE: Set to 'pro' for testing margin trading features
  userTier: 'pro',
  selectedDuration: 30,
  selectedTheme: 'modern3',
  // Daily limit modal state
  showDailyLimitModal: false,
  gamesRemaining: 10,
  holdings: {},
  // Margin trading positions (Pro tier)
  leveragedPositions: [],
  shortPositions: [],
  prices: {},
  prevPrices: {},
  priceHistory: {},
  costBasis: {},
  initialNetWorth: 100000,
  event: null,
  message: '',
  activeSellToast: null,
  activeBuyMessage: null,
  activeInvestmentBuyMessage: null,
  activeInvestmentResultToast: null,
  gameOverReason: '',
  selectedAsset: null,
  buyQty: 1,
  newsHistory: ['MARKET OPEN - GOOD LUCK TRADER'],
  showPortfolio: false,
  activeChains: [],
  usedChainIds: [],
  todayNews: [],
  rumors: [],
  selectedNews: null,
  // Startup state
  activeInvestments: [],
  usedStartupIds: [],
  pendingStartupOffer: null,
  // Lifestyle state
  ownedLifestyle: [],
  lifestylePrices: {},
  // Event escalation state
  activeEscalations: [],
  // Milestone tracking
  hasReached1M: false,
  reachedMilestones: [],
  activeMilestone: null,
  milestonePhase: 'idle',
  // Multi-stage story state (Phase 1: runs alongside existing system)
  activeStories: [],
  usedStoryIds: [],
  // Wall St Gossip state
  gossipState: DEFAULT_GOSSIP_STATE,
  // Random Encounter state
  encounterState: DEFAULT_ENCOUNTER_STATE,
  pendingEncounter: null,
  queuedStartupOffer: null,
  // Near-miss notification state
  soldPositions: [],
  activeNearMiss: null,
  lastNearMissDay: 0,
  // Market mood tracking (sentiment conflict prevention)
  assetMoods: [],
  // Flavor events (meme/celebrity news in secondary slot)
  usedFlavorHeadlines: [],
  // Settings & Achievements state
  showSettings: false,
  pendingAchievement: null,

  // Actions
  startGame: (duration?: GameDuration) => {
    // Load user state and check tier for duration restrictions
    const userState = loadUserState()
    const userTier = userState.tier

    // Check daily game limit for free tier users
    if (!canStartGame(userState)) {
      set({
        showDailyLimitModal: true,
        gamesRemaining: 0,
        userTier,
      })
      return
    }

    // Free users can only play 30-day mode
    let gameDuration: GameDuration = duration ?? userState.selectedDuration ?? 30
    if (userTier === 'free' && gameDuration !== 30) {
      gameDuration = 30
    }

    // Update games played counter
    const updatedUserState = incrementGamesPlayed(userState)
    saveUserState(updatedUserState)

    // Update remaining games count for UI
    const remainingAfterStart = getRemainingGames(updatedUserState)

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
      userTier,
      gamesRemaining: remainingAfterStart,
      showDailyLimitModal: false,
    })
  },

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

    // 0c. Check if any chains will resolve today (before story processing)
    // This prevents starting a new story on the same day a chain resolves
    const chainWillResolveToday = updatedChains.some(chain => chain.daysRemaining <= 1)

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
    // Skip if chain is resolving today (prevents headline stacking)
    // Pass active chain categories to prevent story+chain conflicts
    const activeChainCategories = new Set(updatedChains.map(c => c.category))
    if (updatedStories.length < 1 && !chainWillResolveToday && Math.random() < 0.07) {
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

    let newStartupOffer: Startup | null = null

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

      set({ screen: 'gameover', gameOverReason })
    } else if (finalNetWorth <= 0) {
      // Regular bankruptcy (net worth exactly 0)
      set({ screen: 'gameover', gameOverReason: 'BANKRUPT' })
    } else if (newDay > get().gameDuration) {
      set({ screen: 'win' })
    }
  },

  selectAsset: (id: string | null) => set({ selectedAsset: id, buyQty: 1 }),
  setBuyQty: (qty: number) => set({ buyQty: qty }),
  setShowPortfolio: (show: boolean) => set({ showPortfolio: show }),
  setScreen: (screen: GameScreen) => set({ screen }),
  setSelectedNews: (news: NewsItem | null) => set({ selectedNews: news }),

  // Startup investment actions
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

  // Lifestyle actions
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

  // Margin Trading Actions (Pro Tier)
  buyWithLeverage: (assetId: string, qty: number, leverage: LeverageLevel) => {
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

  // Settings & Achievements actions
  setShowSettings: (show: boolean) => set({ showSettings: show }),
  setShowDailyLimitModal: (show: boolean) => set({ showDailyLimitModal: show }),

  // Duration selection - persists to localStorage
  setSelectedDuration: (duration: GameDuration) => {
    const { userTier } = get()
    // Free users can only select 30 days
    const validDuration = userTier === 'free' ? 30 : duration

    // Persist to localStorage
    const userState = loadUserState()
    const updatedState = persistSelectedDuration(userState, validDuration)
    saveUserState(updatedState)

    set({ selectedDuration: validDuration })
  },

  // Theme selection - persists to localStorage
  setSelectedTheme: (theme) => {
    // Persist to localStorage
    const userState = loadUserState()
    saveUserState({ ...userState, selectedTheme: theme })

    // Apply to DOM immediately
    if (typeof document !== 'undefined') {
      if (theme === 'retro') {
        document.documentElement.removeAttribute('data-theme')
      } else {
        document.documentElement.setAttribute('data-theme', theme)
      }
    }

    set({ selectedTheme: theme })
  },

  // Initialize store from localStorage - call on app mount
  initializeFromStorage: () => {
    const userState = loadUserState()

    // Apply theme to DOM
    const storedTheme = userState.selectedTheme || 'modern3'
    const validTheme = (['retro', 'modern3', 'retro2', 'bloomberg'].includes(storedTheme) ? storedTheme : 'modern3') as 'retro' | 'modern3' | 'retro2' | 'bloomberg'
    if (typeof document !== 'undefined') {
      if (validTheme === 'retro') {
        document.documentElement.removeAttribute('data-theme')
      } else {
        document.documentElement.setAttribute('data-theme', validTheme)
      }
    }

    set({
      userTier: userState.tier,
      selectedDuration: userState.selectedDuration ?? 30,
      selectedTheme: validTheme,
      gamesRemaining: getRemainingGames(userState),
    })
  },

  clearPendingAchievement: () => set({ pendingAchievement: null }),
  triggerAchievement: (id: string) => set({ pendingAchievement: id }),

  // Milestone actions
  clearMilestone: () => set({ milestonePhase: 'idle', activeMilestone: null }),

  // Near-miss actions
  clearNearMiss: () => set({ activeNearMiss: null }),

  // Trade feedback actions
  clearSellToast: () => set({ activeSellToast: null }),
  clearBuyMessage: () => set({ activeBuyMessage: null }),
  // Investment feedback actions
  clearInvestmentBuyMessage: () => set({ activeInvestmentBuyMessage: null }),
  clearInvestmentResultToast: () => set({ activeInvestmentResultToast: null }),

  // Encounter actions
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

  // Called after player sees the result screen and clicks OK
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
          set({
            cash: 0,
            holdings: {},
            encounterState: newEncounterState,
            pendingEncounter: null,
            queuedStartupOffer: null,
            screen: 'gameover',
            gameOverReason: 'BANKRUPT',
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

  // Computed
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
}))
