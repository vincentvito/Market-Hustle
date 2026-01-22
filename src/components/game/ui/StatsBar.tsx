'use client'

import { useGame } from '@/hooks/useGame'

export function StatsBar() {
  const {
    cash,
    getPortfolioValue,
    getPortfolioChange,
    setShowPortfolio,
  } = useGame()
  const portfolioValue = getPortfolioValue()
  const portfolioChange = getPortfolioChange()

  return (
    <div className="flex border-b border-mh-border text-sm">
      <div className="flex-1 p-3 border-r border-mh-border">
        <div className="text-mh-text-dim text-xs">CASH</div>
        <div className="text-mh-accent-blue font-bold text-base">${cash.toLocaleString()}</div>
      </div>
      <div
        onClick={() => portfolioValue > 0 && setShowPortfolio(true)}
        className={`flex-1 p-3 ${
          portfolioValue > 0 ? 'cursor-pointer bg-mh-accent-blue/5' : ''
        }`}
      >
        <div className="text-mh-text-dim text-xs flex items-center gap-1">
          PORTFOLIO {portfolioValue > 0 && <span className="text-xs">▼</span>}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-mh-accent-blue font-bold text-base">
            ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          {portfolioValue > 0 && (
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
