'use client'

import { useGame } from '@/hooks/useGame'
import { useStripeCheckout } from '@/hooks/useStripeCheckout'
import { REGISTERED_FREE_DAILY_LIMIT } from '@/lib/game/userState'

/**
 * Modal shown when registered free users have hit their daily game limit.
 * Prompts them to upgrade to Pro or come back tomorrow.
 */
export function DailyLimitModal() {
  const showDailyLimitModal = useGame((state) => state.showDailyLimitModal)
  const setShowDailyLimitModal = useGame((state) => state.setShowDailyLimitModal)
  const { checkout, loading } = useStripeCheckout()

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
          className="bg-[#0f1419] border border-mh-border/40 p-6 mx-4 max-w-[380px] text-center rounded-xl"
          style={{
            animation: 'fadeIn 0.2s ease-out',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 212, 170, 0.08)',
          }}
        >
          {/* Icon */}
          <div className="text-5xl mb-3">⏰</div>

          {/* Title */}
          <div className="text-mh-loss-red text-xl font-bold mb-1 glow-red">
            DAILY LIMIT REACHED
          </div>

          {/* Message */}
          <div className="text-mh-text-dim text-sm mb-5 leading-relaxed">
            You&apos;ve used your {REGISTERED_FREE_DAILY_LIMIT === 1 ? 'free game' : `${REGISTERED_FREE_DAILY_LIMIT} free games`} for today.
          </div>

          {/* Upgrade section */}
          <div className="border border-mh-border/40 rounded-lg p-4 mb-4 bg-mh-bg/50 text-left">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-mh-text-bright text-sm font-bold">Unlock Pro</span>
              <div className="flex items-baseline gap-1">
                <span className="text-mh-text-bright text-lg font-bold">$17.99</span>
                <span className="text-mh-text-dim text-[10px]">one-time</span>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { feature: 'Unlimited games', desc: 'No daily limits' },
                { feature: 'Short selling', desc: 'Profit from crashes' },
                { feature: '10X leverage', desc: 'Amplify your trades' },
                { feature: '45 & 60-day modes', desc: 'Extended challenges' },
              ].map(({ feature, desc }) => (
                <div key={feature} className="flex items-center gap-2">
                  <span className="text-mh-accent-blue text-xs shrink-0">+</span>
                  <span className="text-mh-text-bright text-xs">{feature}</span>
                  <span className="text-mh-text-dim text-[10px]">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA button */}
          <button
            onClick={checkout}
            disabled={loading}
            className={`w-full py-3 bg-mh-accent-blue text-mh-bg text-sm font-bold font-mono
              tracking-wider rounded-md transition-all mb-3
              ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:brightness-110'}`}
          >
            {loading ? 'REDIRECTING...' : 'UNLOCK PRO — $17.99'}
          </button>

          <div className="text-mh-text-dim/40 text-[10px] mb-3">
            No subscription. No recurring fees. Unlimited forever.
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setShowDailyLimitModal(false)}
            className="w-full py-2 text-mh-text-dim text-xs hover:text-mh-text-bright transition-colors cursor-pointer"
          >
            Come back tomorrow
          </button>
        </div>
      </div>
    </>
  )
}
