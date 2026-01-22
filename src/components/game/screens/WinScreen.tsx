'use client'

import { useGame } from '@/hooks/useGame'

export function WinScreen() {
  const { startGame, getNetWorth } = useGame()
  const netWorth = getNetWorth()
  const INITIAL_CASH = 100000
  const profit = netWorth - INITIAL_CASH
  const profitPercent = ((netWorth / INITIAL_CASH - 1) * 100).toFixed(1)

  return (
    <div className="min-h-full bg-mh-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="text-mh-text-bright text-3xl font-bold mb-2 glow-text">
        MARKET CLOSED
      </div>
      <div className="text-mh-text-dim text-base mb-8">
        YOU SURVIVED 30 DAYS
      </div>

      <div className="border border-mh-border p-6 mb-8 min-w-[240px]">
        <div className="text-mh-text-dim text-xs mb-2">FINAL NET WORTH</div>
        <div
          className={`text-4xl mb-4 ${profit >= 0 ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'}`}
        >
          ${netWorth.toLocaleString()}
        </div>
        <div className={`text-lg ${profit >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'}`}>
          {profit >= 0 ? '+' : ''}{profitPercent}% RETURN
        </div>
        <div className={`text-sm mt-1 ${profit >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'}`}>
          ({profit >= 0 ? '+' : ''}${profit.toLocaleString()})
        </div>
      </div>

      <button
        onClick={startGame}
        className="bg-transparent border-2 border-mh-accent-blue text-mh-accent-blue
          px-10 py-4 text-base font-mono cursor-pointer glow-text
          hover:bg-mh-accent-blue/10 transition-colors"
      >
        [ PLAY AGAIN ]
      </button>
    </div>
  )
}
