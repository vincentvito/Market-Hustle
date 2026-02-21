/**
 * Auth/Tier Slice
 *
 * Handles user tier, login state, game limits, duration/theme selection.
 * This slice manages the "who is playing" and "what are they allowed to do" concerns.
 */

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
  // ============================================================================
  // STATE
  // ============================================================================

  // User tier (loaded from Supabase profile or localStorage)
  userTier: 'free',

  // Auth state (synced from AuthContext via TierSync)
  isLoggedIn: false,

  // Username (persisted to localStorage)
  username: null,

  // Duration selection (persisted)
  selectedDuration: 30,

  // Theme selection (persisted)
  selectedTheme: 'modern3',

  // Game limit modal states
  showDailyLimitModal: false,      // For registered free users (1/day)
  showAnonymousLimitModal: false,  // For anonymous users (3 total)
  gamesRemaining: Infinity,
  limitType: 'anonymous' as const,

  // Supabase-synced profile data (null for guests)
  supabaseProfile: null,

  // Pro trial state — kept for backwards compat but no longer used
  proTrialGamesUsed: 0,
  isUsingProTrial: false,

  // ============================================================================
  // ACTIONS
  // ============================================================================

  // Modal visibility
  setShowDailyLimitModal: (show: boolean) => set({ showDailyLimitModal: show }),
  setShowAnonymousLimitModal: (show: boolean) => set({ showAnonymousLimitModal: show }),

  // Auth state - set by TierSync when auth changes
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

  // User tier - synced from Supabase profile
  setUserTier: (tier: 'free' | 'pro') => {
    set({ userTier: tier })
  },

  // Username - persisted to localStorage
  setUsername: (username: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mh_username', username)
    }
    set({ username })
  },

  // Duration selection - persists to localStorage
  setSelectedDuration: (duration: GameDuration) => {
    // All durations available for all users
    const validDuration = duration

    // Persist to localStorage
    const userState = loadUserState()
    const updatedState = persistSelectedDuration(userState, validDuration)
    saveUserState(updatedState)

    set({ selectedDuration: validDuration })
  },

  // Theme selection - persists to localStorage
  setSelectedTheme: (theme) => {
    // Persist to localStorage
    const userState = loadUserState()
    saveUserState({ ...userState, selectedTheme: theme })

    // Apply to DOM immediately
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

  // Initialize store from localStorage - call on app mount
  initializeFromStorage: () => {
    const userState = loadUserState()
    const { isLoggedIn } = get()

    // Apply theme to DOM
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

    // Calculate remaining games based on auth state
    // At init time, isLoggedIn may not be set yet (TierSync will update it)
    const remaining = getRemainingGames(userState, isLoggedIn)
    const limitType = getLimitType(userState, isLoggedIn)

    // Load username from localStorage
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

  // Sync profile data from Supabase (called by TierSync when auth state changes)
  syncFromSupabase: (profile) => {
    if (!profile) {
      // Guest user - use localStorage for limits
      set({ supabaseProfile: null })
      const userState = loadUserState()
      set({
        gamesRemaining: getRemainingGames(userState, false),
        limitType: getLimitType(userState, false),
      })
      return
    }

    // Logged-in user - check for daily reset
    const today = new Date().toISOString().split('T')[0]
    // lastPlayedDate may be a Date object from the DB driver — normalize to string
    const lpd = profile.lastPlayedDate as unknown
    const lastPlayed = lpd instanceof Date
      ? lpd.toISOString().split('T')[0]
      : String(profile.lastPlayedDate || '').split('T')[0]
    const gamesPlayedToday = lastPlayed === today ? profile.gamesPlayedToday : 0

    // Use Supabase data as authoritative source for logged-in users
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

  // Pro trial actions (no-ops, kept for interface compatibility)
  setProTrialGamesUsed: (_count: number) => {},
  setIsUsingProTrial: (_isUsing: boolean) => {},

  // Computed: effective tier
  // Only paid Pro users get 'pro' tier with full features
  // Guests and registered free users get 'free' tier
  getEffectiveTier: () => {
    const { userTier } = get()
    if (userTier === 'pro') return 'pro'
    return 'free'
  },

  // Pro trial — always false (feature removed)
  hasProTrialRemaining: () => false,
  getProTrialGamesRemaining: () => 0,
})
