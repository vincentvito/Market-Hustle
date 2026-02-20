'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { useStripeCheckout } from '@/hooks/useStripeCheckout'
import { AuthModal } from '@/components/auth/AuthModal'
import { ANONYMOUS_GAME_LIMIT } from '@/lib/game/userState'

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

export function GuestGameOverView() {
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
  const [showAuthModal, setShowAuthModal] = useState(false)

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
          ${netWorth.toLocaleString('en-US')}
        </div>
      </div>

      {/* Games Remaining Counter */}
      <div className="border border-mh-border p-3 mb-6 min-w-[200px] bg-mh-border/10">
        <div className={`text-sm font-bold ${gamesRemaining === 0 ? 'text-mh-loss-red' : 'text-mh-text-bright'}`}>
          {gamesRemaining}/{ANONYMOUS_GAME_LIMIT} free games remaining
        </div>
        {gamesRemaining === 0 && (
          <div className="text-mh-loss-red text-xs mt-1">Sign up to continue playing</div>
        )}
      </div>

      {/* Two-Column CTA Section */}
      <div className="flex gap-3 w-full max-w-[340px] mb-6">
        {/* Sign Up Box */}
        <div className="flex-1 border border-mh-border p-4 bg-mh-border/5">
          <div className="text-mh-accent-blue text-xs font-bold mb-3 text-center">
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
            onClick={() => setShowAuthModal(true)}
            className="w-full py-2 border-2 border-mh-accent-blue bg-mh-accent-blue/10 text-mh-accent-blue text-xs font-bold font-mono cursor-pointer hover:bg-mh-accent-blue/20 transition-colors"
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Go Pro Box */}
        <div className="flex-1 border-2 border-mh-profit-green rounded-lg p-4 bg-mh-profit-green/5 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
          <div className="text-mh-profit-green text-xs font-bold mb-3 text-center">
            GO UNLIMITED
          </div>
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
          <button
            onClick={() => checkout()}
            disabled={checkoutLoading}
            className="w-full py-2 border-2 border-mh-profit-green bg-mh-profit-green text-mh-bg text-xs font-bold font-mono cursor-pointer hover:bg-mh-profit-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkoutLoading ? '...' : 'GO PRO — ONE-TIME'}
          </button>
        </div>
      </div>

      {/* Play Again Button - Secondary */}
      <button
        onClick={() => startGame()}
        disabled={!canPlayAgain}
        className={`bg-transparent border border-mh-border text-mh-text-dim
          px-6 py-2 text-sm font-mono transition-colors
          ${canPlayAgain
            ? 'cursor-pointer hover:border-mh-text-dim hover:text-mh-text-main'
            : 'opacity-40 cursor-not-allowed'
          }`}
      >
        Play Again
      </button>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
