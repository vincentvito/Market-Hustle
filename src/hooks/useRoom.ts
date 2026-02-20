import { create } from 'zustand'
import { capture } from '@/lib/posthog'

export interface RoomPlayer {
  userId: string
  username: string
  isHost: boolean
  isReady: boolean
  currentDay: number
  currentNetWorth: number
  status: 'joined' | 'playing' | 'finished' | 'left'
}

export interface RoomResult {
  userId: string
  username: string
  finalNetWorth: number
  profitPercent: number
  daysSurvived: number
  outcome: string
  rank: number | null
}

export interface RoomSettings {
  duration: number
  startingCash: number
  startingDebt: number
}

interface RoomState {
  // Room identity
  roomId: string | null
  roomCode: string | null
  isHost: boolean
  roomStatus: 'idle' | 'lobby' | 'playing' | 'finished'

  // UI routing
  showRoomHub: boolean

  // Settings
  roomSettings: RoomSettings | null

  // Players (from presence)
  players: RoomPlayer[]

  // Results
  results: RoomResult[]

  // Actions
  createRoom: () => Promise<{ roomId: string; roomCode: string } | null>
  joinRoom: (code: string) => Promise<{ roomId: string; roomCode: string } | null>
  leaveRoom: () => Promise<void>
  startRun: () => Promise<boolean>
  submitResult: (result: {
    finalNetWorth: number
    profitPercent: number
    daysSurvived: number
    outcome: string
    username: string
  }) => Promise<void>
  fetchResults: () => Promise<void>
  updateSettings: (settings: Partial<RoomSettings>) => Promise<void>
  returnToHub: () => void

  // State setters (called from channel hook)
  setPlayers: (players: RoomPlayer[]) => void
  setRoomStatus: (status: 'idle' | 'lobby' | 'playing' | 'finished') => void
  setResults: (results: RoomResult[]) => void

  // Cleanup
  cleanup: () => void
}

const ROOM_STORAGE_KEY = 'mh_active_room'

function saveActiveRoom(roomId: string, roomCode: string) {
  try { localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify({ roomId, roomCode })) } catch {}
}

function clearActiveRoom() {
  try { localStorage.removeItem(ROOM_STORAGE_KEY) } catch {}
}

export function getActiveRoom(): { roomId: string; roomCode: string } | null {
  try {
    const raw = localStorage.getItem(ROOM_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data?.roomId && data?.roomCode) return data
  } catch {}
  return null
}

function parseResults(data: Record<string, unknown>[]): RoomResult[] {
  return data.map((r) => ({
    userId: r.user_id as string,
    username: r.username as string,
    finalNetWorth: r.final_net_worth as number,
    profitPercent: Number(r.profit_percent),
    daysSurvived: r.days_survived as number,
    outcome: r.outcome as string,
    rank: r.rank as number | null,
  }))
}

export const useRoom = create<RoomState>()((set, get) => ({
  roomId: null,
  roomCode: null,
  isHost: false,
  roomStatus: 'idle',
  showRoomHub: false,
  roomSettings: null,
  players: [],
  results: [],

  createRoom: async () => {
    try {
      const { useGame } = await import('@/hooks/useGame')
      const localUsername = useGame.getState().username
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: localUsername }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create room')
      }
      const data = await res.json()
      const settings: RoomSettings = {
        duration: data.room.game_duration ?? 30,
        startingCash: data.room.starting_cash ?? 50_000,
        startingDebt: data.room.starting_debt ?? 50_000,
      }
      set({
        roomId: data.room.id,
        roomCode: data.room.code,
        isHost: true,
        roomStatus: 'lobby',
        showRoomHub: true,
        roomSettings: settings,
      })
      saveActiveRoom(data.room.id, data.room.code)
      capture('room_created', { room_code: data.room.code })
      return { roomId: data.room.id, roomCode: data.room.code }
    } catch (error) {
      console.error('Error creating room:', error)
      return null
    }
  },

  joinRoom: async (code: string) => {
    try {
      const { useGame } = await import('@/hooks/useGame')
      const localUsername = useGame.getState().username
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase(), username: localUsername }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to join room')
      }
      const data = await res.json()
      const settings: RoomSettings = {
        duration: data.room.game_duration ?? 30,
        startingCash: data.room.starting_cash ?? 50_000,
        startingDebt: data.room.starting_debt ?? 50_000,
      }
      const initialResults = data.results?.length > 0 ? parseResults(data.results) : []
      set({
        roomId: data.room.id,
        roomCode: data.room.code,
        isHost: false,
        roomStatus: data.room.status || 'lobby',
        showRoomHub: true,
        roomSettings: settings,
        results: initialResults,
      })
      saveActiveRoom(data.room.id, data.room.code)
      capture('room_joined', { room_code: data.room.code })
      return { roomId: data.room.id, roomCode: data.room.code }
    } catch (error) {
      console.error('Error joining room:', error)
      return null
    }
  },

  leaveRoom: async () => {
    const { roomId } = get()
    if (!roomId) return
    try {
      await fetch(`/api/rooms/${roomId}/leave`, { method: 'POST' })
    } catch (error) {
      console.error('Error leaving room:', error)
    }
    get().cleanup()
  },

  startRun: async () => {
    const { roomId, roomSettings } = get()
    if (!roomId) return false
    try {
      const res = await fetch(`/api/rooms/${roomId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!res.ok) return false
      const data = await res.json()

      // Get settings from API response (authoritative) or fall back to local
      const duration = data.settings?.game_duration ?? roomSettings?.duration ?? 30
      const startingCash = data.settings?.starting_cash ?? roomSettings?.startingCash ?? 50_000
      const startingDebt = data.settings?.starting_debt ?? roomSettings?.startingDebt ?? 50_000

      set({ showRoomHub: false, roomStatus: 'playing' })

      // Start the game with room settings (skip limits for room games)
      const { useGame } = await import('@/hooks/useGame')
      useGame.getState().startGame(
        duration as 30 | 45 | 60,
        { cash: startingCash, debt: startingDebt, skipLimits: true },
      )

      capture('room_game_started', { player_count: get().players.length })
      return true
    } catch (error) {
      console.error('Error starting run:', error)
      return false
    }
  },

  submitResult: async (result) => {
    const { roomId } = get()
    if (!roomId) return
    try {
      const res = await fetch(`/api/rooms/${roomId}/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.results?.length > 0) {
          set({ results: parseResults(data.results) })
        }
        // Fetch full results to ensure we have latest
        get().fetchResults()
      }
    } catch (error) {
      console.error('Error submitting result:', error)
    }
  },

  fetchResults: async () => {
    const { roomId } = get()
    if (!roomId) return
    try {
      const res = await fetch(`/api/rooms/${roomId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.results?.length > 0) {
          set({ results: parseResults(data.results) })
        }
        // Update players from API (authoritative DB state)
        if (data.players?.length > 0) {
          const apiPlayers: RoomPlayer[] = data.players.map((p: Record<string, unknown>) => ({
            userId: p.user_id as string,
            username: p.username as string,
            isHost: p.is_host as boolean,
            isReady: false,
            currentDay: (p.current_day as number) ?? 0,
            currentNetWorth: (p.current_net_worth as number) ?? 50_000,
            status: p.status as RoomPlayer['status'],
          }))
          // Merge: use presence data for live fields if available, API for everything else
          const currentPlayers = get().players
          const merged = apiPlayers.map(ap => {
            const live = currentPlayers.find(p => p.userId === ap.userId)
            if (live && (live.status === 'playing' || live.status === 'finished')) {
              // Presence has more up-to-date live data
              return { ...ap, currentDay: live.currentDay, currentNetWorth: live.currentNetWorth, status: live.status }
            }
            return ap
          })
          set({ players: merged })
          // Update isHost if we're in the list
          const me = apiPlayers.find(p => p.isHost)
          if (me) {
            // Check if current user is host
            // We don't have userId here, so just update from the API response
          }
        }
        // Update settings if returned
        if (data.room) {
          const settings: RoomSettings = {
            duration: data.room.game_duration ?? 30,
            startingCash: data.room.starting_cash ?? 50_000,
            startingDebt: data.room.starting_debt ?? 50_000,
          }
          set({ roomSettings: settings })
        }
      }
    } catch (error) {
      console.error('Error fetching results:', error)
    }
  },

  updateSettings: async (settings) => {
    const { roomId, roomSettings } = get()
    if (!roomId) return
    const merged = { ...roomSettings, ...settings }
    try {
      const res = await fetch(`/api/rooms/${roomId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      })
      if (res.ok) {
        const data = await res.json()
        set({
          roomSettings: {
            duration: data.settings.game_duration,
            startingCash: data.settings.starting_cash,
            startingDebt: data.settings.starting_debt,
          },
        })
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  },

  returnToHub: async () => {
    const { useGame } = await import('@/hooks/useGame')
    useGame.getState().setScreen('title')
    set({ showRoomHub: true })
  },

  setPlayers: (players) => set({ players }),
  setRoomStatus: (status) => set({ roomStatus: status }),
  setResults: (results) => set({ results }),

  cleanup: () => {
    clearActiveRoom()
    set({
      roomId: null,
      roomCode: null,
      isHost: false,
      roomStatus: 'idle',
      showRoomHub: false,
      roomSettings: null,
      players: [],
      results: [],
    })
  },
}))
