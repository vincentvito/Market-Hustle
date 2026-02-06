'use client'

import { useGame } from '@/hooks/useGame'
import { formatNetWorth } from '@/lib/utils/formatMoney'

export function Header() {
  const { day, gameDuration, getNetWorth, selectedTheme, setShowPortfolio } = useGame()
  const netWorth = getNetWorth()
  const { text: netWorthText, sizeClass: netWorthSize } = formatNetWorth(netWorth)
  const isModern3 = selectedTheme === 'modern3'
  const isBloomberg = selectedTheme === 'bloomberg'

  const getNetWorthStyle = (): React.CSSProperties => {
    if (isModern3 && netWorth >= 10000) {
      return { textShadow: '0 0 20px rgba(0, 212, 170, 0.4)' }
    }
    return {}
  }

  const getBloombergNetWorthStyle = (): React.CSSProperties => {
    if (!isBloomberg) return {}
    return {
      backgroundColor: netWorth >= 10000 ? '#003300' : '#330000',
      color: netWorth >= 10000 ? '#00cc00' : '#ff3333',
      padding: '2px 8px',
    }
  }

  return (
    <div
      className={`px-4 pt-4 pb-1 md:px-6 md:pt-5 md:pb-2 flex justify-between items-start ${
        isBloomberg ? 'border-b border-[#333333]' : isModern3 ? '' : 'border-b border-mh-border'
      }`}
      style={isModern3 ? { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' } : undefined}
    >
      {/* Left: Day Counter */}
      <div id="tutorial-day-counter">
        <div className={`text-xs ${isBloomberg ? 'text-white font-bold' : 'text-mh-text-dim'}`}>DAY</div>
        <div className={`text-3xl md:text-4xl font-bold ${isBloomberg ? 'text-[#ff8c00]' : 'text-mh-text-bright glow-text'}`}>
          {day}<span className={`text-base ${isBloomberg ? 'text-[#8b6914]' : 'text-mh-text-dim'}`}>/{gameDuration}</span>
        </div>
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
  )
}
