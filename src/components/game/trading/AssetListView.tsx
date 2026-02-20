'use client'

import { ASSETS } from '@/lib/game/assets'
import { useGame } from '@/hooks/useGame'

function formatQty(n: number): string {
  if (Number.isInteger(n)) return n.toString()
  return n.toFixed(2)
}

function formatPrice(p: number): string {
  if (p >= 1_000_000) return `${(p / 1_000_000).toFixed(1)}M`
  if (p >= 1000) return `${(p / 1000).toFixed(1)}K`
  if (p >= 100) return p.toFixed(0)
  if (p >= 10) return p.toFixed(1)
  return p.toFixed(2)
}

export function AssetListView() {
  const {
    prices,
    holdings,
    getPriceChange,
    getAvgCost,
    selectAsset,
    leveragedPositions,
    shortPositions,
  } = useGame()

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      {/* Table Header */}
      <div className="sticky top-0 z-10 bg-[#0a0e14] border-b border-[#1a2230]">
        <div className="grid grid-cols-[2fr_1fr_1fr_0.8fr_1fr] md:grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-x-2 md:gap-x-3 px-3 md:px-4 py-1.5 md:py-2 text-[11px] md:text-xs text-[#4a5568] font-bold tracking-wider">
          <span>ASSET</span>
          <span className="text-right">PRICE</span>
          <span className="text-right">%CHG</span>
          <span className="text-right">QTY</span>
          <span className="text-right">AVG COST</span>
        </div>
      </div>

      {/* Asset Rows */}
      {ASSETS.map((asset, index) => {
        const price = prices[asset.id] || 0
        const owned = holdings[asset.id] || 0
        const change = getPriceChange(asset.id)
        const avgCost = getAvgCost(asset.id)
        const hasLeveraged = leveragedPositions.some(p => p.assetId === asset.id)
        const hasShort = shortPositions.some(p => p.assetId === asset.id)
        const hasPosition = owned > 0 || hasLeveraged || hasShort

        // Performance-based left accent + glow for positioned rows
        const getRowStyle = (): React.CSSProperties => {
          if (!hasPosition) return {}
          if (change >= 0) {
            return { boxShadow: 'inset 3px 0 0 #00d4aa, 0 0 15px rgba(0, 212, 170, 0.15)' }
          } else {
            return { boxShadow: 'inset 3px 0 0 #ff4757, 0 0 15px rgba(255, 71, 87, 0.15)' }
          }
        }

        return (
          <div
            key={asset.id}
            id={index === 0 ? 'tutorial-price-movement' : undefined}
            className={`grid grid-cols-[2fr_1fr_1fr_0.8fr_1fr] md:grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-x-2 md:gap-x-3 px-3 md:px-4 py-2.5 md:py-3 items-center border-b border-[#1a2230]/50 transition-colors cursor-pointer ${
              hasPosition ? 'bg-[#0f1419]' : 'hover:bg-[#0f1419]/50'
            }`}
            style={getRowStyle()}
            onClick={() => selectAsset(asset.id)}
          >
            {/* Asset Name + Position badges */}
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-sm md:text-base font-bold text-white truncate">
                {asset.name}
              </span>
              {hasShort && (
                <span className="text-[8px] md:text-[10px] font-bold px-1 rounded bg-red-500/20 text-red-400 border border-red-500/40 shrink-0">
                  S
                </span>
              )}
              {hasLeveraged && (
                <span className="text-[8px] md:text-[10px] font-bold px-1 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 shrink-0">
                  M
                </span>
              )}
            </div>

            {/* Price */}
            <span className="text-sm md:text-base font-bold text-[#8892a0] text-right tabular-nums">
              ${formatPrice(price)}
            </span>

            {/* % Change */}
            <span className={`text-sm md:text-base font-bold text-right tabular-nums ${
              change > 0 ? 'text-[#00d4aa]' : change < 0 ? 'text-[#ff4757]' : 'text-[#4a5568]'
            }`}>
              {change > 0 ? '▲' : change < 0 ? '▼' : '•'}{change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>

            {/* QTY */}
            <span className="text-sm md:text-base text-[#8892a0] text-right tabular-nums">
              {owned > 0 ? formatQty(owned) : '-'}
            </span>

            {/* Avg Cost */}
            <span className="text-sm md:text-base text-[#8892a0] text-right tabular-nums">
              {avgCost > 0 ? `$${formatPrice(avgCost)}` : '-'}
            </span>
          </div>
        )
      })}
    </div>
  )
}
