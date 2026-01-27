'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/hooks/useGame'
import { loadUserState, saveUserState } from '@/lib/game/persistence'
import { setAuthBridge, clearAuthBridge } from '@/lib/game/authBridge'

/**
 * Syncs the user tier and auth state from Supabase to the game store.
 * This ensures Pro features are correctly unlocked when a user signs in.
 * Also syncs to localStorage so the tier persists across sessions.
 *
 * IMPORTANT: If user is NOT logged in, tier is forced to 'free' to prevent
 * localStorage spoofing.
 *
 * Also tracks isLoggedIn state for game limit enforcement:
 * - Anonymous (not logged in): 10 lifetime games
 * - Registered free: 10 games/day (from Supabase)
 * - Pro: Unlimited
 */
export function TierSync() {
  const { profile, loading, user, incrementGamesPlayed, recordGameEnd } = useAuth()
  const setUserTier = useGame(state => state.setUserTier)
  const setIsLoggedIn = useGame(state => state.setIsLoggedIn)
  const syncFromSupabase = useGame(state => state.syncFromSupabase)

  // Register auth methods with the bridge so Zustand can call them
  useEffect(() => {
    setAuthBridge({ incrementGamesPlayed, recordGameEnd })
    return () => clearAuthBridge()
  }, [incrementGamesPlayed, recordGameEnd])

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return

    if (user && profile) {
      // User is logged in - use Supabase as authoritative source
      setIsLoggedIn(true)
      setUserTier(profile.tier)

      // Sync game limit data from Supabase
      syncFromSupabase({
        gamesPlayedToday: profile.games_played_today,
        lastPlayedDate: profile.last_played_date,
      })

      // Also update localStorage tier to keep it in sync
      const userState = loadUserState()
      if (userState.tier !== profile.tier) {
        saveUserState({ ...userState, tier: profile.tier })
      }
    } else {
      // User is NOT logged in - force free tier
      // This prevents localStorage spoofing
      setIsLoggedIn(false)
      setUserTier('free')
      syncFromSupabase(null)  // Clear Supabase state for guests

      // Also reset localStorage tier to free
      const userState = loadUserState()
      if (userState.tier !== 'free') {
        saveUserState({ ...userState, tier: 'free' })
      }
    }
  }, [loading, user, profile, setUserTier, setIsLoggedIn, syncFromSupabase])

  return null
}
