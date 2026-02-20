'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRoom, type RoomPlayer, type RoomResult } from '@/hooks/useRoom'
import { useRoomChannel, type RoomPresenceState } from '@/hooks/useRoomChannel'
import { useGame } from '@/hooks/useGame'
import { useAuth } from '@/contexts/AuthContext'

const DURATION_OPTIONS = [30, 45, 60] as const
const CASH_OPTIONS = [25_000, 50_000, 1_00_000, 2_00_000] as const
const DEBT_OPTIONS = [0, 25_000, 50_000, 1_00_000] as const

function formatCurrency(value: number): string {
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

function formatMoney(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toLocaleString()}`
}

export function RoomLobby() {
  const { user } = useAuth()
  const roomId = useRoom(state => state.roomId)
  const roomCode = useRoom(state => state.roomCode)
  const isHost = useRoom(state => state.isHost)
  const showRoomHub = useRoom(state => state.showRoomHub)
  const players = useRoom(state => state.players)
  const results = useRoom(state => state.results)
  const roomSettings = useRoom(state => state.roomSettings)
  const setPlayers = useRoom(state => state.setPlayers)
  const startRun = useRoom(state => state.startRun)
  const leaveRoom = useRoom(state => state.leaveRoom)
  const updateSettings = useRoom(state => state.updateSettings)
  const fetchResults = useRoom(state => state.fetchResults)

  const username = useGame(state => state.username)

  const [selectedDuration, setSelectedDuration] = useState<number>(roomSettings?.duration ?? 30)
  const [selectedCash, setSelectedCash] = useState<number>(roomSettings?.startingCash ?? 50_000)
  const [selectedDebt, setSelectedDebt] = useState<number>(roomSettings?.startingDebt ?? 50_000)
  const [starting, setStarting] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  // Sync local settings from store when roomSettings changes
  useEffect(() => {
    if (roomSettings) {
      setSelectedDuration(roomSettings.duration)
      setSelectedCash(roomSettings.startingCash)
      setSelectedDebt(roomSettings.startingDebt)
    }
  }, [roomSettings])

  // Determine if settings are locked (any player started or finished)
  const settingsLocked = players.some(p => p.status === 'playing' || p.status === 'finished')

  const onPresenceSyncRef = useRef<(p: Record<string, RoomPresenceState>) => void>()
  onPresenceSyncRef.current = (presencePlayers: Record<string, RoomPresenceState>) => {
    const presenceList = Object.values(presencePlayers)
    // Merge: start from current players (API-sourced), overlay live presence data
    const existing = useRoom.getState().players
    const merged = new Map<string, RoomPlayer>()
    // Add all existing players from API
    for (const p of existing) {
      merged.set(p.userId, p)
    }
    // Overlay presence data (more up-to-date for live fields)
    for (const p of presenceList) {
      const prev = merged.get(p.userId)
      merged.set(p.userId, {
        userId: p.userId,
        username: p.username,
        isHost: prev?.isHost ?? false,
        isReady: false,
        currentDay: p.currentDay,
        currentNetWorth: p.currentNetWorth,
        status: p.status,
      })
    }
    setPlayers(Array.from(merged.values()))
  }

  const handlePresenceSync = useCallback((p: Record<string, RoomPresenceState>) => {
    onPresenceSyncRef.current?.(p)
  }, [])

  const { track } = useRoomChannel({
    roomId,
    userId: user?.id ?? null,
    username,
    isHost,
    onPresenceSync: handlePresenceSync,
  })

  // Host settings change → save via API
  const settingsDebounceRef = useRef<ReturnType<typeof setTimeout>>()
  const handleSettingChange = useCallback((updates: { duration?: number; startingCash?: number; startingDebt?: number }) => {
    if (!isHost || settingsLocked) return
    if (updates.duration !== undefined) setSelectedDuration(updates.duration)
    if (updates.startingCash !== undefined) setSelectedCash(updates.startingCash)
    if (updates.startingDebt !== undefined) setSelectedDebt(updates.startingDebt)

    // Debounce the API call
    clearTimeout(settingsDebounceRef.current)
    settingsDebounceRef.current = setTimeout(() => {
      updateSettings(updates)
    }, 300)
  }, [isHost, settingsLocked, updateSettings])

  const handleStartRun = async () => {
    setStarting(true)
    await startRun()
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

  // Track presence
  useEffect(() => {
    if (user?.id && username) {
      track({ userId: user.id, username, status: 'joined' })
    }
  }, [user?.id, username, track])

  // Poll for results/players periodically when in hub
  useEffect(() => {
    if (!roomId || !showRoomHub) return
    // Fetch immediately and again after a short delay (auth may not be ready on first try)
    fetchResults()
    const quickRetry = setTimeout(fetchResults, 1_500)
    const interval = setInterval(fetchResults, 8_000)
    return () => { clearTimeout(quickRetry); clearInterval(interval) }
  }, [roomId, showRoomHub, fetchResults])

  if (!showRoomHub) return null

  // Get player result from results array
  const getPlayerResult = (userId: string): RoomResult | undefined =>
    results.find(r => r.userId === userId)

  // Render player status badge
  const renderPlayerStatus = (player: RoomPlayer) => {
    if (player.status === 'playing') {
      return (
        <span className="text-mh-profit-green text-xs font-mono animate-pulse">
          PLAYING — Day {player.currentDay} — {formatMoney(player.currentNetWorth)}
        </span>
      )
    }
    if (player.status === 'finished') {
      const result = getPlayerResult(player.userId)
      if (result?.rank != null) {
        return (
          <span className="text-mh-accent-blue text-xs font-mono">
            #{result.rank} — {formatMoney(result.finalNetWorth)}
          </span>
        )
      }
      return <span className="text-mh-accent-blue text-xs font-mono">FINISHED</span>
    }
    return <span className="text-mh-text-dim text-xs font-mono">IN HUB</span>
  }

  // Sort results for standings
  const sortedResults = [...results].sort((a, b) => {
    if (a.rank != null && b.rank != null) return a.rank - b.rank
    return b.finalNetWorth - a.finalNetWorth
  })

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
        <div className="w-full max-w-[360px] mb-6">
          <div className="text-mh-text-dim text-sm mb-3 font-mono">
            PLAYERS ({players.filter(p => p.status !== 'left').length}/8)
          </div>
          <div className="border border-mh-border rounded-lg overflow-hidden">
            {players.filter(p => p.status !== 'left').length === 0 ? (
              <div className="px-4 py-3 text-mh-text-dim text-sm">Waiting for players...</div>
            ) : (
              players
                .filter(p => p.status !== 'left')
                .map((player) => (
                  <div
                    key={player.userId}
                    className="flex items-center px-4 py-3 border-b border-mh-border last:border-b-0"
                  >
                    <span className="flex-1 text-mh-text-main text-sm text-left truncate min-w-0">
                      {player.username}
                      {player.userId === user?.id && (
                        <span className="text-mh-text-dim ml-1">(you)</span>
                      )}
                    </span>
                    <div className="shrink-0 ml-2 text-right">
                      {renderPlayerStatus(player)}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Game Settings */}
        <div className="w-full max-w-[360px] mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-mh-text-dim text-sm font-mono">GAME SETTINGS</span>
            {settingsLocked && (
              <span className="text-xs font-mono bg-mh-loss-red/20 text-mh-loss-red px-2 py-0.5 rounded">LOCKED</span>
            )}
          </div>
          <div className="border border-mh-border rounded-lg p-4 space-y-4">
            {/* Duration */}
            <div>
              <div className="text-mh-text-dim text-xs font-mono mb-2">DURATION</div>
              <div className="flex gap-2">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={isHost && !settingsLocked ? () => handleSettingChange({ duration: d }) : undefined}
                    className={`flex-1 py-2 text-xs font-mono border rounded transition-colors ${
                      isHost && !settingsLocked ? 'cursor-pointer' : 'cursor-default'
                    } ${
                      selectedDuration === d
                        ? 'border-mh-accent-blue text-mh-accent-blue bg-mh-accent-blue/10'
                        : 'border-mh-border text-mh-text-dim' + (isHost && !settingsLocked ? ' hover:border-mh-text-dim' : '')
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
                    onClick={isHost && !settingsLocked ? () => handleSettingChange({ startingCash: c }) : undefined}
                    className={`flex-1 py-2 text-xs font-mono border rounded transition-colors ${
                      isHost && !settingsLocked ? 'cursor-pointer' : 'cursor-default'
                    } ${
                      selectedCash === c
                        ? 'border-mh-profit-green text-mh-profit-green bg-mh-profit-green/10'
                        : 'border-mh-border text-mh-text-dim' + (isHost && !settingsLocked ? ' hover:border-mh-text-dim' : '')
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
                    onClick={isHost && !settingsLocked ? () => handleSettingChange({ startingDebt: d }) : undefined}
                    className={`flex-1 py-2 text-xs font-mono border rounded transition-colors ${
                      isHost && !settingsLocked ? 'cursor-pointer' : 'cursor-default'
                    } ${
                      selectedDebt === d
                        ? 'border-mh-loss-red text-mh-loss-red bg-mh-loss-red/10'
                        : 'border-mh-border text-mh-text-dim' + (isHost && !settingsLocked ? ' hover:border-mh-text-dim' : '')
                    }`}
                  >
                    {d === 0 ? '$0' : formatCurrency(d)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Standings */}
        {sortedResults.length > 0 && (
          <div className="w-full max-w-[360px] mb-6">
            <div className="text-mh-text-dim text-sm mb-3 font-mono">STANDINGS</div>
            <div className="border border-mh-border rounded-lg overflow-hidden">
              {sortedResults.map((result) => {
                const isYou = result.userId === user?.id
                return (
                  <div
                    key={result.userId}
                    className={`flex items-center px-4 py-3 border-b border-mh-border last:border-b-0 ${
                      isYou ? 'bg-mh-accent-blue/10' : ''
                    }`}
                  >
                    <span className={`w-8 font-mono text-sm ${
                      result.rank === 1 ? 'text-mh-profit-green font-bold' :
                      result.rank === 2 ? 'text-mh-accent-blue' :
                      result.rank === 3 ? 'text-yellow-500' :
                      'text-mh-text-dim'
                    }`}>
                      #{result.rank ?? '-'}
                    </span>
                    <span className="flex-1 text-mh-text-main text-sm truncate">
                      {result.username}
                      {isYou && <span className="text-mh-text-dim ml-1">(you)</span>}
                    </span>
                    <span className={`font-mono text-sm ${
                      result.finalNetWorth >= 50_000 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                    }`}>
                      {formatMoney(result.finalNetWorth)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full max-w-[360px] space-y-3">
          <button
            onClick={handleStartRun}
            disabled={starting}
            className={`w-full py-3 font-mono text-sm border-2 rounded transition-colors ${
              !starting
                ? 'border-mh-profit-green text-mh-profit-green bg-mh-profit-green/10 cursor-pointer hover:bg-mh-profit-green/20'
                : 'border-mh-border text-mh-text-dim cursor-not-allowed opacity-50'
            }`}
          >
            {starting ? 'STARTING...' : 'PLAY'}
          </button>

          {isHost && (
            <button
              onClick={async () => {
                if (!roomId) return
                await fetch(`/api/rooms/${roomId}/leave`, { method: 'POST' })
                // Closing room = host leaving, which finishes room if no one left
                useRoom.getState().cleanup()
              }}
              className="w-full py-2 border border-mh-loss-red text-mh-loss-red font-mono text-xs cursor-pointer hover:bg-mh-loss-red/10 transition-colors rounded"
            >
              CLOSE ROOM
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
