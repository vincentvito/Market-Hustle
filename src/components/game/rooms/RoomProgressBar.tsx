'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useRoom } from '@/hooks/useRoom'
import { useRoomChannel, type RoomPresenceState } from '@/hooks/useRoomChannel'
import { useGame } from '@/hooks/useGame'
import { useAuth } from '@/contexts/AuthContext'

function formatMoney(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toLocaleString()}`
}

export function RoomProgressBar() {
  const { user } = useAuth()
  const roomId = useRoom(state => state.roomId)
  const players = useRoom(state => state.players)
  const setPlayers = useRoom(state => state.setPlayers)
  const roomStatus = useRoom(state => state.roomStatus)

  const day = useGame(state => state.day)
  const gameDuration = useGame(state => state.gameDuration)
  const getNetWorth = useGame(state => state.getNetWorth)
  const username = useGame(state => state.username)

  // Stable callback ref
  const onPresenceSyncRef = useRef<(p: Record<string, RoomPresenceState>) => void>()
  onPresenceSyncRef.current = (presencePlayers: Record<string, RoomPresenceState>) => {
    const playerList = Object.values(presencePlayers).map(p => ({
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

  const handlePresenceSync = useCallback((p: Record<string, RoomPresenceState>) => {
    onPresenceSyncRef.current?.(p)
  }, [])

  const { track } = useRoomChannel({
    roomId,
    userId: user?.id ?? null,
    username,
    onPresenceSync: handlePresenceSync,
  })

  // Update presence on every day advance
  useEffect(() => {
    if (roomStatus === 'playing' && user?.id) {
      track({
        currentDay: day,
        currentNetWorth: Math.round(getNetWorth()),
        status: 'playing',
      })
    }
  }, [day, roomStatus, user?.id, track, getNetWorth])

  if (!roomId || roomStatus !== 'playing') return null

  // Sort players by net worth descending
  const otherPlayers = players
    .filter(p => p.userId !== user?.id && p.status !== 'left')
    .sort((a, b) => b.currentNetWorth - a.currentNetWorth)

  if (otherPlayers.length === 0) return null

  return (
    <div className="bg-mh-bg/90 border-b border-mh-border px-3 py-2">
      <div className="flex items-center gap-3 overflow-x-auto text-xs font-mono">
        <span className="text-mh-text-dim flex-shrink-0">ROOM:</span>
        {otherPlayers.map((player) => (
          <div key={player.userId} className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-mh-text-dim truncate max-w-[60px]">{player.username}</span>
            <span className="text-mh-text-dim">D{player.currentDay}/{gameDuration}</span>
            <span className={player.currentNetWorth >= 50000 ? 'text-mh-profit-green' : 'text-mh-loss-red'}>
              {formatMoney(player.currentNetWorth)}
            </span>
            {player.status === 'finished' && (
              <span className="text-mh-accent-blue">DONE</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
