'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { LUXURY_ASSETS } from '@/lib/game/lifestyleAssets'
import { Portal } from '@/components/ui/Portal'
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
  const { cash, ownedLuxury, buyLuxuryAsset, sellLuxuryAsset, selectedTheme } = useGame()
  const isModern3 = selectedTheme === 'modern3' || selectedTheme === 'modern3list'
  const isRetro2 = selectedTheme === 'retro2'
  const [sellConfirmAsset, setSellConfirmAsset] = useState<LuxuryAsset | null>(null)

  const handleClick = (asset: LuxuryAsset) => {
    const isOwned = ownedLuxury.includes(asset.id)
    if (isOwned) {
      setSellConfirmAsset(asset)
    } else if (cash >= asset.basePrice) {
      buyLuxuryAsset(asset.id)
    }
  }

  const handleSell = (asset: LuxuryAsset) => {
    sellLuxuryAsset(asset.id)
    setSellConfirmAsset(null)
  }

  return (
    <div className={`flex-1 overflow-auto ${isModern3 ? 'p-2 space-y-2' : ''}`}>
      {LUXURY_ASSETS.map(asset => {
        const isOwned = ownedLuxury.includes(asset.id)
        const canAfford = cash >= asset.basePrice

        return (
          <button
            key={asset.id}
            onClick={() => handleClick(asset)}
            disabled={!isOwned && !canAfford}
            className={`w-full p-3 text-left transition-colors ${
              isModern3
                ? `rounded-lg bg-[#0f1419] ${isOwned ? 'border border-[#ffd700]/30' : ''}`
                : `border-b border-mh-border ${
                    isOwned
                      ? 'bg-[#1a1500] hover:bg-[#221c00]'
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
                  {asset.dailyCost < 0 && (
                    <span className="text-xs font-bold text-mh-profit-green">
                      +{formatPrice(Math.abs(asset.dailyCost))}/day
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
                {isOwned && (
                  <div className="text-[10px] text-mh-text-dim mt-1">
                    Tap to sell for {formatPrice(Math.floor(asset.basePrice * 0.80))}
                  </div>
                )}
              </div>
            </div>
          </button>
        )
      })}

      {/* Sell Confirmation Sheet */}
      {sellConfirmAsset && (() => {
        const sellPrice = Math.floor(sellConfirmAsset.basePrice * 0.80)
        const loss = sellConfirmAsset.basePrice - sellPrice

        return (
          <Portal>
            <div
              className="fixed top-0 left-0 right-0 bottom-0 bg-black/95 z-[999] flex items-end justify-center"
              onClick={() => setSellConfirmAsset(null)}
            >
              <div
                className={`w-full max-w-[400px] p-4 pb-8 animate-slide-up ${
                  isModern3
                    ? 'bg-[#0f1419] rounded-t-xl'
                    : isRetro2
                      ? 'bg-[#0f1812] border-t border-mh-border'
                      : 'bg-[#111920] border-t border-mh-border'
                }`}
                style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))', ...(isModern3 ? { boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)' } : {}) }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">{sellConfirmAsset.emoji}</div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-mh-text-bright">
                      Sell {sellConfirmAsset.name}?
                    </div>
                    <div className="text-sm text-mh-text-dim mt-1">
                      {sellConfirmAsset.description}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-lg font-bold text-mh-text-main">
                        {formatPrice(sellPrice)}
                      </span>
                      <span className="text-sm font-bold text-mh-loss-red">
                        -{formatPrice(loss)} (-20% depreciation)
                      </span>
                    </div>
                    <div className="text-xs text-mh-text-dim mt-1">
                      Original price: {formatPrice(sellConfirmAsset.basePrice)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSellConfirmAsset(null)}
                    className="flex-1 py-3 rounded text-base font-bold font-mono bg-[#1a2a3a] text-mh-text-dim hover:bg-[#243444]"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => handleSell(sellConfirmAsset)}
                    className={`flex-1 py-3 rounded text-base font-bold font-mono transition-colors ${
                      isRetro2
                        ? 'bg-[#150d0d] text-mh-loss-red hover:bg-[#1a1010] border border-mh-accent-blue/30'
                        : 'bg-[#200a0a] text-mh-loss-red hover:bg-[#2a0d0d] border border-mh-loss-red/30'
                    }`}
                  >
                    SELL
                  </button>
                </div>
              </div>
            </div>
          </Portal>
        )
      })()}
    </div>
  )
}
