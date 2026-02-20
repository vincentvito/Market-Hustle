'use client'

import { useEffect, useRef } from 'react'

interface ProUpgradeDialogProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
  isWin: boolean
  loading?: boolean
}

export function ProUpgradeDialog({ isOpen, onClose, onCheckout, isWin, loading }: ProUpgradeDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-[200]"
        onClick={onClose}
      />

      {/* Dialog — bottom sheet on mobile, centered on desktop */}
      <div
        ref={dialogRef}
        className="fixed bottom-0 left-0 right-0 z-[210] trade-sheet-animate overflow-y-auto
          bg-[#0f1419] rounded-t-xl
          md:bottom-auto md:top-1/2 md:left-1/2 md:w-[440px] md:max-h-[80vh] md:rounded-xl
          md:border md:border-mh-accent-blue/30"
        style={{
          maxHeight: 'calc(100% - 40px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 212, 170, 0.12)',
        }}
      >
        {/* Pull handle on mobile */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-mh-border/60" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-mh-text-dim hover:text-mh-text-bright
            text-lg w-8 h-8 flex items-center justify-center transition-colors z-10"
        >
          x
        </button>

        <div className="px-6 pt-4 pb-6 md:px-8 md:pt-6 md:pb-8">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="text-mh-accent-blue text-[10px] font-mono tracking-widest mb-2 opacity-70">
              {isWin ? '> ADVANCED MODES AVAILABLE' : '> PRO TOOLS AVAILABLE'}
            </div>
            <div className="text-mh-text-bright text-xl md:text-2xl font-bold mb-1">
              Upgrade to Pro
            </div>
            <div className="text-mh-text-dim text-xs">
              {isWin
                ? 'You beat 30 days. Ready for the real challenge?'
                : 'Get the tools to survive next time.'}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-center gap-2 mb-5">
            <span className="text-mh-text-bright text-4xl md:text-5xl font-bold">$17.99</span>
            <div className="text-left">
              <div className="text-mh-text-dim text-xs">one-time</div>
              <div className="text-mh-text-dim/50 text-[10px]">forever</div>
            </div>
          </div>

          {/* Features list */}
          <div className="border border-mh-border/40 rounded-lg p-4 mb-5 bg-mh-bg/50">
            <div className="space-y-3">
              {[
                { feature: 'Unlimited games', desc: 'No daily limits' },
                { feature: 'Short selling', desc: 'Profit from crashes' },
                { feature: '10X leverage', desc: 'Amplify your trades' },
                { feature: '45 & 60-day challenges', desc: 'Extended game modes' },
              ].map(({ feature, desc }) => (
                <div key={feature} className="flex items-center gap-3">
                  <span className="text-mh-accent-blue text-sm shrink-0">+</span>
                  <div className="flex-1">
                    <span className="text-mh-text-bright text-sm">{feature}</span>
                    <span className="text-mh-text-dim text-xs ml-2">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA button */}
          <button
            onClick={onCheckout}
            disabled={loading}
            className={`w-full py-3.5 bg-mh-accent-blue text-mh-bg
              text-base font-bold font-mono transition-all tracking-wider rounded-md
              ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:brightness-110'}`}
          >
            {loading ? 'REDIRECTING...' : 'UNLOCK PRO — $17.99'}
          </button>

          <div className="text-mh-text-dim/40 text-[10px] text-center mt-3">
            No subscription. No recurring fees. Unlimited forever.
          </div>

          {/* Dismiss */}
          <button
            onClick={onClose}
            className="w-full mt-3 text-mh-text-dim text-xs hover:text-mh-text-bright
              transition-colors cursor-pointer py-2"
          >
            Maybe later
          </button>
        </div>
      </div>
    </>
  )
}
