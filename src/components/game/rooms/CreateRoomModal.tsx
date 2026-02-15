'use client'

import { useState } from 'react'
import { useRoom } from '@/hooks/useRoom'

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}

export function CreateRoomModal({ isOpen, onClose, onCreated }: CreateRoomModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const createRoom = useRoom(state => state.createRoom)

  if (!isOpen) return null

  const handleCreate = async () => {
    setLoading(true)
    setError(null)
    const result = await createRoom()
    setLoading(false)
    if (result) {
      onCreated()
    } else {
      setError('Failed to create room. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-mh-bg border border-mh-border rounded-lg p-6 max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-mh-text-bright text-lg font-mono mb-4 text-center">CREATE ROOM</h2>
        <p className="text-mh-text-dim text-sm mb-6 text-center">
          Create a room and share the code with friends. Everyone plays the same scenario and races to the highest net worth.
        </p>

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
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 py-2 border border-mh-accent-blue text-mh-accent-blue font-mono text-sm cursor-pointer hover:bg-mh-accent-blue/10 transition-colors rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </div>
      </div>
    </div>
  )
}
