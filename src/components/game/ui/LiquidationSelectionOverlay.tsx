'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { LIFESTYLE_ASSETS, LUXURY_ASSETS } from '@/lib/game/lifestyleAssets'
import { ASSETS } from '@/lib/game/assets'

interface SelectableAsset {
  type: 'luxury' | 'lifestyle' | 'leveraged' | 'short' | 'trading'
  id: string
  name: string
  emoji: string
  currentValue: number
  quantity: number
}

interface SelectedEntry {
  asset: SelectableAsset
  sellQuantity: number
}

const FRACTIONAL_ASSETS: Record<string, { step: number }> = {
  btc: { step: 0.001 },
  gold: { step: 0.01 },
}

function formatMoney(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  if (Math.abs(amount) >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${Math.round(amount).toLocaleString('en-US')}`
}

function formatQty(qty: number, assetId: string): string {
  const frac = FRACTIONAL_ASSETS[assetId]
  if (frac) {
    const decimals = frac.step < 0.01 ? 3 : 2
    return qty.toFixed(decimals)
  }
  return String(qty)
}

export function LiquidationSelectionOverlay() {
  const {
    pendingLiquidation,
    cash,
    holdings,
    prices,
    ownedLifestyle,
    lifestylePrices,
    ownedLuxury,
    leveragedPositions,
    shortPositions,
    selectedTheme,
    confirmLiquidationSelection,
    cancelStartupLiquidation,
  } = useGame()

  const [selectedEntries, setSelectedEntries] = useState<SelectedEntry[]>([])
  const isRetro2 = selectedTheme === 'retro2'

  if (!pendingLiquidation) return null

  const { amountNeeded, reason } = pendingLiquidation

  // Build list of all sellable assets
  const selectableAssets: SelectableAsset[] = [
    // Luxury assets (fixed price)
    ...ownedLuxury.map(luxuryId => {
      const asset = LUXURY_ASSETS.find(a => a.id === luxuryId)
      return {
        type: 'luxury' as const,
        id: luxuryId,
        name: asset?.name || 'Unknown',
        emoji: asset?.emoji || '💎',
        currentValue: asset?.basePrice || 0,
        quantity: 1,
      }
    }),
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
    // Leveraged positions (equity = value - debt)
    ...leveragedPositions
      .map(pos => {
        const currentPrice = prices[pos.assetId] || 0
        const equity = Math.max(0, (currentPrice * pos.qty) - pos.debtAmount)
        const asset = ASSETS.find(a => a.id === pos.assetId)
        return {
          type: 'leveraged' as const,
          id: pos.id,
          name: `${asset?.name || pos.assetId} (Leveraged)`,
          emoji: '📊',
          currentValue: equity,
          quantity: pos.qty,
        }
      })
      .filter(a => a.currentValue > 0),
    // Short positions (profit = cashReceived - liability)
    ...shortPositions
      .map(pos => {
        const currentPrice = prices[pos.assetId] || 0
        const liability = currentPrice * pos.qty
        const profit = Math.max(0, pos.cashReceived - liability)
        const asset = ASSETS.find(a => a.id === pos.assetId)
        return {
          type: 'short' as const,
          id: pos.id,
          name: `${asset?.name || pos.assetId} (Short)`,
          emoji: '📉',
          currentValue: profit,
          quantity: pos.qty,
        }
      })
      .filter(a => a.currentValue > 0),
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

  // Calculate totals - cash is used first, so we need to cover the shortfall
  const shortfall = Math.max(0, amountNeeded - cash)
  const selectedValue = selectedEntries.reduce((sum, entry) => {
    if (entry.asset.type === 'trading') {
      const pricePerUnit = entry.asset.quantity > 0 ? entry.asset.currentValue / entry.asset.quantity : 0
      return sum + pricePerUnit * entry.sellQuantity
    }
    return sum + entry.asset.currentValue
  }, 0)
  const remaining = Math.max(0, shortfall - selectedValue)
  const canConfirm = remaining <= 0
  const progress = shortfall > 0 ? Math.min((selectedValue / shortfall) * 100, 100) : 100

  // Check if a trading asset supports partial selling
  const isPartialEligible = (asset: SelectableAsset) => {
    if (asset.type !== 'trading') return false
    const frac = FRACTIONAL_ASSETS[asset.id]
    return frac ? asset.quantity > frac.step : asset.quantity > 1
  }

  // Get the step size for a trading asset
  const getStep = (assetId: string) => FRACTIONAL_ASSETS[assetId]?.step || 1

  // Toggle asset selection
  const toggleAsset = (asset: SelectableAsset) => {
    setSelectedEntries(prev => {
      const exists = prev.find(e => e.asset.id === asset.id && e.asset.type === asset.type)
      if (exists) {
        return prev.filter(e => !(e.asset.id === asset.id && e.asset.type === asset.type))
      }
      // For partial-eligible trading assets, compute a smart default quantity
      if (isPartialEligible(asset)) {
        const pricePerUnit = asset.quantity > 0 ? asset.currentValue / asset.quantity : 0
        // Recalculate remaining based on current selections (before adding this one)
        const currentSelected = prev.reduce((sum, e) => {
          if (e.asset.type === 'trading') {
            const ppu = e.asset.quantity > 0 ? e.asset.currentValue / e.asset.quantity : 0
            return sum + ppu * e.sellQuantity
          }
          return sum + e.asset.currentValue
        }, 0)
        const currentRemaining = Math.max(0, shortfall - currentSelected)
        const step = getStep(asset.id)
        const smartQty = pricePerUnit > 0
          ? Math.min(asset.quantity, Math.max(step, Math.ceil(currentRemaining / pricePerUnit / step) * step))
          : asset.quantity
        return [...prev, { asset, sellQuantity: smartQty }]
      }
      return [...prev, { asset, sellQuantity: asset.quantity }]
    })
  }

  // Update quantity for a partial-eligible asset
  const updateQuantity = (assetId: string, assetType: string, newQty: number) => {
    const step = getStep(assetId)
    setSelectedEntries(prev =>
      prev.map(entry =>
        entry.asset.id === assetId && entry.asset.type === assetType
          ? { ...entry, sellQuantity: Math.max(step, Math.min(Math.round(newQty / step) * step, entry.asset.quantity)) }
          : entry
      )
    )
  }

  // Select all
  const selectAll = () => {
    setSelectedEntries(selectableAssets.map(asset => ({
      asset,
      sellQuantity: asset.quantity,
    })))
  }

  // Handle confirm
  const handleConfirm = () => {
    if (canConfirm) {
      confirmLiquidationSelection(
        selectedEntries.map(entry => ({
          type: entry.asset.type,
          id: entry.asset.id,
          currentValue: entry.asset.type === 'trading' && entry.asset.quantity > 0
            ? (entry.asset.currentValue / entry.asset.quantity) * entry.sellQuantity
            : entry.asset.currentValue,
          quantity: entry.sellQuantity,
        }))
      )
      setSelectedEntries([])
    }
  }

  // Theming: voluntary investment vs forced seizure
  const isVoluntary = reason === 'startup_investment'
  const reasonText = reason === 'sec' ? 'SEC FINE' : reason === 'divorce' ? 'DIVORCE SETTLEMENT' : reason === 'startup_investment' ? 'STARTUP INVESTMENT' : 'PENALTY'
  // Use accent blue for voluntary, loss red for forced (retro2 always uses accent blue)
  const accentForced = isRetro2 || isVoluntary

  return (
    <div className="fixed inset-0 bg-black/95 z-[450] flex items-center justify-center p-5">
      <div
        className={`bg-mh-bg border-2 rounded-lg w-full max-w-[400px] overflow-hidden ${
          accentForced ? 'border-mh-accent-blue' : 'border-mh-loss-red'
        }`}
        style={accentForced ? { boxShadow: '0 0 20px rgba(0, 170, 255, 0.3)' } : { boxShadow: '0 0 20px rgba(255, 82, 82, 0.3)' }}
      >
        {/* Header */}
        <div
          className={`p-4 border-b ${
            accentForced
              ? 'bg-gradient-to-r from-[#0a150d] to-[#0d1a10] border-mh-accent-blue/30'
              : 'bg-gradient-to-r from-[#200a0a] to-[#2a0d0d] border-mh-loss-red/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">{isVoluntary ? '💼' : '⚖️'}</span>
            <div>
              <div className={`text-lg font-bold ${accentForced ? 'text-mh-accent-blue' : 'text-mh-loss-red'}`}>
                {isVoluntary ? 'SELL ASSETS TO INVEST' : 'ASSET SEIZURE'}
              </div>
              <div className="text-mh-text-dim text-xs">
                {isVoluntary
                  ? `Need ${formatMoney(shortfall)} more to invest`
                  : `${reasonText}: ${formatMoney(shortfall)} shortfall`
                }
                {cash > 0 && !isVoluntary && ` (${formatMoney(cash)} cash will be used)`}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-3 bg-[#0a0d10] border-b border-mh-border">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-mh-text-dim">Selected value</span>
            <span className={canConfirm ? 'text-mh-profit-green font-bold' : 'text-mh-text-main'}>
              {formatMoney(selectedValue)} / {formatMoney(shortfall)}
            </span>
          </div>
          <div className="w-full h-2 bg-[#1a2a3a] rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                canConfirm ? 'bg-mh-profit-green' : accentForced ? 'bg-mh-accent-blue' : 'bg-mh-loss-red'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {!canConfirm && (
            <div className={`text-xs mt-2 text-center ${accentForced ? 'text-mh-accent-blue' : 'text-mh-loss-red'}`}>
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
              <div className="text-3xl mb-2">{isVoluntary ? '📭' : '💀'}</div>
              <div className="text-sm">No assets to liquidate</div>
              {!isVoluntary && <div className="text-xs mt-1">Bankruptcy is inevitable</div>}
            </div>
          ) : (
            selectableAssets.map(asset => {
              const entry = selectedEntries.find(e => e.asset.id === asset.id && e.asset.type === asset.type)
              const isSelected = !!entry
              const canPartial = isPartialEligible(asset)
              const pricePerUnit = asset.quantity > 0 ? asset.currentValue / asset.quantity : 0
              const displayValue = isSelected && canPartial && entry
                ? pricePerUnit * entry.sellQuantity
                : asset.currentValue

              return (
                <div key={`${asset.type}-${asset.id}`}>
                  {/* Main asset row */}
                  <button
                    onClick={() => toggleAsset(asset)}
                    className={`w-full p-3 text-left border-b border-mh-border/50 transition-all cursor-pointer ${
                      isSelected
                        ? accentForced
                          ? 'bg-mh-accent-blue/20'
                          : 'bg-mh-loss-red/20'
                        : 'bg-transparent hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                          isSelected
                            ? accentForced
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
                          <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                            asset.type === 'luxury'
                              ? 'bg-amber-500/20 text-amber-400'
                              : asset.type === 'lifestyle'
                              ? 'bg-purple-500/20 text-purple-400'
                              : asset.type === 'leveraged'
                              ? 'bg-orange-500/20 text-orange-400'
                              : asset.type === 'short'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {asset.type === 'luxury' ? 'LUXURY' : asset.type === 'lifestyle' ? 'ASSET' : asset.type === 'leveraged' ? 'MARGIN' : asset.type === 'short' ? 'SHORT' : 'STOCK'}
                          </span>
                        </div>
                        {(asset.type === 'trading' || asset.type === 'leveraged' || asset.type === 'short') && (
                          <div className="text-xs text-mh-text-dim mt-0.5">
                            {formatQty(asset.quantity, asset.id)} {asset.type === 'trading' ? 'shares' : 'shares (equity)'}
                          </div>
                        )}
                      </div>

                      {/* Value */}
                      <div className={`text-right font-bold shrink-0 ${
                        isSelected
                          ? accentForced ? 'text-mh-accent-blue' : 'text-mh-loss-red'
                          : 'text-mh-text-main'
                      }`}>
                        <div>{formatMoney(displayValue)}</div>
                        {isSelected && canPartial && entry && entry.sellQuantity < asset.quantity && (
                          <div className="text-[10px] text-mh-text-dim font-normal">
                            of {formatMoney(asset.currentValue)}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Partial quantity selector for selected trading assets */}
                  {isSelected && canPartial && entry && (
                    <div className={`px-4 py-2.5 border-b border-mh-border/50 ${
                      accentForced ? 'bg-mh-accent-blue/5' : 'bg-mh-loss-red/5'
                    }`}>
                      <div className="flex items-center justify-between gap-2">
                        {/* -/+ controls */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(asset.id, asset.type, entry.sellQuantity - getStep(asset.id)) }}
                            disabled={entry.sellQuantity <= getStep(asset.id)}
                            className="w-7 h-7 rounded bg-mh-border/30 text-mh-text-main font-bold text-sm flex items-center justify-center disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-all hover:bg-mh-border/50"
                          >
                            -
                          </button>
                          <span className="text-mh-text-bright font-bold text-xs min-w-[70px] text-center">
                            {formatQty(entry.sellQuantity, asset.id)} / {formatQty(asset.quantity, asset.id)}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(asset.id, asset.type, entry.sellQuantity + getStep(asset.id)) }}
                            disabled={entry.sellQuantity >= asset.quantity}
                            className="w-7 h-7 rounded bg-mh-border/30 text-mh-text-main font-bold text-sm flex items-center justify-center disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-all hover:bg-mh-border/50"
                          >
                            +
                          </button>
                        </div>

                        {/* Quick-select percentages */}
                        <div className="flex gap-1">
                          {[25, 50, 75].map(pct => {
                            const step = getStep(asset.id)
                            const rawQty = asset.quantity * pct / 100
                            const qty = Math.max(step, Math.round(rawQty / step) * step)
                            const isActive = Math.abs(entry.sellQuantity - qty) < step * 0.5
                            return (
                              <button
                                key={pct}
                                onClick={(e) => { e.stopPropagation(); updateQuantity(asset.id, asset.type, qty) }}
                                className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer transition-all ${
                                  isActive
                                    ? accentForced
                                      ? 'bg-mh-accent-blue/30 text-mh-accent-blue'
                                      : 'bg-mh-loss-red/30 text-mh-loss-red'
                                    : 'bg-mh-border/20 text-mh-text-dim hover:bg-mh-border/40'
                                }`}
                              >
                                {pct}%
                              </button>
                            )
                          })}
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(asset.id, asset.type, asset.quantity) }}
                            className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer transition-all ${
                              Math.abs(entry.sellQuantity - asset.quantity) < getStep(asset.id) * 0.5
                                ? accentForced
                                  ? 'bg-mh-accent-blue/30 text-mh-accent-blue'
                                  : 'bg-mh-loss-red/30 text-mh-loss-red'
                                : 'bg-mh-border/20 text-mh-text-dim hover:bg-mh-border/40'
                            }`}
                          >
                            ALL
                          </button>
                        </div>
                      </div>
                      <div className="text-[10px] text-mh-text-dim mt-1.5">
                        Selling {formatQty(entry.sellQuantity, asset.id)} = {formatMoney(pricePerUnit * entry.sellQuantity)}
                      </div>
                    </div>
                  )}
                </div>
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
                ? accentForced
                  ? 'bg-mh-accent-blue/20 border-2 border-mh-accent-blue text-mh-accent-blue hover:bg-mh-accent-blue/30 cursor-pointer'
                  : 'bg-mh-loss-red/20 border-2 border-mh-loss-red text-mh-loss-red hover:bg-mh-loss-red/30 cursor-pointer'
                : 'bg-mh-border/30 border-2 border-mh-border text-mh-text-dim cursor-not-allowed'
            }`}
          >
            {canConfirm
              ? isVoluntary ? 'CONFIRM & INVEST' : 'CONFIRM LIQUIDATION'
              : 'SELECT MORE ASSETS'
            }
          </button>
          {isVoluntary && (
            <button
              onClick={cancelStartupLiquidation}
              className="w-full py-2 text-xs text-mh-text-dim border border-mh-border rounded hover:bg-mh-border/20 transition-all cursor-pointer"
            >
              CANCEL
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
