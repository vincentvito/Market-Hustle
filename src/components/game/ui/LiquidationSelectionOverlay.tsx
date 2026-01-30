'use client'

import { useState, useMemo } from 'react'
import { useGame } from '@/hooks/useGame'
import { ASSETS } from '@/lib/game/assets'
import { LIFESTYLE_ASSETS } from '@/lib/game/lifestyleAssets'

interface SelectedAsset {
  type: 'lifestyle' | 'trading'
  id: string
  currentValue: number
  quantity: number
}

export function LiquidationSelectionOverlay() {
  const { pendingLiquidation, confirmLiquidationSelection, holdings, prices, ownedLifestyle, lifestylePrices } = useGame()
  const [selected, setSelected] = useState<SelectedAsset[]>([])

  const formatMoney = (amount: number): string => {
    if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`
    return `$${Math.round(amount).toLocaleString()}`
  }

  const tradingAssets = useMemo(() => {
    if (!holdings || !prices) return []
    return Object.entries(holdings)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const asset = ASSETS.find(a => a.id === id)
        const price = prices[id] || 0
        return { id, name: asset?.name || id, quantity: qty, unitPrice: price, totalValue: qty * price }
      })
  }, [holdings, prices])

  const lifestyleItems = useMemo(() => {
    if (!ownedLifestyle) return []
    return ownedLifestyle.map(owned => {
      const asset = LIFESTYLE_ASSETS.find(a => a.id === owned.assetId)
      const currentPrice = lifestylePrices?.[owned.assetId] || owned.purchasePrice
      return { id: owned.assetId, name: asset?.name || owned.assetId, emoji: asset?.emoji || '🏠', currentValue: currentPrice }
    })
  }, [ownedLifestyle, lifestylePrices])

  const selectedTotal = useMemo(() => {
    return selected.reduce((sum, s) => sum + s.currentValue, 0)
  }, [selected])

  if (!pendingLiquidation) return null

  const { amountNeeded, reason } = pendingLiquidation
  const canConfirm = selectedTotal >= amountNeeded

  const isSelected = (type: 'lifestyle' | 'trading', id: string) =>
    selected.some(s => s.type === type && s.id === id)

  const toggleTrading = (asset: typeof tradingAssets[0]) => {
    if (isSelected('trading', asset.id)) {
      setSelected(prev => prev.filter(s => !(s.type === 'trading' && s.id === asset.id)))
    } else {
      setSelected(prev => [...prev, { type: 'trading', id: asset.id, currentValue: asset.totalValue, quantity: asset.quantity }])
    }
  }

  const toggleLifestyle = (item: typeof lifestyleItems[0]) => {
    if (isSelected('lifestyle', item.id)) {
      setSelected(prev => prev.filter(s => !(s.type === 'lifestyle' && s.id === item.id)))
    } else {
      setSelected(prev => [...prev, { type: 'lifestyle', id: item.id, currentValue: item.currentValue, quantity: 1 }])
    }
  }

  const reasonLabel = reason === 'sec' ? '⚖️ SEC PENALTY' : '💔 DIVORCE SETTLEMENT'
  const primaryColor = reason === 'sec' ? '#ff5252' : '#ff9800'

  return (
    <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-5">
      <div
        className="bg-mh-bg border-2 rounded-lg w-full max-w-[420px] max-h-[80vh] overflow-hidden flex flex-col"
        style={{ borderColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}40` }}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: `${primaryColor}40` }}>
          <div
            className="text-xs font-bold tracking-wider px-2 py-0.5 rounded inline-block mb-2"
            style={{ color: primaryColor, background: `${primaryColor}20` }}
          >
            {reasonLabel}
          </div>
          <div className="text-mh-text text-sm">
            Select assets worth at least <span className="font-bold" style={{ color: primaryColor }}>{formatMoney(amountNeeded)}</span> to cover the penalty.
          </div>
        </div>

        {/* Asset list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {tradingAssets.map(asset => (
            <button
              key={`trading-${asset.id}`}
              onClick={() => toggleTrading(asset)}
              className={`w-full flex items-center justify-between p-3 rounded border cursor-pointer transition-all text-left ${
                isSelected('trading', asset.id)
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-mh-border bg-mh-bg hover:bg-mh-border/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <div>
                  <div className="text-mh-text text-sm font-medium">{asset.name}</div>
                  <div className="text-mh-text-dim text-xs">{asset.quantity} shares</div>
                </div>
              </div>
              <div className="text-sm font-bold text-mh-text">{formatMoney(asset.totalValue)}</div>
            </button>
          ))}

          {lifestyleItems.map(item => (
            <button
              key={`lifestyle-${item.id}`}
              onClick={() => toggleLifestyle(item)}
              className={`w-full flex items-center justify-between p-3 rounded border cursor-pointer transition-all text-left ${
                isSelected('lifestyle', item.id)
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-mh-border bg-mh-bg hover:bg-mh-border/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.emoji}</span>
                <div className="text-mh-text text-sm font-medium">{item.name}</div>
              </div>
              <div className="text-sm font-bold text-mh-text">{formatMoney(item.currentValue)}</div>
            </button>
          ))}

          {tradingAssets.length === 0 && lifestyleItems.length === 0 && (
            <div className="text-center text-mh-text-dim text-sm py-4">No assets available</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-mh-border">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-mh-text-dim">Selected value:</span>
            <span className={`font-bold ${canConfirm ? 'text-green-400' : 'text-red-400'}`}>
              {formatMoney(selectedTotal)} / {formatMoney(amountNeeded)}
            </span>
          </div>
          <button
            onClick={() => confirmLiquidationSelection(selected)}
            disabled={!canConfirm}
            className="w-full py-3 rounded font-bold text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: canConfirm ? `${primaryColor}20` : undefined,
              border: `2px solid ${canConfirm ? primaryColor : '#555'}`,
              color: canConfirm ? primaryColor : '#555',
            }}
          >
            CONFIRM SEIZURE
          </button>
        </div>
      </div>
    </div>
  )
}
