'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/hooks/useGame'
import { useAuth } from '@/contexts/AuthContext'
import { generateLeaderboard, type LeaderboardEntry } from '@/lib/game/leaderboard'
import { loadUserState, resetDailyGamesIfNewDay, saveUserState } from '@/lib/game/persistence'
import { isDev } from '@/lib/env'
import { Skeleton } from '@/components/ui/Skeleton'
import { isIntroSeen } from './IntroScreen'
import { AuthModal } from '@/components/auth/AuthModal'
import { HowToPlayModal } from '../ui/HowToPlayModal'
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
  return `$${value.toLocaleString('en-US')}`
}

function LeaderboardSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center px-3 py-2 gap-2">
          <Skeleton className="w-8 h-4" />
          <Skeleton className="flex-1 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
      ))}
    </>
  )
}

interface TitleScreenProps {
  initialLeaderboards?: {
    daily: LeaderboardEntry[]
    allTime: LeaderboardEntry[]
    worst: LeaderboardEntry[]
  }
}

type ActiveSection = 'rooms' | 'leaderboards' | null
type LeaderboardTab = 'daily' | 'allTime' | 'worst'

export function TitleScreen({ initialLeaderboards }: TitleScreenProps) {
  const setScreen = useGame(state => state.setScreen)
  const startGame = useGame(state => state.startGame)
  const setShowSettings = useGame(state => state.setShowSettings)
  const initializeFromStorage = useGame(state => state.initializeFromStorage)
  const username = useGame(state => state.username)
  const setUsername = useGame(state => state.setUsername)
  const setSelectedDuration = useGame(state => state.setSelectedDuration)
  const { user, updateSettings } = useAuth()
  const router = useRouter()

  const [dailyLeaderboard, setDailyLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboards?.daily ?? [])
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboards?.allTime ?? [])
  const [worstLeaderboard, setWorstLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboards?.worst ?? [])
  const [leaderboardDuration, setLeaderboardDuration] = useState<30 | 45 | 60>(30)
  const [showAuthForRoom, setShowAuthForRoom] = useState(false)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const hasInitialData = useRef(!!initialLeaderboards)

  const [activeSection, setActiveSection] = useState<ActiveSection>(null)
  const [leaderboardTab, setLeaderboardTab] = useState<LeaderboardTab>('allTime')

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

  // Fetch leaderboards from API
  // Skip on first mount if we have SSR data (already filtered by duration=30);
  // always fetch on subsequent mounts (returning from game) or when duration changes.
  const isFirstMount = useRef(true)

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      if (hasInitialData.current) return
    }

    let cancelled = false
    async function fetchLeaderboards() {
      try {
        const cacheBust = `&_t=${Date.now()}`
        const durationParam = `&duration=${leaderboardDuration}`
        const [dailyRes, allTimeRes, worstRes] = await Promise.all([
          fetch(`/api/leaderboard?period=daily${durationParam}${cacheBust}`, { cache: 'no-store' }),
          fetch(`/api/leaderboard?period=all${durationParam}${cacheBust}`, { cache: 'no-store' }),
          fetch(`/api/leaderboard?period=worst${durationParam}${cacheBust}`, { cache: 'no-store' }),
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
  }, [leaderboardDuration])

  const showAllTimeSkeleton = allTimeLeaderboard.length === 0 && !hasInitialData.current

  const toggleSection = (section: ActiveSection) => {
    setActiveSection(prev => prev === section ? null : section)
  }

  // Active leaderboard data and color config
  const currentLeaderboard =
    leaderboardTab === 'daily' ? dailyLeaderboard
    : leaderboardTab === 'allTime' ? allTimeLeaderboard
    : worstLeaderboard

  const tabColors = {
    daily: { top: 'text-mh-profit-green', topBg: 'bg-mh-profit-green/10' },
    allTime: { top: 'text-mh-accent-blue', topBg: 'bg-mh-accent-blue/10' },
    worst: { top: 'text-mh-loss-red', topBg: 'bg-mh-loss-red/10' },
  }
  const colors = tabColors[leaderboardTab]

  return (
    <div className="h-full bg-mh-bg overflow-y-auto relative" style={{
      backgroundImage: 'url(/image.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    }}>
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 z-[2] pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(13,17,23,0.7) 0%, rgba(13,17,23,0.4) 40%, rgba(13,17,23,0.6) 100%)',
      }} />

      <div className="flex flex-col items-center min-h-full px-4 relative text-center z-[5]">
        {/* Top spacer — pushes content toward vertical center */}
        <div className="flex-1 min-h-[5vh] max-h-[12vh]" />

        {/* ═══ HERO: Logo + Tagline ═══ */}
        <pre className="glow-text text-[7px] leading-tight mb-4 text-mh-text-bright whitespace-pre text-left inline-block">
          {ASCII_LOGO}
        </pre>

        <div className="text-mh-text-bright text-sm mb-10 leading-relaxed font-bold tracking-wider">
          BUY LOW. SELL HIGH.<br />DON&apos;T GO BROKE.
        </div>

        {/* ═══ MAIN MENU ═══ */}
        <nav aria-label="Main menu" className="flex flex-col items-center gap-0.5 mb-6 w-full max-w-[280px]">
          {/* PLAY — primary action, visually distinct */}
          <button
            onClick={() => {
              if (isIntroSeen()) {
                startGame()
              } else {
                setScreen('intro')
              }
            }}
            className="group w-full text-center py-3 font-mono text-lg tracking-[0.2em] transition-all duration-200 bg-transparent border-none focus-visible:outline-none text-mh-text-bright glow-text cursor-pointer"
          >
            <span className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">{'> '}</span>
            PLAY
            <span className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">{' <'}</span>
          </button>

          {/* ROOMS */}
          <button
            onClick={() => toggleSection('rooms')}
            aria-expanded={activeSection === 'rooms'}
            className={`group w-full text-center py-2 font-mono text-sm tracking-[0.2em] transition-all duration-200 bg-transparent border-none cursor-pointer focus-visible:outline-none
              ${activeSection === 'rooms' ? 'text-white' : 'text-white/70 hover:text-white focus-visible:text-white'}`}
          >
            <span className={`opacity-0 transition-opacity duration-150 ${activeSection === 'rooms' ? '!opacity-100' : 'group-hover:opacity-100 group-focus-visible:opacity-100'}`}>{'> '}</span>
            ROOMS
            <span className={`opacity-0 transition-opacity duration-150 ${activeSection === 'rooms' ? '!opacity-100' : 'group-hover:opacity-100 group-focus-visible:opacity-100'}`}>{' <'}</span>
          </button>

          {/* LEADERBOARDS */}
          <button
            onClick={() => toggleSection('leaderboards')}
            aria-expanded={activeSection === 'leaderboards'}
            className={`group w-full text-center py-2 font-mono text-sm tracking-[0.2em] transition-all duration-200 bg-transparent border-none cursor-pointer focus-visible:outline-none
              ${activeSection === 'leaderboards' ? 'text-white' : 'text-white/70 hover:text-white focus-visible:text-white'}`}
          >
            <span className={`opacity-0 transition-opacity duration-150 ${activeSection === 'leaderboards' ? '!opacity-100' : 'group-hover:opacity-100 group-focus-visible:opacity-100'}`}>{'> '}</span>
            LEADERBOARDS
            <span className={`opacity-0 transition-opacity duration-150 ${activeSection === 'leaderboards' ? '!opacity-100' : 'group-hover:opacity-100 group-focus-visible:opacity-100'}`}>{' <'}</span>
          </button>

          {/* HOW TO PLAY */}
          <button
            onClick={() => setShowHowToPlay(true)}
            className="group w-full text-center py-2 font-mono text-sm tracking-[0.2em] transition-all duration-200 bg-transparent border-none cursor-pointer text-white/70 hover:text-white focus-visible:text-white focus-visible:outline-none"
          >
            <span className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">{'> '}</span>
            HOW TO PLAY
            <span className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">{' <'}</span>
          </button>

          {/* SETTINGS */}
          <button
            onClick={() => setShowSettings(true)}
            className="group w-full text-center py-2 font-mono text-sm tracking-[0.2em] transition-all duration-200 bg-transparent border-none cursor-pointer text-white/70 hover:text-white focus-visible:text-white focus-visible:outline-none"
          >
            <span className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">{'> '}</span>
            SETTINGS
            <span className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">{' <'}</span>
          </button>
        </nav>

        {/* ═══ EXPANDABLE: ROOMS ═══ */}
        {activeSection === 'rooms' && (
          <div role="region" aria-label="Rooms" className="w-full max-w-[280px] mb-6 border border-white/20 p-4 space-y-3 bg-black/40 backdrop-blur-sm">
            {hasValidUsername ? (
              <>
                <button
                  onClick={user ? () => router.push('/room/create') : () => setShowAuthForRoom(true)}
                  className={`w-full py-2.5 font-mono text-xs tracking-wider transition-colors bg-transparent border cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-white
                    ${user
                      ? 'text-white/80 border-white/30 hover:border-white hover:text-white'
                      : 'text-white/50 border-white/20 hover:border-white/40 hover:text-white/70'
                    }`}
                >
                  CREATE ROOM
                </button>
                <button
                  onClick={user ? () => router.push('/room/join') : () => setShowAuthForRoom(true)}
                  className={`w-full py-2.5 font-mono text-xs tracking-wider transition-colors bg-transparent border cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-white
                    ${user
                      ? 'text-white/80 border-white/30 hover:border-white hover:text-white'
                      : 'text-white/50 border-white/20 hover:border-white/40 hover:text-white/70'
                    }`}
                >
                  JOIN ROOM
                </button>
                {!user && (
                  <p className="text-white/50 text-[10px] font-mono text-center !mt-1 !mb-0">
                    SIGN IN TO PLAY WITH FRIENDS
                  </p>
                )}
              </>
            ) : (
              <p className="text-white/60 text-xs font-mono text-center py-2 m-0">
                Set a username first to create or join rooms.
              </p>
            )}
          </div>
        )}

        {/* ═══ EXPANDABLE: LEADERBOARDS ═══ */}
        {activeSection === 'leaderboards' && (
          <div role="region" aria-label="Leaderboards" className="w-full max-w-[320px] mb-6 border border-white/20 p-4 bg-black/40 backdrop-blur-sm">
            {/* Duration selector */}
            <div className="flex justify-center gap-2 mb-3" role="group" aria-label="Game duration">
              {([30, 45, 60] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setLeaderboardDuration(d)
                    setSelectedDuration(d)
                    if (user) updateSettings({ duration: d })
                  }}
                  aria-pressed={leaderboardDuration === d}
                  className={`px-3 py-1 text-xs font-mono rounded-full border transition-colors cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-white ${
                    leaderboardDuration === d
                      ? 'bg-white/20 text-white border-white/60'
                      : 'bg-transparent text-white/50 border-white/20 hover:text-white/80 hover:border-white/40'
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>

            {/* Tab selector */}
            <div className="flex justify-center gap-1 mb-3" role="tablist" aria-label="Leaderboard type">
              {([
                { key: 'daily' as const, label: 'TODAY' },
                { key: 'allTime' as const, label: 'ALL-TIME' },
                { key: 'worst' as const, label: 'SHAME' },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={leaderboardTab === tab.key}
                  onClick={() => setLeaderboardTab(tab.key)}
                  className={`px-3 py-1.5 text-xs font-mono transition-colors bg-transparent border-none cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-white
                    ${leaderboardTab === tab.key
                      ? 'text-white'
                      : 'text-white/50 hover:text-white/80'
                    }`}
                >
                  {leaderboardTab === tab.key ? `[ ${tab.label} ]` : tab.label}
                </button>
              ))}
            </div>

            {/* Leaderboard table */}
            <div className="border border-white/15 rounded-lg overflow-hidden">
              {leaderboardTab === 'allTime' && showAllTimeSkeleton ? (
                <LeaderboardSkeleton rows={5} />
              ) : currentLeaderboard.length === 0 ? (
                <div className="px-3 py-4 text-sm text-white/50 text-center">
                  {leaderboardTab === 'daily'
                    ? 'No games played today yet. Be the first!'
                    : 'No entries yet.'}
                </div>
              ) : (
                currentLeaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center px-3 py-2 text-sm ${
                      index < 3 ? 'bg-white/5' : index % 2 === 1 ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <span className={`w-10 ${index < 3 ? 'text-white font-bold' : 'text-white/50'}`}>
                      #{index + 1}
                    </span>
                    <span className="flex-1 text-white/80 truncate text-left">
                      {entry.username}
                    </span>
                    <span className={`font-mono text-right ${
                      leaderboardTab === 'worst'
                        ? 'text-red-400'
                        : entry.score >= 1_000_000_000 ? 'text-green-400'
                        : entry.score >= 1_000_000 ? 'text-white'
                        : 'text-white/80'
                    }`}>
                      {formatScore(entry.score)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Bottom spacer */}
        <div className="flex-1 min-h-[3vh]" />

        {/* ═══ FOOTER ═══ */}
        <div className="pb-6 flex flex-col items-center gap-2 w-full max-w-[280px]">
          {hasValidUsername && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-white/50 text-xs font-mono">Playing as</span>
              <span className="text-white text-xs font-bold font-mono">{username}</span>
              {isDev && (
                <button
                  onClick={() => setUsername('')}
                  className="text-red-400/60 text-[10px] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none font-mono"
                >
                  [reset]
                </button>
              )}
            </div>
          )}
          {!user && (
            <button
              onClick={() => setShowAuthForRoom(true)}
              className="px-6 py-1.5 font-mono text-xs tracking-[0.2em] transition-all duration-200 bg-transparent border border-white/25 cursor-pointer text-white/50 hover:text-white hover:border-white/60 focus-visible:outline-none"
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>

      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
      <AuthModal
        isOpen={showAuthForRoom}
        onClose={() => setShowAuthForRoom(false)}
      />
    </div>
  )
}
