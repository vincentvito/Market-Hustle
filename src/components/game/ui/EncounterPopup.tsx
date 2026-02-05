'use client'

import { useState, useEffect, useRef } from 'react'
import { useGame } from '@/hooks/useGame'
import { ENCOUNTERS, getDivorceDescription, resolveSEC, resolveDivorce, resolveShitcoin, resolveKidney, resolveRoulette, resolveTax } from '@/lib/game/encounters'
import type { EncounterResult } from '@/lib/game/encounters'
import type { RouletteColor, EncounterType } from '@/lib/game/types'

// Result screen shown after player makes a choice
function ResultScreen({
  result,
  encounterType,
  isWin,
  onConfirm,
  isRetro2,
}: {
  result: EncounterResult
  encounterType: EncounterType
  isWin: boolean
  onConfirm: () => void
  isRetro2: boolean
}) {
  // Determine visual style based on outcome
  const isGameOver = result.gameOver
  const isNeutral = !result.cashChange || result.cashChange === 0

  // RETRO 2: Use green borders for terminal aesthetic, keep text colors for clarity
  let borderColor = isRetro2 ? 'border-mh-accent-blue' : 'border-mh-profit-green'
  let bgGradient = isRetro2 ? 'from-[#0a150d] to-[#0d1a10]' : 'from-[#0a200a] to-[#0d2a0d]'
  let titleColor = 'text-mh-profit-green'
  let emoji = '💰'
  let title = 'SUCCESS'

  if (isGameOver) {
    borderColor = isRetro2 ? 'border-mh-accent-blue' : 'border-mh-loss-red'
    bgGradient = isRetro2 ? 'from-[#0a150d] to-[#0d1a10]' : 'from-[#200a0a] to-[#2a0d0d]'
    titleColor = 'text-mh-loss-red'
    emoji = result.gameOverReason === 'DECEASED' ? '💀' : '⛓️'
    title = result.gameOverReason === 'DECEASED' ? 'DECEASED' : 'IMPRISONED'
  } else if (!isWin) {
    borderColor = isRetro2 ? 'border-mh-accent-blue' : 'border-mh-loss-red'
    bgGradient = isRetro2 ? 'from-[#0a150d] to-[#0d1a10]' : 'from-[#200a0a] to-[#2a0d0d]'
    titleColor = 'text-mh-loss-red'
    emoji = '📉'
    title = 'OUCH'
  } else if (isNeutral) {
    borderColor = 'border-mh-accent-blue'
    bgGradient = isRetro2 ? 'from-[#0a150d] to-[#0d1a10]' : 'from-[#0a1520] to-[#0d1a28]'
    titleColor = 'text-mh-accent-blue'
    emoji = '✨'
    title = 'LUCKY'
  }

  // Roulette-specific display
  if (encounterType === 'roulette' && result.spinResult !== undefined) {
    const colorEmoji = result.spinColor === 'red' ? '🔴' : result.spinColor === 'black' ? '⚫' : '🟢'
    emoji = colorEmoji
    title = isWin ? 'WINNER!' : 'HOUSE WINS'
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-5 select-none">
      <div
        className={`bg-mh-bg border-2 ${borderColor} rounded-lg w-full max-w-[340px] overflow-hidden`}
        style={isRetro2 ? { boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' } : undefined}
      >
        {/* Header */}
        <div className={`p-4 bg-gradient-to-r ${bgGradient} border-b ${borderColor}/30`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{emoji}</span>
            <div>
              <div className={`${titleColor} text-lg font-bold`}>
                {title}
              </div>
            </div>
          </div>
        </div>

        {/* Result Content */}
        <div className="p-6 text-center">
          {/* Roulette spin result */}
          {encounterType === 'roulette' && result.spinResult !== undefined && (
            <div className="mb-4">
              <div className="text-mh-text-dim text-xs mb-2">THE BALL LANDED ON</div>
              <div className={`text-5xl font-bold ${
                result.spinColor === 'red' ? 'text-red-500' :
                result.spinColor === 'black' ? 'text-white' :
                'text-green-500'
              }`}>
                {result.spinResult}
              </div>
              <div className="text-mh-text-dim text-sm mt-1">
                {result.spinColor?.toUpperCase()}
              </div>
            </div>
          )}

          {/* Cash Change */}
          {!isGameOver && result.cashChange !== undefined && result.cashChange !== 0 && (
            <div className={`text-3xl font-bold mb-3 ${
              result.cashChange > 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'
            }`}>
              {result.cashChange > 0 ? '+' : ''}{result.cashChange < 0 ? '-' : ''}${Math.abs(result.cashChange).toLocaleString('en-US')}
            </div>
          )}

          {/* Headline */}
          <div className="text-mh-text-main text-sm leading-relaxed">
            {result.headline}
          </div>

          {/* Game Over Warning */}
          {isGameOver && (
            <div className="mt-4 text-mh-loss-red text-xs">
              Your career has ended.
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="p-4 border-t border-mh-border">
          <button
            onClick={onConfirm}
            className={`w-full py-3 font-bold cursor-pointer transition-all rounded
              ${isGameOver
                ? 'bg-mh-loss-red/20 border border-mh-loss-red text-mh-loss-red hover:bg-mh-loss-red/30'
                : isWin
                  ? 'bg-mh-profit-green/20 border border-mh-profit-green text-mh-profit-green hover:bg-mh-profit-green/30'
                  : 'bg-mh-loss-red/20 border border-mh-loss-red text-mh-loss-red hover:bg-mh-loss-red/30'
              }
            `}
          >
            {isGameOver ? 'ACCEPT FATE' : 'CONTINUE'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Red numbers on a European roulette wheel
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

// Get the color for a roulette number
function getNumberColor(n: number): 'red' | 'black' | 'green' {
  if (n === 0) return 'green'
  return RED_NUMBERS.includes(n) ? 'red' : 'black'
}

// Roulette spinning animation screen - numbers cycle rapidly then slow down
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
    // Pre-compute the result so we know where to land
    const result = resolveRoulette('play', selectedColor, betAmount)
    resultRef.current = result
    const targetNumber = result.spinResult ?? 0

    let intervalId: NodeJS.Timeout
    let timeoutId: NodeJS.Timeout
    let currentSpeed = 50 // Start fast (50ms per number)
    let tickCount = 0

    const tick = () => {
      // Generate random number during spin
      if (phase === 'fast' || tickCount < 30) {
        setDisplayNumber(Math.floor(Math.random() * 37))
      }
      tickCount++
    }

    // Fast phase: ~1 second of rapid cycling
    intervalId = setInterval(tick, currentSpeed)

    // After 1 second, start slowing down
    timeoutId = setTimeout(() => {
      setPhase('slowing')
      clearInterval(intervalId)

      // Slowing phase: progressively slower intervals
      let slowTicks = 0
      const maxSlowTicks = 12
      const speeds = [80, 100, 130, 170, 220, 280, 350, 430, 520, 620, 730, 850]

      const slowTick = () => {
        if (slowTicks < maxSlowTicks - 1) {
          // Show random numbers while slowing
          setDisplayNumber(Math.floor(Math.random() * 37))
          slowTicks++
          setTimeout(slowTick, speeds[slowTicks] || 500)
        } else {
          // Final tick: land on the actual result
          setDisplayNumber(targetNumber)
          setPhase('done')

          // Brief pause then show result
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
    <div className="fixed inset-0 bg-black/95 z-[400] flex items-center justify-center p-5 select-none">
      <div className="flex flex-col items-center">
        {/* Bet info */}
        <div className="text-mh-text-dim text-sm mb-6">
          ${betAmount.toLocaleString('en-US')} on {selectedColor.toUpperCase()}
        </div>

        {/* The spinning number display */}
        <div
          className={`
            w-32 h-32 rounded-full flex items-center justify-center
            border-4 ${isRetro2 ? 'border-mh-accent-blue shadow-lg shadow-green-500/30' : 'border-yellow-500 shadow-lg shadow-yellow-500/30'}
            ${bgColorClass}
            transition-colors duration-75
          `}
        >
          <span
            className={`
              text-6xl font-bold font-mono tabular-nums
              text-white
              ${phase === 'done' ? 'animate-pulse' : ''}
            `}
          >
            {displayNumber}
          </span>
        </div>

        {/* Status text */}
        <div className={`mt-6 ${isRetro2 ? 'text-mh-accent-blue' : 'text-yellow-500'} text-lg font-bold`}>
          {phase === 'done' ? 'LANDED!' : 'SPINNING...'}
        </div>
      </div>
    </div>
  )
}

export function EncounterPopup() {
  const { pendingEncounter, cash, encounterState, confirmEncounterResult, getNetWorth, selectedTheme, trustFundBalance } = useGame()
  const isRetro2 = selectedTheme === 'retro2'
  const [rouletteStep, setRouletteStep] = useState<'choose' | 'bet' | 'color' | 'spinning'>('choose')
  const [rouletteBet, setRouletteBet] = useState<number>(0)
  const [rouletteColor, setRouletteColor] = useState<RouletteColor | null>(null)
  const [encounterResult, setEncounterResult] = useState<EncounterResult | null>(null)

  // Reset state when encounter changes
  useEffect(() => {
    if (!pendingEncounter) {
      setRouletteStep('choose')
      setRouletteBet(0)
      setRouletteColor(null)
      setEncounterResult(null)
    }
  }, [pendingEncounter])

  if (!pendingEncounter) return null

  const encounter = ENCOUNTERS[pendingEncounter.type]
  const netWorth = getNetWorth()

  // Get description - special case for divorce on second occurrence
  const description = pendingEncounter.type === 'divorce'
    ? getDivorceDescription(encounterState.divorceCount)
    : encounter.description

  // Handle player choice - compute result and show result screen
  const handleChoice = (choiceIndex: 0 | 1) => {
    if (pendingEncounter.type === 'roulette' && choiceIndex === 0) {
      // Start roulette flow
      setRouletteStep('bet')
      return
    }

    // Compute result based on encounter type
    let result: EncounterResult

    switch (pendingEncounter.type) {
      case 'sec':
        result = choiceIndex === 0 ? resolveSEC('pay', netWorth, trustFundBalance) : resolveSEC('fight', netWorth, trustFundBalance)
        break
      case 'divorce':
        result = choiceIndex === 0 ? resolveDivorce('settle', netWorth, trustFundBalance) : resolveDivorce('contest', netWorth, trustFundBalance)
        break
      case 'shitcoin':
        result = choiceIndex === 0 ? resolveShitcoin('mint', cash) : resolveShitcoin('pass', cash)
        break
      case 'kidney':
        result = choiceIndex === 0 ? resolveKidney('sell') : resolveKidney('keep')
        break
      case 'roulette':
        // Decline roulette
        result = resolveRoulette('decline', null, 0)
        break
      case 'tax':
        result = choiceIndex === 0 ? resolveTax('pay', netWorth, trustFundBalance) : resolveTax('offshore', netWorth, trustFundBalance)
        break
      default:
        result = { headline: 'Encounter resolved' }
    }

    setEncounterResult(result)
  }

  const handleRouletteBet = (amount: number) => {
    setRouletteBet(amount)
    setRouletteStep('color')
  }

  const handleRouletteColor = (color: RouletteColor) => {
    setRouletteColor(color)
    setRouletteStep('spinning')
  }

  const handleRouletteDecline = () => {
    const result = resolveRoulette('decline', null, 0)
    setEncounterResult(result)
  }

  const handleSpinComplete = (result: EncounterResult) => {
    setEncounterResult(result)
  }

  // Handle confirm - commit result to game state
  const handleConfirm = () => {
    if (encounterResult) {
      confirmEncounterResult(encounterResult, pendingEncounter.type)
      setEncounterResult(null)
      setRouletteStep('choose')
      setRouletteBet(0)
      setRouletteColor(null)
    }
  }

  // Determine if result is a win (liquidationRequired means forced asset loss, so it's a loss)
  // Note: liquidationRequired means money was lost (SEC fine, divorce settlement, etc.)
  const isWin = encounterResult ? (encounterResult.cashChange ?? 0) >= 0 && !encounterResult.gameOver && !encounterResult.liquidationRequired && !encounterResult.liquidationRequired : false

  // Show result screen if we have a result
  if (encounterResult) {
    return (
      <ResultScreen
        result={encounterResult}
        encounterType={pendingEncounter.type}
        isWin={isWin}
        onConfirm={handleConfirm}
        isRetro2={isRetro2}
      />
    )
  }

  // Show spinning animation for roulette
  if (pendingEncounter.type === 'roulette' && rouletteStep === 'spinning' && rouletteColor) {
    return (
      <RouletteSpinner
        betAmount={rouletteBet}
        selectedColor={rouletteColor}
        onSpinComplete={handleSpinComplete}
        isRetro2={isRetro2}
      />
    )
  }

  // Roulette bet selection screen
  if (pendingEncounter.type === 'roulette' && rouletteStep === 'bet') {
    const betOptions = [
      { label: '$10K', value: 10000 },
      { label: '$50K', value: 50000 },
      { label: '$100K', value: 100000 },
      { label: 'ALL IN', value: cash },
    ]

    return (
      <div className="fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-5 select-none">
        <div
          className={`bg-mh-bg border-2 ${isRetro2 ? 'border-mh-accent-blue' : 'border-yellow-500'} rounded-lg w-full max-w-[340px] overflow-hidden`}
          style={isRetro2 ? { boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' } : undefined}
        >
          {/* Header */}
          <div className={`p-4 ${isRetro2 ? 'bg-gradient-to-r from-[#0a150d] to-[#0d1a10] border-b border-mh-accent-blue/30' : 'bg-gradient-to-r from-[#1a1500] to-[#2a2000] border-b border-yellow-500/30'}`}>
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎰</span>
              <div>
                <div className={`${isRetro2 ? 'text-mh-accent-blue' : 'text-yellow-500'} text-lg font-bold`}>PLACE YOUR BET</div>
                <div className="text-mh-text-dim text-xs">How much are you risking?</div>
              </div>
            </div>
          </div>

          {/* Bet Options */}
          <div className="p-4 space-y-2">
            {betOptions.map((option) => {
              const canAfford = option.value <= cash
              const displayValue = option.label === 'ALL IN'
                ? `ALL IN ($${cash.toLocaleString('en-US')})`
                : option.label
              return (
                <button
                  key={option.label}
                  onClick={() => canAfford && handleRouletteBet(option.value)}
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

          {/* Cash Display */}
          <div className="px-4 pb-2 text-center">
            <div className="text-mh-text-dim text-xs">
              Available: ${cash.toLocaleString('en-US')}
            </div>
          </div>

          {/* Back Button */}
          <div className="p-4 border-t border-mh-border">
            <button
              onClick={handleRouletteDecline}
              className="w-full py-3 border border-mh-border bg-transparent text-mh-text-dim font-bold cursor-pointer hover:bg-mh-border/20 transition-all"
            >
              LEAVE THE TABLE
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Roulette color selection screen
  if (pendingEncounter.type === 'roulette' && rouletteStep === 'color') {
    return (
      <div className="fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-5 select-none">
        <div
          className={`bg-mh-bg border-2 ${isRetro2 ? 'border-mh-accent-blue' : 'border-yellow-500'} rounded-lg w-full max-w-[340px] overflow-hidden`}
          style={isRetro2 ? { boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' } : undefined}
        >
          {/* Header */}
          <div className={`p-4 ${isRetro2 ? 'bg-gradient-to-r from-[#0a150d] to-[#0d1a10] border-b border-mh-accent-blue/30' : 'bg-gradient-to-r from-[#1a1500] to-[#2a2000] border-b border-yellow-500/30'}`}>
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎰</span>
              <div>
                <div className={`${isRetro2 ? 'text-mh-accent-blue' : 'text-yellow-500'} text-lg font-bold`}>PICK YOUR COLOR</div>
                <div className="text-mh-text-dim text-xs">Betting ${rouletteBet.toLocaleString('en-US')}</div>
              </div>
            </div>
          </div>

          {/* Color Options */}
          <div className="p-4 space-y-3">
            <button
              onClick={() => handleRouletteColor('red')}
              className="w-full py-4 rounded-lg font-bold text-lg bg-red-600 hover:bg-red-500 text-white cursor-pointer transition-all border-2 border-red-400"
            >
              🔴 RED
              <div className="text-xs font-normal opacity-80">48.6% - 2x payout</div>
            </button>
            <button
              onClick={() => handleRouletteColor('black')}
              className="w-full py-4 rounded-lg font-bold text-lg bg-gray-800 hover:bg-gray-700 text-white cursor-pointer transition-all border-2 border-gray-600"
            >
              ⚫ BLACK
              <div className="text-xs font-normal opacity-80">48.6% - 2x payout</div>
            </button>
            <button
              onClick={() => handleRouletteColor('zero')}
              className="w-full py-4 rounded-lg font-bold text-lg bg-green-700 hover:bg-green-600 text-white cursor-pointer transition-all border-2 border-green-500"
            >
              🟢 ZERO
              <div className="text-xs font-normal opacity-80">2.7% - 35x payout</div>
            </button>
          </div>

          {/* Back Button */}
          <div className="p-4 border-t border-mh-border">
            <button
              onClick={() => setRouletteStep('bet')}
              className="w-full py-3 border border-mh-border bg-transparent text-mh-text-dim font-bold cursor-pointer hover:bg-mh-border/20 transition-all"
            >
              CHANGE BET
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main encounter popup
  return (
    <div className="fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-5 select-none">
      <div
        className={`bg-mh-bg border-2 ${isRetro2 ? 'border-mh-accent-blue' : 'border-mh-loss-red'} rounded-lg w-full max-w-[340px] overflow-hidden`}
        style={isRetro2 ? { boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' } : undefined}
      >
        {/* Header */}
        <div className={`p-4 ${isRetro2 ? 'bg-gradient-to-r from-[#0a150d] to-[#0d1a10] border-b border-mh-accent-blue/30' : 'bg-gradient-to-r from-[#200a0a] to-[#2a0d0d] border-b border-mh-loss-red/30'}`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{encounter.emoji}</span>
            <div>
              <div className={`${isRetro2 ? 'text-mh-accent-blue' : 'text-mh-loss-red'} text-[10px] font-bold tracking-wider uppercase`}>
                RANDOM ENCOUNTER
              </div>
              <div className="text-mh-text-bright text-lg font-bold">
                {encounter.title}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 border-b border-mh-border bg-[#0a0d10]">
          <p className="text-mh-text-main text-sm leading-relaxed">
            {description}
          </p>
          {encounter.flavor && (
            <p className="text-mh-text-dim text-xs italic mt-3">
              {encounter.flavor}
            </p>
          )}
        </div>

        {/* Stakes Info */}
        {(pendingEncounter.type === 'sec' || pendingEncounter.type === 'divorce' || pendingEncounter.type === 'tax') && (
          <div className="px-4 py-2 bg-[#0d0808] border-b border-mh-border">
            <div className="text-mh-text-dim text-xs text-center">
              Your net worth: <span className="text-mh-text-bright">${netWorth.toLocaleString('en-US')}</span>
              {trustFundBalance > 0 && (
                <>
                  <br />
                  Exposed: <span className="text-mh-accent-blue">${Math.max(0, netWorth - trustFundBalance).toLocaleString('en-US')}</span>
                  <span className="text-mh-text-dim"> (${trustFundBalance.toLocaleString('en-US')} sheltered)</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Choices */}
        <div className="p-4 space-y-3">
          {encounter.choices.map((choice, index) => {
            // Check if this choice requires cash
            const requiresCash = pendingEncounter.type === 'shitcoin' && index === 0
            const canAfford = !requiresCash || cash >= 5000
            const isPassOption = index === 1

            return (
              <button
                key={choice.label}
                onClick={() => canAfford && handleChoice(index as 0 | 1)}
                disabled={!canAfford}
                className={`
                  w-full py-3 px-4 rounded font-bold text-sm transition-all text-left
                  ${!canAfford
                    ? 'bg-mh-border/50 border border-mh-border text-mh-text-dim cursor-not-allowed opacity-50'
                    : isPassOption
                      ? 'bg-transparent border border-mh-border text-mh-text-main hover:bg-mh-border/20 cursor-pointer'
                      : isRetro2
                        ? 'bg-mh-accent-blue/20 border border-mh-accent-blue text-mh-accent-blue hover:bg-mh-accent-blue/30 cursor-pointer'
                        : 'bg-mh-loss-red/20 border border-mh-loss-red text-mh-loss-red hover:bg-mh-loss-red/30 cursor-pointer'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{choice.label}</span>
                  {!canAfford && <span className="text-xs">Need $5K</span>}
                </div>
                <div className="text-xs font-normal mt-1 opacity-80">
                  {choice.description}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
