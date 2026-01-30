'use client'

import { useGame } from '@/hooks/useGame'
import type { InvestmentResultEvent } from '@/lib/game/types'

function formatMoney(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`
  if (Math.abs(amount) >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  if (Math.abs(amount) >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${Math.round(amount).toLocaleString()}`
}

function getEmoji(multiplier: number, isProfit: boolean): string {
  if (multiplier === 0) return '💀'
  if (multiplier >= 10) return '🚀🚀🚀'
  if (multiplier >= 5) return '🚀🚀'
  if (multiplier >= 2) return '🚀'
  if (multiplier >= 1.5) return '🎉'
  if (multiplier >= 1) return '✅'
  return '📉'
}

function getTitle(multiplier: number, isProfit: boolean): string {
  if (multiplier === 0) return 'TOTAL LOSS'
  if (multiplier >= 10) return 'LEGENDARY WIN!'
  if (multiplier >= 5) return 'MASSIVE WIN!'
  if (multiplier >= 2) return 'BIG WIN!'
  if (multiplier >= 1) return 'INVESTMENT CASHED OUT'
  return 'INVESTMENT RESOLVED'
}

export function InvestmentResultOverlay() {
  const { activeCelebration, dismissCelebration, selectedTheme } = useGame()
  const isRetro2 = selectedTheme === 'retro2'

  // Only render for investment_result type
  if (!activeCelebration || activeCelebration.type !== 'investment_result') {
    return null
  }

  const event = activeCelebration as InvestmentResultEvent
  const {
    startupName,
    investedAmount,
    returnAmount,
    multiplier,
    profitLoss,
    profitLossPct,
    isProfit,
    headline,
  } = event

  // Visual styling based on outcome
  const primaryColor = isProfit ? '#00ff88' : '#ff5252'
  const bgGradient = isProfit
    ? (isRetro2 ? 'from-[#0a150d] to-[#0d1a10]' : 'from-[#0a1520] to-[#0d2820]')
    : (isRetro2 ? 'from-[#150a0a] to-[#1a0d0d]' : 'from-[#1a0a0a] to-[#280d0d]')

  const emoji = getEmoji(multiplier, isProfit)
  const title = getTitle(multiplier, isProfit)

  return (
    <div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-5">
      <div
        className="bg-mh-bg border-2 rounded-lg w-full max-w-[380px] overflow-hidden"
        style={{
          borderColor: primaryColor,
          boxShadow: `0 0 30px ${primaryColor}60`,
        }}
      >
        {/* Header */}
        <div
          className={`p-5 bg-gradient-to-r ${bgGradient} border-b text-center`}
          style={{ borderColor: `${primaryColor}40` }}
        >
          <div className="text-5xl mb-3">{emoji}</div>
          <div
            className="text-xs font-bold tracking-wider mb-2"
            style={{
              color: primaryColor,
              textShadow: `0 0 10px ${primaryColor}60`,
            }}
          >
            {title}
          </div>
          <div
            className="font-bold text-2xl leading-tight"
            style={{ color: primaryColor }}
          >
            {startupName}
          </div>
        </div>

        {/* Results */}
        <div className="p-5 bg-[#0a0d10]">
          {/* Profit/Loss Display */}
          <div className="text-center mb-4">
            <div
              className="text-4xl font-bold mb-1"
              style={{
                color: primaryColor,
                textShadow: `0 0 20px ${primaryColor}50`,
              }}
            >
              {isProfit ? '+' : ''}{formatMoney(profitLoss)}
            </div>
            <div
              className="text-lg"
              style={{ color: primaryColor }}
            >
              {profitLossPct >= 0 ? '+' : ''}{profitLossPct.toFixed(0)}%
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center py-2 px-3 rounded bg-white/5">
              <div className="text-mh-text-dim text-xs mb-1">INVESTED</div>
              <div className="text-mh-text-bright font-bold">
                {formatMoney(investedAmount)}
              </div>
            </div>
            <div className="text-center py-2 px-3 rounded bg-white/5">
              <div className="text-mh-text-dim text-xs mb-1">RETURNED</div>
              <div
                className="font-bold"
                style={{ color: primaryColor }}
              >
                {formatMoney(returnAmount)}
              </div>
            </div>
          </div>

          {/* Multiplier Badge */}
          <div className="text-center mt-4">
            <span
              className="inline-block px-4 py-1 rounded-full text-sm font-bold"
              style={{
                background: `${primaryColor}20`,
                color: primaryColor,
              }}
            >
              {multiplier.toFixed(1)}x return
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mt-4 text-mh-text-dim text-sm italic">
            &ldquo;{headline}&rdquo;
          </div>
        </div>

        {/* Continue Button */}
        <div className="p-4 border-t border-mh-border">
          <button
            onClick={dismissCelebration}
            className="w-full py-3 rounded font-bold text-sm transition-all cursor-pointer hover:brightness-110"
            style={{
              background: `${primaryColor}20`,
              border: `2px solid ${primaryColor}`,
              color: primaryColor,
            }}
          >
            {isProfit ? 'COLLECT WINNINGS' : 'CONTINUE'}
          </button>
        </div>
      </div>
    </div>
  )
}
