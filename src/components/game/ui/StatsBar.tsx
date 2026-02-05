'use client'

import { useGame } from '@/hooks/useGame'
import { formatCompact } from '@/lib/utils/formatMoney'

export function StatsBar() {
  const {
    cash,
    fbiHeat = 0,
    wifeSuspicion = 0,
    getPortfolioValue,
    setShowPortfolio,
    selectedTheme,
    leveragedPositions,
    shortPositions,
  } = useGame()
  const portfolioValue = getPortfolioValue()
  const isBloomberg = selectedTheme === 'bloomberg'
  const hasPositions = portfolioValue > 0 || leveragedPositions.length > 0 || shortPositions.length > 0

  const getFbiColor = () => {
    if (fbiHeat >= 60) return '#ff3333' // Red for 60-100%
    if (fbiHeat >= 30) return '#ffaa00' // Yellow/Orange for 30-60%
    return '#00cc00' // Green for 0-30%
  }

  const getWifeColor = () => {
    if (wifeSuspicion >= 60) return '#ff3333' // Red for 60-100%
    if (wifeSuspicion >= 30) return '#ffaa00' // Yellow/Orange for 30-60%
    return '#00cc00' // Green for 0-30%
  }

  return (
    <>
      <div className="mx-3 md:mx-4 mt-3 md:mt-4 mb-2">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Heat Bars (stacked vertically) */}
          <div className="flex-1 max-w-[65%] space-y-3">
            {/* FBI Heat */}
            <div className="relative h-8 bg-[#1a1a1a] rounded-full overflow-hidden">
              {/* Fill bar */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  width: `${fbiHeat}%`,
                  backgroundColor: getFbiColor(),
                }}
              />
              {/* Labels inside bar */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <div className="text-sm font-bold text-white z-10">FBI</div>
                <div className="text-sm font-bold text-gray-400 z-10">{fbiHeat.toFixed(1)}%</div>
              </div>
            </div>

            {/* WIFE Heat */}
            <div className="relative h-8 bg-[#1a1a1a] rounded-full overflow-hidden">
              {/* Fill bar */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  width: `${wifeSuspicion}%`,
                  backgroundColor: getWifeColor(),
                }}
              />
              {/* Labels inside bar */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <div className="text-sm font-bold text-white z-10">WIFE</div>
                <div className="text-sm font-bold text-gray-400 z-10">{wifeSuspicion.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Right: Financial Stats (stacked vertically, right-aligned) */}
          <div className="text-right space-y-2">
            {/* Portfolio */}
            <div
              onClick={() => hasPositions && setShowPortfolio(true)}
              className={hasPositions ? 'cursor-pointer' : ''}
            >
              <div className={`text-xs ${isBloomberg ? 'text-white font-bold' : 'text-mh-text-dim'}`}>PORTFOLIO</div>
              <div className={`text-lg font-bold ${isBloomberg ? 'text-white' : 'text-mh-text-bright'}`}>
                {formatCompact(portfolioValue)}
              </div>
            </div>

            {/* Cash */}
            <div id="tutorial-cash">
              <div className={`text-xs ${isBloomberg ? 'text-white font-bold' : 'text-mh-text-dim'}`}>CASH</div>
              <div className={`text-lg font-bold ${isBloomberg ? 'text-white' : 'text-mh-text-bright'}`}>
                {formatCompact(cash)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
