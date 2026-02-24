'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/hooks/useGame'
import { loadUserState, saveUserState } from '@/lib/game/persistence'
import { setAuthBridge, clearAuthBridge } from '@/lib/game/authBridge'

export function TierSync() {
  const { profile, loading, user, incrementGamesPlayed, recordGameEnd } = useAuth()
  const setUserTier = useGame(state => state.setUserTier)
  const setIsLoggedIn = useGame(state => state.setIsLoggedIn)
  const syncFromSupabase = useGame(state => state.syncFromSupabase)

  useEffect(() => {
    setAuthBridge({ incrementGamesPlayed, recordGameEnd })
    return () => clearAuthBridge()
  }, [incrementGamesPlayed, recordGameEnd])

  useEffect(() => {
    if (loading) return

    if (user) {
      setIsLoggedIn(true)
      if (!profile) return
      setUserTier(profile.tier)

      syncFromSupabase({
        totalGamesPlayed: profile.total_games_played,
        gamesPlayedToday: profile.games_played_today,
        lastPlayedDate: profile.last_played_date,
      })

      const userState = loadUserState()
      if (userState.tier !== profile.tier) {
        saveUserState({ ...userState, tier: profile.tier })
      }
    } else {
      // Force free tier for logged-out users to prevent localStorage spoofing
      setIsLoggedIn(false)
      setUserTier('free')
      syncFromSupabase(null)

      const userState = loadUserState()
      if (userState.tier !== 'free') {
        saveUserState({ ...userState, tier: 'free' })
      }
    }
  }, [loading, user, profile, setUserTier, setIsLoggedIn, syncFromSupabase])

  return null
}
