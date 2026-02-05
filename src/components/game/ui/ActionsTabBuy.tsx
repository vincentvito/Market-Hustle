'use client'

import { useGame } from '@/hooks/useGame'
import { LUXURY_ASSETS } from '@/lib/game/lifestyleAssets'
import type { LuxuryAsset } from '@/lib/game/types'

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

export function ActionsTabBuy() {
  const { cash, ownedLuxury, buyLuxuryAsset, selectedTheme } = useGame()
  const isModern3 = selectedTheme === 'modern3'

  const handleBuy = (asset: LuxuryAsset) => {
    if (cash >= asset.basePrice && !ownedLuxury.includes(asset.id)) {
      buyLuxuryAsset(asset.id)
    }
  }

  return (
    <div className={`flex-1 overflow-auto ${isModern3 ? 'p-2 space-y-2' : ''}`}>
      {LUXURY_ASSETS.map(asset => {
        const isOwned = ownedLuxury.includes(asset.id)
        const canAfford = cash >= asset.basePrice

        return (
          <button
            key={asset.id}
            onClick={() => handleBuy(asset)}
            disabled={isOwned || !canAfford}
            className={`w-full p-3 text-left transition-colors ${
              isModern3
                ? `rounded-lg bg-[#0f1419] ${isOwned ? 'border border-[#ffd700]/30 opacity-60' : ''}`
                : `border-b border-mh-border ${
                    isOwned
                      ? 'bg-[#1a1500] opacity-60'
                      : 'bg-mh-bg hover:bg-[#111920]'
                  }`
            } ${!canAfford && !isOwned ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={isModern3 ? {
              boxShadow: isOwned
                ? '0 2px 8px rgba(255, 215, 0, 0.15)'
                : '0 2px 6px rgba(0, 0, 0, 0.2)'
            } : undefined}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{asset.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-mh-text-bright truncate">
                    {asset.name}
                  </span>
                  {isOwned && (
                    <span className="text-xs text-[#ffd700] font-bold">OWNED</span>
                  )}
                </div>
                <div className="text-xs text-mh-text-dim mt-0.5 line-clamp-1">
                  {asset.description}
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-sm font-bold text-mh-text-main">
                    {formatPrice(asset.basePrice)}
                  </span>
                  {asset.dailyCost > 0 && (
                    <span className="text-xs font-bold text-mh-loss-red">
                      -{formatPrice(asset.dailyCost)}/day
                    </span>
                  )}
                  {asset.dailyCost === 0 && (
                    <span className="text-xs font-bold text-mh-profit-green">
                      No upkeep
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-amber-400 mt-1">
                  {asset.passiveBenefit}
                </div>
                {!canAfford && !isOwned && (
                  <div className="text-[10px] text-mh-loss-red mt-1">
                    Need {formatPrice(asset.basePrice - cash)} more
                  </div>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
