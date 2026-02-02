'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { PROPERTIES, PRIVATE_EQUITY, LUXURY_ASSETS, RISK_TIER_COLORS, RISK_TIER_LABELS, getPEAbilities, PE_ABILITIES } from '@/lib/game/lifestyleAssets'
import { Portal } from '@/components/ui/Portal'
import type { LifestyleAsset, LifestyleCategory, LuxuryAsset, LuxuryAssetId, PEAbilityId } from '@/lib/game/types'

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

function formatReturn(dailyReturn: number): string {
  // Properties and teams use percentage of purchase price
  const pct = (dailyReturn * 100).toFixed(1)
  if (dailyReturn > 0) return `+${pct}%/day`
  return `${pct}%/day`
}

type CategoryId = LifestyleCategory | 'luxury'

const CATEGORIES: { id: CategoryId; label: string; emoji: string }[] = [
  { id: 'property', label: 'PROPERTIES', emoji: '🏠' },
  { id: 'private_equity', label: 'PRIVATE EQUITY', emoji: '💼' },
  { id: 'luxury', label: 'LUXURY', emoji: '✨' },
]

export function LifestyleCatalog() {
  const { lifestylePrices, ownedLifestyle, ownedLuxury, cash, buyLifestyle, sellLifestyle, buyLuxuryAsset, sellLuxuryAsset, selectedTheme, executePEAbility, canExecutePEAbility, getPEAbilityStatus } = useGame()
  const isRetro2 = selectedTheme === 'retro2'
  const isModern3 = selectedTheme === 'modern3'
  const [activeCategory, setActiveCategory] = useState<CategoryId>('property')
  const [selectedAsset, setSelectedAsset] = useState<LifestyleAsset | null>(null)
  const [sellConfirmAsset, setSellConfirmAsset] = useState<LifestyleAsset | null>(null)
  const [selectedLuxuryAsset, setSelectedLuxuryAsset] = useState<LuxuryAsset | null>(null)
  const [sellConfirmLuxury, setSellConfirmLuxury] = useState<LuxuryAsset | null>(null)
  const [selectedPEAsset, setSelectedPEAsset] = useState<LifestyleAsset | null>(null) // PE bottom sheet
  const [sellConfirmPE, setSellConfirmPE] = useState<LifestyleAsset | null>(null) // PE sell confirmation

  const assets = activeCategory === 'property'
    ? PROPERTIES
    : activeCategory === 'private_equity'
      ? PRIVATE_EQUITY
      : []

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

  const handleBuyLuxury = (asset: LuxuryAsset) => {
    if (cash >= asset.basePrice) {
      buyLuxuryAsset(asset.id)
      setSelectedLuxuryAsset(null)
    }
  }

  const handleSellLuxury = (asset: LuxuryAsset) => {
    sellLuxuryAsset(asset.id)
    setSellConfirmLuxury(null)
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
            {cat.label}
          </button>
        ))}
      </div>

      {/* Luxury Assets */}
      {activeCategory === 'luxury' && (
        <div className={`flex-1 overflow-auto ${isModern3 ? 'p-2 space-y-2' : ''}`}>
          {LUXURY_ASSETS.map(asset => {
            const isOwned = ownedLuxury.includes(asset.id)
            const sellPrice = Math.floor(asset.basePrice * 0.80)

            return (
              <button
                key={asset.id}
                onClick={() => isOwned ? setSellConfirmLuxury(asset) : setSelectedLuxuryAsset(asset)}
                className={`w-full p-3 text-left transition-colors ${
                  isModern3
                    ? `rounded-lg bg-[#0f1419] ${isOwned ? 'border border-[#ffd700]/30' : ''}`
                    : `border-b border-mh-border ${
                        isOwned
                          ? 'bg-[#1a1500] hover:bg-[#221c00]'
                          : 'bg-mh-bg hover:bg-[#111920]'
                      }`
                }`}
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
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                        ✨ LUXURY
                      </span>
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
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Asset List - only for property and private_equity */}
      {activeCategory !== 'luxury' && (
      <div className={`flex-1 overflow-auto ${isModern3 ? 'p-2 space-y-2' : ''}`}>
        {assets.map(asset => {
          const price = lifestylePrices[asset.id] || asset.basePrice
          const isOwned = ownedIds.has(asset.id)
          const ownedItem = ownedMap.get(asset.id)
          const profitLoss = isOwned && ownedItem ? price - ownedItem.purchasePrice : 0
          const profitLossPct = isOwned && ownedItem ? ((price / ownedItem.purchasePrice) - 1) * 100 : 0
          const isPE = asset.category === 'private_equity'

          return (
            <button
              key={asset.id}
              onClick={() => {
                if (isPE) {
                  // PE assets open bottom sheet (like Luxury)
                  isOwned ? setSellConfirmPE(asset) : setSelectedPEAsset(asset)
                } else {
                  // Properties use the old buy/sell flow
                  isOwned ? setSellConfirmAsset(asset) : setSelectedAsset(asset)
                }
              }}
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-mh-text-bright truncate">
                      {asset.name}
                    </span>
                    {isOwned && (
                      <span className="text-xs text-mh-accent-blue font-bold">OWNED</span>
                    )}
                    {/* Risk tier badge for PE assets */}
                    {asset.riskTier && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                        style={{
                          color: RISK_TIER_COLORS[asset.riskTier],
                          background: `${RISK_TIER_COLORS[asset.riskTier]}20`,
                        }}
                      >
                        {RISK_TIER_LABELS[asset.riskTier]}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-mh-text-dim mt-0.5 line-clamp-1">
                    {asset.description}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-sm font-bold text-mh-text-main">
                      {formatPrice(price)}
                    </span>
                    <span className={`text-xs font-bold ${
                      asset.dailyReturn > 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                    }`}>
                      {formatReturn(asset.dailyReturn)}
                    </span>
                    {/* Failure risk indicator for high-risk PE */}
                    {asset.failureChancePerDay && asset.failureChancePerDay >= 0.005 && (
                      <span className="text-[10px] text-mh-loss-red">
                        ⚠️ {Math.round(asset.failureChancePerDay * 30 * 100)}%/mo risk
                      </span>
                    )}
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
      )}

      {/* Purchase Confirmation Sheet - rendered via Portal to escape overflow:hidden */}
      {selectedAsset && (
        <Portal>
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/95 z-[999] flex items-end md:items-center justify-center"
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
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="text-lg font-bold text-mh-text-main">
                      {formatPrice(lifestylePrices[selectedAsset.id] || selectedAsset.basePrice)}
                    </span>
                    <span className={`text-sm md:text-base font-bold ${
                      selectedAsset.dailyReturn > 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                    }`}>
                      {formatReturn(selectedAsset.dailyReturn)}
                    </span>
                    {/* Risk tier badge for PE */}
                    {selectedAsset.riskTier && (
                      <span
                        className="text-xs px-2 py-0.5 rounded font-bold"
                        style={{
                          color: RISK_TIER_COLORS[selectedAsset.riskTier],
                          background: `${RISK_TIER_COLORS[selectedAsset.riskTier]}20`,
                        }}
                      >
                        {RISK_TIER_LABELS[selectedAsset.riskTier]}
                      </span>
                    )}
                  </div>
                  {/* Failure risk warning for high-risk PE */}
                  {selectedAsset.failureChancePerDay && selectedAsset.failureChancePerDay >= 0.005 && (
                    <div className="mt-2 p-2 rounded text-xs bg-mh-loss-red/10 text-mh-loss-red">
                      <span className="font-bold">⚠️ HIGH RISK: </span>
                      ~{Math.round(selectedAsset.failureChancePerDay * 30 * 100)}% monthly chance of total loss
                    </div>
                  )}
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
              className="fixed top-0 left-0 right-0 bottom-0 bg-black/95 z-[999] flex items-end md:items-center justify-center"
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

      {/* Luxury Purchase Confirmation Sheet */}
      {selectedLuxuryAsset && (
        <Portal>
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/95 z-[999] flex items-end justify-center"
            onClick={() => setSelectedLuxuryAsset(null)}
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
                <div className="text-3xl">{selectedLuxuryAsset.emoji}</div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-mh-text-bright">
                    {selectedLuxuryAsset.name}
                  </div>
                  <div className="text-sm text-mh-text-dim mt-1">
                    {selectedLuxuryAsset.description}
                  </div>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="text-lg font-bold text-mh-text-main">
                      {formatPrice(selectedLuxuryAsset.basePrice)}
                    </span>
                    {selectedLuxuryAsset.dailyCost > 0 && (
                      <span className="text-sm font-bold text-mh-loss-red">
                        -{formatPrice(selectedLuxuryAsset.dailyCost)}/day
                      </span>
                    )}
                    {selectedLuxuryAsset.dailyCost === 0 && (
                      <span className="text-sm font-bold text-mh-profit-green">
                        No upkeep
                      </span>
                    )}
                  </div>
                  <div className="mt-2 p-2 rounded text-xs bg-amber-500/10 text-amber-400">
                    <span className="font-bold">✨ Benefit: </span>
                    {selectedLuxuryAsset.passiveBenefit}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLuxuryAsset(null)}
                  className="flex-1 py-3 rounded text-base font-bold font-mono bg-[#1a2a3a] text-mh-text-dim hover:bg-[#243444]"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleBuyLuxury(selectedLuxuryAsset)}
                  disabled={cash < selectedLuxuryAsset.basePrice}
                  className={`flex-1 py-3 rounded text-base font-bold font-mono transition-colors ${
                    cash >= selectedLuxuryAsset.basePrice
                      ? 'bg-[#1a1000] text-[#ffd700] hover:bg-[#221500] border border-[#ffd700]/30'
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

      {/* Luxury Sell Confirmation Sheet */}
      {sellConfirmLuxury && (() => {
        const sellPrice = Math.floor(sellConfirmLuxury.basePrice * 0.80)
        const loss = sellConfirmLuxury.basePrice - sellPrice
        const lossPct = -20

        return (
          <Portal>
            <div
              className="fixed top-0 left-0 right-0 bottom-0 bg-black/95 z-[999] flex items-end justify-center"
              onClick={() => setSellConfirmLuxury(null)}
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
                  <div className="text-3xl">{sellConfirmLuxury.emoji}</div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-mh-text-bright">
                      Sell {sellConfirmLuxury.name}?
                    </div>
                    <div className="text-sm text-mh-text-dim mt-1">
                      {sellConfirmLuxury.description}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-lg font-bold text-mh-text-main">
                        {formatPrice(sellPrice)}
                      </span>
                      <span className="text-sm font-bold text-mh-loss-red">
                        -{formatPrice(loss)} ({lossPct}% depreciation)
                      </span>
                    </div>
                    <div className="text-xs text-mh-text-dim mt-1">
                      Original price: {formatPrice(sellConfirmLuxury.basePrice)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSellConfirmLuxury(null)}
                    className="flex-1 py-3 rounded text-base font-bold font-mono bg-[#1a2a3a] text-mh-text-dim hover:bg-[#243444]"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => handleSellLuxury(sellConfirmLuxury)}
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

      {/* PE Purchase Bottom Sheet */}
      {selectedPEAsset && (() => {
        const basePrice = lifestylePrices[selectedPEAsset.id] || selectedPEAsset.basePrice
        const ownsYacht = ownedLuxury.includes('mega_yacht')
        const price = ownsYacht ? Math.floor(basePrice * 0.80) : basePrice
        const abilities = getPEAbilities(selectedPEAsset.id)

        return (
          <Portal>
            <div
              className="fixed top-0 left-0 right-0 bottom-0 bg-black/95 z-[999] flex items-end justify-center"
              onClick={() => setSelectedPEAsset(null)}
            >
              <div
                className={`w-full max-w-[400px] p-4 pb-8 animate-slide-up max-h-[80vh] overflow-y-auto ${
                  isModern3
                    ? 'bg-[#0f1419] rounded-t-xl'
                    : isRetro2
                      ? 'bg-[#0f1812] border-t border-mh-border'
                      : 'bg-[#111920] border-t border-mh-border'
                }`}
                style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))', ...(isModern3 ? { boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)' } : {}) }}
                onClick={e => e.stopPropagation()}
              >
                {/* Asset Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">{selectedPEAsset.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-mh-text-bright">
                        {selectedPEAsset.name}
                      </span>
                      {selectedPEAsset.riskTier && (
                        <span
                          className="text-xs px-2 py-0.5 rounded font-bold"
                          style={{
                            color: RISK_TIER_COLORS[selectedPEAsset.riskTier],
                            background: `${RISK_TIER_COLORS[selectedPEAsset.riskTier]}20`,
                          }}
                        >
                          {RISK_TIER_LABELS[selectedPEAsset.riskTier]}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-mh-text-dim mt-1">
                      {selectedPEAsset.description}
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-lg font-bold text-mh-text-main">
                        {formatPrice(price)}
                      </span>
                      {ownsYacht && (
                        <span className="text-xs text-mh-profit-green">
                          -20% yacht discount
                        </span>
                      )}
                      <span className={`text-sm font-bold ${
                        selectedPEAsset.dailyReturn > 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                      }`}>
                        {formatReturn(selectedPEAsset.dailyReturn)}
                      </span>
                      {selectedPEAsset.failureChancePerDay && selectedPEAsset.failureChancePerDay >= 0.001 && (
                        <span className="text-xs text-mh-loss-red">
                          ⚠️ {Math.round(selectedPEAsset.failureChancePerDay * 30 * 100)}%/mo risk
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Abilities Section */}
                {abilities.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-bold text-mh-text-dim mb-2 uppercase tracking-wide">
                      ⚡ Special Operations
                    </div>
                    <div className="space-y-2">
                      {abilities.map((ability) => (
                        <div
                          key={ability.id}
                          className={`p-2 rounded-lg ${
                            isModern3 ? 'bg-[#1a2028]' : 'bg-[#0a1218]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{ability.emoji}</span>
                            <span className="text-xs font-bold text-mh-text-bright">
                              {ability.name}
                            </span>
                          </div>
                          <div className="text-[10px] text-mh-text-dim mt-1">
                            {ability.flavor}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[10px]">
                            <span className="font-bold text-amber-400">
                              Cost: {formatPrice(ability.cost)}
                            </span>
                            <span className="text-mh-loss-red">
                              ⚠️ 20% backfire
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPEAsset(null)}
                    className="flex-1 py-3 rounded text-base font-bold font-mono bg-[#1a2a3a] text-mh-text-dim hover:bg-[#243444]"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => {
                      if (cash >= price) {
                        buyLifestyle(selectedPEAsset.id)
                        setSelectedPEAsset(null)
                      }
                    }}
                    disabled={cash < price}
                    className={`flex-1 py-3 rounded text-base font-bold font-mono transition-colors ${
                      cash >= price
                        ? isRetro2
                          ? 'bg-[#0a2015] text-mh-profit-green hover:bg-[#0d2a1a] border border-mh-profit-green/30'
                          : isModern3
                            ? 'bg-[#00d4aa] text-[#0a0e14] hover:bg-[#00b894]'
                            : 'bg-[#0a2015] text-mh-profit-green hover:bg-[#0d2a1a] border border-mh-profit-green/30'
                        : 'bg-[#111920] text-mh-border border border-mh-border/30'
                    }`}
                  >
                    BUY
                  </button>
                </div>
              </div>
            </div>
          </Portal>
        )
      })()}

      {/* PE Sell Confirmation Bottom Sheet */}
      {sellConfirmPE && (() => {
        const price = lifestylePrices[sellConfirmPE.id] || sellConfirmPE.basePrice
        const ownedItem = ownedMap.get(sellConfirmPE.id)
        const profitLoss = ownedItem ? price - ownedItem.purchasePrice : 0
        const profitLossPct = ownedItem ? ((price / ownedItem.purchasePrice) - 1) * 100 : 0
        const abilities = getPEAbilities(sellConfirmPE.id)

        return (
          <Portal>
            <div
              className="fixed top-0 left-0 right-0 bottom-0 bg-black/95 z-[999] flex items-end justify-center"
              onClick={() => setSellConfirmPE(null)}
            >
              <div
                className={`w-full max-w-[400px] p-4 pb-8 animate-slide-up max-h-[80vh] overflow-y-auto ${
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
                  <div className="text-3xl">{sellConfirmPE.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-mh-text-bright">
                        Sell {sellConfirmPE.name}?
                      </span>
                      {sellConfirmPE.riskTier && (
                        <span
                          className="text-xs px-2 py-0.5 rounded font-bold"
                          style={{
                            color: RISK_TIER_COLORS[sellConfirmPE.riskTier],
                            background: `${RISK_TIER_COLORS[sellConfirmPE.riskTier]}20`,
                          }}
                        >
                          {RISK_TIER_LABELS[sellConfirmPE.riskTier]}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-mh-text-dim mt-1">
                      {sellConfirmPE.description}
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

                {/* Special Operations Section */}
                {abilities.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-bold text-mh-text-dim mb-2 uppercase tracking-wide">
                      ⚡ Special Operations
                    </div>
                    <div className="space-y-2">
                      {abilities.map((ability) => {
                        const status = getPEAbilityStatus(ability.id)
                        const canExecute = canExecutePEAbility(ability.id, sellConfirmPE.id)
                        const needsCash = cash < ability.cost && !status.isUsed

                        return (
                          <div
                            key={ability.id}
                            className={`p-2 rounded-lg ${
                              isModern3 ? 'bg-[#1a2028]' : 'bg-[#0a1218]'
                            }`}
                          >
                            {/* Ability header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{ability.emoji}</span>
                                <span className="text-xs font-bold text-mh-text-bright">
                                  {ability.name}
                                </span>
                              </div>
                              {status.isUsed && (
                                <span className={`text-[10px] ${status.didBackfire ? 'text-mh-loss-red' : 'text-mh-profit-green'}`}>
                                  {status.didBackfire ? '✗ Backfired' : '✓ Executed'} Day {status.usedOnDay}
                                </span>
                              )}
                            </div>

                            {/* Flavor text */}
                            <div className="text-[10px] text-mh-text-dim mt-1">
                              {ability.flavor}
                            </div>

                            {/* Cost and execute button (only if not used) */}
                            {!status.isUsed && (
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2 text-[10px]">
                                  <span className="font-bold text-amber-400">
                                    Cost: {formatPrice(ability.cost)}
                                  </span>
                                  <span className="text-mh-loss-red">
                                    ⚠️ {Math.round(ability.backfireChance * 100)}% backfire
                                  </span>
                                </div>
                                <button
                                  onClick={() => executePEAbility(ability.id, sellConfirmPE.id)}
                                  disabled={!canExecute}
                                  className={`px-3 py-1 rounded text-[10px] font-bold ${
                                    canExecute
                                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                                      : 'bg-[#111920] text-mh-border'
                                  }`}
                                >
                                  {needsCash ? `NEED ${formatPrice(ability.cost - cash)}` : 'EXECUTE'}
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setSellConfirmPE(null)}
                    className="flex-1 py-3 rounded text-base font-bold font-mono bg-[#1a2a3a] text-mh-text-dim hover:bg-[#243444]"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => {
                      sellLifestyle(sellConfirmPE.id)
                      setSellConfirmPE(null)
                    }}
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
