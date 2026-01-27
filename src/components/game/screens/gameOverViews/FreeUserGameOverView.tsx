'use client'

import { useGame } from '@/hooks/useGame'
import { useStripeCheckout } from '@/hooks/useStripeCheckout'
import { REGISTERED_FREE_DAILY_LIMIT } from '@/lib/game/userState'

// Game over messages based on reason
const GAME_OVER_MESSAGES: Record<string, { title: string; emoji: string; flavor: string }> = {
  BANKRUPT: {
    title: 'BANKRUPT',
    emoji: '💀',
    flavor: 'Your portfolio went to zero. Wall Street claims another victim.',
  },
  DECEASED: {
    title: 'DECEASED',
    emoji: '⚰️',
    flavor: 'The back-alley surgery didn\'t go as planned. At least you died doing what you loved: making questionable financial decisions.',
  },
  IMPRISONED: {
    title: 'IMPRISONED',
    emoji: '⛓️',
    flavor: 'Federal prison. 15 to 20. At least the meals are free. Your trading days are over... for now.',
  },
  MARGIN_CALLED: {
    title: 'MARGIN CALLED',
    emoji: '📞',
    flavor: 'Your broker is on the line. They want their money back. Unfortunately, you don\'t have it.',
  },
  SHORT_SQUEEZED: {
    title: 'SHORT SQUEEZED',
    emoji: '🩳',
    flavor: 'The market moved against you. Hard. Your short positions have consumed everything you own.',
  },
  ECONOMIC_CATASTROPHE: {
    title: 'ECONOMIC CATASTROPHE',
    emoji: '🌍💥',
    flavor: 'You have destabilized the world economy. Governments are forming emergency committees. Your face is on international news. Congratulations?',
  },
}

export function FreeUserGameOverView() {
  const {
    day,
    gameDuration,
    gameOverReason,
    startGame,
    getNetWorth,
    gamesRemaining,
  } = useGame()
  const netWorth = getNetWorth()
  const { checkout, loading: checkoutLoading } = useStripeCheckout()

  const canPlayAgain = gamesRemaining > 0

  const message = GAME_OVER_MESSAGES[gameOverReason] || {
    title: gameOverReason,
    emoji: '💀',
    flavor: 'Your career has ended.',
  }

  return (
    <div className="min-h-full bg-mh-bg flex flex-col items-center justify-center p-6 text-center">
      {/* Game Over Reason */}
      <div className="text-6xl mb-4">{message.emoji}</div>
      <div className="text-mh-loss-red text-4xl font-bold mb-2 glow-red">
        {message.title}
      </div>
      <div className="text-mh-text-dim text-sm mb-6 max-w-[280px] leading-relaxed">
        {message.flavor}
      </div>
      <div className="text-mh-text-main text-lg mb-8">
        SURVIVED {day} / {gameDuration} DAYS
      </div>

      {/* Final Net Worth */}
      <div className="border border-mh-border p-5 mb-4 min-w-[200px]">
        <div className="text-mh-text-dim text-xs mb-2">FINAL NET WORTH</div>
        <div
          className={`text-3xl ${netWorth >= 0 ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'}`}
        >
          ${netWorth.toLocaleString()}
        </div>
      </div>

      {/* Daily Games Remaining Counter */}
      <div className="border border-mh-border p-3 mb-6 min-w-[200px] bg-mh-border/10">
        <div className="flex justify-between items-center">
          <span className="text-mh-text-dim text-xs">DAILY GAMES</span>
          <span className={`font-bold ${gamesRemaining === 0 ? 'text-mh-loss-red' : 'text-mh-text-bright'}`}>
            {gamesRemaining}/{REGISTERED_FREE_DAILY_LIMIT}
          </span>
        </div>
        {gamesRemaining === 0 && (
          <div className="text-mh-loss-red text-xs mt-1">Resets at midnight</div>
        )}
      </div>

      {/* Upsell Section */}
      <div className="mb-6 max-w-[280px]">
        <div className="text-mh-text-bright text-sm font-bold mb-3">
          That was easy mode.
        </div>
        <div className="text-mh-text-dim text-sm space-y-1">
          <div>• Short selling</div>
          <div>• 10X leverage</div>
          <div>• More strategy</div>
        </div>
      </div>

      {/* Pricing Buttons */}
      <div className="flex flex-col gap-2 w-full max-w-[280px] mb-6">
        <button
          onClick={() => checkout('yearly')}
          disabled={checkoutLoading}
          className="w-full py-3 border-2 border-mh-profit-green bg-mh-profit-green text-mh-bg text-sm font-bold font-mono cursor-pointer hover:bg-mh-profit-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checkoutLoading ? 'LOADING...' : 'GO PRO — $29.99/yr (50% off)'}
        </button>
        <button
          onClick={() => checkout('monthly')}
          disabled={checkoutLoading}
          className="w-full py-3 border-2 border-mh-profit-green bg-mh-profit-green/10 text-mh-profit-green text-sm font-bold font-mono cursor-pointer hover:bg-mh-profit-green/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checkoutLoading ? 'LOADING...' : '$4.99/month'}
        </button>
      </div>

      {/* Play Again Button */}
      <button
        onClick={() => startGame()}
        disabled={!canPlayAgain}
        className={`bg-transparent border-2 border-mh-accent-blue text-mh-accent-blue
          px-10 py-4 text-base font-mono transition-colors
          ${canPlayAgain
            ? 'cursor-pointer hover:bg-mh-accent-blue/10'
            : 'opacity-50 cursor-not-allowed'
          }`}
      >
        [ PLAY AGAIN ]
      </button>
    </div>
  )
}
