'use client'

import type { EndGameProps } from './types'
import { formatNetWorth } from '@/lib/utils/formatMoney'

/**
 * GuestEndView - End-game screen for anonymous/guest users.
 *
 * Focused on converting guests to registered users.
 * Shows game results + prominent registration CTA.
 * Registration is free and unlocks more games + durations.
 */
export function GuestEndView({
  outcome,
  message,
  netWorth,
  profitPercent,
  daysSurvived,
  gameDuration,
  onPlayAgain,
  onOpenAuth,
  roomStandings,
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
        <div className={`${formatNetWorth(netWorth).sizeClass} ${netWorthColor}`}>{formatNetWorth(netWorth).text}</div>
      </div>

      {/* Profit/Loss percentage - more prominent on wins */}
      {isWin && (
        <div className={`text-lg md:text-xl mb-6 ${profitColor}`}>
          {profitPercent >= 0 ? '+' : ''}
          {profitPercent.toFixed(1)}% RETURN
        </div>
      )}

      {/* Room standings (live or final) */}
      {roomStandings}

      {/* Registration CTA - The main conversion point */}
      <div className="w-full max-w-[320px] md:max-w-[400px] mb-6">
        <div className="border-2 border-mh-accent-blue p-5 md:p-6 bg-mh-accent-blue/5">
          <div className="text-mh-text-bright text-base md:text-lg font-bold mb-2">
            Continue your run
          </div>
          <div className="text-mh-text-dim text-sm mb-4">
            Register for free to keep playing and unlock more days
          </div>

          <div className="text-mh-text-dim text-xs space-y-2 mb-5 text-left">
            <div className="flex items-start gap-2">
              <span className="text-mh-accent-blue">✓</span>
              <span>Save your progress & stats</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-mh-accent-blue">✓</span>
              <span>Unlock 45 & 60-day challenges</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-mh-accent-blue">✓</span>
              <span>Compete on the leaderboard</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-mh-accent-blue">✓</span>
              <span>3 free games + 1 game daily</span>
            </div>
          </div>

          <button
            onClick={onOpenAuth}
            className="w-full py-3 border-2 border-mh-accent-blue bg-mh-accent-blue text-mh-bg text-sm font-bold font-mono cursor-pointer hover:bg-mh-accent-blue/90 transition-colors"
          >
            REGISTER FREE
          </button>
        </div>
      </div>

      {/* Play Again as Guest - secondary/ghost style */}
      <button
        onClick={onPlayAgain}
        className="bg-transparent border border-mh-border text-mh-text-dim
          px-6 py-2 text-sm font-mono transition-colors
          cursor-pointer hover:border-mh-text-dim hover:text-mh-text-main"
      >
        Play Again as Guest
      </button>
    </div>
  )
}
