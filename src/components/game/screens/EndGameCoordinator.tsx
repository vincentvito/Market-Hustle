'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useGame } from '@/hooks/useGame'
import { useAuth } from '@/contexts/AuthContext'
import { useUserDetails } from '@/hooks/useUserDetails'
import { useStripeCheckout } from '@/hooks/useStripeCheckout'
import { getEndGameMessage, type MarginCallContext } from '@/lib/game/endGameMessages'
import { ASSETS } from '@/lib/game/assets'
import { AuthModal } from '@/components/auth/AuthModal'
import { ProUpgradeDialog } from '@/components/game/ui/ProUpgradeDialog'
import { GuestEndView } from './endGameViews/GuestEndView'
import { MemberEndView } from './endGameViews/MemberEndView'
import { ProEndView } from './endGameViews/ProEndView'
import { RoomLeaderboard } from '../rooms/RoomLeaderboard'
import { RoomLiveStandings } from '../rooms/RoomLiveStandings'
import { useRoom } from '@/hooks/useRoom'
import type { EndGameProps, LossBreakdown, LeaderboardRank } from './endGameViews/types'

const STARTING_CAPITAL = 50_000

export function EndGameCoordinator() {
  const screen = useGame((state) => state.screen)
  const day = useGame((state) => state.day)
  const gameDuration = useGame((state) => state.gameDuration)
  const gameOverReason = useGame((state) => state.gameOverReason)
  const getNetWorth = useGame((state) => state.getNetWorth)
  const startGame = useGame((state) => state.startGame)
  const setScreen = useGame((state) => state.setScreen)
  const gamesRemaining = useGame((state) => state.gamesRemaining)

  const isLoggedIn = useGame((state) => state.isLoggedIn)
  const { plan } = useUserDetails()
  // Use profile.tier from AuthContext as authoritative source for view routing
  // (game store's userTier can be stale from localStorage cache)
  const { profile } = useAuth()
  const actualTier = profile?.tier ?? 'free'

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
  const [showProDialog, setShowProDialog] = useState(false)
  const [leaderboardRank, setLeaderboardRank] = useState<LeaderboardRank | undefined>()
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)

  const { checkout, loading: checkoutLoading } = useStripeCheckout()

  useEffect(() => {
    if (isLoggedIn && actualTier !== 'pro') {
      const timer = setTimeout(() => setShowProDialog(true), 800)
      return () => clearTimeout(timer)
    }
  }, [isLoggedIn, actualTier])

  const rankFetchCount = useRef(0)
  useEffect(() => {
    if (!username || roomId) return
    rankFetchCount.current += 1
    setLeaderboardLoading(true)

    const delay = rankFetchCount.current > 1 ? 1500 : 600

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
        // Rank fetch failed
      } finally {
        setLeaderboardLoading(false)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [username, gameDuration, getNetWorth, roomId])

  useEffect(() => {
    if (!roomId || roomSubmittedRef.current) return
    roomSubmittedRef.current = true

    const nw = getNetWorth()
    submitRoomResult({
      finalNetWorth: Math.round(nw),
      profitPercent: (nw / STARTING_CAPITAL * 100) || 0,
      daysSurvived: screen === 'win' ? gameDuration : day,
      outcome: screen === 'win' ? 'win' : gameOverReason,
      username: username || 'unknown',
    })
  }, [roomId, submitRoomResult, getNetWorth, screen, gameDuration, day, gameOverReason, username])

  const outcome: 'win' | 'loss' = screen === 'win' ? 'win' : 'loss'
  const netWorth = getNetWorth()
  const profitAmount = netWorth
  const profitPercent = (netWorth / STARTING_CAPITAL * 100) || 0
  const daysSurvived = outcome === 'win' ? gameDuration : day
  const reason = outcome === 'win' ? 'WIN' : gameOverReason
  const canPlayAgain = gamesRemaining > 0

  const lossBreakdown = useMemo((): LossBreakdown | undefined => {
    if (actualTier !== 'pro' || outcome !== 'loss') return undefined

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
  }, [actualTier, outcome, gameOverReason, leveragedPositions, shortPositions, prices, cash])

  const marginCallContext = useMemo((): MarginCallContext | undefined => {
    if (!lossBreakdown) return undefined

    const worstLeveraged = lossBreakdown.leveragedLosses.length > 0
      ? [...lossBreakdown.leveragedLosses].sort((a, b) => a.pl - b.pl)[0]
      : undefined

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

  const handleMenu = () => setScreen('title')

  const handleBackToRoom = roomId ? returnToHub : undefined

  const handleCheckout = () => {
    if (!checkoutLoading) {
      checkout()
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
    onMenu: handleMenu,
    onCheckout: handleCheckout,
    onOpenAuth: handleOpenAuth,
    lossBreakdown,
    leaderboardRank,
    leaderboardLoading,
    roomStandings,
    onBackToRoom: handleBackToRoom,
    roomCode: roomCode ?? undefined,
  }

  return (
    <>
      {!isLoggedIn ? (
        <GuestEndView {...props} />
      ) : actualTier === 'pro' ? (
        <ProEndView {...props} />
      ) : (
        <MemberEndView {...props} />
      )}

      <ProUpgradeDialog
        isOpen={showProDialog}
        onClose={() => setShowProDialog(false)}
        onCheckout={handleCheckout}
        isWin={outcome === 'win'}
        loading={checkoutLoading}
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
