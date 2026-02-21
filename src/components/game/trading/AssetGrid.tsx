'use client'

import { useState, useEffect } from 'react'
import { ASSETS } from '@/lib/game/assets'
import { LIFESTYLE_ASSETS } from '@/lib/game/lifestyleAssets'
import { useGame } from '@/hooks/useGame'
import { AssetCell } from './AssetCell'
import { AssetListView } from './AssetListView'
import { LifestyleCatalog } from './LifestyleCatalog'

type TabType = 'stocks' | 'properties' | 'private_equity'

export function AssetGrid() {
  const { selectAsset, selectedTheme, pendingLifestyleAssetId, pendingLuxuryAssetId } = useGame()
  const [activeTab, setActiveTab] = useState<TabType>('stocks')

  // Auto-switch to appropriate tab when there's a pending asset from portfolio
  useEffect(() => {
    if (pendingLifestyleAssetId) {
      const asset = LIFESTYLE_ASSETS.find(a => a.id === pendingLifestyleAssetId)
      if (asset?.category === 'property') {
        setActiveTab('properties')
      } else if (asset?.category === 'private_equity') {
        setActiveTab('private_equity')
      }
    }
    if (pendingLuxuryAssetId) {
      setActiveTab('properties')
    }
  }, [pendingLifestyleAssetId, pendingLuxuryAssetId])
  const isModern3 = selectedTheme === 'modern3' || selectedTheme === 'modern3list'
  const isModern3List = selectedTheme === 'modern3list'
  const isRetro2 = selectedTheme === 'retro2'
  const isBloomberg = selectedTheme === 'bloomberg'

  // Get tab wrapper classes based on theme
  const getTabWrapperClass = () => {
    if (isBloomberg) return 'flex border-b-2 border-[#ff8c00] bg-black'
    if (isModern3) return 'flex p-1 bg-[#0f1419] rounded mt-0 mb-0 mx-2'
    return 'flex border-b border-mh-border'
  }

  // Get tab button classes based on theme and active state
  const getTabClass = (isActive: boolean) => {
    const base = 'flex-1 py-2 md:py-2.5 text-[13px] md:text-sm font-bold transition-colors'

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
          : 'text-[#4a5568] hover:text-mh-text-bright bg-transparent'
      }`
    }

    return `${base} font-mono ${
      isActive
        ? 'text-mh-accent-blue border-b-2 border-mh-accent-blue bg-[#0d1a24]'
        : 'text-[#4a5568] hover:text-mh-text-bright bg-mh-bg'
    }`
  }

  // Filter lifestyle assets by category
  const propertyAssets = LIFESTYLE_ASSETS.filter(a => a.category === 'property')
  const privateEquityAssets = LIFESTYLE_ASSETS.filter(a => a.category === 'private_equity')

  return (
    <div id="tutorial-asset-grid" className="flex flex-col flex-1 min-h-0">
      {/* Category Tabs */}
      <div className={getTabWrapperClass()}>
        <button
          onClick={() => setActiveTab('stocks')}
          className={getTabClass(activeTab === 'stocks')}
        >
          STOCKS
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={getTabClass(activeTab === 'properties')}
        >
          PROPERTIES
        </button>
        <button
          onClick={() => setActiveTab('private_equity')}
          className={getTabClass(activeTab === 'private_equity')}
        >
          PRIVATE EQUITY
        </button>
      </div>

      {activeTab === 'stocks' ? (
        isModern3List ? (
          <AssetListView />
        ) : (
          <>
            {/* Mobile/Tablet: 3 cols vertical scroll */}
            <div className={`flex-1 min-h-0 lg:hidden overflow-auto grid grid-cols-3 auto-rows-min ${
              isBloomberg
                ? 'gap-px bg-[#333333]'
                : isRetro2
                  ? 'gap-1.5 p-1.5 bg-mh-bg'
                  : isModern3
                    ? 'gap-1.5 p-1.5 bg-mh-bg'
                    : 'gap-px bg-mh-border'
            }`}>
              {ASSETS.map((asset, index) => (
                <AssetCell
                  key={asset.id}
                  asset={asset}
                  onSelect={selectAsset}
                  id={index === 0 ? 'tutorial-price-movement' : undefined}
                  priceId={index === 0 ? 'tutorial-price-section' : undefined}
                />
              ))}
            </div>
            {/* Desktop: 4 cols vertical scroll */}
            <div className={`hidden lg:flex flex-1 min-h-0 overflow-auto ${
              isBloomberg
                ? 'bg-[#333333]'
                : isRetro2
                  ? 'bg-mh-bg'
                  : isModern3
                    ? 'bg-mh-bg'
                    : 'bg-mh-border'
            }`}>
              <div className={`grid lg:grid-cols-4 grid-rows-3 gap-3 p-3 w-full h-full`}>
                {ASSETS.map((asset, index) => (
                  <AssetCell
                    key={asset.id}
                    asset={asset}
                    onSelect={selectAsset}
                    id={index === 0 ? 'tutorial-price-movement' : undefined}
                    priceId={index === 0 ? 'tutorial-price-section' : undefined}
                  />
                ))}
              </div>
            </div>
          </>
        )
      ) : activeTab === 'properties' ? (
        <LifestyleCatalog filterCategory="property" />
      ) : (
        <LifestyleCatalog filterCategory="private_equity" />
      )}
    </div>
  )
}
