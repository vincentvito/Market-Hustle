'use client'

import { REGISTERED_FREE_DAILY_LIMIT } from '@/lib/game/userState'
import type { EndGameProps } from './types'

/**
 * MemberEndView - End-game screen for registered free-tier users.
 *
 * Features:
 * - Unified layout for both wins and losses
 * - Conditional styling (green for win, red for loss)
 * - Daily games counter (resets at midnight)
 * - Pro upsell (less aggressive than Guest)
 * - Primary "Play Again" button when games available
 */
export function MemberEndView({
  outcome,
  message,
  netWorth,
  profitPercent,
  daysSurvived,
  gameDuration,
  gamesRemaining,
  canPlayAgain,
  onPlayAgain,
  onCheckout,
}: EndGameProps) {
  const isWin = outcome === 'win'

  // Color scheme based on outcome
  const titleColor = isWin ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'
  const netWorthColor = netWorth >= 0 ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'
  const profitColor = netWorth >= 100000 ? 'text-mh-profit-green' : 'text-mh-loss-red'

  return (
    <div className="min-h-full bg-mh-bg flex flex-col items-center justify-center p-6 text-center">
      {/* Outcome Header */}
      <div className="text-6xl mb-4">{message.emoji}</div>
      <div className={`text-4xl font-bold mb-2 ${titleColor}`}>{message.title}</div>
      <div className="text-mh-text-dim text-sm mb-6 max-w-[280px] leading-relaxed">
        {message.flavor}
      </div>

      {/* Days Survived */}
      <div className="text-mh-text-main text-lg mb-8">
        {isWin ? 'YOU SURVIVED' : 'SURVIVED'} {daysSurvived} / {gameDuration} DAYS
      </div>

      {/* Final Net Worth */}
      <div className="border border-mh-border p-5 mb-2 min-w-[200px]">
        <div className="text-mh-text-dim text-xs mb-2">FINAL NET WORTH</div>
        <div className={`text-3xl ${netWorthColor}`}>${netWorth.toLocaleString()}</div>
      </div>

      {/* Profit/Loss percentage - more prominent on wins */}
      {isWin && (
        <div className={`text-lg mb-4 ${profitColor}`}>
          {profitPercent >= 0 ? '+' : ''}
          {profitPercent.toFixed(1)}% RETURN
        </div>
      )}

      {/* Daily Games Remaining Counter */}
      <div className="border border-mh-border p-3 mb-6 min-w-[200px] bg-mh-border/10">
        <div className="flex justify-between items-center">
          <span className="text-mh-text-dim text-xs">DAILY GAMES</span>
          <span
            className={`font-bold ${gamesRemaining === 0 ? 'text-mh-loss-red' : 'text-mh-text-bright'}`}
          >
            {gamesRemaining}/{REGISTERED_FREE_DAILY_LIMIT}
          </span>
        </div>
        {gamesRemaining === 0 && (
          <div className="text-mh-loss-red text-xs mt-1">Resets at midnight</div>
        )}
      </div>

      {/* Upsell Section - Less aggressive than Guest */}
      <div className="mb-6 max-w-[280px]">
        <div className="text-mh-text-bright text-sm font-bold mb-3">
          {isWin ? 'Ready for the real challenge?' : 'That was easy mode.'}
        </div>
        <div className="text-mh-text-dim text-sm space-y-1 mb-4">
          <div>• Short selling</div>
          <div>• 10X leverage</div>
          <div>• 45 & 60-day challenges</div>
        </div>
      </div>

      {/* Pricing Buttons */}
      <div className="flex flex-col gap-2 w-full max-w-[280px] mb-6">
        <button
          onClick={() => onCheckout('yearly')}
          className="w-full py-3 border-2 border-mh-profit-green bg-mh-profit-green text-mh-bg text-sm font-bold font-mono cursor-pointer hover:bg-mh-profit-green/90 transition-colors"
        >
          GO PRO — $29.99/yr (50% off)
        </button>
        <button
          onClick={() => onCheckout('monthly')}
          className="w-full py-3 border-2 border-mh-profit-green bg-mh-profit-green/10 text-mh-profit-green text-sm font-bold font-mono cursor-pointer hover:bg-mh-profit-green/20 transition-colors"
        >
          $4.99/month
        </button>
      </div>

      {/* Play Again Button - Primary when available */}
      <button
        onClick={onPlayAgain}
        disabled={!canPlayAgain}
        className={`bg-transparent border-2 border-mh-accent-blue text-mh-accent-blue
          px-10 py-4 text-base font-mono transition-colors
          ${canPlayAgain ? 'cursor-pointer hover:bg-mh-accent-blue/10' : 'opacity-50 cursor-not-allowed'}`}
      >
        [ PLAY AGAIN ]
      </button>
    </div>
  )
}
