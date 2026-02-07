import type { GameDuration } from '@/lib/game/types'
import type { EndGameMessage } from '@/lib/game/endGameMessages'

/**
 * Individual position loss for the breakdown display (Pro users)
 */
export interface PositionLoss {
  name: string
  pl: number
  leverage?: number
  isUnderwater?: boolean
}

/**
 * Loss breakdown data for Pro users
 */
export interface LossBreakdown {
  leveragedLosses: PositionLoss[]
  shortLosses: PositionLoss[]
  cashRemaining: number
}

/**
 * Leaderboard rank data fetched after game ends
 */
export interface LeaderboardRank {
  dailyRank: number
  dailyTotal: number
  allTimeRank: number
  allTimeTotal: number
}

/**
 * Props passed from EndGameCoordinator to all tier-specific views.
 * Views should be pure presentation components that receive all data via props.
 */
export interface EndGameProps {
  // Outcome
  outcome: 'win' | 'loss'
  gameOverReason: string // 'WIN' for wins, actual reason for losses

  // Message content (pre-computed from gameOverReason)
  message: EndGameMessage

  // Stats
  netWorth: number
  profitPercent: number
  profitAmount: number
  daysSurvived: number
  gameDuration: GameDuration

  // User context
  gamesRemaining: number
  canPlayAgain: boolean
  proTrialGamesRemaining?: number  // For free users with Pro trial (0-5)

  // Actions
  onPlayAgain: () => void
  onCheckout: (plan: 'monthly' | 'yearly') => void
  onOpenAuth: () => void

  // Pro-specific (optional, only populated for Pro users on loss)
  lossBreakdown?: LossBreakdown

  // Leaderboard rank (optional, loaded progressively)
  leaderboardRank?: LeaderboardRank
}
