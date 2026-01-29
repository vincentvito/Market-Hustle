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

  // Anonymous tracking (before signup)
  anonymousGamesPlayed: number  // Total games played without account (max 10 lifetime)
  isAnonymous: boolean          // True until user creates an account

  // Daily game tracking (registered free tier limit)
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
  anonymousGamesPlayed: 0,
  isAnonymous: true,
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

// Game limits by user type
export const ANONYMOUS_GAME_LIMIT = 5        // Lifetime total for anonymous users
export const REGISTERED_FREE_DAILY_LIMIT = 3 // Daily limit for registered free users
export const PRO_TRIAL_GAME_LIMIT = 5        // Free Pro trial games for signed-in users

// Helper to generate unique game ID
export function generateGameId(): string {
  return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Helper to get today's date as ISO string (YYYY-MM-DD)
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

// Check if user can start a new game based on their tier
// isLoggedIn should be passed from auth context
export function canStartGame(state: UserState, isLoggedIn: boolean): boolean {
  // Pro users have no limits
  if (state.tier === 'pro') return true

  // Anonymous users (not logged in): 10 lifetime games
  if (!isLoggedIn || state.isAnonymous) {
    return state.anonymousGamesPlayed < ANONYMOUS_GAME_LIMIT
  }

  // Registered free users: 3 games per day
  const today = getTodayDateString()
  if (state.lastPlayedDate !== today) {
    return true // New day, counter will reset
  }
  return state.gamesPlayedToday < REGISTERED_FREE_DAILY_LIMIT
}

// Get remaining games based on user tier
// isLoggedIn should be passed from auth context
export function getRemainingGames(state: UserState, isLoggedIn: boolean): number {
  // Pro users have unlimited games
  if (state.tier === 'pro') return Infinity

  // Anonymous users: remaining out of 10 lifetime
  if (!isLoggedIn || state.isAnonymous) {
    return Math.max(0, ANONYMOUS_GAME_LIMIT - state.anonymousGamesPlayed)
  }

  // Registered free users: remaining out of 3 daily
  const today = getTodayDateString()
  if (state.lastPlayedDate !== today) {
    return REGISTERED_FREE_DAILY_LIMIT
  }
  return Math.max(0, REGISTERED_FREE_DAILY_LIMIT - state.gamesPlayedToday)
}

// Get the limit type for display purposes
export function getLimitType(state: UserState, isLoggedIn: boolean): 'anonymous' | 'daily' | 'unlimited' {
  if (state.tier === 'pro') return 'unlimited'
  if (!isLoggedIn || state.isAnonymous) return 'anonymous'
  return 'daily'
}
