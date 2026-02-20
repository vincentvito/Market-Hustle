'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useGame } from '@/hooks/useGame'
import { capture } from '@/lib/posthog'
import { resolveRoulette } from '@/lib/game/encounters'
import type { EncounterResult } from '@/lib/game/encounters'
import type { RouletteColor } from '@/lib/game/types'

// Red numbers on a European roulette wheel
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

function getNumberColor(n: number): 'red' | 'black' | 'green' {
  if (n === 0) return 'green'
  return RED_NUMBERS.includes(n) ? 'red' : 'black'
}

// Spinning animation — numbers cycle fast then slow to result
function RouletteSpinner({
  betAmount,
  selectedColor,
  onSpinComplete,
  isRetro2,
}: {
  betAmount: number
  selectedColor: RouletteColor
  onSpinComplete: (result: EncounterResult) => void
  isRetro2: boolean
}) {
  const [displayNumber, setDisplayNumber] = useState(0)
  const [phase, setPhase] = useState<'fast' | 'slowing' | 'done'>('fast')
  const resultRef = useRef<EncounterResult | null>(null)

  useEffect(() => {
    const result = resolveRoulette('play', selectedColor, betAmount)
    resultRef.current = result
    const targetNumber = result.spinResult ?? 0

    let intervalId: NodeJS.Timeout
    let timeoutId: NodeJS.Timeout
    const currentSpeed = 50

    const tick = () => {
      setDisplayNumber(Math.floor(Math.random() * 37))
    }

    intervalId = setInterval(tick, currentSpeed)

    timeoutId = setTimeout(() => {
      setPhase('slowing')
      clearInterval(intervalId)

      let slowTicks = 0
      const maxSlowTicks = 12
      const speeds = [80, 100, 130, 170, 220, 280, 350, 430, 520, 620, 730, 850]

      const slowTick = () => {
        if (slowTicks < maxSlowTicks - 1) {
          setDisplayNumber(Math.floor(Math.random() * 37))
          slowTicks++
          setTimeout(slowTick, speeds[slowTicks] || 500)
        } else {
          setDisplayNumber(targetNumber)
          setPhase('done')
          setTimeout(() => {
            if (resultRef.current) {
              onSpinComplete(resultRef.current)
            }
          }, 800)
        }
      }

      slowTick()
    }, 1000)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [betAmount, selectedColor, onSpinComplete])

  const color = getNumberColor(displayNumber)
  const bgColorClass =
    color === 'red' ? 'bg-red-600' :
    color === 'green' ? 'bg-green-600' :
    'bg-gray-800'

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="text-mh-text-dim text-sm mb-6">
          ${betAmount.toLocaleString('en-US')} on {selectedColor.toUpperCase()}
        </div>
        <div
          className={`
            w-32 h-32 rounded-full flex items-center justify-center
            border-4 ${isRetro2 ? 'border-mh-accent-blue shadow-lg shadow-green-500/30' : 'border-yellow-500 shadow-lg shadow-yellow-500/30'}
            ${bgColorClass}
            transition-colors duration-75
          `}
        >
          <span className={`text-6xl font-bold font-mono tabular-nums text-white ${phase === 'done' ? 'animate-pulse' : ''}`}>
            {displayNumber}
          </span>
        </div>
        <div className={`mt-6 ${isRetro2 ? 'text-mh-accent-blue' : 'text-yellow-500'} text-lg font-bold`}>
          {phase === 'done' ? 'LANDED!' : 'SPINNING...'}
        </div>
      </div>
    </div>
  )
}

interface CasinoRouletteProps {
  onBack: () => void
}

export function CasinoRoulette({ onBack }: CasinoRouletteProps) {
  const { cash, applyCasinoResult, selectedTheme } = useGame()
  const isRetro2 = selectedTheme === 'retro2'

  const [step, setStep] = useState<'bet' | 'color' | 'spinning' | 'result'>('bet')
  const [bet, setBet] = useState(0)
  const [color, setColor] = useState<RouletteColor | null>(null)
  const [result, setResult] = useState<EncounterResult | null>(null)

  const handleBet = (amount: number) => {
    setBet(amount)
    setStep('color')
  }

  const handleColor = (c: RouletteColor) => {
    setColor(c)
    setStep('spinning')
  }

  const handleSpinComplete = useCallback((r: EncounterResult) => {
    setResult(r)
    applyCasinoResult(r.cashChange ?? 0)
    capture('casino_game_played', { game: 'roulette', bet, cash_delta: r.cashChange ?? 0 })
    setStep('result')
  }, [applyCasinoResult, bet])

  const handlePlayAgain = () => {
    setStep('bet')
    setBet(0)
    setColor(null)
    setResult(null)
  }

  const betOptions = [
    { label: '$10K', value: 10000 },
    { label: '$50K', value: 50000 },
    { label: '$100K', value: 100000 },
    { label: '$500K', value: 500000 },
    { label: '$1M', value: 1000000 },
    { label: 'ALL IN', value: Math.floor(cash) },
  ]

  // Spinning phase
  if (step === 'spinning' && color) {
    return (
      <RouletteSpinner
        betAmount={bet}
        selectedColor={color}
        onSpinComplete={handleSpinComplete}
        isRetro2={isRetro2}
      />
    )
  }

  // Result phase
  if (step === 'result' && result) {
    const won = (result.cashChange ?? 0) >= 0
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[340px] text-center">
          {/* Result number */}
          {result.spinResult !== undefined && (
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 ${
                isRetro2 ? 'border-mh-accent-blue' : 'border-yellow-500'
              } ${
                getNumberColor(result.spinResult) === 'red' ? 'bg-red-600' :
                getNumberColor(result.spinResult) === 'green' ? 'bg-green-600' :
                'bg-gray-800'
              }`}
            >
              <span className="text-4xl font-bold font-mono text-white">{result.spinResult}</span>
            </div>
          )}

          <div className={`text-2xl font-bold mb-2 ${won ? 'text-mh-profit-green' : 'text-mh-loss-red'}`}>
            {won ? 'YOU WIN!' : 'YOU LOSE'}
          </div>
          <div className="text-mh-text-dim text-sm mb-6">{result.headline}</div>

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
              SPIN AGAIN
            </button>
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

  // Color selection phase
  if (step === 'color') {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[340px]">
          <div className={`p-4 mb-4 rounded-lg ${isRetro2 ? 'bg-gradient-to-r from-[#0a150d] to-[#0d1a10]' : 'bg-gradient-to-r from-[#1a1500] to-[#2a2000]'}`}>
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎰</span>
              <div>
                <div className={`${isRetro2 ? 'text-mh-accent-blue' : 'text-yellow-500'} text-lg font-bold`}>PICK YOUR COLOR</div>
                <div className="text-mh-text-dim text-xs">Betting ${bet.toLocaleString('en-US')}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleColor('red')}
              className="w-full py-4 rounded-lg font-bold text-lg bg-red-600 hover:bg-red-500 text-white cursor-pointer transition-all border-2 border-red-400"
            >
              🔴 RED
              <div className="text-xs font-normal opacity-80">48.6% — 2x payout</div>
            </button>
            <button
              onClick={() => handleColor('black')}
              className="w-full py-4 rounded-lg font-bold text-lg bg-gray-800 hover:bg-gray-700 text-white cursor-pointer transition-all border-2 border-gray-600"
            >
              ⚫ BLACK
              <div className="text-xs font-normal opacity-80">48.6% — 2x payout</div>
            </button>
            <button
              onClick={() => handleColor('zero')}
              className="w-full py-4 rounded-lg font-bold text-lg bg-green-700 hover:bg-green-600 text-white cursor-pointer transition-all border-2 border-green-500"
            >
              🟢 ZERO
              <div className="text-xs font-normal opacity-80">2.7% — 35x payout</div>
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setStep('bet')}
              className="w-full py-3 border border-mh-border bg-transparent text-mh-text-dim font-bold cursor-pointer hover:bg-mh-border/20 transition-all rounded"
            >
              CHANGE BET
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Bet selection phase (default)
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-[340px]">
        <div className={`p-4 mb-4 rounded-lg ${isRetro2 ? 'bg-gradient-to-r from-[#0a150d] to-[#0d1a10]' : 'bg-gradient-to-r from-[#1a1500] to-[#2a2000]'}`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎰</span>
            <div>
              <div className={`${isRetro2 ? 'text-mh-accent-blue' : 'text-yellow-500'} text-lg font-bold`}>PLACE YOUR BET</div>
              <div className="text-mh-text-dim text-xs">How much are you risking?</div>
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
