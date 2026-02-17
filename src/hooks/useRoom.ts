import { create } from 'zustand'

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

interface RoomState {
  // Room identity
  roomId: string | null
  roomCode: string | null
  isHost: boolean
  roomStatus: 'idle' | 'lobby' | 'playing' | 'finished'

  // Players (from presence)
  players: RoomPlayer[]

  // Results
  results: RoomResult[]

  // Actions
  createRoom: () => Promise<{ roomId: string; roomCode: string } | null>
  joinRoom: (code: string) => Promise<{ roomId: string; roomCode: string } | null>
  leaveRoom: () => Promise<void>
  toggleReady: (isReady: boolean) => Promise<void>
  startGame: () => Promise<boolean>
  submitResult: (result: {
    finalNetWorth: number
    profitPercent: number
    daysSurvived: number
    outcome: string
    username: string
  }) => Promise<void>
  fetchResults: () => Promise<void>

  // State setters (called from channel hook)
  setPlayers: (players: RoomPlayer[]) => void
  setRoomStatus: (status: 'idle' | 'lobby' | 'playing' | 'finished') => void
  setResults: (results: RoomResult[]) => void

  // Cleanup
  cleanup: () => void
}

export const useRoom = create<RoomState>()((set, get) => ({
  roomId: null,
  roomCode: null,
  isHost: false,
  roomStatus: 'idle',
  players: [],
  results: [],

  createRoom: async () => {
    try {
      // Send local username so the API can use/sync it to the profile
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
      set({
        roomId: data.room.id,
        roomCode: data.room.code,
        isHost: true,
        roomStatus: 'lobby',
      })
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
      set({
        roomId: data.room.id,
        roomCode: data.room.code,
        isHost: data.room.host_id === undefined, // will be set by presence
        roomStatus: 'lobby',
      })
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

  toggleReady: async (isReady: boolean) => {
    const { roomId } = get()
    if (!roomId) return
    try {
      await fetch(`/api/rooms/${roomId}/ready`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isReady }),
      })
    } catch (error) {
      console.error('Error toggling ready:', error)
    }
  },

  startGame: async () => {
    const { roomId } = get()
    if (!roomId) return false
    try {
      const res = await fetch(`/api/rooms/${roomId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!res.ok) return false
      set({ roomStatus: 'playing' })
      return true
    } catch (error) {
      console.error('Error starting game:', error)
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
        if (data.allFinished) {
          set({ roomStatus: 'finished' })
          // Fetch final results with ranks
          get().fetchResults()
        }
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
          set({
            results: data.results.map((r: Record<string, unknown>) => ({
              userId: r.user_id,
              username: r.username,
              finalNetWorth: r.final_net_worth,
              profitPercent: Number(r.profit_percent),
              daysSurvived: r.days_survived,
              outcome: r.outcome,
              rank: r.rank,
            })),
            roomStatus: 'finished',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching results:', error)
    }
  },

  setPlayers: (players) => set({ players }),
  setRoomStatus: (status) => set({ roomStatus: status }),
  setResults: (results) => set({ results }),

  cleanup: () => set({
    roomId: null,
    roomCode: null,
    isHost: false,
    roomStatus: 'idle',
    players: [],
    results: [],
  }),
}))
