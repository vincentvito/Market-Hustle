'use client'

import { REGISTERED_FREE_DAILY_LIMIT, PRO_TRIAL_GAME_LIMIT } from '@/lib/game/userState'
import type { EndGameProps } from './types'

/**
 * MemberEndView - End-game screen for registered free-tier users.
 *
 * Features:
 * - Unified layout for both wins and losses
 * - Conditional styling (green for win, red for loss)
 * - Daily games counter (resets at midnight)
 * - Pro trial status (when user has trial games remaining)
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
  proTrialGamesRemaining = 0,
}: EndGameProps) {
  const isWin = outcome === 'win'
  const hasProTrial = proTrialGamesRemaining > 0

  // Color scheme based on outcome
  const titleColor = isWin ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'
  const netWorthColor = netWorth >= 0 ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'
  const profitColor = netWorth >= 100000 ? 'text-mh-profit-green' : 'text-mh-loss-red'

  return (
    <div className="min-h-full bg-mh-bg flex flex-col items-center justify-center p-6 md:p-10 text-center">
      {/* Outcome Header */}
      <div className="text-6xl md:text-7xl mb-4">{message.emoji}</div>
      <div className={`text-4xl md:text-5xl font-bold mb-2 ${titleColor}`}>{message.title}</div>
      <div className="text-mh-text-dim text-sm md:text-base mb-6 max-w-[280px] md:max-w-[400px] leading-relaxed">
        {message.flavor}
      </div>

      {/* Days Survived */}
      <div className="text-mh-text-main text-lg md:text-xl mb-8">
        {isWin ? 'YOU SURVIVED' : 'SURVIVED'} {daysSurvived} / {gameDuration} DAYS
      </div>

      {/* Final Net Worth */}
      <div className="border border-mh-border p-5 md:p-8 mb-2 min-w-[200px] md:min-w-[320px]">
        <div className="text-mh-text-dim text-xs md:text-sm mb-2">FINAL NET WORTH</div>
        <div className={`text-3xl md:text-5xl ${netWorthColor}`}>${netWorth.toLocaleString()}</div>
      </div>

      {/* Profit/Loss percentage - more prominent on wins */}
      {isWin && (
        <div className={`text-lg md:text-xl mb-4 ${profitColor}`}>
          {profitPercent >= 0 ? '+' : ''}
          {profitPercent.toFixed(1)}% RETURN
        </div>
      )}

      {/* Pro Trial Banner - When user has trial games remaining */}
      {hasProTrial && (
        <div className="border-2 border-mh-accent-blue p-4 mb-6 min-w-[200px] bg-mh-accent-blue/10">
          <div className="text-mh-accent-blue text-xs font-bold mb-1">PRO TRIAL ACTIVE</div>
          <div className="text-mh-text-bright text-lg font-bold mb-2">
            {proTrialGamesRemaining}/{PRO_TRIAL_GAME_LIMIT} games left
          </div>
          <div className="text-mh-text-dim text-xs space-y-0.5">
            <div>Next game includes:</div>
            <div className="text-mh-accent-blue">• Short selling • 10X leverage • All modes</div>
          </div>
        </div>
      )}

      {/* Daily Games Remaining Counter - Only show if no trial remaining */}
      {!hasProTrial && (
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
      )}

      {/* Upsell Section - Different messaging based on trial status */}
      <div className="mb-6 max-w-[280px] md:max-w-[400px]">
        <div className="text-mh-text-bright text-sm md:text-base font-bold mb-3">
          {hasProTrial
            ? 'Love Pro features? Keep them forever:'
            : isWin
              ? 'Ready for the real challenge?'
              : 'That was easy mode.'}
        </div>
        {!hasProTrial && (
          <div className="text-mh-text-dim text-sm space-y-1 mb-4">
            <div>• Short selling</div>
            <div>• 10X leverage</div>
            <div>• 45 & 60-day challenges</div>
          </div>
        )}
      </div>

      {/* Pricing Buttons */}
      <div className="flex flex-col gap-2 w-full max-w-[280px] md:max-w-[400px] mb-6">
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
