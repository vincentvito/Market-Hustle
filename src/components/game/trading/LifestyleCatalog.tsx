'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { PROPERTIES, JETS, TEAMS } from '@/lib/game/lifestyleAssets'
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
  const { lifestylePrices, ownedLifestyle, cash, buyLifestyle, sellLifestyle } = useGame()
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
      <div className="flex border-b border-mh-border bg-[#0a1218]">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-1 py-2 text-xs font-bold font-mono transition-colors ${
              activeCategory === cat.id
                ? 'text-mh-text-bright bg-[#111920] border-b border-mh-accent-blue'
                : 'text-mh-text-dim hover:text-mh-text-main'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-auto">
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
              className={`w-full p-3 border-b border-mh-border text-left transition-colors ${
                isOwned
                  ? 'bg-[#0d1a24] hover:bg-[#111920]'
                  : 'bg-mh-bg hover:bg-[#111920]'
              }`}
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

      {/* Purchase Confirmation Sheet */}
      {selectedAsset && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
          onClick={() => setSelectedAsset(null)}
        >
          <div
            className="w-full max-w-[400px] bg-[#111920] border-t border-mh-border p-4 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="text-3xl">{selectedAsset.emoji}</div>
              <div className="flex-1">
                <div className="text-lg font-bold text-mh-text-bright">
                  {selectedAsset.name}
                </div>
                <div className="text-sm text-mh-text-dim mt-1">
                  {selectedAsset.description}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-lg font-bold text-mh-text-main">
                    {formatPrice(lifestylePrices[selectedAsset.id] || selectedAsset.basePrice)}
                  </span>
                  <span className={`text-sm font-bold ${
                    selectedAsset.dailyReturn > 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                  }`}>
                    {formatReturn(selectedAsset.dailyReturn, selectedAsset.category)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedAsset(null)}
                className="flex-1 py-3 rounded text-base font-bold font-mono bg-[#1a2a3a] text-mh-text-dim hover:bg-[#243444]"
              >
                CANCEL
              </button>
              <button
                onClick={() => handleBuy(selectedAsset)}
                disabled={cash < (lifestylePrices[selectedAsset.id] || selectedAsset.basePrice)}
                className={`flex-1 py-3 rounded text-base font-bold font-mono transition-colors ${
                  cash >= (lifestylePrices[selectedAsset.id] || selectedAsset.basePrice)
                    ? 'bg-[#0a2015] text-mh-profit-green hover:bg-[#0d2a1a] border border-mh-profit-green/30'
                    : 'bg-[#111920] text-mh-border border border-mh-border/30'
                }`}
              >
                BUY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Confirmation Sheet */}
      {sellConfirmAsset && (() => {
        const price = lifestylePrices[sellConfirmAsset.id] || sellConfirmAsset.basePrice
        const ownedItem = ownedMap.get(sellConfirmAsset.id)
        const profitLoss = ownedItem ? price - ownedItem.purchasePrice : 0
        const profitLossPct = ownedItem ? ((price / ownedItem.purchasePrice) - 1) * 100 : 0

        return (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
            onClick={() => setSellConfirmAsset(null)}
          >
            <div
              className="w-full max-w-[400px] bg-[#111920] border-t border-mh-border p-4 animate-slide-up"
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
                      {formatPrice(price)}
                    </span>
                    <span className={`text-sm font-bold ${
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

              <div className="flex gap-2">
                <button
                  onClick={() => setSellConfirmAsset(null)}
                  className="flex-1 py-3 rounded text-base font-bold font-mono bg-[#1a2a3a] text-mh-text-dim hover:bg-[#243444]"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleSell(sellConfirmAsset)}
                  className="flex-1 py-3 rounded text-base font-bold font-mono transition-colors bg-[#200a0a] text-mh-loss-red hover:bg-[#2a0d0d] border border-mh-loss-red/30"
                >
                  SELL
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
