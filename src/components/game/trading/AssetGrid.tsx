'use client'

import { useState } from 'react'
import { ASSETS } from '@/lib/game/assets'
import { AssetCell } from './AssetCell'
import { TradeSheet } from './TradeSheet'
import { LifestyleCatalog } from './LifestyleCatalog'

type TabType = 'trading' | 'lifestyle'

export function AssetGrid() {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('trading')

  const selectedAsset = selectedAssetId
    ? ASSETS.find(a => a.id === selectedAssetId)
    : null

  return (
    <>
      {/* Category Tabs */}
      <div className="flex border-b border-mh-border">
        <button
          onClick={() => setActiveTab('trading')}
          className={`flex-1 py-2.5 text-sm font-bold font-mono transition-colors ${
            activeTab === 'trading'
              ? 'text-mh-accent-blue border-b-2 border-mh-accent-blue bg-[#0d1a24]'
              : 'text-mh-text-dim hover:text-mh-text-bright bg-mh-bg'
          }`}
        >
          TRADING
        </button>
        <button
          onClick={() => setActiveTab('lifestyle')}
          className={`flex-1 py-2.5 text-sm font-bold font-mono transition-colors ${
            activeTab === 'lifestyle'
              ? 'text-mh-accent-blue border-b-2 border-mh-accent-blue bg-[#0d1a24]'
              : 'text-mh-text-dim hover:text-mh-text-bright bg-mh-bg'
          }`}
        >
          LIFESTYLE
        </button>
      </div>

      {activeTab === 'trading' ? (
        <>
          <div className="grid grid-cols-3 gap-px bg-mh-border">
            {ASSETS.map(asset => (
              <AssetCell
                key={asset.id}
                asset={asset}
                onSelect={setSelectedAssetId}
              />
            ))}
            {/* Empty cells to complete the grid if needed */}
            {ASSETS.length % 3 !== 0 &&
              Array.from({ length: 3 - (ASSETS.length % 3) }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-mh-bg min-h-[72px]" />
              ))}
          </div>

          <TradeSheet
            asset={selectedAsset}
            isOpen={!!selectedAsset}
            onClose={() => setSelectedAssetId(null)}
          />
        </>
      ) : (
        <LifestyleCatalog />
      )}
    </>
  )
}
