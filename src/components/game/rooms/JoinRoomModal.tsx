'use client'

import { useState } from 'react'
import { useRoom } from '@/hooks/useRoom'

interface JoinRoomModalProps {
  isOpen: boolean
  onClose: () => void
  onJoined: () => void
  initialCode?: string
}

export function JoinRoomModal({ isOpen, onClose, onJoined, initialCode = '' }: JoinRoomModalProps) {
  const [code, setCode] = useState(initialCode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const joinRoom = useRoom(state => state.joinRoom)

  if (!isOpen) return null

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase()
    if (trimmed.length !== 6) {
      setError('Room code must be 6 characters')
      return
    }

    setLoading(true)
    setError(null)
    const result = await joinRoom(trimmed)
    setLoading(false)
    if (result) {
      onJoined()
    } else {
      setError('Room not found or no longer accepting players.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-mh-bg border border-mh-border rounded-lg p-6 max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-mh-text-bright text-lg font-mono mb-4 text-center">JOIN ROOM</h2>
        <p className="text-mh-text-dim text-sm mb-4 text-center">
          Enter the 6-character room code shared by your friend.
        </p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z2-9]/g, '').slice(0, 6))}
          onKeyDown={(e) => { if (e.key === 'Enter') handleJoin() }}
          placeholder="ABC123"
          maxLength={6}
          className="w-full bg-transparent border border-mh-border text-mh-text-bright text-center text-2xl font-mono tracking-[0.3em]
            px-4 py-3 mb-4 outline-none focus:border-mh-accent-blue transition-colors placeholder:text-mh-text-dim/30"
          autoFocus
        />

        {error && (
          <div className="text-mh-loss-red text-sm mb-4 text-center">{error}</div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-mh-border text-mh-text-dim font-mono text-sm cursor-pointer hover:border-mh-text-dim transition-colors rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            disabled={loading || code.length !== 6}
            className="flex-1 py-2 border border-mh-accent-blue text-mh-accent-blue font-mono text-sm cursor-pointer hover:bg-mh-accent-blue/10 transition-colors rounded disabled:opacity-50"
          >
            {loading ? 'Joining...' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  )
}
