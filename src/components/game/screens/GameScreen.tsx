'use client'

import { useGame } from '@/hooks/useGame'
import { ASSETS } from '@/lib/game/assets'
import { Header } from '../ui/Header'
import { StatsBar } from '../ui/StatsBar'
import { NewsPanel } from '../ui/NewsPanel'
import { PortfolioOverlay } from '../ui/PortfolioOverlay'
import { NewsDetailOverlay } from '../ui/NewsDetailOverlay'
import { StartupOfferOverlay } from '../ui/StartupOfferOverlay'
import { PEExitOfferOverlay } from '../ui/PEExitOfferOverlay'
import { EncounterPopup } from '../ui/EncounterPopup'
import { LiquidationSelectionOverlay } from '../ui/LiquidationSelectionOverlay'
import { StrategiesPanel } from '../ui/StrategiesPanel'
import { InvestmentResultOverlay } from '../ui/InvestmentResultOverlay'
import { AssetGrid } from '../trading/AssetGrid'
import { TradeSheet } from '../trading/TradeSheet'

export function GameScreen() {
  const {
    message,
    triggerNextDay,
    setShowSettings,
    selectAsset,
    setShowPortfolio,
    selectedAsset: selectedAssetId,
    selectedTheme,
    getNetWorth,
    leveragedPositions,
    shortPositions,
    prices,
    setShowStrategiesPanel,
    activeStrategies,
  } = useGame()
  const isModern3 = selectedTheme === 'modern3'
  const isRetro2 = selectedTheme === 'retro2'
  const isBloomberg = selectedTheme === 'bloomberg'

  // Calculate risk level for margin positions
  const netWorth = getNetWorth()
  const leveragedExposure = leveragedPositions.reduce((sum, pos) => {
    const currentValue = pos.qty * (prices[pos.assetId] || 0)
    // Debt exposure = how much the position could lose
    return sum + pos.debtAmount
  }, 0)
  const shortExposure = shortPositions.reduce((sum, pos) => {
    return sum + pos.qty * (prices[pos.assetId] || 0)
  }, 0)
  const totalExposure = leveragedExposure + shortExposure

  // Risk levels - only show if there's actual exposure
  const hasExposure = totalExposure > 0
  const isCritical = hasExposure && netWorth < totalExposure * 0.15
  const isHighRisk = hasExposure && !isCritical && netWorth < totalExposure * 0.3

  // Handler for clicking an asset in the portfolio overlay
  const handlePortfolioAssetSelect = (assetId: string) => {
    setShowPortfolio(false)
    selectAsset(assetId)
  }

  // Get selected asset object
  const selectedAsset = selectedAssetId
    ? ASSETS.find(a => a.id === selectedAssetId)
    : null

  return (
    <div className="bg-mh-bg flex flex-col h-full relative">
      <PortfolioOverlay onSelectAsset={handlePortfolioAssetSelect} />
      <NewsDetailOverlay />
      <StartupOfferOverlay />
      <PEExitOfferOverlay />
      <EncounterPopup />
      <LiquidationSelectionOverlay />
      <StrategiesPanel />
      {/* Celebration overlays - highest priority (z-500) */}
      <InvestmentResultOverlay />

      {/* Desktop: two-column layout */}
      <div className="flex flex-col md:flex-row md:flex-1 md:min-h-0">
        {/* Left: Main trading area */}
        <div className="flex flex-col md:flex-1 md:min-w-0">
          <Header />
          <StatsBar />

          {/* Mobile-only news */}
          <div className="md:hidden">
            <NewsPanel />
          </div>

          {/* Message */}
          {message && (
            <div className={`py-3 px-4 text-mh-accent-blue text-sm md:text-base font-bold text-center ${isModern3 ? '' : 'border-b border-mh-border'}`}>
              &gt; {message}
            </div>
          )}

          {/* Asset Grid */}
          <div className="flex-1">
            <AssetGrid />
          </div>

          {/* Risk Warning Banner */}
          {(isHighRisk || isCritical) && (
            <div
              className={`px-4 py-2 text-center text-sm font-bold ${
                isCritical ? 'bg-mh-loss-red/20 text-mh-loss-red' : 'bg-yellow-500/20 text-yellow-500'
              }`}
            >
              {isCritical
                ? '⚠️ CRITICAL: One bad day could wipe you out!'
                : '⚠️ HIGH RISK: Your leverage exposure is dangerous'}
            </div>
          )}

          {/* Bottom Bar */}
          <div
            className={`p-3 md:p-4 bg-mh-bg flex items-center gap-3 ${isModern3 ? '' : 'border-t border-mh-border'}`}
            style={isModern3 ? { boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.3)' } : undefined}
          >
            <button
              onClick={() => setShowSettings(true)}
              className="w-12 h-12 flex items-center justify-center text-mh-text-dim hover:text-mh-text-bright cursor-pointer bg-transparent border-2 border-mh-border rounded text-xl"
              title="Settings"
            >
              ⚙️
            </button>
            <button
              onClick={() => setShowStrategiesPanel(true)}
              className={`w-12 h-12 flex items-center justify-center cursor-pointer bg-transparent border-2 rounded text-xl relative ${
                activeStrategies.length > 0
                  ? 'border-purple-500 text-purple-400'
                  : 'border-mh-border text-mh-text-dim hover:text-mh-text-bright'
              }`}
              title="Strategies"
            >
              ♟️
              {activeStrategies.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeStrategies.length}
                </span>
              )}
            </button>
            <button
              onClick={triggerNextDay}
              className={`flex-1 h-12 font-bold cursor-pointer rounded ${
                isModern3
                  ? 'text-[#0a0e14] text-sm'
                  : isBloomberg
                    ? 'font-mono border-2 border-[#ff8c00] bg-[#1a1000] text-[#ff8c00] text-lg hover:bg-[#2a1800]'
                    : 'font-mono text-sm tracking-wider'
              }`}
              style={
                isModern3 ? {
                  background: 'linear-gradient(135deg, #00d4aa 0%, #00a88a 100%)',
                  boxShadow: '0 4px 20px rgba(0, 212, 170, 0.4)',
                  letterSpacing: '2px',
                } : isRetro2 ? {
                  background: '#00ff88',
                  color: '#000000',
                  boxShadow: '0 0 15px rgba(0, 255, 136, 0.6), 0 0 30px rgba(0, 255, 136, 0.3)',
                  fontWeight: 700,
                } : !isBloomberg ? {
                  background: 'transparent',
                  color: '#c8d8e8',
                  border: '2px solid #c8d8e8',
                  boxShadow: '0 0 10px rgba(200, 216, 232, 0.4), 0 0 20px rgba(200, 216, 232, 0.2)',
                  fontWeight: 700,
                } : undefined
              }
            >
              ADVANCE ▶
            </button>
          </div>
        </div>

        {/* Right: News sidebar (desktop only) */}
        <div className={`hidden md:flex md:flex-col md:w-[340px] lg:w-[400px] md:border-l border-mh-border ${isBloomberg ? 'border-[#333333]' : ''}`}>
          <NewsPanel />
        </div>
      </div>

      {/* TradeSheet */}
      <TradeSheet
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => selectAsset(null)}
      />
    </div>
  )
}
