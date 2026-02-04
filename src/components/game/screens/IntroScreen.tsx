'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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

const INTRO_LINES = [
  { text: 'Your uncle left you two things: $100,000 and a note that said "make it worth it."', highlight: '$100,000' },
  { text: 'You could give it to charity. Or you could trade. Cheat. Lobby. Blow up a pipeline while you\'re long the crude.', highlight: null },
  { text: 'The SEC is watching, but they\'re underfunded and you\'re fast.', highlight: null },
  { text: '30 days to build an empire or burn it all down trying.', highlight: null },
]

const CHAR_DELAY = 25 // milliseconds per character

export function IntroScreen() {
  const startGame = useGame(state => state.startGame)
  const [showCharityMessage, setShowCharityMessage] = useState(false)

  // Typewriter state
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isTypewriting, setIsTypewriting] = useState(true)
  const [completedLines, setCompletedLines] = useState<number[]>([])
  const typewriterRef = useRef<NodeJS.Timeout | null>(null)

  // Typewriter animation effect
  useEffect(() => {
    if (!isTypewriting) return

    if (lineIndex >= INTRO_LINES.length) {
      setIsTypewriting(false)
      return
    }

    const currentLine = INTRO_LINES[lineIndex].text

    if (charIndex >= currentLine.length) {
      // Current line complete, move to next after a pause
      typewriterRef.current = setTimeout(() => {
        setCompletedLines(prev => [...prev, lineIndex])
        setLineIndex(prev => prev + 1)
        setCharIndex(0)
      }, 300) // 300ms pause between lines
      return
    }

    // Type next character
    typewriterRef.current = setTimeout(() => {
      setCharIndex(prev => prev + 1)
    }, CHAR_DELAY)

    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current)
      }
    }
  }, [isTypewriting, lineIndex, charIndex])

  // Skip typewriter animation
  const skipTypewriter = useCallback(() => {
    if (isTypewriting) {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current)
      }
      setCompletedLines(INTRO_LINES.map((_, i) => i))
      setLineIndex(INTRO_LINES.length)
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

  const showButtons = !isTypewriting

  // Render a line with optional highlighting
  const renderLine = (line: typeof INTRO_LINES[0], displayText: string, showCursor: boolean) => {
    if (!line.highlight) {
      return (
        <>
          {displayText}
          {showCursor && <span className="animate-pulse text-mh-accent-blue">▌</span>}
        </>
      )
    }

    // Handle highlighting for $100,000
    const highlightIndex = line.text.indexOf(line.highlight)
    const beforeHighlight = displayText.slice(0, Math.min(displayText.length, highlightIndex))
    const highlightPart = displayText.slice(highlightIndex, Math.min(displayText.length, highlightIndex + line.highlight.length))
    const afterHighlight = displayText.slice(highlightIndex + line.highlight.length)

    return (
      <>
        {beforeHighlight}
        {highlightPart && <span className="text-mh-profit-green font-bold">{highlightPart}</span>}
        {afterHighlight}
        {showCursor && <span className="animate-pulse text-mh-accent-blue">▌</span>}
      </>
    )
  }

  if (showCharityMessage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-mh-bg">
        <div className="max-w-lg text-center space-y-8">
          <div className="text-mh-text-dim text-lg italic">
            &ldquo;Noble. Boring, but noble.&rdquo;
          </div>

          <div className="text-mh-text-dim text-sm">
            — Your Uncle
          </div>

          <button
            onClick={() => {
              markIntroSeen()
              startGame()
            }}
            className="border-2 border-mh-accent-blue text-mh-accent-blue bg-transparent px-8 py-3 text-base font-mono cursor-pointer glow-text hover:bg-mh-accent-blue/10 active:bg-mh-accent-blue/20 transition-colors"
          >
            [ FINE, I&apos;LL PLAY ]
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-4 bg-mh-bg cursor-pointer"
      onClick={isTypewriting ? skipTypewriter : undefined}
    >
      <div className="max-w-lg text-center space-y-6">
        <div className="text-mh-text-main text-lg leading-relaxed space-y-4 min-h-[200px]">
          {INTRO_LINES.map((line, idx) => {
            // Determine what to display for this line
            let displayText = ''
            let showCursor = false
            let isVisible = false

            if (completedLines.includes(idx)) {
              // Fully revealed
              displayText = line.text
              isVisible = true
            } else if (idx === lineIndex) {
              // Currently typing
              displayText = line.text.slice(0, charIndex)
              showCursor = true
              isVisible = true
            }
            // Lines not yet started are not visible

            if (!isVisible) return null

            // Style based on line index
            const isFirstLine = idx === 0
            const isLastLine = idx === INTRO_LINES.length - 1

            return (
              <p
                key={idx}
                className={
                  isFirstLine
                    ? 'text-mh-text-main'
                    : isLastLine
                      ? 'text-mh-accent-blue font-bold'
                      : 'text-mh-text-dim'
                }
              >
                {renderLine(line, displayText, showCursor)}
              </p>
            )
          })}
        </div>

        {showButtons && (
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            style={{ animation: 'fadeIn 0.3s ease-out' }}
          >
            <button
              onClick={() => setShowCharityMessage(true)}
              className="border-2 border-mh-border text-mh-text-dim bg-transparent px-6 py-3 text-base font-mono cursor-pointer hover:border-mh-text-dim hover:text-mh-text-main transition-colors"
            >
              [ GIVE IT TO CHARITY ]
            </button>

            <button
              onClick={() => {
                markIntroSeen()
                startGame()
              }}
              className="border-2 border-mh-accent-blue text-mh-accent-blue bg-transparent px-6 py-3 text-base font-mono cursor-pointer glow-text hover:bg-mh-accent-blue/10 active:bg-mh-accent-blue/20 transition-colors"
            >
              [ LET&apos;S GO ]
            </button>
          </div>
        )}

        {isTypewriting && (
          <div className="text-mh-text-dim text-xs opacity-50 pt-4">
            Click or press any key to skip
          </div>
        )}
      </div>
    </div>
  )
}
