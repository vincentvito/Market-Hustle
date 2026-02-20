'use client'

import { useGame } from '@/hooks/useGame'
import { ASSETS } from '@/lib/game/assets'
import { NEWS_EXPLANATIONS } from '@/lib/game/newsExplanations'
import { NEWS_CONTENT } from '@/lib/game/newsContent'

// Explanations for dynamic headlines that can't be in the static map
const DYNAMIC_EXPLANATIONS: { prefix: string; explanation: string }[] = [
  {
    prefix: 'PE RETURNS:',
    explanation: "This is PASSIVE INCOME from your Private Equity holdings. You bought PE assets (Blackstone Services, Growth Partners, Apex Media, etc.) in the Lifestyle tab. These PE funds own stakes in real companies. Every day, they generate returns through: (1) Management fees from portfolio companies, (2) Dividends from profitable businesses they own, (3) Realized gains when they sell investments. The amount shown is calculated as ~0.1% of your total PE portfolio value PER DAY. More PE assets = bigger daily passive income. This cash is automatically added to your balance - no action needed."
  },
  {
    prefix: 'RENTAL INCOME:',
    explanation: "This is PASSIVE INCOME from your real estate portfolio. You bought properties (Miami Condo, NYC Penthouse, Monaco Villa, Dubai Palace, etc.) in the Lifestyle tab. Each property generates rental income based on: (1) The property's base rental yield (varies by location and property type), (2) Current market conditions affecting rent prices. The amount shown is your DAILY rental income from ALL properties combined. More properties = bigger daily income. This cash is automatically added to your balance - no action needed. Note: Properties never generate negative income (rent floor is $0)."
  },
  // Luxury asset daily costs
  {
    prefix: 'JET MAINTENANCE:',
    explanation: "Your G650ER private jet requires constant upkeep. This daily cost covers: hangar fees at private terminals, flight crew salaries (pilots, attendants), fuel reserves, mandatory FAA inspections, insurance premiums, and routine maintenance. Owning a jet isn't just the purchase price - it's a lifestyle commitment that costs roughly 1% of the aircraft's value per day to maintain flight-ready status. The benefit? +30% deal frequency from networking at 45,000 feet."
  },
  {
    prefix: 'YACHT UPKEEP:',
    explanation: "Your 85-meter mega yacht is a floating palace that requires a full-time crew of 15+. Daily costs include: captain and crew salaries, docking fees at premium marinas, fuel for generators and propulsion, constant maintenance against saltwater corrosion, insurance, and provisions. A yacht this size costs roughly 1% of its value annually just to keep afloat - that's your daily burn rate. The benefit? -20% discount on all PE purchases from deals made on the high seas."
  },
  {
    prefix: 'TEAM PAYROLL:',
    explanation: "The LA Lakers roster doesn't pay itself. This daily cost covers: player salaries (including max contracts), coaching staff, training personnel, medical team, front office executives, and facility operations at Crypto.com Arena. NBA teams operate at a loss for most owners - the value is in appreciation, championship prestige, and the ultimate status symbol. You own LeBron's legacy team. There's no financial benefit. Just pure flex."
  },
  {
    prefix: 'ART INSURANCE:',
    explanation: "Your Basquiat, Warhol, and Banksy collection requires specialized fine art insurance and climate-controlled storage. Daily costs cover: insurance premiums against theft, damage, and depreciation claims, museum-grade storage facilities, security systems, and periodic authentication and appraisal services. Unlike other luxury assets, art tends to appreciate over time. The benefit? -20% probability of Tax Event encounters - the IRS is less aggressive with collectors who donate to museums."
  },
]

interface NewsContent {
  blurb: string | null
  analysis: string
}

function getNewsContent(headline: string, effects: Record<string, number>, baseHeadline?: string): NewsContent {
  // Use baseHeadline for dictionary lookups when available (e.g., startup outcomes with amount suffixes)
  const lookupKey = baseHeadline || headline

  // Check for structured content in NEWS_CONTENT first
  const content = NEWS_CONTENT[lookupKey]
  if (content) {
    // If we have structured content, use it (with fallback to NEWS_EXPLANATIONS for analysis)
    const analysis = content.analysis || NEWS_EXPLANATIONS[lookupKey] || generateFallbackAnalysis(effects)
    return {
      blurb: content.blurb || null,
      analysis
    }
  }

  // Check for pre-written explanation in NEWS_EXPLANATIONS (legacy support)
  if (NEWS_EXPLANATIONS[lookupKey]) {
    return {
      blurb: null,
      analysis: NEWS_EXPLANATIONS[lookupKey]
    }
  }

  // Check for dynamic headline patterns (prefix matches)
  for (const { prefix, explanation } of DYNAMIC_EXPLANATIONS) {
    if (headline.startsWith(prefix)) {
      return {
        blurb: null,
        analysis: explanation
      }
    }
  }

  // Fallback: generate basic analysis
  return {
    blurb: null,
    analysis: generateFallbackAnalysis(effects)
  }
}

function generateFallbackAnalysis(effects: Record<string, number>): string {
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

  const { headline, effects, baseHeadline } = selectedNews
  const { blurb, analysis } = getNewsContent(headline, effects, baseHeadline)

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

        {/* News Blurb - Short article (only shown if available) */}
        {blurb && (
          <div className="p-4 border-b border-mh-border">
            <div className="text-mh-text-dim text-[10px] mb-2">📰 REPORT</div>
            <div className="text-mh-text-bright text-sm leading-relaxed italic">
              {blurb}
            </div>
          </div>
        )}

        {/* Market Analysis */}
        <div className="p-4 border-b border-mh-border bg-[#0a1015]">
          <div className="text-mh-text-dim text-[10px] mb-2">🎙️ MARKET ANALYSIS</div>
          <div className="text-mh-text-bright text-sm leading-relaxed">
            {analysis}
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
