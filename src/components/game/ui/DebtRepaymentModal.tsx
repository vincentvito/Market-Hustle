'use client'

import { useGame } from '@/hooks/useGame'
import { formatCompact } from '@/lib/utils/formatMoney'
import { useRef, useEffect } from 'react'

// Format money with full precision for debt amounts
function formatMoney(value: number): string {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
}

interface DebtRepaymentModalProps {
  onClose: () => void
}

export function DebtRepaymentModal({ onClose }: DebtRepaymentModalProps) {
  const { cash, creditCardDebt, setCreditCardDebt } = useGame()

  const sliderRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const amountDisplayRef = useRef<HTMLDivElement>(null)
  const remainingDebtRef = useRef<HTMLSpanElement>(null)
  const newInterestRef = useRef<HTMLSpanElement>(null)
  const isDragging = useRef(false)
  const currentAmount = useRef(0)
  const maxRepayRef = useRef(0)
  const creditCardDebtRef = useRef(0)

  const maxRepay = Math.min(cash, creditCardDebt)
  maxRepayRef.current = maxRepay
  creditCardDebtRef.current = creditCardDebt

  // Update all displays (slider + text)
  const updateDisplay = (amount: number) => {
    const percent = maxRepayRef.current > 0 ? (amount / maxRepayRef.current) * 100 : 0

    // Update slider visuals
    if (fillRef.current) fillRef.current.style.width = `${percent}%`
    if (thumbRef.current) thumbRef.current.style.left = `calc(${percent}% - 10px)`

    // Update amount display
    if (amountDisplayRef.current) {
      amountDisplayRef.current.textContent = formatMoney(amount)
    }

    // Update preview section
    const remainingDebt = creditCardDebtRef.current - amount
    const newInterest = remainingDebt * 0.0175

    if (remainingDebtRef.current) {
      remainingDebtRef.current.textContent = formatMoney(remainingDebt)
    }
    if (newInterestRef.current) {
      newInterestRef.current.textContent = formatMoney(newInterest)
    }
  }

  // Get amount from mouse/touch position
  const getAmountFromPosition = (clientX: number) => {
    if (!sliderRef.current) return 0
    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))
    const max = maxRepayRef.current
    const rawAmount = percent * max
    // Scale rounding step based on max amount
    const step = max >= 10_000 ? 100 : max >= 1_000 ? 10 : 1
    const rounded = Math.round(rawAmount / step) * step
    return Math.min(rounded, max)
  }

  const handleStart = (clientX: number) => {
    isDragging.current = true
    const amount = getAmountFromPosition(clientX)
    currentAmount.current = amount
    updateDisplay(amount)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging.current) return
    const amount = getAmountFromPosition(clientX)
    if (amount !== currentAmount.current) {
      currentAmount.current = amount
      updateDisplay(amount)
    }
  }

  const handleEnd = () => {
    isDragging.current = false
  }

  // Attach window event listeners for mouse drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const handleMouseUp = () => handleEnd()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Set MAX amount
  const setMaxAmount = () => {
    currentAmount.current = maxRepayRef.current
    updateDisplay(maxRepayRef.current)
  }

  const handleRepay = () => {
    const amount = currentAmount.current
    if (amount <= 0) return
    // Clamp to actual debt to avoid negative remaining
    const repayAmount = Math.min(amount, creditCardDebt)
    setCreditCardDebt(Math.max(0, creditCardDebt - repayAmount))
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-mh-bg border border-mh-border rounded-lg p-6 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-mh-text-bright mb-1">💳 Credit Card Debt</h2>
            <div className="text-mh-text-dim text-sm">1.75% daily interest</div>
          </div>
          <button
            onClick={onClose}
            className="text-mh-text-dim hover:text-mh-text-bright text-2xl"
          >
            ×
          </button>
        </div>

        {/* Current Debt */}
        <div className="mb-6 p-4 bg-mh-border/20 rounded">
          <div className="text-xs text-mh-text-dim mb-1">CURRENT DEBT</div>
          <div className="text-2xl font-bold text-mh-loss-red">
            {formatMoney(creditCardDebt)}
          </div>
          <div className="text-xs text-mh-text-dim mt-2">
            Daily interest: <span className="text-mh-loss-red font-bold">{formatMoney(creditCardDebt * 0.0175)}</span>
          </div>
        </div>

        {/* Repayment Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-mh-text-bright">Repayment Amount</label>
            <div className="text-sm text-mh-text-dim">
              Available: {formatCompact(cash)}
            </div>
          </div>

          {/* Custom Slider (same as TradeSheet) */}
          <div
            ref={sliderRef}
            className="relative h-8 cursor-pointer touch-none select-none"
            style={{ touchAction: 'none' }}
            onMouseDown={(e) => { e.preventDefault(); handleStart(e.clientX) }}
            onTouchStart={(e) => { e.preventDefault(); handleStart(e.touches[0].clientX) }}
            onTouchMove={(e) => { e.preventDefault(); handleMove(e.touches[0].clientX) }}
            onTouchEnd={handleEnd}
          >
            {/* Background track */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-[#1a2a3a] rounded-full" />

            {/* Fill bar */}
            <div
              ref={fillRef}
              className="absolute top-1/2 -translate-y-1/2 left-0 h-2 bg-mh-accent-blue rounded-full"
              style={{ width: '0%' }}
            />

            {/* Tick marks */}
            {[25, 50, 75].map(pct => (
              <div
                key={pct}
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-[#2a3a4a]"
                style={{ left: `${pct}%` }}
              />
            ))}

            {/* Thumb */}
            <div
              ref={thumbRef}
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-mh-accent-blue rounded-full border-2 border-mh-bg"
              style={{ left: 'calc(0% - 10px)' }}
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <div ref={amountDisplayRef} className="text-lg font-bold text-mh-text-bright">
              $0.00
            </div>
            <button
              onClick={setMaxAmount}
              className="text-xs text-mh-accent-blue hover:text-mh-accent-blue/80 font-bold"
            >
              MAX
            </button>
          </div>
        </div>

        {/* After Repayment Preview */}
        <div className="mb-6 p-4 bg-mh-accent-blue/10 rounded border border-mh-accent-blue/30">
          <div className="text-xs text-mh-text-dim mb-2">AFTER REPAYMENT</div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-mh-text-dim">Remaining Debt:</span>
            <span ref={remainingDebtRef} className="text-sm font-bold text-mh-loss-red">
              {formatMoney(creditCardDebt)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-mh-text-dim">New Daily Interest:</span>
            <span ref={newInterestRef} className="text-sm font-bold text-mh-loss-red">
              {formatMoney(creditCardDebt * 0.0175)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-mh-border text-mh-text-bright font-bold rounded hover:brightness-110"
          >
            Cancel
          </button>
          <button
            onClick={handleRepay}
            className="flex-1 py-3 font-bold rounded bg-mh-accent-blue text-white hover:brightness-110 cursor-pointer"
          >
            Repay
          </button>
        </div>
      </div>
    </div>
  )
}
