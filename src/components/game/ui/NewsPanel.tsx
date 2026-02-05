'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useGame } from '@/hooks/useGame'
import type { NewsItem, NewsLabelType } from '@/lib/game/types'
import { TIER_COLORS, type MilestoneTier } from '@/lib/game/milestones'

// Priority order for news sorting (lower = higher priority, displayed first)
const LABEL_PRIORITY: Record<NewsLabelType | 'undefined', number> = {
  breaking: 0,
  news: 1,
  developing: 2,
  rumor: 3,
  gossip: 4,   // Flavor events appear below main news
  none: 5,
  undefined: 5, // Treat undefined same as none
}

function getNewsPriority(labelType?: NewsLabelType): number {
  if (labelType === undefined) return LABEL_PRIORITY.undefined
  return LABEL_PRIORITY[labelType]
}

// Helper to get label display based on labelType
function getLabelDisplay(labelType?: NewsLabelType): { text: string; colorClass: string; glowStyle?: React.CSSProperties } | null {
  switch (labelType) {
    case 'breaking':
      return {
        text: '⚡ BREAKING',
        colorClass: 'text-mh-news',
        glowStyle: { textShadow: '0 0 8px rgba(255,170,0,0.4)' }
      }
    case 'developing':
      return {
        text: 'DEVELOPING',
        colorClass: 'text-mh-news',
        glowStyle: { textShadow: '0 0 8px rgba(255,170,0,0.4)' }
      }
    case 'rumor':
      return {
        text: 'RUMOR',
        colorClass: 'text-mh-news',
        glowStyle: { textShadow: '0 0 8px rgba(255,170,0,0.4)' }
      }
    case 'gossip':
      return {
        text: 'NEWS',
        colorClass: 'text-mh-news',
        glowStyle: { textShadow: '0 0 8px rgba(255,170,0,0.4)' }
      }
    case 'none':
      return null
    case 'news':
    default:
      return {
        text: 'NEWS',
        colorClass: 'text-mh-news',
        glowStyle: { textShadow: '0 0 8px rgba(255,170,0,0.4)' }
      }
  }
}

export function NewsPanel() {
  const {
    day,
    todayNews,
    rumors,
    setSelectedNews,
    activeMilestone,
    milestonePhase,
    selectedTheme,
  } = useGame()
  const isModern3 = selectedTheme === 'modern3'
  const isRetro2 = selectedTheme === 'retro2'
  const isBloomberg = selectedTheme === 'bloomberg'

  // Typewriter state
  const [typewriterIndex, setTypewriterIndex] = useState(0) // Which news item is currently typing
  const [charIndex, setCharIndex] = useState(0) // How many chars revealed in current item
  const [isTypewriting, setIsTypewriting] = useState(false) // Animation in progress
  const [lastDay, setLastDay] = useState(day) // Track day changes
  const typewriterRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-transition from takeover to persist after 2.5 seconds
  useEffect(() => {
    if (milestonePhase === 'takeover') {
      const timer = setTimeout(() => {
        useGame.setState({ milestonePhase: 'persist' })
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [milestonePhase])

  // Watch for day changes to trigger typewriter (all themes)
  useEffect(() => {
    if (day !== lastDay && day > 1) {
      // Day changed, start typewriter animation
      setLastDay(day)
      setTypewriterIndex(0)
      setCharIndex(0)
      setIsTypewriting(true)
    }
  }, [day, lastDay])

  // Build sorted news array (used for typewriter logic and rendering)
  const chainRumorItems: NewsItem[] = rumors.map(r => ({
    headline: r.rumor,
    effects: {},
    labelType: 'rumor' as NewsLabelType,
  }))
  const allNews = [...todayNews, ...chainRumorItems]
    .sort((a, b) => getNewsPriority(a.labelType) - getNewsPriority(b.labelType))

  // Typewriter animation effect
  useEffect(() => {
    if (!isTypewriting) return

    if (typewriterIndex >= allNews.length) {
      // All items revealed
      setIsTypewriting(false)
      return
    }

    const currentHeadline = allNews[typewriterIndex].headline

    if (charIndex >= currentHeadline.length) {
      // Current item complete, move to next
      setTypewriterIndex(prev => prev + 1)
      setCharIndex(0)
      return
    }

    // Type next character
    typewriterRef.current = setTimeout(() => {
      setCharIndex(prev => prev + 1)
    }, 25) // 25ms per character

    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current)
      }
    }
  }, [isTypewriting, typewriterIndex, charIndex, allNews])

  // Skip typewriter animation (click or keypress)
  const skipTypewriter = useCallback(() => {
    if (isTypewriting) {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current)
      }
      setIsTypewriting(false)
    }
  }, [isTypewriting])

  // Add keypress listener to skip typewriter
  useEffect(() => {
    if (!isTypewriting) return

    const handleKeyPress = () => skipTypewriter()
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isTypewriting, skipTypewriter])

  const handleNewsClick = (news: NewsItem) => {
    setSelectedNews(news)
  }

  // Check if there are any rumors to display (stories show as NEWS, not rumors)
  const hasRumors = rumors.length > 0

  // Get milestone color
  const milestoneColor = activeMilestone
    ? TIER_COLORS[activeMilestone.tier as MilestoneTier]
    : '#22c55e'

  // TAKEOVER PHASE: Full panel celebration
  if (milestonePhase === 'takeover' && activeMilestone) {
    const isImpossible = activeMilestone.tier === 'impossible'
    const isMythic = activeMilestone.tier === 'mythic'
    const isLegendary = activeMilestone.tier === 'legendary'

    return (
      <div
        className={`border-b border-mh-border bg-[#0a0d10] p-3 min-h-[120px] overflow-hidden relative ${
          isImpossible ? 'milestone-flash' : isMythic ? 'milestone-glitch' : ''
        }`}
      >
        {/* Background flash effect */}
        <div
          className="absolute inset-0 milestone-pulse-bg"
          style={{ background: milestoneColor }}
        />

        {/* Centered milestone announcement */}
        <div className="relative h-full flex flex-col items-center justify-center text-center">
          <div
            className="text-xs tracking-[0.3em] mb-1"
            style={{ color: milestoneColor, opacity: 0.8 }}
          >
            ★ MILESTONE REACHED ★
          </div>
          <div
            className={`text-lg font-bold tracking-wider ${
              isLegendary ? 'milestone-rainbow' :
              isMythic ? 'milestone-glitch-text' :
              'milestone-glow-pulse'
            }`}
            style={{
              color: milestoneColor,
              textShadow: `0 0 20px ${milestoneColor}, 0 0 40px ${milestoneColor}`,
            }}
          >
            {activeMilestone.title}
          </div>
          <div
            className="text-xs mt-2 opacity-70"
            style={{ color: milestoneColor }}
          >
            {activeMilestone.scarcityMessage}
          </div>
        </div>
      </div>
    )
  }

  // PERSIST or IDLE: Normal news with optional milestone at top
  return (
    <div
      id="tutorial-news"
      className={`p-4 md:p-5 relative ${
        isBloomberg
          ? 'bg-black h-[160px] md:h-auto md:max-h-[320px] border-b md:border-b-0 border-[#333333] border-l-[3px] border-l-[#ff8c00]'
          : isModern3
            ? 'border-l-[3px] border-l-[#00d4aa] bg-gradient-to-r from-[rgba(0,212,170,0.08)] to-[#0a0d10] rounded-r h-[160px] md:h-auto md:max-h-[320px] mt-2 mx-2 md:mt-0 md:mx-0 md:rounded-none md:border-l-0'
            : 'border-b md:border-b-0 border-mh-border border-l-[3px] border-l-mh-accent-blue bg-[#0a0d10] h-[160px] md:h-auto md:max-h-[320px]'
      }`}
      style={isModern3 ? { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' } : undefined}
    >
      <div className="space-y-2 h-full overflow-y-auto overflow-x-hidden">
        {/* Persisted milestone message */}
        {milestonePhase === 'persist' && activeMilestone && (
          <div
            className="text-sm leading-snug font-bold pb-1.5 mb-1.5 border-b border-mh-border"
            style={{
              color: milestoneColor,
              textShadow: `0 0 8px ${milestoneColor}40`,
            }}
          >
            ★ {activeMilestone.title} — {activeMilestone.scarcityMessage}
          </div>
        )}

        {/* Day 1 welcome message */}
        {day === 1 && milestonePhase === 'idle' && (
          <div className="text-base leading-relaxed space-y-2 mb-3">
            {isModern3 ? (
              <>
                <div
                  className="py-2 px-2 -mx-2 rounded-lg font-bold text-mh-profit-green text-base"
                  style={{
                    background: 'rgba(0,212,170,0.12)',
                    textShadow: '0 0 10px rgba(0,212,170,0.6)',
                  }}
                >
                  BUY LOW. SELL HIGH. MAKE BILLIONS.
                </div>
                <div
                  className="text-mh-profit-green text-sm"
                  style={{ textShadow: '0 0 8px rgba(0,212,170,0.5)' }}
                >
                  TAP ANY ASSET TO BUY OR SELL. WATCH THE NEWS.
                </div>
                <div
                  className="text-mh-profit-green text-sm"
                  style={{ textShadow: '0 0 8px rgba(0,212,170,0.5)' }}
                >
                  RUMORS HINT AT TOMORROW. POSITION YOURSELF EARLY.
                </div>
              </>
            ) : (
              <>
                <div className="text-mh-news font-bold text-base" style={{ textShadow: '0 0 8px rgba(255,170,0,0.4)' }}>
                  &gt; BUY LOW. SELL HIGH. MAKE BILLIONS.
                </div>
                <div
                  className={`${isRetro2 ? 'text-mh-profit-green' : 'text-mh-rumor'} text-sm`}
                  style={isRetro2 ? { textShadow: '0 0 8px rgba(0,255,136,0.5)' } : undefined}
                >
                  &gt; TAP ANY ASSET TO BUY OR SELL. WATCH THE NEWS.
                </div>
                <div
                  className={`${isRetro2 ? 'text-mh-profit-green' : 'text-mh-rumor'} text-sm`}
                  style={isRetro2 ? { textShadow: '0 0 8px rgba(0,255,136,0.5)' } : undefined}
                >
                  &gt; RUMORS HINT AT TOMORROW. POSITION YOURSELF EARLY.
                </div>
              </>
            )}
          </div>
        )}

        {/* News items - sorted by priority (BREAKING > NEWS > DEVELOPING > RUMOR > none) */}
        {allNews.map((news, idx) => {
          const label = getLabelDisplay(news.labelType)
          const textColorClass = 'text-mh-news'

          // Determine displayed text based on typewriter state
          let displayedHeadline = news.headline
          let showCursor = false

          if (isTypewriting) {
            if (idx < typewriterIndex) {
              // Already fully revealed
              displayedHeadline = news.headline
            } else if (idx === typewriterIndex) {
              // Currently typing this one
              displayedHeadline = news.headline.slice(0, charIndex)
              showCursor = true
            } else {
              // Not yet started - don't render
              return null
            }
          }

          return (
            <div
              key={`news-${idx}`}
              onClick={() => {
                if (isTypewriting) {
                  skipTypewriter()
                } else {
                  handleNewsClick(news)
                }
              }}
              className="leading-relaxed cursor-pointer hover:brightness-125 transition-all"
            >
              <span className={`${textColorClass} font-bold text-[15px] md:text-[16px]`} style={label?.glowStyle}>
                {label && <>{label.text}: </>}
                {displayedHeadline}
                {showCursor && <span className="animate-pulse">▌</span>}
              </span>
              {label && !isTypewriting && (
                <span
                  className={`text-sm opacity-80 ml-1 ${isModern3 || isRetro2 ? 'text-mh-profit-green' : 'text-mh-rumor'}`}
                  style={isModern3 || isRetro2 ? { textShadow: '0 0 8px rgba(0,255,136,0.5)' } : undefined}
                >ⓘ</span>
              )}
            </div>
          )
        })}

        {/* Empty state only if nothing at all */}
        {todayNews.length === 0 && !hasRumors && milestonePhase === 'idle' && (
          <div className="text-base text-mh-text-dim italic">
            No news or rumors today
          </div>
        )}
      </div>

    </div>
  )
}
