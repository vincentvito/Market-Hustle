'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGame } from '@/hooks/useGame'

const INTRO_SEEN_KEY = 'mh-intro-seen'

export function isIntroSeen(): boolean {
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markIntroSeen() {
  try {
    localStorage.setItem(INTRO_SEEN_KEY, '1')
  } catch {}
}

interface IntroSlide {
  lines: Array<{ text: string; style?: 'dim' | 'bright' | 'accent' | 'red' }>
}

const SLIDES: IntroSlide[] = [
  {
    lines: [
      { text: 'You were somebody once.', style: 'bright' },
      { text: 'Corner office. Good salary. Respect.', style: 'dim' },
    ],
  },
  {
    lines: [
      { text: '"The AI does your job now."', style: 'red' },
      { text: 'One meeting. One sentence. Gone.', style: 'dim' },
    ],
  },
  {
    lines: [
      { text: 'Your daughter is only 7.', style: 'bright' },
      { text: "She doesn't understand why daddy cries at night.", style: 'dim' },
    ],
  },
  {
    lines: [
      { text: 'Nobody knows you got fired.', style: 'bright' },
      { text: "You sit in Starbucks applying to jobs that don't exist anymore.", style: 'dim' },
    ],
  },
  {
    lines: [
      { text: 'Then Tommy called.', style: 'accent' },
      { text: '"Bro. Day trading. Free money. I\'m sending you a link."', style: 'dim' },
    ],
  },
  {
    lines: [
      { text: 'You maxed your credit card. $50K.', style: 'red' },
      { text: '30 days to pay it back.', style: 'bright' },
      { text: 'Do it for your daughter.', style: 'accent' },
    ],
  },
]

const STYLE_MAP: Record<string, string> = {
  bright: 'text-mh-text-bright',
  dim: 'text-mh-text-dim',
  accent: 'text-mh-accent-blue font-bold',
  red: 'text-mh-loss-red font-bold',
}

export function IntroScreen() {
  const startGame = useGame(state => state.startGame)
  const [slideIndex, setSlideIndex] = useState(0)
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in')

  const isLastSlide = slideIndex === SLIDES.length - 1

  const advanceSlide = useCallback(() => {
    if (isLastSlide) return

    setFadeState('out')
    setTimeout(() => {
      setSlideIndex(prev => prev + 1)
      setFadeState('in')
    }, 300)
  }, [isLastSlide])

  const handleStart = useCallback(() => {
    markIntroSeen()
    startGame()
  }, [startGame])

  // Keyboard: any key advances, Enter on last slide starts game
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isLastSlide) {
        if (e.key === 'Enter' || e.key === ' ') handleStart()
      } else {
        advanceSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLastSlide, advanceSlide, handleStart])

  const slide = SLIDES[slideIndex]

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-6 bg-mh-bg cursor-pointer select-none"
      onClick={isLastSlide ? undefined : advanceSlide}
    >
      <div className="max-w-md w-full text-center">
        {/* Slide content */}
        <div
          className="space-y-4 min-h-[120px] flex flex-col justify-center transition-opacity duration-300"
          style={{ opacity: fadeState === 'in' ? 1 : 0 }}
        >
          {slide.lines.map((line, idx) => (
            <p
              key={idx}
              className={`text-lg leading-relaxed ${STYLE_MAP[line.style || 'bright']}`}
            >
              {line.text}
            </p>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-10">
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === slideIndex
                  ? 'bg-mh-accent-blue scale-125'
                  : idx < slideIndex
                    ? 'bg-mh-text-dim'
                    : 'bg-mh-border'
              }`}
            />
          ))}
        </div>

        {/* Bottom area */}
        <div className="mt-10">
          {isLastSlide ? (
            <button
              onClick={handleStart}
              className="border-2 border-mh-accent-blue text-mh-accent-blue bg-transparent px-8 py-3 text-base font-mono cursor-pointer glow-text hover:bg-mh-accent-blue/10 active:bg-mh-accent-blue/20 transition-colors"
            >
              [ START TRADING ]
            </button>
          ) : (
            <div className="text-mh-text-dim text-xs opacity-50">
              Tap or press any key
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
