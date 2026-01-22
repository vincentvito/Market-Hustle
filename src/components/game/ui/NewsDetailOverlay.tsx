'use client'

import { useGame } from '@/hooks/useGame'
import { ASSETS } from '@/lib/game/assets'
import { NEWS_EXPLANATIONS } from '@/lib/game/newsExplanations'

function getCommentary(headline: string, effects: Record<string, number>): string {
  // First, try to find a pre-written explanation
  if (NEWS_EXPLANATIONS[headline]) {
    return NEWS_EXPLANATIONS[headline]
  }

  // Fallback: generate basic commentary if no explanation found
  if (Object.keys(effects).length === 0) {
    return "Markets are digesting this news. No significant price movements expected from this development."
  }

  const gainers = Object.entries(effects)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])

  const losers = Object.entries(effects)
    .filter(([, v]) => v < 0)
    .sort((a, b) => a[1] - b[1])

  const parts: string[] = []

  if (gainers.length > 0) {
    const topGainers = gainers.slice(0, 3)
    const assetNames = topGainers.map(([id]) => {
      const asset = ASSETS.find(a => a.id === id)
      return asset?.name || id.toUpperCase()
    })

    if (gainers.length === 1) {
      parts.push(`${assetNames[0]} is surging on this news`)
    } else if (gainers.length === 2) {
      parts.push(`${assetNames[0]} and ${assetNames[1]} are rallying hard`)
    } else {
      parts.push(`${assetNames.join(', ')} are all seeing strong gains`)
    }
  }

  if (losers.length > 0) {
    const topLosers = losers.slice(0, 3)
    const assetNames = topLosers.map(([id]) => {
      const asset = ASSETS.find(a => a.id === id)
      return asset?.name || id.toUpperCase()
    })

    if (losers.length === 1) {
      parts.push(`${assetNames[0]} is taking a hit`)
    } else if (losers.length === 2) {
      parts.push(`${assetNames[0]} and ${assetNames[1]} are under pressure`)
    } else {
      parts.push(`${assetNames.join(', ')} are all selling off`)
    }
  }

  if (parts.length === 0) {
    return "The market is processing this development. Stay alert for volatility."
  }

  return parts.join('. ') + '.'
}

export function NewsDetailOverlay() {
  const { selectedNews, setSelectedNews } = useGame()

  if (!selectedNews) return null

  const { headline, effects } = selectedNews
  const commentary = getCommentary(headline, effects)

  const sortedEffects = Object.entries(effects)
    .map(([id, effect]) => {
      const asset = ASSETS.find(a => a.id === id)
      return { id, name: asset?.name || id.toUpperCase(), effect }
    })
    .sort((a, b) => b.effect - a.effect)

  const gainers = sortedEffects.filter(e => e.effect > 0)
  const losers = sortedEffects.filter(e => e.effect < 0)

  return (
    <div
      onClick={() => setSelectedNews(null)}
      className="fixed inset-0 bg-black/85 z-[200] flex items-center justify-center p-5"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-mh-bg border border-mh-border rounded-lg w-full max-w-[340px] max-h-[80vh] overflow-auto"
      >
        {/* Header */}
        <div className="p-4 border-b border-mh-border flex justify-between items-start">
          <div className="flex-1">
            <div className="text-mh-text-dim text-[10px] mb-1">📺 BREAKING NEWS</div>
            <div className="text-mh-news font-bold text-lg leading-tight" style={{ textShadow: '0 0 8px rgba(255,170,0,0.4)' }}>
              {headline}
            </div>
          </div>
          <button
            onClick={() => setSelectedNews(null)}
            className="bg-transparent border-none text-mh-text-dim text-2xl cursor-pointer px-2 ml-2"
          >
            ×
          </button>
        </div>

        {/* Anchor Commentary */}
        <div className="p-4 border-b border-mh-border bg-[#0a1015]">
          <div className="text-mh-text-dim text-[10px] mb-2">🎙️ MARKET ANALYSIS</div>
          <div className="text-mh-text-bright text-sm leading-relaxed">
            {commentary}
          </div>
        </div>

        {/* Market Impact */}
        {(gainers.length > 0 || losers.length > 0) && (
          <div className="p-4">
            <div className="text-mh-text-dim text-[10px] mb-3">📊 EXPECTED IMPACT</div>

            {gainers.length > 0 && (
              <div className="mb-3">
                <div className="text-mh-profit-green text-[10px] font-bold mb-1.5">▲ GAINERS</div>
                <div className="space-y-1.5">
                  {gainers.map(({ id, name, effect }) => (
                    <div key={id} className="flex justify-between items-center">
                      <span className="text-mh-text-bright text-sm">{name}</span>
                      <span className="text-mh-profit-green text-sm font-bold">
                        +{(effect * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {losers.length > 0 && (
              <div>
                <div className="text-mh-loss-red text-[10px] font-bold mb-1.5">▼ LOSERS</div>
                <div className="space-y-1.5">
                  {losers.map(({ id, name, effect }) => (
                    <div key={id} className="flex justify-between items-center">
                      <span className="text-mh-text-bright text-sm">{name}</span>
                      <span className="text-mh-loss-red text-sm font-bold">
                        {(effect * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Impact Message */}
        {gainers.length === 0 && losers.length === 0 && (
          <div className="p-4 text-center">
            <div className="text-mh-text-dim text-sm">
              No significant market impact expected.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
