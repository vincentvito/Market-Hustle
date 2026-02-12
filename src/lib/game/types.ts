import type { DirectorState, DirectorConfig, RippleDefinition } from './director'
import type { ScriptedGameDefinition } from './scriptedGames/types'

// =============================================================================
// PE ABILITY TYPES (One-time villain actions)
// =============================================================================

export type PEAbilityId =
  | 'defense_spending_bill'  // Capitol Consulting Group
  | 'drug_fast_track'        // Capitol Consulting Group
  | 'yemen_operations'       // Blackstone
  | 'chile_acquisition'      // Blackstone
  | 'project_chimera'        // Lazarus Genomics
  | 'operation_divide'       // Apex Media
  | 'run_for_president'      // Apex Media - endgame
  | 'insider_tip'            // Smokey's on K (randomly picks a bill scenario)

export interface PEAbility {
  id: PEAbilityId
  name: string
  emoji: string
  flavor: string
  cost: number
  successEffects: Record<string, number>  // Asset price effects on success (Day N+1)
  phase2Effects?: {                        // Optional second-phase effects (Day N+2)
    effects: Record<string, number>
    headline: string
  }
  backfireEffects: {
    priceEffects?: Record<string, number>  // Negative price swings
    losePE?: boolean                       // Lose the PE asset entirely
    fine?: number                          // Cash penalty
    triggerEncounter?: EncounterType       // Force specific encounter
    gameOverRisk?: number                  // % chance of game over (0-1)
  }
  backfireChance: number  // 0.20 = 20%
  silentExecution?: boolean  // If true, no headline on execution day (RUMOR fires next day instead)
  repeatable?: boolean       // If true, can be used multiple times (blocked only while story arc pending)
  specialEffect?: {
    type: 'event_trigger'
    eventCategory: string
    chance: number
  }
}

export interface UsedPEAbility {
  abilityId: PEAbilityId
  usedOnDay: number
  didBackfire: boolean | null  // null = outcome pending (revealed next day when effects apply)
}

export interface UsedPresidentialAbility {
  abilityId: PresidentialAbilityId
  usedOnDay: number
}

export interface PendingAbilityEffects {
  abilityId: PEAbilityId | PresidentialAbilityId  // Can be either PE or Presidential ability
  effects: Record<string, number>
  isBackfire: boolean
  peAssetId: string  // The PE company that triggered this
  eventHeadline?: string  // Pre-computed success/backfire headline for Day N+1
  additionalConsequences?: {
    losePE?: boolean
    fine?: number
    triggerEncounter?: EncounterType
    gameOverRisk?: number
  }
}

export interface PendingPhase2Effects {
  abilityId: PEAbilityId
  effects: Record<string, number>
  headline: string
  triggerOnDay: number  // The day these effects should fire
}

// 3-Part Story Arc for PE Abilities
// Day N: Part 1 (story begins) → Day N+1: Part 2 (tension builds) → Day N+2: Part 3 (resolution)
export interface PendingStoryArc {
  abilityId: PEAbilityId
  peAssetId: string
  category: string              // Topic blocking (e.g., 'biotech', 'geopolitical')
  subcategory?: string          // Sub-topic blocking (e.g., 'pandemic', 'middle-east')
  storyOutcome: 'favorable' | 'unfavorable'  // Pre-rolled on execution, hidden until Part 3
  currentPhase: 1 | 2 | 3
  startDay: number
  part1Headline: string
  part2Headline: string
  part3Headline: string  // Uses successPart3 or backfirePart3 based on outcome
  effects: Record<string, number>
  fbiHeatIncrease: number  // Applied on Day N+2 when outcome revealed (+5 success, +15 backfire)
  additionalConsequences?: {
    losePE?: boolean
    fine?: number
    triggerEncounter?: EncounterType
    gameOverRisk?: number
  }
}

// Headline structure for 3-part PE ability stories
export interface AbilityHeadlines {
  part1: string         // Day N: Story begins
  part2: string         // Day N+1: Tension builds
  successPart3: string  // Day N+2: Favorable resolution
  backfirePart3: string // Day N+2: Unfavorable resolution
}

// Insider Tip scenario (Smokey's on K — randomly selected bill)
export interface InsiderTipScenario {
  id: string
  sectorHint: string  // Vague hint shown to player (e.g. "the commodity markets")
  successEffects: Record<string, number>
  backfireEffects: {
    priceEffects?: Record<string, number>
    fine?: number
    triggerEncounter?: EncounterType
  }
  headlines: AbilityHeadlines
  topic: { category: string; subcategory?: string }
}

// =============================================================================
// PRESIDENTIAL ABILITY TYPES (Endgame powers after winning election)
// =============================================================================

export type PresidentialAbilityId =
  | 'declare_war_china'
  | 'invade_venezuela'
  | 'tariffs_asia'
  | 'nationalize_big_tech'
  | 'ban_social_media'
  | 'print_money'
  | 'pardon_yourself'

export interface PresidentialAbility {
  id: PresidentialAbilityId
  name: string
  emoji: string
  flavor: string
  cost: number
  effects: Record<string, number>
  cashGain?: number           // For nationalize_big_tech (+$2B)
  fbiReset?: boolean          // For pardon_yourself
  permanentImmunity?: boolean // For pardon_yourself
  apexBoost?: number          // For ban_social_media (Apex Media price boost)
  delayedEffect?: {           // For print_money (inflation in 3 days)
    daysDelay: number
    effects: Record<string, number>
    headline: string
  }
}

export interface PendingElection {
  result: 'win' | 'loss'  // Pre-computed at trigger time
}

export interface PendingInflationEffect {
  triggerOnDay: number
  effects: Record<string, number>
  headline: string
}

// =============================================================================
// OPERATION TYPES (Legacy - to be removed)
// =============================================================================

export type OperationId =
  | 'lobby_congress'      // Capitol Consulting Group
  | 'execute_coup'        // Blackstone Services
  | 'plant_story'         // Apex Media

export interface OperationState {
  operationId: OperationId
  lastUsedDay: number | null  // null = never used
  timesUsed: number           // For escalating costs and once-per-game tracking
}

// =============================================================================
// LUXURY ASSET TYPES
// =============================================================================

export type LuxuryAssetId =
  | 'private_jet'
  | 'mega_yacht'
  | 'art_collection'
  | 'ferrari_f1_team'
  | 'la_lakers'
  | 'star_wars_franchise'
  | 'greenland'

export interface LuxuryAsset {
  id: LuxuryAssetId
  name: string
  emoji: string
  basePrice: number
  dailyCost: number  // Fixed daily cost (not percentage)
  description: string
  passiveBenefit: string  // Human-readable description
}

// =============================================================================
// CORE TYPES
// =============================================================================

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
  primaryAsset?: string              // Primary asset for mood recording (only this asset's mood is tracked)
  allowsReversal?: boolean           // If true, can fire even if it conflicts with current mood (for natural progressions like profit-taking)
  // Escalation: increases probability of certain categories for N days
  escalates?: {
    categories: string[]  // which categories become more likely
    boost: number         // probability multiplier (e.g., 2.0 = 2x more likely)
    duration: number      // how many days the boost lasts
  }
  // Second-order effects: ripple definition for narrative clustering
  ripple?: RippleDefinition          // Custom ripple effect (overrides category defaults)
}

// Tracks active escalation boosts
export interface ActiveEscalation {
  categories: string[]
  boost: number
  expiresDay: number
}

// Prediction Market Hint (displayed probability is intentionally inflated)
export interface PredictionMarketHint {
  outcomeIndex: number        // Which outcome to highlight
  inflatedProbability: number // Displayed probability (0-1), higher than actual
  label: string               // Short text, e.g. "RATE CUT"
  missLabel: string           // Label shown when prediction is wrong (~30% of the time)
  missRate?: number           // Override miss rate per-event (default 0.30)
}

// Event Chain Types
export interface EventChainOutcome {
  headline: string
  probability: number
  effects: Record<string, number>
  sentiment?: EventSentiment         // Sentiment of this specific outcome
  sentimentAssets?: string[]         // Which assets this outcome affects sentiment-wise
  allowsReversal?: boolean           // If true, this outcome can fire even if it conflicts with current mood
}

export interface EventChain {
  id: string
  category: string
  subcategory?: string               // For regional blocking (e.g., 'asia', 'middle-east')
  rumor: string
  duration: number // days until resolution
  outcomes: EventChainOutcome[] // 2-4 possible outcomes
  // Sentiment for conflict prevention (rumor phase creates anticipation mood)
  rumorSentiment?: EventSentiment    // Sentiment during the rumor/anticipation phase
  sentimentAssets?: string[]         // Which assets are affected by this chain
  primaryAsset?: string              // Primary asset for mood recording
  allowsReversal?: boolean           // If true, chain can start even if it conflicts with current mood
  predictionMarket?: PredictionMarketHint  // Prediction market hint shown on day 2+ of rumor
}

export interface ActiveChain {
  chainId: string
  startDay: number
  daysRemaining: number
  rumor: string
  category: string
  subcategory?: string  // For regional blocking (e.g., 'asia', 'middle-east')
  predictionLine?: string  // Pre-computed prediction market text, shown on day 2+
}

export interface ResolvedChain {
  chainId: string
  outcome: EventChainOutcome
  day: number
}

// Scheduled Event Types (known calendar events with 1-day advance notice)
export interface ScheduledEvent {
  id: string
  category: string
  // Day 1: Heads-up announcement
  announcement: {
    headline: string
    effects: Record<string, number>   // Keep small (±0.02) to stay below mood threshold
  }
  // Day 2: Resolution outcomes
  outcomes: ScheduledEventOutcome[]
  // Sentiment fields for conflict prevention on the announcement
  sentimentAssets?: string[]          // Which assets to check for conflict when starting
  announcementSentiment?: EventSentiment  // Default: 'mixed' (auto-derived from small mixed effects)
  predictionMarket?: PredictionMarketHint  // Prediction market hint shown on announcement
}

export interface ScheduledEventOutcome {
  headline: string
  probability: number
  effects: Record<string, number>
  sentiment: EventSentiment           // REQUIRED — explicit bullish/bearish/neutral
  sentimentAssets: string[]           // REQUIRED — which assets this mood applies to
  allowsReversal: true                // Always true — scheduled results always fire
}

export interface ActiveScheduledEvent {
  eventId: string
  startDay: number
  resolved: boolean                   // false = heads-up shown, awaiting resolution
  category: string
}

export type GameScreen = 'title' | 'intro' | 'game' | 'gameover' | 'win'

export type NewsLabelType = 'rumor' | 'developing' | 'news' | 'breaking' | 'none' | 'gossip' | 'scheduled' | 'flavor'

export interface NewsItem {
  headline: string
  effects: Record<string, number>
  labelType?: NewsLabelType
  predictionLine?: string  // Prediction market probability text
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
  creditCardDebt: number  // Starting at 50000, accumulates 1.75% interest daily
  trustFundBalance: number  // Offshore trust: sheltered from SEC/divorce/tax penalties
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
  // Heat/Suspicion tracking (0-100 scale)
  wifeSuspicion: number
  wifeSuspicionFrozenUntilDay: number | null
  fbiHeat: number
  event: MarketEvent | null
  message: string
  gameOverReason: string
  pendingGameOver: { reason: string; netWorth: number } | null
  selectedAsset: string | null
  buyQty: number
  newsHistory: string[]
  showPortfolio: boolean
  showPortfolioBeforeAdvance: boolean
  portfolioAdvancePending: boolean
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
  // Startup offer tracking (for caps and cooldowns)
  startupOfferCounts: {
    angel: number      // Offers shown (includes dismissed)
    vc: number         // Offers shown (includes dismissed)
  }
  lastStartupOfferDay: number | null  // Day of last offer (for cooldown)
  // Lifestyle assets state
  ownedLifestyle: OwnedLifestyleItem[]
  lifestylePrices: Record<string, number>
  activePEExitOffer: PEExitOffer | null  // Acquisition/IPO offer awaiting player decision
  // Event escalation state
  activeEscalations: ActiveEscalation[]
  // Milestone tracking
  hasReached1M: boolean
  reachedMilestones: string[] // IDs of milestones reached this game
  activeMilestone: { id: string; title: string; tier: string; scarcityMessage: string } | null // Currently displaying
  milestonePhase: 'idle' | 'takeover' | 'persist' // Animation phase
  // Celebration queue system (investment results + milestones)
  celebrationQueue: CelebrationEvent[]         // Queued celebrations waiting to display
  activeCelebration: CelebrationEvent | null   // Currently showing celebration overlay
  isCelebrationDay: boolean                    // Suppresses new offers/encounters when true
  // Multi-stage story state (Phase 1: runs alongside existing system)
  activeStories: ActiveStory[]
  usedStoryIds: string[] // Stories already used this game
  lastStoryStartDay: number // Day of most recent story start (for scheduling)
  // Wall St Gossip state
  gossipState: GossipState
  // Random Encounter state
  encounterState: EncounterState
  pendingEncounter: PendingEncounter | null  // Encounter awaiting player decision
  queuedStartupOffer: Startup | null  // Startup offer delayed by encounter
  pendingLiquidation: PendingLiquidation | null  // Asset seizure awaiting player selection
  // Scheduled event state (known calendar events with advance notice)
  activeScheduledEvent: ActiveScheduledEvent | null
  usedScheduledEventIds: string[]             // Scheduled events already fired this game (prevents repeats)
  // Market mood tracking (for conflict prevention)
  assetMoods: AssetMood[]                    // Current mood per asset (decays after 3 days)
  // Category cooldowns: block same-category standalone events for N days after story/chain resolution
  categoryCooldowns: { category: string; expiresDay: number }[]
  // Flavor events (meme/celebrity news in secondary slot)
  usedFlavorHeadlines: string[]              // Headlines already shown this game
  // Single event deduplication (prevents same headline twice per game)
  usedEventHeadlines: string[]               // Single event headlines already shown this game
  // Operations state (PE-based villain actions) - Legacy
  operationStates: Record<OperationId, OperationState>
  // Luxury assets state
  ownedLuxury: LuxuryAssetId[]               // Owned luxury assets (no price fluctuation)
  // PE Abilities state (new one-time villain actions)
  usedPEAbilities: UsedPEAbility[]           // Abilities already used this game
  pendingAbilityEffects: PendingAbilityEffects | null  // Effects to apply next day (Presidential abilities)
  pendingStoryArc: PendingStoryArc | null    // 3-part story arc for PE abilities
  pendingPhase2Effects: PendingPhase2Effects | null    // Two-phase effects (Day N+2, e.g. Chimera)
  // Presidential state (endgame after winning election)
  isPresident: boolean                       // True after winning election
  usedPresidentialAbilities: UsedPresidentialAbility[]  // Track one-time presidential actions
  hasPardoned: boolean                       // Permanent FBI immunity after pardon
  pendingElection: PendingElection | null    // Election in progress (triggers animation)
  pendingInflationEffect: PendingInflationEffect | null  // 3-day delayed effect from Print Money
  // Game Director state (narrative pacing system)
  directorState: DirectorState               // Director's tracking state
  directorConfig: DirectorConfig             // Director configuration
  // Scripted game state (curated first 3 games for new players)
  activeScript: ScriptedGameDefinition | null   // loaded script (null for normal games)
  scriptedGameNumber: number | null             // 1, 2, or 3 (null for normal games)
  preloadedScenario: ScriptedGameDefinition | null  // admin-authored scenario (loaded from DB)
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
  usedTax: boolean                // Tax can only happen once
}

export type EncounterType = 'sec' | 'divorce' | 'shitcoin' | 'kidney' | 'roulette' | 'tax'
export type RouletteColor = 'red' | 'black' | 'zero'

export interface PendingEncounter {
  type: EncounterType
  // For roulette, need to track selected color and bet amount
  rouletteColor?: RouletteColor
  rouletteBet?: number
  // If true, don't call nextDay() after resolving (encounter was triggered mid-day from story arc)
  skipNextDayOnResolve?: boolean
}

// Pending liquidation (forced asset sale for SEC/Divorce/Tax)
export interface PendingLiquidation {
  amountNeeded: number
  reason: 'sec' | 'divorce' | 'tax'
  headline: string  // Result headline to show after liquidation
  encounterType: EncounterType
  encounterState: EncounterState  // Pre-computed updated state
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
  // Pitch content for engagement (Shark Tank style)
  hotTake?: string         // Punchy one-liner hook (e.g., "Uber for tacos, but with drones")
  pitch?: string           // 2-3 sentence elevator pitch
  founder?: string         // Founder name for personality
  founderTitle?: string    // Title (e.g., "CEO & Co-founder")
  traction?: string        // Social proof metric (e.g., "47K orders in pilot")
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
export type LifestyleCategory = 'property' | 'private_equity' | 'strategy'

// PE Risk Tiers - simplified to two categories
// BLUE_CHIP: Established businesses, proven models, stable income (~5% return, ~3% monthly failure)
// GROWTH: High risk/reward, volatile industries (~6-10% return, ~6-18% monthly failure)
export type PERiskTier = 'blue_chip' | 'growth'

// PE Passive Bonus - Always active when you own the asset
export type PassiveBonusType =
  | 'regulatory_favor'      // +X% chance regulatory events favor you
  | 'positive_events'       // +X% positive event frequency
  | 'negative_reduction'    // -X% negative event damage
  | 'commodity_boost'       // +X% commodity price gains
  | 'destabilization_boost' // +X% returns from destabilized regions

export interface PEPassiveBonus {
  type: PassiveBonusType
  value: number  // Percentage as decimal (0.15 = 15%)
  description: string
}

// PE Operation - Active villain action with cost/cooldown
export interface PEOperationConfig {
  id: OperationId
  name: string
  emoji: string
  description: string
  executionConfig: {
    type: 'escalating' | 'fixed' | 'once'
    baseCost?: number        // For fixed/once
    cooldownDays?: number    // For escalating/fixed (not for 'once')
    successRate?: number     // Optional
    backfireChance?: number  // Optional
  }
}

export interface LifestyleAsset {
  id: string
  name: string
  emoji: string
  category: LifestyleCategory
  basePrice: number
  volatility: number // price fluctuation (like trading assets)
  dailyReturn: number // % of purchase price per day (positive = income, negative = cost)
  description: string
  // PE Risk System (private_equity only)
  riskTier?: PERiskTier               // Risk tier determines failure chance and UI coloring
  failureChancePerDay?: number        // Daily probability of total loss (0-1), e.g., 0.0093 = ~25%/month
  // NEW: PE Operations System
  passiveBonus?: PEPassiveBonus       // Always-on bonus from owning this PE
  operation?: PEOperationConfig       // Villain action this PE enables
}

export interface OwnedLifestyleItem {
  assetId: string
  purchasePrice: number
  purchaseDay: number
}

// PE Exit Offer (Acquisition or IPO opportunity)
export interface PEExitOffer {
  assetId: string
  type: 'acquisition' | 'ipo'
  multiplier: number              // Return multiplier (e.g., 3.5x)
  offerAmount: number             // purchasePrice × multiplier
  expiresDay: number              // Player has 2 days to decide
}

// Multi-stage Story Types
export interface StoryStage {
  headline: string
  effects: Record<string, number>
  allowsReversal?: boolean           // If true, this stage can fire even if it conflicts with current mood
  branches?: {
    positive: { headline: string; effects: Record<string, number>; probability: number; allowsReversal?: boolean }
    negative: { headline: string; effects: Record<string, number>; probability: number; allowsReversal?: boolean }
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

// =============================================================================
// CELEBRATION EVENT TYPES
// Priority queue for investment results and milestone celebrations
// =============================================================================

export interface InvestmentResultEvent {
  type: 'investment_result'
  startupName: string
  investedAmount: number
  returnAmount: number
  multiplier: number
  profitLoss: number
  profitLossPct: number
  isProfit: boolean
  headline: string
}

export interface MilestoneCelebrationEvent {
  type: 'milestone'
  id: string
  title: string
  tier: string
  scarcityMessage: string
  netWorth: number
}

export type CelebrationEvent = InvestmentResultEvent | MilestoneCelebrationEvent

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
