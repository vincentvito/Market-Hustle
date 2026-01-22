'use client'

import { useGame } from '@/hooks/useGame'
import type { NewsItem } from '@/lib/game/types'

export function NewsPanel() {
  const { day, todayNews, rumors, activeSpikeRumors, setSelectedNews } = useGame()

  const handleNewsClick = (news: NewsItem) => {
    setSelectedNews(news)
  }

  // Combine all items into a single feed
  const hasRumors = rumors.length > 0 || activeSpikeRumors.length > 0

  return (
    <div className="border-b border-mh-border bg-[#0a0d10] p-3 h-[120px] overflow-y-auto">
      <div className="space-y-1.5">
        {/* Day 1 welcome message */}
        {day === 1 && (
          <div className="text-sm leading-snug space-y-1 mb-2 pb-2 border-b border-mh-border">
            <div className="text-mh-news font-bold" style={{ textShadow: '0 0 8px rgba(255,170,0,0.4)' }}>
              &gt; BUY LOW. SELL HIGH. MAKE BILLIONS.
            </div>
            <div className="text-mh-rumor">
              &gt; TIP: TAP ANY ASSET TO BUY OR SELL. WATCH THE NEWS FOR MARKET MOVES.
            </div>
            <div className="text-mh-rumor">
              &gt; TIP: RUMORS MIGHT HINT AT TOMORROW'S NEWS. POSITION YOURSELF EARLY.
            </div>
          </div>
        )}

        {/* News items */}
        {todayNews.map((news, idx) => (
          <div
            key={`news-${idx}`}
            onClick={() => handleNewsClick(news)}
            className="text-sm leading-snug cursor-pointer hover:brightness-125 transition-all flex items-start gap-1"
          >
            <span className="text-mh-news font-bold shrink-0">NEWS:</span>
            <span
              className="text-mh-news font-bold flex-1"
              style={{ textShadow: '0 0 8px rgba(255,170,0,0.4)' }}
            >
              {news.headline}
            </span>
            <span className="text-mh-rumor text-xs opacity-80 shrink-0">ⓘ</span>
          </div>
        ))}

        {/* Chain rumors */}
        {rumors.map((rumor, idx) => (
          <div
            key={`rumor-${idx}`}
            className="text-sm leading-snug flex items-start gap-1"
          >
            <span className="text-mh-rumor font-bold shrink-0">RUMOR:</span>
            <span className="text-mh-rumor font-bold">
              {rumor.rumor}
            </span>
          </div>
        ))}

        {/* Spike rumors */}
        {activeSpikeRumors.map((spikeRumor, idx) => (
          <div
            key={`spike-${idx}`}
            className="text-sm leading-snug flex items-start gap-1"
          >
            <span className="text-mh-rumor font-bold shrink-0">RUMOR:</span>
            <span className="text-mh-rumor font-bold">
              {spikeRumor.rumor}
            </span>
          </div>
        ))}

        {/* Empty state only if nothing at all */}
        {todayNews.length === 0 && !hasRumors && (
          <div className="text-sm text-mh-text-dim italic">
            No news or rumors today
          </div>
        )}
      </div>
    </div>
  )
}
