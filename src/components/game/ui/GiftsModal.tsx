'use client'

import { useGame } from '@/hooks/useGame'
import { GIFTS } from '@/lib/game/gifts'
import { formatCompact } from '@/lib/utils/formatMoney'

export function GiftsModal() {
  const { showGiftsModal, setShowGiftsModal, wifeSuspicion, wifeSuspicionFrozenUntilDay, day, cash, buyGift } = useGame()

  if (!showGiftsModal) return null

  // Color-coded warnings based on suspicion level
  const getSuspicionColor = (suspicion: number) => {
    if (suspicion >= 80) return 'text-mh-loss-red'
    if (suspicion >= 60) return 'text-yellow-500'
    if (suspicion >= 40) return 'text-yellow-300'
    return 'text-mh-profit-green'
  }

  const getSuspicionLabel = (suspicion: number) => {
    if (suspicion >= 80) return 'CRITICAL'
    if (suspicion >= 60) return 'HIGH'
    if (suspicion >= 40) return 'MODERATE'
    return 'LOW'
  }

  return (
    <div
      onClick={() => setShowGiftsModal(false)}
      className="fixed inset-0 bg-black/85 z-[200] flex items-center justify-center p-5"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-mh-bg border border-mh-border rounded-lg w-full max-w-[340px] max-h-[80vh] overflow-auto"
      >
        {/* Header */}
        <div className="p-4 border-b border-mh-border flex justify-between items-center">
          <div>
            <div className="text-mh-text-dim text-[10px]">WIFE SUSPICION</div>
            <div className={`text-2xl font-bold ${getSuspicionColor(wifeSuspicion)}`}>
              {wifeSuspicion.toFixed(0)}% {getSuspicionLabel(wifeSuspicion)}
            </div>
            <div className="text-mh-text-dim text-[10px] mt-1">
              Buy gifts to reduce suspicion
            </div>
            {wifeSuspicion >= 90 && (
              <div className="text-red-500 font-bold text-xs mt-1 animate-pulse">
                DIVORCE IMMINENT! Buy gifts NOW!
              </div>
            )}
            {wifeSuspicion >= 75 && wifeSuspicion < 90 && (
              <div className="text-yellow-400 text-xs mt-1">
                Wife is getting suspicious...
              </div>
            )}
            {wifeSuspicionFrozenUntilDay != null && wifeSuspicionFrozenUntilDay >= day && (
              <div className="text-cyan-400 text-xs mt-1">
                🧊 Heat frozen until Day {wifeSuspicionFrozenUntilDay}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowGiftsModal(false)}
            className="bg-transparent border-none text-mh-text-dim text-2xl cursor-pointer px-2"
          >
            ×
          </button>
        </div>

        {/* Gifts Grid */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {GIFTS.map(gift => {
            const canAfford = cash >= gift.cost

            return (
              <div
                key={gift.id}
                className="bg-[#0a0f14] border border-mh-border rounded-lg p-3 flex flex-col"
              >
                {/* Gift emoji and name */}
                <div className="text-center mb-2">
                  <div className="text-3xl mb-1">{gift.emoji}</div>
                  <div className="text-mh-text-bright font-bold text-sm">
                    {gift.name}
                  </div>
                </div>

                {/* Cost */}
                <div className="text-center text-mh-accent-blue font-bold text-sm mb-2">
                  {formatCompact(gift.cost)}
                </div>

                {/* Heat reduction */}
                <div className="text-center text-mh-profit-green text-xs font-bold mb-2">
                  -{gift.heatReduction}% Heat
                  {gift.freezeDays && (
                    <div className="text-[10px] text-purple-400 mt-0.5">
                      +{gift.freezeDays}d freeze
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="text-mh-text-dim text-[10px] text-center mb-3 flex-1">
                  {gift.description}
                </div>

                {/* Buy button */}
                <button
                  onClick={() => {
                    if (canAfford) {
                      buyGift(gift.id)
                    }
                  }}
                  disabled={!canAfford}
                  className={`w-full h-8 font-mono font-bold text-xs tracking-wider rounded cursor-pointer transition-all ${
                    canAfford
                      ? 'bg-mh-accent-blue text-mh-bg hover:bg-mh-accent-blue/80'
                      : 'bg-[#1a2a3a] text-mh-text-dim cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'BUY' : 'TOO POOR'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-mh-border text-center">
          <div className="text-mh-text-dim text-[10px]">
            Available cash: <span className="text-mh-text-bright font-bold">{formatCompact(cash)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
