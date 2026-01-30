'use client'

import { useGame } from '@/hooks/useGame'
import { ASSETS } from '@/lib/game/assets'
import { LIFESTYLE_ASSETS, RISK_TIER_COLORS, RISK_TIER_LABELS } from '@/lib/game/lifestyleAssets'

function formatPrice(p: number): string {
  if (p >= 1_000_000) return `${(p / 1_000_000).toFixed(1)}M`
  if (p >= 1000) return `${(p / 1000).toFixed(1)}K`
  if (p >= 100) return p.toFixed(0)
  if (p >= 10) return p.toFixed(1)
  return p.toFixed(2)
}

function formatLargePrice(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return `$${value.toFixed(0)}`
}

interface PortfolioOverlayProps {
  onSelectAsset?: (assetId: string) => void
}

export function PortfolioOverlay({ onSelectAsset }: PortfolioOverlayProps) {
  const {
    showPortfolio,
    setShowPortfolio,
    holdings,
    prices,
    cash,
    day,
    activeInvestments,
    ownedLifestyle,
    lifestylePrices,
    leveragedPositions,
    shortPositions,
    getNetWorth,
    getPortfolioValue,
    getPortfolioChange,
    getInvestmentChange,
    getAvgCost,
    getTotalPortfolioChange,
  } = useGame()

  if (!showPortfolio) return null

  const portfolioValue = getPortfolioValue()
  const dailyChange = getPortfolioChange()
  const totalChange = getTotalPortfolioChange()
  const netWorth = getNetWorth()

  return (
    <div
      onClick={() => setShowPortfolio(false)}
      className="fixed inset-0 bg-black/85 z-[200] flex items-center justify-center p-5"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-mh-bg border border-mh-border rounded-lg w-full max-w-[340px] max-h-[80vh] overflow-auto"
      >
        {/* Header */}
        <div className="p-4 border-b border-mh-border flex justify-between items-center">
          <div>
            <div className="text-mh-text-dim text-[10px]">PORTFOLIO VALUE</div>
            <div className="text-mh-text-bright text-2xl font-bold">
              ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="flex gap-3 mt-1 text-[10px]">
              <span className="text-mh-text-dim">
                Today:{' '}
                <span className={dailyChange >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'}>
                  {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(1)}%
                </span>
              </span>
              <span className="text-mh-text-dim">
                Total:{' '}
                <span className={totalChange >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'}>
                  {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(1)}%
                </span>
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowPortfolio(false)}
            className="bg-transparent border-none text-mh-text-dim text-2xl cursor-pointer px-2"
          >
            ×
          </button>
        </div>

        {/* Holdings List */}
        {ASSETS.filter(a => holdings[a.id] > 0).length > 0 && (
          <div className="py-2">
            {ASSETS.filter(a => holdings[a.id] > 0).map(asset => {
              const qty = holdings[asset.id]
              const value = qty * prices[asset.id]
              const investmentChange = getInvestmentChange(asset.id)
              const avgCost = getAvgCost(asset.id)
              const pctOfPortfolio = portfolioValue > 0 ? (value / portfolioValue) * 100 : 0

              return (
                <div
                  key={asset.id}
                  onClick={() => onSelectAsset?.(asset.id)}
                  className={`py-3 px-4 border-b border-[#1a2a3a] flex justify-between items-center ${
                    onSelectAsset ? 'cursor-pointer hover:bg-[#1a2a3a]/50 active:bg-[#1a2a3a]' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="text-mh-text-bright font-bold text-sm mb-1">
                      {asset.name}
                    </div>
                    <div className="text-mh-text-dim text-[11px]">
                      {qty} {qty === 1 ? 'share' : 'shares'}
                    </div>
                    <div className="text-mh-text-dim text-[10px] mt-0.5">
                      Avg cost: ${formatPrice(avgCost)}
                    </div>
                    {/* Allocation bar */}
                    <div className="mt-1.5 h-1 bg-[#1a2a3a] rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-mh-accent-blue"
                        style={{ width: `${pctOfPortfolio}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-mh-accent-blue font-bold text-sm mb-1">
                      ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div
                      className={`text-xs font-bold ${
                        investmentChange >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                      }`}
                    >
                      {investmentChange >= 0 ? '▲' : '▼'}
                      {investmentChange >= 0 ? '+' : ''}
                      {investmentChange.toFixed(1)}%
                    </div>
                    <div className="text-mh-text-dim text-[10px] mt-0.5">
                      {pctOfPortfolio.toFixed(1)}% of portfolio
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Leveraged Positions Section - Pro tier */}
        {leveragedPositions.length > 0 && (
          <div className="border-t border-mh-border">
            <div className="px-4 py-2 bg-[#0a1520]">
              <div className="text-mh-accent-blue text-[10px] font-bold tracking-wider">
                📈 LEVERAGED POSITIONS
              </div>
            </div>
            {leveragedPositions.map(pos => {
              const asset = ASSETS.find(a => a.id === pos.assetId)
              if (!asset) return null
              const currentPrice = prices[pos.assetId] || 0
              const currentValue = pos.qty * currentPrice
              const equity = currentValue - pos.debtAmount
              const originalEquity = pos.qty * pos.entryPrice / pos.leverage
              const pl = equity - originalEquity
              const plPct = originalEquity > 0 ? (pl / originalEquity) * 100 : 0
              const isUnderwater = equity < 0

              return (
                <div
                  key={pos.id}
                  onClick={() => onSelectAsset?.(pos.assetId)}
                  className={`py-3 px-4 border-b border-[#1a2a3a] flex justify-between items-center ${
                    onSelectAsset ? 'cursor-pointer hover:bg-[#1a2a3a]/50 active:bg-[#1a2a3a]' : ''
                  } ${isUnderwater ? 'bg-mh-loss-red/10' : ''}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-mh-accent-blue text-[10px] font-bold px-1.5 py-0.5 bg-mh-accent-blue/20 rounded">
                        {pos.leverage}x
                      </span>
                      <span className="text-mh-text-bright font-bold text-sm">
                        {asset.name}
                      </span>
                    </div>
                    <div className="text-mh-text-dim text-[11px]">
                      {pos.qty} shares @ ${formatPrice(pos.entryPrice)}
                    </div>
                    <div className="text-mh-text-dim text-[10px] mt-0.5">
                      Debt: ${pos.debtAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`font-bold text-sm mb-1 ${isUnderwater ? 'text-mh-loss-red' : 'text-mh-accent-blue'}`}>
                      ${equity.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div
                      className={`text-xs font-bold ${
                        isUnderwater ? 'text-mh-loss-red animate-pulse' : plPct >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                      }`}
                    >
                      {plPct >= 0 ? '▲' : '▼'}
                      {plPct >= 0 ? '+' : ''}
                      {plPct.toFixed(1)}%
                    </div>
                    {isUnderwater && (
                      <div className="text-mh-loss-red text-[10px] mt-0.5 font-bold">
                        UNDERWATER
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Short Positions Section - Pro tier */}
        {shortPositions.length > 0 && (
          <div className="border-t border-mh-border">
            <div className="px-4 py-2 bg-[#151008]">
              <div className="text-yellow-500 text-[10px] font-bold tracking-wider">
                🩳 SHORT POSITIONS
              </div>
            </div>
            {shortPositions.map(pos => {
              const asset = ASSETS.find(a => a.id === pos.assetId)
              if (!asset) return null
              const currentPrice = prices[pos.assetId] || 0
              const currentLiability = pos.qty * currentPrice
              const pl = pos.cashReceived - currentLiability
              const plPct = pos.cashReceived > 0 ? (pl / pos.cashReceived) * 100 : 0

              return (
                <div
                  key={pos.id}
                  onClick={() => onSelectAsset?.(pos.assetId)}
                  className={`py-3 px-4 border-b border-[#1a2a3a] flex justify-between items-center ${
                    onSelectAsset ? 'cursor-pointer hover:bg-[#1a2a3a]/50 active:bg-[#1a2a3a]' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500 text-[10px] font-bold px-1.5 py-0.5 bg-yellow-500/20 rounded">
                        SHORT
                      </span>
                      <span className="text-mh-text-bright font-bold text-sm">
                        {asset.name}
                      </span>
                    </div>
                    <div className="text-mh-text-dim text-[11px]">
                      {pos.qty} shares @ ${formatPrice(pos.entryPrice)}
                    </div>
                    <div className="text-mh-text-dim text-[10px] mt-0.5">
                      Received: ${pos.cashReceived.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-yellow-500 font-bold text-sm mb-1">
                      -${currentLiability.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div
                      className={`text-xs font-bold ${
                        plPct >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                      }`}
                    >
                      {plPct >= 0 ? '▲' : '▼'}
                      {plPct >= 0 ? '+' : ''}
                      {plPct.toFixed(1)}%
                    </div>
                    <div className="text-mh-text-dim text-[10px] mt-0.5">
                      Liability
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Private Investments Section */}
        {activeInvestments.length > 0 && (
          <div className="border-t border-mh-border">
            <div className="px-4 py-2 bg-[#0a0d10]">
              <div className="text-mh-text-dim text-[10px] font-bold tracking-wider">
                🚀 PRIVATE INVESTMENTS
              </div>
            </div>
            {activeInvestments.map(inv => {
              const daysRemaining = inv.resolvesDay - day
              return (
                <div
                  key={inv.startupId}
                  className="py-3 px-4 border-b border-[#1a2a3a] flex justify-between items-center"
                >
                  <div className="flex-1">
                    <div className="text-mh-news font-bold text-sm mb-1">
                      {inv.startupName}
                    </div>
                    <div className="text-mh-text-dim text-[11px]">
                      Invested Day {inv.investedDay}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-mh-accent-blue font-bold text-sm mb-1">
                      ${inv.amount.toLocaleString()}
                    </div>
                    <div className="text-mh-text-dim text-[10px]">
                      {daysRemaining > 0
                        ? `Resolves in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`
                        : 'Resolving today'
                      }
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Lifestyle Assets Section */}
        {ownedLifestyle.length > 0 && (
          <div className="border-t border-mh-border">
            <div className="px-4 py-2 bg-[#0a0d10]">
              <div className="text-mh-text-dim text-[10px] font-bold tracking-wider">
                🏠 LIFESTYLE ASSETS
              </div>
            </div>
            {ownedLifestyle.map(owned => {
              const asset = LIFESTYLE_ASSETS.find(a => a.id === owned.assetId)
              if (!asset) return null
              const currentPrice = lifestylePrices[owned.assetId] || asset.basePrice
              const profitLoss = currentPrice - owned.purchasePrice
              const profitLossPct = ((currentPrice / owned.purchasePrice) - 1) * 100
              const pctOfPortfolio = portfolioValue > 0 ? (currentPrice / portfolioValue) * 100 : 0

              return (
                <div
                  key={owned.assetId}
                  className="py-3 px-4 border-b border-[#1a2a3a] flex justify-between items-center"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-base">{asset.emoji}</span>
                      <span className="text-mh-text-bright font-bold text-sm">
                        {asset.name}
                      </span>
                      {/* Risk tier badge for PE assets */}
                      {asset.riskTier && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                          style={{
                            color: RISK_TIER_COLORS[asset.riskTier],
                            background: `${RISK_TIER_COLORS[asset.riskTier]}20`,
                          }}
                        >
                          {RISK_TIER_LABELS[asset.riskTier]}
                        </span>
                      )}
                      {/* AT RISK warning for high-risk PE */}
                      {asset.failureChancePerDay && asset.failureChancePerDay >= 0.005 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-mh-loss-red/20 text-mh-loss-red">
                          ⚠️ AT RISK
                        </span>
                      )}
                    </div>
                    <div className="text-mh-text-dim text-[11px]">
                      Bought Day {owned.purchaseDay} for {formatLargePrice(owned.purchasePrice)}
                    </div>
                    {/* Allocation bar */}
                    <div className="mt-1.5 h-1 bg-[#1a2a3a] rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-mh-accent-blue"
                        style={{ width: `${Math.min(pctOfPortfolio, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-mh-accent-blue font-bold text-sm mb-1">
                      {formatLargePrice(currentPrice)}
                    </div>
                    <div
                      className={`text-xs font-bold ${
                        profitLossPct >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
                      }`}
                    >
                      {profitLossPct >= 0 ? '▲' : '▼'}
                      {profitLossPct >= 0 ? '+' : ''}
                      {profitLossPct.toFixed(1)}%
                    </div>
                    <div className="text-mh-text-dim text-[10px] mt-0.5">
                      {pctOfPortfolio.toFixed(1)}% of portfolio
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Total row */}
        <div className="p-4 border-t border-mh-border flex justify-between items-center bg-[#0a0f14]">
          <div className="text-mh-text-dim font-bold">NET WORTH</div>
          <div className="text-right">
            <div className="text-mh-text-bright font-bold text-lg">
              ${netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-mh-text-dim text-[10px] mt-0.5">
              ${cash.toLocaleString()} cash
              {activeInvestments.length > 0 && (
                <span className="text-mh-news"> + ${activeInvestments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()} startups</span>
              )}
              {ownedLifestyle.length > 0 && (
                <span className="text-mh-accent-blue"> + {formatLargePrice(ownedLifestyle.reduce((sum, owned) => sum + (lifestylePrices[owned.assetId] || 0), 0))} lifestyle</span>
              )}
              {leveragedPositions.length > 0 && (
                <span className="text-mh-accent-blue">
                  {' '}+ ${leveragedPositions.reduce((sum, pos) => {
                    const currentValue = pos.qty * (prices[pos.assetId] || 0)
                    return sum + (currentValue - pos.debtAmount)
                  }, 0).toLocaleString()} leveraged
                </span>
              )}
              {shortPositions.length > 0 && (
                <span className="text-yellow-500">
                  {' '}- ${shortPositions.reduce((sum, pos) => {
                    return sum + pos.qty * (prices[pos.assetId] || 0)
                  }, 0).toLocaleString()} short
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
