'use client'

import { useGame } from '@/hooks/useGame'
import type { Asset } from '@/lib/game/types'

interface AssetCellProps {
  asset: Asset
  onSelect: (assetId: string) => void
}

function formatPrice(p: number): string {
  if (p >= 1000) return `${(p / 1000).toFixed(1)}K`
  if (p >= 100) return p.toFixed(0)
  if (p >= 10) return p.toFixed(1)
  return p.toFixed(2)
}

export function AssetCell({ asset, onSelect }: AssetCellProps) {
  const { prices, holdings, getPriceChange } = useGame()
  const price = prices[asset.id] || 0
  const owned = holdings[asset.id] || 0
  const change = getPriceChange(asset.id)
  const isOwned = owned > 0

  return (
    <button
      onClick={() => onSelect(asset.id)}
      className={`
        flex flex-col items-center justify-center p-3 border border-mh-border
        cursor-pointer text-center min-h-[100px]
        ${isOwned
          ? 'bg-[#0d1a24] border-mh-accent-blue/30'
          : 'bg-mh-bg'
        }
      `}
    >
      <div className="text-sm font-bold text-mh-text-bright truncate w-full">
        {asset.name}
      </div>
      <div className="text-lg font-bold text-mh-text-main mt-1">
        ${formatPrice(price)}
      </div>
      <div
        className={`text-sm font-bold mt-1 ${
          change > 0
            ? 'text-mh-profit-green'
            : change < 0
              ? 'text-mh-loss-red'
              : 'text-mh-text-dim'
        }`}
      >
        {change > 0 ? '▲' : change < 0 ? '▼' : '•'} {change > 0 ? '+' : ''}
        {change.toFixed(1)}%
      </div>
      {isOwned && (
        <div className="text-xs text-mh-accent-blue mt-1 font-bold">
          OWN: {owned}
        </div>
      )}
    </button>
  )
}
