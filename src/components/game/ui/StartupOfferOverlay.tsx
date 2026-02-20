'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import type { Startup } from '@/lib/game/types'

function formatMoney(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  if (Math.abs(amount) >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${Math.round(amount).toLocaleString('en-US')}`
}

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
  const { pendingStartupOffer, cash, investInStartup, dismissStartupOffer, liquidateForStartup, getNetWorth, selectedTheme } = useGame()
  const [confirmingAmount, setConfirmingAmount] = useState<number | null>(null)
  const isRetro2 = selectedTheme === 'retro2'

  if (!pendingStartupOffer) return null

  const { name, tagline, category, tier, duration, hotTake, pitch, founder, founderTitle, traction } = pendingStartupOffer
  const icon = CATEGORY_ICONS[category] || '🏢'
  const { failRate, maxMultiplier } = getRiskProfile(pendingStartupOffer)

  // Investment amounts based on tier
  const amounts = tier === 'angel' ? [10000, 20000, 50000] : [100000, 200000, 500000]
  const netWorth = getNetWorth()

  const handleInvest = (amount: number) => {
    if (amount <= cash) {
      investInStartup(amount)
    } else if (netWorth >= amount) {
      setConfirmingAmount(amount)
    }
  }

  const handleConfirmLiquidate = () => {
    if (confirmingAmount) {
      liquidateForStartup(confirmingAmount)
      setConfirmingAmount(null)
    }
  }

  // Color coding for fail rate
  const failRateColor = failRate > 50 ? 'text-mh-loss-red' : failRate > 30 ? 'text-mh-news' : 'text-mh-text-main'

  return (
    <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-5">
      <div
        className="bg-mh-bg border-2 border-mh-accent-blue rounded-lg w-full max-w-[340px] overflow-hidden max-h-[90vh] overflow-y-auto"
        style={isRetro2 ? { boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' } : undefined}
      >
        {/* Header - startup name + hot take */}
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
          {hotTake ? (
            <div className="text-mh-text-bright text-sm italic">
              &ldquo;{hotTake}&rdquo;
            </div>
          ) : (
            <div className="text-mh-text-dim text-sm italic">
              &ldquo;{tagline}&rdquo;
            </div>
          )}
        </div>

        {/* The Pitch */}
        {pitch && (
          <div className="p-4 border-b border-mh-border bg-[#080a0d]">
            <div className="text-mh-accent-blue text-[10px] font-bold tracking-wider mb-2 uppercase">
              The Pitch
            </div>
            <div className="text-mh-text-bright text-sm leading-relaxed">
              {pitch}
            </div>
          </div>
        )}

        {/* Founder + Traction */}
        {(founder || traction) && (
          <div className="px-4 py-3 border-b border-mh-border bg-[#0a0d10] flex flex-col gap-1.5">
            {founder && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-mh-text-dim">👤</span>
                <span className="text-mh-text-bright">{founder}</span>
                {founderTitle && (
                  <span className="text-mh-text-dim text-xs">• {founderTitle}</span>
                )}
              </div>
            )}
            {traction && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-mh-text-dim">📈</span>
                <span className="text-mh-profit-green font-medium">{traction}</span>
              </div>
            )}
          </div>
        )}

        {/* Risk Info */}
        <div className="p-4 border-b border-mh-border bg-[#0a0d10]">
          <div className="text-mh-accent-blue text-xs font-bold tracking-wider mb-2">
            {tier === 'angel' ? '👼 ANGEL DEAL' : '🏦 VC ROUND'}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-mh-text-dim">🎲</span>
            <span className={failRateColor}>{failRate}% fail</span>
            <span className="text-mh-text-dim">•</span>
            <span className="text-mh-profit-green">{maxMultiplier}x max</span>
            <span className="text-mh-text-dim">•</span>
            <span className="text-mh-text-dim">⏱️ {duration[0]}-{duration[1]}d</span>
          </div>
        </div>

        {confirmingAmount !== null ? (
          <>
            {/* Confirmation Summary */}
            <div className="p-4 border-b border-mh-border">
              <div className="text-mh-news text-[10px] font-bold tracking-wider mb-3 uppercase">
                Investment Summary
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-mh-text-dim">Ticket</span>
                  <span className="text-mh-text-bright font-bold">{formatMoney(confirmingAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mh-text-dim">Your cash</span>
                  <span className={cash > 0 ? 'text-mh-profit-green' : 'text-mh-text-dim'}>{formatMoney(cash)}</span>
                </div>
                <div className="border-t border-mh-border pt-2 flex justify-between">
                  <span className="text-mh-news font-bold">Need to sell</span>
                  <span className="text-mh-news font-bold">{formatMoney(confirmingAmount - cash)}</span>
                </div>
              </div>
              <p className="text-mh-text-dim text-xs mt-3 leading-relaxed">
                You don&apos;t have enough cash. Sell assets from your portfolio to cover the shortfall.
              </p>
            </div>

            {/* Confirmation Buttons */}
            <div className="p-4 space-y-2">
              <button
                onClick={handleConfirmLiquidate}
                className="w-full py-3 rounded font-bold text-sm bg-mh-news/20 border-2 border-mh-news text-mh-news hover:bg-mh-news/30 cursor-pointer transition-all"
              >
                CHOOSE ASSETS TO SELL
              </button>
              <button
                onClick={() => setConfirmingAmount(null)}
                className="w-full py-2 border border-mh-border bg-transparent text-mh-text-dim font-bold text-xs cursor-pointer hover:bg-mh-border/20 transition-all rounded"
              >
                BACK
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Investment Options */}
            <div className="p-4 border-b border-mh-border">
              <div className="flex gap-2">
                {amounts.map(amount => {
                  const canAfford = amount <= cash
                  const canLiquidate = !canAfford && netWorth >= amount
                  const isDisabled = !canAfford && !canLiquidate
                  return (
                    <button
                      key={amount}
                      onClick={() => handleInvest(amount)}
                      disabled={isDisabled}
                      className={`
                        flex-1 py-3 rounded font-bold text-sm transition-all
                        ${canAfford
                          ? 'bg-mh-profit-green/20 border border-mh-profit-green text-mh-profit-green hover:bg-mh-profit-green/30 cursor-pointer'
                          : canLiquidate
                            ? 'bg-mh-news/20 border border-mh-news text-mh-news hover:bg-mh-news/30 cursor-pointer'
                            : 'bg-mh-border/50 border border-mh-border text-mh-text-dim cursor-not-allowed opacity-50'
                        }
                      `}
                    >
                      <div>${amount >= 1_000_000 ? `${(amount / 1_000_000).toFixed(0)}M` : `${(amount / 1000).toFixed(0)}K`}</div>
                      {canLiquidate && <div className="text-[8px] opacity-80 mt-0.5">SELL & INVEST</div>}
                    </button>
                  )
                })}
              </div>
              <div className="text-mh-text-dim text-xs mt-2 text-center">
                Cash: ${cash.toLocaleString('en-US')}
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
          </>
        )}
      </div>
    </div>
  )
}
