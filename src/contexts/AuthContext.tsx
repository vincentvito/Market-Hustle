'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase/client'
import { loadUserState, saveUserState } from '@/lib/game/persistence'
import type { GameResultData } from '@/lib/game/authBridge'
import type { GameHistoryEntry } from '@/lib/game/userState'

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
  needsOnboarding: boolean  // True if user is logged in but hasn't set username
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateSettings: (settings: { theme?: string; duration?: number }) => Promise<void>
  migrateLocalStats: (userId: string) => Promise<void>  // Exposed for onboarding
  incrementGamesPlayed: () => Promise<void>  // Increment daily counter on game START
  recordGameEnd: (finalNetWorth: number, isWin: boolean, gameData?: GameResultData) => Promise<void>  // Sync stats on game END
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

  // Migrate game history from localStorage to Supabase
  const migrateGameHistory = useCallback(async (userId: string, gameHistory: GameHistoryEntry[]) => {
    if (!gameHistory || gameHistory.length === 0) return

    // Batch insert all game results (upsert to handle duplicates)
    const gameResults = gameHistory.map(entry => ({
      user_id: userId,
      game_id: entry.gameId,
      duration: entry.duration,
      final_net_worth: entry.finalNetWorth,
      profit_percent: entry.profitPercent,
      days_survived: entry.daysSurvived,
      outcome: entry.outcome,
      created_at: entry.date, // Use original game date
    }))

    const { error } = await supabase
      .from('game_results')
      .upsert(gameResults, {
        onConflict: 'user_id,game_id',
        ignoreDuplicates: true
      })

    if (error) {
      console.error('Error migrating game history:', error)
    } else {
      console.log(`Migrated ${gameHistory.length} game results to Supabase`)
    }
  }, [supabase])

  // Migrate localStorage stats to database on first login
  const migrateLocalStats = useCallback(async (userId: string) => {
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

    // Migrate game history first
    if (localState.gameHistory && localState.gameHistory.length > 0) {
      await migrateGameHistory(userId, localState.gameHistory)
    }

    // Then migrate aggregate stats (only if there are stats to migrate)
    if (localState.totalGamesPlayed > 0) {
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
        return // Don't clear local state if migration failed
      }
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
  }, [supabase, migrateGameHistory])

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
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()

        setSession(initialSession)
        setUser(initialSession?.user ?? null)

        if (initialSession?.user) {
          const profileData = await fetchProfile(initialSession.user.id)
          setProfile(profileData)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
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
          ? `${window.location.origin}/auth/callback`
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

  // Increment games_played_today counter (called on game START)
  const incrementGamesPlayed = useCallback(async () => {
    if (!user) return

    const today = new Date().toISOString().split('T')[0]
    const isNewDay = profile?.last_played_date !== today

    const { error } = await supabase
      .from('profiles')
      .update({
        games_played_today: isNewDay ? 1 : (profile?.games_played_today || 0) + 1,
        last_played_date: today,
      })
      .eq('id', user.id)

    if (error) {
      console.error('Error incrementing games played:', error)
    } else {
      await refreshProfile()
    }
  }, [user, profile?.last_played_date, profile?.games_played_today, supabase, refreshProfile])

  // Sync game stats to Supabase (called on game END)
  const recordGameEnd = useCallback(async (
    finalNetWorth: number,
    isWin: boolean,
    gameData?: GameResultData
  ) => {
    if (!user || !profile) return

    const profit = Math.max(0, finalNetWorth - 100000)

    // Update aggregate stats in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        total_games_played: profile.total_games_played + 1,
        total_earnings: profile.total_earnings + profit,
        best_net_worth: Math.max(profile.best_net_worth, finalNetWorth),
        win_count: isWin ? profile.win_count + 1 : profile.win_count,
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('Error updating profile stats:', profileError)
    }

    // Insert individual game result if game data provided
    if (gameData) {
      const { error: gameError } = await supabase
        .from('game_results')
        .insert({
          user_id: user.id,
          game_id: gameData.gameId,
          duration: gameData.duration,
          final_net_worth: finalNetWorth,
          profit_percent: gameData.profitPercent,
          days_survived: gameData.daysSurvived,
          outcome: gameData.outcome,
        })

      if (gameError) {
        console.error('Error recording game result:', gameError)
      }
    }

    await refreshProfile()
  }, [user, profile, supabase, refreshProfile])

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
