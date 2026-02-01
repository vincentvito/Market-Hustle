'use client'

import { useState, useEffect } from 'react'
import { ASSETS } from '@/lib/game/assets'
import { useGame } from '@/hooks/useGame'
import { AssetCell } from './AssetCell'
import { LifestyleCatalog } from './LifestyleCatalog'

type TabType = 'trading' | 'lifestyle'

export function AssetGrid() {
  const { selectAsset, selectedTheme, pendingLifestyleAssetId, pendingLuxuryAssetId } = useGame()
  const [activeTab, setActiveTab] = useState<TabType>('trading')

  // Auto-switch to lifestyle tab when there's a pending asset from portfolio
  useEffect(() => {
    if (pendingLifestyleAssetId || pendingLuxuryAssetId) {
      setActiveTab('lifestyle')
    }
  }, [pendingLifestyleAssetId, pendingLuxuryAssetId])
  const isModern3 = selectedTheme === 'modern3'
  const isRetro2 = selectedTheme === 'retro2'
  const isBloomberg = selectedTheme === 'bloomberg'

  // Get tab wrapper classes based on theme
  const getTabWrapperClass = () => {
    if (isBloomberg) return 'flex border-b-2 border-[#ff8c00] bg-black'
    if (isModern3) return 'flex p-1 bg-[#0f1419] rounded my-2 mx-2'
    return 'flex border-b border-mh-border'
  }

  // Get tab button classes based on theme and active state
  const getTabClass = (isActive: boolean) => {
    const base = 'flex-1 py-2.5 text-sm font-bold transition-colors'

    if (isBloomberg) {
      return `${base} font-mono tracking-wider ${
        isActive
          ? 'text-[#ffcc00] bg-[#1a1000] border-b-2 border-[#ff8c00]'
          : 'text-[#ff8c00] hover:text-[#ffcc00] bg-black'
      }`
    }

    if (isModern3) {
      return `${base} rounded ${
        isActive
          ? 'text-[#0a0e14] bg-[#00d4aa] font-semibold'
          : 'text-mh-text-dim hover:text-mh-text-bright'
      }`
    }

    return `${base} font-mono ${
      isActive
        ? 'text-mh-accent-blue border-b-2 border-mh-accent-blue bg-[#0d1a24]'
        : 'text-mh-text-dim hover:text-mh-text-bright bg-mh-bg'
    }`
  }

  return (
    <>
      {/* Category Tabs */}
      <div className={getTabWrapperClass()}>
        <button
          onClick={() => setActiveTab('trading')}
          className={getTabClass(activeTab === 'trading')}
        >
          TRADING
        </button>
        <button
          onClick={() => setActiveTab('lifestyle')}
          className={getTabClass(activeTab === 'lifestyle')}
        >
          REAL ASSETS
        </button>
      </div>

      {activeTab === 'trading' ? (
        <div className={`grid grid-cols-3 ${
          isBloomberg
            ? 'gap-px bg-[#333333]'
            : isRetro2
              ? 'gap-2 p-2 bg-mh-bg'
              : isModern3
                ? 'gap-2 p-2 bg-mh-bg'
                : 'gap-px bg-mh-border'
        }`}>
          {ASSETS.map(asset => (
            <AssetCell
              key={asset.id}
              asset={asset}
              onSelect={selectAsset}
            />
          ))}
          {/* Empty cells to complete the grid if needed */}
          {ASSETS.length % 3 !== 0 &&
            Array.from({ length: 3 - (ASSETS.length % 3) }).map((_, i) => (
              <div key={`empty-${i}`} className={`bg-mh-bg ${isRetro2 || isModern3 ? '' : 'min-h-[72px]'}`} />
            ))}
        </div>
      ) : (
        <LifestyleCatalog />
      )}
    </>
  )
}
