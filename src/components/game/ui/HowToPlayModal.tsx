'use client'

const TUTORIAL_KEY = 'mh-tutorial-seen'

export function markTutorialSeen() {
  try { localStorage.setItem(TUTORIAL_KEY, '1') } catch {}
}

export function isTutorialSeen(): boolean {
  try { return localStorage.getItem(TUTORIAL_KEY) === '1' } catch { return true }
}

export function HowToPlayModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-mh-bg border border-mh-border max-w-sm w-full p-6 text-left font-mono"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-mh-text-bright text-lg font-bold mb-4 text-center glow-text">
          HOW TO PLAY
        </div>

        <ol className="text-mh-text-main text-sm space-y-3 list-decimal list-inside">
          <li><span className="text-mh-text-dim">Buy &amp; sell</span> assets each day to grow your portfolio.</li>
          <li><span className="text-mh-text-dim">Read the news</span> — headlines move prices. Rumors hint at tomorrow.</li>
          <li><span className="text-mh-text-dim">Survive all days</span> to win. The market gets wilder over time.</li>
          <li><span className="text-mh-text-dim">Go bankrupt</span> (net worth ≤ $0) and it&apos;s game over.</li>
          <li><span className="text-mh-text-dim">Leverage &amp; shorts</span> amplify gains — and losses. Use with care.</li>
        </ol>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-transparent border-2 border-mh-accent-blue text-mh-accent-blue
            py-3 text-sm font-mono cursor-pointer glow-text
            hover:bg-mh-accent-blue/10 transition-colors"
        >
          [ GOT IT ]
        </button>
      </div>
    </div>
  )
}
