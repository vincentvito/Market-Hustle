'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/hooks/useGame'

const AUTOSTART_STORAGE_KEY = 'market_hustle_autostart'

export function AutoStartHandler() {
  const searchParams = useSearchParams()
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()
  const startGame = useGame(state => state.startGame)
  const userTier = useGame(state => state.userTier)
  const setUserTier = useGame(state => state.setUserTier)
  const screen = useGame(state => state.screen)
  const initializeFromStorage = useGame(state => state.initializeFromStorage)

  const hasAutoStarted = useRef(false)
  const retryCount = useRef(0)
  const maxRetries = 10

  // Store autostart intent in sessionStorage (survives page refresh during auth)
  useEffect(() => {
    const autostart = searchParams.get('autostart')
    if (autostart === 'pro') {
      sessionStorage.setItem(AUTOSTART_STORAGE_KEY, 'pro')
    }
  }, [searchParams])

  const attemptAutoStart = useCallback(() => {
    // Check both URL param and sessionStorage
    const urlAutostart = searchParams.get('autostart')
    const storedAutostart = typeof window !== 'undefined'
      ? sessionStorage.getItem(AUTOSTART_STORAGE_KEY)
      : null
    const shouldAutoStart = urlAutostart === 'pro' || storedAutostart === 'pro'

    if (!shouldAutoStart || hasAutoStarted.current) return false

    // Still loading auth - wait
    if (authLoading) return false

    // No user yet - might still be initializing
    if (!user) {
      if (retryCount.current < maxRetries) {
        retryCount.current++
        return false // Will retry
      }
      // Max retries reached, clear storage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(AUTOSTART_STORAGE_KEY)
      }
      return false
    }

    // User exists but profile not loaded or not Pro
    if (!profile?.tier || profile.tier !== 'pro') {
      // Try refreshing profile (webhook might have just updated it)
      if (retryCount.current < maxRetries) {
        retryCount.current++
        refreshProfile()
        return false // Will retry after refresh
      }
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(AUTOSTART_STORAGE_KEY)
      }
      return false
    }

    // Sync store tier if needed (don't wait for TierSync)
    if (userTier !== 'pro') {
      setUserTier('pro')
    }

    // Must be on title screen
    if (screen !== 'title') return false

    // All conditions met - start game!
    hasAutoStarted.current = true
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(AUTOSTART_STORAGE_KEY)
    }

    // Clean URL
    const url = new URL(window.location.href)
    url.searchParams.delete('autostart')
    window.history.replaceState({}, '', url.toString())

    initializeFromStorage()
    setTimeout(() => startGame(), 100)
    return true
  }, [searchParams, authLoading, user, profile?.tier, userTier, screen,
      startGame, initializeFromStorage, setUserTier, refreshProfile])

  useEffect(() => {
    const started = attemptAutoStart()

    if (!started && !hasAutoStarted.current) {
      // Set up retry with exponential backoff
      const urlAutostart = searchParams.get('autostart')
      const storedAutostart = typeof window !== 'undefined'
        ? sessionStorage.getItem(AUTOSTART_STORAGE_KEY)
        : null

      if ((urlAutostart === 'pro' || storedAutostart === 'pro') && retryCount.current < maxRetries) {
        const delay = Math.min(200 * Math.pow(1.5, retryCount.current), 2000)
        const timer = setTimeout(() => {
          attemptAutoStart()
        }, delay)
        return () => clearTimeout(timer)
      }
    }
  }, [attemptAutoStart, searchParams])

  return null
}
