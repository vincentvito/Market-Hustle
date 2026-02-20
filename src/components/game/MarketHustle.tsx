'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useGame } from '@/hooks/useGame'
import { useRoom } from '@/hooks/useRoom'
import { Scanlines } from './ui/Scanlines'
import { TitleScreen } from './screens/TitleScreen'
import type { LeaderboardEntry } from '@/lib/game/leaderboard'

// Lazy-load heavy screens not needed on initial page load
const IntroScreen = dynamic(() => import('./screens/IntroScreen').then(m => ({ default: m.IntroScreen })))
const GameScreen = dynamic(() => import('./screens/GameScreen').then(m => ({ default: m.GameScreen })))
const EndGameCoordinator = dynamic(() => import('./screens/EndGameCoordinator').then(m => ({ default: m.EndGameCoordinator })))
const SettingsPanel = dynamic(() => import('./ui/SettingsPanel').then(m => ({ default: m.SettingsPanel })))
const AchievementToast = dynamic(() => import('./ui/AchievementToast').then(m => ({ default: m.AchievementToast })))
const DailyLimitModal = dynamic(() => import('./ui/DailyLimitModal').then(m => ({ default: m.DailyLimitModal })))
const AnonymousLimitModal = dynamic(() => import('./ui/AnonymousLimitModal').then(m => ({ default: m.AnonymousLimitModal })))
const RoomLobby = dynamic(() => import('./rooms/RoomLobby').then(m => ({ default: m.RoomLobby })))

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
  const showRoomHub = useRoom(state => state.showRoomHub)

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
      {showRoomHub && <RoomLobby />}
      {!showRoomHub && screen === 'title' && <TitleScreen initialLeaderboards={initialLeaderboards} />}
      {!showRoomHub && screen === 'intro' && <IntroScreen />}
      {!showRoomHub && screen === 'game' && <GameScreen />}
      {!showRoomHub && (screen === 'gameover' || screen === 'win') && <EndGameCoordinator />}

      {/* Global overlays */}
      <SettingsPanel />
      <AchievementToast />
      <DailyLimitModal />
      <AnonymousLimitModal />
    </div>
  )
}
