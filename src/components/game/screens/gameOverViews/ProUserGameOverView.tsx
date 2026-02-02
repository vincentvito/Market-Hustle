'use client'

import { useGame } from '@/hooks/useGame'
import { ASSETS } from '@/lib/game/assets'

// Game over messages based on reason
const GAME_OVER_MESSAGES: Record<string, { title: string; emoji: string; flavor: string }> = {
  BANKRUPT: {
    title: 'BANKRUPT',
    emoji: '💀',
    flavor: 'Your portfolio went to zero. Wall Street claims another victim.',
  },
  DECEASED: {
    title: 'DECEASED',
    emoji: '⚰️',
    flavor: 'The back-alley surgery didn\'t go as planned. At least you died doing what you loved: making questionable financial decisions.',
  },
  IMPRISONED: {
    title: 'IMPRISONED',
    emoji: '⛓️',
    flavor: 'Federal prison. 15 to 20. At least the meals are free. Your trading days are over... for now.',
  },
  MARGIN_CALLED: {
    title: 'MARGIN CALLED',
    emoji: '📞',
    flavor: 'Your broker is on the line. They want their money back. Unfortunately, you don\'t have it.',
  },
  SHORT_SQUEEZED: {
    title: 'SHORT SQUEEZED',
    emoji: '🩳',
    flavor: 'The market moved against you. Hard. Your short positions have consumed everything you own.',
  },
  ECONOMIC_CATASTROPHE: {
    title: 'ECONOMIC CATASTROPHE',
    emoji: '🌍💥',
    flavor: 'You have destabilized the world economy. Governments are forming emergency committees. Your face is on international news. Congratulations?',
  },
}

export function ProUserGameOverView() {
  const {
    day,
    gameDuration,
    gameOverReason,
    startGame,
    getNetWorth,
    leveragedPositions,
    shortPositions,
    prices,
    cash,
  } = useGame()
  const netWorth = getNetWorth()

  // Calculate losses for breakdown
  const leveragedLosses = leveragedPositions.map(pos => {
    const currentValue = pos.qty * (prices[pos.assetId] || pos.entryPrice)
    const equity = currentValue - pos.debtAmount
    const originalEquity = pos.qty * pos.entryPrice / pos.leverage
    const pl = equity - originalEquity
    const asset = ASSETS.find(a => a.id === pos.assetId)
    return { name: asset?.name || pos.assetId, pl, leverage: pos.leverage, isUnderwater: equity < 0 }
  }).filter(p => p.pl < 0)

  const shortLosses = shortPositions.map(pos => {
    const currentLiability = pos.qty * (prices[pos.assetId] || pos.entryPrice)
    const pl = pos.cashReceived - currentLiability
    const asset = ASSETS.find(a => a.id === pos.assetId)
    return { name: asset?.name || pos.assetId, pl }
  }).filter(p => p.pl < 0)

  const showBreakdown = (gameOverReason === 'MARGIN_CALLED' || gameOverReason === 'SHORT_SQUEEZED' || gameOverReason === 'BANKRUPT' || gameOverReason === 'ECONOMIC_CATASTROPHE') &&
    (leveragedLosses.length > 0 || shortLosses.length > 0)

  const message = GAME_OVER_MESSAGES[gameOverReason] || {
    title: gameOverReason,
    emoji: '💀',
    flavor: 'Your career has ended.',
  }

  return (
    <div className="min-h-full bg-mh-bg flex flex-col items-center justify-center p-6 text-center">
      {/* Game Over Reason */}
      <div className="text-6xl mb-4">{message.emoji}</div>
      <div className="text-mh-loss-red text-4xl font-bold mb-2 glow-red">
        {message.title}
      </div>
      <div className="text-mh-text-dim text-sm mb-6 max-w-[280px] leading-relaxed">
        {message.flavor}
      </div>
      <div className="text-mh-text-main text-lg mb-8">
        SURVIVED {day} / {gameDuration} DAYS
      </div>

      {/* Final Net Worth */}
      <div className="border border-mh-border p-5 mb-4 min-w-[200px]">
        <div className="text-mh-text-dim text-xs mb-2">FINAL NET WORTH</div>
        <div
          className={`text-3xl ${netWorth >= 0 ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'}`}
        >
          ${netWorth.toLocaleString('en-US')}
        </div>
      </div>

      {/* Detailed breakdown for margin-related game overs */}
      {showBreakdown && (
        <div className="mb-8 p-4 bg-[#1a1a2e] rounded border border-mh-border text-left max-w-[300px] w-full">
          <div className="text-mh-text-dim text-xs mb-3 text-center">WHAT WENT WRONG</div>

          {leveragedLosses.length > 0 && (
            <div className="mb-3">
              <div className="text-mh-accent-blue text-xs font-bold mb-1">LEVERAGED POSITIONS:</div>
              {leveragedLosses.map((p, i) => (
                <div key={i} className="text-sm text-mh-loss-red flex justify-between">
                  <span>{p.leverage}x {p.name}</span>
                  <span>${p.pl.toLocaleString('en-US')}{p.isUnderwater ? ' ⚠️' : ''}</span>
                </div>
              ))}
            </div>
          )}

          {shortLosses.length > 0 && (
            <div className="mb-3">
              <div className="text-yellow-500 text-xs font-bold mb-1">SHORT POSITIONS:</div>
              {shortLosses.map((p, i) => (
                <div key={i} className="text-sm text-mh-loss-red flex justify-between">
                  <span>SHORT {p.name}</span>
                  <span>${p.pl.toLocaleString('en-US')}</span>
                </div>
              ))}
            </div>
          )}

          <div className="text-mh-text-dim text-xs pt-2 border-t border-mh-border mt-2">
            Cash remaining: ${cash.toLocaleString('en-US')}
          </div>
        </div>
      )}

      {/* Play Again Button - always enabled for Pro */}
      <button
        onClick={() => startGame()}
        className="bg-transparent border-2 border-mh-accent-blue text-mh-accent-blue
          px-10 py-4 text-base font-mono cursor-pointer
          hover:bg-mh-accent-blue/10 transition-colors"
      >
        [ PLAY AGAIN ]
      </button>
    </div>
  )
}
