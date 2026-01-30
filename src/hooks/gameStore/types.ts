import type { StateCreator } from 'zustand'
import type {
  GameState,
  GameDuration,
  MarketEvent,
  GameScreen,
  ActiveChain,
  NewsItem,
  Startup,
  ActiveInvestment,
  OwnedLifestyleItem,
  ActiveEscalation,
  ActiveStory,
  DayCandle,
  GossipState,
  EncounterState,
  EncounterType,
  PendingEncounter,
  PendingLiquidation,
  AssetMood,
  LeverageLevel,
  LeveragedPosition,
  ShortPosition,
  StrategyId,
  StrategyTier,
  PolicyId,
  DestabilizationTargetId,
  CelebrationEvent,
} from '@/lib/game/types'
import type { EncounterResult } from '@/lib/game/encounters'
import type { UserTier } from '@/lib/game/userState'

// ============================================================================
// AUTH/TIER SLICE
// Handles user tier, login state, game limits, duration/theme selection
// ============================================================================

// Supabase profile data for game limits (synced from AuthContext)
export interface SupabaseProfileData {
  gamesPlayedToday: number
  lastPlayedDate: string | null
}

export interface AuthTierSlice {
  // State
  userTier: UserTier
  isLoggedIn: boolean
  selectedDuration: GameDuration
  selectedTheme: 'retro' | 'modern3' | 'retro2' | 'bloomberg'
  showDailyLimitModal: boolean
  showAnonymousLimitModal: boolean
  gamesRemaining: number
  limitType: 'anonymous' | 'daily' | 'unlimited'
  supabaseProfile: SupabaseProfileData | null  // Supabase-synced state for logged-in users

  // Pro trial state (5 free games with full Pro features)
  proTrialGamesUsed: number
  isUsingProTrial: boolean  // True when current game is a trial game

  // Actions
  setIsLoggedIn: (isLoggedIn: boolean) => void
  setUserTier: (tier: 'free' | 'pro') => void
  setSelectedDuration: (duration: GameDuration) => void
  setSelectedTheme: (theme: 'retro' | 'modern3' | 'retro2' | 'bloomberg') => void
  setShowDailyLimitModal: (show: boolean) => void
  setShowAnonymousLimitModal: (show: boolean) => void
  initializeFromStorage: () => void
  syncFromSupabase: (profile: SupabaseProfileData | null) => void  // Sync profile data from Supabase
  setProTrialGamesUsed: (count: number) => void
  setIsUsingProTrial: (isUsing: boolean) => void

  // Computed
  getEffectiveTier: () => UserTier  // Returns 'pro' if Pro or has trial games remaining
  hasProTrialRemaining: () => boolean
  getProTrialGamesRemaining: () => number
}

// ============================================================================
// MECHANICS SLICE
// Handles all game state: prices, holdings, events, trading, etc.
// ============================================================================

export interface MechanicsSlice extends GameState {
  // Feedback state (not in GameState)
  activeSellToast: {
    message: string
    profitLossPct: number
    isProfit: boolean
  } | null
  activeBuyMessage: string | null
  activeInvestmentBuyMessage: string | null
  activeInvestmentResultToast: {
    message: string
    profitLossPct: number
    isProfit: boolean
  } | null
  activeErrorMessage: string | null

  // Settings state
  showSettings: boolean
  pendingAchievement: string | null

  // Game control actions
  startGame: (duration?: GameDuration) => void
  nextDay: () => void
  triggerNextDay: () => void
  setScreen: (screen: GameScreen) => void

  // Trading actions
  buy: (assetId: string, qty: number) => void
  sell: (assetId: string, qty: number) => void
  selectAsset: (id: string | null) => void
  setBuyQty: (qty: number) => void

  // Margin trading actions (Pro tier)
  buyWithLeverage: (assetId: string, qty: number, leverage: LeverageLevel) => void
  shortSell: (assetId: string, qty: number) => void
  coverShort: (positionId: string) => void
  closeLeveragedPosition: (positionId: string) => void

  // Startup actions
  investInStartup: (amount: number) => void
  dismissStartupOffer: () => void

  // Lifestyle actions
  buyLifestyle: (assetId: string) => void
  sellLifestyle: (assetId: string) => void
  acceptPEExitOffer: () => void
  declinePEExitOffer: () => void

  // UI actions
  setShowPortfolio: (show: boolean) => void
  setSelectedNews: (news: NewsItem | null) => void
  setShowSettings: (show: boolean) => void

  // Feedback actions
  clearSellToast: () => void
  clearBuyMessage: () => void
  clearInvestmentBuyMessage: () => void
  clearInvestmentResultToast: () => void
  clearErrorMessage: () => void
  clearPendingAchievement: () => void
  triggerAchievement: (id: string) => void

  // Milestone actions
  clearMilestone: () => void

  // Celebration actions
  dismissCelebration: () => void

  // Encounter actions
  confirmEncounterResult: (result: EncounterResult, encounterType: EncounterType) => void

  // Liquidation actions
  pendingLiquidation: PendingLiquidation | null
  confirmLiquidationSelection: (selectedAssets: Array<{ type: 'lifestyle' | 'trading'; id: string; currentValue: number; quantity: number }>) => void

  // Strategy actions
  activateStrategy: (strategyId: StrategyId, tier: 'active' | 'elite') => void
  deactivateStrategy: (strategyId: StrategyId) => void
  upgradeStrategy: (strategyId: StrategyId) => void
  useSpin: () => void                          // Media Control Elite
  usePlant: (assetId: string) => void          // Media Control Elite
  pushPolicy: (policyId: PolicyId) => void     // Lobbying Elite
  selectDestabilizationTarget: (targetId: DestabilizationTargetId) => void  // Destabilization
  executeCoup: () => void                      // Destabilization Elite
  executeTargetedElimination: (sectorId: string) => void  // Destabilization Elite
  setShowStrategiesPanel: (show: boolean) => void
  clearStrategyCostMessage: () => void

  // Strategy computed
  getStrategyTier: (strategyId: StrategyId) => StrategyTier
  canAffordStrategy: (strategyId: StrategyId, tier: 'active' | 'elite') => boolean
  meetsStrategyGate: (strategyId: StrategyId, tier: 'active' | 'elite') => boolean
  getTotalDailyStrategyCost: () => number
  canUseSpin: () => boolean
  canUsePlant: () => boolean
  canPushPolicy: () => boolean
  getPolicyPushInfo: () => {
    pushNumber: number
    cost: number
    successRate: number
    cooldownRemaining: number
    canAfford: boolean
  }
  canExecuteCoup: () => boolean
  canExecuteElimination: () => boolean

  // Computed
  getNetWorth: () => number
  getPortfolioValue: () => number
  getPriceChange: (id: string) => number
  getPortfolioChange: () => number
  getInvestmentChange: (id: string) => number
  getAvgCost: (id: string) => number
  getTotalPortfolioChange: () => number
}

// ============================================================================
// COMBINED GAME STORE
// ============================================================================

export type GameStore = AuthTierSlice & MechanicsSlice

// Slice creator types for Zustand
export type AuthTierSliceCreator = StateCreator<GameStore, [], [], AuthTierSlice>
export type MechanicsSliceCreator = StateCreator<GameStore, [], [], MechanicsSlice>
