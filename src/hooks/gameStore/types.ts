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
  CelebrationEvent,
  OperationId,
  LuxuryAssetId,
  PEAbilityId,
  UsedPEAbility,
  PresidentialAbilityId,
  UsedPresidentialAbility,
  PendingStoryArc,
} from '@/lib/game/types'
import type { EncounterResult } from '@/lib/game/encounters'
import type { ScriptedGameDefinition } from '@/lib/game/scriptedGames/types'
import type { UserTier } from '@/lib/game/userState'

export interface SupabaseProfileData {
  totalGamesPlayed: number
  gamesPlayedToday: number
  lastPlayedDate: string | null
}

export interface AuthTierSlice {
  userTier: UserTier
  isLoggedIn: boolean
  username: string | null
  selectedDuration: GameDuration
  selectedTheme: 'retro' | 'modern3' | 'retro2' | 'bloomberg' | 'modern3list'
  showDailyLimitModal: boolean
  showAnonymousLimitModal: boolean
  gamesRemaining: number
  limitType: 'anonymous' | 'daily' | 'unlimited'
  supabaseProfile: SupabaseProfileData | null
  proTrialGamesUsed: number
  isUsingProTrial: boolean

  setIsLoggedIn: (isLoggedIn: boolean) => void
  setUserTier: (tier: 'free' | 'pro') => void
  setUsername: (username: string) => void
  setSelectedDuration: (duration: GameDuration) => void
  setSelectedTheme: (theme: 'retro' | 'modern3' | 'retro2' | 'bloomberg' | 'modern3list') => void
  setShowDailyLimitModal: (show: boolean) => void
  setShowAnonymousLimitModal: (show: boolean) => void
  initializeFromStorage: () => void
  syncFromSupabase: (profile: SupabaseProfileData | null) => void
  setProTrialGamesUsed: (count: number) => void
  setIsUsingProTrial: (isUsing: boolean) => void

  getEffectiveTier: () => UserTier
  hasProTrialRemaining: () => boolean
  getProTrialGamesRemaining: () => number
}

export interface PendingScore {
  finalNetWorth: number
  gameData: {
    gameId: string
    duration: number
    profitPercent: number
    daysSurvived: number
    outcome: string
  }
}

export interface MechanicsSlice extends GameState {
  pendingScore: PendingScore | null

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

  showSettings: boolean
  pendingAchievement: string | null

  showActionsModal: boolean
  activeActionsTab: 'leverage' | 'buy' | 'casino'
  showGiftsModal: boolean

  startGame: (duration?: GameDuration, options?: { cash?: number; debt?: number; skipLimits?: boolean }) => void
  nextDay: () => void
  triggerNextDay: () => void
  setScreen: (screen: GameScreen) => void

  buy: (assetId: string, qty: number) => void
  sell: (assetId: string, qty: number) => void
  selectAsset: (id: string | null) => void
  setBuyQty: (qty: number) => void

  buyWithLeverage: (assetId: string, qty: number, leverage: LeverageLevel) => void
  shortSell: (assetId: string, qty: number) => void
  coverShort: (positionId: string) => void
  closeLeveragedPosition: (positionId: string) => void

  investInStartup: (amount: number) => void
  dismissStartupOffer: () => void
  liquidateForStartup: (amount: number) => void
  cancelStartupLiquidation: () => void

  buyLifestyle: (assetId: string) => void
  sellLifestyle: (assetId: string) => void
  acceptPEExitOffer: () => void
  declinePEExitOffer: () => void

  setShowPortfolio: (show: boolean) => void
  setShowPortfolioBeforeAdvance: (show: boolean) => void
  confirmAdvance: () => void
  setSelectedNews: (news: NewsItem | null) => void
  setShowSettings: (show: boolean) => void
  setShowActionsModal: (show: boolean) => void
  setActiveActionsTab: (tab: 'leverage' | 'buy' | 'casino') => void
  setShowGiftsModal: (show: boolean) => void

  buyGift: (giftId: string) => void

  clearSellToast: () => void
  clearBuyMessage: () => void
  clearInvestmentBuyMessage: () => void
  clearInvestmentResultToast: () => void
  clearErrorMessage: () => void
  clearPendingAchievement: () => void
  triggerAchievement: (id: string) => void

  clearMilestone: () => void

  dismissCelebration: () => void

  confirmEncounterResult: (result: EncounterResult, encounterType: EncounterType, pendingShitcoinData?: { outcome: 'moon' | 'rug'; profit: number } | null) => void

  pendingLiquidation: PendingLiquidation | null
  confirmLiquidationSelection: (selectedAssets: Array<{ type: 'luxury' | 'lifestyle' | 'leveraged' | 'short' | 'trading'; id: string; currentValue: number; quantity: number }>) => void

  executePEAbility: (abilityId: PEAbilityId, peAssetId: string) => void
  canExecutePEAbility: (abilityId: PEAbilityId, peAssetId: string) => boolean
  getPEAbilityStatus: (abilityId: PEAbilityId) => {
    isUsed: boolean
    usedOnDay: number | null
    didBackfire: boolean | null
  }

  confirmElectionResult: () => void
  executePresidentialAbility: (abilityId: PresidentialAbilityId) => void
  canExecutePresidentialAbility: (abilityId: PresidentialAbilityId) => boolean
  getPresidentialAbilityStatus: (abilityId: PresidentialAbilityId) => {
    isUsed: boolean
    usedOnDay: number | null
  }

  buyLuxuryAsset: (assetId: LuxuryAssetId) => void
  sellLuxuryAsset: (assetId: LuxuryAssetId) => void

  pendingLifestyleAssetId: string | null
  pendingLuxuryAssetId: LuxuryAssetId | null
  setPendingLifestyleAsset: (assetId: string | null) => void
  setPendingLuxuryAsset: (assetId: LuxuryAssetId | null) => void

  setPreloadedScenario: (scenario: ScriptedGameDefinition | null) => void

  increaseWifeHeat: (amount: number) => void
  decreaseWifeHeat: (amount: number) => void
  increaseFBIHeat: (amount: number) => void
  decreaseFBIHeat: (amount: number) => void

  setCreditCardDebt: (newDebt: number) => void
  borrowCreditCardDebt: (amount: number) => void

  applyCasinoResult: (cashDelta: number) => void

  depositToTrust: (amount: number) => void
  withdrawFromTrust: (amount: number) => void

  getNetWorth: () => number
  getTotalDebt: () => number
  getPortfolioValue: () => number
  getPriceChange: (id: string) => number
  getPortfolioChange: () => number
  getInvestmentChange: (id: string) => number
  getAvgCost: (id: string) => number
  getTotalPortfolioChange: () => number
}

export type GameStore = AuthTierSlice & MechanicsSlice

export type AuthTierSliceCreator = StateCreator<GameStore, [], [], AuthTierSlice>
export type MechanicsSliceCreator = StateCreator<GameStore, [], [], MechanicsSlice>
