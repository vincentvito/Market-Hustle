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
  const username = useGame(state => state.username)
  const setUsername = useGame(state => state.setUsername)

  const [dailyLeaderboard, setDailyLeaderboard] = useState<LeaderboardEntry[]>([])
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState<LeaderboardEntry[]>([])
  const [worstLeaderboard, setWorstLeaderboard] = useState<LeaderboardEntry[]>([])
  const [usernameInput, setUsernameInput] = useState('')
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [isEditingUsername, setIsEditingUsername] = useState(false)

  // Sync input with stored username
  useEffect(() => {
    if (username) setUsernameInput(username)
  }, [username])

  const validateAndSetUsername = () => {
    const value = usernameInput.trim().toLowerCase()
    if (value.length < 3) {
      setUsernameError('Min 3 characters')
      return
    }
    if (value.length > 15) {
      setUsernameError('Max 15 characters')
      return
    }
    if (!/^[a-z0-9_]+$/.test(value)) {
      setUsernameError('Only letters, numbers, underscores')
      return
    }
    setUsernameError(null)
    setUsername(value)
    setIsEditingUsername(false)
  }

  const hasValidUsername = !!username

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
        const [dailyRes, allTimeRes, worstRes] = await Promise.all([
          fetch('/api/leaderboard?period=daily'),
          fetch('/api/leaderboard?period=all'),
          fetch('/api/leaderboard?period=worst'),
        ])
        const [daily, allTime, worst] = await Promise.all([dailyRes.json(), allTimeRes.json(), worstRes.json()])
        if (!cancelled) {
          setDailyLeaderboard(daily.entries ?? [])
          setAllTimeLeaderboard(
            allTime.entries?.length > 0 ? allTime.entries : generateLeaderboard(100)
          )
          setWorstLeaderboard(worst.entries ?? [])
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

        {/* How to Play */}
        <div className="mb-8 w-full max-w-[320px]">
          <div className="text-mh-text-dim text-sm mb-3 text-center">HOW TO PLAY</div>
          <div className="text-mh-text-main text-sm leading-relaxed space-y-2 text-center">
            <div>▸ Buy assets. Sell for profit.</div>
            <div>▸ News moves markets. Read carefully.</div>
            <div>▸ Survive to win. Stay above $10K.</div>
          </div>
        </div>

        {/* Username Input */}
        <div className="w-full max-w-[280px] mb-4">
          {hasValidUsername && !isEditingUsername ? (
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-mh-text-dim text-sm">Playing as</span>
              <span className="text-mh-accent-blue text-sm font-bold">{username}</span>
              <button
                onClick={() => setIsEditingUsername(true)}
                className="text-mh-text-dim text-xs hover:text-mh-text-main transition-colors cursor-pointer bg-transparent border-none"
              >
                [change]
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="text-mh-text-dim text-xs mb-1">ENTER USERNAME TO PLAY</div>
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  onKeyDown={(e) => { if (e.key === 'Enter') validateAndSetUsername() }}
                  maxLength={15}
                  placeholder="your_username"
                  className="flex-1 bg-transparent border border-mh-border text-mh-text-main text-sm font-mono
                    px-3 py-2 outline-none focus:border-mh-accent-blue transition-colors placeholder:text-mh-text-dim/50"
                />
                <button
                  onClick={validateAndSetUsername}
                  className="bg-transparent border border-mh-accent-blue text-mh-accent-blue
                    px-3 py-2 text-xs font-mono cursor-pointer
                    hover:bg-mh-accent-blue/10 transition-colors"
                >
                  OK
                </button>
              </div>
              {usernameError && (
                <div className="text-mh-loss-red text-xs">{usernameError}</div>
              )}
            </div>
          )}
        </div>

        {/* Play Button */}
        <button
          onClick={() => startGame()}
          disabled={!hasValidUsername}
          className={`border-2 px-8 py-3 text-base font-mono transition-colors mb-2
            ${hasValidUsername
              ? 'border-mh-accent-blue text-mh-accent-blue bg-transparent cursor-pointer glow-text hover:bg-mh-accent-blue/10 active:bg-mh-accent-blue/20'
              : 'border-mh-border text-mh-text-dim bg-transparent cursor-not-allowed opacity-50'
            }`}
        >
          [ PLAY NOW ]
        </button>

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
        <div className="w-full max-w-[320px] mb-6">
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
        {/* Worst Scores Leaderboard */}
        {worstLeaderboard.length > 0 && (
          <div className="w-full max-w-[320px]">
            <div className="text-mh-text-dim text-sm mb-3 text-center">HALL OF SHAME</div>
            <div className="border border-mh-border rounded-lg overflow-hidden">
              {worstLeaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center px-3 py-2 text-sm ${
                    index < 3 ? 'bg-mh-loss-red/10' : index % 2 === 1 ? 'bg-mh-border/10' : ''
                  }`}
                >
                  <span className={`w-10 ${index < 3 ? 'text-mh-loss-red font-bold' : 'text-mh-text-dim'}`}>
                    #{index + 1}
                  </span>
                  <span className="flex-1 text-mh-text-main truncate text-left">
                    {entry.username}
                  </span>
                  <span className="font-mono text-right text-mh-loss-red">
                    {formatScore(entry.score)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
