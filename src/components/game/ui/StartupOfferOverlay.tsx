'use client'

import { useGame } from '@/hooks/useGame'
import type { Startup } from '@/lib/game/types'

const CATEGORY_ICONS: Record<string, string> = {
  tech: '💻',
  biotech: '🧬',
  space: '🚀',
  crypto: '₿',
  ai: '🤖',
  consumer: '🛒',
  energy: '⚡',
  fintech: '💳',
}

// Compute risk profile from startup outcome data
function getRiskProfile(startup: Startup): { failRate: number; maxMultiplier: number } {
  const failOutcome = startup.outcomes.find(o => o.multiplier === 0)
  const failRate = failOutcome ? Math.round(failOutcome.probability * 100) : 0
  const maxMultiplier = Math.max(...startup.outcomes.map(o => o.multiplier))
  return { failRate, maxMultiplier }
}

export function StartupOfferOverlay() {
  const { pendingStartupOffer, cash, investInStartup, dismissStartupOffer, selectedTheme } = useGame()
  const isRetro2 = selectedTheme === 'retro2'

  if (!pendingStartupOffer) return null

  const { name, tagline, category, tier, duration } = pendingStartupOffer
  const icon = CATEGORY_ICONS[category] || '🏢'
  const { failRate, maxMultiplier } = getRiskProfile(pendingStartupOffer)

  // Investment amounts based on tier
  const amounts = tier === 'angel' ? [10000, 20000, 50000] : [100000, 200000, 500000]

  const handleInvest = (amount: number) => {
    if (amount <= cash) {
      investInStartup(amount)
    }
  }

  // Color coding for fail rate
  const failRateColor = failRate > 50 ? 'text-mh-loss-red' : failRate > 30 ? 'text-mh-news' : 'text-mh-text-main'

  return (
    <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-5">
      <div
        className="bg-mh-bg border-2 border-mh-accent-blue rounded-lg w-full max-w-[340px] overflow-hidden"
        style={isRetro2 ? { boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' } : undefined}
      >
        {/* Header - startup name is the hero */}
        <div className={`p-4 ${isRetro2 ? 'bg-gradient-to-r from-[#0a150d] to-[#0d1a10]' : 'bg-gradient-to-r from-[#0a1520] to-[#0d1a28]'} border-b border-mh-border`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{icon}</span>
            <div
              className="text-mh-news font-bold text-xl leading-tight"
              style={{ textShadow: isRetro2 ? '0 0 10px rgba(0,255,136,0.5)' : '0 0 10px rgba(255,170,0,0.5)' }}
            >
              {name}
            </div>
          </div>
          <div className="text-mh-text-dim text-sm italic">
            &ldquo;{tagline}&rdquo;
          </div>
        </div>

        {/* Risk Info - replaces the valuation section */}
        <div className="p-4 border-b border-mh-border bg-[#0a0d10]">
          <div className="text-mh-accent-blue text-xs font-bold tracking-wider mb-2">
            {tier === 'angel' ? '👼 ANGEL DEAL' : '🏦 VC ROUND'}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-mh-text-dim">🎲</span>
            <span className={failRateColor}>{failRate}% fail</span>
            <span className="text-mh-text-dim">•</span>
            <span className="text-mh-profit-green">{maxMultiplier}x max</span>
          </div>
          <div className="text-mh-text-dim text-xs mt-2">
            ⏱️ Resolves in {duration[0]}-{duration[1]} days
          </div>
        </div>

        {/* Investment Options */}
        <div className="p-4 border-b border-mh-border">
          <div className="flex gap-2">
            {amounts.map(amount => {
              const canAfford = amount <= cash
              return (
                <button
                  key={amount}
                  onClick={() => handleInvest(amount)}
                  disabled={!canAfford}
                  className={`
                    flex-1 py-3 rounded font-bold text-sm transition-all
                    ${canAfford
                      ? 'bg-mh-profit-green/20 border border-mh-profit-green text-mh-profit-green hover:bg-mh-profit-green/30 cursor-pointer'
                      : 'bg-mh-border/50 border border-mh-border text-mh-text-dim cursor-not-allowed opacity-50'
                    }
                  `}
                >
                  ${amount >= 1_000_000 ? `${(amount / 1_000_000).toFixed(0)}M` : `${(amount / 1000).toFixed(0)}K`}
                </button>
              )
            })}
          </div>
          <div className="text-mh-text-dim text-xs mt-2 text-center">
            Cash: ${cash.toLocaleString()}
          </div>
        </div>

        {/* Pass Button */}
        <div className="p-4">
          <button
            onClick={dismissStartupOffer}
            className="w-full py-3 border border-mh-border bg-transparent text-mh-text-dim font-bold cursor-pointer hover:bg-mh-border/20 transition-all"
          >
            PASS
          </button>
        </div>
      </div>
    </div>
  )
}
