'use client'

import { useState, useEffect } from 'react'
import { useGame } from '@/hooks/useGame'
import { useUserDetails } from '@/hooks/useUserDetails'
import { useAuth } from '@/contexts/AuthContext'
import { useStripeCheckout } from '@/hooks/useStripeCheckout'
import { generateLeaderboard, type LeaderboardEntry } from '@/lib/game/leaderboard'
import { loadUserState, resetDailyGamesIfNewDay, saveUserState } from '@/lib/game/persistence'
import { UserDashboard } from '../ui/UserDashboard'
import { AuthModal } from '@/components/auth/AuthModal'
import { ANONYMOUS_GAME_LIMIT, REGISTERED_FREE_DAILY_LIMIT } from '@/lib/game/userState'

const ASCII_LOGO = `███╗   ███╗ █████╗ ██████╗ ██╗  ██╗███████╗████████╗
████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝██╔════╝╚══██╔══╝
██╔████╔██║███████║██████╔╝█████╔╝ █████╗     ██║
██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗ ██╔══╝     ██║
██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗███████╗   ██║
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝
██╗  ██╗██╗   ██╗███████╗████████╗██╗     ███████╗
██║  ██║██║   ██║██╔════╝╚══██╔══╝██║     ██╔════╝
███████║██║   ██║███████╗   ██║   ██║     █████╗
██╔══██║██║   ██║╚════██║   ██║   ██║     ██╔══╝
██║  ██║╚██████╔╝███████║   ██║   ███████╗███████╗
╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚══════╝`

function formatScore(value: number): string {
  return `$${value.toLocaleString()}`
}

export function TitleScreen() {
  const startGame = useGame(state => state.startGame)
  const setShowSettings = useGame(state => state.setShowSettings)
  const initializeFromStorage = useGame(state => state.initializeFromStorage)
  const gamesRemaining = useGame(state => state.gamesRemaining)
  const limitType = useGame(state => state.limitType)
  const isLoggedIn = useGame(state => state.isLoggedIn)
  const { isPro } = useUserDetails()

  const { user, loading: authLoading } = useAuth()
  const { checkout, loading: checkoutLoading, error: checkoutError } = useStripeCheckout()

  const [dailyLeaderboard, setDailyLeaderboard] = useState<LeaderboardEntry[]>([])
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState<LeaderboardEntry[]>([])
  const [showAuthModal, setShowAuthModal] = useState(false)
  // Determine user state: anonymous vs logged-in
  const isAnonymous = !isLoggedIn && !user

  // Initialize store from localStorage on mount
  useEffect(() => {
    // Reset daily counter if new day
    const userState = loadUserState()
    const updatedState = resetDailyGamesIfNewDay(userState)
    if (updatedState !== userState) {
      saveUserState(updatedState)
    }
    // Sync store with localStorage
    initializeFromStorage()
  }, [initializeFromStorage])

  // Fetch daily + all-time leaderboards from API, fall back to generated data
  useEffect(() => {
    let cancelled = false
    async function fetchLeaderboards() {
      try {
        const [dailyRes, allTimeRes] = await Promise.all([
          fetch('/api/leaderboard?period=daily'),
          fetch('/api/leaderboard?period=all'),
        ])
        const [daily, allTime] = await Promise.all([dailyRes.json(), allTimeRes.json()])
        if (!cancelled) {
          setDailyLeaderboard(daily.entries ?? [])
          setAllTimeLeaderboard(
            allTime.entries?.length > 0 ? allTime.entries : generateLeaderboard(100)
          )
        }
      } catch {
        if (!cancelled) {
          setDailyLeaderboard([])
          setAllTimeLeaderboard(generateLeaderboard(100))
        }
      }
    }
    fetchLeaderboards()
    return () => { cancelled = true }
  }, [])

  // Get appropriate limit message
  const getLimitMessage = () => {
    if (isPro) return null
    if (gamesRemaining === 0) {
      return limitType === 'anonymous'
        ? 'Free games used — sign up to continue'
        : 'Daily limit reached — upgrade for unlimited games'
    }
    if (limitType === 'anonymous') {
      return `${gamesRemaining}/${ANONYMOUS_GAME_LIMIT} free games`
    }
    return `${gamesRemaining}/${REGISTERED_FREE_DAILY_LIMIT} games today`
  }

  return (
    <div className="h-full bg-mh-bg overflow-y-auto overflow-x-hidden -webkit-overflow-scrolling-touch">
      <div className="flex flex-col items-center p-4 pb-8 text-center relative min-h-full">
        {/* Settings gear icon */}
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-4 right-4 text-mh-text-dim hover:text-mh-text-bright transition-colors cursor-pointer bg-transparent border-none p-2 text-xl z-10"
          title="Settings"
        >
          ⚙️
        </button>

        {/* Logo */}
        <pre className="glow-text text-[7px] leading-tight mb-4 text-mh-text-bright whitespace-pre">
          {ASCII_LOGO}
        </pre>

        {/* Tagline - more visible */}
        <div className="text-mh-text-bright text-sm mb-10 leading-relaxed font-bold">
          BUY LOW. SELL HIGH.<br />DON&apos;T GO BROKE.
        </div>

        {/* ========================= */}
        {/* STATE-AWARE CONTENT */}
        {/* ========================= */}

        {/* For logged-in users: Show user dashboard */}
        {isLoggedIn && !authLoading && (
          <UserDashboard />
        )}

        {/* For anonymous users: Show "How to Play" */}
        {isAnonymous && (
          <div className="mb-8 w-full max-w-[320px]">
            <div className="text-mh-text-dim text-sm mb-3 text-center">HOW TO PLAY</div>
            <div className="text-mh-text-main text-sm leading-relaxed space-y-2 text-center">
              <div>▸ Buy assets. Sell for profit.</div>
              <div>▸ News moves markets. Read carefully.</div>
              <div>▸ Survive to win. Stay above $10K.</div>
            </div>
          </div>
        )}

        {/* Buttons - side by side for anonymous users */}
        {isAnonymous ? (
          <>
            <div className="flex gap-3 mb-2">
              {/* PLAY NOW button */}
              <button
                onClick={() => startGame()}
                className="bg-transparent border-2 border-mh-accent-blue text-mh-accent-blue
                  px-6 py-3 text-base font-mono cursor-pointer glow-text
                  hover:bg-mh-accent-blue/10 active:bg-mh-accent-blue/20 transition-colors"
              >
                [ PLAY NOW ]
              </button>

              {/* SIGN UP button */}
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-transparent border-2 border-mh-profit-green text-mh-profit-green
                  px-6 py-3 text-base font-mono cursor-pointer
                  hover:bg-mh-profit-green/10 active:bg-mh-profit-green/20 transition-colors"
              >
                [ SIGN UP ]
              </button>
            </div>

            {/* Sub-text under buttons */}
            <div className="flex gap-3 mb-1 w-full max-w-[280px]">
              <div className="flex-1 text-center">
                <div className="text-xs text-mh-text-dim">
                  Get 5 Free Games
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-xs text-mh-profit-green">
                  3 Games Every Day
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Single button for logged-in users */}
            <button
              onClick={() => startGame()}
              className="bg-transparent border-2 border-mh-accent-blue text-mh-accent-blue
                px-8 py-3 text-base font-mono cursor-pointer glow-text
                hover:bg-mh-accent-blue/10 active:bg-mh-accent-blue/20 transition-colors mb-2"
            >
              {isPro ? '[ START GAME ]' : '[ PLAY NOW ]'}
            </button>

            {/* Games Remaining Message */}
            {!isPro && (
              <div className={`text-xs mb-1 ${gamesRemaining === 0 ? 'text-mh-loss-red' : 'text-mh-text-dim'}`}>
                {getLimitMessage()}
              </div>
            )}
            {isPro && <div className="mb-1 text-xs text-mh-profit-green">UNLIMITED GAMES</div>}
          </>
        )}

        {/* Free vs Pro Comparison (show for anonymous and free registered) */}
        {!isPro && (
          <div className="w-full max-w-[320px] mb-8 mt-10">
            <div className="border border-mh-border rounded-lg overflow-hidden">
              {/* Header row */}
              <div className="flex items-center py-2.5 px-3 text-sm font-bold bg-mh-border/20 border-b border-mh-border">
                <div className="flex-1 text-left text-mh-text-dim"></div>
                <div className="w-14 text-center text-mh-text-dim">FREE</div>
                <div className="w-14 text-center text-mh-profit-green glow-green">PRO</div>
              </div>
              {/* Feature rows */}
              {[
                { feature: '30-day mode', free: true, pro: true },
                { feature: '45 & 60-day modes', free: false, pro: true },
                { feature: 'Long positions', free: true, pro: true },
                { feature: 'Short selling', free: false, pro: true },
                { feature: 'Margin trading', free: false, pro: true },
                { feature: 'Statistics', free: false, pro: true },
                { feature: 'Historical scenarios', free: false, pro: true },
              ].map((row, i) => (
                <div key={i} className={`flex items-center py-2.5 px-3 ${i % 2 === 1 ? 'bg-mh-border/10' : ''}`}>
                  <div className="flex-1 text-mh-text-main text-left text-sm">{row.feature}</div>
                  <div className="w-14 text-center text-sm">{row.free ? '✓' : '—'}</div>
                  <div className={`w-14 text-center text-sm ${row.pro ? 'text-mh-profit-green' : ''}`}>
                    {row.pro ? '✓' : '—'}
                  </div>
                </div>
              ))}
            </div>
            {/* Pricing buttons */}
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => checkout('monthly')}
                disabled={checkoutLoading}
                className="w-full py-2.5 border-2 border-mh-profit-green bg-mh-profit-green/10 text-mh-profit-green text-sm font-bold font-mono cursor-pointer hover:bg-mh-profit-green/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? 'LOADING...' : '$4.99/MONTH'}
              </button>
              <button
                onClick={() => checkout('yearly')}
                disabled={checkoutLoading}
                className="w-full py-2.5 border-2 border-mh-profit-green bg-mh-profit-green text-mh-bg text-sm font-bold font-mono cursor-pointer hover:bg-mh-profit-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? 'LOADING...' : '$29.99/YEAR — SAVE 50%'}
              </button>
              {checkoutError && (
                <div className="mt-2 text-xs text-mh-loss-red text-center">
                  {checkoutError}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pro users: Manage subscription link */}
        {isPro && (
          <div className="mb-8">
            <button
              onClick={() => setShowSettings(true)}
              className="text-xs text-mh-text-dim hover:text-mh-accent-blue transition-colors"
            >
              Manage Subscription →
            </button>
          </div>
        )}

        {/* Daily Leaderboard */}
        <div className="w-full max-w-[320px] mb-6">
          <div className="text-mh-text-dim text-sm mb-3 text-center">TODAY&apos;S LEADERBOARD</div>
          <div className="border border-mh-border rounded-lg overflow-hidden">
            {dailyLeaderboard.length === 0 ? (
              <div className="px-3 py-4 text-sm text-mh-text-dim text-center">
                No games played today yet. Be the first!
              </div>
            ) : (
              dailyLeaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center px-3 py-2 text-sm ${
                    index < 3 ? 'bg-mh-profit-green/10' : index % 2 === 1 ? 'bg-mh-border/10' : ''
                  }`}
                >
                  <span className={`w-10 ${index < 3 ? 'text-mh-profit-green font-bold' : 'text-mh-text-dim'}`}>
                    #{index + 1}
                  </span>
                  <span className="flex-1 text-mh-text-main truncate text-left">
                    {entry.username}
                  </span>
                  <span className={`font-mono text-right ${
                    entry.score >= 1_000_000_000 ? 'text-mh-profit-green' :
                    entry.score >= 1_000_000 ? 'text-mh-accent-blue' :
                    'text-mh-text-main'
                  }`}>
                    {formatScore(entry.score)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* All-Time Leaderboard */}
        <div className="w-full max-w-[320px]">
          <div className="text-mh-text-dim text-sm mb-3 text-center">ALL-TIME LEADERBOARD</div>
          <div className="border border-mh-border rounded-lg overflow-hidden">
            {allTimeLeaderboard.map((entry, index) => (
              <div
                key={index}
                className={`flex items-center px-3 py-2 text-sm ${
                  index < 3 ? 'bg-mh-accent-blue/10' : index % 2 === 1 ? 'bg-mh-border/10' : ''
                }`}
              >
                <span className={`w-10 ${index < 3 ? 'text-mh-accent-blue font-bold' : 'text-mh-text-dim'}`}>
                  #{index + 1}
                </span>
                <span className="flex-1 text-mh-text-main truncate text-left">
                  {entry.username}
                </span>
                <span className={`font-mono text-right ${
                  entry.score >= 1_000_000_000 ? 'text-mh-profit-green' :
                  entry.score >= 1_000_000 ? 'text-mh-accent-blue' :
                  'text-mh-text-main'
                }`}>
                  {formatScore(entry.score)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
