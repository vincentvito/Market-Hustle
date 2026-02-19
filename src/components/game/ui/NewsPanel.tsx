'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useGame } from '@/hooks/useGame'
import type { NewsItem, NewsLabelType } from '@/lib/game/types'
import { TIER_COLORS, type MilestoneTier } from '@/lib/game/milestones'

// Priority order for news sorting (lower = higher priority, displayed first)
const LABEL_PRIORITY: Record<NewsLabelType | 'undefined', number> = {
  breaking: 0,
  scheduled: 1, // Calendar events (Fed, jobs, GDP) shown prominently
  news: 2,
  developing: 3,
  rumor: 4,
  gossip: 5,   // Wall St Gossip (trading messages) appear below main news
  flavor: 5,   // Flavor events (meme/celebrity) same tier as gossip
  study: 5,    // Study headlines (promoted from flavor)
  report: 5,   // Report headlines (promoted from flavor)
  none: 6,
  undefined: 6, // Treat undefined same as none
}

function getNewsPriority(labelType?: NewsLabelType): number {
  if (labelType === undefined) return LABEL_PRIORITY.undefined
  return LABEL_PRIORITY[labelType]
}

// Helper to get label display based on labelType
function getLabelDisplay(labelType?: NewsLabelType): { text: string; colorClass: string } | null {
  switch (labelType) {
    case 'breaking':
      return { text: '⚡ BREAKING', colorClass: 'text-mh-news' }
    case 'developing':
      return { text: 'DEVELOPING', colorClass: 'text-mh-news' }
    case 'rumor':
      return { text: 'RUMOR', colorClass: 'text-mh-news' }
    case 'scheduled':
      return { text: 'SCHEDULED', colorClass: 'text-mh-news' }
    case 'gossip':
      return { text: 'WALL ST GOSSIP', colorClass: 'text-mh-news' }
    case 'flavor':
      return { text: 'JUST IN', colorClass: 'text-mh-news' }
    case 'study':
      return { text: 'STUDY', colorClass: 'text-mh-news' }
    case 'report':
      return { text: 'REPORT', colorClass: 'text-mh-news' }
    case 'none':
      return null
    case 'news':
    default:
      return { text: 'NEWS', colorClass: 'text-mh-news' }
  }
}

// Strip redundant category prefixes from headline text for display only.
// The raw headline is preserved for dictionary lookups (newsExplanations, newsContent).
function cleanHeadline(headline: string, hasLabel: boolean): string {
  if (!hasLabel) return headline
  // Strip emoji prefixes (🎯, ⚠️, 📰, 🕵️)
  let cleaned = headline.replace(/^(?:🎯|⚠️|📰|🕵️)\s*/, '')
  // Strip known category prefixes that duplicate the label
  cleaned = cleaned.replace(/^(BREAKING|DEVELOPING|JUST IN|NEWS|STUDY|REPORT):\s*/, '')
  return cleaned
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
  const isModern3 = selectedTheme === 'modern3' || selectedTheme === 'modern3list'
  const isRetro2 = selectedTheme === 'retro2'
  const isBloomberg = selectedTheme === 'bloomberg'

  // Theme-aware glow matching --mh-news color per theme
  const newsGlowStyle: React.CSSProperties = isModern3
    ? { textShadow: '0 0 8px rgba(0,212,170,0.4)' }    // #00d4aa
    : isRetro2
      ? { textShadow: '0 0 8px rgba(0,255,136,0.4)' }   // #00ff88
      : isBloomberg
        ? { textShadow: '0 0 8px rgba(255,204,0,0.4)' }  // #ffcc00
        : { textShadow: '0 0 8px rgba(255,170,0,0.4)' }  // #ffaa00
  const scheduledGlowStyle: React.CSSProperties = { textShadow: '0 0 8px rgba(100,180,255,0.4)' }

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
    predictionLine: r.predictionLine,
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

    const currentNews = allNews[typewriterIndex]
    const currentLabel = getLabelDisplay(currentNews.labelType)
    const currentHeadline = cleanHeadline(currentNews.headline, !!currentLabel)

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
      className={`p-2.5 md:p-5 relative ${
        isBloomberg
          ? 'bg-black h-[clamp(140px,28dvh,350px)] md:h-auto md:max-h-[300px] border-b md:border-b-0 border-[#333333] border-l-[3px] border-l-[#ff8c00]'
          : isModern3
            ? 'border-l-[3px] border-l-[#00d4aa] bg-gradient-to-r from-[rgba(0,212,170,0.08)] to-[#0a0d10] rounded-r h-[clamp(140px,28dvh,350px)] md:h-auto md:max-h-[300px] mx-2 md:mx-0 md:rounded-none md:border-l-0'
            : 'border-b md:border-b-0 border-mh-border border-l-[3px] border-l-mh-accent-blue bg-[#0a0d10] h-[clamp(140px,28dvh,350px)] md:h-auto md:max-h-[300px]'
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

        {/* News items - sorted by priority (BREAKING > NEWS > DEVELOPING > RUMOR > none) */}
        {allNews.map((news, idx) => {
          const label = getLabelDisplay(news.labelType)
          const textColorClass = 'text-mh-news'

          // Clean redundant prefixes from headline for display
          const cleanedHeadline = cleanHeadline(news.headline, !!label)

          // Determine displayed text based on typewriter state
          let displayedHeadline = cleanedHeadline
          let showCursor = false

          if (isTypewriting) {
            if (idx < typewriterIndex) {
              // Already fully revealed
              displayedHeadline = cleanedHeadline
            } else if (idx === typewriterIndex) {
              // Currently typing this one
              displayedHeadline = cleanedHeadline.slice(0, charIndex)
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
              <span className={`${textColorClass} font-bold text-[15px] md:text-[16px]`} style={label ? (news.labelType === 'scheduled' ? scheduledGlowStyle : newsGlowStyle) : undefined}>
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
              {news.predictionLine && !isTypewriting && (
                <div
                  className="text-[13px] md:text-[14px] font-bold mt-0.5 tracking-wide"
                  style={{
                    color: '#60a5fa',
                    textShadow: '0 0 8px rgba(96,165,250,0.3)',
                  }}
                >
                  {news.predictionLine}
                </div>
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
