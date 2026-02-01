'use client'

import { useGame } from '@/hooks/useGame'
import { formatCompact } from '@/lib/utils/formatMoney'

export function StatsBar() {
  const {
    cash,
    getPortfolioValue,
    getPortfolioChange,
    setShowPortfolio,
    selectedTheme,
    leveragedPositions,
    shortPositions,
  } = useGame()
  const portfolioValue = getPortfolioValue()
  const portfolioChange = getPortfolioChange()
  const isModern3 = selectedTheme === 'modern3'
  const isBloomberg = selectedTheme === 'bloomberg'
  const isRetro2 = selectedTheme === 'retro2'

  // Allow opening portfolio if there are regular holdings, leveraged positions, or short positions
  const hasPositions = portfolioValue > 0 || leveragedPositions.length > 0 || shortPositions.length > 0

  return (
    <div
      className={`flex text-sm ${
        isBloomberg ? 'border-b border-[#333333]' : isModern3 ? '' : 'border-b border-mh-border'
      }`}
      style={isModern3 ? { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' } : undefined}
    >
      <div className={`flex-1 p-3 ${
        isBloomberg ? 'border-r border-[#333333]' : isModern3 ? '' : 'border-r border-mh-border'
      }`}>
        <div className={`text-xs ${isBloomberg ? 'text-white font-bold' : 'text-mh-text-dim'}`}>CASH</div>
        <div
          className={`font-bold text-base ${
            isBloomberg ? 'text-[#ff8c00]' : isModern3 ? 'text-mh-text-bright' : isRetro2 ? 'text-mh-text-bright glow-text' : 'text-mh-accent-blue glow-text'
          }`}
        >
          {formatCompact(cash)}
        </div>
      </div>
      <div
        onClick={() => hasPositions && setShowPortfolio(true)}
        className={`flex-1 p-3 ${
          hasPositions
            ? isBloomberg ? 'cursor-pointer bg-[#1a1000]' : 'cursor-pointer bg-mh-accent-blue/5'
            : ''
        }`}
      >
        <div className={`text-xs flex items-center gap-1 ${isBloomberg ? 'text-white font-bold' : 'text-mh-text-dim'}`}>
          PORTFOLIO {hasPositions && <span className="text-xs">▼</span>}
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className={`font-bold text-base ${
              isBloomberg ? 'text-[#ff8c00]' : isModern3 ? 'text-mh-text-bright' : isRetro2 ? 'text-mh-text-bright glow-text' : 'text-mh-accent-blue glow-text'
            }`}
          >
            {formatCompact(portfolioValue)}
          </span>
          {hasPositions && (
            <span
              className={`text-sm font-bold ${
                portfolioChange >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
              }`}
            >
              {portfolioChange >= 0 ? '▲' : '▼'}
              {portfolioChange >= 0 ? '+' : ''}
              {portfolioChange.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
