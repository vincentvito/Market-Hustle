// localStorage persistence for user state

import {
  UserState,
  DEFAULT_USER_STATE,
  getTodayDateString,
  ANONYMOUS_GAME_LIMIT,
  REGISTERED_FREE_DAILY_LIMIT,
  type GameHistoryEntry,
} from './userState'

const STORAGE_KEY = 'market-hustle-user'

// Maximum number of game history entries to keep
const MAX_GAME_HISTORY = 100

/**
 * Load user state from localStorage
 * Returns default state if nothing stored or parse error
 */
export function loadUserState(): UserState {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_USER_STATE }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { ...DEFAULT_USER_STATE }
    }

    const parsed = JSON.parse(stored) as Partial<UserState>

    // Merge with defaults to handle missing fields from older versions
    return {
      ...DEFAULT_USER_STATE,
      ...parsed,
      // Ensure gameHistory is always an array
      gameHistory: Array.isArray(parsed.gameHistory) ? parsed.gameHistory : [],
    }
  } catch {
    return { ...DEFAULT_USER_STATE }
  }
}

/**
 * Save user state to localStorage
 */
export function saveUserState(state: UserState): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    // Trim game history if too long
    const trimmedState = {
      ...state,
      gameHistory: state.gameHistory.slice(-MAX_GAME_HISTORY),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedState))
  } catch {
    // Silent fail - localStorage may be full or unavailable
  }
}

/**
 * Reset daily games counter if it's a new day
 * Returns updated state (or same state if no change needed)
 */
export function resetDailyGamesIfNewDay(state: UserState): UserState {
  const today = getTodayDateString()

  if (state.lastPlayedDate !== today) {
    return {
      ...state,
      gamesPlayedToday: 0,
      lastPlayedDate: today,
    }
  }

  return state
}

/**
 * Increment games played for anonymous users (10 lifetime limit)
 * Call this when an anonymous user starts a game
 */
export function incrementAnonymousGames(state: UserState): UserState {
  return {
    ...state,
    anonymousGamesPlayed: state.anonymousGamesPlayed + 1,
    totalGamesPlayed: state.totalGamesPlayed + 1,
  }
}

/**
 * Check if anonymous user can still play
 */
export function canPlayAnonymous(state: UserState): boolean {
  return state.anonymousGamesPlayed < ANONYMOUS_GAME_LIMIT
}

/**
 * Get remaining anonymous games
 */
export function getAnonymousGamesRemaining(state: UserState): number {
  return Math.max(0, ANONYMOUS_GAME_LIMIT - state.anonymousGamesPlayed)
}

/**
 * Mark user as registered (no longer anonymous)
 * Call this after successful signup/login
 */
export function markAsRegistered(state: UserState): UserState {
  return {
    ...state,
    isAnonymous: false,
  }
}

/**
 * Increment games played today for registered users
 * Call this when a registered user starts a game
 */
export function incrementGamesPlayed(state: UserState): UserState {
  const today = getTodayDateString()

  // Reset if new day
  if (state.lastPlayedDate !== today) {
    return {
      ...state,
      gamesPlayedToday: 1,
      lastPlayedDate: today,
      totalGamesPlayed: state.totalGamesPlayed + 1,
    }
  }

  return {
    ...state,
    gamesPlayedToday: state.gamesPlayedToday + 1,
    totalGamesPlayed: state.totalGamesPlayed + 1,
  }
}

/**
 * Check if registered free user can play today
 */
export function canPlayRegisteredFree(state: UserState): boolean {
  const today = getTodayDateString()
  if (state.lastPlayedDate !== today) {
    return true
  }
  return state.gamesPlayedToday < REGISTERED_FREE_DAILY_LIMIT
}

/**
 * Get remaining daily games for registered free users
 */
export function getRegisteredFreeGamesRemaining(state: UserState): number {
  const today = getTodayDateString()
  if (state.lastPlayedDate !== today) {
    return REGISTERED_FREE_DAILY_LIMIT
  }
  return Math.max(0, REGISTERED_FREE_DAILY_LIMIT - state.gamesPlayedToday)
}

/**
 * Record a completed game
 * Updates career stats and adds to game history
 */
export function recordGameEnd(
  state: UserState,
  entry: GameHistoryEntry,
  isWin: boolean
): UserState {
  const profit = entry.finalNetWorth - 100000 // Assuming $100K starting capital

  return {
    ...state,
    totalEarnings: state.totalEarnings + Math.max(0, profit),
    bestNetWorth: Math.max(state.bestNetWorth, entry.finalNetWorth),
    winCount: isWin ? state.winCount + 1 : state.winCount,
    currentStreak: isWin ? (state.currentStreak ?? 0) + 1 : 0,
    winStreak: isWin
      ? Math.max(state.winStreak ?? 0, (state.currentStreak ?? 0) + 1)
      : state.winStreak,
    gameHistory: [...state.gameHistory, entry],
  }
}

/**
 * Clear all user data (for reset progress feature)
 */
export function clearUserState(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Silent fail
  }
}

/**
 * Set user to Pro tier (for testing or after purchase)
 */
export function setProTier(state: UserState): UserState {
  return {
    ...state,
    tier: 'pro',
  }
}

/**
 * Set username for leaderboard
 */
export function setUsername(state: UserState, username: string): UserState {
  return {
    ...state,
    username: username.trim().slice(0, 15),
  }
}

/**
 * Set selected game duration
 */
export function setSelectedDuration(
  state: UserState,
  duration: 30 | 45 | 60
): UserState {
  return {
    ...state,
    selectedDuration: duration,
  }
}
