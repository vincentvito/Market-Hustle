'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getSupabaseClient } from '@/lib/supabase/client'

export function OnboardingModal() {
  const { needsOnboarding, loading, refreshProfile } = useAuth()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!needsOnboarding || loading) return
    const t1 = setTimeout(() => setStep(1), 200)
    const t2 = setTimeout(() => setStep(2), 600)
    const t3 = setTimeout(() => setStep(3), 1000)
    const t4 = setTimeout(() => setStep(4), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [needsOnboarding, loading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 15))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const username = input.trim()
    if (username.length < 3) {
      setError('At least 3 characters')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      console.log('[onboarding] session:', session ? 'exists' : 'null', 'token:', session?.access_token ? 'yes' : 'no')
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }
      console.log('[onboarding] setting username:', username)
      const res = await fetch('/api/username/set', {
        method: 'POST',
        headers,
        body: JSON.stringify({ username }),
      })
      const data = await res.json()
      console.log('[onboarding] response:', data)

      if (data.success) {
        localStorage.setItem('mh_username', username)
        const { useGame } = await import('@/hooks/useGame')
        useGame.getState().setUsername(username)
        await refreshProfile()
      } else {
        setError(data.error || 'Try a different username')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  console.log('[onboarding] loading:', loading, 'needsOnboarding:', needsOnboarding)
  if (loading || !needsOnboarding) return null

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity duration-500" />
      <div className="relative bg-mh-bg border border-mh-border p-6 w-full max-w-sm mx-4 shadow-[0_0_40px_rgba(0,0,0,0.5)]">

        <div className="text-center mb-5 overflow-hidden">
          <div
            className="text-4xl mb-3 transition-all duration-500 ease-out"
            style={{
              opacity: step >= 1 ? 1 : 0,
              transform: step >= 1 ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            &#x1F4B0;
          </div>
          <h2
            className="text-mh-text-bright text-2xl font-bold font-mono mb-2 transition-all duration-500 ease-out"
            style={{
              opacity: step >= 2 ? 1 : 0,
              transform: step >= 2 ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            WELCOME
          </h2>
          <p
            className="text-mh-text-dim text-xs leading-relaxed transition-all duration-500 ease-out"
            style={{
              opacity: step >= 3 ? 1 : 0,
              transform: step >= 3 ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            Every Wall Street legend needs a name.<br />
            Make it memorable — your rivals will see it<br />
            when you crush them on the leaderboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="transition-all duration-500 ease-out"
          style={{
            opacity: step >= 4 ? 1 : 0,
            transform: step >= 4 ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <label className="block text-mh-text-dim text-[10px] font-mono tracking-widest mb-1.5">
            TRADING ALIAS
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mh-text-dim text-sm">@</span>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              autoFocus
              placeholder="wolf_of_wallst"
              maxLength={15}
              className="w-full pl-8 pr-3 py-2.5 bg-transparent border border-mh-border text-mh-text-bright font-mono text-sm focus:outline-none focus:border-mh-accent-blue transition-colors"
            />
          </div>
          <div className="h-5 mt-1 mb-3">
            {error && <span className="text-mh-loss-red text-xs font-mono">{error}</span>}
            {!error && input.length > 0 && input.length < 3 && (
              <span className="text-mh-text-dim text-xs font-mono">Keep typing...</span>
            )}
            {!error && input.length >= 3 && (
              <span className="text-mh-profit-green text-xs font-mono">Looks good</span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || input.length < 3}
            className="w-full py-2.5 font-mono text-sm font-bold border transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-mh-profit-green/20 text-mh-profit-green border-mh-profit-green/50 hover:bg-mh-profit-green/30 hover:shadow-[0_0_12px_rgba(0,255,136,0.2)]"
          >
            {submitting ? 'OPENING YOUR ACCOUNT...' : '[ START TRADING ]'}
          </button>

          <p className="text-center text-mh-text-dim text-[10px] mt-3 font-mono opacity-60">
            3-15 chars &middot; letters, numbers, underscores
          </p>
        </form>
      </div>
    </div>
  )
}
