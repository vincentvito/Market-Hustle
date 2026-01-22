'use client'

import { useGame } from '@/hooks/useGame'

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

export function StartupOfferOverlay() {
  const { pendingStartupOffer, cash, investInStartup, dismissStartupOffer } = useGame()

  if (!pendingStartupOffer) return null

  const { name, tagline, category, tier, raising } = pendingStartupOffer
  const icon = CATEGORY_ICONS[category] || '🏢'

  // Investment amounts based on tier
  const amounts = tier === 'angel' ? [10000, 20000, 50000] : [100000, 200000, 500000]

  const handleInvest = (amount: number) => {
    if (amount <= cash) {
      investInStartup(amount)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-5">
      <div className="bg-mh-bg border-2 border-mh-accent-blue rounded-lg w-full max-w-[340px] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#0a1520] to-[#0d1a28] border-b border-mh-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{icon}</span>
            <div className="flex-1">
              <div className="text-mh-accent-blue text-[10px] font-bold tracking-wider uppercase">
                {tier === 'angel' ? '👼 ANGEL INVESTMENT' : '🏦 VC OPPORTUNITY'}
              </div>
            </div>
          </div>
          <div
            className="text-mh-news font-bold text-xl leading-tight"
            style={{ textShadow: '0 0 10px rgba(255,170,0,0.5)' }}
          >
            {name}
          </div>
          <div className="text-mh-text-dim text-sm mt-1 italic">
            "{tagline}"
          </div>
        </div>

        {/* Raising Info */}
        <div className="p-4 border-b border-mh-border bg-[#0a0d10]">
          <div className="text-mh-text-dim text-[10px] font-bold tracking-wider mb-2">
            💰 RAISING
          </div>
          <div className="text-mh-text-bright text-lg font-bold">
            {raising}
          </div>
          <div className="text-mh-text-dim text-xs mt-2">
            {tier === 'angel'
              ? 'High risk, high reward. Most fail, but winners can 50-100x.'
              : 'Lower risk, proven companies. More likely to return 3-5x.'
            }
          </div>
        </div>

        {/* Investment Options */}
        <div className="p-4 border-b border-mh-border">
          <div className="text-mh-text-dim text-[10px] font-bold tracking-wider mb-3">
            📊 INVEST
          </div>
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
                  ${(amount / 1000).toFixed(0)}K
                </button>
              )
            })}
          </div>
          <div className="text-mh-text-dim text-xs mt-2 text-center">
            Your cash: ${cash.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          {amounts.every(amount => amount > cash) && (
            <div className="text-mh-news text-xs mt-2 text-center">
              💡 Keep cash reserves for deals like this
            </div>
          )}
        </div>

        {/* Pass Button */}
        <div className="p-4">
          <button
            onClick={dismissStartupOffer}
            className="w-full py-3 border border-mh-border bg-transparent text-mh-text-dim font-bold cursor-pointer hover:bg-mh-border/20 transition-all"
          >
            PASS ON THIS DEAL
          </button>
        </div>
      </div>
    </div>
  )
}
