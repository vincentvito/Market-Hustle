'use client'

import { useState, useRef } from 'react'
import { toPng } from 'html-to-image'
import type { EndGameProps } from './types'
import { formatNetWorth, formatCompact } from '@/lib/utils/formatMoney'

/**
 * ProEndView - End-game screen for Pro-tier users.
 *
 * Features:
 * - Unified layout for both wins and losses
 * - Conditional styling (green for win, red for loss)
 * - No game limits - unlimited play
 * - Dynamic narrative messages for margin-related game overs
 * - Primary "Play Again" button (always enabled)
 */
export function ProEndView({
  outcome,
  message,
  netWorth,
  profitPercent,
  profitAmount,
  daysSurvived,
  gameDuration,
  onPlayAgain,
  leaderboardRank,
}: EndGameProps) {
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'sharing'>('idle')
  const resultsRef = useRef<HTMLDivElement>(null)
  const isWin = outcome === 'win'

  // Color scheme based on outcome
  const titleColor = isWin ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'
  const netWorthColor = netWorth >= 0 ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'
  const profitColor = profitAmount >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'

  return (
    <div className="min-h-full bg-mh-bg flex flex-col items-center justify-center px-6 pt-10 pb-6 md:p-10 text-center overflow-auto">
      {/* Shareable results card */}
      <div ref={resultsRef} className="bg-mh-bg flex flex-col items-center p-6 md:p-10 text-center">
      {/* Outcome Header */}
      <div className="text-6xl md:text-7xl mb-4">{message.emoji}</div>
      <div className={`text-4xl md:text-5xl font-bold mb-2 ${titleColor}`}>{message.title}</div>
      <div className="text-mh-text-dim text-sm md:text-base mb-6 max-w-[280px] md:max-w-[400px] leading-relaxed">
        {message.flavor}
      </div>

      {/* Days Survived */}
      <div className="text-mh-text-main text-lg md:text-xl mb-8">
        {isWin ? 'YOU SURVIVED' : 'SURVIVED'} {daysSurvived} / {gameDuration} DAYS
      </div>

      {/* Final Net Worth */}
      <div className="border border-mh-border p-6 md:p-8 mb-4 min-w-[240px] md:min-w-[360px]">
        <div className="text-mh-text-dim text-xs md:text-sm mb-2">FINAL NET WORTH</div>
        <div className={`${formatNetWorth(netWorth).sizeClass} mb-4 ${netWorthColor}`}>{formatNetWorth(netWorth).text}</div>
        <div className={`text-lg md:text-xl ${profitColor}`}>
          {profitAmount >= 0 ? '+' : ''}
          {profitPercent.toFixed(1)}% RETURN
        </div>
        <div className={`text-sm md:text-base mt-1 ${profitColor}`}>
          ({profitAmount >= 0 ? '+' : ''}{formatCompact(profitAmount)})
        </div>
      </div>

      {leaderboardRank && (
        <div className="mt-4 text-sm">
          <div className="text-mh-text-dim text-xs mb-1">YOUR RANKING</div>
          <div>
            <span className="text-mh-accent-blue font-bold">#{leaderboardRank.dailyRank.toLocaleString()}</span>
            <span className="text-mh-text-dim"> of {leaderboardRank.dailyTotal.toLocaleString()} today</span>
            <span className="text-mh-text-dim mx-2">|</span>
            <span className="text-mh-accent-blue font-bold">#{leaderboardRank.allTimeRank.toLocaleString()}</span>
            <span className="text-mh-text-dim"> of {leaderboardRank.allTimeTotal.toLocaleString()} all-time</span>
          </div>
        </div>
      )}

      <div className="text-mh-text-dim text-xs mt-2">markethustle.com</div>
      </div>

      {/* Play Again Button - Always enabled for Pro */}
      <button
        onClick={onPlayAgain}
        className="bg-transparent border-2 border-mh-accent-blue text-mh-accent-blue
          px-10 py-4 text-base font-mono cursor-pointer glow-text
          hover:bg-mh-accent-blue/10 transition-colors"
      >
        [ PLAY AGAIN ]
      </button>

      {/* Share Results Button */}
      <button
        onClick={async () => {
          if (!resultsRef.current || shareState === 'sharing') return
          setShareState('sharing')

          try {
            const dataUrl = await toPng(resultsRef.current, { pixelRatio: 2 })
            const res = await fetch(dataUrl)
            const blob = await res.blob()
            const file = new File([blob], 'market-hustle-results.png', { type: 'image/png' })

            const text = [
              'Market Hustle \u{1F4C8}',
              `${isWin ? '\u{1F3C6} MARKET CLOSED' : '\u{1F480} ' + message.title}`,
              `Survived ${daysSurvived}/${gameDuration} days`,
              `Can you beat my score? markethustle.com`,
            ].join('\n')

            if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.({ files: [file] })) {
              await navigator.share({ files: [file], text })
            } else {
              // Fallback: download the image
              const a = document.createElement('a')
              a.href = dataUrl
              a.download = 'market-hustle-results.png'
              a.click()
            }
          } catch {
            // Share cancelled or failed
          } finally {
            setShareState('idle')
          }
        }}
        className="mt-3 bg-transparent border border-mh-border text-mh-text-dim
          px-8 py-3 text-sm font-mono cursor-pointer
          hover:text-mh-text-bright hover:border-mh-text-dim transition-colors"
      >
        {shareState === 'sharing' ? '[ CAPTURING... ]' : shareState === 'copied' ? '[ COPIED! ]' : '[ SHARE RESULTS ]'}
      </button>
    </div>
  )
}
