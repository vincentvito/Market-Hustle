// User tier and state management for Free/Pro features

export type UserTier = 'free' | 'pro'

export type GameDuration = 30 | 45 | 60

export type GameOutcome = 'win' | 'bankrupt' | 'imprisoned' | 'deceased' | 'short_squeezed' | 'margin_called'

// Individual game record for personal scoreboard
export interface GameHistoryEntry {
  gameId: string
  date: string  // ISO date string
  duration: GameDuration
  finalNetWorth: number
  profitPercent: number
  daysSurvived: number
  outcome: GameOutcome
  leaderboardRank?: number  // Rank at time of submission (Pro only)
}

// User state persisted to localStorage
export interface UserState {
  // Tier
  tier: UserTier

  // Daily game tracking (free tier limit)
  gamesPlayedToday: number
  lastPlayedDate: string  // ISO date string (YYYY-MM-DD)

  // Career stats (basic - always tracked)
  totalGamesPlayed: number
  totalEarnings: number
  bestNetWorth: number
  winCount: number

  // Career stats (detailed - Pro features, Phase 5)
  biggestWin?: { amount: number; asset: string }
  biggestLoss?: { amount: number; asset: string }
  favoriteAsset?: string
  totalTrades?: number
  winStreak?: number
  currentStreak?: number

  // Personal scoreboard (Pro only, Phase 5)
  gameHistory: GameHistoryEntry[]

  // Leaderboard (Phase 4)
  username?: string

  // Settings
  selectedDuration: GameDuration
  selectedTheme?: 'retro' | 'modern3' | 'retro2' | 'bloomberg'
}

export const DEFAULT_USER_STATE: UserState = {
  tier: 'free',
  gamesPlayedToday: 0,
  lastPlayedDate: '',
  totalGamesPlayed: 0,
  totalEarnings: 0,
  bestNetWorth: 0,
  winCount: 0,
  gameHistory: [],
  selectedDuration: 30,
  selectedTheme: 'modern3',
}

// Helper to generate unique game ID
export function generateGameId(): string {
  return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Helper to get today's date as ISO string (YYYY-MM-DD)
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

// Check if user can start a new game (free tier limit)
export function canStartGame(state: UserState): boolean {
  if (state.tier === 'pro') return true

  const today = getTodayDateString()

  // Reset counter if new day
  if (state.lastPlayedDate !== today) {
    return true
  }

  return state.gamesPlayedToday < 200
}

// Get remaining games for today (free tier)
export function getRemainingGames(state: UserState): number {
  if (state.tier === 'pro') return Infinity

  const today = getTodayDateString()

  if (state.lastPlayedDate !== today) {
    return 200
  }

  return Math.max(0, 200 - state.gamesPlayedToday)
}
