'use client'

import { useGame } from '@/hooks/useGame'
import { formatCompact } from '@/lib/utils/formatMoney'
import { useRef, useEffect, useState } from 'react'

function formatMoney(value: number): string {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
}

interface DebtRepaymentModalProps {
  onClose: () => void
}

export function DebtRepaymentModal({ onClose }: DebtRepaymentModalProps) {
  const { cash, creditCardDebt, setCreditCardDebt, borrowCreditCardDebt, getNetWorth } = useGame()
  const [mode, setMode] = useState<'repay' | 'borrow'>(creditCardDebt > 0 ? 'repay' : 'borrow')

  const sliderRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const amountDisplayRef = useRef<HTMLDivElement>(null)
  const remainingDebtRef = useRef<HTMLSpanElement>(null)
  const newInterestRef = useRef<HTMLSpanElement>(null)
  const isDragging = useRef(false)
  const currentAmount = useRef(0)
  const maxAmountRef = useRef(0)
  const creditCardDebtRef = useRef(0)
  const modeRef = useRef(mode)

  const netWorth = getNetWorth()
  const maxBorrowable = Math.max(0, netWorth - creditCardDebt)
  const maxRepay = Math.min(cash, creditCardDebt)
  const maxAmount = mode === 'repay' ? maxRepay : maxBorrowable
  maxAmountRef.current = maxAmount
  creditCardDebtRef.current = creditCardDebt
  modeRef.current = mode

  const updateDisplay = (amount: number) => {
    const percent = maxAmountRef.current > 0 ? (amount / maxAmountRef.current) * 100 : 0

    // Update slider visuals
    if (fillRef.current) fillRef.current.style.width = `${percent}%`
    if (thumbRef.current) thumbRef.current.style.left = `calc(${percent}% - 10px)`

    // Update amount display
    if (amountDisplayRef.current) {
      amountDisplayRef.current.textContent = formatMoney(amount)
    }

    // Update preview section
    const debt = creditCardDebtRef.current
    const newDebt = modeRef.current === 'repay' ? debt - amount : debt + amount
    const newInterest = newDebt * 0.0175

    if (remainingDebtRef.current) {
      remainingDebtRef.current.textContent = formatMoney(newDebt)
    }
    if (newInterestRef.current) {
      newInterestRef.current.textContent = formatMoney(newInterest)
    }
  }

  const getAmountFromPosition = (clientX: number) => {
    if (!sliderRef.current) return 0
    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))
    const max = maxAmountRef.current
    const rawAmount = percent * max
    // Scale rounding step based on max amount
    const step = max >= 10_000 ? 100 : max >= 1_000 ? 10 : max >= 1 ? 1 : 0.01
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

  // Reset slider when mode changes
  useEffect(() => {
    currentAmount.current = 0
    updateDisplay(0)
  }, [mode])

  const setMaxAmount = () => {
    currentAmount.current = maxAmountRef.current
    updateDisplay(maxAmountRef.current)
  }

  const handleConfirm = () => {
    const amount = currentAmount.current
    if (amount <= 0) return
    if (mode === 'repay') {
      const repayAmount = Math.min(amount, creditCardDebt)
      setCreditCardDebt(Math.max(0, creditCardDebt - repayAmount))
    } else {
      borrowCreditCardDebt(amount)
    }
    onClose()
  }

  const isRepay = mode === 'repay'
  const accentColor = isRepay ? 'mh-accent-blue' : 'mh-loss-red'

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-mh-bg border border-mh-border rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-mh-text-bright mb-1">Credit Card</h2>
            <div className="text-mh-text-dim text-sm">1.75% daily compound interest</div>
          </div>
          <button
            onClick={onClose}
            className="text-mh-text-dim hover:text-mh-text-bright text-2xl"
          >
            ×
          </button>
        </div>

        {/* Current Debt */}
        <div className="mb-4 p-4 bg-mh-border/20 rounded">
          <div className="text-xs text-mh-text-dim mb-1">CURRENT DEBT</div>
          <div className="text-2xl font-bold text-mh-loss-red">
            {formatMoney(creditCardDebt)}
          </div>
          <div className="text-xs text-mh-text-dim mt-2">
            Daily interest: <span className="text-mh-loss-red font-bold">{formatMoney(creditCardDebt * 0.0175)}</span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('repay')}
            className={`flex-1 py-2 rounded font-bold text-sm transition-all ${
              isRepay
                ? 'bg-mh-accent-blue text-white'
                : 'bg-mh-border text-mh-text-dim hover:bg-mh-border/80'
            }`}
          >
            REPAY
          </button>
          <button
            onClick={() => setMode('borrow')}
            className={`flex-1 py-2 rounded font-bold text-sm transition-all ${
              !isRepay
                ? 'bg-mh-loss-red text-white'
                : 'bg-mh-border text-mh-text-dim hover:bg-mh-border/80'
            }`}
          >
            BORROW
          </button>
        </div>

        {/* Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-mh-text-bright">
              {isRepay ? 'Repayment Amount' : 'Borrow Amount'}
            </label>
            <div className="text-sm text-mh-text-dim">
              {isRepay ? `Available: ${formatCompact(cash)}` : `Max: ${formatCompact(maxBorrowable)}`}
            </div>
          </div>

          {/* Custom Slider */}
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
              className={`absolute top-1/2 -translate-y-1/2 left-0 h-2 rounded-full ${
                isRepay ? 'bg-mh-accent-blue' : 'bg-mh-loss-red'
              }`}
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
              className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-mh-bg ${
                isRepay ? 'bg-mh-accent-blue' : 'bg-mh-loss-red'
              }`}
              style={{ left: 'calc(0% - 10px)' }}
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <div ref={amountDisplayRef} className="text-lg font-bold text-mh-text-bright">
              $0.00
            </div>
            <button
              onClick={setMaxAmount}
              className={`text-xs font-bold ${
                isRepay ? 'text-mh-accent-blue hover:text-mh-accent-blue/80' : 'text-mh-loss-red hover:text-mh-loss-red/80'
              }`}
            >
              MAX
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className={`mb-6 p-4 rounded border ${
          isRepay
            ? 'bg-mh-accent-blue/10 border-mh-accent-blue/30'
            : 'bg-mh-loss-red/10 border-mh-loss-red/30'
        }`}>
          <div className="text-xs text-mh-text-dim mb-2">
            {isRepay ? 'AFTER REPAYMENT' : 'AFTER BORROWING'}
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-mh-text-dim">
              {isRepay ? 'Remaining Debt:' : 'New Total Debt:'}
            </span>
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

        {/* Borrow warning */}
        {!isRepay && (
          <div className="text-xs text-mh-loss-red mb-4 text-center">
            Borrowed money accrues 1.75% daily compound interest
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-mh-border text-mh-text-bright font-bold rounded hover:brightness-110"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-3 font-bold rounded text-white hover:brightness-110 cursor-pointer ${
              isRepay ? 'bg-mh-accent-blue' : 'bg-mh-loss-red'
            }`}
          >
            {isRepay ? 'Repay' : 'Borrow'}
          </button>
        </div>
      </div>
    </div>
  )
}
