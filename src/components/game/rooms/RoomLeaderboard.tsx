'use client'

import { useEffect } from 'react'
import { useRoom } from '@/hooks/useRoom'
import { useAuth } from '@/contexts/AuthContext'

function formatMoney(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}

function getRankEmoji(rank: number): string {
  if (rank === 1) return '1st'
  if (rank === 2) return '2nd'
  if (rank === 3) return '3rd'
  return `${rank}th`
}

export function RoomLeaderboard() {
  const { user } = useAuth()
  const results = useRoom(state => state.results)
  const roomCode = useRoom(state => state.roomCode)
  const fetchResults = useRoom(state => state.fetchResults)
  const cleanup = useRoom(state => state.cleanup)

  // Fetch results on mount
  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  if (results.length === 0) return null

  const sorted = [...results].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))

  return (
    <div className="w-full max-w-[360px] mx-auto mt-6 mb-4">
      <div className="text-mh-text-dim text-xs font-mono tracking-widest mb-1 text-center">
        ROOM {roomCode}
      </div>
      <div className="text-mh-text-bright text-lg font-mono mb-4 text-center">
        FINAL STANDINGS
      </div>

      <div className="border border-mh-border rounded-lg overflow-hidden mb-4">
        {sorted.map((result) => {
          const isYou = result.userId === user?.id
          const rank = result.rank ?? 0
          const isTop3 = rank <= 3

          return (
            <div
              key={result.userId}
              className={`flex items-center px-4 py-3 border-b border-mh-border last:border-b-0 ${
                isYou ? 'bg-mh-accent-blue/10' : isTop3 ? 'bg-mh-profit-green/5' : ''
              }`}
            >
              <span className={`w-12 font-mono text-sm ${
                rank === 1 ? 'text-mh-profit-green font-bold' :
                rank === 2 ? 'text-mh-accent-blue' :
                rank === 3 ? 'text-yellow-500' :
                'text-mh-text-dim'
              }`}>
                {getRankEmoji(rank)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-mh-text-main text-sm truncate">
                  {result.username}
                  {isYou && <span className="text-mh-text-dim ml-1">(you)</span>}
                </div>
                <div className="text-mh-text-dim text-xs">
                  Day {result.daysSurvived} &middot; {result.outcome}
                </div>
              </div>
              <span className={`font-mono text-sm ${
                result.finalNetWorth >= 50000 ? 'text-mh-profit-green' : 'text-mh-loss-red'
              }`}>
                {formatMoney(result.finalNetWorth)}
              </span>
            </div>
          )
        })}
      </div>

      <button
        onClick={cleanup}
        className="w-full py-2 border border-mh-border text-mh-text-dim font-mono text-xs cursor-pointer hover:border-mh-text-dim hover:text-mh-text-main transition-colors rounded"
      >
        BACK TO MENU
      </button>
    </div>
  )
}
