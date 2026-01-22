'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useGame } from '@/hooks/useGame'
import type { Asset } from '@/lib/game/types'

interface TradeSheetProps {
  asset: Asset | null | undefined
  isOpen: boolean
  onClose: () => void
}

function formatPrice(p: number): string {
  if (p >= 1000) return `${(p / 1000).toFixed(1)}K`
  if (p >= 100) return p.toFixed(0)
  if (p >= 10) return p.toFixed(1)
  return p.toFixed(2)
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

// Reusable slider hook for direct DOM manipulation
function useSlider(maxValue: number, initialValue: number = 1) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const qtyRef = useRef<HTMLSpanElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  const isDragging = useRef(false)
  const currentQty = useRef(initialValue)
  const maxRef = useRef(maxValue)
  maxRef.current = maxValue

  const updateVisuals = useCallback((qty: number) => {
    const max = maxRef.current
    const percent = max > 1 ? ((qty - 1) / (max - 1)) * 100 : 0

    if (thumbRef.current) thumbRef.current.style.left = `calc(${percent}% - 14px)`
    if (fillRef.current) fillRef.current.style.width = `${percent}%`
    if (qtyRef.current) qtyRef.current.textContent = String(qty)
  }, [])

  const getQtyFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return 1
    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))
    const qty = Math.round(1 + percent * (maxRef.current - 1))
    return Math.max(1, Math.min(maxRef.current, qty))
  }, [])

  const handleStart = useCallback((clientX: number) => {
    isDragging.current = true
    const qty = getQtyFromPosition(clientX)
    currentQty.current = qty
    updateVisuals(qty)
  }, [getQtyFromPosition, updateVisuals])

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current) return
    const qty = getQtyFromPosition(clientX)
    if (qty !== currentQty.current) {
      currentQty.current = qty
      updateVisuals(qty)
    }
  }, [getQtyFromPosition, updateVisuals])

  const handleEnd = useCallback(() => {
    isDragging.current = false
  }, [])

  const setQty = useCallback((qty: number) => {
    currentQty.current = qty
    updateVisuals(qty)
  }, [updateVisuals])

  const getQty = useCallback(() => currentQty.current, [])

  return {
    sliderRef, thumbRef, fillRef, qtyRef, valueRef,
    handleStart, handleMove, handleEnd,
    setQty, getQty, updateVisuals, currentQty
  }
}

export function TradeSheet({ asset, isOpen, onClose }: TradeSheetProps) {
  const { prices, holdings, cash, buy, sell, getPriceChange } = useGame()

  const price = asset ? prices[asset.id] || 0 : 0
  const owned = asset ? holdings[asset.id] || 0 : 0
  const change = asset ? getPriceChange(asset.id) : 0
  const maxBuy = Math.max(1, Math.floor(cash / price))
  const maxSell = Math.max(1, owned)

  // Separate sliders for buy and sell
  const buySlider = useSlider(maxBuy, 1)
  const sellSlider = useSlider(maxSell, 1)

  // Cost display refs
  const buyCostRef = useRef<HTMLSpanElement>(null)
  const sellCostRef = useRef<HTMLSpanElement>(null)

  // Update cost displays
  const updateBuyCost = useCallback((qty: number) => {
    if (buyCostRef.current) {
      buyCostRef.current.textContent = formatCost(qty * price)
    }
  }, [price])

  const updateSellCost = useCallback((qty: number) => {
    if (sellCostRef.current) {
      sellCostRef.current.textContent = formatCost(qty * price)
    }
  }, [price])

  // Document-level listeners for drag - ONLY when sheet is open
  useEffect(() => {
    if (!isOpen) return

    const onMouseMove = (e: MouseEvent) => {
      buySlider.handleMove(e.clientX)
      sellSlider.handleMove(e.clientX)
      updateBuyCost(buySlider.currentQty.current)
      updateSellCost(sellSlider.currentQty.current)
    }
    const onMouseUp = () => {
      buySlider.handleEnd()
      sellSlider.handleEnd()
    }
    const onTouchEnd = () => {
      buySlider.handleEnd()
      sellSlider.handleEnd()
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchend', onTouchEnd)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [isOpen, buySlider, sellSlider, updateBuyCost, updateSellCost])

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      buySlider.setQty(1)
      sellSlider.setQty(1)
      updateBuyCost(1)
      updateSellCost(1)
    }
  }, [isOpen, buySlider, sellSlider, updateBuyCost, updateSellCost])

  const handleBuy = () => {
    if (asset && cash >= price) {
      buy(asset.id, buySlider.currentQty.current)
      onClose()
    }
  }

  const handleSell = () => {
    if (asset && owned >= 1) {
      sell(asset.id, sellSlider.currentQty.current)
      onClose()
    }
  }

  const canBuy = cash >= price
  const canSell = owned >= 1

  if (!isOpen || !asset) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1117] border-t border-mh-border rounded-t-xl animate-slide-up md:left-1/2 md:-translate-x-1/2 md:w-[400px]"
        style={{ touchAction: 'none' }}
      >
        {/* Header with close button */}
        <div className="flex items-center px-4 py-3 border-b border-mh-border gap-3">
          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-mh-text-dim hover:text-mh-text-main transition-colors"
            aria-label="Close"
          >
            <span className="text-xl">▼</span>
          </button>

          {/* Asset info */}
          <div className="flex-1">
            <div className="text-lg font-bold text-mh-text-bright">{asset.name}</div>
            {owned > 0 && (
              <div className="text-xs text-mh-accent-blue">
                OWN: {owned} (${formatPrice(owned * price)})
              </div>
            )}
          </div>

          {/* Price info */}
          <div className="text-right">
            <div className="text-xl font-bold text-mh-text-main">${formatPrice(price)}</div>
            <div
              className={`text-sm font-bold ${
                change > 0
                  ? 'text-mh-profit-green'
                  : change < 0
                    ? 'text-mh-loss-red'
                    : 'text-mh-text-dim'
              }`}
            >
              {change > 0 ? '▲' : change < 0 ? '▼' : '•'} {change > 0 ? '+' : ''}
              {change.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* BUY Section */}
        <div className={`px-4 py-3 border-b border-mh-border ${canBuy ? 'bg-[#0a1510]' : 'bg-[#0d1117] opacity-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-mh-profit-green">BUY</span>
            <span className="text-xs text-mh-text-dim">
              MAX: {canBuy ? maxBuy : 0}
            </span>
          </div>

          {/* Buy Slider Track */}
          <div
            ref={buySlider.sliderRef}
            className={`relative h-10 touch-none select-none ${canBuy ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            style={{ touchAction: 'none' }}
            onMouseDown={canBuy ? (e) => { e.preventDefault(); buySlider.handleStart(e.clientX); updateBuyCost(buySlider.currentQty.current) } : undefined}
            onTouchStart={canBuy ? (e) => { e.preventDefault(); buySlider.handleStart(e.touches[0].clientX); updateBuyCost(buySlider.currentQty.current) } : undefined}
            onTouchMove={canBuy ? (e) => { e.preventDefault(); buySlider.handleMove(e.touches[0].clientX); updateBuyCost(buySlider.currentQty.current) } : undefined}
            onTouchEnd={canBuy ? buySlider.handleEnd : undefined}
          >
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-[#1a2a3a] rounded-full" />
            <div
              ref={buySlider.fillRef}
              className="absolute top-1/2 -translate-y-1/2 left-0 h-2 bg-mh-profit-green rounded-full"
              style={{ width: '0%' }}
            />
            {[25, 50, 75].map(pct => (
              <div key={pct} className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-[#2a3a4a]" style={{ left: `${pct}%` }} />
            ))}
            <div
              ref={buySlider.thumbRef}
              className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-mh-profit-green rounded-full shadow-lg border-2 border-mh-bg"
              style={{ left: '-14px' }}
            />
          </div>

          {/* Buy Labels + Button */}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => { buySlider.setQty(1); updateBuyCost(1) }}
              disabled={!canBuy}
              className="text-xs text-mh-text-dim hover:text-mh-profit-green cursor-pointer bg-transparent border-none p-1"
            >
              1
            </button>
            <div className="flex items-center gap-3">
              <span className="text-mh-text-bright font-bold">
                <span ref={buySlider.qtyRef}>1</span> × ${formatPrice(price)} = <span ref={buyCostRef} className="text-mh-profit-green">{formatCost(price)}</span>
              </span>
            </div>
            <button
              onClick={() => { buySlider.setQty(maxBuy); updateBuyCost(maxBuy) }}
              disabled={!canBuy}
              className="text-xs text-mh-profit-green hover:text-mh-profit-green/80 cursor-pointer bg-transparent border-none p-1 font-bold"
            >
              MAX
            </button>
          </div>

          <button
            onClick={handleBuy}
            disabled={!canBuy}
            className={`w-full mt-3 py-3 rounded text-base font-bold font-mono transition-colors ${
              canBuy
                ? 'bg-mh-profit-green/20 text-mh-profit-green cursor-pointer hover:bg-mh-profit-green/30 border border-mh-profit-green/50'
                : 'bg-[#111920] text-mh-border cursor-default border border-mh-border/30'
            }`}
          >
            BUY
          </button>
        </div>

        {/* SELL Section */}
        <div className={`px-4 py-3 ${canSell ? 'bg-[#150a0a]' : 'bg-[#0d1117] opacity-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-mh-loss-red">SELL</span>
            <span className="text-xs text-mh-text-dim">
              OWN: {owned}
            </span>
          </div>

          {/* Sell Slider Track */}
          <div
            ref={sellSlider.sliderRef}
            className={`relative h-10 touch-none select-none ${canSell ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            style={{ touchAction: 'none' }}
            onMouseDown={canSell ? (e) => { e.preventDefault(); sellSlider.handleStart(e.clientX); updateSellCost(sellSlider.currentQty.current) } : undefined}
            onTouchStart={canSell ? (e) => { e.preventDefault(); sellSlider.handleStart(e.touches[0].clientX); updateSellCost(sellSlider.currentQty.current) } : undefined}
            onTouchMove={canSell ? (e) => { e.preventDefault(); sellSlider.handleMove(e.touches[0].clientX); updateSellCost(sellSlider.currentQty.current) } : undefined}
            onTouchEnd={canSell ? sellSlider.handleEnd : undefined}
          >
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-[#1a2a3a] rounded-full" />
            <div
              ref={sellSlider.fillRef}
              className="absolute top-1/2 -translate-y-1/2 left-0 h-2 bg-mh-loss-red rounded-full"
              style={{ width: '0%' }}
            />
            {[25, 50, 75].map(pct => (
              <div key={pct} className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-[#2a3a4a]" style={{ left: `${pct}%` }} />
            ))}
            <div
              ref={sellSlider.thumbRef}
              className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-mh-loss-red rounded-full shadow-lg border-2 border-mh-bg"
              style={{ left: '-14px' }}
            />
          </div>

          {/* Sell Labels + Button */}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => { sellSlider.setQty(1); updateSellCost(1) }}
              disabled={!canSell}
              className="text-xs text-mh-text-dim hover:text-mh-loss-red cursor-pointer bg-transparent border-none p-1"
            >
              1
            </button>
            <div className="flex items-center gap-3">
              <span className="text-mh-text-bright font-bold">
                <span ref={sellSlider.qtyRef}>1</span> × ${formatPrice(price)} = <span ref={sellCostRef} className="text-mh-loss-red">{formatCost(price)}</span>
              </span>
            </div>
            <button
              onClick={() => { sellSlider.setQty(maxSell); updateSellCost(maxSell) }}
              disabled={!canSell}
              className="text-xs text-mh-loss-red hover:text-mh-loss-red/80 cursor-pointer bg-transparent border-none p-1 font-bold"
            >
              ALL
            </button>
          </div>

          <button
            onClick={handleSell}
            disabled={!canSell}
            className={`w-full mt-3 py-3 rounded text-base font-bold font-mono transition-colors ${
              canSell
                ? 'bg-mh-loss-red/20 text-mh-loss-red cursor-pointer hover:bg-mh-loss-red/30 border border-mh-loss-red/50'
                : 'bg-[#111920] text-mh-border cursor-default border border-mh-border/30'
            }`}
          >
            SELL
          </button>
        </div>
      </div>
    </>
  )
}
