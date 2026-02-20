'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useGame } from '@/hooks/useGame'
import { useUserDetails } from '@/hooks/useUserDetails'
import { useStripeCheckout } from '@/hooks/useStripeCheckout'
import { getEndGameMessage, type MarginCallContext } from '@/lib/game/endGameMessages'
import { ASSETS } from '@/lib/game/assets'
import { AuthModal } from '@/components/auth/AuthModal'
import { GuestEndView } from './endGameViews/GuestEndView'
import { ProEndView } from './endGameViews/ProEndView'
import { RoomLeaderboard } from '../rooms/RoomLeaderboard'
import { RoomLiveStandings } from '../rooms/RoomLiveStandings'
import { useRoom } from '@/hooks/useRoom'
import type { EndGameProps, LossBreakdown, LeaderboardRank } from './endGameViews/types'

const STARTING_NET_WORTH = 0
const STARTING_CAPITAL = 50_000

export function EndGameCoordinator() {
  const screen = useGame((state) => state.screen)
  const day = useGame((state) => state.day)
  const gameDuration = useGame((state) => state.gameDuration)
  const gameOverReason = useGame((state) => state.gameOverReason)
  const getNetWorth = useGame((state) => state.getNetWorth)
  const startGame = useGame((state) => state.startGame)
  const gamesRemaining = useGame((state) => state.gamesRemaining)

  const isLoggedIn = useGame((state) => state.isLoggedIn)
  const getProTrialGamesRemaining = useGame((state) => state.getProTrialGamesRemaining)
  const { isPro } = useUserDetails()

  const username = useGame((state) => state.username)
  const leveragedPositions = useGame((state) => state.leveragedPositions)
  const shortPositions = useGame((state) => state.shortPositions)
  const prices = useGame((state) => state.prices)
  const cash = useGame((state) => state.cash)

  const roomId = useRoom(state => state.roomId)
  const roomCode = useRoom(state => state.roomCode)
  const roomStatus = useRoom(state => state.roomStatus)
  const submitRoomResult = useRoom(state => state.submitResult)
  const returnToHub = useRoom(state => state.returnToHub)
  const roomSubmittedRef = useRef(false)

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [leaderboardRank, setLeaderboardRank] = useState<LeaderboardRank | undefined>()

  const { checkout, loading: checkoutLoading } = useStripeCheckout()

  // Fetch leaderboard rank after a short delay (gives fire-and-forget save time to land)
  // Skip for room games — room has its own standings
  useEffect(() => {
    if (!username || roomId) return

    const timer = setTimeout(async () => {
      try {
        const score = getNetWorth()
        const params = new URLSearchParams({
          username,
          score: String(Math.round(score)),
          duration: String(gameDuration),
        })
        const res = await fetch(`/api/leaderboard/rank?${params}`)
        if (res.ok) {
          const data = await res.json()
          setLeaderboardRank(data)
        }
      } catch {
        // Silent fail — rank section simply won't render
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [username, gameDuration, getNetWorth, roomId])

  // Submit room result if in a room game
  useEffect(() => {
    if (!roomId || roomSubmittedRef.current) return
    roomSubmittedRef.current = true

    const nw = getNetWorth()
    submitRoomResult({
      finalNetWorth: Math.round(nw),
      profitPercent: ((nw - STARTING_NET_WORTH) / STARTING_CAPITAL * 100) || 0,
      daysSurvived: screen === 'win' ? gameDuration : day,
      outcome: screen === 'win' ? 'win' : gameOverReason,
      username: username || 'unknown',
    })
  }, [roomId, submitRoomResult, getNetWorth, screen, gameDuration, day, gameOverReason, username])

  const outcome: 'win' | 'loss' = screen === 'win' ? 'win' : 'loss'
  const netWorth = getNetWorth()
  const profitAmount = (netWorth - STARTING_NET_WORTH) || 0
  const profitPercent = ((netWorth - STARTING_NET_WORTH) / STARTING_CAPITAL * 100) || 0
  const daysSurvived = outcome === 'win' ? gameDuration : day
  const reason = outcome === 'win' ? 'WIN' : gameOverReason
  const canPlayAgain = gamesRemaining > 0

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

  const marginCallContext = useMemo((): MarginCallContext | undefined => {
    if (!lossBreakdown) return undefined

    // Find worst leveraged position (most negative P&L)
    const worstLeveraged = lossBreakdown.leveragedLosses.length > 0
      ? [...lossBreakdown.leveragedLosses].sort((a, b) => a.pl - b.pl)[0]
      : undefined

    // Find worst short position (most negative P&L)
    const worstShort = lossBreakdown.shortLosses.length > 0
      ? [...lossBreakdown.shortLosses].sort((a, b) => a.pl - b.pl)[0]
      : undefined

    return { worstLeveraged, worstShort }
  }, [lossBreakdown])

  const message = getEndGameMessage(reason, marginCallContext)

  const handlePlayAgain = () => {
    if (roomId) {
      returnToHub()
    } else {
      startGame()
    }
  }

  const handleBackToRoom = roomId ? () => returnToHub() : undefined

  const handleCheckout = (plan: 'monthly' | 'yearly') => {
    if (!checkoutLoading) {
      checkout(plan)
    }
  }

  const handleOpenAuth = () => {
    setShowAuthModal(true)
  }

  const roomStandings = roomId ? (
    roomStatus === 'finished' ? <RoomLeaderboard /> : <RoomLiveStandings />
  ) : undefined

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
    leaderboardRank,
    roomStandings,
    onBackToRoom: handleBackToRoom,
    roomCode: roomCode ?? undefined,
  }

  return (
    <>
      {isLoggedIn ? (
        <ProEndView {...props} />
      ) : (
        <GuestEndView {...props} />
      )}

      {/* Auth Modal (shared across views) */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
