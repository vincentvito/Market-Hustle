import { useEffect, useRef, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface RoomPresenceState {
  userId: string
  username: string
  isReady: boolean
  currentDay: number
  currentNetWorth: number
  status: 'joined' | 'playing' | 'finished' | 'left'
}

interface UseRoomChannelOptions {
  roomId: string | null
  userId: string | null
  username: string | null
  onGameStart?: (scenarioData: string) => void
  onPlayerFinished?: (data: { userId: string; username: string; finalNetWorth: number }) => void
  onPlayerLeft?: (data: { userId: string }) => void
  onPresenceSync?: (players: Record<string, RoomPresenceState>) => void
}

export function useRoomChannel({
  roomId,
  userId,
  username,
  onGameStart,
  onPlayerFinished,
  onPlayerLeft,
  onPresenceSync,
}: UseRoomChannelOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const presenceRef = useRef<RoomPresenceState | null>(null)

  // Track the player's own presence state
  const track = useCallback((state: Partial<RoomPresenceState>) => {
    if (!channelRef.current || !userId || !username) return

    presenceRef.current = {
      userId,
      username,
      isReady: false,
      currentDay: 0,
      currentNetWorth: 50000,
      status: 'joined',
      ...presenceRef.current,
      ...state,
    }

    channelRef.current.track(presenceRef.current)
  }, [userId, username])

  // Broadcast events
  const broadcastGameStart = useCallback((scenarioData: string) => {
    if (!channelRef.current) return
    channelRef.current.send({
      type: 'broadcast',
      event: 'game_start',
      payload: { scenarioData },
    })
  }, [])

  const broadcastPlayerFinished = useCallback((data: { userId: string; username: string; finalNetWorth: number }) => {
    if (!channelRef.current) return
    channelRef.current.send({
      type: 'broadcast',
      event: 'player_finished',
      payload: data,
    })
  }, [])

  const broadcastPlayerLeft = useCallback(() => {
    if (!channelRef.current || !userId) return
    channelRef.current.send({
      type: 'broadcast',
      event: 'player_left',
      payload: { userId },
    })
  }, [userId])

  // Subscribe/unsubscribe to channel
  useEffect(() => {
    if (!roomId || !userId || !username) return

    const supabase = getSupabaseClient()
    const channel = supabase.channel(`room:${roomId}`, {
      config: { presence: { key: userId } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const players: Record<string, RoomPresenceState> = {}
        for (const [key, presences] of Object.entries(state)) {
          const arr = presences as RoomPresenceState[]
          if (arr.length > 0) {
            players[key] = arr[0]
          }
        }
        onPresenceSync?.(players)
      })
      .on('broadcast', { event: 'game_start' }, ({ payload }: { payload: Record<string, string> }) => {
        onGameStart?.(payload.scenarioData)
      })
      .on('broadcast', { event: 'player_finished' }, ({ payload }: { payload: { userId: string; username: string; finalNetWorth: number } }) => {
        onPlayerFinished?.(payload)
      })
      .on('broadcast', { event: 'player_left' }, ({ payload }: { payload: { userId: string } }) => {
        onPlayerLeft?.(payload)
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId,
            username,
            isReady: false,
            currentDay: 0,
            currentNetWorth: 50000,
            status: 'joined',
          })
          presenceRef.current = {
            userId,
            username,
            isReady: false,
            currentDay: 0,
            currentNetWorth: 50000,
            status: 'joined',
          }
        }
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
      presenceRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userId, username])

  return {
    track,
    broadcastGameStart,
    broadcastPlayerFinished,
    broadcastPlayerLeft,
  }
}
