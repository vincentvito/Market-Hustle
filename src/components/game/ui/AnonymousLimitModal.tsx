'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { useStripeCheckout } from '@/hooks/useStripeCheckout'
import { AuthModal } from '@/components/auth/AuthModal'
import { ANONYMOUS_GAME_LIMIT } from '@/lib/game/userState'

/**
 * Modal shown when anonymous users (not logged in) have played all 10 lifetime games.
 * Prompts them to sign up (free) to continue playing, or upgrade to Pro.
 */
export function AnonymousLimitModal() {
  const { showAnonymousLimitModal, setShowAnonymousLimitModal } = useGame()
  const { checkout, loading: checkoutLoading } = useStripeCheckout()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (!showAnonymousLimitModal) return null

  const handleSignUp = () => {
    setShowAuthModal(true)
  }

  const handleAuthModalClose = () => {
    setShowAuthModal(false)
    // Keep the anonymous limit modal open unless they successfully signed up
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShowAnonymousLimitModal(false)}
        className="fixed inset-0 bg-black/70 z-[400] flex items-center justify-center"
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-mh-bg border-2 border-mh-border p-6 mx-4 max-w-[320px] text-center"
          style={{
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Icon */}
          <div className="text-5xl mb-4">🎮</div>

          {/* Title */}
          <div className="text-mh-accent-blue text-xl font-bold mb-2 glow-text">
            FREE GAMES USED
          </div>

          {/* Message */}
          <div className="text-mh-text-main text-sm mb-6 leading-relaxed">
            You&apos;ve played all {ANONYMOUS_GAME_LIMIT} free games!
            <br />
            <span className="text-mh-text-dim">
              Sign up free to keep playing, or upgrade to Pro for unlimited games.
            </span>
          </div>

          {/* Benefits of signing up */}
          <div className="mb-6 p-3 bg-mh-border/20 rounded">
            <div className="text-mh-text-dim text-xs mb-2">SIGN UP TO GET:</div>
            <div className="text-mh-text-main text-xs space-y-1 text-left">
              <div>✓ 3 free games per day</div>
              <div>✓ Save your stats across devices</div>
              <div>✓ Track your career progress</div>
              <div>✓ Appear on leaderboards</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSignUp}
              className="w-full py-3 border-2 border-mh-accent-blue bg-mh-accent-blue/10 text-mh-accent-blue text-sm font-bold font-mono cursor-pointer hover:bg-mh-accent-blue/20 transition-colors"
            >
              [ SIGN UP FREE ]
            </button>
            <button
              onClick={() => checkout('monthly')}
              disabled={checkoutLoading}
              className="w-full py-3 border-2 border-mh-profit-green bg-mh-profit-green/10 text-mh-profit-green text-sm font-bold font-mono cursor-pointer hover:bg-mh-profit-green/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? 'LOADING...' : 'GO PRO — $4.99/mo'}
            </button>
            <button
              onClick={() => setShowAnonymousLimitModal(false)}
              className="w-full py-2 border border-mh-border bg-transparent text-mh-text-dim text-xs font-mono cursor-pointer hover:bg-mh-border/20 transition-colors"
            >
              BACK TO MENU
            </button>
          </div>

          {/* Pro benefits teaser */}
          <div className="mt-4 pt-4 border-t border-mh-border">
            <div className="text-mh-text-dim text-xs mb-2">PRO INCLUDES:</div>
            <div className="text-mh-profit-green text-xs space-y-1">
              <div>✓ Unlimited games</div>
              <div>✓ 45 & 60-day modes</div>
              <div>✓ Short selling & leverage</div>
              <div>✓ Career statistics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal (nested) */}
      <AuthModal isOpen={showAuthModal} onClose={handleAuthModalClose} />
    </>
  )
}
