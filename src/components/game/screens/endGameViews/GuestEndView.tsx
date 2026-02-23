'use client'

import type { EndGameProps } from './types'
import { GUEST_TOTAL_LIMIT } from '@/lib/game/userState'
import { formatNetWorth } from '@/lib/utils/formatMoney'
import { InlineUsernameInput } from './InlineUsernameInput'
import { Skeleton } from '@/components/ui/Skeleton'

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
  onMenu,
  onOpenAuth,
  gamesRemaining,
  canPlayAgain,
  leaderboardRank,
  leaderboardLoading,
  roomStandings,
  onBackToRoom,
  roomCode,
}: EndGameProps) {
  const isWin = outcome === 'win'

  // Color scheme based on outcome
  const titleColor = isWin ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'
  const netWorthColor = netWorth >= 0 ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'
  const profitColor = netWorth >= 100000 ? 'text-mh-profit-green' : 'text-mh-loss-red'

  return (
    <div className="min-h-full bg-mh-bg flex flex-col items-center justify-center p-6 md:p-10 text-center relative z-[51]">
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

      <InlineUsernameInput />

      {/* Leaderboard Rank */}
      {leaderboardLoading ? (
        <div className="mt-4 text-sm w-full max-w-[320px]">
          <div className="text-mh-text-dim text-xs mb-2">YOUR RANKING</div>
          <Skeleton className="h-5 w-full" />
        </div>
      ) : leaderboardRank ? (
        <div className="mt-4 text-sm">
          <div className="text-mh-text-dim text-xs mb-1">YOUR RANKING</div>
          <div>
            <span className="text-mh-accent-blue font-bold">#{leaderboardRank.dailyRank.toLocaleString()}</span>
            <span className="text-mh-text-dim"> of {leaderboardRank.dailyTotal.toLocaleString()} today</span>
            <span className="text-mh-text-dim mx-2">|</span>
            <span className="text-mh-accent-blue font-bold">#{leaderboardRank.allTimeRank.toLocaleString()}</span>
            <span className="text-mh-text-dim"> of {leaderboardRank.allTimeTotal.toLocaleString()} all-time</span>
          </div>
        </div>
      ) : null}

      {/* Room code */}
      {roomCode && (
        <div className="mt-4 mb-2">
          <span className="text-mh-text-dim text-xs font-mono">ROOM </span>
          <span className="text-mh-accent-blue text-sm font-mono tracking-wider">{roomCode}</span>
        </div>
      )}

      {/* Room standings (live or final) */}
      {roomStandings}

      {/* Back to Room button */}
      {onBackToRoom && (
        <button
          onClick={onBackToRoom}
          className="mt-4 mb-2 bg-transparent border-2 border-mh-accent-blue text-mh-accent-blue
            px-10 py-4 text-base font-mono cursor-pointer glow-text
            hover:bg-mh-accent-blue/10 transition-colors"
        >
          [ BACK TO ROOM ]
        </button>
      )}

      {/* Guest Games Counter */}
      {isFinite(gamesRemaining) && (
        <div className="flex items-center gap-2 mt-4">
          <span className="text-mh-text-dim text-xs">FREE GAMES</span>
          <span className={`font-bold ${gamesRemaining === 0 ? 'text-mh-loss-red' : 'text-mh-text-bright'}`}>
            {gamesRemaining}/{GUEST_TOTAL_LIMIT}
          </span>
          {gamesRemaining === 0 && <span className="text-mh-loss-red text-xs">Register to continue</span>}
        </div>
      )}

      {/* Registration CTA - The main conversion point */}
      <div className="w-full max-w-[320px] md:max-w-[400px] mt-8 mb-6">
        <div className="border-2 border-mh-accent-blue p-5 md:p-6 bg-mh-accent-blue/5">
          <div className="text-mh-text-bright text-base md:text-lg font-bold mb-4">
            Register for free for the full experience
          </div>

          <div className="text-mh-text-dim text-xs space-y-2 mb-5 text-left">
            <div className="flex items-start gap-2">
              <span className="text-mh-accent-blue">✓</span>
              <span>Unlock 45 & 60-day challenges</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-mh-accent-blue">✓</span>
              <span>Short stocks</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-mh-accent-blue">✓</span>
              <span>2x, 5x, 10x leverage</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-mh-accent-blue">✓</span>
              <span>Compete with friends</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-mh-accent-blue">✓</span>
              <span>Track your rank on the leaderboard</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={canPlayAgain ? onPlayAgain : undefined}
              disabled={!canPlayAgain}
              className={`flex-1 py-3 bg-transparent border border-mh-border text-sm font-mono transition-colors
                ${canPlayAgain
                  ? 'text-mh-text-dim cursor-pointer hover:border-mh-text-dim hover:text-mh-text-main'
                  : 'text-mh-text-dim/30 cursor-not-allowed'}`}
            >
              PLAY AS GUEST
            </button>
            <button
              onClick={onOpenAuth}
              className="flex-1 py-3 border-2 border-mh-accent-blue bg-mh-accent-blue text-mh-bg text-sm font-bold font-mono cursor-pointer hover:bg-mh-accent-blue/90 transition-colors"
            >
              REGISTER FREE
            </button>
          </div>
        </div>
      </div>

      {/* Menu button */}
      <button
        onClick={onMenu}
        className="mb-4 bg-transparent border border-mh-border text-mh-text-dim
          px-8 py-3 text-sm font-mono cursor-pointer
          hover:text-mh-text-bright hover:border-mh-text-dim transition-colors"
      >
        [ MENU ]
      </button>
    </div>
  )
}
