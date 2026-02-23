'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'

export function InlineUsernameInput() {
  const username = useGame((state) => state.username)
  const setUsername = useGame((state) => state.setUsername)
  const pendingScore = useGame((state) => state.pendingScore)
  const [input, setInput] = useState(username || '')
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(!username)

  const handleSubmit = () => {
    const value = input.trim().toLowerCase()
    console.log('[Username] handleSubmit called with:', value)
    if (value.length < 3) { setError('Min 3 characters'); return }
    if (value.length > 15) { setError('Max 15 characters'); return }
    if (!/^[a-z0-9_]+$/.test(value)) { setError('Only letters, numbers, underscores'); return }
    setError(null)
    setIsEditing(false)

    console.log('[Username] pendingScore:', pendingScore)

    // Submit pending score BEFORE setting username (so the rank fetch waits for it)
    if (pendingScore) {
      const scoreData = pendingScore
      useGame.setState({ pendingScore: null })
      console.log('[Username] Submitting pending score for', value, ':', scoreData)
      fetch('/api/profile/record-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: value,
          finalNetWorth: scoreData.finalNetWorth,
          gameData: scoreData.gameData,
        }),
      })
        .then((res) => {
          console.log('[Username] Score submit response:', res.status, res.ok)
          // Set username AFTER score is saved — this triggers the rank fetch in EndGameCoordinator
          setUsername(value)
        })
        .catch((err) => {
          console.error('[Username] Error submitting pending score:', err)
          // Still set username even if score fails
          setUsername(value)
        })
    } else {
      console.log('[Username] No pending score, just setting username')
      setUsername(value)
    }
  }

  if (!isEditing && username) {
    return (
      <div className="flex items-center justify-center gap-2 mt-4 mb-2">
        <span className="text-mh-text-dim text-xs font-mono">PLAYER</span>
        <span className="text-mh-accent-blue text-sm font-bold font-mono">{username}</span>
        <button
          onClick={() => setIsEditing(true)}
          className="text-mh-text-dim/50 text-[10px] hover:text-mh-text-main transition-colors cursor-pointer bg-transparent border-none font-mono"
        >
          [edit]
        </button>
      </div>
    )
  }

  return (
    <div className="mt-4 mb-2 flex flex-col items-center gap-1.5">
      <div className="text-mh-text-dim text-[10px] font-mono tracking-wider">
        {username ? 'CHANGE USERNAME' : 'SET USERNAME FOR LEADERBOARD'}
      </div>
      <div className="flex gap-2 w-full max-w-[240px]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
          maxLength={15}
          placeholder="your_username"
          autoFocus
          aria-label="Username"
          className="flex-1 bg-transparent border border-mh-border text-mh-text-main text-sm font-mono
            px-3 py-1.5 outline-none focus:border-mh-accent-blue transition-colors placeholder:text-mh-text-dim/50"
        />
        <button
          onClick={handleSubmit}
          className="bg-transparent border border-mh-accent-blue text-mh-accent-blue
            px-3 py-1.5 text-xs font-mono cursor-pointer
            hover:bg-mh-accent-blue/10 transition-colors"
        >
          OK
        </button>
      </div>
      {error && <div className="text-mh-loss-red text-xs">{error}</div>}
    </div>
  )
}
