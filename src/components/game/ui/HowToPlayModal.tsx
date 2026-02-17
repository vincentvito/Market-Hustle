'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useGame } from '@/hooks/useGame'

const TUTORIAL_KEY = 'mh-tutorial-seen'

export function markTutorialSeen() {
  try { localStorage.setItem(TUTORIAL_KEY, '1') } catch {}
}

export function isTutorialSeen(): boolean {
  try { return localStorage.getItem(TUTORIAL_KEY) === '1' } catch { return true }
}

// =============================================================================
// TEXT-BASED HOW TO PLAY MODAL (for ? button)
// =============================================================================

export function HowToPlayModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-mh-bg border border-mh-border max-w-sm w-full p-6 text-left font-mono"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-mh-text-bright text-lg font-bold mb-4 text-center glow-text">
          HOW TO PLAY
        </div>

        <ol className="text-mh-text-main text-sm space-y-3 list-decimal list-inside">
          <li><span className="text-mh-text-dim">Start with cash</span> — Buy and sell stocks, crypto, and commodities to grow wealth</li>
          <li><span className="text-mh-text-dim">Read the news</span> — Headlines move markets. Buy before good news, sell before bad</li>
          <li><span className="text-mh-text-dim">Advance days</span> — Each day updates prices, triggers events, and pays rental income</li>
          <li><span className="text-mh-text-dim">Buy real assets</span> — Properties generate passive income; Private Equity unlocks special abilities</li>
          <li><span className="text-mh-text-dim">Invest in startups</span> — High-risk deals can 10x your money or go to zero</li>
          <li><span className="text-mh-text-dim">Use PE abilities</span> — Lobbying and destabilization schemes manipulate markets (20% backfire risk)</li>
          <li><span className="text-mh-text-dim">Maximize net worth</span> — Total assets minus debts. Build an empire before time runs out</li>
        </ol>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-transparent border-2 border-mh-accent-blue text-mh-accent-blue
            py-3 text-sm font-mono cursor-pointer glow-text
            hover:bg-mh-accent-blue/10 transition-colors"
        >
          [ GOT IT ]
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// INTERACTIVE TUTORIAL (for first game only)
// =============================================================================

interface TutorialStep {
  targetId: string
  title: string
  description: string
  position: 'top' | 'bottom' | 'left' | 'right'
  interactive?: boolean
  waitForAction?: 'trade'
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    targetId: 'tutorial-day-counter',
    title: 'Day Counter',
    description: 'You have 30 days to grow your wealth. Each "Next Day" advances time.',
    position: 'bottom',
  },
  {
    targetId: 'tutorial-cash',
    title: 'Your Cash',
    description: 'Spending power. You start with $100,000 to invest.',
    position: 'bottom',
  },
  {
    targetId: 'tutorial-net-worth',
    title: 'Net Worth',
    description: 'Cash + assets. Hit zero and you\'re bankrupt. Game over.',
    position: 'bottom',
  },
  {
    targetId: 'tutorial-news',
    title: 'News Feed',
    description: 'Headlines move markets. Green = opportunity. Red = danger.',
    position: 'bottom',
  },
  {
    targetId: 'tutorial-price-section',
    title: 'Price Movement',
    description: 'Green ↑ = price up. Red ↓ = price down. Buy low, sell high.',
    position: 'bottom',
  },
  {
    targetId: 'tutorial-next-day',
    title: 'Next Day',
    description: 'Ready? This advances the game. No going back. Good luck.',
    position: 'top',
  },
]

interface TooltipPosition {
  top: number
  left: number
  arrowPosition: 'top' | 'bottom' | 'left' | 'right'
}

function calculateTooltipPosition(
  targetRect: DOMRect,
  position: 'top' | 'bottom' | 'left' | 'right',
  tooltipWidth: number,
  tooltipHeight: number
): TooltipPosition {
  const padding = 12
  const arrowSize = 8

  let top = 0
  let left = 0

  switch (position) {
    case 'top':
      top = targetRect.top - tooltipHeight - arrowSize - padding
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2
      break
    case 'bottom':
      top = targetRect.bottom + arrowSize + padding
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2
      break
    case 'left':
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2
      left = targetRect.left - tooltipWidth - arrowSize - padding
      break
    case 'right':
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2
      left = targetRect.right + arrowSize + padding
      break
  }

  // Clamp to viewport
  const viewportPadding = 16
  left = Math.max(viewportPadding, Math.min(left, window.innerWidth - tooltipWidth - viewportPadding))
  top = Math.max(viewportPadding, Math.min(top, window.innerHeight - tooltipHeight - viewportPadding))

  return { top, left, arrowPosition: position }
}

export function InteractiveTutorial({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null)
  const [waitingForTradeClose, setWaitingForTradeClose] = useState(false)

  // Get game state to detect when user makes a trade
  const selectedAsset = useGame(state => state.selectedAsset)
  const holdings = useGame(state => state.holdings)
  const initialHoldingsRef = useRef<Record<string, number>>({})

  const step = TUTORIAL_STEPS[currentStep]
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1
  const isInteractiveStep = step?.interactive === true
  const isWaitingForTrade = step?.waitForAction === 'trade'

  // Track when user opens the trade sheet during interactive step
  useEffect(() => {
    if (isWaitingForTrade && selectedAsset) {
      // User opened trade sheet, save current holdings
      initialHoldingsRef.current = { ...holdings }
      setWaitingForTradeClose(true)
    }
  }, [isWaitingForTrade, selectedAsset, holdings])

  // Detect when trade sheet closes after user interacted
  useEffect(() => {
    if (waitingForTradeClose && !selectedAsset) {
      // Trade sheet closed - check if they bought something
      const didBuy = Object.keys(holdings).some(
        key => (holdings[key] || 0) > (initialHoldingsRef.current[key] || 0)
      )

      if (didBuy) {
        // They made a purchase! Advance to next step
        setWaitingForTradeClose(false)
        setCurrentStep(prev => prev + 1)
      } else {
        // They closed without buying, keep waiting
        setWaitingForTradeClose(false)
      }
    }
  }, [waitingForTradeClose, selectedAsset, holdings])

  const updatePosition = useCallback(() => {
    if (!step) return

    // Find visible element (handles duplicate IDs from responsive mobile/desktop grids)
    let target: HTMLElement | null = null
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(`[id="${step.targetId}"]`))
    for (let i = 0; i < candidates.length; i++) {
      const r = candidates[i].getBoundingClientRect()
      if (r.width > 0 && r.height > 0) {
        target = candidates[i]
        break
      }
    }
    if (!target) target = document.getElementById(step.targetId)
    if (target) {
      const rect = target.getBoundingClientRect()
      setTargetRect(rect)

      // Estimate tooltip size (will be refined)
      const tooltipWidth = 280
      const tooltipHeight = 140
      const pos = calculateTooltipPosition(rect, step.position, tooltipWidth, tooltipHeight)
      setTooltipPos(pos)
    }
  }, [step])

  useEffect(() => {
    updatePosition()

    // Update on resize/scroll
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    // Also update periodically for dynamic content
    const interval = setInterval(updatePosition, 100)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      clearInterval(interval)
    }
  }, [updatePosition])

  const handleNext = () => {
    // Don't allow manual advance during trade step if waiting
    if (isWaitingForTrade && !waitingForTradeClose) {
      return
    }

    if (isLastStep) {
      markTutorialSeen()
      onClose()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    markTutorialSeen()
    onClose()
  }

  // Don't render overlay while trade sheet is open during interactive step
  if (waitingForTradeClose && selectedAsset) {
    return null
  }

  if (!targetRect || !tooltipPos) {
    return null
  }

  // Get finger pointer emoji based on tooltip position relative to element
  const getFingerEmoji = () => {
    if (isInteractiveStep) {
      return '👆' // Tapping finger for interactive step
    }
    // Point finger towards the highlighted element based on tooltip position
    switch (step.position) {
      case 'bottom': return '👆' // Tooltip below element, point up
      case 'top': return '👇'    // Tooltip above element, point down
      case 'right': return '👈'  // Tooltip right of element, point left
      case 'left': return '👉'   // Tooltip left of element, point right
      default: return '👆'
    }
  }

  const fingerEmoji = getFingerEmoji()

  // Calculate clamped highlight bounds to stay within viewport
  const highlightPadding = 4
  const highlightLeft = Math.max(0, targetRect.left - highlightPadding)
  const highlightTop = Math.max(0, targetRect.top - highlightPadding)
  const highlightWidth = targetRect.width + highlightPadding * 2 - Math.max(0, highlightPadding - targetRect.left)
  const highlightHeight = targetRect.height + highlightPadding * 2 - Math.max(0, highlightPadding - targetRect.top)

  return (
    <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: isInteractiveStep ? 'none' : 'auto' }}>
      {/* Dark overlay with cutout for target element */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="tutorial-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={highlightLeft}
              y={highlightTop}
              width={highlightWidth}
              height={highlightHeight}
              rx="4"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.85)"
          mask="url(#tutorial-mask)"
        />
      </svg>

      {/* Highlight border around target */}
      <div
        className="absolute rounded"
        style={{
          top: highlightTop,
          left: highlightLeft,
          width: highlightWidth,
          height: highlightHeight,
          border: '2px solid rgba(126, 184, 218, 0.5)',
          boxShadow: '0 0 15px rgba(126, 184, 218, 0.2), 0 0 30px rgba(126, 184, 218, 0.1)',
          pointerEvents: 'none',
        }}
      />

      {/* Tooltip */}
      <div
        className="absolute bg-[#1a2634] border border-mh-border p-4 rounded-lg max-w-[280px] font-mono"
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          pointerEvents: 'auto',
        }}
      >
        {/* Last step: special layout with description first, then emoji + title + button */}
        {isLastStep ? (
          <>
            {/* Description first */}
            <div className="text-mh-text-main text-sm leading-relaxed mb-4">
              {step.description}
            </div>
            {/* Emoji + Title + Start Trading button on same line */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {fingerEmoji}
                </span>
                <span className="text-mh-accent-blue font-bold text-sm glow-text">
                  {step.title}
                </span>
              </div>
              <button
                onClick={handleNext}
                className="py-2 px-4 text-xs bg-mh-accent-blue/20 text-mh-accent-blue border border-mh-accent-blue rounded hover:bg-mh-accent-blue/30 transition-colors"
              >
                Start Trading
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Finger + Title + Step indicator on same line */}
            {step.title === 'Net Worth' ? (
              <div className="flex items-center justify-between mb-2">
                <span className="text-mh-text-dim text-xs">
                  {currentStep + 1} / {TUTORIAL_STEPS.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-mh-accent-blue font-bold text-sm glow-text">
                    {step.title}
                  </span>
                  <span className={`text-xl ${isInteractiveStep ? 'tutorial-finger-tap' : ''}`}>
                    {fingerEmoji}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xl ${isInteractiveStep ? 'tutorial-finger-tap' : ''}`}>
                    {fingerEmoji}
                  </span>
                  <span className="text-mh-accent-blue font-bold text-sm glow-text">
                    {step.title}
                  </span>
                </div>
                <span className="text-mh-text-dim text-xs">
                  {currentStep + 1} / {TUTORIAL_STEPS.length}
                </span>
              </div>
            )}

            {/* Description */}
            <div className="text-mh-text-main text-sm leading-relaxed mb-4">
              {step.description}
            </div>

            {/* Interactive step hint */}
            {isInteractiveStep && (
              <div className="text-mh-profit-green text-xs mb-3">
                Click on an asset and buy some shares
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSkip}
                className="flex-1 py-2 text-xs text-mh-text-dim hover:text-mh-text-main transition-colors"
              >
                Skip Tutorial
              </button>
              {!isInteractiveStep && (
                <button
                  onClick={handleNext}
                  className="flex-1 py-2 text-xs bg-mh-accent-blue/20 text-mh-accent-blue border border-mh-accent-blue rounded hover:bg-mh-accent-blue/30 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Click anywhere to advance (except on tooltip) - only for non-interactive steps */}
      {!isInteractiveStep && (
        <div
          className="absolute inset-0"
          onClick={handleNext}
          style={{ zIndex: -1 }}
        />
      )}
    </div>
  )
}
