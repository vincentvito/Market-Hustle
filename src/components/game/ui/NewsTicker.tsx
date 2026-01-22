'use client'

import { useGame } from '@/hooks/useGame'

export function NewsTicker() {
  const newsHistory = useGame(state => state.newsHistory)

  return (
    <div className="py-2.5 px-4 border-b border-mh-border bg-[#0a0a08]">
      {newsHistory.slice(0, 4).map((news, idx) => (
        <div
          key={idx}
          className={`
            ${idx === 0 ? 'text-mh-news text-[13px] font-bold' : 'text-[#806600] text-[11px]'}
            ${idx < 3 ? 'mb-1' : ''}
          `}
          style={{
            opacity: 1 - idx * 0.2,
            textShadow: idx === 0 ? '0 0 8px rgba(255,170,0,0.5)' : 'none',
          }}
        >
          {idx === 0 ? '▶ ' : '  '}{news}
        </div>
      ))}
    </div>
  )
}
