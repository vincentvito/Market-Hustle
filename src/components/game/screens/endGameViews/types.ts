import type { ReactNode } from 'react'
import type { GameDuration } from '@/lib/game/types'
import type { EndGameMessage } from '@/lib/game/endGameMessages'

export interface PositionLoss {
  name: string
  pl: number
  leverage?: number
  isUnderwater?: boolean
}

export interface LossBreakdown {
  leveragedLosses: PositionLoss[]
  shortLosses: PositionLoss[]
  cashRemaining: number
}

export interface LeaderboardRank {
  dailyRank: number
  dailyTotal: number
  allTimeRank: number
  allTimeTotal: number
}

export interface EndGameProps {
  outcome: 'win' | 'loss'
  gameOverReason: string
  message: EndGameMessage
  netWorth: number
  profitPercent: number
  profitAmount: number
  daysSurvived: number
  gameDuration: GameDuration
  gamesRemaining: number
  canPlayAgain: boolean
  proTrialGamesRemaining?: number
  onPlayAgain: () => void
  onCheckout: () => void
  onOpenAuth: () => void
  lossBreakdown?: LossBreakdown
  leaderboardRank?: LeaderboardRank
  leaderboardLoading?: boolean
  roomStandings?: ReactNode
  onBackToRoom?: () => void
  roomCode?: string
}
