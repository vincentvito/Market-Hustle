'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRoom, type RoomPlayer } from '@/hooks/useRoom'
import { useRoomChannel, type RoomPresenceState } from '@/hooks/useRoomChannel'
import { useGame } from '@/hooks/useGame'
import { useAuth } from '@/contexts/AuthContext'
import { SCRIPTED_GAME_1 } from '@/lib/game/scriptedGames/script1_yellowstone'
import { SCRIPTED_GAME_2 } from '@/lib/game/scriptedGames/script2_worldWar'
import { SCRIPTED_GAME_3 } from '@/lib/game/scriptedGames/script3_rollercoaster'
import type { ScriptedGameDefinition } from '@/lib/game/scriptedGames/types'

const SCENARIOS: { id: string; title: string; description: string; data: ScriptedGameDefinition }[] = [
  { id: 'yellowstone', title: 'Yellowstone', description: 'Bull run into volcanic apocalypse', data: SCRIPTED_GAME_1 },
  { id: 'world_war', title: 'World War III', description: 'Geopolitical escalation & safe havens', data: SCRIPTED_GAME_2 },
  { id: 'rollercoaster', title: 'The Rollercoaster', description: 'Sector rotation chaos & whiplash', data: SCRIPTED_GAME_3 },
]

export function RoomLobby() {
  const { user } = useAuth()
  const roomId = useRoom(state => state.roomId)
  const roomCode = useRoom(state => state.roomCode)
  const isHost = useRoom(state => state.isHost)
  const roomStatus = useRoom(state => state.roomStatus)
  const players = useRoom(state => state.players)
  const setPlayers = useRoom(state => state.setPlayers)
  const setRoomStatus = useRoom(state => state.setRoomStatus)
  const setScenario = useRoom(state => state.setScenario)
  const startRoomGame = useRoom(state => state.startGame)
  const leaveRoom = useRoom(state => state.leaveRoom)
  const toggleReady = useRoom(state => state.toggleReady)

  const setPreloadedScenario = useGame(state => state.setPreloadedScenario)
  const startGame = useGame(state => state.startGame)

  const username = useGame(state => state.username)
  const [selectedScenario, setSelectedScenario] = useState(0)
  const [starting, setStarting] = useState(false)
  const [copied, setCopied] = useState(false)

  // Stable callback refs to avoid re-subscribing channel
  const onPresenceSyncRef = useRef<(p: Record<string, RoomPresenceState>) => void>()
  onPresenceSyncRef.current = (presencePlayers: Record<string, RoomPresenceState>) => {
    const playerList: RoomPlayer[] = Object.values(presencePlayers).map(p => ({
      userId: p.userId,
      username: p.username,
      isHost: false, // We'll set this from room data
      isReady: p.isReady,
      currentDay: p.currentDay,
      currentNetWorth: p.currentNetWorth,
      status: p.status,
    }))
    setPlayers(playerList)
  }

  const onGameStartRef = useRef<(scenarioData: string) => void>()
  onGameStartRef.current = (scenarioData: string) => {
    try {
      const scenario = JSON.parse(scenarioData) as ScriptedGameDefinition
      setScenario(scenario)
      setRoomStatus('playing')
      setPreloadedScenario(scenario)
      startGame()
    } catch (error) {
      console.error('Failed to parse scenario data:', error)
    }
  }

  const handlePresenceSync = useCallback((p: Record<string, RoomPresenceState>) => {
    onPresenceSyncRef.current?.(p)
  }, [])

  const handleGameStart = useCallback((scenarioData: string) => {
    onGameStartRef.current?.(scenarioData)
  }, [])

  const { track, broadcastGameStart } = useRoomChannel({
    roomId,
    userId: user?.id ?? null,
    username,
    onPresenceSync: handlePresenceSync,
    onGameStart: handleGameStart,
  })

  // Sync ready state via presence when toggling
  const handleToggleReady = async () => {
    await toggleReady()
    const currentPlayer = players.find(p => p.userId === user?.id)
    track({ isReady: !currentPlayer?.isReady })
  }

  const handleStartGame = async () => {
    setStarting(true)
    const scenario = SCENARIOS[selectedScenario].data
    const success = await startRoomGame(scenario)
    if (success) {
      // Broadcast to all players
      broadcastGameStart(JSON.stringify(scenario))
      // Host also starts their own game
      setPreloadedScenario(scenario)
      startGame()
    }
    setStarting(false)
  }

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Track initial presence on mount
  useEffect(() => {
    if (user?.id && username) {
      track({ userId: user.id, username, isReady: isHost, status: 'joined' })
    }
  }, [user?.id, username, isHost, track])

  if (roomStatus !== 'lobby') return null

  const allReady = players.length >= 2 && players.every(p => p.isReady)
  const canStart = isHost && allReady && !starting

  return (
    <div className="h-full bg-mh-bg overflow-y-auto">
      <div className="flex flex-col items-center p-4 pb-8 text-center min-h-full">
        {/* Header */}
        <div className="text-mh-text-dim text-xs font-mono tracking-widest mb-2 mt-4">ROOM CODE</div>
        <button
          onClick={handleCopyCode}
          className="text-mh-accent-blue text-4xl font-mono tracking-[0.5em] mb-2 cursor-pointer bg-transparent border-none hover:text-mh-text-bright transition-colors"
          title="Click to copy"
        >
          {roomCode}
        </button>
        <div className="text-mh-text-dim text-xs mb-8">
          {copied ? 'Copied!' : 'Click to copy — share with friends'}
        </div>

        {/* Player List */}
        <div className="w-full max-w-[320px] mb-6">
          <div className="text-mh-text-dim text-sm mb-3 font-mono">
            PLAYERS ({players.length}/8)
          </div>
          <div className="border border-mh-border rounded-lg overflow-hidden">
            {players.length === 0 ? (
              <div className="px-4 py-3 text-mh-text-dim text-sm">Waiting for players...</div>
            ) : (
              players.map((player) => (
                <div
                  key={player.userId}
                  className="flex items-center px-4 py-3 border-b border-mh-border last:border-b-0"
                >
                  <span className="flex-1 text-mh-text-main text-sm text-left truncate">
                    {player.username}
                    {player.userId === user?.id && (
                      <span className="text-mh-text-dim ml-1">(you)</span>
                    )}
                  </span>
                  {player.isReady ? (
                    <span className="text-mh-profit-green text-xs font-mono">READY</span>
                  ) : (
                    <span className="text-mh-text-dim text-xs font-mono">WAITING</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Scenario Selection (Host only) */}
        {isHost && (
          <div className="w-full max-w-[320px] mb-6">
            <div className="text-mh-text-dim text-sm mb-3 font-mono">SCENARIO</div>
            <div className="space-y-2">
              {SCENARIOS.map((scenario, idx) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(idx)}
                  className={`w-full text-left px-4 py-3 border rounded-lg transition-colors cursor-pointer ${
                    selectedScenario === idx
                      ? 'border-mh-accent-blue bg-mh-accent-blue/10'
                      : 'border-mh-border hover:border-mh-text-dim'
                  }`}
                >
                  <div className={`text-sm font-mono ${selectedScenario === idx ? 'text-mh-accent-blue' : 'text-mh-text-main'}`}>
                    {scenario.title}
                  </div>
                  <div className="text-xs text-mh-text-dim mt-1">{scenario.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full max-w-[320px] space-y-3">
          {!isHost && (
            <button
              onClick={handleToggleReady}
              className={`w-full py-3 font-mono text-sm border-2 rounded transition-colors cursor-pointer ${
                players.find(p => p.userId === user?.id)?.isReady
                  ? 'border-mh-profit-green text-mh-profit-green bg-mh-profit-green/10'
                  : 'border-mh-accent-blue text-mh-accent-blue hover:bg-mh-accent-blue/10'
              }`}
            >
              {players.find(p => p.userId === user?.id)?.isReady ? 'READY ✓' : 'READY UP'}
            </button>
          )}

          {isHost && (
            <button
              onClick={handleStartGame}
              disabled={!canStart}
              className={`w-full py-3 font-mono text-sm border-2 rounded transition-colors ${
                canStart
                  ? 'border-mh-profit-green text-mh-profit-green bg-mh-profit-green/10 cursor-pointer hover:bg-mh-profit-green/20'
                  : 'border-mh-border text-mh-text-dim cursor-not-allowed opacity-50'
              }`}
            >
              {starting ? 'STARTING...' : !allReady ? 'WAITING FOR PLAYERS...' : 'START GAME'}
            </button>
          )}

          <button
            onClick={leaveRoom}
            className="w-full py-2 border border-mh-border text-mh-text-dim font-mono text-xs cursor-pointer hover:border-mh-loss-red hover:text-mh-loss-red transition-colors rounded"
          >
            LEAVE ROOM
          </button>
        </div>
      </div>
    </div>
  )
}
