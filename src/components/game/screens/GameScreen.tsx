'use client'

import { useGame } from '@/hooks/useGame'
import { ASSETS } from '@/lib/game/assets'
import type { LuxuryAssetId } from '@/lib/game/types'
import { isDev } from '@/lib/env'
import { Header } from '../ui/Header'
import { StatsBar } from '../ui/StatsBar'
import { NewsPanel } from '../ui/NewsPanel'
import { PortfolioOverlay } from '../ui/PortfolioOverlay'
import { NewsDetailOverlay } from '../ui/NewsDetailOverlay'
import { StartupOfferOverlay } from '../ui/StartupOfferOverlay'
import { PEExitOfferOverlay } from '../ui/PEExitOfferOverlay'
import { EncounterPopup } from '../ui/EncounterPopup'
import { ElectionPopup } from '../ui/ElectionPopup'
import { LiquidationSelectionOverlay } from '../ui/LiquidationSelectionOverlay'
import { InvestmentResultOverlay } from '../ui/InvestmentResultOverlay'
import { AssetGrid } from '../trading/AssetGrid'
import { TradeSheet } from '../trading/TradeSheet'
import { HowToPlayModal, InteractiveTutorial, isTutorialSeen } from '../ui/HowToPlayModal'
import { TradeFeedback } from '../ui/TradeFeedback'
import { ActionsModal } from '../ui/ActionsModal'
import { GiftsModal } from '../ui/GiftsModal'
import { OffshoreTrustModal } from '../ui/OffshoreTrustModal'
import { DebtRepaymentModal } from '../ui/DebtRepaymentModal'
import { RoomProgressBar } from '../rooms/RoomProgressBar'
import { useState, useEffect } from 'react'

export function GameScreen() {
  const {
    triggerNextDay,
    selectAsset,
    setShowPortfolio,
    selectedAsset: selectedAssetId,
    selectedTheme,
    getNetWorth,
    leveragedPositions,
    shortPositions,
    prices,
    setPendingLifestyleAsset,
    setPendingLuxuryAsset,
    showActionsModal,
    setShowActionsModal,
    showGiftsModal,
    setShowGiftsModal,
    pendingGameOver,
  } = useGame()
  const [showHelp, setShowHelp] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  // DEV: Shift+E to skip to end screen
  useEffect(() => {
    if (!isDev) return
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'E') {
        useGame.getState().setScreen('win')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  const [showOffshoreTrust, setShowOffshoreTrust] = useState(false)
  const [showCreditCards, setShowCreditCards] = useState(false)
  // Show interactive tutorial on first game only
  useEffect(() => {
    if (!isTutorialSeen()) {
      setShowTutorial(true)
    }
  }, [])

  const isModern3 = selectedTheme === 'modern3' || selectedTheme === 'modern3list'
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

  // Handler for clicking a lifestyle asset in portfolio
  const handlePortfolioLifestyleSelect = (assetId: string) => {
    setShowPortfolio(false)
    setPendingLifestyleAsset(assetId)
  }

  // Handler for clicking a luxury asset in portfolio
  const handlePortfolioLuxurySelect = (assetId: LuxuryAssetId) => {
    setShowPortfolio(false)
    setPendingLuxuryAsset(assetId)
  }

  // Get selected asset object
  const selectedAsset = selectedAssetId
    ? ASSETS.find(a => a.id === selectedAssetId)
    : null

  return (
    <div className="bg-mh-bg flex flex-col h-dvh relative">
      <TradeFeedback />
      {showHelp && <HowToPlayModal onClose={() => setShowHelp(false)} />}
      {showTutorial && <InteractiveTutorial onClose={() => setShowTutorial(false)} />}
      <ActionsModal />
      <GiftsModal />
      <Header />
      <RoomProgressBar />
      <StatsBar onDebtClick={() => setShowCreditCards(true)} />
      <PortfolioOverlay
        onSelectAsset={handlePortfolioAssetSelect}
        onSelectLifestyle={handlePortfolioLifestyleSelect}
        onSelectLuxury={handlePortfolioLuxurySelect}
      />
      <NewsDetailOverlay />
      <StartupOfferOverlay />
      <PEExitOfferOverlay />
      <EncounterPopup />
      <LiquidationSelectionOverlay />
      {/* Election popup - highest priority (z-500) */}
      <ElectionPopup />
      {/* Celebration overlays - highest priority (z-500) */}
      <InvestmentResultOverlay />
      <NewsPanel />

      {/* Asset Grid */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <AssetGrid />
      </div>

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

      {/* Floating Help Button - bottom left above action bar */}
      <button
        onClick={() => setShowHelp(true)}
        className="lg:hidden fixed bottom-[72px] left-3 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-mh-bg border-2 border-mh-border text-mh-text-dim hover:text-mh-text-bright cursor-pointer text-sm font-mono shadow-lg"
        title="How to Play"
      >
        ?
      </button>

      {/* FBI Heat Bar - DISABLED (kept for future use) */}

      {/* Bottom Bar - Action Strip */}
      <div
        className={`p-3 bg-mh-bg flex items-center gap-2 sticky bottom-0 z-50 ${isModern3 ? '' : 'border-t border-mh-border'}`}
        style={isModern3 ? { boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.3)' } : undefined}
      >
        {/* Help Button - desktop only, inline */}
        <button
          onClick={() => setShowHelp(true)}
          className="hidden lg:flex w-12 h-12 items-center justify-center text-mh-text-dim hover:text-mh-text-bright cursor-pointer bg-transparent border-2 border-mh-border rounded text-base font-mono flex-shrink-0"
          title="How to Play"
        >
          ?
        </button>

        {/* Trust Button */}
        <button
          onClick={() => setShowOffshoreTrust(true)}
          className="h-12 w-12 flex items-center justify-center text-mh-text-dim hover:text-mh-text-bright cursor-pointer bg-transparent border-2 border-mh-border rounded flex-shrink-0"
          title="Offshore Trust"
        >
          <span className="text-lg leading-none">🏦</span>
        </button>

        {/* Credit Button */}
        <button
          onClick={() => setShowCreditCards(true)}
          className="h-12 w-12 flex items-center justify-center text-mh-text-dim hover:text-mh-text-bright cursor-pointer bg-transparent border-2 border-mh-border rounded flex-shrink-0"
          title="Credit Cards"
        >
          <span className="text-lg leading-none">💳</span>
        </button>

        {/* Actions Button */}
        <button
          onClick={() => setShowActionsModal(true)}
          className="h-12 w-12 flex items-center justify-center text-mh-text-dim hover:text-mh-text-bright cursor-pointer bg-transparent border-2 border-mh-border rounded flex-shrink-0"
          title="Actions"
        >
          <span className="text-lg leading-none">🎯</span>
        </button>

        {/* Next Day Button */}
        <button
          id="tutorial-next-day"
          onClick={triggerNextDay}
          className={`h-12 font-bold cursor-pointer rounded flex-1 ${
            isModern3
              ? 'text-[#0a0e14] text-sm'
              : isBloomberg
                ? 'font-mono border-2 border-[#ff8c00] bg-[#1a1000] text-[#ff8c00] text-base hover:bg-[#2a1800]'
                : 'font-mono text-sm tracking-wider'
          }`}
          style={
            isModern3 ? {
              background: 'linear-gradient(135deg, #00d4aa 0%, #00a88a 100%)',
              boxShadow: '0 4px 20px rgba(0, 212, 170, 0.4)',
              letterSpacing: '1px',
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
            } : {
            }
          }
        >
          {pendingGameOver ? 'GAME OVER' : 'ADVANCE →'}
        </button>
      </div>

      {/* Trust & Credit Modals */}
      {showOffshoreTrust && (
        <OffshoreTrustModal onClose={() => setShowOffshoreTrust(false)} />
      )}
      {showCreditCards && (
        <DebtRepaymentModal onClose={() => setShowCreditCards(false)} />
      )}

      {/* TradeSheet - rendered at GameScreen level for proper absolute positioning */}
      <TradeSheet
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => selectAsset(null)}
      />
    </div>
  )
}
