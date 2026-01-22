'use client'

import { useCallback, useRef, useEffect, useState } from 'react'
import { useGame } from '@/hooks/useGame'

interface TradePanelProps {
  assetId: string
  price: number
}

function formatCost(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}

export function TradePanel({ assetId, price }: TradePanelProps) {
  const { buyQty, setBuyQty, holdings, cash, buy, sell } = useGame()
  const owned = holdings[assetId] || 0
  const maxBuy = Math.max(1, Math.floor(cash / price))
  const sliderRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  // Track continuous slider position (0-100%) for smooth visual feedback
  const [sliderPercent, setSliderPercent] = useState(() =>
    maxBuy > 1 ? ((buyQty - 1) / (maxBuy - 1)) * 100 : 0
  )

  // Sync slider position when buyQty changes externally (e.g., clicking 1 or MAX)
  useEffect(() => {
    if (!isDragging.current) {
      setSliderPercent(maxBuy > 1 ? ((buyQty - 1) / (maxBuy - 1)) * 100 : 0)
    }
  }, [buyQty, maxBuy])

  // Calculate quantity from slider percentage
  const getQtyFromPercent = useCallback((percent: number) => {
    const qty = Math.round(1 + (percent / 100) * (maxBuy - 1))
    return Math.max(1, Math.min(maxBuy, qty))
  }, [maxBuy])

  // Calculate percentage from position
  const getPercentFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return 0
    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    return Math.max(0, Math.min(100, (x / rect.width) * 100))
  }, [])

  // Mouse/touch handlers - update visual position smoothly, snap qty on release
  const handleStart = useCallback((clientX: number) => {
    isDragging.current = true
    const percent = getPercentFromPosition(clientX)
    setSliderPercent(percent)
    setBuyQty(getQtyFromPercent(percent))
  }, [getPercentFromPosition, getQtyFromPercent, setBuyQty])

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current) return
    const percent = getPercentFromPosition(clientX)
    setSliderPercent(percent)
    setBuyQty(getQtyFromPercent(percent))
  }, [getPercentFromPosition, getQtyFromPercent, setBuyQty])

  const handleEnd = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false
      // Snap to exact quantity position on release
      setSliderPercent(maxBuy > 1 ? ((buyQty - 1) / (maxBuy - 1)) * 100 : 0)
    }
  }, [buyQty, maxBuy])

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    handleStart(e.touches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    handleMove(e.touches[0].clientX)
  }

  // Add persistent listeners for drag
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const onMouseUp = () => handleEnd()

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [handleMove, handleEnd])

  const cost = buyQty * price
  const canBuy = cash >= price
  const canSell = owned >= 1
  const sellQty = Math.min(buyQty, owned)

  return (
    <div className="border-b border-mh-border bg-[#111920] px-4 py-3" style={{ touchAction: 'none' }}>
      {/* Slider */}
      <div className="mb-3">
        {/* Slider Track */}
        <div
          ref={sliderRef}
          className="relative h-8 cursor-pointer touch-none"
          style={{ touchAction: 'none' }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={handleEnd}
        >
          {/* Track background */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-[#1a2a3a] rounded-full" />

          {/* Track fill */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 h-2 bg-mh-accent-blue rounded-full transition-[width] duration-75"
            style={{ width: `${sliderPercent}%` }}
          />

          {/* Snap point markers at 25%, 50%, 75% - only show when there are enough steps */}
          {maxBuy >= 5 && [25, 50, 75].map(pct => (
            <div
              key={pct}
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-[#2a3a4a]"
              style={{ left: `${pct}%` }}
            />
          ))}

          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-mh-accent-blue rounded-full shadow-lg border-2 border-mh-bg transition-[left] duration-75"
            style={{ left: `calc(${sliderPercent}% - 12px)` }}
          />
        </div>

        {/* Labels row */}
        <div className="flex justify-between items-center mt-1">
          <button
            onClick={() => setBuyQty(1)}
            className="text-xs text-mh-text-dim hover:text-mh-accent-blue cursor-pointer bg-transparent border-none p-1"
          >
            1
          </button>
          <div className="text-center">
            <span className="text-mh-text-bright font-bold text-lg">
              QTY: {buyQty}
            </span>
            <span className="text-mh-text-dim text-sm ml-2">
              → {formatCost(cost)}
            </span>
          </div>
          <button
            onClick={() => setBuyQty(maxBuy)}
            className="text-xs text-mh-profit-green hover:text-mh-profit-green/80 cursor-pointer bg-transparent border-none p-1 font-bold"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Buy/Sell Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => canSell && sell(assetId, sellQty)}
          disabled={!canSell}
          className={`flex-1 py-3 rounded text-base font-bold font-mono transition-colors ${
            canSell
              ? 'bg-[#200a0a] text-mh-loss-red cursor-pointer hover:bg-[#2a0d0d] border border-mh-loss-red/30'
              : 'bg-[#111920] text-mh-border cursor-default border border-mh-border/30'
          }`}
        >
          SELL {canSell ? sellQty : 0}
        </button>
        <button
          onClick={() => canBuy && buy(assetId, buyQty)}
          disabled={!canBuy}
          className={`flex-1 py-3 rounded text-base font-bold font-mono transition-colors ${
            canBuy
              ? 'bg-[#0a2015] text-mh-profit-green cursor-pointer hover:bg-[#0d2a1a] border border-mh-profit-green/30'
              : 'bg-[#111920] text-mh-border cursor-default border border-mh-border/30'
          }`}
        >
          BUY {buyQty}
        </button>
      </div>
    </div>
  )
}
