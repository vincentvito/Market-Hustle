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
export const ANONYMOUS_GAME_LIMIT = 999      // Guests can play unlimited (conversion via end-game modal)
export const REGISTERED_FREE_INITIAL_GAMES = 3 // Initial games after registration
export const REGISTERED_FREE_DAILY_LIMIT = 1 // 1 game per day after initial games used
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
export function canStartGame(state: UserState, isLoggedIn: boolean): boolean {
  // Pro users: unlimited
  if (state.tier === 'pro') return true
  // Guests: always allow (conversion happens at end-game)
  if (!isLoggedIn) return true
  // Registered free users: check limits
  return getRemainingGames(state, isLoggedIn) > 0
}

// Get remaining games based on user tier
export function getRemainingGames(state: UserState, isLoggedIn: boolean): number {
  // Pro users: unlimited
  if (state.tier === 'pro') return Infinity
  // Guests: unlimited (we convert at end-game)
  if (!isLoggedIn) return Infinity
  // Registered free users: 3 initial games + 1/day after that
  const totalPlayed = state.totalGamesPlayed
  if (totalPlayed < REGISTERED_FREE_INITIAL_GAMES) {
    // Still have initial games
    return REGISTERED_FREE_INITIAL_GAMES - totalPlayed
  }
  // After initial games used: 1 game per day
  const today = getTodayDateString()
  if (state.lastPlayedDate !== today) return REGISTERED_FREE_DAILY_LIMIT
  return Math.max(0, REGISTERED_FREE_DAILY_LIMIT - state.gamesPlayedToday)
}

// Get the limit type for display purposes
export function getLimitType(state: UserState, isLoggedIn: boolean): 'anonymous' | 'daily' | 'unlimited' {
  if (state.tier === 'pro') return 'unlimited'
  if (!isLoggedIn) return 'anonymous'
  return 'daily'
}
