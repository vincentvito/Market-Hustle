'use client'

import { useState, useEffect } from 'react'
import { useGame } from '@/hooks/useGame'
import { useAuth } from '@/contexts/AuthContext'
import { ACHIEVEMENTS } from '@/lib/game/achievements'
import { loadUserState } from '@/lib/game/persistence'
import type { UserState } from '@/lib/game/userState'
import { AuthModal } from '@/components/auth/AuthModal'

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}

function getStreakEmoji(streak: number): string {
  if (streak >= 10) return '🔥🔥🔥'
  if (streak >= 5) return '🔥🔥'
  if (streak >= 3) return '🔥'
  return ''
}

export function SettingsPanel() {
  const { showSettings, setShowSettings, userTier, selectedDuration, setSelectedDuration, selectedTheme, setSelectedTheme, getEffectiveTier } = useGame()
  const { user, profile, signOut, loading: authLoading, updateSettings } = useAuth()

  // Wrapper to sync settings to Supabase when changed
  const handleDurationChange = (duration: 30 | 45 | 60) => {
    setSelectedDuration(duration)
    if (user) {
      updateSettings({ duration })
    }
  }

  const handleThemeChange = (theme: 'retro' | 'modern3' | 'retro2' | 'bloomberg') => {
    setSelectedTheme(theme)
    if (user) {
      updateSettings({ theme })
    }
  }
  const [achievementsExpanded, setAchievementsExpanded] = useState(false)
  const [optionsExpanded, setOptionsExpanded] = useState(false)
  const [historicalExpanded, setHistoricalExpanded] = useState(false)
  const [userStats, setUserStats] = useState<UserState | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Load user stats from localStorage on mount
  useEffect(() => {
    if (showSettings) {
      setUserStats(loadUserState())
    }
  }, [showSettings])

  // Calculate derived stats from user state
  const gamesPlayed = userStats?.totalGamesPlayed ?? 0
  const bestNetWorth = userStats?.bestNetWorth ?? 0
  const totalProfit = userStats?.totalEarnings ?? 0
  const winCount = userStats?.winCount ?? 0
  const winRate = gamesPlayed > 0 ? Math.round((winCount / gamesPlayed) * 100) : 0
  const winStreak = userStats?.winStreak ?? 0

  // Achievements not tracked yet - show empty for now
  const unlockedAchievements: string[] = []
  const unlockedCount = unlockedAchievements.length
  const totalCount = ACHIEVEMENTS.length
  const isPro = getEffectiveTier() === 'pro'

  if (!showSettings) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShowSettings(false)}
        className="fixed inset-0 bg-black/60 z-[300]"
      />

      {/* Slide-in Panel */}
      <div
        className="fixed top-0 right-0 h-full w-[320px] max-w-[85vw] bg-mh-bg border-l border-mh-border z-[301] overflow-y-auto"
        style={{
          animation: 'slideInRight 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-mh-border flex justify-between items-center sticky top-0 bg-mh-bg z-10">
          <div className="text-mh-text-bright font-bold text-lg">
            📊 CAREER
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="bg-transparent border-none text-mh-text-dim text-2xl cursor-pointer px-2 hover:text-mh-text-bright"
          >
            ×
          </button>
        </div>

        {/* 1. HERO STAT: Total Career Earnings */}
        <div className="p-4 border-b border-mh-border bg-[#0a1015]">
          <div className="text-mh-text-dim text-xs tracking-wider mb-1">
            LIFETIME EARNINGS
          </div>
          <div className="text-3xl font-bold text-mh-profit-green">
            {formatCurrency(totalProfit)}
          </div>
          <div className="text-mh-text-dim text-xs mt-1">
            across {gamesPlayed} careers
          </div>
        </div>

        {/* 2. STAT GRID: 2x2 Cards */}
        <div className="p-4 border-b border-mh-border">
          <div className="grid grid-cols-2 gap-3">
            {/* Win Rate */}
            <div className="bg-[#0a1015] border border-mh-border rounded p-3">
              <div className="text-mh-text-dim text-xs mb-1">WIN RATE</div>
              <div className={`text-xl font-bold ${winRate >= 50 ? 'text-mh-profit-green' : 'text-mh-loss-red'}`}>
                {winRate}%
              </div>
            </div>

            {/* Best Run */}
            <div className="bg-[#0a1015] border border-mh-border rounded p-3">
              <div className="text-mh-text-dim text-xs mb-1">🏆 BEST RUN</div>
              <div className="text-xl font-bold text-mh-accent-blue">
                {formatCurrency(bestNetWorth)}
              </div>
            </div>

            {/* Games Played */}
            <div className="bg-[#0a1015] border border-mh-border rounded p-3">
              <div className="text-mh-text-dim text-xs mb-1">CAREERS</div>
              <div className="text-xl font-bold text-mh-text-bright">
                {gamesPlayed}
              </div>
            </div>

            {/* Win Streak */}
            <div className="bg-[#0a1015] border border-mh-border rounded p-3">
              <div className="text-mh-text-dim text-xs mb-1">WIN STREAK</div>
              <div className="text-xl font-bold text-mh-text-bright">
                {winStreak} {getStreakEmoji(winStreak)}
              </div>
            </div>
          </div>
        </div>

        {/* 3. CAREER MODE SELECTOR */}
        <div className="p-4 border-b border-mh-border">
          <div className="text-mh-text-dim text-xs font-bold mb-3 tracking-wider">
            📈 CAREER MODE
          </div>
          <div className="space-y-2">
            {/* 30 Days - Free */}
            <button
              onClick={() => handleDurationChange(30)}
              className={`w-full p-3 rounded border text-left cursor-pointer ${
                selectedDuration === 30
                  ? 'border-mh-accent-blue bg-mh-accent-blue/10'
                  : 'border-mh-border bg-[#0a1015] hover:border-mh-text-dim'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-bold ${selectedDuration === 30 ? 'text-mh-accent-blue' : 'text-mh-text-bright'}`}>
                    30 DAYS — STANDARD
                  </div>
                  <div className="text-mh-text-dim text-xs mt-0.5">
                    The classic Wall Street sprint
                  </div>
                </div>
                {selectedDuration === 30 && (
                  <div className="text-mh-accent-blue text-lg">●</div>
                )}
              </div>
            </button>

            {/* 45 Days - Premium */}
            <button
              onClick={() => {
                if (isPro) handleDurationChange(45)
              }}
              className={`w-full p-3 rounded border text-left ${
                isPro
                  ? selectedDuration === 45
                    ? 'border-mh-accent-blue bg-mh-accent-blue/10 cursor-pointer'
                    : 'border-mh-border bg-[#0a1015] hover:border-mh-text-dim cursor-pointer'
                  : 'border-mh-border bg-[#0a1015] opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-bold ${selectedDuration === 45 && isPro ? 'text-mh-accent-blue' : 'text-mh-text-bright'}`}>
                    45 DAYS — EXTENDED
                  </div>
                  <div className="text-mh-text-dim text-xs mt-0.5">
                    More time to build an empire
                  </div>
                </div>
                {!isPro ? (
                  <div className="text-yellow-500 text-xs font-bold px-2 py-1 bg-yellow-500/10 rounded">🔒 PRO</div>
                ) : selectedDuration === 45 ? (
                  <div className="text-mh-accent-blue text-lg">●</div>
                ) : null}
              </div>
            </button>

            {/* 60 Days - Premium */}
            <button
              onClick={() => {
                if (isPro) handleDurationChange(60)
              }}
              className={`w-full p-3 rounded border text-left ${
                isPro
                  ? selectedDuration === 60
                    ? 'border-mh-accent-blue bg-mh-accent-blue/10 cursor-pointer'
                    : 'border-mh-border bg-[#0a1015] hover:border-mh-text-dim cursor-pointer'
                  : 'border-mh-border bg-[#0a1015] opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-bold ${selectedDuration === 60 && isPro ? 'text-mh-accent-blue' : 'text-mh-text-bright'}`}>
                    60 DAYS — MARATHON
                  </div>
                  <div className="text-mh-text-dim text-xs mt-0.5">
                    True market mastery
                  </div>
                </div>
                {!isPro ? (
                  <div className="text-yellow-500 text-xs font-bold px-2 py-1 bg-yellow-500/10 rounded">🔒 PRO</div>
                ) : selectedDuration === 60 ? (
                  <div className="text-mh-accent-blue text-lg">●</div>
                ) : null}
              </div>
            </button>
          </div>
        </div>

        {/* 4. MARGIN TRADING (PRO Features) */}
        <div className="p-4 border-b border-mh-border">
          <div className="text-mh-text-dim text-xs font-bold mb-3 tracking-wider">
            📊 MARGIN TRADING
          </div>
          <div className="space-y-2">
            {/* Short Stocks - PRO */}
            <div className={`w-full p-3 rounded border border-mh-border bg-[#0a1015] ${!isPro ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-mh-text-bright">
                    SHORT STOCKS
                  </div>
                  <div className="text-mh-text-dim text-xs mt-0.5">
                    Profit when prices fall
                  </div>
                </div>
                <div className="text-yellow-500 text-xs font-bold px-2 py-1 bg-yellow-500/10 rounded">{isPro ? 'PRO' : '🔒 PRO'}</div>
              </div>
            </div>

            {/* Leverage Trading - PRO */}
            <div className={`w-full p-3 rounded border border-mh-border bg-[#0a1015] ${!isPro ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-mh-text-bright">
                    2X, 5X, 10X LEVERAGE
                  </div>
                  <div className="text-mh-text-dim text-xs mt-0.5">
                    Amplify your gains (and losses)
                  </div>
                </div>
                <div className="text-yellow-500 text-xs font-bold px-2 py-1 bg-yellow-500/10 rounded">{isPro ? 'PRO' : '🔒 PRO'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. HISTORICAL GAMES (PRO - Collapsible) */}
        <div className="border-b border-mh-border">
          <button
            onClick={() => setHistoricalExpanded(!historicalExpanded)}
            className="w-full p-4 flex items-center justify-between cursor-pointer bg-transparent border-none text-left"
          >
            <div className="flex items-center gap-2">
              <div className="text-mh-text-dim text-xs font-bold tracking-wider">
                📜 HISTORICAL GAMES
              </div>
              <div
                className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-mh-bg bg-mh-profit-green rounded-sm"
                style={{
                  boxShadow: '0 0 8px rgba(0, 255, 136, 0.5)',
                }}
              >
                COMING SOON
              </div>
            </div>
            <div className="text-mh-text-dim text-sm">
              {historicalExpanded ? '▲' : '▼'}
            </div>
          </button>
          {historicalExpanded && (
            <div className="px-4 pb-4 space-y-2">
              {/* The Roaring 20s */}
              <div className={`w-full p-3 rounded border border-mh-border bg-[#0a1015] ${!isPro ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-mh-text-bright text-sm">
                      THE ROARING 20s & &apos;29 CRASH
                    </div>
                    <div className="text-mh-text-dim text-xs mt-1">
                      Ride the first retail stock boom (RCA, Steel, Rails) and exit before Black Tuesday
                    </div>
                  </div>
                  <div className="text-yellow-500 text-xs font-bold px-2 py-1 bg-yellow-500/10 rounded shrink-0 ml-2">{isPro ? 'PRO' : '🔒 PRO'}</div>
                </div>
              </div>

              {/* WWII */}
              <div className={`w-full p-3 rounded border border-mh-border bg-[#0a1015] ${!isPro ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-mh-text-bright text-sm">
                      ARSENAL OF DEMOCRACY (WWII)
                    </div>
                    <div className="text-mh-text-dim text-xs mt-1">
                      Command economy trading with price caps and rationing
                    </div>
                  </div>
                  <div className="text-yellow-500 text-xs font-bold px-2 py-1 bg-yellow-500/10 rounded shrink-0 ml-2">{isPro ? 'PRO' : '🔒 PRO'}</div>
                </div>
              </div>

              {/* 80s */}
              <div className={`w-full p-3 rounded border border-mh-border bg-[#0a1015] ${!isPro ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-mh-text-bright text-sm">
                      &quot;GREED IS GOOD&quot; 80s
                    </div>
                    <div className="text-mh-text-dim text-xs mt-1">
                      Hostile takeovers and junk bonds before Black Monday
                    </div>
                  </div>
                  <div className="text-yellow-500 text-xs font-bold px-2 py-1 bg-yellow-500/10 rounded shrink-0 ml-2">{isPro ? 'PRO' : '🔒 PRO'}</div>
                </div>
              </div>

              {/* Dot-Com */}
              <div className={`w-full p-3 rounded border border-mh-border bg-[#0a1015] ${!isPro ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-mh-text-bright text-sm">
                      DOT-COM INSANITY (1995–2000)
                    </div>
                    <div className="text-mh-text-dim text-xs mt-1">
                      Speculate on zero-revenue tech before the NASDAQ collapse
                    </div>
                  </div>
                  <div className="text-yellow-500 text-xs font-bold px-2 py-1 bg-yellow-500/10 rounded shrink-0 ml-2">{isPro ? 'PRO' : '🔒 PRO'}</div>
                </div>
              </div>

              {/* 2008 */}
              <div className={`w-full p-3 rounded border border-mh-border bg-[#0a1015] ${!isPro ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-mh-text-bright text-sm">
                      GREAT FINANCIAL CRISIS (2007–2009)
                    </div>
                    <div className="text-mh-text-dim text-xs mt-1">
                      Short seller&apos;s dream — bet against Lehman, Bear Stearns
                    </div>
                  </div>
                  <div className="text-yellow-500 text-xs font-bold px-2 py-1 bg-yellow-500/10 rounded shrink-0 ml-2">{isPro ? 'PRO' : '🔒 PRO'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. ACHIEVEMENTS (Collapsible) */}
        <div className="border-b border-mh-border">
          <button
            onClick={() => setAchievementsExpanded(!achievementsExpanded)}
            className="w-full p-4 flex items-center justify-between cursor-pointer bg-transparent border-none text-left"
          >
            <div className="text-mh-text-dim text-xs font-bold tracking-wider">
              🏆 ACHIEVEMENTS ({unlockedCount}/{totalCount})
            </div>
            <div className="text-mh-text-dim text-sm">
              {achievementsExpanded ? '▲' : '▼'}
            </div>
          </button>
          {achievementsExpanded && (
            <div className="px-4 pb-4">
              {/* Achievement Grid */}
              <div className="flex flex-wrap gap-2 mb-3">
                {ACHIEVEMENTS.map(achievement => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`
                        w-8 h-8 flex items-center justify-center text-lg rounded
                        ${isUnlocked
                          ? 'bg-[#1a2a3a] cursor-help'
                          : 'bg-[#0a0d10] opacity-30 grayscale'
                        }
                      `}
                      title={isUnlocked ? `${achievement.name}: ${achievement.description}` : '???'}
                    >
                      {achievement.emoji}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. GAME OPTIONS (Collapsible) */}
        <div className="border-b border-mh-border">
          <button
            onClick={() => setOptionsExpanded(!optionsExpanded)}
            className="w-full p-4 flex items-center justify-between cursor-pointer bg-transparent border-none text-left"
          >
            <div className="text-mh-text-dim text-xs font-bold tracking-wider">
              🎨 CHANGE THEME
            </div>
            <div className="text-mh-text-dim text-sm">
              {optionsExpanded ? '▲' : '▼'}
            </div>
          </button>
          {optionsExpanded && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleThemeChange('retro')}
                  className={`p-2 rounded border text-center cursor-pointer ${
                    selectedTheme === 'retro'
                      ? 'border-mh-accent-blue bg-mh-accent-blue/10'
                      : 'border-mh-border bg-[#0a1015] hover:border-mh-text-dim'
                  }`}
                >
                  <div className={`font-bold text-[11px] ${selectedTheme === 'retro' ? 'text-mh-accent-blue' : 'text-mh-text-bright'}`}>
                    RETRO
                  </div>
                  <div className="text-mh-text-dim text-[9px] mt-0.5">CRT look</div>
                </button>
                <button
                  onClick={() => handleThemeChange('modern3')}
                  className={`p-2 rounded border text-center cursor-pointer ${
                    selectedTheme === 'modern3'
                      ? 'border-mh-accent-blue bg-mh-accent-blue/10'
                      : 'border-mh-border bg-[#0a1015] hover:border-mh-text-dim'
                  }`}
                >
                  <div className={`font-bold text-[11px] ${selectedTheme === 'modern3' ? 'text-mh-accent-blue' : 'text-mh-text-bright'}`}>
                    MODERN
                  </div>
                  <div className="text-mh-text-dim text-[9px] mt-0.5">Cyan glow</div>
                </button>
                <button
                  onClick={() => handleThemeChange('retro2')}
                  className={`p-2 rounded border text-center cursor-pointer ${
                    selectedTheme === 'retro2'
                      ? 'border-mh-accent-blue bg-mh-accent-blue/10'
                      : 'border-mh-border bg-[#0a1015] hover:border-mh-text-dim'
                  }`}
                >
                  <div className={`font-bold text-[11px] ${selectedTheme === 'retro2' ? 'text-mh-accent-blue' : 'text-mh-text-bright'}`}>
                    CRT
                  </div>
                  <div className="text-mh-text-dim text-[9px] mt-0.5">Green glow</div>
                </button>
                <button
                  onClick={() => handleThemeChange('bloomberg')}
                  className={`p-2 rounded border text-center cursor-pointer ${
                    selectedTheme === 'bloomberg'
                      ? 'border-[#ff8c00] bg-[#ff8c00]/10'
                      : 'border-mh-border bg-[#0a1015] hover:border-mh-text-dim'
                  }`}
                >
                  <div className={`font-bold text-[11px] ${selectedTheme === 'bloomberg' ? 'text-[#ff8c00]' : 'text-mh-text-bright'}`}>
                    BLOOMBERG
                  </div>
                  <div className="text-mh-text-dim text-[9px] mt-0.5">Terminal</div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 7. ACCOUNT */}
        <div className="p-4 border-b border-mh-border">
          <div className="text-mh-text-dim text-xs font-bold mb-3 tracking-wider">
            👤 ACCOUNT
          </div>
          {authLoading ? (
            <div className="text-mh-text-dim text-sm">Loading...</div>
          ) : user ? (
            <div className="space-y-3">
              <div className="bg-[#0a1015] border border-mh-border rounded p-3">
                <div className="text-mh-text-dim text-xs mb-1">SIGNED IN AS</div>
                <div className="text-mh-text-bright text-sm truncate">
                  {user.email}
                </div>
                {profile && (
                  <div className="text-mh-text-dim text-xs mt-2">
                    Tier: <span className={profile.tier === 'pro' ? 'text-yellow-500 font-bold' : 'text-mh-text-bright'}>{profile.tier.toUpperCase()}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => signOut()}
                className="w-full py-2 px-3 bg-transparent border border-mh-border rounded text-mh-text-dim hover:text-mh-text-bright hover:border-mh-text-dim cursor-pointer text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-mh-text-dim text-xs">
                Sign in to sync your stats across devices and unlock Pro features.
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-2 px-3 bg-mh-accent-blue hover:bg-mh-accent-blue/80 rounded text-white font-semibold cursor-pointer text-sm"
              >
                Sign In / Sign Up
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Slide-in animation */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
