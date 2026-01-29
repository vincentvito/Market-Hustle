'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { PROPERTIES, JETS, TEAMS } from '@/lib/game/lifestyleAssets'
import { Portal } from '@/components/ui/Portal'
import type { LifestyleAsset, LifestyleCategory } from '@/lib/game/types'

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

function formatReturn(dailyReturn: number, category: LifestyleCategory): string {
  if (category === 'jet') {
    // Jets have fixed daily costs (dailyReturn is a dollar amount)
    const cost = Math.abs(dailyReturn)
    if (cost >= 1_000_000) {
      return `-$${(cost / 1_000_000).toFixed(1)}M/day`
    }
    return `-$${(cost / 1_000).toFixed(0)}K/day`
  }
  // Properties and teams use percentage of purchase price
  const pct = (dailyReturn * 100).toFixed(1)
  if (dailyReturn > 0) return `+${pct}%/day`
  return `${pct}%/day`
}

const CATEGORIES: { id: LifestyleCategory; label: string; emoji: string }[] = [
  { id: 'property', label: 'PROPERTIES', emoji: '🏠' },
  { id: 'jet', label: 'JETS', emoji: '✈️' },
  { id: 'team', label: 'TEAMS', emoji: '🏆' },
]

export function LifestyleCatalog() {
  const { lifestylePrices, ownedLifestyle, cash, buyLifestyle, sellLifestyle, selectedTheme } = useGame()
  const isRetro2 = selectedTheme === 'retro2'
  const isModern3 = selectedTheme === 'modern3'
  const [activeCategory, setActiveCategory] = useState<LifestyleCategory>('property')
  const [selectedAsset, setSelectedAsset] = useState<LifestyleAsset | null>(null)
  const [sellConfirmAsset, setSellConfirmAsset] = useState<LifestyleAsset | null>(null)

  const assets = activeCategory === 'property' ? PROPERTIES
    : activeCategory === 'jet' ? JETS
    : TEAMS

  const ownedIds = new Set(ownedLifestyle.map(o => o.assetId))
  const ownedMap = new Map(ownedLifestyle.map(o => [o.assetId, o]))

  const handleBuy = (asset: LifestyleAsset) => {
    const price = lifestylePrices[asset.id] || asset.basePrice
    if (cash >= price) {
      buyLifestyle(asset.id)
      setSelectedAsset(null)
    }
  }

  const handleSell = (asset: LifestyleAsset) => {
    sellLifestyle(asset.id)
    setSellConfirmAsset(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Category Sub-tabs */}
      <div className={`flex ${
        isModern3
          ? 'gap-1 p-1 bg-[#0f1419] rounded'
          : 'border-b border-mh-border bg-[#0a1218]'
      }`}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-1 py-2 text-xs font-bold transition-colors ${
              isModern3
                ? `rounded ${activeCategory === cat.id
                    ? 'text-[#0a0e14] bg-[#00d4aa]'
                    : 'text-mh-text-dim hover:text-mh-text-bright'}`
                : `font-mono ${activeCategory === cat.id
                    ? 'text-mh-text-bright bg-[#111920] border-b border-mh-accent-blue'
                    : 'text-mh-text-dim hover:text-mh-text-main'}`
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Asset List */}
      <div className={`flex-1 overflow-auto ${isModern3 ? 'p-2 space-y-2' : ''}`}>
        {assets.map(asset => {
          const price = lifestylePrices[asset.id] || asset.basePrice
          const isOwned = ownedIds.has(asset.id)
          const ownedItem = ownedMap.get(asset.id)
          const profitLoss = isOwned && ownedItem ? price - ownedItem.purchasePrice : 0
          const profitLossPct = isOwned && ownedItem ? ((price / ownedItem.purchasePrice) - 1) * 100 : 0

          return (
            <button
              key={asset.id}
              onClick={() => isOwned ? setSellConfirmAsset(asset) : setSelectedAsset(asset)}
              className={`w-full p-3 text-left transition-colors ${
                isModern3
                  ? `rounded-lg bg-[#0f1419] ${isOwned ? 'border border-[#00d4aa]/30' : ''}`
                  : `border-b border-mh-border ${
                      isOwned
                        ? isRetro2 ? 'bg-[#0d1a10] hover:bg-[#111a14]' : 'bg-[#0d1a24] hover:bg-[#111920]'
                        : 'bg-mh-bg hover:bg-[#111920]'
                    }`
              }`}
              style={isModern3 ? {
                boxShadow: isOwned
                  ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                  : '0 2px 6px rgba(0, 0, 0, 0.2)'
              } : undefined}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{asset.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-mh-text-bright truncate">
                      {asset.name}
                    </span>
                    {isOwned && (
                      <span className="text-xs text-mh-accent-blue font-bold">OWNED</span>
                    )}
                  </div>
                  <div className="text-xs text-mh-text-dim mt-0.5 line-clamp-1">
                    {asset.description}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-bold text-mh-text-main">
                      {formatPrice(price)}
                    </span>
                    <span className={`text-xs font-bold ${
                      asset.dailyReturn > 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                    }`}>
                      {formatReturn(asset.dailyReturn, asset.category)}
                    </span>
                    {isOwned && (
                      <span className={`text-xs font-bold ${
                        profitLoss >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                      }`}>
                        {profitLoss >= 0 ? '+' : ''}{profitLossPct.toFixed(0)}% P/L
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Purchase Confirmation Sheet - rendered via Portal to escape overflow:hidden */}
      {selectedAsset && (
        <Portal>
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/60 z-[999] flex items-end md:items-center justify-center"
            onClick={() => setSelectedAsset(null)}
          >
            <div
              className={`w-full max-w-[400px] md:max-w-[480px] p-4 pb-8 md:p-6 md:pb-6 animate-slide-up md:animate-none ${
                isModern3
                  ? 'bg-[#0f1419] rounded-t-xl md:rounded-xl'
                  : isRetro2
                    ? 'bg-[#0f1812] border-t border-mh-border md:rounded-xl md:border'
                    : 'bg-[#111920] border-t border-mh-border md:rounded-xl md:border'
              }`}
              style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))', ...(isModern3 ? { boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)' } : {}) }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="text-3xl md:text-4xl">{selectedAsset.emoji}</div>
                <div className="flex-1">
                  <div className="text-lg md:text-xl font-bold text-mh-text-bright">
                    {selectedAsset.name}
                  </div>
                  <div className="text-sm md:text-base text-mh-text-dim mt-1">
                    {selectedAsset.description}
                  </div>
                  <div className="flex items-center gap-4 mt-2 md:mt-3">
                    <span className="text-lg md:text-xl font-bold text-mh-text-main">
                      {formatPrice(lifestylePrices[selectedAsset.id] || selectedAsset.basePrice)}
                    </span>
                    <span className={`text-sm md:text-base font-bold ${
                      selectedAsset.dailyReturn > 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                    }`}>
                      {formatReturn(selectedAsset.dailyReturn, selectedAsset.category)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 md:gap-3">
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="flex-1 py-3 md:py-4 rounded text-base md:text-lg font-bold font-mono bg-[#1a2a3a] text-mh-text-dim hover:bg-[#243444]"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleBuy(selectedAsset)}
                  disabled={cash < (lifestylePrices[selectedAsset.id] || selectedAsset.basePrice)}
                  className={`flex-1 py-3 md:py-4 rounded text-base md:text-lg font-bold font-mono transition-colors ${
                    cash >= (lifestylePrices[selectedAsset.id] || selectedAsset.basePrice)
                      ? isRetro2
                        ? 'bg-[#0a2015] text-mh-profit-green hover:bg-[#0d2a1a] border border-mh-profit-green/30 shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                        : 'bg-mh-profit-green/20 text-mh-profit-green hover:bg-mh-profit-green/30 border-2 border-mh-profit-green/60'
                      : 'bg-[#111920] text-mh-border border border-mh-border/30'
                  }`}
                >
                  BUY
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Sell Confirmation Sheet - rendered via Portal to escape overflow:hidden */}
      {sellConfirmAsset && (() => {
        const price = lifestylePrices[sellConfirmAsset.id] || sellConfirmAsset.basePrice
        const ownedItem = ownedMap.get(sellConfirmAsset.id)
        const profitLoss = ownedItem ? price - ownedItem.purchasePrice : 0
        const profitLossPct = ownedItem ? ((price / ownedItem.purchasePrice) - 1) * 100 : 0

        return (
          <Portal>
            <div
              className="fixed top-0 left-0 right-0 bottom-0 bg-black/60 z-[999] flex items-end md:items-center justify-center"
              onClick={() => setSellConfirmAsset(null)}
            >
              <div
                className={`w-full max-w-[400px] md:max-w-[480px] p-4 pb-8 md:p-6 md:pb-6 animate-slide-up md:animate-none ${
                  isModern3
                    ? 'bg-[#0f1419] rounded-t-xl md:rounded-xl'
                    : isRetro2
                      ? 'bg-[#0f1812] border-t border-mh-border md:rounded-xl md:border'
                      : 'bg-[#111920] border-t border-mh-border md:rounded-xl md:border'
                }`}
                style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))', ...(isModern3 ? { boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)' } : {}) }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="text-3xl md:text-4xl">{sellConfirmAsset.emoji}</div>
                  <div className="flex-1">
                    <div className="text-lg md:text-xl font-bold text-mh-text-bright">
                      Sell {sellConfirmAsset.name}?
                    </div>
                    <div className="text-sm md:text-base text-mh-text-dim mt-1">
                      {sellConfirmAsset.description}
                    </div>
                    <div className="flex items-center gap-4 mt-2 md:mt-3">
                      <span className="text-lg md:text-xl font-bold text-mh-text-main">
                        {formatPrice(price)}
                      </span>
                      <span className={`text-sm md:text-base font-bold ${
                        profitLoss >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                      }`}>
                        {profitLoss >= 0 ? '+' : ''}{formatPrice(Math.abs(profitLoss))} ({profitLossPct >= 0 ? '+' : ''}{profitLossPct.toFixed(0)}%)
                      </span>
                    </div>
                    {ownedItem && (
                      <div className="text-xs text-mh-text-dim mt-1">
                        Bought for {formatPrice(ownedItem.purchasePrice)} on Day {ownedItem.purchaseDay}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 md:gap-3">
                  <button
                    onClick={() => setSellConfirmAsset(null)}
                    className="flex-1 py-3 md:py-4 rounded text-base md:text-lg font-bold font-mono bg-[#1a2a3a] text-mh-text-dim hover:bg-[#243444]"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => handleSell(sellConfirmAsset)}
                    className={`flex-1 py-3 md:py-4 rounded text-base md:text-lg font-bold font-mono transition-colors ${
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
