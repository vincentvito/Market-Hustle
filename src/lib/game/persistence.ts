import {
  UserState,
  DEFAULT_USER_STATE,
  getTodayDateString,
  GUEST_TOTAL_LIMIT,
  REGISTERED_FREE_DAILY_LIMIT,
  type GameHistoryEntry,
} from './userState'

const STORAGE_KEY = 'market-hustle-user'

const MAX_GAME_HISTORY = 100

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

export function incrementAnonymousGames(state: UserState): UserState {
  return {
    ...state,
    anonymousGamesPlayed: state.anonymousGamesPlayed + 1,
    totalGamesPlayed: state.totalGamesPlayed + 1,
  }
}

// Note: real enforcement is IP-based via /api/game/guest-start
export function canPlayAnonymous(state: UserState): boolean {
  return state.anonymousGamesPlayed < GUEST_TOTAL_LIMIT
}

export function getAnonymousGamesRemaining(state: UserState): number {
  return Math.max(0, GUEST_TOTAL_LIMIT - state.anonymousGamesPlayed)
}

export function markAsRegistered(state: UserState): UserState {
  return {
    ...state,
    isAnonymous: false,
  }
}

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

export function canPlayRegisteredFree(state: UserState): boolean {
  const today = getTodayDateString()
  if (state.lastPlayedDate !== today) {
    return true
  }
  return state.gamesPlayedToday < REGISTERED_FREE_DAILY_LIMIT
}

export function getRegisteredFreeGamesRemaining(state: UserState): number {
  const today = getTodayDateString()
  if (state.lastPlayedDate !== today) {
    return REGISTERED_FREE_DAILY_LIMIT
  }
  return Math.max(0, REGISTERED_FREE_DAILY_LIMIT - state.gamesPlayedToday)
}

export function recordGameEnd(
  state: UserState,
  entry: GameHistoryEntry,
  isWin: boolean
): UserState {
  const profit = entry.finalNetWorth - 50000 // Starting capital is $50K

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

export function setProTier(state: UserState): UserState {
  return {
    ...state,
    tier: 'pro',
  }
}

export function setUsername(state: UserState, username: string): UserState {
  return {
    ...state,
    username: username.trim().slice(0, 15),
  }
}

export function setSelectedDuration(
  state: UserState,
  duration: 30 | 45 | 60
): UserState {
  return {
    ...state,
    selectedDuration: duration,
  }
}
