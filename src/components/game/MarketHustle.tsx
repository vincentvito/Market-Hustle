'use client'

import { useEffect, useRef } from 'react'
import { useGame } from '@/hooks/useGame'
import { Scanlines } from './ui/Scanlines'
import { TitleScreen } from './screens/TitleScreen'
import { IntroScreen } from './screens/IntroScreen'
import { GameScreen } from './screens/GameScreen'
import { EndGameCoordinator } from './screens/EndGameCoordinator'
import { SettingsPanel } from './ui/SettingsPanel'
import { AchievementToast } from './ui/AchievementToast'
import { DailyLimitModal } from './ui/DailyLimitModal'
import { AnonymousLimitModal } from './ui/AnonymousLimitModal'
import type { LeaderboardEntry } from '@/lib/game/leaderboard'

interface MarketHustleProps {
  initialLeaderboards?: {
    daily: LeaderboardEntry[]
    allTime: LeaderboardEntry[]
    worst: LeaderboardEntry[]
  }
}

export function MarketHustle({ initialLeaderboards }: MarketHustleProps) {
  const screen = useGame(state => state.screen)
  const setPreloadedScenario = useGame(state => state.setPreloadedScenario)
  const startGame = useGame(state => state.startGame)
  const scenarioLoaded = useRef(false)

  // Detect ?scenario=<id> URL param and auto-load + start the scenario
  useEffect(() => {
    if (scenarioLoaded.current) return
    const params = new URLSearchParams(window.location.search)
    const scenarioId = params.get('scenario')
    if (!scenarioId) return
    scenarioLoaded.current = true

    fetch(`/api/scenarios/${scenarioId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setPreloadedScenario(data)
          startGame()
        }
      })
      .catch(() => { /* scenario load failed, fall through to normal game */ })
  }, [setPreloadedScenario, startGame])

  return (
    <div className="h-full w-full flex flex-col">
      <Scanlines />
      {screen === 'title' && <TitleScreen initialLeaderboards={initialLeaderboards} />}
      {screen === 'intro' && <IntroScreen />}
      {screen === 'game' && <GameScreen />}
      {(screen === 'gameover' || screen === 'win') && <EndGameCoordinator />}

      {/* Global overlays */}
      <SettingsPanel />
      <AchievementToast />
      <DailyLimitModal />
      <AnonymousLimitModal />
    </div>
  )
}
