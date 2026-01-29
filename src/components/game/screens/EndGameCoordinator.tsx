'use client'

import { useState, useMemo } from 'react'
import { useGame } from '@/hooks/useGame'
import { useUserDetails } from '@/hooks/useUserDetails'
import { useStripeCheckout } from '@/hooks/useStripeCheckout'
import { getEndGameMessage } from '@/lib/game/endGameMessages'
import { ASSETS } from '@/lib/game/assets'
import { AuthModal } from '@/components/auth/AuthModal'
import { GuestEndView } from './endGameViews/GuestEndView'
import { MemberEndView } from './endGameViews/MemberEndView'
import { ProEndView } from './endGameViews/ProEndView'
import type { EndGameProps, LossBreakdown } from './endGameViews/types'

const INITIAL_CASH = 100000

/**
 * EndGameCoordinator - Master dispatcher for end-game screens.
 *
 * Responsibilities:
 * 1. Subscribe to game state and auth context
 * 2. Compute all data needed by views (props-based architecture)
 * 3. Route to appropriate tier-specific view (Guest, Member, Pro)
 * 4. Manage shared state (auth modal)
 */
export function EndGameCoordinator() {
  // Game state
  const screen = useGame((state) => state.screen)
  const day = useGame((state) => state.day)
  const gameDuration = useGame((state) => state.gameDuration)
  const gameOverReason = useGame((state) => state.gameOverReason)
  const getNetWorth = useGame((state) => state.getNetWorth)
  const startGame = useGame((state) => state.startGame)
  const gamesRemaining = useGame((state) => state.gamesRemaining)

  // Auth state
  const isLoggedIn = useGame((state) => state.isLoggedIn)
  const getProTrialGamesRemaining = useGame((state) => state.getProTrialGamesRemaining)
  const { isPro } = useUserDetails()

  // Pro-specific data for loss breakdown
  const leveragedPositions = useGame((state) => state.leveragedPositions)
  const shortPositions = useGame((state) => state.shortPositions)
  const prices = useGame((state) => state.prices)
  const cash = useGame((state) => state.cash)

  // Local state
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Hooks
  const { checkout, loading: checkoutLoading } = useStripeCheckout()

  // Compute derived values
  const outcome: 'win' | 'loss' = screen === 'win' ? 'win' : 'loss'
  const netWorth = getNetWorth()
  const profitAmount = netWorth - INITIAL_CASH
  const profitPercent = ((netWorth / INITIAL_CASH - 1) * 100)
  const daysSurvived = outcome === 'win' ? gameDuration : day
  const reason = outcome === 'win' ? 'WIN' : gameOverReason
  const message = getEndGameMessage(reason)
  const canPlayAgain = gamesRemaining > 0

  // Compute loss breakdown for Pro users
  const lossBreakdown = useMemo((): LossBreakdown | undefined => {
    if (!isPro || outcome !== 'loss') return undefined

    // Only show breakdown for relevant game-over reasons
    const showBreakdown =
      gameOverReason === 'MARGIN_CALLED' ||
      gameOverReason === 'SHORT_SQUEEZED' ||
      gameOverReason === 'BANKRUPT' ||
      gameOverReason === 'ECONOMIC_CATASTROPHE'

    if (!showBreakdown) return undefined

    const leveragedLosses = leveragedPositions
      .map((pos) => {
        const currentValue = pos.qty * (prices[pos.assetId] || pos.entryPrice)
        const equity = currentValue - pos.debtAmount
        const originalEquity = (pos.qty * pos.entryPrice) / pos.leverage
        const pl = equity - originalEquity
        const asset = ASSETS.find((a) => a.id === pos.assetId)
        return {
          name: asset?.name || pos.assetId,
          pl,
          leverage: pos.leverage,
          isUnderwater: equity < 0,
        }
      })
      .filter((p) => p.pl < 0)

    const shortLosses = shortPositions
      .map((pos) => {
        const currentLiability = pos.qty * (prices[pos.assetId] || pos.entryPrice)
        const pl = pos.cashReceived - currentLiability
        const asset = ASSETS.find((a) => a.id === pos.assetId)
        return { name: asset?.name || pos.assetId, pl }
      })
      .filter((p) => p.pl < 0)

    if (leveragedLosses.length === 0 && shortLosses.length === 0) return undefined

    return {
      leveragedLosses,
      shortLosses,
      cashRemaining: cash,
    }
  }, [isPro, outcome, gameOverReason, leveragedPositions, shortPositions, prices, cash])

  // Action handlers
  const handlePlayAgain = () => {
    if (canPlayAgain) {
      startGame()
    }
  }

  const handleCheckout = (plan: 'monthly' | 'yearly') => {
    if (!checkoutLoading) {
      checkout(plan)
    }
  }

  const handleOpenAuth = () => {
    setShowAuthModal(true)
  }

  // Build props for views
  const props: EndGameProps = {
    outcome,
    gameOverReason: reason,
    message,
    netWorth,
    profitPercent,
    profitAmount,
    daysSurvived,
    gameDuration,
    gamesRemaining,
    canPlayAgain,
    onPlayAgain: handlePlayAgain,
    onCheckout: handleCheckout,
    onOpenAuth: handleOpenAuth,
    lossBreakdown,
    proTrialGamesRemaining: getProTrialGamesRemaining(),
  }

  // Determine user type and render appropriate view
  const isGuest = !isLoggedIn

  return (
    <>
      {isGuest && <GuestEndView {...props} />}
      {!isGuest && isPro && <ProEndView {...props} />}
      {!isGuest && !isPro && <MemberEndView {...props} />}

      {/* Auth Modal (shared across views) */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
