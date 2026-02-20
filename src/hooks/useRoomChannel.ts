import { useEffect, useRef, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface RoomPresenceState {
  userId: string
  username: string
  currentDay: number
  currentNetWorth: number
  status: 'joined' | 'playing' | 'finished' | 'left'
}

interface UseRoomChannelOptions {
  roomId: string | null
  userId: string | null
  username: string | null
  isHost?: boolean
  onPlayerFinished?: (data: { userId: string; username: string; finalNetWorth: number }) => void
  onPlayerLeft?: (data: { userId: string }) => void
  onPresenceSync?: (players: Record<string, RoomPresenceState>) => void
}

export function useRoomChannel({
  roomId,
  userId,
  username,
  isHost,
  onPlayerFinished,
  onPlayerLeft,
  onPresenceSync,
}: UseRoomChannelOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const presenceRef = useRef<RoomPresenceState | null>(null)

  const onPlayerFinishedRef = useRef(onPlayerFinished)
  const onPlayerLeftRef = useRef(onPlayerLeft)
  const onPresenceSyncRef = useRef(onPresenceSync)

  onPlayerFinishedRef.current = onPlayerFinished
  onPlayerLeftRef.current = onPlayerLeft
  onPresenceSyncRef.current = onPresenceSync

  const track = useCallback((state: Partial<RoomPresenceState>) => {
    if (!userId || !username) return

    // Always update presenceRef so subscribe callback can use latest state
    presenceRef.current = {
      userId,
      username,
      currentDay: 0,
      currentNetWorth: 50_000,
      status: 'joined',
      ...presenceRef.current,
      ...state,
    }

    // Only send to channel if subscribed
    if (channelRef.current) {
      channelRef.current.track(presenceRef.current)
    }
  }, [userId, username])

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
        onPresenceSyncRef.current?.(players)
      })
      .on('broadcast', { event: 'player_finished' }, ({ payload }: { payload: { userId: string; username: string; finalNetWorth: number } }) => {
        onPlayerFinishedRef.current?.(payload)
      })
      .on('broadcast', { event: 'player_left' }, ({ payload }: { payload: { userId: string } }) => {
        onPlayerLeftRef.current?.(payload)
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          // Use presenceRef if track() was called before subscription, otherwise use defaults
          const initialState = presenceRef.current || {
            userId,
            username,
            currentDay: 0,
            currentNetWorth: 50_000,
            status: 'joined' as const,
          }
          presenceRef.current = initialState
          await channel.track(initialState)
        }
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
      presenceRef.current = null
    }
  }, [roomId, userId, username, isHost])

  return {
    track,
    broadcastPlayerFinished,
    broadcastPlayerLeft,
  }
}
