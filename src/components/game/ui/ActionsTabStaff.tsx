'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { STAFF_ACTIONS } from '@/lib/game/actions'
import type { StaffAction } from '@/lib/game/actions'

function formatPrice(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return `$${value.toFixed(0)}`
}

export function ActionsTabStaff() {
  const { cash, selectedTheme } = useGame()
  const isModern3 = selectedTheme === 'modern3'

  // Track purchased one-time items locally
  const [purchased, setPurchased] = useState<Set<string>>(new Set())

  const handleAction = (action: StaffAction) => {
    if (cash < action.cost) return
    if (action.type === 'one-time' && purchased.has(action.id)) return

    // Deduct cost
    useGame.setState({ cash: cash - action.cost })

    // Track one-time purchases
    if (action.type === 'one-time') {
      setPurchased(prev => new Set(prev).add(action.id))
    }

    // Show feedback toast
    useGame.setState({
      activeBuyMessage: `${action.emoji} ${action.name} acquired!`,
    })
  }

  const getButtonLabel = (action: StaffAction): string => {
    if (action.id === 'buy_senator') return 'BUY'
    return 'HIRE'
  }

  return (
    <div className={`flex-1 overflow-auto ${isModern3 ? 'p-2 space-y-2' : ''}`}>
      {STAFF_ACTIONS.map(action => {
        const isPurchased = action.type === 'one-time' && purchased.has(action.id)
        const canAfford = cash >= action.cost

        return (
          <div
            key={action.id}
            className={`w-full p-3 text-left transition-colors ${
              isModern3
                ? `rounded-lg bg-[#0f1419] ${isPurchased ? 'border border-[#ffd700]/30 opacity-60' : ''}`
                : `border-b border-mh-border ${
                    isPurchased
                      ? 'bg-[#1a1500] opacity-60'
                      : 'bg-mh-bg'
                  }`
            }`}
            style={isModern3 ? {
              boxShadow: isPurchased
                ? '0 2px 8px rgba(255, 215, 0, 0.15)'
                : '0 2px 6px rgba(0, 0, 0, 0.2)'
            } : undefined}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{action.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-mh-text-bright truncate">
                    {action.name}
                  </span>
                  {isPurchased && (
                    <span className="text-xs text-[#ffd700] font-bold">HIRED</span>
                  )}
                  {action.type === 'duration' && action.durationDays && !isPurchased && (
                    <span className="text-[10px] text-mh-text-dim font-mono">
                      {action.durationDays} DAYS
                    </span>
                  )}
                </div>
                <div className="text-xs text-mh-text-dim mt-0.5 line-clamp-2">
                  {action.description}
                </div>
                <div className="text-[10px] text-amber-400 mt-1">
                  {action.effect}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-mh-text-main">
                    {formatPrice(action.cost)}
                  </span>
                  {!isPurchased ? (
                    <button
                      onClick={() => handleAction(action)}
                      disabled={!canAfford}
                      className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${
                        canAfford
                          ? 'bg-mh-accent-blue text-white hover:bg-mh-accent-blue/80'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {getButtonLabel(action)}
                    </button>
                  ) : (
                    <span className="text-xs text-[#ffd700] font-bold">ACTIVE</span>
                  )}
                </div>
                {!canAfford && !isPurchased && (
                  <div className="text-[10px] text-mh-loss-red mt-1">
                    Need {formatPrice(action.cost - cash)} more
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
