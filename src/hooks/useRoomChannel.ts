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

export interface RoomSettings {
  duration: number
  startingCash: number
  startingDebt: number
}

interface UseRoomChannelOptions {
  roomId: string | null
  userId: string | null
  username: string | null
  isHost?: boolean
  onGameStart?: (scenarioData: string) => void
  onPlayerFinished?: (data: { userId: string; username: string; finalNetWorth: number }) => void
  onPlayerLeft?: (data: { userId: string }) => void
  onPresenceSync?: (players: Record<string, RoomPresenceState>) => void
  onSettingsUpdate?: (settings: RoomSettings) => void
}

export function useRoomChannel({
  roomId,
  userId,
  username,
  isHost,
  onGameStart,
  onPlayerFinished,
  onPlayerLeft,
  onPresenceSync,
  onSettingsUpdate,
}: UseRoomChannelOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const presenceRef = useRef<RoomPresenceState | null>(null)

  const onGameStartRef = useRef(onGameStart)
  const onPlayerFinishedRef = useRef(onPlayerFinished)
  const onPlayerLeftRef = useRef(onPlayerLeft)
  const onPresenceSyncRef = useRef(onPresenceSync)
  const onSettingsUpdateRef = useRef(onSettingsUpdate)

  onGameStartRef.current = onGameStart
  onPlayerFinishedRef.current = onPlayerFinished
  onPlayerLeftRef.current = onPlayerLeft
  onPresenceSyncRef.current = onPresenceSync
  onSettingsUpdateRef.current = onSettingsUpdate

  const track = useCallback((state: Partial<RoomPresenceState>) => {
    if (!userId || !username) return

    // Always update presenceRef so subscribe callback can use latest state
    presenceRef.current = {
      userId,
      username,
      isReady: false,
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

  const broadcastSettings = useCallback((settings: RoomSettings) => {
    if (!channelRef.current) return
    channelRef.current.send({
      type: 'broadcast',
      event: 'room_settings',
      payload: settings,
    })
  }, [])

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
      .on('broadcast', { event: 'game_start' }, ({ payload }: { payload: Record<string, string> }) => {
        onGameStartRef.current?.(payload.scenarioData)
      })
      .on('broadcast', { event: 'player_finished' }, ({ payload }: { payload: { userId: string; username: string; finalNetWorth: number } }) => {
        onPlayerFinishedRef.current?.(payload)
      })
      .on('broadcast', { event: 'player_left' }, ({ payload }: { payload: { userId: string } }) => {
        onPlayerLeftRef.current?.(payload)
      })
      .on('broadcast', { event: 'room_settings' }, ({ payload }: { payload: RoomSettings }) => {
        onSettingsUpdateRef.current?.(payload)
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          // Use presenceRef if track() was called before subscription, otherwise use defaults
          const initialState = presenceRef.current || {
            userId,
            username,
            isReady: !!isHost,
            currentDay: 0,
            currentNetWorth: 50_000,
            status: 'joined',
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
    broadcastGameStart,
    broadcastPlayerFinished,
    broadcastPlayerLeft,
    broadcastSettings,
  }
}
