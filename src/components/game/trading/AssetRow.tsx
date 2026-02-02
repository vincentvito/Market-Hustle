'use client'

import { useGame } from '@/hooks/useGame'
import { TradePanel } from './TradePanel'
import type { Asset } from '@/lib/game/types'

interface AssetRowProps {
  asset: Asset
}

function formatPrice(p: number): string {
  if (p >= 1_000_000) return `${(p / 1_000_000).toFixed(1)}M`
  if (p >= 1000) return `${(p / 1000).toFixed(1)}K`
  if (p >= 100) return p.toFixed(0)
  if (p >= 10) return p.toFixed(1)
  return p.toFixed(2)
}

export function AssetRow({ asset }: AssetRowProps) {
  const { prices, holdings, selectedAsset, selectAsset, getPriceChange } = useGame()
  const price = prices[asset.id] || 0
  const owned = holdings[asset.id] || 0
  const change = getPriceChange(asset.id)
  const isSelected = selectedAsset === asset.id

  return (
    <div>
      <div
        onClick={() => selectAsset(isSelected ? null : asset.id)}
        className={`flex justify-between items-center py-3.5 px-4 border-b border-mh-border cursor-pointer ${
          isSelected ? 'bg-[#151d25]' : 'bg-transparent hover:bg-[#0f1419]'
        }`}
      >
        <div>
          <div className="text-base font-bold text-mh-text-bright">{asset.name}</div>
          {owned > 0 && (
            <div className="text-[11px] text-mh-accent-blue mt-0.5">
              OWN: {owned} (${Math.round(owned * price).toLocaleString('en-US')})
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-mh-text-main">${formatPrice(price)}</div>
          <div
            className={`text-[13px] font-bold ${
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
        </div>
      </div>

      {isSelected && <TradePanel assetId={asset.id} price={price} />}
    </div>
  )
}
