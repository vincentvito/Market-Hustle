'use client'

import { useGame } from '@/hooks/useGame'
import { REGISTERED_FREE_DAILY_LIMIT } from '@/lib/game/userState'

/**
 * Modal shown when registered free users have hit their daily game limit.
 * Prompts them to come back tomorrow.
 */
export function DailyLimitModal() {
  const showDailyLimitModal = useGame((state) => state.showDailyLimitModal)
  const setShowDailyLimitModal = useGame((state) => state.setShowDailyLimitModal)

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
            You&apos;ve used your {REGISTERED_FREE_DAILY_LIMIT === 1 ? 'free game' : `${REGISTERED_FREE_DAILY_LIMIT} free games`} for today.
            <br />
            <span className="text-mh-text-dim">Come back tomorrow for another game!</span>
          </div>

          {/* Button */}
          <button
            onClick={() => setShowDailyLimitModal(false)}
            className="w-full py-3 border-2 border-mh-border bg-transparent text-mh-text-main text-sm font-mono cursor-pointer hover:bg-mh-border/20 transition-colors"
          >
            [ BACK TO MENU ]
          </button>
        </div>
      </div>
    </>
  )
}
