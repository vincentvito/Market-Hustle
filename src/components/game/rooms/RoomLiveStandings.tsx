'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useRoom } from '@/hooks/useRoom'
import { useRoomChannel, type RoomPresenceState } from '@/hooks/useRoomChannel'
import { useGame } from '@/hooks/useGame'
import { useAuth } from '@/contexts/AuthContext'

function formatMoney(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toLocaleString()}`
}

export function RoomLiveStandings() {
  const { user } = useAuth()
  const roomId = useRoom(state => state.roomId)
  const roomCode = useRoom(state => state.roomCode)
  const players = useRoom(state => state.players)
  const setPlayers = useRoom(state => state.setPlayers)
  const roomStatus = useRoom(state => state.roomStatus)
  const isHost = useRoom(state => state.isHost)

  const username = useGame(state => state.username)
  const gameDuration = useGame(state => state.gameDuration)
  const day = useGame(state => state.day)
  const getNetWorth = useGame(state => state.getNetWorth)

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
    isHost,
    onPresenceSync: handlePresenceSync,
  })

  // RoomProgressBar unmounted when game ended, so re-announce our finished state
  useEffect(() => {
    if (user?.id) {
      track({
        currentDay: day,
        currentNetWorth: Math.round(getNetWorth()),
        status: 'finished',
      })
    }
  }, [user?.id, day, getNetWorth, track])

  if (!roomId || roomStatus === 'idle' || roomStatus === 'finished') return null

  const activePlayers = players
    .filter(p => p.status !== 'left')
    .sort((a, b) => b.currentNetWorth - a.currentNetWorth)

  if (activePlayers.length === 0) return null

  const allDone = activePlayers.every(p => p.status === 'finished')
  const finishedCount = activePlayers.filter(p => p.status === 'finished').length

  return (
    <div className="w-full max-w-[360px] mx-auto mt-6 mb-4">
      <div className="text-mh-text-dim text-xs font-mono tracking-widest mb-1 text-center">
        ROOM {roomCode}
      </div>
      <div className="text-mh-text-bright text-lg font-mono mb-2 text-center">
        LIVE STANDINGS
      </div>
      <div className="text-mh-text-dim text-xs font-mono mb-3 text-center">
        {allDone ? 'All players finished!' : `${finishedCount}/${activePlayers.length} finished — waiting for others...`}
      </div>

      <div className="border border-mh-border rounded-lg overflow-hidden">
        {activePlayers.map((player, idx) => {
          const isYou = player.userId === user?.id
          const rank = idx + 1

          return (
            <div
              key={player.userId}
              className={`flex items-center px-4 py-3 border-b border-mh-border last:border-b-0 ${
                isYou ? 'bg-mh-accent-blue/10' : ''
              }`}
            >
              <span className={`w-8 font-mono text-sm ${
                rank === 1 ? 'text-mh-profit-green font-bold' :
                rank === 2 ? 'text-mh-accent-blue' :
                rank === 3 ? 'text-yellow-500' :
                'text-mh-text-dim'
              }`}>
                #{rank}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-mh-text-main text-sm truncate">
                  {player.username}
                  {isYou && <span className="text-mh-text-dim ml-1">(you)</span>}
                </div>
                <div className="text-mh-text-dim text-xs">
                  Day {player.currentDay}/{gameDuration}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-sm ${
                  player.currentNetWorth >= 50_000 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                }`}>
                  {formatMoney(player.currentNetWorth)}
                </span>
                {player.status === 'finished' ? (
                  <span className="text-mh-accent-blue text-xs font-mono w-12 text-right">DONE</span>
                ) : (
                  <span className="text-mh-text-dim text-xs font-mono w-12 text-right animate-pulse">LIVE</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
