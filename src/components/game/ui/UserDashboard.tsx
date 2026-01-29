'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useGame } from '@/hooks/useGame'
import { useUserDetails } from '@/hooks/useUserDetails'
import { useAuth } from '@/contexts/AuthContext'
import { useStripeCheckout } from '@/hooks/useStripeCheckout'
import { REGISTERED_FREE_DAILY_LIMIT } from '@/lib/game/userState'

/**
 * User Dashboard component for logged-in users.
 * Replaces the hero section on the landing page.
 *
 * Features:
 * - Username display with edit functionality
 * - Daily games remaining counter (free tier)
 * - Upgrade to Pro CTA (free tier)
 * - Game mode selector (30 active, 45/60 locked for free)
 * - Career stats grid
 */
export function UserDashboard() {
  const { profile, user, refreshProfile } = useAuth()
  const { isPro } = useUserDetails()
  const gamesRemaining = useGame(state => state.gamesRemaining)
  const selectedDuration = useGame(state => state.selectedDuration)
  const setSelectedDuration = useGame(state => state.setSelectedDuration)
  const { checkout, loading: checkoutLoading } = useStripeCheckout()

  // Username edit state
  const [isEditing, setIsEditing] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [saving, setSaving] = useState(false)
  const [checking, setChecking] = useState(false)
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null)


  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`
    return `$${num.toLocaleString()}`
  }

  // Calculate win rate
  const winRate = profile && profile.total_games_played > 0
    ? Math.round((profile.win_count / profile.total_games_played) * 100)
    : 0

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current)
      }
    }
  }, [])

  // Check username availability (debounced)
  const checkUsername = useCallback(async (value: string) => {
    // Skip if it's the current username
    if (value === profile?.username) {
      setUsernameAvailable(null)
      setUsernameError('')
      setChecking(false)
      return
    }

    if (value.length < 3) {
      setUsernameAvailable(null)
      setUsernameError('Min 3 characters')
      setChecking(false)
      return
    }

    try {
      const response = await fetch('/api/username/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: value }),
      })
      const data = await response.json()

      setUsernameAvailable(data.available)
      setUsernameError(data.available ? '' : data.reason || 'Username taken')
    } catch {
      setUsernameError('Failed to check')
      setUsernameAvailable(null)
    } finally {
      setChecking(false)
    }
  }, [profile?.username])

  // Handle username input change with debounce
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setNewUsername(value)
    setUsernameError('')
    setUsernameAvailable(null)

    // Clear existing timeout
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current)
    }

    // Set new timeout for debounced check
    if (value.length >= 3 && value !== profile?.username) {
      setChecking(true)
      checkTimeoutRef.current = setTimeout(() => {
        checkUsername(value)
      }, 500)
    }
  }

  // Save username
  const saveUsername = async () => {
    if (!usernameAvailable || saving) return
    setSaving(true)

    try {
      const response = await fetch('/api/username/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername }),
      })

      if (response.ok) {
        await refreshProfile()
        setIsEditing(false)
        setNewUsername('')
        setUsernameAvailable(null)
        setUsernameError('')
      } else {
        const data = await response.json()
        setUsernameError(data.error || 'Failed to update')
      }
    } catch {
      setUsernameError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false)
    setNewUsername('')
    setUsernameAvailable(null)
    setUsernameError('')
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current)
    }
  }

  // Start editing
  const startEdit = () => {
    setIsEditing(true)
    setNewUsername(profile?.username || '')
  }

  if (!user || !profile) return null

  return (
    <div className="w-full max-w-[320px] mb-6">
      {/* Username Header */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {isEditing ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newUsername}
                onChange={handleUsernameChange}
                maxLength={15}
                placeholder="New username"
                className="bg-mh-bg border border-mh-border rounded px-3 py-1.5 text-mh-text-bright text-sm font-mono w-36 focus:border-mh-accent-blue focus:outline-none"
                autoFocus
              />
              <button
                onClick={saveUsername}
                disabled={saving || !usernameAvailable || checking}
                className={`px-2 py-1 rounded border text-sm font-mono transition-colors ${
                  usernameAvailable && !saving && !checking
                    ? 'border-mh-profit-green text-mh-profit-green hover:bg-mh-profit-green/10 cursor-pointer'
                    : 'border-mh-border text-mh-text-dim cursor-not-allowed opacity-50'
                }`}
              >
                {saving ? '...' : '\u2713'}
              </button>
              <button
                onClick={cancelEdit}
                className="px-2 py-1 rounded border border-mh-border text-mh-text-dim text-sm font-mono hover:border-mh-loss-red hover:text-mh-loss-red transition-colors cursor-pointer"
              >
                \u2715
              </button>
            </div>
            {checking && (
              <div className="text-mh-text-dim text-xs">Checking...</div>
            )}
            {usernameError && !checking && (
              <div className="text-mh-loss-red text-xs">{usernameError}</div>
            )}
            {usernameAvailable === true && !checking && (
              <div className="text-mh-profit-green text-xs">\u2713 Available</div>
            )}
          </div>
        ) : (
          <>
            <span className="text-mh-text-dim text-sm">Welcome back,</span>
            <span className="text-mh-accent-blue font-bold">{profile.username || 'Trader'}</span>
            <button
              onClick={startEdit}
              className="bg-transparent border-none text-mh-text-dim hover:text-mh-accent-blue transition-colors cursor-pointer text-sm"
              title="Edit username"
            >
              \u270F\uFE0F
            </button>
            {isPro && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-mh-profit-green text-mh-bg rounded">
                PRO
              </span>
            )}
          </>
        )}
      </div>

      {/* Free tier: Daily games remaining */}
      {!isPro && (
        <div className="mb-4 p-3 border border-mh-border rounded bg-mh-border/10">
          <div className="flex justify-between items-center">
            <span className="text-mh-text-dim text-xs">DAILY GAMES</span>
            <span className={`font-bold ${gamesRemaining === 0 ? 'text-mh-loss-red' : 'text-mh-text-bright'}`}>
              {gamesRemaining}/{REGISTERED_FREE_DAILY_LIMIT}
            </span>
          </div>
          {gamesRemaining === 0 && (
            <div className="text-mh-loss-red text-xs mt-1">Resets at midnight</div>
          )}
        </div>
      )}

      {/* Upgrade to Pro button for free users */}
      {!isPro && (
        <button
          onClick={() => checkout('monthly')}
          disabled={checkoutLoading}
          className="w-full py-2.5 mb-4 border-2 border-mh-profit-green bg-mh-profit-green/10 text-mh-profit-green text-sm font-bold font-mono cursor-pointer hover:bg-mh-profit-green/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checkoutLoading ? 'LOADING...' : 'UPGRADE TO PRO \u2192'}
        </button>
      )}

      {/* Game Mode Selector */}
      <div className="mb-4">
        <div className="text-mh-text-dim text-xs mb-2">GAME MODE</div>
        <div className="flex gap-2">
          {/* 30 Days - Always Active */}
          <button
            onClick={() => setSelectedDuration(30)}
            className={`flex-1 py-2 border-2 font-mono text-sm transition-colors cursor-pointer ${
              selectedDuration === 30
                ? 'border-mh-accent-blue bg-mh-accent-blue/20 text-mh-accent-blue'
                : 'border-mh-border bg-transparent text-mh-text-dim hover:border-mh-text-dim'
            }`}
          >
            30 DAYS
          </button>

          {/* 45 Days - Locked for Free */}
          <button
            onClick={() => isPro && setSelectedDuration(45)}
            disabled={!isPro}
            className={`flex-1 py-2 border-2 font-mono text-sm transition-colors ${
              isPro
                ? selectedDuration === 45
                  ? 'border-mh-accent-blue bg-mh-accent-blue/20 text-mh-accent-blue cursor-pointer'
                  : 'border-mh-border bg-transparent text-mh-text-dim hover:border-mh-text-dim cursor-pointer'
                : 'border-mh-border bg-transparent text-mh-text-dim/50 cursor-not-allowed'
            }`}
          >
            {isPro ? '45 DAYS' : '\uD83D\uDD12 45'}
          </button>

          {/* 60 Days - Locked for Free */}
          <button
            onClick={() => isPro && setSelectedDuration(60)}
            disabled={!isPro}
            className={`flex-1 py-2 border-2 font-mono text-sm transition-colors ${
              isPro
                ? selectedDuration === 60
                  ? 'border-mh-accent-blue bg-mh-accent-blue/20 text-mh-accent-blue cursor-pointer'
                  : 'border-mh-border bg-transparent text-mh-text-dim hover:border-mh-text-dim cursor-pointer'
                : 'border-mh-border bg-transparent text-mh-text-dim/50 cursor-not-allowed'
            }`}
          >
            {isPro ? '60 DAYS' : '\uD83D\uDD12 60'}
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Games Played */}
        <div className="p-3 border border-mh-border rounded bg-mh-border/10">
          <div className="text-mh-text-dim text-xs mb-1">GAMES</div>
          <div className="text-mh-text-bright text-lg font-bold">
            {profile.total_games_played}
          </div>
        </div>

        {/* Win Rate */}
        <div className="p-3 border border-mh-border rounded bg-mh-border/10">
          <div className="text-mh-text-dim text-xs mb-1">WIN RATE</div>
          <div className={`text-lg font-bold ${winRate >= 50 ? 'text-mh-profit-green' : 'text-mh-text-bright'}`}>
            {winRate}%
          </div>
        </div>

        {/* Best Net Worth */}
        <div className="p-3 border border-mh-border rounded bg-mh-border/10">
          <div className="text-mh-text-dim text-xs mb-1">BEST RUN</div>
          <div className="text-mh-profit-green text-lg font-bold">
            {formatNumber(profile.best_net_worth || 100000)}
          </div>
        </div>

        {/* Current Streak */}
        <div className="p-3 border border-mh-border rounded bg-mh-border/10">
          <div className="text-mh-text-dim text-xs mb-1">WIN STREAK</div>
          <div className="text-mh-accent-blue text-lg font-bold">
            {profile.current_streak || 0}
            {(profile.win_streak || 0) > 0 && (
              <span className="text-mh-text-dim text-xs ml-1">
                (best: {profile.win_streak})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Total Earnings */}
      <div className="mt-2 p-3 border border-mh-border rounded bg-mh-border/10">
        <div className="flex justify-between items-center">
          <span className="text-mh-text-dim text-xs">CAREER EARNINGS</span>
          <span className="text-mh-profit-green font-bold">
            {formatNumber(profile.total_earnings || 0)}
          </span>
        </div>
      </div>
    </div>
  )
}
