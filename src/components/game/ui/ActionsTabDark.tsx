'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { DARK_ACTIONS } from '@/lib/game/actions'
import type { DarkAction } from '@/lib/game/actions'

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

function getFbiColor(heat: number): string {
  if (heat >= 60) return '#ff3333'
  if (heat >= 30) return '#ffaa00'
  return '#00cc00'
}

function getWifeColor(heat: number): string {
  if (heat >= 60) return '#ff3333'
  if (heat >= 30) return '#ffaa00'
  return '#00cc00'
}

export function ActionsTabDark() {
  const {
    cash,
    fbiHeat = 0,
    wifeSuspicion = 0,
    selectedTheme,
    getNetWorth,
    increaseWifeHeat,
    increaseFBIHeat,
    decreaseFBIHeat,
  } = useGame()
  const isModern3 = selectedTheme === 'modern3'

  // Track purchased one-time items locally
  const [purchased, setPurchased] = useState<Set<string>>(new Set())

  const handleAction = (action: DarkAction) => {
    if (cash < action.cost) return
    if (action.type === 'one-time' && purchased.has(action.id)) return

    // Special logic per action
    switch (action.id) {
      case 'visit_escort': {
        useGame.setState({ cash: cash - action.cost })
        increaseWifeHeat(10)
        useGame.setState({
          activeBuyMessage: `${action.emoji} Insider tip acquired. Wife suspicion rising...`,
        })
        break
      }
      case 'bribe_fbi': {
        useGame.setState({ cash: cash - action.cost })
        decreaseFBIHeat(30)
        setPurchased(prev => new Set(prev).add(action.id))
        useGame.setState({
          activeBuyMessage: `${action.emoji} Agent compromised. FBI heat reduced.`,
        })
        break
      }
      case 'fake_death': {
        const netWorth = getNetWorth()
        const penalty = Math.floor(netWorth * 0.5)
        useGame.setState({
          cash: cash - action.cost - penalty,
          fbiHeat: 0,
          wifeSuspicion: 0,
        })
        setPurchased(prev => new Set(prev).add(action.id))
        useGame.setState({
          activeBuyMessage: `${action.emoji} You are now someone else. Lost ${formatPrice(penalty + action.cost)}.`,
        })
        break
      }
      case 'leak_to_press': {
        const failed = Math.random() < (action.failureChance ?? 0)
        if (failed) {
          increaseFBIHeat(action.failureFbiHeatChange ?? 35)
          useGame.setState({
            activeErrorMessage: `${action.emoji} ${action.failureMessage ?? 'OPERATION FAILED'}`,
          })
        } else {
          increaseFBIHeat(action.fbiHeatChange ?? 20)
          useGame.setState({
            activeBuyMessage: `${action.emoji} Story published. Market impact imminent.`,
          })
        }
        break
      }
      default:
        break
    }
  }

  return (
    <div className={`flex-1 overflow-auto ${isModern3 ? 'p-2' : ''}`}>
      {/* Heat Bars Section */}
      <div className={`p-3 ${isModern3 ? '' : 'border-b border-mh-border'}`}>
        <div className="text-[10px] font-bold text-mh-text-dim uppercase tracking-wider mb-2">
          Heat Status
        </div>
        <div className="space-y-2">
          {/* FBI Heat */}
          <div className="relative h-7 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                width: `${fbiHeat}%`,
                backgroundColor: getFbiColor(fbiHeat),
              }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <div className="text-xs font-bold text-white z-10">FBI</div>
              <div className="text-xs font-bold text-gray-400 z-10">{fbiHeat.toFixed(1)}%</div>
            </div>
          </div>

          {/* Wife Heat */}
          <div className="relative h-7 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                width: `${wifeSuspicion}%`,
                backgroundColor: getWifeColor(wifeSuspicion),
              }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <div className="text-xs font-bold text-white z-10">WIFE</div>
              <div className="text-xs font-bold text-gray-400 z-10">{wifeSuspicion.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Actions List */}
      <div className={isModern3 ? 'space-y-2 mt-2' : ''}>
        {DARK_ACTIONS.map(action => {
          const isPurchased = action.type === 'one-time' && purchased.has(action.id)
          const canAfford = cash >= action.cost
          const isFree = action.cost === 0

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
                      <span className="text-xs text-[#ffd700] font-bold">DONE</span>
                    )}
                  </div>
                  <div className="text-xs text-mh-text-dim mt-0.5 line-clamp-2">
                    {action.description}
                  </div>
                  <div className="text-[10px] text-amber-400 mt-1">
                    {action.effect}
                  </div>

                  {/* Heat change indicators */}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {action.wifeHeatChange != null && action.wifeHeatChange > 0 && (
                      <span className="text-[10px] font-bold text-red-400">
                        +{action.wifeHeatChange}% WIFE
                      </span>
                    )}
                    {action.wifeHeatChange != null && action.wifeHeatChange < 0 && (
                      <span className="text-[10px] font-bold text-green-400">
                        {action.wifeHeatChange}% WIFE
                      </span>
                    )}
                    {action.fbiHeatChange != null && action.fbiHeatChange > 0 && (
                      <span className="text-[10px] font-bold text-red-400">
                        +{action.fbiHeatChange}% FBI
                      </span>
                    )}
                    {action.fbiHeatChange != null && action.fbiHeatChange < 0 && (
                      <span className="text-[10px] font-bold text-green-400">
                        {action.fbiHeatChange}% FBI
                      </span>
                    )}
                    {action.failureChance != null && action.failureChance > 0 && (
                      <span className="text-[10px] font-bold text-red-400">
                        {Math.round(action.failureChance * 100)}% failure risk
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-mh-text-main">
                      {isFree ? 'FREE' : formatPrice(action.cost)}
                    </span>
                    {!isPurchased ? (
                      <button
                        onClick={() => handleAction(action)}
                        disabled={!canAfford && !isFree}
                        className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${
                          canAfford || isFree
                            ? 'bg-red-900/60 text-red-300 hover:bg-red-800/70 border border-red-700/40'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        EXECUTE
                      </button>
                    ) : (
                      <span className="text-xs text-[#ffd700] font-bold">EXECUTED</span>
                    )}
                  </div>
                  {!canAfford && !isFree && !isPurchased && (
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
    </div>
  )
}
