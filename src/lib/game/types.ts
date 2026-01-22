export interface Asset {
  id: string
  name: string
  basePrice: number
  volatility: number
}

export interface MarketEvent {
  category: string
  headline: string
  effects: Record<string, number>
  // Escalation: increases probability of certain categories for N days
  escalates?: {
    categories: string[]  // which categories become more likely
    boost: number         // probability multiplier (e.g., 2.0 = 2x more likely)
    duration: number      // how many days the boost lasts
  }
}

// Tracks active escalation boosts
export interface ActiveEscalation {
  categories: string[]
  boost: number
  expiresDay: number
}

// Event Chain Types
export interface EventChainOutcome {
  headline: string
  probability: number
  effects: Record<string, number>
}

export interface EventChain {
  id: string
  category: string
  rumor: string
  duration: number // days until resolution
  outcomes: [EventChainOutcome, EventChainOutcome] // [outcomeA, outcomeB]
}

export interface ActiveChain {
  chainId: string
  startDay: number
  daysRemaining: number
  rumor: string
  category: string
}

export interface ResolvedChain {
  chainId: string
  outcome: EventChainOutcome
  day: number
}

export type GameScreen = 'title' | 'game' | 'gameover' | 'win'

export interface NewsItem {
  headline: string
  effects: Record<string, number>
}

export interface GameState {
  screen: GameScreen
  day: number
  cash: number
  holdings: Record<string, number>
  prices: Record<string, number>
  prevPrices: Record<string, number>
  // Cost basis tracking: { assetId: { totalCost: number, totalQty: number } }
  costBasis: Record<string, { totalCost: number; totalQty: number }>
  // Track starting net worth for overall P/L calculation
  initialNetWorth: number
  event: MarketEvent | null
  message: string
  gameOverReason: string
  selectedAsset: string | null
  buyQty: number
  newsHistory: string[]
  showPortfolio: boolean
  // Event chain state
  activeChains: ActiveChain[]
  usedChainIds: string[] // chains already used this game (prevents repeats)
  todayNews: NewsItem[] // resolved events/news for today (left column)
  rumors: ActiveChain[] // active rumors (right column)
  selectedNews: NewsItem | null // currently selected news for detail overlay
  // Startup investment state
  activeInvestments: ActiveInvestment[]
  usedStartupIds: string[]
  pendingStartupOffer: Startup | null
  // Price spike state
  spikeSchedule: ScheduledSpike[]
  activeSpikeRumors: ActiveSpikeRumor[]
  // Lifestyle assets state
  ownedLifestyle: OwnedLifestyleItem[]
  lifestylePrices: Record<string, number>
  // Event escalation state
  activeEscalations: ActiveEscalation[]
  // Milestone tracking
  hasReached1M: boolean
}

export interface GameAction {
  type: 'BUY' | 'SELL' | 'NEXT_DAY'
  day: number
  asset?: string
  quantity?: number
  price?: number
  timestamp: number
}

// Startup Investment Types
export type StartupTier = 'angel' | 'vc'
export type StartupCategory = 'tech' | 'biotech' | 'space' | 'crypto' | 'ai' | 'consumer' | 'energy' | 'fintech'

export interface StartupOutcome {
  multiplier: number
  probability: number
  headline: string
  marketEffects?: Record<string, number>
}

export interface Startup {
  id: string
  name: string
  tagline: string
  category: StartupCategory
  tier: StartupTier
  raising: string
  duration: [number, number] // [min, max] days to resolve
  outcomes: StartupOutcome[]
  hints: {
    positive: string[]
    negative: string[]
  }
}

export interface ActiveInvestment {
  startupId: string
  startupName: string
  amount: number
  investedDay: number
  resolvesDay: number
  hintShown: boolean
  outcome: StartupOutcome | null // predetermined at investment time
}

// Price Spike Types (imported from spikes.ts for reference)
export interface ScheduledSpike {
  day: number // day the spike happens
  eventId: string
  rumorDay: number | null // day the rumor appears (null = no rumor)
}

export interface ActiveSpikeRumor {
  eventId: string
  rumor: string
  spikeDay: number
}

// Lifestyle Asset Types
export type LifestyleCategory = 'property' | 'jet' | 'team'

export interface LifestyleAsset {
  id: string
  name: string
  emoji: string
  category: LifestyleCategory
  basePrice: number
  volatility: number // price fluctuation (like trading assets)
  dailyReturn: number // % of purchase price per day (positive = income, negative = cost), OR fixed amount for jets
  description: string
  vcDealBoost?: number // for jets: bonus to VC deal probability (e.g., 0.10 = +10%)
}

export interface OwnedLifestyleItem {
  assetId: string
  purchasePrice: number
  purchaseDay: number
}
