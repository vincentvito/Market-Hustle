export interface Asset {
  id: string
  name: string
  basePrice: number
  volatility: number
}

// =============================================================================
// EVENT SENTIMENT & MARKET MOOD SYSTEM
// Prevents conflicting news (e.g., bullish BTC event right after bearish BTC event)
// =============================================================================

export type EventSentiment = 'bullish' | 'bearish' | 'neutral' | 'mixed'

// Tracks market mood per asset (decays over time)
export interface AssetMood {
  assetId: string
  sentiment: 'bullish' | 'bearish'  // Only track directional moods (not neutral/mixed)
  recordedDay: number               // Day when this mood was set
  source: string                    // Headline that caused this mood (for debugging)
}

export interface MarketEvent {
  category: string
  headline: string
  effects: Record<string, number>
  // Sentiment tracking for conflict prevention
  sentiment?: EventSentiment         // Overall sentiment (auto-derived if not specified)
  sentimentAssets?: string[]         // Which assets this sentiment applies to (auto-derived from effects if not specified)
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
  sentiment?: EventSentiment         // Sentiment of this specific outcome
  sentimentAssets?: string[]         // Which assets this outcome affects sentiment-wise
}

export interface EventChain {
  id: string
  category: string
  rumor: string
  duration: number // days until resolution
  outcomes: EventChainOutcome[] // 2-4 possible outcomes
  // Sentiment for conflict prevention (rumor phase creates anticipation mood)
  rumorSentiment?: EventSentiment    // Sentiment during the rumor/anticipation phase
  sentimentAssets?: string[]         // Which assets are affected by this chain
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

export type NewsLabelType = 'rumor' | 'developing' | 'news' | 'breaking' | 'none' | 'gossip'

export interface NewsItem {
  headline: string
  effects: Record<string, number>
  labelType?: NewsLabelType
}

// Price history for candlestick charts
export interface DayCandle {
  day: number
  open: number
  high: number
  low: number
  close: number
}

export type GameDuration = 30 | 45 | 60

export interface GameState {
  screen: GameScreen
  day: number
  gameDuration: GameDuration  // Total days in this game (30, 45, or 60)
  cash: number
  holdings: Record<string, number>
  // Margin trading positions (Pro tier)
  leveragedPositions: LeveragedPosition[]
  shortPositions: ShortPosition[]
  prices: Record<string, number>
  prevPrices: Record<string, number>
  // Price history for each asset (for candlestick charts)
  priceHistory: Record<string, DayCandle[]>
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
  // Lifestyle assets state
  ownedLifestyle: OwnedLifestyleItem[]
  lifestylePrices: Record<string, number>
  // Event escalation state
  activeEscalations: ActiveEscalation[]
  // Milestone tracking
  hasReached1M: boolean
  reachedMilestones: string[] // IDs of milestones reached this game
  activeMilestone: { id: string; title: string; tier: string; scarcityMessage: string } | null // Currently displaying
  milestonePhase: 'idle' | 'takeover' | 'persist' // Animation phase
  // Multi-stage story state (Phase 1: runs alongside existing system)
  activeStories: ActiveStory[]
  usedStoryIds: string[] // Stories already used this game
  // Wall St Gossip state
  gossipState: GossipState
  // Random Encounter state
  encounterState: EncounterState
  pendingEncounter: PendingEncounter | null  // Encounter awaiting player decision
  queuedStartupOffer: Startup | null  // Startup offer delayed by encounter
  // Near-miss notification state (FOMO triggers)
  soldPositions: SoldPosition[]              // Track recent sales for near-miss detection
  activeNearMiss: NearMissNotification | null // Currently displayed near-miss
  lastNearMissDay: number                    // For cooldown between notifications
  // Market mood tracking (for conflict prevention)
  assetMoods: AssetMood[]                    // Current mood per asset (decays after 3 days)
  // Flavor events (meme/celebrity news in secondary slot)
  usedFlavorHeadlines: string[]              // Headlines already shown this game
}

// Wall St Gossip tracking
export interface GossipState {
  gossipCount: number
  lastGossipDay: number
}

// Random Encounter tracking
export interface EncounterState {
  encounterCount: number          // Total encounters this game (max 2)
  lastEncounterDay: number        // For 8-day cooldown
  usedSEC: boolean                // SEC can only happen once
  usedKidney: boolean             // Kidney can only happen once
  divorceCount: number            // Max 2 divorces per game
}

export type EncounterType = 'sec' | 'divorce' | 'shitcoin' | 'kidney' | 'roulette'
export type RouletteColor = 'red' | 'black' | 'zero'

export interface PendingEncounter {
  type: EncounterType
  // For roulette, need to track selected color and bet amount
  rouletteColor?: RouletteColor
  rouletteBet?: number
}

// Encounter resolution result
export interface EncounterResult {
  headline: string
  cashChange?: number
  gameOver?: boolean
  gameOverReason?: string
  // Roulette-specific fields for result display
  spinResult?: number        // The number the ball landed on (0-36)
  spinColor?: RouletteColor  // The color of the result
  // Forced liquidation fields (for SEC/Divorce when cash < penalty)
  liquidationRequired?: number  // Total amount to extract (will force-sell assets if cash insufficient)
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

// Multi-stage Story Types
export interface StoryStage {
  headline: string
  effects: Record<string, number>
  branches?: {
    positive: { headline: string; effects: Record<string, number>; probability: number }
    negative: { headline: string; effects: Record<string, number>; probability: number }
  }
}

export interface Story {
  id: string
  category: string
  subcategory?: string
  teaser: string  // Short summary shown in DEVELOPING section
  stages: StoryStage[]
}

export interface ActiveStory {
  storyId: string
  currentStage: number  // 0-indexed, tracks which stage we're on
  startDay: number
  lastAdvanceDay: number  // Day when story last showed a headline (to avoid duplicate with DEVELOPING)
  resolvedPositive?: boolean  // Set when final stage resolves
}

// Near-Miss Notification Types (FOMO triggers)
export interface SoldPosition {
  assetId: string
  assetName: string
  soldDay: number           // Day the sale occurred
  soldPrice: number         // Price at time of sale
  soldQty: number           // Quantity sold
  notificationShown: boolean // Prevent duplicate notifications
}

export type NearMissType = 'missed_moon' | 'missed_gain' | 'bullet_dodged' | 'lucky_exit'

export interface NearMissNotification {
  type: NearMissType
  assetName: string
  message: string
  cashDiff: number           // What they would have gained/lost
  percentChange: number      // % change since sale
}

// =============================================================================
// MARGIN TRADING TYPES (Pro Tier)
// =============================================================================

export type LeverageLevel = 1 | 2 | 5 | 10

export interface LeveragedPosition {
  id: string              // Unique ID for stable references
  assetId: string
  qty: number
  entryPrice: number
  leverage: LeverageLevel
  debtAmount: number      // Total borrowed = (qty × entryPrice) × (1 - 1/leverage)
  purchaseDay: number
}

export interface ShortPosition {
  id: string              // Unique ID for stable references
  assetId: string
  qty: number
  entryPrice: number
  cashReceived: number    // Cash received = qty × entryPrice
  openDay: number
}
