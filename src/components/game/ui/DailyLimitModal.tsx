'use client'

import { useGame } from '@/hooks/useGame'
import { useStripeCheckout } from '@/hooks/useStripeCheckout'
import { REGISTERED_FREE_DAILY_LIMIT } from '@/lib/game/userState'

/**
 * Modal shown when registered free users have hit their daily game limit (3/day).
 * Prompts them to come back tomorrow or upgrade to Pro.
 */
export function DailyLimitModal() {
  const { showDailyLimitModal, setShowDailyLimitModal } = useGame()
  const { checkout, loading: checkoutLoading } = useStripeCheckout()

  if (!showDailyLimitModal) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShowDailyLimitModal(false)}
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
          <div className="text-5xl mb-4">⏰</div>

          {/* Title */}
          <div className="text-mh-loss-red text-xl font-bold mb-2 glow-red">
            DAILY LIMIT REACHED
          </div>

          {/* Message */}
          <div className="text-mh-text-main text-sm mb-6 leading-relaxed">
            You&apos;ve used all {REGISTERED_FREE_DAILY_LIMIT} free games for today.
            <br />
            <span className="text-mh-text-dim">Come back tomorrow or upgrade to Pro for unlimited games.</span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowDailyLimitModal(false)}
              className="w-full py-3 border-2 border-mh-border bg-transparent text-mh-text-main text-sm font-mono cursor-pointer hover:bg-mh-border/20 transition-colors"
            >
              [ BACK TO MENU ]
            </button>
            <button
              onClick={() => checkout('monthly')}
              disabled={checkoutLoading}
              className="w-full py-3 border-2 border-mh-profit-green bg-mh-profit-green/10 text-mh-profit-green text-sm font-bold font-mono cursor-pointer hover:bg-mh-profit-green/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? 'LOADING...' : 'UPGRADE TO PRO — $4.99/mo'}
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
    </>
  )
}
