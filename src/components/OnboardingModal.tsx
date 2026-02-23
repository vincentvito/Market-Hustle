'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

type CheckStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'error'

export function OnboardingModal() {
  const { needsOnboarding, loading, refreshProfile } = useAuth()
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<CheckStatus>('idle')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const checkUsername = useCallback(async (username: string) => {
    if (username.length < 3) {
      setStatus('invalid')
      setMessage('At least 3 characters')
      return
    }
    if (username.length > 15) {
      setStatus('invalid')
      setMessage('Max 15 characters')
      return
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      setStatus('invalid')
      setMessage('Only letters, numbers, underscores')
      return
    }

    setStatus('checking')
    setMessage('')

    try {
      const res = await fetch('/api/username/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
      const data = await res.json()

      if (data.available) {
        setStatus('available')
        setMessage('Available!')
      } else {
        setStatus('taken')
        setMessage(data.reason || 'Already taken')
      }
    } catch {
      setStatus('error')
      setMessage('Could not check availability')
    }
  }, [])

  useEffect(() => {
    if (!input) {
      setStatus('idle')
      setMessage('')
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => checkUsername(input), 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [input, checkUsername])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 15)
    setInput(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status !== 'available' || submitting) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/username/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: input }),
      })
      const data = await res.json()

      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('mh_username', input)
        }
        const { useGame } = await import('@/hooks/useGame')
        useGame.getState().setUsername(input)
        await refreshProfile()
      } else {
        setStatus('taken')
        setMessage(data.error || 'Failed to set username')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !needsOnboarding) return null

  const canSubmit = status === 'available' && !submitting

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative bg-[var(--bg-primary)] border-2 border-[var(--border-color)] rounded-lg p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-3xl mb-3">&#x1F4C8;</div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
            Welcome to Market Hustle
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">
            Choose a username for the leaderboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5 font-mono tracking-wider">
              USERNAME
            </label>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              autoFocus
              placeholder="your_username"
              maxLength={15}
              className="w-full px-3 py-2.5 bg-[var(--bg-secondary)] border rounded text-[var(--text-primary)] font-mono focus:outline-none transition-colors"
              style={{
                borderColor: status === 'available'
                  ? 'var(--accent-primary)'
                  : status === 'taken' || status === 'invalid'
                    ? '#ef4444'
                    : 'var(--border-color)',
              }}
            />
            <div className="mt-1.5 h-5 flex items-center">
              {status === 'checking' && (
                <span className="text-[var(--text-secondary)] text-xs">Checking...</span>
              )}
              {status === 'available' && (
                <span className="text-emerald-400 text-xs">{message}</span>
              )}
              {(status === 'taken' || status === 'invalid') && (
                <span className="text-red-400 text-xs">{message}</span>
              )}
              {status === 'error' && (
                <span className="text-amber-400 text-xs">{message}</span>
              )}
              {status === 'idle' && input.length === 0 && (
                <span className="text-[var(--text-secondary)] text-xs opacity-60">
                  3-15 chars: letters, numbers, underscores
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-2.5 font-semibold rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: canSubmit ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: canSubmit ? 'white' : 'var(--text-secondary)',
            }}
          >
            {submitting ? 'Setting up...' : 'Start Trading'}
          </button>
        </form>
      </div>
    </div>
  )
}
