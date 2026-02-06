'use client'

import { useGame } from '@/hooks/useGame'
import type { Asset } from '@/lib/game/types'

interface AssetCellProps {
  asset: Asset
  onSelect: (assetId: string) => void
  id?: string
  priceId?: string
}

function formatPrice(p: number): string {
  if (p >= 1_000_000) return `${(p / 1_000_000).toFixed(1)}M`
  if (p >= 1000) return `${(p / 1000).toFixed(1)}K`
  if (p >= 100) return p.toFixed(0)
  if (p >= 10) return p.toFixed(1)
  return p.toFixed(2)
}

export function AssetCell({ asset, onSelect, id, priceId }: AssetCellProps) {
  const { prices, holdings, getPriceChange, selectedTheme, leveragedPositions, shortPositions } = useGame()
  const price = prices[asset.id] || 0
  const owned = holdings[asset.id] || 0
  const change = getPriceChange(asset.id)
  const isOwned = owned > 0
  const isModern3 = selectedTheme === 'modern3'
  const isRetro2 = selectedTheme === 'retro2'
  const isBloomberg = selectedTheme === 'bloomberg'

  // Check if user has ANY position in this asset (regular, leveraged, or short)
  const hasLeveraged = leveragedPositions.some(p => p.assetId === asset.id)
  const hasShort = shortPositions.some(p => p.assetId === asset.id)
  const hasPosition = isOwned || hasLeveraged || hasShort

  // Background class based on theme
  const getBackgroundClass = () => {
    if (isBloomberg) return 'bg-black'  // Use inline style for colored BG
    if (isModern3) return 'bg-[#0f1419]'
    if (hasPosition) return 'bg-[#0d1a24] border-mh-accent-blue/30'
    return 'bg-mh-bg'
  }

  // Modern 3: Performance-based glow for positioned assets
  const getModern3OwnedGlow = (): React.CSSProperties => {
    if (!isModern3 || !hasPosition) return {}
    if (change >= 0) {
      return { boxShadow: '0 0 25px rgba(0, 212, 170, 0.5), 0 0 40px rgba(0, 212, 170, 0.25)' }
    } else {
      return { boxShadow: '0 0 25px rgba(255, 71, 87, 0.5), 0 0 40px rgba(255, 71, 87, 0.25)' }
    }
  }

  // Modern 3: Subtle shadow for non-positioned cards (floating effect)
  const getModern3CardShadow = (): React.CSSProperties => {
    if (!isModern3 || hasPosition) return {}
    return { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)' }
  }

  // Modern 3: Top accent line with gradient (opacity based on change magnitude)
  const getModern3AccentStyle = (): React.CSSProperties => {
    if (!isModern3) return {}
    const opacity = Math.min(Math.abs(change) * 0.15, 0.99)
    const opacityHex = Math.floor(opacity * 255).toString(16).padStart(2, '0')
    const color = change >= 0 ? '#00d4aa' : '#ff4757'
    return {
      background: `linear-gradient(90deg, transparent, ${color}${opacityHex}, transparent)`
    }
  }

  // Retro 2: Performance-based glow for positioned cards, subtle shadow otherwise
  const getRetro2CardStyle = (): React.CSSProperties => {
    if (!isRetro2) return {}
    if (hasPosition) {
      // Performance-based glow (green if up, red if down)
      if (change >= 0) {
        return { boxShadow: '0 0 15px rgba(0, 255, 136, 0.35)' }
      } else {
        return { boxShadow: '0 0 15px rgba(255, 82, 82, 0.35)' }
      }
    }
    // Subtle shadow for no position
    return { boxShadow: '0 0 8px rgba(255, 255, 255, 0.1)' }
  }

  // Bloomberg: Colored cell backgrounds based on performance (key Bloomberg feature)
  const getBloombergCellStyle = (): React.CSSProperties => {
    if (!isBloomberg) return {}
    // Strong positive (>=5%)
    if (change >= 5) return { backgroundColor: '#003300', borderColor: '#004400' }
    // Mild positive
    if (change > 0) return { backgroundColor: '#001a00', borderColor: '#003300' }
    // Strong negative (<=-5%)
    if (change <= -5) return { backgroundColor: '#330000', borderColor: '#440000' }
    // Mild negative
    if (change < 0) return { backgroundColor: '#1a0000', borderColor: '#330000' }
    // Neutral
    return { backgroundColor: '#0a0800', borderColor: '#333333' }
  }

  // Combine style props
  const getCombinedStyle = (): React.CSSProperties => {
    return {
      ...getModern3OwnedGlow(),
      ...getModern3CardShadow(),
      ...getRetro2CardStyle(),
      ...getBloombergCellStyle()
    }
  }

  return (
    <button
      id={id}
      onClick={() => onSelect(asset.id)}
      className={`
        flex flex-col items-center justify-center border border-mh-border
        cursor-pointer text-center relative overflow-hidden aspect-[3/2]
        ${isBloomberg ? 'p-2 md:p-4 md:aspect-auto md:min-h-[130px] rounded-none' : isModern3 ? 'p-2 md:p-5 md:aspect-auto md:min-h-[140px] rounded-lg' : 'p-2 md:p-5 md:aspect-auto md:min-h-[140px]'}
        ${isRetro2 ? 'rounded' : ''}
        ${getBackgroundClass()}
      `}
      style={getCombinedStyle()}
    >
      {/* Modern 3 top accent line - only show for owned assets */}
      {isModern3 && hasPosition && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={getModern3AccentStyle()}
        />
      )}
      <div className={`font-bold text-mh-text-bright truncate w-full ${isModern3 ? 'text-[10px] md:text-sm' : 'text-[11px] md:text-base'}`}>
        {asset.name}
      </div>
      <div id={priceId} className="flex flex-col items-center">
        <div className={`font-bold text-mh-text-main mt-0.5 ${isModern3 ? 'text-sm md:text-xl' : 'text-sm md:text-2xl'}`}>
          ${formatPrice(price)}
        </div>
        <div
          className={`font-bold ${isModern3 ? 'text-[10px] md:text-sm mt-0' : 'text-[11px] md:text-base mt-0.5'} ${
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
      {/* Position indicators */}
      {(hasShort || hasLeveraged) && (
        <div className="flex gap-0.5 mt-0.5">
          {hasShort && (
            <span className="text-[8px] md:text-xs font-bold px-1 py-0 rounded bg-red-500/20 text-red-400 border border-red-500/40">
              SHORT
            </span>
          )}
          {hasLeveraged && (
            <span className="text-[8px] md:text-xs font-bold px-1 py-0 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
              MARGIN
            </span>
          )}
        </div>
      )}
    </button>
  )
}
