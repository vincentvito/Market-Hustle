'use client'

import { useState, useEffect } from 'react'
import { useGame } from '@/hooks/useGame'
import { generateLeaderboard, type LeaderboardEntry } from '@/lib/game/leaderboard'
import { loadUserState, resetDailyGamesIfNewDay, saveUserState } from '@/lib/game/persistence'

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
  const userTier = useGame(state => state.userTier)
  const isPro = userTier === 'pro'

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

  // Generate leaderboard only on client side to avoid hydration mismatch
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  useEffect(() => {
    setLeaderboard(generateLeaderboard(100))
  }, [])

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
        <div className="text-mh-text-bright text-sm mb-8 leading-relaxed font-bold">
          BUY LOW. SELL HIGH.<br />DON&apos;T GO BROKE.
        </div>

        {/* How to Play */}
        <div className="mb-8 w-full max-w-[320px]">
          <div className="text-mh-text-dim text-sm mb-3 text-center">HOW TO PLAY</div>
          <div className="text-mh-text-main text-sm leading-relaxed space-y-2 text-center">
            <div>▸ Buy assets. Sell for profit.</div>
            <div>▸ News moves markets. Read carefully.</div>
            <div>▸ Survive to win. Stay above $10K.</div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => startGame()}
          className="bg-transparent border-2 border-mh-accent-blue text-mh-accent-blue
            px-8 py-3 text-base font-mono cursor-pointer glow-text
            hover:bg-mh-accent-blue/10 active:bg-mh-accent-blue/20 transition-colors mb-2"
        >
          [ START FREE ]
        </button>

        {/* Games Remaining (Free tier only) */}
        {!isPro && (
          <div className={`text-xs mb-8 ${gamesRemaining === 0 ? 'text-mh-loss-red' : 'text-mh-text-dim'}`}>
            {gamesRemaining === 0
              ? 'Daily limit reached — upgrade for unlimited games'
              : `${gamesRemaining}/10 free games per day`
            }
          </div>
        )}
        {isPro && <div className="mb-8" />}

        {/* Free vs Pro Comparison */}
        <div className="w-full max-w-[320px] mb-10">
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
              className="w-full py-2.5 border-2 border-mh-profit-green bg-mh-profit-green/10 text-mh-profit-green text-sm font-bold font-mono cursor-pointer hover:bg-mh-profit-green/20 transition-colors"
            >
              $4.99/MONTH
            </button>
            <button
              className="w-full py-2.5 border-2 border-mh-profit-green bg-mh-profit-green text-mh-bg text-sm font-bold font-mono cursor-pointer hover:bg-mh-profit-green/90 transition-colors"
            >
              $29.99/YEAR — SAVE 50%
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="w-full max-w-[320px]">
          <div className="text-mh-text-dim text-sm mb-3 text-center">LEADERBOARD</div>
          <div className="border border-mh-border rounded-lg overflow-hidden">
            {leaderboard.map((entry, index) => (
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
    </div>
  )
}
