'use client'

import { useGame } from '@/hooks/useGame'
import { formatNetWorth } from '@/lib/utils/formatMoney'
import { useState } from 'react'
import { DebtRepaymentModal } from './DebtRepaymentModal'
import { OffshoreTrustModal } from './OffshoreTrustModal'

function formatCompactAmount(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

export function Header() {
  const { day, gameDuration, getNetWorth, selectedTheme, setShowPortfolio, creditCardDebt, trustFundBalance } = useGame()
  const [showOffshoreTrust, setShowOffshoreTrust] = useState(false)
  const [showCreditCards, setShowCreditCards] = useState(false)
  const netWorth = getNetWorth()
  const { text: netWorthText, sizeClass: netWorthSize } = formatNetWorth(netWorth)
  const isModern3 = selectedTheme === 'modern3'
  const isBloomberg = selectedTheme === 'bloomberg'

  // Modern 3: Strong cyan glow for net worth
  const getNetWorthStyle = (): React.CSSProperties => {
    if (isModern3 && netWorth >= 10000) {
      return { textShadow: '0 0 20px rgba(0, 212, 170, 0.4)' }
    }
    return {}
  }

  // Bloomberg: Colored cell background for net worth (key terminal feature)
  const getBloombergNetWorthStyle = (): React.CSSProperties => {
    if (!isBloomberg) return {}
    return {
      backgroundColor: netWorth >= 10000 ? '#003300' : '#330000',
      color: netWorth >= 10000 ? '#00cc00' : '#ff3333',
      padding: '2px 8px',
    }
  }

  return (
    <>
      <div
        className={`p-4 md:px-6 md:py-5 flex justify-between items-start ${
          isBloomberg ? 'border-b border-[#333333]' : isModern3 ? '' : 'border-b border-mh-border'
        }`}
        style={isModern3 ? { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' } : undefined}
      >
        {/* Left: Day Counter */}
        <div className="flex items-start gap-2">
          <div id="tutorial-day-counter">
            <div className={`text-xs ${isBloomberg ? 'text-white font-bold' : 'text-mh-text-dim'}`}>DAY</div>
            <div className={`text-3xl md:text-4xl font-bold ${isBloomberg ? 'text-[#ff8c00]' : 'text-mh-text-bright glow-text'}`}>
              {day}<span className={`text-base ${isBloomberg ? 'text-[#8b6914]' : 'text-mh-text-dim'}`}>/{gameDuration}</span>
            </div>
          </div>
        </div>

        {/* Center: Two Icons */}
        <div className="flex gap-4 items-start">
          <button
            onClick={() => setShowOffshoreTrust(true)}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all hover:scale-110 ${
              isBloomberg ? 'hover:text-[#ffcc00]' : 'hover:text-mh-accent-blue'
            }`}
            title="Offshore Trust"
          >
            <div className="text-2xl">🏦</div>
            <div className={`text-xs ${isBloomberg ? 'text-white font-bold' : 'text-mh-text-dim'}`}>TRUST</div>
            {trustFundBalance > 0 && (
              <div className="text-xs text-mh-accent-blue font-bold">
                {formatCompactAmount(trustFundBalance)}
              </div>
            )}
          </button>
          <button
            onClick={() => setShowCreditCards(true)}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all hover:scale-110 ${
              isBloomberg ? 'hover:text-[#ffcc00]' : 'hover:text-mh-accent-blue'
            }`}
            title="Credit Cards"
          >
            <div className="text-2xl">💳</div>
            <div className={`text-xs ${isBloomberg ? 'text-white font-bold' : 'text-mh-text-dim'}`}>CREDIT</div>
            {creditCardDebt > 0 && (
              <div className="text-xs text-mh-loss-red font-bold">
                DEBT -{formatCompactAmount(creditCardDebt)}
              </div>
            )}
          </button>
        </div>

        {/* Right: Net Worth */}
        <div
          id="tutorial-net-worth"
          className="text-right cursor-pointer"
          onClick={() => setShowPortfolio(true)}
        >
          <div className={`text-xs ${isBloomberg ? 'text-white font-bold' : 'text-mh-text-dim'}`}>NET WORTH</div>
          <div
            className={`${netWorthSize} font-bold ${
              isBloomberg ? '' : netWorth >= 10000 ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'
            }`}
            style={isBloomberg ? getBloombergNetWorthStyle() : getNetWorthStyle()}
          >
            {netWorthText}
          </div>
        </div>
      </div>

      {showOffshoreTrust && (
        <OffshoreTrustModal onClose={() => setShowOffshoreTrust(false)} />
      )}

      {showCreditCards && creditCardDebt > 0 && (
        <DebtRepaymentModal onClose={() => setShowCreditCards(false)} />
      )}

      {showCreditCards && creditCardDebt <= 0 && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center" onClick={() => setShowCreditCards(false)}>
          <div className="bg-mh-bg border border-mh-border rounded-lg p-6 max-w-md" onClick={e => e.stopPropagation()}>
            <p className="text-mh-text-bright text-lg mb-4">No outstanding debt! Your credit card is paid off.</p>
            <button
              onClick={() => setShowCreditCards(false)}
              className="w-full py-2 bg-mh-accent-blue text-white font-bold rounded hover:brightness-110"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
