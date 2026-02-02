'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { loadUserState, saveUserState, markAsRegistered } from '@/lib/game/persistence'

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, profile, loading, refreshProfile } = useAuth()

  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Local stats preview
  const [localStats, setLocalStats] = useState<{
    totalGamesPlayed: number
    bestNetWorth: number
    winCount: number
  } | null>(null)

  // Load local stats on mount
  useEffect(() => {
    const userState = loadUserState()
    if (userState.totalGamesPlayed > 0) {
      setLocalStats({
        totalGamesPlayed: userState.totalGamesPlayed,
        bestNetWorth: userState.bestNetWorth,
        winCount: userState.winCount,
      })
    }
  }, [])

  // Redirect logic
  useEffect(() => {
    if (loading) return

    // Not logged in - redirect to home
    if (!user) {
      router.replace('/')
      return
    }

    // Already has username - skip onboarding
    if (profile?.username) {
      const next = searchParams.get('next') || '/'
      router.replace(next)
    }
  }, [loading, user, profile?.username, router, searchParams])

  // Debounced username check
  const checkUsername = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      setAvailable(null)
      return
    }

    setChecking(true)
    setError(null)

    try {
      const response = await fetch('/api/username/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: value }),
      })

      const data = await response.json()
      setAvailable(data.available)
      if (!data.available && data.reason) {
        setError(data.reason)
      }
    } catch {
      setError('Failed to check username')
    } finally {
      setChecking(false)
    }
  }, [])

  // Debounce username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username.length >= 3) {
        checkUsername(username)
      } else {
        setAvailable(null)
        setError(null)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username, checkUsername])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!available || submitting) return

    setSubmitting(true)
    setError(null)

    try {
      // Check if migration already happened (e.g., in AuthContext)
      const alreadyMigrated = localStorage.getItem('mh_migration_completed')

      // Get local stats to migrate (only if not already migrated)
      const userState = loadUserState()
      const statsToMigrate = !alreadyMigrated && userState.totalGamesPlayed > 0 ? {
        totalGamesPlayed: userState.totalGamesPlayed,
        totalEarnings: userState.totalEarnings,
        bestNetWorth: userState.bestNetWorth,
        winCount: userState.winCount,
        winStreak: userState.winStreak || 0,
        currentStreak: userState.currentStreak || 0,
      } : undefined

      const response = await fetch('/api/username/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, localStats: statsToMigrate }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to set username')
        return
      }

      // Clear local stats after successful migration
      if (statsToMigrate) {
        const clearedState = {
          ...userState,
          totalGamesPlayed: 0,
          totalEarnings: 0,
          bestNetWorth: 0,
          winCount: 0,
          winStreak: 0,
          currentStreak: 0,
          gameHistory: [],
        }
        // Mark as registered (no longer anonymous)
        const registeredState = markAsRegistered(clearedState)
        saveUserState(registeredState)

        // Mark migration as completed
        localStorage.setItem('mh_migration_completed', 'true')
      } else {
        // Just mark as registered if no stats to migrate
        const updatedState = markAsRegistered(userState)
        saveUserState(updatedState)
      }

      // Refresh profile to get the new username
      await refreshProfile()

      // Redirect to next page (or home with autostart if applicable)
      const next = searchParams.get('next') || '/'
      const autostart = searchParams.get('autostart')

      if (autostart) {
        // Store autostart intent and redirect
        sessionStorage.setItem('autostart', autostart)
        router.replace(`/?autostart=${autostart}`)
      } else {
        router.replace(next)
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-mh-bg flex items-center justify-center">
        <div className="text-mh-text-dim">Loading...</div>
      </div>
    )
  }

  // Don't render if not logged in or already has username (will redirect)
  if (!user || profile?.username) {
    return null
  }

  return (
    <div className="min-h-screen bg-mh-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🎮</div>
          <h1 className="text-2xl font-bold text-mh-text-bright mb-2">
            Welcome to Market Hustle
          </h1>
          <p className="text-mh-text-dim">
            Choose a username to get started
          </p>
        </div>

        {/* Stats Preview */}
        {localStats && localStats.totalGamesPlayed > 0 && (
          <div className="mb-6 p-4 border border-mh-profit-green/30 rounded-lg bg-mh-profit-green/5">
            <div className="text-mh-profit-green text-sm font-bold mb-2">
              YOUR STATS WILL BE SAVED
            </div>
            <div className="text-mh-text-main text-sm space-y-1">
              <div>Games Played: {localStats.totalGamesPlayed}</div>
              <div>Best Net Worth: ${localStats.bestNetWorth.toLocaleString('en-US')}</div>
              <div>Wins: {localStats.winCount}</div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-mh-text-dim mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                maxLength={15}
                autoFocus
                placeholder="trader_joe"
                className="w-full px-4 py-3 bg-mh-bg border-2 border-mh-border rounded text-mh-text-bright font-mono focus:outline-none focus:border-mh-accent-blue"
              />
              {/* Status indicator */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checking && (
                  <span className="text-mh-text-dim">...</span>
                )}
                {!checking && available === true && (
                  <span className="text-mh-profit-green">✓</span>
                )}
                {!checking && available === false && (
                  <span className="text-mh-loss-red">✗</span>
                )}
              </div>
            </div>
            <div className="mt-1 text-xs text-mh-text-dim">
              3-15 characters, letters, numbers, and underscores only
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-mh-loss-red text-sm text-center py-2 px-3 bg-mh-loss-red/10 rounded">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!available || submitting || checking}
            className="w-full py-3 border-2 border-mh-accent-blue bg-mh-accent-blue/10 text-mh-accent-blue text-base font-bold font-mono cursor-pointer hover:bg-mh-accent-blue/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'SETTING UP...' : '[ COMPLETE SETUP ]'}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 text-center text-xs text-mh-text-dim">
          Your username will appear on leaderboards and can&apos;t be changed later.
        </div>
      </div>
    </div>
  )
}

// Loading fallback for Suspense
function OnboardingFallback() {
  return (
    <div className="min-h-screen bg-mh-bg flex items-center justify-center">
      <div className="text-mh-text-dim">Loading...</div>
    </div>
  )
}

// Main page component with Suspense wrapper for useSearchParams
export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingFallback />}>
      <OnboardingContent />
    </Suspense>
  )
}
