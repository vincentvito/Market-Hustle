'use client'

import { useGame } from '@/hooks/useGame'
import { ASSETS } from '@/lib/game/assets'
import { Header } from '../ui/Header'
import { StatsBar } from '../ui/StatsBar'
import { NewsPanel } from '../ui/NewsPanel'
import { PortfolioOverlay } from '../ui/PortfolioOverlay'
import { NewsDetailOverlay } from '../ui/NewsDetailOverlay'
import { StartupOfferOverlay } from '../ui/StartupOfferOverlay'
import { EncounterPopup } from '../ui/EncounterPopup'
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
    <div className="bg-mh-bg flex flex-col min-h-full relative">
      <Header />
      <StatsBar />
      <PortfolioOverlay onSelectAsset={handlePortfolioAssetSelect} />
      <NewsDetailOverlay />
      <StartupOfferOverlay />
      <EncounterPopup />
      <NewsPanel />

      {/* Message */}
      {message && (
        <div className={`py-3 px-4 text-mh-accent-blue text-sm font-bold text-center ${isModern3 ? '' : 'border-b border-mh-border'}`}>
          &gt; {message}
        </div>
      )}

      {/* Asset Grid */}
      <AssetGrid />

      {/* Risk Warning Banner - shows when margin exposure is dangerous */}
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
        className={`p-3 bg-mh-bg flex items-center gap-3 ${isModern3 ? '' : 'border-t border-mh-border'}`}
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
              // RETRO2: Green glowing background, black text
              background: '#00ff88',
              color: '#000000',
              boxShadow: '0 0 15px rgba(0, 255, 136, 0.6), 0 0 30px rgba(0, 255, 136, 0.3)',
              fontWeight: 700,
            } : !isBloomberg ? {
              // RETRO (default): White border and text, transparent background
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

      {/* TradeSheet - rendered at GameScreen level for proper absolute positioning */}
      <TradeSheet
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => selectAsset(null)}
      />
    </div>
  )
}
