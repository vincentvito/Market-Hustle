'use client'

import { useGame } from '@/hooks/useGame'

export function Header() {
  const { day, getNetWorth } = useGame()
  const netWorth = getNetWorth()

  return (
    <div className="p-4 border-b border-mh-border flex justify-between items-start">
      <div>
        <div className="text-mh-text-dim text-xs">DAY</div>
        <div className="text-3xl font-bold text-mh-text-bright glow-text">
          {day}<span className="text-mh-text-dim text-base">/30</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-mh-text-dim text-xs">NET WORTH</div>
        <div
          className={`text-3xl font-bold ${
            netWorth >= 10000 ? 'text-mh-profit-green glow-green' : 'text-mh-loss-red glow-red'
          }`}
        >
          ${netWorth.toLocaleString()}
        </div>
      </div>
    </div>
  )
}
