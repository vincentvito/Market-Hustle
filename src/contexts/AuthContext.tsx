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
  selected_theme?: string
  selected_duration?: number
  unlocked_achievements?: string[]
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  needsOnboarding: boolean
  sendOtp: (email: string) => Promise<{ error: Error | null }>
  verifyOtp: (email: string, token: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateSettings: (settings: { theme?: string; duration?: number }) => Promise<void>
  migrateLocalStats: () => Promise<void>
  incrementGamesPlayed: () => Promise<void>
  recordGameEnd: (finalNetWorth: number, isWin: boolean, gameData?: GameResultData) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  const supabase = getSupabaseClient()

  const fetchProfile = useCallback(async (): Promise<Profile | null> => {
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

  const migrateLocalStats = useCallback(async () => {
    if (typeof window !== 'undefined' && localStorage.getItem('mh_migration_completed')) {
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

    if (typeof window !== 'undefined') {
      localStorage.setItem('mh_migration_completed', 'true')
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    const profileData = await fetchProfile()
    if (profileData) {
      setProfile(profileData)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    let cancelled = false

    const loadProfile = async (shouldMigrate: boolean) => {
      if (process.env.NODE_ENV === 'development') console.log('[auth] loadProfile, shouldMigrate:', shouldMigrate)
      setProfileLoading(true)
      const profileData = await fetchProfile()
      if (cancelled) return
      if (process.env.NODE_ENV === 'development') console.log('[auth] profile loaded:', { username: profileData?.username, tier: profileData?.tier })
      setProfile(profileData)

      if (profileData) {
        import('@/lib/posthog').then(({ getPostHogClient }) => {
          getPostHogClient()?.people.set({
            tier: profileData.tier,
            username: profileData.username,
            total_games_played: profileData.total_games_played,
          })
        })
      }

      if (shouldMigrate) {
        try {
          await migrateLocalStats()
          if (cancelled) return
          const updated = await fetchProfile()
          if (!cancelled) setProfile(updated)
        } catch (error) {
          if (!cancelled) console.error('Error migrating local stats:', error)
        }
      }
      if (!cancelled) setProfileLoading(false)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, newSession: Session | null) => {
        if (cancelled) return
        const prevUserId = user?.id
        setSession(newSession)
        setUser(newSession?.user ?? null)
        setLoading(false)

        if (process.env.NODE_ENV === 'development') console.log('[auth] event:', event, 'user:', newSession?.user?.id ?? 'none')

        if (event === 'SIGNED_IN' && newSession?.user) {
          import('@/lib/posthog').then(({ getPostHogClient, capture }) => {
            const ph = getPostHogClient()
            ph?.identify(newSession.user.id, { email: newSession.user.email })
            capture('auth_signed_in')
          })
          loadProfile(true)
        } else if (event === 'SIGNED_OUT' || !newSession?.user) {
          setProfile(null)
        } else if (event === 'TOKEN_REFRESHED' && newSession?.user && newSession.user.id !== prevUserId) {
          loadProfile(false)
        }
      }
    )

    supabase.auth.getSession().then(async ({ data: { session: initialSession } }: { data: { session: any } }) => {
      if (cancelled) return
      setSession(initialSession)
      setUser(initialSession?.user ?? null)
      setLoading(false)

      if (initialSession?.user) {
        await loadProfile(false)
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])

  const sendOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })
    return { error: error as Error | null }
  }

  const verifyOtp = async (email: string, token: string) => {
    if (process.env.NODE_ENV === 'development') console.log('[auth] verifyOtp for:', email)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    if (process.env.NODE_ENV === 'development') console.log('[auth] verifyOtp result:', error ? error.message : 'success')
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

  const updateSettings = async (settings: { theme?: string; duration?: number }) => {
    if (!user) return

    try {
      const res = await fetch('/api/profile/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
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

  const needsOnboarding = !!user && !profileLoading && !profile?.username
  if (process.env.NODE_ENV === 'development' && user) console.log('[auth] needsOnboarding:', needsOnboarding, 'username:', profile?.username)

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        needsOnboarding,
        sendOtp,
        verifyOtp,
        signOut,
        refreshProfile,
        updateSettings,
        migrateLocalStats,
        incrementGamesPlayed,
        recordGameEnd,
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
