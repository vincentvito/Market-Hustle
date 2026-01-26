'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/hooks/useGame'
import { loadUserState, saveUserState } from '@/lib/game/persistence'

/**
 * Syncs the user tier from Supabase profile to the game store.
 * This ensures Pro features are correctly unlocked when a user signs in.
 * Also syncs to localStorage so the tier persists across sessions.
 *
 * IMPORTANT: If user is NOT logged in, tier is forced to 'free' to prevent
 * localStorage spoofing.
 */
export function TierSync() {
  const { profile, loading, user } = useAuth()
  const setUserTier = useGame(state => state.setUserTier)

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return

    if (user && profile?.tier) {
      // User is logged in - use their profile tier
      setUserTier(profile.tier)

      // Also update localStorage to keep it in sync
      const userState = loadUserState()
      if (userState.tier !== profile.tier) {
        saveUserState({ ...userState, tier: profile.tier })
      }
    } else {
      // User is NOT logged in - force free tier
      // This prevents localStorage spoofing
      setUserTier('free')

      // Also reset localStorage tier to free
      const userState = loadUserState()
      if (userState.tier !== 'free') {
        saveUserState({ ...userState, tier: 'free' })
      }
    }
  }, [loading, user, profile?.tier, setUserTier])

  return null
}
