'use client'

import { useGame } from '@/hooks/useGame'
import { formatCompact } from '@/lib/utils/formatMoney'
import { useRef, useEffect, useState } from 'react'

function formatMoney(value: number): string {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
}

interface OffshoreTrustModalProps {
  onClose: () => void
}

export function OffshoreTrustModal({ onClose }: OffshoreTrustModalProps) {
  const { cash, trustFundBalance, depositToTrust, withdrawFromTrust } = useGame()
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')

  const sliderRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const amountDisplayRef = useRef<HTMLDivElement>(null)
  const newTrustRef = useRef<HTMLSpanElement>(null)
  const newCashRef = useRef<HTMLSpanElement>(null)
  const isDragging = useRef(false)
  const currentAmount = useRef(0)
  const maxAmountRef = useRef(0)

  const maxAmount = mode === 'deposit' ? cash : trustFundBalance
  maxAmountRef.current = maxAmount

  const updateDisplay = (amount: number) => {
    const percent = maxAmountRef.current > 0 ? (amount / maxAmountRef.current) * 100 : 0

    if (fillRef.current) fillRef.current.style.width = `${percent}%`
    if (thumbRef.current) thumbRef.current.style.left = `calc(${percent}% - 10px)`

    if (amountDisplayRef.current) {
      amountDisplayRef.current.textContent = formatMoney(amount)
    }

    if (mode === 'deposit') {
      if (newTrustRef.current) newTrustRef.current.textContent = formatMoney(trustFundBalance + amount)
      if (newCashRef.current) newCashRef.current.textContent = formatMoney(cash - amount)
    } else {
      if (newTrustRef.current) newTrustRef.current.textContent = formatMoney(trustFundBalance - amount)
      if (newCashRef.current) newCashRef.current.textContent = formatMoney(cash + amount)
    }
  }

  const getAmountFromPosition = (clientX: number) => {
    if (!sliderRef.current) return 0
    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))
    const rawAmount = percent * maxAmountRef.current
    return Math.round(rawAmount / 100) * 100
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

  useEffect(() => {
    currentAmount.current = 0
    updateDisplay(0)
  }, [mode])

  const setMaxAmount = () => {
    const max = Math.round(maxAmountRef.current / 100) * 100
    currentAmount.current = max
    updateDisplay(max)
  }

  const handleConfirm = () => {
    const amount = currentAmount.current
    if (amount <= 0) return
    if (mode === 'deposit') {
      depositToTrust(amount)
    } else {
      withdrawFromTrust(amount)
    }
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
            <h2 className="text-xl font-bold text-mh-text-bright mb-1">🏦 Offshore Trust</h2>
            <div className="text-mh-text-dim text-sm">Shelter assets from penalties</div>
          </div>
          <button
            onClick={onClose}
            className="text-mh-text-dim hover:text-mh-text-bright text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Current Balances */}
        <div className="mb-4 p-4 bg-mh-border/20 rounded">
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="text-xs text-mh-text-dim">TRUST BALANCE</div>
              <div className="text-xl font-bold text-mh-accent-blue">
                {formatMoney(trustFundBalance)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-mh-text-dim">CASH</div>
              <div className="text-xl font-bold text-mh-text-bright">
                {formatMoney(cash)}
              </div>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('deposit')}
            className={`flex-1 py-2 rounded font-bold text-sm transition-all ${
              mode === 'deposit'
                ? 'bg-mh-accent-blue text-white'
                : 'bg-mh-border text-mh-text-dim hover:bg-mh-border/80'
            }`}
          >
            DEPOSIT
          </button>
          <button
            onClick={() => setMode('withdraw')}
            className={`flex-1 py-2 rounded font-bold text-sm transition-all ${
              mode === 'withdraw'
                ? 'bg-mh-accent-blue text-white'
                : 'bg-mh-border text-mh-text-dim hover:bg-mh-border/80'
            }`}
          >
            WITHDRAW
          </button>
        </div>

        {/* Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-mh-text-bright">
              {mode === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'}
            </label>
            <div className="text-sm text-mh-text-dim">
              Max: {formatCompact(maxAmount)}
            </div>
          </div>

          <div
            ref={sliderRef}
            className="relative h-8 cursor-pointer touch-none select-none"
            style={{ touchAction: 'none' }}
            onMouseDown={(e) => { e.preventDefault(); handleStart(e.clientX) }}
            onTouchStart={(e) => { e.preventDefault(); handleStart(e.touches[0].clientX) }}
            onTouchMove={(e) => { e.preventDefault(); handleMove(e.touches[0].clientX) }}
            onTouchEnd={handleEnd}
          >
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-[#1a2a3a] rounded-full" />
            <div
              ref={fillRef}
              className="absolute top-1/2 -translate-y-1/2 left-0 h-2 bg-mh-accent-blue rounded-full"
              style={{ width: '0%' }}
            />
            {[25, 50, 75].map(pct => (
              <div
                key={pct}
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-[#2a3a4a]"
                style={{ left: `${pct}%` }}
              />
            ))}
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

        {/* After Transfer Preview */}
        <div className="mb-6 p-4 bg-mh-accent-blue/10 rounded border border-mh-accent-blue/30">
          <div className="text-xs text-mh-text-dim mb-2">AFTER TRANSFER</div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-mh-text-dim">Trust Balance:</span>
            <span ref={newTrustRef} className="text-sm font-bold text-mh-accent-blue">
              {formatMoney(trustFundBalance)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-mh-text-dim">Cash:</span>
            <span ref={newCashRef} className="text-sm font-bold text-mh-text-bright">
              {formatMoney(cash)}
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
            onClick={handleConfirm}
            className="flex-1 py-3 font-bold rounded bg-mh-accent-blue text-white hover:brightness-110 cursor-pointer"
          >
            {mode === 'deposit' ? 'Deposit' : 'Withdraw'}
          </button>
        </div>
      </div>
    </div>
  )
}
