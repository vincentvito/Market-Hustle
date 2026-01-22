'use client'

import { useGame } from '@/hooks/useGame'

export function GameOverScreen() {
  const { day, gameOverReason, startGame, getNetWorth } = useGame()
  const netWorth = getNetWorth()

  return (
    <div className="min-h-full bg-mh-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="text-mh-loss-red text-4xl font-bold mb-4 glow-red">
        {gameOverReason}
      </div>
      <div className="text-mh-text-main text-lg mb-8">
        SURVIVED {day} / 30 DAYS
      </div>

      <div className="border border-mh-border p-5 mb-8 min-w-[200px]">
        <div className="text-mh-text-dim text-xs mb-2">FINAL NET WORTH</div>
        <div
          className={`text-3xl ${netWorth >= 0 ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'}`}
        >
          ${netWorth.toLocaleString()}
        </div>
      </div>

      <button
        onClick={startGame}
        className="bg-transparent border-2 border-mh-accent-blue text-mh-accent-blue
          px-10 py-4 text-base font-mono cursor-pointer
          hover:bg-mh-accent-blue/10 transition-colors"
      >
        [ TRY AGAIN ]
      </button>
    </div>
  )
}
