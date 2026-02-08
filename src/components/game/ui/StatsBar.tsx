'use client'

import { useGame } from '@/hooks/useGame'
import { formatCompact } from '@/lib/utils/formatMoney'

interface StatsBarProps {
  onDebtClick?: () => void
}

export function StatsBar({ onDebtClick }: StatsBarProps) {
  const {
    cash,
    creditCardDebt,
    getPortfolioValue,
    setShowPortfolio,
    selectedTheme,
    leveragedPositions,
    shortPositions,
  } = useGame()
  const portfolioValue = getPortfolioValue()
  const isBloomberg = selectedTheme === 'bloomberg'
  const hasPositions = portfolioValue > 0 || leveragedPositions.length > 0 || shortPositions.length > 0

  return (
    <>
      <div className="mx-3 md:mx-4 mt-0.5 md:mt-1 mb-3 space-y-2">
        {/* Row 1: Cash, Debt, Portfolio - matching net worth font style */}
        <div className="flex items-center justify-between">
          <div id="tutorial-cash">
            <div className={`text-xs ${isBloomberg ? 'text-white font-bold' : 'text-mh-text-dim'}`}>CASH</div>
            <div className={`text-lg md:text-xl font-bold text-mh-text-bright ${isBloomberg ? 'text-white' : 'glow-text'}`}>
              {formatCompact(cash)}
            </div>
          </div>
          {creditCardDebt > 0 && (
            <div
              onClick={onDebtClick}
              className={onDebtClick ? 'cursor-pointer hover:opacity-80' : ''}
            >
              <div className={`text-xs ${isBloomberg ? 'text-white font-bold' : 'text-mh-text-dim'}`}>DEBT</div>
              <div className="text-lg md:text-xl font-bold text-mh-loss-red glow-red">
                {formatCompact(creditCardDebt)}
              </div>
            </div>
          )}
          <div
            onClick={() => hasPositions && setShowPortfolio(true)}
            className={hasPositions ? 'cursor-pointer' : ''}
          >
            <div className={`text-xs text-right ${isBloomberg ? 'text-white font-bold' : 'text-mh-text-dim'}`}>PORTFOLIO</div>
            <div className={`text-lg md:text-xl font-bold text-mh-text-bright text-right ${isBloomberg ? 'text-white' : 'glow-text'}`}>
              {formatCompact(portfolioValue)}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
