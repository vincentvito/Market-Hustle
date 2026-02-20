'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRoom } from '@/hooks/useRoom'

export default function RoomJoinPage() {
  const router = useRouter()
  const joinRoom = useRoom(state => state.joinRoom)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [joining, setJoining] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return

    setJoining(true)
    setError('')

    const result = await joinRoom(trimmed)
    if (result) {
      router.replace(`/room/${result.roomId}`)
    } else {
      setError('Room not found or no longer available')
      setJoining(false)
    }
  }

  return (
    <div className="h-full bg-mh-bg flex items-center justify-center">
      <div className="w-full max-w-[320px] px-4">
        <div className="text-mh-text-dim text-xs font-mono tracking-widest mb-2 text-center">JOIN ROOM</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ENTER CODE"
            maxLength={6}
            autoFocus
            className="w-full bg-transparent border border-mh-border text-mh-text-bright text-center text-2xl font-mono tracking-[0.5em] py-3 px-4 rounded outline-none focus:border-mh-accent-blue transition-colors placeholder:text-mh-text-dim/30 placeholder:tracking-[0.3em] placeholder:text-base"
          />
          {error && (
            <div className="text-mh-loss-red text-xs font-mono text-center">{error}</div>
          )}
          <button
            type="submit"
            disabled={joining || code.trim().length === 0}
            className={`w-full py-3 font-mono text-sm border-2 rounded transition-colors ${
              !joining && code.trim().length > 0
                ? 'border-mh-accent-blue text-mh-accent-blue cursor-pointer hover:bg-mh-accent-blue/10'
                : 'border-mh-border text-mh-text-dim cursor-not-allowed opacity-50'
            }`}
          >
            {joining ? 'JOINING...' : 'JOIN'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full py-2 border border-mh-border text-mh-text-dim font-mono text-xs cursor-pointer hover:border-mh-text-dim hover:text-mh-text-main transition-colors rounded"
          >
            BACK
          </button>
        </form>
      </div>
    </div>
  )
}
