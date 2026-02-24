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

  useEffect(() => {
    const autostart = searchParams.get('autostart')
    if (autostart === 'pro') {
      sessionStorage.setItem(AUTOSTART_STORAGE_KEY, 'pro')
    }
  }, [searchParams])

  const attemptAutoStart = useCallback(() => {
    const urlAutostart = searchParams.get('autostart')
    const storedAutostart = typeof window !== 'undefined'
      ? sessionStorage.getItem(AUTOSTART_STORAGE_KEY)
      : null
    const shouldAutoStart = urlAutostart === 'pro' || storedAutostart === 'pro'

    if (!shouldAutoStart || hasAutoStarted.current) return false

    if (authLoading) return false

    if (!user) {
      if (retryCount.current < maxRetries) {
        retryCount.current++
        return false // Will retry
      }
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(AUTOSTART_STORAGE_KEY)
      }
      return false
    }

    if (!profile?.tier || profile.tier !== 'pro') {
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

    if (userTier !== 'pro') {
      setUserTier('pro')
    }

    if (screen !== 'title') return false

    hasAutoStarted.current = true
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(AUTOSTART_STORAGE_KEY)
    }

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
