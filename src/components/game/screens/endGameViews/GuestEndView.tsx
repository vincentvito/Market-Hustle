'use client'

import { ANONYMOUS_GAME_LIMIT } from '@/lib/game/userState'
import type { EndGameProps } from './types'

/**
 * GuestEndView - End-game screen for anonymous/guest users.
 *
 * Features:
 * - Unified layout for both wins and losses
 * - Conditional styling (green for win, red for loss)
 * - Two-column CTA (Sign Up + Go Pro)
 * - Games remaining counter (lifetime limit)
 * - Secondary "Play Again" button styling
 * - Conversion-focused with tagline
 */
export function GuestEndView({
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
  onOpenAuth,
}: EndGameProps) {
  const isWin = outcome === 'win'

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

      {/* Games Remaining Counter */}
      <div className="border border-mh-border p-3 md:p-4 mb-6 min-w-[200px] md:min-w-[320px] bg-mh-border/10">
        <div
          className={`text-sm md:text-base font-bold ${gamesRemaining === 0 ? 'text-mh-loss-red' : 'text-mh-text-bright'}`}
        >
          {gamesRemaining}/{ANONYMOUS_GAME_LIMIT} free games remaining
        </div>
        {gamesRemaining === 0 && (
          <div className="text-mh-loss-red text-xs md:text-sm mt-1">Sign up to continue playing</div>
        )}
      </div>

      {/* Tagline */}
      <div className="text-mh-text-dim text-sm md:text-base italic mb-4 max-w-[300px] md:max-w-[450px]">
        The training wheels are off. Level up to Pro for the real hustle.
      </div>

      {/* Two-Column CTA Section */}
      <div className="flex gap-3 md:gap-5 w-full max-w-[340px] md:max-w-[520px] mb-6">
        {/* Sign Up Box */}
        <div className="flex-1 border border-mh-border p-4 md:p-6 bg-mh-border/5">
          <div className="text-mh-accent-blue text-xs md:text-sm font-bold mb-3 text-center">
            SAVE YOUR PROGRESS
          </div>
          <div className="text-mh-text-dim text-xs space-y-1.5 mb-4">
            <div className="flex items-start gap-1.5">
              <span className="text-mh-accent-blue">✓</span>
              <span>Keep your stats forever</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-mh-accent-blue">✓</span>
              <span>3 free games every day</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-mh-accent-blue">✓</span>
              <span>Compete on leaderboards</span>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="w-full py-2 border-2 border-mh-accent-blue bg-mh-accent-blue/10 text-mh-accent-blue text-xs font-bold font-mono cursor-pointer hover:bg-mh-accent-blue/20 transition-colors"
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Go Pro Box */}
        <div className="flex-1 border-2 border-mh-profit-green p-4 md:p-6 bg-mh-profit-green/5">
          <div className="text-mh-profit-green text-xs md:text-sm font-bold mb-3 text-center">GO UNLIMITED</div>
          <div className="text-mh-text-dim text-xs space-y-1.5 mb-4">
            <div className="flex items-start gap-1.5">
              <span className="text-mh-profit-green">✓</span>
              <span>Unlimited games</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-mh-profit-green">✓</span>
              <span>Short selling & margin</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-mh-profit-green">✓</span>
              <span>45 & 60-day challenges</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-mh-profit-green">✓</span>
              <span>Historical scenarios</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => onCheckout('yearly')}
              className="w-full py-2 border-2 border-mh-profit-green bg-mh-profit-green text-mh-bg text-xs font-bold font-mono cursor-pointer hover:bg-mh-profit-green/90 transition-colors"
            >
              $29.99/yr — 50% OFF
            </button>
            <button
              onClick={() => onCheckout('monthly')}
              className="w-full py-1.5 border border-mh-profit-green/50 bg-transparent text-mh-profit-green text-[10px] font-mono cursor-pointer hover:bg-mh-profit-green/10 transition-colors"
            >
              $4.99/month
            </button>
          </div>
        </div>
      </div>

      {/* Play Again Button - Secondary (ghost style) */}
      {canPlayAgain ? (
        <button
          onClick={onPlayAgain}
          className="bg-transparent border border-mh-border text-mh-text-dim
            px-6 py-2 text-sm font-mono transition-colors
            cursor-pointer hover:border-mh-text-dim hover:text-mh-text-main"
        >
          Play Again
        </button>
      ) : (
        <button
          onClick={onOpenAuth}
          className="bg-mh-accent-blue/20 border-2 border-mh-accent-blue text-mh-accent-blue
            px-6 py-3 text-sm font-mono font-bold cursor-pointer
            hover:bg-mh-accent-blue/30 transition-colors"
        >
          CREATE ACCOUNT TO CONTINUE
        </button>
      )}
    </div>
  )
}
