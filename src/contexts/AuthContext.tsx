'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase/client'
import { loadUserState, saveUserState } from '@/lib/game/persistence'
import type { GameResultData } from '@/lib/game/authBridge'

interface Profile {
  id: string
  username: string | null
  tier: 'free' | 'pro'
  total_games_played: number
  total_earnings: number
  best_net_worth: number
  win_count: number
  win_streak: number
  current_streak: number
  games_played_today: number
  last_played_date: string | null
  // Pro trial (5 free games for signed-in users)
  pro_trial_games_used: number
  // Synced settings
  selected_theme?: string
  selected_duration?: number
  unlocked_achievements?: string[]
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  needsOnboarding: boolean  // True if user is logged in but hasn't set username
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateSettings: (settings: { theme?: string; duration?: number }) => Promise<void>
  migrateLocalStats: (userId: string) => Promise<void>  // Exposed for onboarding
  incrementGamesPlayed: () => Promise<void>  // Increment daily counter on game START
  recordGameEnd: (finalNetWorth: number, isWin: boolean, gameData?: GameResultData) => Promise<void>  // Sync stats on game END
  useProTrialGame: () => Promise<void>  // Increment pro trial counter on game END (when using trial)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseClient()

  // Fetch user profile from API
  const fetchProfile = useCallback(async (_userId: string): Promise<Profile | null> => {
    try {
      const res = await fetch('/api/profile')
      if (!res.ok) return null
      const data = await res.json()
      return data.profile as Profile | null
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }, [])

  // Migrate localStorage stats to database on first login
  const migrateLocalStats = useCallback(async (_userId: string) => {
    // Prevent double migration
    if (typeof window !== 'undefined' && localStorage.getItem('mh_migration_completed')) {
      console.log('Migration already completed, skipping')
      return
    }

    const localState = loadUserState()

    // Only migrate if user has played games locally
    if (localState.totalGamesPlayed === 0 && (!localState.gameHistory || localState.gameHistory.length === 0)) {
      return
    }

    try {
      const res = await fetch('/api/profile/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: {
            totalGamesPlayed: localState.totalGamesPlayed,
            totalEarnings: localState.totalEarnings,
            bestNetWorth: localState.bestNetWorth,
            winCount: localState.winCount,
            winStreak: localState.winStreak || 0,
            currentStreak: localState.currentStreak || 0,
          },
          gameHistory: localState.gameHistory || [],
        }),
      })

      if (!res.ok) {
        console.error('Error migrating stats:', await res.text())
        return // Don't clear local state if migration failed
      }
    } catch (error) {
      console.error('Error migrating stats:', error)
      return
    }

    // Clear local stats after successful migration (keep settings)
    saveUserState({
      ...localState,
      totalGamesPlayed: 0,
      totalEarnings: 0,
      bestNetWorth: 0,
      winCount: 0,
      winStreak: 0,
      currentStreak: 0,
      gameHistory: [],
    })

    // Mark migration as completed
    if (typeof window !== 'undefined') {
      localStorage.setItem('mh_migration_completed', 'true')
    }
  }, [])

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (!user) return
    const profileData = await fetchProfile(user.id)
    if (profileData) {
      setProfile(profileData)
    }
  }, [user, fetchProfile])

  // Initialize auth state and listen for changes.
  useEffect(() => {
    let cancelled = false

    // Helper: sync local username to DB profile if profile has none
    const syncLocalUsername = async () => {
      try {
        const { useGame } = await import('@/hooks/useGame')
        const localUsername = useGame.getState().username
        if (localUsername && /^[a-z0-9_]{3,15}$/.test(localUsername)) {
          await fetch('/api/username/set', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: localUsername }),
          })
        }
      } catch (error) {
        console.error('Error syncing local username:', error)
      }
    }

    // Helper: load profile and optionally migrate stats
    const loadProfile = async (userId: string, shouldMigrate: boolean) => {
      const profileData = await fetchProfile(userId)
      if (cancelled) return
      setProfile(profileData)

      // Enrich PostHog person profile with latest DB data
      if (profileData) {
        import('@/lib/posthog').then(({ getPostHogClient }) => {
          getPostHogClient()?.people.set({
            tier: profileData.tier,
            username: profileData.username,
            total_games_played: profileData.total_games_played,
          })
        })
      }

      // If profile has no username, sync from local game store
      if (!profileData?.username) {
        await syncLocalUsername()
      }

      if (shouldMigrate) {
        try {
          await migrateLocalStats(userId)
          if (cancelled) return
          const updated = await fetchProfile(userId)
          if (!cancelled) setProfile(updated)
        } catch (error) {
          if (!cancelled) console.error('Error migrating local stats:', error)
        }
      }

      // Re-fetch profile to pick up synced username
      if (!profileData?.username) {
        const updated = await fetchProfile(userId)
        if (!cancelled) setProfile(updated)
      }
    }

    // Listen for future auth changes (sign-in, sign-out, token refresh).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, newSession: Session | null) => {
        if (cancelled) return
        const prevUserId = user?.id
        setSession(newSession)
        setUser(newSession?.user ?? null)
        setLoading(false)

        // Only fetch profile on actual auth changes (not INITIAL_SESSION)
        if (event === 'SIGNED_IN' && newSession?.user) {
          import('@/lib/posthog').then(({ getPostHogClient, capture }) => {
            const ph = getPostHogClient()
            ph?.identify(newSession.user.id, { email: newSession.user.email })
            capture('auth_signed_in')
          })
          loadProfile(newSession.user.id, true)
        } else if (event === 'SIGNED_OUT' || !newSession?.user) {
          setProfile(null)
        } else if (event === 'TOKEN_REFRESHED' && newSession?.user && newSession.user.id !== prevUserId) {
          loadProfile(newSession.user.id, false)
        }
      }
    )

    // Load initial session and profile on mount
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }: { data: { session: any } }) => {
      if (cancelled) return
      setSession(initialSession)
      setUser(initialSession?.user ?? null)
      setLoading(false)

      if (initialSession?.user) {
        await loadProfile(initialSession.user.id, false)
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])

  // Passwordless magic link authentication
  const signInWithMagicLink = async (email: string) => {
    // Always use the current origin for redirects (supports localhost and production)
    const redirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`

    console.log('[Magic Link] Redirect URL:', redirectTo)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    })
    return { error: error as Error | null }
  }

  const signOut = async () => {
    import('@/lib/posthog').then(({ getPostHogClient, capture }) => {
      capture('auth_signed_out')
      getPostHogClient()?.reset()
    })
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  // Update user settings (syncs to DB for Pro users)
  const updateSettings = async (settings: { theme?: string; duration?: number }) => {
    if (!user) return

    try {
      const res = await fetch('/api/profile/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        // Update local profile state
        const updates: Record<string, unknown> = {}
        if (settings.theme !== undefined) updates.selected_theme = settings.theme
        if (settings.duration !== undefined) updates.selected_duration = settings.duration
        setProfile(prev => prev ? { ...prev, ...updates } as Profile : null)
      } else {
        console.error('Error updating settings:', await res.text())
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  // Increment games_played_today counter (called on game START)
  // Server computes all values from DB — no client-trusted data sent
  const incrementGamesPlayed = useCallback(async () => {
    if (!user) return

    try {
      const res = await fetch('/api/profile/increment-played', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (res.ok) {
        await refreshProfile()
      } else if (res.status === 429) {
        console.log('Daily game limit reached (server-enforced)')
      } else {
        console.error('Error incrementing games played:', await res.text())
      }
    } catch (error) {
      console.error('Error incrementing games played:', error)
    }
  }, [user, refreshProfile])

  // Sync game stats to DB (called on game END)
  const recordGameEnd = useCallback(async (
    finalNetWorth: number,
    isWin: boolean,
    gameData?: GameResultData
  ) => {
    if (!user || !profile) return

    try {
      const res = await fetch('/api/profile/record-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalNetWorth,
          isWin,
          profileStats: {
            total_games_played: profile.total_games_played,
            total_earnings: profile.total_earnings,
            best_net_worth: profile.best_net_worth,
            win_count: profile.win_count,
          },
          gameData,
        }),
      })

      if (!res.ok) {
        console.error('Error recording game:', await res.text())
      }

      await refreshProfile()
    } catch (error) {
      console.error('Error recording game end:', error)
    }
  }, [user, profile, refreshProfile])

  // Increment pro trial games used counter (called on game END when using trial)
  const useProTrialGame = useCallback(async () => {
    console.log('[useProTrialGame] called', { hasUser: !!user, userId: user?.id, hasProfile: !!profile, profileTier: profile?.tier, proTrialGamesUsed: profile?.pro_trial_games_used })
    if (!user || !profile) {
      console.warn('[useProTrialGame] BAIL — user or profile is null', { user: !!user, profile: !!profile })
      return
    }

    try {
      console.log('[useProTrialGame] calling API')
      const res = await fetch('/api/profile/use-trial', { method: 'POST' })

      if (res.ok) {
        console.log('[useProTrialGame] success, refreshing profile...')
        await refreshProfile()
        console.log('[useProTrialGame] profile refreshed')
      } else {
        console.error('[useProTrialGame] API error:', await res.text())
      }
    } catch (error) {
      console.error('[useProTrialGame] error:', error)
    }
  }, [user, profile, refreshProfile])

  // User needs onboarding if logged in but hasn't set username
  const needsOnboarding = !!user && !profile?.username

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        needsOnboarding,
        signInWithMagicLink,
        signOut,
        refreshProfile,
        updateSettings,
        migrateLocalStats,
        incrementGamesPlayed,
        recordGameEnd,
        useProTrialGame,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
