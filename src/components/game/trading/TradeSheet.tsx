'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { useUserDetails } from '@/hooks/useUserDetails'
import { CandlestickChart } from '@/components/game/charts/CandlestickChart'
import type { Asset, LeverageLevel } from '@/lib/game/types'

interface TradeSheetProps {
  asset: Asset | null | undefined
  isOpen: boolean
  onClose: () => void
}

function formatPrice(p: number): string {
  if (p >= 1_000_000) return `${(p / 1_000_000).toFixed(1)}M`
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
function useSlider(maxValue: number, initialValue: number = 1, minValue: number = 1, step: number = 1) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const qtyRef = useRef<HTMLSpanElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  const isDragging = useRef(false)
  const currentQty = useRef(initialValue)
  const maxRef = useRef(maxValue)
  const minRef = useRef(minValue)
  const stepRef = useRef(step)
  maxRef.current = maxValue
  minRef.current = minValue
  stepRef.current = step

  const updateVisuals = useCallback((qty: number) => {
    const max = maxRef.current
    const min = minRef.current
    const range = max - min
    const percent = range > 0 ? ((qty - min) / range) * 100 : 0

    if (thumbRef.current) thumbRef.current.style.left = `calc(${percent}% - 10px)`
    if (fillRef.current) fillRef.current.style.width = `${percent}%`
    if (qtyRef.current) {
      // Format fractional values nicely
      const displayQty = stepRef.current < 1 ? qty.toFixed(3).replace(/\.?0+$/, '') : String(qty)
      qtyRef.current.textContent = displayQty
    }
  }, [])

  const getQtyFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return minRef.current
    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))
    const min = minRef.current
    const max = maxRef.current
    const step = stepRef.current

    // Calculate raw value
    const rawQty = min + percent * (max - min)
    // Round to step
    const qty = Math.round(rawQty / step) * step
    // Clamp to range
    return Math.max(min, Math.min(max, Math.round(qty * 1000) / 1000))
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

  const setMax = useCallback((newMax: number) => {
    maxRef.current = newMax
  }, [])

  const setMin = useCallback((newMin: number) => {
    minRef.current = newMin
  }, [])

  const setStep = useCallback((newStep: number) => {
    stepRef.current = newStep
  }, [])

  return {
    sliderRef, thumbRef, fillRef, qtyRef, valueRef,
    handleStart, handleMove, handleEnd,
    setQty, getQty, updateVisuals, currentQty, setMax, setMin, setStep
  }
}

export function TradeSheet({ asset, isOpen, onClose }: TradeSheetProps) {
  const {
    prices, holdings, cash, buy, sell, getPriceChange, priceHistory,
    shortPositions, leveragedPositions, shortSell, coverShort, buyWithLeverage, closeLeveragedPosition,
    selectedTheme,
  } = useGame()
  const { isPro } = useUserDetails()

  // Theme detection
  const isModern3 = selectedTheme === 'modern3'
  const isRetro2 = selectedTheme === 'retro2'
  const isBloomberg = selectedTheme === 'bloomberg'
  const [leverage, setLeverage] = useState<LeverageLevel>(1)
  const [isShortMode, setIsShortMode] = useState(false)

  const price = asset ? prices[asset.id] || 0 : 0
  const owned = asset ? holdings[asset.id] || 0 : 0
  const change = asset ? getPriceChange(asset.id) : 0

  // Fractional asset configuration (only BTC for now)
  const FRACTIONAL_ASSETS: Record<string, { minQuantity: number; step: number; maxSlider: number }> = {
    btc: { minQuantity: 0, step: 0.001, maxSlider: 2 },
  }
  const isFractional = asset ? asset.id in FRACTIONAL_ASSETS : false
  const fractionalConfig = asset ? FRACTIONAL_ASSETS[asset.id] : null

  // With leverage, you can buy more (but need downPayment = totalCost / leverage)
  const effectiveLeverage = isPro && leverage > 1 ? leverage : 1
  const maxBuyRaw = isFractional && fractionalConfig
    ? Math.min(fractionalConfig.maxSlider, Math.round((cash * effectiveLeverage / price) * 1000) / 1000)
    : Math.max(1, Math.floor((cash * effectiveLeverage) / price))
  const maxBuy = isFractional ? maxBuyRaw : Math.max(1, maxBuyRaw)
  // Short mode: cash-based limit (what you could cover at current price)
  // Regular mode: what you own
  const maxShort = Math.max(1, Math.floor(cash / price))
  const maxSell = isShortMode && isPro ? maxShort : Math.max(1, owned)

  // Slider config based on asset type
  const sliderMin = isFractional ? 0 : 1
  const sliderStep = fractionalConfig?.step || 1

  // Separate sliders for buy and sell
  const buySlider = useSlider(maxBuy, sliderMin, sliderMin, sliderStep)
  const sellSlider = useSlider(maxSell, sliderMin, sliderMin, sliderStep)

  // Cost display refs
  const buyCostRef = useRef<HTMLSpanElement>(null)
  const buyDownPaymentRef = useRef<HTMLSpanElement>(null)
  const sellCostRef = useRef<HTMLSpanElement>(null)

  // Update cost displays - shows TOTAL position value, with separate down payment
  const updateBuyCost = useCallback((qty: number) => {
    const totalCost = qty * price
    if (buyCostRef.current) {
      buyCostRef.current.textContent = formatCost(totalCost)
    }
    if (buyDownPaymentRef.current) {
      const downPayment = totalCost / effectiveLeverage
      buyDownPaymentRef.current.textContent = formatCost(downPayment)
    }
  }, [price, effectiveLeverage])

  const updateSellCost = useCallback((qty: number) => {
    if (sellCostRef.current) {
      sellCostRef.current.textContent = formatCost(qty * price)
    }
  }, [price])

  // Store slider refs to avoid dependency issues
  const buySliderRef = useRef(buySlider)
  const sellSliderRef = useRef(sellSlider)
  const updateBuyCostRef = useRef(updateBuyCost)
  const sliderMinRef = useRef(sliderMin)
  sliderMinRef.current = sliderMin
  const updateSellCostRef = useRef(updateSellCost)
  buySliderRef.current = buySlider
  sellSliderRef.current = sellSlider
  updateBuyCostRef.current = updateBuyCost
  updateSellCostRef.current = updateSellCost

  // Document-level listeners for drag - ONLY when sheet is open
  useEffect(() => {
    if (!isOpen) return

    const onMouseMove = (e: MouseEvent) => {
      buySliderRef.current.handleMove(e.clientX)
      sellSliderRef.current.handleMove(e.clientX)
      updateBuyCostRef.current(buySliderRef.current.currentQty.current)
      updateSellCostRef.current(sellSliderRef.current.currentQty.current)
    }
    const onMouseUp = () => {
      buySliderRef.current.handleEnd()
      sellSliderRef.current.handleEnd()
    }
    const onTouchEnd = () => {
      buySliderRef.current.handleEnd()
      sellSliderRef.current.handleEnd()
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchend', onTouchEnd)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [isOpen])

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      const min = sliderMinRef.current
      buySliderRef.current.setQty(min)
      sellSliderRef.current.setQty(min)
      updateBuyCostRef.current(min)
      updateSellCostRef.current(min)
      // Reset Pro tier options
      setLeverage(1)
      setIsShortMode(false)
    }
  }, [isOpen])

  // Reset sell slider when switching short mode
  useEffect(() => {
    const min = sliderMinRef.current
    sellSliderRef.current.setQty(min)
    updateSellCostRef.current(min)
  }, [isShortMode])

  // Reset buy slider when leverage changes (max buying power changed)
  useEffect(() => {
    const min = sliderMinRef.current
    // IMPORTANT: Update max FIRST, before resetting qty/visuals
    buySliderRef.current.setMax(maxBuy)
    buySliderRef.current.setQty(min)
    buySliderRef.current.updateVisuals(min)
    // Update cost displays: total position value + down payment
    if (buyCostRef.current) {
      buyCostRef.current.textContent = formatCost(min * price)
    }
    if (buyDownPaymentRef.current) {
      buyDownPaymentRef.current.textContent = formatCost((min * price) / effectiveLeverage)
    }
  }, [leverage, maxBuy, price, effectiveLeverage])

  const handleBuy = () => {
    if (!asset) return
    const qty = buySlider.currentQty.current
    if (qty <= 0) return // Don't allow buying 0 units
    const totalCost = qty * price
    const downPayment = totalCost / effectiveLeverage

    if (downPayment > cash) return

    if (leverage > 1 && isPro) {
      buyWithLeverage(asset.id, qty, leverage)
    } else {
      buy(asset.id, qty)
    }
    onClose()
  }

  const handleSell = () => {
    if (!asset) return
    const qty = sellSlider.currentQty.current
    if (qty <= 0) return // Don't allow selling 0 units
    if (isShortMode && isPro) {
      // Short sell - no ownership required
      shortSell(asset.id, qty)
      onClose()
    } else if (owned > 0) {
      sell(asset.id, qty)
      onClose()
    }
  }

  // canBuy: need enough for down payment (leverage considered)
  const downPaymentNeeded = price / effectiveLeverage
  const canBuy = cash >= downPaymentNeeded
  // canSell: short mode = always can (Pro), regular = need holdings (any amount for fractional)
  const canSell = isShortMode && isPro ? true : owned > 0

  if (!isOpen || !asset) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 z-40 md:fixed"
        onClick={onClose}
      />

      {/* Sheet - bottom sheet on mobile, centered modal on desktop */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-50 animate-slide-up overflow-y-auto
          md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-[480px] md:max-h-[80vh] md:rounded-xl md:animate-none
          ${isBloomberg
            ? 'bg-black border-t-2 border-[#ff8c00] rounded-none md:border-2 md:border-[#ff8c00]'
            : isModern3
              ? 'bg-[#0f1419] rounded-t-xl md:border md:border-[#1a2230]'
              : 'bg-[#0d1117] border-t border-mh-border rounded-t-xl md:border md:border-mh-border'
        }`}
        style={{
          maxHeight: 'calc(100% - 60px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          ...(isModern3 ? {
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 212, 170, 0.15)'
          } : isRetro2 ? {
            boxShadow: '0 -2px 15px rgba(0, 255, 136, 0.2)'
          } : {})
        }}
      >
        {/* Header with close button */}
        <div
          className={`flex items-center px-4 py-3 gap-3 ${
            isBloomberg ? 'border-b border-[#333333]' : isModern3 ? '' : 'border-b border-mh-border'
          }`}
          style={isModern3 ? {
            borderBottom: '1px solid rgba(0, 212, 170, 0.2)',
            background: 'linear-gradient(180deg, rgba(0,212,170,0.05) 0%, transparent 100%)'
          } : undefined}
        >
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

        {/* Price Chart */}
        {asset && priceHistory[asset.id] && priceHistory[asset.id].length > 0 && (
          <div className={`px-4 py-2 ${
            isBloomberg ? 'border-b border-[#333333] bg-[#0a1628]' : 'border-b border-mh-border bg-[#080a0d]'
          }`}>
            <div className={`text-xs mb-1 ${isBloomberg ? 'text-white font-bold' : 'text-mh-text-dim'}`}>PRICE HISTORY</div>
            <div className="flex justify-center">
              <CandlestickChart
                candles={priceHistory[asset.id]}
                width={360}
                height={100}
                isBloomberg={isBloomberg}
              />
            </div>
          </div>
        )}

        {/* BUY Section */}
        <div className={`px-4 py-3 ${
          isBloomberg ? 'border-b border-[#333333]' : isModern3 ? '' : 'border-b border-mh-border'
        } ${canBuy
          ? isBloomberg ? 'bg-[#001a00]' : isModern3 ? 'bg-[#0a1a15]' : 'bg-[#0a1510]'
          : isBloomberg ? 'bg-black opacity-50' : isModern3 ? 'bg-[#0f1419] opacity-50' : 'bg-[#0d1117] opacity-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-mh-profit-green">BUY</span>
            <span className="text-xs text-mh-text-dim">
              MAX: {canBuy ? maxBuy : 0}
            </span>
          </div>

          {/* Leverage selector - Pro only */}
          {isPro && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs text-mh-text-dim mr-1">MARGIN:</span>
              {([2, 5, 10] as LeverageLevel[]).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setLeverage(leverage === lvl ? 1 : lvl)}
                  className={`px-2 py-1 text-xs font-bold rounded transition-colors ${
                    leverage === lvl
                      ? 'bg-mh-accent-blue text-mh-bg'
                      : 'bg-[#1a2a3a] text-mh-text-dim hover:text-mh-text-bright'
                  }`}
                >
                  {lvl}x
                </button>
              ))}
              {leverage > 1 && (
                <span className="text-xs text-mh-accent-blue ml-2">
                  DEBT: {formatCost((buySlider.currentQty.current * price) * (1 - 1/leverage))}
                </span>
              )}
            </div>
          )}

          {/* Buy Slider Track - wrapped with padding to keep fingers away from screen edges */}
          <div className="px-6">
            <div
              ref={buySlider.sliderRef}
              className={`relative h-8 touch-none select-none ${canBuy ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-mh-profit-green rounded-full border-2 border-mh-bg"
                style={{
                  left: '-10px',
                  boxShadow: isModern3
                    ? '0 0 10px rgba(0, 212, 170, 0.6), 0 2px 4px rgba(0,0,0,0.3)'
                    : isRetro2
                      ? '0 0 8px rgba(0, 255, 136, 0.5)'
                      : '0 2px 4px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </div>

          {/* Buy Labels + Button */}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => { buySlider.setQty(sliderMin); updateBuyCost(sliderMin) }}
              disabled={!canBuy}
              className="text-xs text-mh-text-dim hover:text-mh-profit-green cursor-pointer bg-transparent border-none p-1"
            >
              {sliderMin}
            </button>
            <div className="flex items-center gap-1">
              <span className="text-mh-text-bright font-bold">
                <span ref={buySlider.qtyRef}>{sliderMin}</span> × ${formatPrice(price)} = <span ref={buyCostRef} className="text-mh-profit-green">{formatCost(sliderMin * price)}</span>
              </span>
              {leverage > 1 && (
                <span className="text-xs text-mh-text-dim">(↓<span ref={buyDownPaymentRef}>{formatCost(price / leverage)}</span>)</span>
              )}
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
                ? isBloomberg
                  ? 'cursor-pointer hover:brightness-110 border'
                  : 'bg-mh-profit-green/20 text-mh-profit-green cursor-pointer hover:bg-mh-profit-green/30 border border-mh-profit-green/50'
                : 'bg-[#111920] text-mh-border cursor-default border border-mh-border/30'
            }`}
            style={canBuy && isBloomberg ? {
              backgroundColor: '#003300',
              borderColor: '#00cc00',
              color: '#00cc00'
            } : canBuy && isModern3 ? {
              boxShadow: '0 0 15px rgba(0, 212, 170, 0.3)'
            } : canBuy && isRetro2 ? {
              boxShadow: '0 0 12px rgba(0, 255, 136, 0.25)'
            } : undefined}
          >
            BUY
          </button>
        </div>

        {/* SELL Section */}
        <div className={`px-4 py-3 ${canSell
          ? isBloomberg ? 'bg-[#1a0000]' : isModern3 ? 'bg-[#1a0a12]' : 'bg-[#150a0a]'
          : isBloomberg ? 'bg-black opacity-50' : isModern3 ? 'bg-[#0f1419] opacity-50' : 'bg-[#0d1117] opacity-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-mh-loss-red">SELL</span>

            {/* Short toggle - Pro only */}
            {isPro && (
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setIsShortMode(false)}
                  className={`px-2 py-1 rounded transition-colors ${
                    !isShortMode
                      ? 'bg-mh-loss-red/30 text-mh-loss-red'
                      : 'text-mh-text-dim hover:text-mh-text-bright'
                  }`}
                >
                  REGULAR
                </button>
                <button
                  onClick={() => setIsShortMode(true)}
                  className={`px-2 py-1 rounded transition-colors ${
                    isShortMode
                      ? 'bg-yellow-500/30 text-yellow-500'
                      : 'text-mh-text-dim hover:text-mh-text-bright'
                  }`}
                >
                  SHORT
                </button>
              </div>
            )}

            <span className="text-xs text-mh-text-dim">
              {isShortMode ? `MAX: ${maxShort}` : `OWN: ${owned}`}
            </span>
          </div>

          {/* Sell Slider Track - wrapped with padding to keep fingers away from screen edges */}
          <div className="px-6">
            <div
              ref={sellSlider.sliderRef}
              className={`relative h-8 touch-none select-none ${canSell ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-mh-loss-red rounded-full border-2 border-mh-bg"
                style={{
                  left: '-10px',
                  boxShadow: isModern3
                    ? '0 0 10px rgba(255, 71, 87, 0.6), 0 2px 4px rgba(0,0,0,0.3)'
                    : '0 2px 4px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </div>

          {/* Sell Labels + Button */}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => { sellSlider.setQty(sliderMin); updateSellCost(sliderMin) }}
              disabled={!canSell}
              className="text-xs text-mh-text-dim hover:text-mh-loss-red cursor-pointer bg-transparent border-none p-1"
            >
              {sliderMin}
            </button>
            <div className="flex items-center gap-3">
              <span className="text-mh-text-bright font-bold">
                <span ref={sellSlider.qtyRef}>{sliderMin}</span> × ${formatPrice(price)} = <span ref={sellCostRef} className="text-mh-loss-red">{formatCost(sliderMin * price)}</span>
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
                ? isBloomberg
                  ? 'cursor-pointer hover:brightness-110 border'
                  : 'bg-mh-loss-red/20 text-mh-loss-red cursor-pointer hover:bg-mh-loss-red/30 border border-mh-loss-red/50'
                : 'bg-[#111920] text-mh-border cursor-default border border-mh-border/30'
            }`}
            style={canSell && isBloomberg ? {
              backgroundColor: '#330000',
              borderColor: '#ff3333',
              color: '#ff3333'
            } : canSell && isModern3 ? {
              boxShadow: '0 0 15px rgba(255, 71, 87, 0.3)'
            } : undefined}
          >
            {isShortMode ? 'SHORT' : 'SELL'}
          </button>
        </div>

        {/* Open Leveraged Positions - Pro only */}
        {isPro && asset && leveragedPositions.filter(p => p.assetId === asset.id).length > 0 && (
          <div className="px-4 py-3 border-t border-mh-border bg-[#0a1520]">
            <div className="text-xs font-bold text-mh-accent-blue mb-2">LEVERAGED POSITIONS</div>
            {leveragedPositions
              .filter(pos => pos.assetId === asset.id)
              .map(pos => {
                const currentValue = pos.qty * price
                const equity = currentValue - pos.debtAmount
                const originalEquity = pos.qty * pos.entryPrice / pos.leverage
                const pl = equity - originalEquity
                const plPct = originalEquity > 0 ? (pl / originalEquity) * 100 : 0
                const isUnderwater = equity < 0
                return (
                  <div key={pos.id} className="flex items-center justify-between text-sm mb-1">
                    <span className="text-mh-text-dim">
                      {pos.leverage}x: {pos.qty} @ ${formatPrice(pos.entryPrice)}
                    </span>
                    <span className={isUnderwater ? 'text-mh-loss-red animate-pulse' : pl >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'}>
                      {pl >= 0 ? '+' : ''}{plPct.toFixed(1)}%
                    </span>
                    <button
                      onClick={() => closeLeveragedPosition(pos.id)}
                      className={`px-2 py-1 text-xs rounded ${
                        isUnderwater
                          ? 'bg-mh-loss-red/20 text-mh-loss-red'
                          : 'bg-mh-accent-blue/20 text-mh-accent-blue'
                      }`}
                    >
                      CLOSE
                    </button>
                  </div>
                )
              })}
          </div>
        )}

        {/* Open Short Positions - Pro only */}
        {isPro && asset && shortPositions.filter(p => p.assetId === asset.id).length > 0 && (
          <div className="px-4 py-3 border-t border-mh-border bg-[#151008]">
            <div className="text-xs font-bold text-yellow-500 mb-2">OPEN SHORTS</div>
            {shortPositions
              .filter(pos => pos.assetId === asset.id)
              .map(pos => {
                const currentValue = pos.qty * price
                const pl = pos.cashReceived - currentValue
                const plPct = pos.cashReceived > 0 ? (pl / pos.cashReceived) * 100 : 0
                return (
                  <div key={pos.id} className="flex items-center justify-between text-sm mb-1">
                    <span className="text-mh-text-dim">
                      {pos.qty} @ ${formatPrice(pos.entryPrice)}
                    </span>
                    <span className={pl >= 0 ? 'text-mh-profit-green' : 'text-mh-loss-red'}>
                      {pl >= 0 ? '+' : ''}{plPct.toFixed(1)}%
                    </span>
                    <button
                      onClick={() => coverShort(pos.id)}
                      className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-500 rounded"
                    >
                      COVER
                    </button>
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </>
  )
}
