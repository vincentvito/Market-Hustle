'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase/client'
import { loadUserState, saveUserState } from '@/lib/game/persistence'

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
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateSettings: (settings: { theme?: string; duration?: number }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseClient()

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data as Profile
  }, [supabase])

  // Migrate localStorage stats to database on first login
  const migrateLocalStats = useCallback(async (userId: string) => {
    const localState = loadUserState()

    // Only migrate if user has played games locally
    if (localState.totalGamesPlayed === 0) {
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        total_games_played: localState.totalGamesPlayed,
        total_earnings: localState.totalEarnings,
        best_net_worth: localState.bestNetWorth,
        win_count: localState.winCount,
        win_streak: localState.winStreak || 0,
        current_streak: localState.currentStreak || 0,
      })
      .eq('id', userId)

    if (error) {
      console.error('Error migrating stats:', error)
    } else {
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
    }
  }, [supabase])

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (!user) return
    const profileData = await fetchProfile(user.id)
    if (profileData) {
      setProfile(profileData)
    }
  }, [user, fetchProfile])

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession()

      setSession(initialSession)
      setUser(initialSession?.user ?? null)

      if (initialSession?.user) {
        const profileData = await fetchProfile(initialSession.user.id)
        setProfile(profileData)
      }

      setLoading(false)
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession: Session | null) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)

        if (newSession?.user) {
          const profileData = await fetchProfile(newSession.user.id)
          setProfile(profileData)

          // Migrate local stats on first sign in
          if (event === 'SIGNED_IN') {
            await migrateLocalStats(newSession.user.id)
            // Refresh profile after migration
            const updatedProfile = await fetchProfile(newSession.user.id)
            setProfile(updatedProfile)
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile, migrateLocalStats])

  // Passwordless magic link authentication
  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/`
          : undefined,
      },
    })
    return { error: error as Error | null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  // Update user settings (syncs to Supabase for Pro users)
  const updateSettings = async (settings: { theme?: string; duration?: number }) => {
    if (!user) return

    const updates: Record<string, unknown> = {}
    if (settings.theme !== undefined) updates.selected_theme = settings.theme
    if (settings.duration !== undefined) updates.selected_duration = settings.duration

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) {
      console.error('Error updating settings:', error)
    } else {
      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...updates } as Profile : null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signInWithMagicLink,
        signOut,
        refreshProfile,
        updateSettings,
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
