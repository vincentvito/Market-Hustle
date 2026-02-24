import type { AuthTierSliceCreator } from '../types'
import {
  loadUserState,
  saveUserState,
  markAsRegistered,
  setSelectedDuration as persistSelectedDuration,
} from '@/lib/game/persistence'
import {
  getRemainingGames,
  getLimitType,
  REGISTERED_FREE_DAILY_LIMIT,
} from '@/lib/game/userState'
import type { GameDuration } from '@/lib/game/types'

export const createAuthTierSlice: AuthTierSliceCreator = (set, get) => ({
  userTier: 'free',
  isLoggedIn: false,
  username: null,
  selectedDuration: 30,
  selectedTheme: 'modern3',
  showDailyLimitModal: false,
  showAnonymousLimitModal: false,
  gamesRemaining: Infinity,
  limitType: 'anonymous' as const,
  supabaseProfile: null,


  setShowDailyLimitModal: (show: boolean) => set({ showDailyLimitModal: show }),
  setShowAnonymousLimitModal: (show: boolean) => set({ showAnonymousLimitModal: show }),

  setIsLoggedIn: (isLoggedIn: boolean) => {
    const userState = loadUserState()

    if (isLoggedIn && userState.isAnonymous) {
      // User just logged in - mark as registered
      const updatedState = markAsRegistered(userState)
      saveUserState(updatedState)
    }

    // Update remaining games based on new auth state
    const currentUserState = loadUserState()
    const remaining = getRemainingGames(currentUserState, isLoggedIn)
    const limitType = getLimitType(currentUserState, isLoggedIn)

    set({
      isLoggedIn,
      gamesRemaining: remaining,
      limitType,
    })
  },

  setUserTier: (tier: 'free' | 'pro') => {
    set({ userTier: tier })
  },

  setUsername: (username: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mh_username', username)
    }
    set({ username })
  },

  setSelectedDuration: (duration: GameDuration) => {
    const validDuration = duration
    const userState = loadUserState()
    const updatedState = persistSelectedDuration(userState, validDuration)
    saveUserState(updatedState)

    set({ selectedDuration: validDuration })
  },

  setSelectedTheme: (theme) => {
    const userState = loadUserState()
    saveUserState({ ...userState, selectedTheme: theme })

    if (typeof document !== 'undefined') {
      if (theme === 'retro') {
        document.documentElement.removeAttribute('data-theme')
      } else if (theme === 'modern3list') {
        document.documentElement.setAttribute('data-theme', 'modern3')
      } else {
        document.documentElement.setAttribute('data-theme', theme)
      }
    }

    set({ selectedTheme: theme })
  },

  initializeFromStorage: () => {
    const userState = loadUserState()
    const { isLoggedIn } = get()

    const storedTheme = userState.selectedTheme || 'modern3'
    // retro and retro2 themes are hidden — fall back to modern3
    const hiddenThemes = ['retro', 'retro2']
    const validTheme = ((['retro', 'modern3', 'retro2', 'bloomberg', 'modern3list'].includes(storedTheme) && !hiddenThemes.includes(storedTheme)) ? storedTheme : 'modern3') as 'retro' | 'modern3' | 'retro2' | 'bloomberg' | 'modern3list'
    if (typeof document !== 'undefined') {
      if (validTheme === 'retro') {
        document.documentElement.removeAttribute('data-theme')
      } else if (validTheme === 'modern3list') {
        document.documentElement.setAttribute('data-theme', 'modern3')
      } else {
        document.documentElement.setAttribute('data-theme', validTheme)
      }
    }

    // At init time, isLoggedIn may not be set yet (TierSync will update it)
    const remaining = getRemainingGames(userState, isLoggedIn)
    const limitType = getLimitType(userState, isLoggedIn)

    const savedUsername = typeof window !== 'undefined' ? localStorage.getItem('mh_username') : null

    set({
      userTier: userState.tier,
      username: savedUsername,
      selectedDuration: userState.selectedDuration ?? 30,
      selectedTheme: validTheme,
      gamesRemaining: remaining,
      limitType,
    })
  },

  syncFromSupabase: (profile) => {
    if (!profile) {
      set({ supabaseProfile: null })
      const userState = loadUserState()
      set({
        gamesRemaining: getRemainingGames(userState, false),
        limitType: getLimitType(userState, false),
      })
      return
    }

    const today = new Date().toISOString().split('T')[0]
    // lastPlayedDate may be a Date object from the DB driver — normalize to string
    const lpd = profile.lastPlayedDate as unknown
    const lastPlayed = lpd instanceof Date
      ? lpd.toISOString().split('T')[0]
      : String(profile.lastPlayedDate || '').split('T')[0]
    const gamesPlayedToday = lastPlayed === today ? profile.gamesPlayedToday : 0

    const { userTier } = get()
    // Build a synthetic UserState using Supabase's totalGamesPlayed (not localStorage)
    const userState = loadUserState()
    const syntheticState = {
      ...userState,
      totalGamesPlayed: profile.totalGamesPlayed,
      gamesPlayedToday,
      lastPlayedDate: lastPlayed,
      tier: userTier,
    }

    // Also sync Supabase data to localStorage so startGame() reads correct values
    saveUserState({
      ...userState,
      totalGamesPlayed: profile.totalGamesPlayed,
      gamesPlayedToday,
      lastPlayedDate: lastPlayed,
      tier: userTier,
    })

    set({
      supabaseProfile: { ...profile, gamesPlayedToday },
      gamesRemaining: userTier === 'pro' ? Infinity : getRemainingGames(syntheticState, true),
      limitType: userTier === 'pro' ? 'unlimited' : 'daily',
    })
  },

  getEffectiveTier: () => {
    const { userTier } = get()
    if (userTier === 'pro') return 'pro'
    return 'free'
  },
})
