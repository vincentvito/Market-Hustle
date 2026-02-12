'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useGame } from '@/hooks/useGame'
import {
  createShuffledDeck,
  dealInitialHands,
  hit,
  dealerPlay,
  resolveHand,
  getHandValue,
  getCardDisplay,
  isBlackjack,
  isBust,
  type Card,
  type BlackjackResult,
} from '@/lib/game/blackjack'

function CardView({ card, hidden }: { card: Card; hidden?: boolean }) {
  if (hidden) {
    return (
      <div className="w-12 h-16 rounded border-2 border-gray-600 bg-gray-700 flex items-center justify-center text-gray-400 text-lg font-bold flex-shrink-0">
        ?
      </div>
    )
  }

  const { text, isRed } = getCardDisplay(card)
  return (
    <div
      className={`w-12 h-16 rounded border-2 border-gray-300 bg-white flex items-center justify-center text-sm font-bold flex-shrink-0 ${
        isRed ? 'text-red-600' : 'text-gray-900'
      }`}
    >
      {text}
    </div>
  )
}

function Hand({ cards, hideSecond, label, value }: {
  cards: Card[]
  hideSecond?: boolean
  label: string
  value?: number
}) {
  return (
    <div className="text-center">
      <div className="text-mh-text-dim text-xs mb-1 font-bold uppercase tracking-wider">
        {label}{value !== undefined ? ` (${value})` : ''}
      </div>
      <div className="flex gap-1 justify-center flex-wrap">
        {cards.map((card, i) => (
          <CardView key={i} card={card} hidden={hideSecond && i === 1} />
        ))}
      </div>
    </div>
  )
}

interface CasinoBlackjackProps {
  onBack: () => void
}

export function CasinoBlackjack({ onBack }: CasinoBlackjackProps) {
  const { cash, applyCasinoResult, selectedTheme } = useGame()
  const isRetro2 = selectedTheme === 'retro2'

  const [phase, setPhase] = useState<'betting' | 'playing' | 'dealer_turn' | 'result'>('betting')
  const [deck, setDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [dealerHand, setDealerHand] = useState<Card[]>([])
  const [bet, setBet] = useState(0)
  const [result, setResult] = useState<{ type: BlackjackResult; cashDelta: number; headline: string } | null>(null)
  const [isDoubled, setIsDoubled] = useState(false)
  const dealerTurnRef = useRef(false)

  const finishRound = useCallback((pHand: Card[], dHand: Card[], currentBet: number) => {
    const resolved = resolveHand(pHand, dHand, currentBet)
    setResult({ type: resolved.result, cashDelta: resolved.cashDelta, headline: resolved.headline })
    applyCasinoResult(resolved.cashDelta)
    setPhase('result')
  }, [applyCasinoResult])

  const runDealerTurn = useCallback((currentDeck: Card[], pHand: Card[], dHand: Card[], currentBet: number) => {
    if (dealerTurnRef.current) return
    dealerTurnRef.current = true
    setPhase('dealer_turn')

    const { drawnCards, finalHand } = dealerPlay(dHand, currentDeck)

    if (drawnCards.length === 0) {
      // Dealer stands immediately
      setDealerHand(finalHand)
      setTimeout(() => {
        finishRound(pHand, finalHand, currentBet)
        dealerTurnRef.current = false
      }, 500)
      return
    }

    // Draw cards one at a time with delays
    let currentHand = [...dHand]
    let cardIndex = 0

    const drawNext = () => {
      if (cardIndex < drawnCards.length) {
        currentHand = [...currentHand, drawnCards[cardIndex]]
        setDealerHand([...currentHand])
        cardIndex++
        setTimeout(drawNext, 500)
      } else {
        setTimeout(() => {
          finishRound(pHand, currentHand, currentBet)
          dealerTurnRef.current = false
        }, 500)
      }
    }

    setTimeout(drawNext, 500)
  }, [finishRound])

  const handleBet = (amount: number) => {
    const newDeck = createShuffledDeck()
    const { playerHand: pHand, dealerHand: dHand, remainingDeck } = dealInitialHands(newDeck)

    setBet(amount)
    setDeck(remainingDeck)
    setPlayerHand(pHand)
    setDealerHand(dHand)
    setResult(null)
    setIsDoubled(false)
    dealerTurnRef.current = false

    // Check for immediate blackjack
    if (isBlackjack(pHand) || isBlackjack(dHand)) {
      setPhase('dealer_turn')
      setTimeout(() => {
        finishRound(pHand, dHand, amount)
      }, 800)
    } else {
      setPhase('playing')
    }
  }

  const handleHit = () => {
    const { newHand, remainingDeck } = hit(playerHand, deck)
    setPlayerHand(newHand)
    setDeck(remainingDeck)

    if (isBust(newHand)) {
      // Player busts — no dealer turn needed
      setTimeout(() => {
        finishRound(newHand, dealerHand, bet)
      }, 300)
    }
  }

  const handleStand = () => {
    runDealerTurn(deck, playerHand, dealerHand, bet)
  }

  const handleDoubleDown = () => {
    const doubleBet = bet * 2
    setBet(doubleBet)
    setIsDoubled(true)

    // Take exactly one more card, then stand
    const { newHand, remainingDeck } = hit(playerHand, deck)
    setPlayerHand(newHand)
    setDeck(remainingDeck)

    if (isBust(newHand)) {
      setTimeout(() => {
        finishRound(newHand, dealerHand, doubleBet)
      }, 300)
    } else {
      setTimeout(() => {
        runDealerTurn(remainingDeck, newHand, dealerHand, doubleBet)
      }, 300)
    }
  }

  const handlePlayAgain = () => {
    setPhase('betting')
    setPlayerHand([])
    setDealerHand([])
    setDeck([])
    setBet(0)
    setResult(null)
    setIsDoubled(false)
    dealerTurnRef.current = false
  }

  const betOptions = [
    { label: '$10K', value: 10000 },
    { label: '$50K', value: 50000 },
    { label: '$100K', value: 100000 },
    { label: '$500K', value: 500000 },
    { label: '$1M', value: 1000000 },
    { label: 'ALL IN', value: Math.floor(cash) },
  ]

  const playerValue = playerHand.length > 0 ? getHandValue(playerHand) : 0
  const dealerValue = dealerHand.length > 0 ? getHandValue(dealerHand) : 0
  const showDealerCards = phase === 'dealer_turn' || phase === 'result'
  const canDoubleDown = phase === 'playing' && playerHand.length === 2 && !isDoubled && cash >= bet * 2

  // Betting phase
  if (phase === 'betting') {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[340px]">
          <div className={`p-4 mb-4 rounded-lg ${isRetro2 ? 'bg-gradient-to-r from-[#0a150d] to-[#0d1a10]' : 'bg-gradient-to-r from-[#1a1500] to-[#2a2000]'}`}>
            <div className="flex items-center gap-3">
              <span className="text-4xl">🃏</span>
              <div>
                <div className={`${isRetro2 ? 'text-mh-accent-blue' : 'text-yellow-500'} text-lg font-bold`}>BLACKJACK</div>
                <div className="text-mh-text-dim text-xs">Place your bet to deal</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {betOptions.map((option) => {
              const canAfford = option.value > 0 && option.value <= cash
              const displayValue = option.label === 'ALL IN'
                ? `ALL IN ($${Math.floor(cash).toLocaleString('en-US')})`
                : option.label
              return (
                <button
                  key={option.label}
                  onClick={() => canAfford && handleBet(option.value)}
                  disabled={!canAfford}
                  className={`
                    w-full py-3 rounded font-bold text-base transition-all
                    ${canAfford
                      ? isRetro2
                        ? 'bg-mh-accent-blue/20 border border-mh-accent-blue text-mh-accent-blue hover:bg-mh-accent-blue/30 cursor-pointer'
                        : 'bg-yellow-500/20 border border-yellow-500 text-yellow-500 hover:bg-yellow-500/30 cursor-pointer'
                      : 'bg-mh-border/50 border border-mh-border text-mh-text-dim cursor-not-allowed opacity-50'
                    }
                  `}
                >
                  {displayValue}
                </button>
              )
            })}
          </div>

          <div className="mt-2 text-center">
            <div className="text-mh-text-dim text-xs">Available: ${Math.floor(cash).toLocaleString('en-US')}</div>
          </div>

          <div className="mt-4">
            <button
              onClick={onBack}
              className="w-full py-3 border border-mh-border bg-transparent text-mh-text-dim font-bold cursor-pointer hover:bg-mh-border/20 transition-all rounded"
            >
              BACK TO LOBBY
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Game in progress (playing, dealer_turn, result)
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
      {/* Bet display */}
      <div className="text-mh-text-dim text-xs">
        Bet: ${bet.toLocaleString('en-US')}{isDoubled ? ' (doubled)' : ''}
      </div>

      {/* Dealer hand */}
      <Hand
        cards={dealerHand}
        hideSecond={!showDealerCards}
        label="Dealer"
        value={showDealerCards ? dealerValue : undefined}
      />

      {/* VS divider */}
      <div className={`text-xs font-bold ${isRetro2 ? 'text-mh-accent-blue' : 'text-yellow-500'}`}>VS</div>

      {/* Player hand */}
      <Hand
        cards={playerHand}
        label="You"
        value={playerValue}
      />

      {/* Action buttons */}
      {phase === 'playing' && (
        <div className="flex gap-2 w-full max-w-[340px]">
          <button
            onClick={handleHit}
            className={`flex-1 py-3 rounded font-bold text-sm cursor-pointer transition-all ${
              isRetro2
                ? 'bg-mh-accent-blue/20 border border-mh-accent-blue text-mh-accent-blue hover:bg-mh-accent-blue/30'
                : 'bg-yellow-500/20 border border-yellow-500 text-yellow-500 hover:bg-yellow-500/30'
            }`}
          >
            HIT
          </button>
          <button
            onClick={handleStand}
            className="flex-1 py-3 rounded font-bold text-sm cursor-pointer transition-all border border-mh-border text-mh-text-dim hover:bg-mh-border/20"
          >
            STAND
          </button>
          {canDoubleDown && (
            <button
              onClick={handleDoubleDown}
              className="flex-1 py-3 rounded font-bold text-sm cursor-pointer transition-all bg-red-600/20 border border-red-500 text-red-400 hover:bg-red-600/30"
            >
              DOUBLE
            </button>
          )}
        </div>
      )}

      {/* Dealer turn indicator */}
      {phase === 'dealer_turn' && !result && (
        <div className={`text-sm font-bold animate-pulse ${isRetro2 ? 'text-mh-accent-blue' : 'text-yellow-500'}`}>
          Dealer is drawing...
        </div>
      )}

      {/* Result */}
      {phase === 'result' && result && (
        <div className="w-full max-w-[340px] text-center">
          <div className={`text-2xl font-bold mb-1 ${
            result.cashDelta > 0 ? 'text-mh-profit-green' :
            result.cashDelta < 0 ? 'text-mh-loss-red' :
            'text-mh-accent-blue'
          }`}>
            {result.cashDelta > 0 ? 'YOU WIN!' : result.cashDelta < 0 ? 'YOU LOSE' : 'PUSH'}
          </div>
          <div className="text-mh-text-dim text-sm mb-4">{result.headline}</div>

          <div className="space-y-2">
            <button
              onClick={handlePlayAgain}
              disabled={cash < 10000}
              className={`w-full py-3 rounded font-bold text-base transition-all ${
                cash >= 10000
                  ? isRetro2
                    ? 'bg-mh-accent-blue/20 border border-mh-accent-blue text-mh-accent-blue hover:bg-mh-accent-blue/30 cursor-pointer'
                    : 'bg-yellow-500/20 border border-yellow-500 text-yellow-500 hover:bg-yellow-500/30 cursor-pointer'
                  : 'bg-mh-border/50 border border-mh-border text-mh-text-dim cursor-not-allowed opacity-50'
              }`}
            >
              DEAL AGAIN
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 border border-mh-border bg-transparent text-mh-text-dim font-bold cursor-pointer hover:bg-mh-border/20 transition-all rounded"
            >
              BACK TO LOBBY
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
