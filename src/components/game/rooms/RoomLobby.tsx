'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRoom, type RoomPlayer } from '@/hooks/useRoom'
import { useRoomChannel, type RoomPresenceState, type RoomSettings } from '@/hooks/useRoomChannel'
import { useGame } from '@/hooks/useGame'
import type { GameDuration } from '@/lib/game/types'
import { useAuth } from '@/contexts/AuthContext'

const DURATION_OPTIONS = [30, 45, 60] as const
const CASH_OPTIONS = [25_000, 50_000, 1_00_000, 2_00_000] as const
const DEBT_OPTIONS = [0, 25_000, 50_000, 1_00_000] as const

function formatCurrency(value: number): string {
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

export interface RoomGameConfig {
  duration: number
  startingCash: number
  startingDebt: number
}

export function RoomLobby() {
  const { user } = useAuth()
  const roomId = useRoom(state => state.roomId)
  const roomCode = useRoom(state => state.roomCode)
  const isHost = useRoom(state => state.isHost)
  const roomStatus = useRoom(state => state.roomStatus)
  const players = useRoom(state => state.players)
  const setPlayers = useRoom(state => state.setPlayers)
  const setRoomStatus = useRoom(state => state.setRoomStatus)
  const startRoomGame: () => Promise<boolean> = useRoom(state => state.startGame)
  const leaveRoom = useRoom(state => state.leaveRoom)
  const toggleReady: (isReady: boolean) => Promise<void> = useRoom(state => state.toggleReady)

  const startGame: (duration?: GameDuration, options?: { cash?: number; debt?: number }) => void = useGame(state => state.startGame)

  const username = useGame(state => state.username)
  const [selectedDuration, setSelectedDuration] = useState<number>(30)
  const [selectedCash, setSelectedCash] = useState<number>(50_000)
  const [selectedDebt, setSelectedDebt] = useState<number>(50_000)
  const [starting, setStarting] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const onPresenceSyncRef = useRef<(p: Record<string, RoomPresenceState>) => void>()
  onPresenceSyncRef.current = (presencePlayers: Record<string, RoomPresenceState>) => {
    const playerList: RoomPlayer[] = Object.values(presencePlayers).map(p => ({
      userId: p.userId,
      username: p.username,
      isHost: false,
      isReady: p.isReady,
      currentDay: p.currentDay,
      currentNetWorth: p.currentNetWorth,
      status: p.status,
    }))
    setPlayers(playerList)
  }

  const onGameStartRef = useRef<(broadcastData: string) => void>()
  onGameStartRef.current = (broadcastData: string) => {
    try {
      const config: RoomGameConfig = JSON.parse(broadcastData)
      setRoomStatus('playing')
      startGame(
        config.duration as 30 | 45 | 60,
        { cash: config.startingCash, debt: config.startingDebt },
      )
    } catch {
      // Malformed broadcast payload — ignore
    }
  }

  const onSettingsUpdateRef = useRef<(settings: RoomSettings) => void>()
  onSettingsUpdateRef.current = (settings: RoomSettings) => {
    if (!isHost) {
      setSelectedDuration(settings.duration)
      setSelectedCash(settings.startingCash)
      setSelectedDebt(settings.startingDebt)
    }
  }

  const handlePresenceSync = useCallback((p: Record<string, RoomPresenceState>) => {
    onPresenceSyncRef.current?.(p)
  }, [])

  const handleGameStart = useCallback((broadcastData: string) => {
    onGameStartRef.current?.(broadcastData)
  }, [])

  const handleSettingsUpdate = useCallback((settings: RoomSettings) => {
    onSettingsUpdateRef.current?.(settings)
  }, [])

  const { track, broadcastGameStart, broadcastSettings } = useRoomChannel({
    roomId,
    userId: user?.id ?? null,
    username,
    isHost,
    onPresenceSync: handlePresenceSync,
    onGameStart: handleGameStart,
    onSettingsUpdate: handleSettingsUpdate,
  })

  useEffect(() => {
    if (!isHost) return
    broadcastSettings({
      duration: selectedDuration,
      startingCash: selectedCash,
      startingDebt: selectedDebt,
    })
  }, [isHost, selectedDuration, selectedCash, selectedDebt, broadcastSettings])

  const handleToggleReady = async () => {
    const currentPlayer = players.find(p => p.userId === user?.id)
    const newReady = !currentPlayer?.isReady
    await toggleReady(newReady)
    track({ isReady: newReady })
  }

  const handleStartGame = async () => {
    setStarting(true)
    const config: RoomGameConfig = {
      duration: selectedDuration,
      startingCash: selectedCash,
      startingDebt: selectedDebt,
    }
    const success = await startRoomGame()
    if (success) {
      broadcastGameStart(JSON.stringify(config))
      startGame(
        config.duration as 30 | 45 | 60,
        { cash: config.startingCash, debt: config.startingDebt },
      )
    }
    setStarting(false)
  }

  const handleCopyLink = () => {
    if (roomCode) {
      const url = `${window.location.origin}?room=${roomCode}`
      navigator.clipboard.writeText(url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2_000)
    }
  }

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2_000)
    }
  }

  // Fallback polling for missed game_start broadcast
  useEffect(() => {
    if (roomStatus !== 'lobby' || !roomId) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/rooms/${roomId}`)
        if (!res.ok) return
        const data = await res.json()
        if (data.room?.status === 'playing') {
          // Room started but we missed the broadcast — start with default config
          const config: RoomGameConfig = {
            duration: selectedDuration,
            startingCash: selectedCash,
            startingDebt: selectedDebt,
          }
          onGameStartRef.current?.(JSON.stringify(config))
        }
      } catch {
        // Ignore polling errors
      }
    }, 8_000)

    return () => clearInterval(interval)
  }, [roomStatus, roomId, selectedDuration, selectedCash, selectedDebt])

  useEffect(() => {
    if (user?.id && username) {
      track({ userId: user.id, username, isReady: isHost, status: 'joined' })
    }
  }, [user?.id, username, isHost, track])

  if (roomStatus !== 'lobby') return null

  const allReady = players.length >= 1 && players.every(p => p.isReady)
  const canStart = isHost && allReady && !starting

  return (
    <div className="h-full bg-mh-bg overflow-y-auto">
      <div className="flex flex-col items-center p-4 pb-8 text-center min-h-full">
        {/* Header */}
        <div className="text-mh-text-dim text-xs font-mono tracking-widest mb-2 mt-4">ROOM CODE</div>
        <div className="text-mh-accent-blue text-4xl font-mono tracking-[0.5em] mb-3">
          {roomCode}
        </div>
        <div className="flex gap-2 mb-2">
          <button
            onClick={handleCopyLink}
            className="border border-mh-accent-blue text-mh-accent-blue px-4 py-2 text-xs font-mono cursor-pointer hover:bg-mh-accent-blue/10 transition-colors rounded"
          >
            {copiedLink ? 'COPIED!' : 'COPY LINK'}
          </button>
          <button
            onClick={handleCopyCode}
            className="border border-mh-border text-mh-text-dim px-4 py-2 text-xs font-mono cursor-pointer hover:border-mh-text-dim hover:text-mh-text-main transition-colors rounded"
          >
            {copiedCode ? 'COPIED!' : 'COPY CODE'}
          </button>
        </div>
        <div className="text-mh-text-dim text-xs mb-8">
          Share this link with friends to join
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

        {/* Game Settings — host edits, non-host sees read-only */}
        <div className="w-full max-w-[320px] mb-6">
          <div className="text-mh-text-dim text-sm mb-3 font-mono">GAME SETTINGS</div>
          <div className="border border-mh-border rounded-lg p-4 space-y-4">
            {/* Duration */}
            <div>
              <div className="text-mh-text-dim text-xs font-mono mb-2">DURATION</div>
              <div className="flex gap-2">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={isHost ? () => setSelectedDuration(d) : undefined}
                    className={`flex-1 py-2 text-xs font-mono border rounded transition-colors ${
                      isHost ? 'cursor-pointer' : 'cursor-default'
                    } ${
                      selectedDuration === d
                        ? 'border-mh-accent-blue text-mh-accent-blue bg-mh-accent-blue/10'
                        : 'border-mh-border text-mh-text-dim' + (isHost ? ' hover:border-mh-text-dim' : '')
                    }`}
                  >
                    {d} days
                  </button>
                ))}
              </div>
            </div>

            {/* Starting Cash */}
            <div>
              <div className="text-mh-text-dim text-xs font-mono mb-2">STARTING CASH</div>
              <div className="flex gap-2">
                {CASH_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={isHost ? () => setSelectedCash(c) : undefined}
                    className={`flex-1 py-2 text-xs font-mono border rounded transition-colors ${
                      isHost ? 'cursor-pointer' : 'cursor-default'
                    } ${
                      selectedCash === c
                        ? 'border-mh-profit-green text-mh-profit-green bg-mh-profit-green/10'
                        : 'border-mh-border text-mh-text-dim' + (isHost ? ' hover:border-mh-text-dim' : '')
                    }`}
                  >
                    {formatCurrency(c)}
                  </button>
                ))}
              </div>
            </div>

            {/* Starting Debt */}
            <div>
              <div className="text-mh-text-dim text-xs font-mono mb-2">STARTING DEBT</div>
              <div className="flex gap-2">
                {DEBT_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={isHost ? () => setSelectedDebt(d) : undefined}
                    className={`flex-1 py-2 text-xs font-mono border rounded transition-colors ${
                      isHost ? 'cursor-pointer' : 'cursor-default'
                    } ${
                      selectedDebt === d
                        ? 'border-mh-loss-red text-mh-loss-red bg-mh-loss-red/10'
                        : 'border-mh-border text-mh-text-dim' + (isHost ? ' hover:border-mh-text-dim' : '')
                    }`}
                  >
                    {d === 0 ? '$0' : formatCurrency(d)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

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
