'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { LIFESTYLE_ASSETS } from '@/lib/game/lifestyleAssets'
import { ASSETS } from '@/lib/game/assets'

interface SelectableAsset {
  type: 'lifestyle' | 'trading'
  id: string
  name: string
  emoji: string
  currentValue: number
  quantity: number
}

function formatMoney(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  if (Math.abs(amount) >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${Math.round(amount).toLocaleString()}`
}

export function LiquidationSelectionOverlay() {
  const {
    pendingLiquidation,
    holdings,
    prices,
    ownedLifestyle,
    lifestylePrices,
    selectedTheme,
    confirmLiquidationSelection,
  } = useGame()

  const [selectedAssets, setSelectedAssets] = useState<SelectableAsset[]>([])
  const isRetro2 = selectedTheme === 'retro2'

  if (!pendingLiquidation) return null

  const { amountNeeded, reason } = pendingLiquidation

  // Build list of all sellable assets
  const selectableAssets: SelectableAsset[] = [
    // Lifestyle assets
    ...ownedLifestyle.map(owned => {
      const asset = LIFESTYLE_ASSETS.find(a => a.id === owned.assetId)
      return {
        type: 'lifestyle' as const,
        id: owned.assetId,
        name: asset?.name || 'Unknown Asset',
        emoji: asset?.emoji || '?',
        currentValue: lifestylePrices[owned.assetId] || 0,
        quantity: 1,
      }
    }),
    // Trading holdings
    ...Object.entries(holdings)
      .filter(([, qty]) => qty > 0)
      .map(([assetId, qty]) => {
        const asset = ASSETS.find(a => a.id === assetId)
        const currentPrice = prices[assetId] || 0
        return {
          type: 'trading' as const,
          id: assetId,
          name: asset?.name || assetId,
          emoji: '📈',
          currentValue: currentPrice * qty,
          quantity: qty,
        }
      }),
  ]

  // Calculate totals
  const selectedValue = selectedAssets.reduce((sum, a) => sum + a.currentValue, 0)
  const remaining = Math.max(0, amountNeeded - selectedValue)
  const canConfirm = remaining <= 0
  const progress = Math.min((selectedValue / amountNeeded) * 100, 100)

  // Toggle asset selection
  const toggleAsset = (asset: SelectableAsset) => {
    setSelectedAssets(prev => {
      const exists = prev.find(a => a.id === asset.id && a.type === asset.type)
      if (exists) {
        return prev.filter(a => !(a.id === asset.id && a.type === asset.type))
      }
      return [...prev, asset]
    })
  }

  // Select all
  const selectAll = () => {
    setSelectedAssets([...selectableAssets])
  }

  // Handle confirm
  const handleConfirm = () => {
    if (canConfirm) {
      confirmLiquidationSelection(selectedAssets)
      setSelectedAssets([])
    }
  }

  // Get reason text
  const reasonText = reason === 'sec' ? 'SEC FINE' : reason === 'divorce' ? 'DIVORCE SETTLEMENT' : 'PENALTY'

  return (
    <div className="fixed inset-0 bg-black/95 z-[450] flex items-center justify-center p-5">
      <div
        className={`bg-mh-bg border-2 rounded-lg w-full max-w-[400px] overflow-hidden ${
          isRetro2 ? 'border-mh-accent-blue' : 'border-mh-loss-red'
        }`}
        style={isRetro2 ? { boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' } : { boxShadow: '0 0 20px rgba(255, 82, 82, 0.3)' }}
      >
        {/* Header */}
        <div
          className={`p-4 border-b ${
            isRetro2
              ? 'bg-gradient-to-r from-[#0a150d] to-[#0d1a10] border-mh-accent-blue/30'
              : 'bg-gradient-to-r from-[#200a0a] to-[#2a0d0d] border-mh-loss-red/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">⚖️</span>
            <div>
              <div className={`text-lg font-bold ${isRetro2 ? 'text-mh-accent-blue' : 'text-mh-loss-red'}`}>
                ASSET SEIZURE
              </div>
              <div className="text-mh-text-dim text-xs">
                {reasonText}: {formatMoney(amountNeeded)} required
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-3 bg-[#0a0d10] border-b border-mh-border">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-mh-text-dim">Selected value</span>
            <span className={canConfirm ? 'text-mh-profit-green font-bold' : 'text-mh-text-main'}>
              {formatMoney(selectedValue)} / {formatMoney(amountNeeded)}
            </span>
          </div>
          <div className="w-full h-2 bg-[#1a2a3a] rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                canConfirm ? 'bg-mh-profit-green' : isRetro2 ? 'bg-mh-accent-blue' : 'bg-mh-loss-red'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {!canConfirm && (
            <div className="text-xs text-mh-loss-red mt-2 text-center">
              Need {formatMoney(remaining)} more
            </div>
          )}
          {canConfirm && (
            <div className="text-xs text-mh-profit-green mt-2 text-center">
              ✓ Sufficient assets selected
            </div>
          )}
        </div>

        {/* Asset List */}
        <div className="max-h-[300px] overflow-y-auto">
          {selectableAssets.length === 0 ? (
            <div className="p-6 text-center text-mh-text-dim">
              <div className="text-3xl mb-2">💀</div>
              <div className="text-sm">No assets to liquidate</div>
              <div className="text-xs mt-1">Bankruptcy is inevitable</div>
            </div>
          ) : (
            selectableAssets.map(asset => {
              const isSelected = selectedAssets.some(a => a.id === asset.id && a.type === asset.type)
              return (
                <button
                  key={`${asset.type}-${asset.id}`}
                  onClick={() => toggleAsset(asset)}
                  className={`w-full p-3 text-left border-b border-mh-border/50 transition-all cursor-pointer ${
                    isSelected
                      ? isRetro2
                        ? 'bg-mh-accent-blue/20'
                        : 'bg-mh-loss-red/20'
                      : 'bg-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? isRetro2
                            ? 'bg-mh-accent-blue border-mh-accent-blue'
                            : 'bg-mh-loss-red border-mh-loss-red'
                          : 'border-mh-border bg-transparent'
                      }`}
                    >
                      {isSelected && <span className="text-white text-xs">✓</span>}
                    </div>

                    {/* Asset Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{asset.emoji}</span>
                        <span className="text-mh-text-bright font-bold text-sm truncate">
                          {asset.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          asset.type === 'lifestyle'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {asset.type === 'lifestyle' ? 'ASSET' : 'STOCK'}
                        </span>
                      </div>
                      {asset.type === 'trading' && (
                        <div className="text-xs text-mh-text-dim mt-0.5">
                          {asset.quantity} shares
                        </div>
                      )}
                    </div>

                    {/* Value */}
                    <div className={`text-right font-bold ${
                      isSelected
                        ? isRetro2 ? 'text-mh-accent-blue' : 'text-mh-loss-red'
                        : 'text-mh-text-main'
                    }`}>
                      {formatMoney(asset.currentValue)}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-mh-border space-y-2">
          {selectableAssets.length > 0 && (
            <button
              onClick={selectAll}
              className="w-full py-2 text-xs text-mh-text-dim border border-mh-border rounded hover:bg-mh-border/20 transition-all cursor-pointer"
            >
              SELECT ALL
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`w-full py-3 rounded font-bold text-sm transition-all ${
              canConfirm
                ? isRetro2
                  ? 'bg-mh-accent-blue/20 border-2 border-mh-accent-blue text-mh-accent-blue hover:bg-mh-accent-blue/30 cursor-pointer'
                  : 'bg-mh-loss-red/20 border-2 border-mh-loss-red text-mh-loss-red hover:bg-mh-loss-red/30 cursor-pointer'
                : 'bg-mh-border/30 border-2 border-mh-border text-mh-text-dim cursor-not-allowed'
            }`}
          >
            {canConfirm ? 'CONFIRM LIQUIDATION' : 'SELECT MORE ASSETS'}
          </button>
        </div>
      </div>
    </div>
  )
}
