'use client'

import { useEffect, useRef } from 'react'
import { useGame } from '@/hooks/useGame'
import { useRoom } from '@/hooks/useRoom'
import { Scanlines } from './ui/Scanlines'
import { TitleScreen } from './screens/TitleScreen'
import { IntroScreen } from './screens/IntroScreen'
import { GameScreen } from './screens/GameScreen'
import { EndGameCoordinator } from './screens/EndGameCoordinator'
import { SettingsPanel } from './ui/SettingsPanel'
import { AchievementToast } from './ui/AchievementToast'
import { DailyLimitModal } from './ui/DailyLimitModal'
import { AnonymousLimitModal } from './ui/AnonymousLimitModal'
import { RoomLobby } from './rooms/RoomLobby'
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
  const roomStatus = useRoom(state => state.roomStatus)
  const joinRoom = useRoom(state => state.joinRoom)
  const roomJoinAttempted = useRef(false)

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

  // Detect ?room=CODE URL param and auto-join the room
  useEffect(() => {
    if (roomJoinAttempted.current) return
    const params = new URLSearchParams(window.location.search)
    const roomCode = params.get('room')
    if (!roomCode) return
    roomJoinAttempted.current = true

    joinRoom(roomCode.toUpperCase())
  }, [joinRoom])

  return (
    <div className="h-full w-full flex flex-col">
      <Scanlines />
      {roomStatus === 'lobby' && <RoomLobby />}
      {roomStatus !== 'lobby' && screen === 'title' && <TitleScreen initialLeaderboards={initialLeaderboards} />}
      {roomStatus !== 'lobby' && screen === 'intro' && <IntroScreen />}
      {roomStatus !== 'lobby' && screen === 'game' && <GameScreen />}
      {roomStatus !== 'lobby' && (screen === 'gameover' || screen === 'win') && <EndGameCoordinator />}

      {/* Global overlays */}
      <SettingsPanel />
      <AchievementToast />
      <DailyLimitModal />
      <AnonymousLimitModal />
    </div>
  )
}
