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
          <li><span className="text-mh-text-dim">Start with cash</span> — Buy and sell stocks, crypto, and commodities to grow wealth</li>
          <li><span className="text-mh-text-dim">Read the news</span> — Headlines move markets. Buy before good news, sell before bad</li>
          <li><span className="text-mh-text-dim">Advance days</span> — Each day updates prices, triggers events, and pays rental income</li>
          <li><span className="text-mh-text-dim">Buy real assets</span> — Properties generate passive income; Private Equity unlocks special abilities</li>
          <li><span className="text-mh-text-dim">Invest in startups</span> — High-risk deals can 10x your money or go to zero</li>
          <li><span className="text-mh-text-dim">Use PE abilities</span> — Lobbying and destabilization schemes manipulate markets (20% backfire risk)</li>
          <li><span className="text-mh-text-dim">Maximize net worth</span> — Total assets minus debts. Build an empire before time runs out</li>
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
