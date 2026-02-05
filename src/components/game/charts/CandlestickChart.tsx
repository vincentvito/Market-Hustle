'use client'

import type { DayCandle } from '@/lib/game/types'

interface CandlestickChartProps {
  candles: DayCandle[]
  width?: number
  height?: number
  isBloomberg?: boolean
  maxDays?: number
}

export function CandlestickChart({ candles, width = 320, height = 100, isBloomberg = false, maxDays = 30 }: CandlestickChartProps) {
  if (candles.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-mh-text-dim text-xs"
        style={{ width, height }}
      >
        No price data yet
      </div>
    )
  }

  // Calculate price range for scaling
  const allPrices = candles.flatMap(c => [c.high, c.low])
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  const priceRange = maxPrice - minPrice || 1 // Avoid division by zero
  const padding = priceRange * 0.1 // 10% padding
  const scaledMin = minPrice - padding
  const scaledMax = maxPrice + padding
  const scaledRange = scaledMax - scaledMin

  // Bloomberg terminal colors vs default (dark navy for authentic look)
  const bgColor = isBloomberg ? '#0a1628' : '#0a0d10'
  const gridColor = isBloomberg ? '#1a2a40' : '#1a2030'
  const labelColor = isBloomberg ? '#ffffff' : '#6b7280'

  // Chart dimensions
  const chartPadding = { top: 8, right: 8, bottom: 20, left: 40 }
  const chartWidth = width - chartPadding.left - chartPadding.right
  const chartHeight = height - chartPadding.top - chartPadding.bottom

  // Calculate candle width based on number of candles (scales to game duration)
  const maxCandles = maxDays
  const candleWidth = Math.max(4, Math.min(12, chartWidth / maxCandles - 2))
  const candleGap = 2

  // Scale price to Y coordinate (inverted - higher price = lower Y)
  const scaleY = (price: number) => {
    return chartPadding.top + chartHeight - ((price - scaledMin) / scaledRange) * chartHeight
  }

  // Scale day to X coordinate
  const scaleX = (day: number, index: number) => {
    return chartPadding.left + index * (candleWidth + candleGap) + candleWidth / 2
  }

  // Calculate overall trend for color
  const firstClose = candles[0]?.close ?? 0
  const lastClose = candles[candles.length - 1]?.close ?? 0
  const overallTrend = lastClose >= firstClose ? 'up' : 'down'

  // Format price for axis labels
  const formatAxisPrice = (p: number): string => {
    if (p >= 1_000_000) return `${(p / 1_000_000).toFixed(0)}M`
    if (p >= 1000) return `${(p / 1000).toFixed(0)}K`
    if (p >= 100) return p.toFixed(0)
    return p.toFixed(1)
  }

  // Generate Y-axis labels (3 labels: min, mid, max)
  const yLabels = [
    { price: scaledMax, y: chartPadding.top },
    { price: (scaledMax + scaledMin) / 2, y: chartPadding.top + chartHeight / 2 },
    { price: scaledMin, y: chartPadding.top + chartHeight },
  ]

  return (
    <svg
      width={width}
      height={height}
      className="select-none"
      style={{ overflow: 'visible' }}
    >
      {/* Background */}
      <rect
        x={chartPadding.left}
        y={chartPadding.top}
        width={chartWidth}
        height={chartHeight}
        fill={bgColor}
        rx={2}
      />

      {/* Y-axis line (Bloomberg only) */}
      {isBloomberg && (
        <line
          x1={chartPadding.left}
          y1={chartPadding.top}
          x2={chartPadding.left}
          y2={chartPadding.top + chartHeight}
          stroke="#ffffff"
          strokeWidth={1}
          opacity={0.5}
        />
      )}

      {/* Grid lines */}
      {yLabels.map((label, i) => (
        <line
          key={i}
          x1={chartPadding.left}
          y1={label.y}
          x2={chartPadding.left + chartWidth}
          y2={label.y}
          stroke={gridColor}
          strokeWidth={1}
          strokeDasharray="2,2"
        />
      ))}

      {/* Y-axis labels */}
      {yLabels.map((label, i) => (
        <text
          key={i}
          x={chartPadding.left - 4}
          y={label.y}
          fill={labelColor}
          fontSize={9}
          textAnchor="end"
          dominantBaseline="middle"
          fontFamily="monospace"
        >
          {formatAxisPrice(label.price)}
        </text>
      ))}

      {/* Chart data - Line chart for Bloomberg, Candlesticks for others */}
      {isBloomberg ? (
        // BLOOMBERG: White line with blue gradient fill below
        <>
          {/* Gradient definition */}
          <defs>
            <linearGradient id="bloombergFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e90ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e90ff" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* Area fill below line */}
          <polygon
            fill="url(#bloombergFill)"
            points={`${scaleX(candles[0].day, 0)},${chartPadding.top + chartHeight} ${candles.map((c, i) => `${scaleX(c.day, i)},${scaleY(c.close)}`).join(' ')} ${scaleX(candles[candles.length - 1].day, candles.length - 1)},${chartPadding.top + chartHeight}`}
          />
          {/* White line on top */}
          <polyline
            fill="none"
            stroke="#ffffff"
            strokeWidth={1.5}
            points={candles.map((c, i) => `${scaleX(c.day, i)},${scaleY(c.close)}`).join(' ')}
          />
        </>
      ) : (
        // CANDLESTICKS
        candles.map((candle, index) => {
          const x = scaleX(candle.day, index)
          const isUp = candle.close >= candle.open
          const color = isUp ? '#22c55e' : '#ef4444' // green for up, red for down

          const bodyTop = scaleY(Math.max(candle.open, candle.close))
          const bodyBottom = scaleY(Math.min(candle.open, candle.close))
          const bodyHeight = Math.max(1, bodyBottom - bodyTop)

          const wickTop = scaleY(candle.high)
          const wickBottom = scaleY(candle.low)

          return (
            <g key={candle.day}>
              {/* Wick (high-low line) */}
              <line
                x1={x}
                y1={wickTop}
                x2={x}
                y2={wickBottom}
                stroke={color}
                strokeWidth={1}
              />
              {/* Body (open-close rectangle) */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={color}
                stroke={color}
                strokeWidth={1}
              />
            </g>
          )
        })
      )}

      {/* X-axis labels (show every 5 days) */}
      {candles
        .filter((_, i) => i === 0 || (candles[i].day % 5 === 0) || i === candles.length - 1)
        .map((candle, _, arr) => {
          const index = candles.findIndex(c => c.day === candle.day)
          const x = scaleX(candle.day, index)
          // Skip if too close to another label
          const prevLabelIndex = arr.findIndex((c, j) => j < arr.indexOf(candle) && Math.abs(candles.findIndex(cc => cc.day === c.day) - index) < 3)
          if (prevLabelIndex !== -1 && candle.day !== 1 && candle.day !== candles[candles.length - 1].day) return null

          return (
            <text
              key={candle.day}
              x={x}
              y={height - 4}
              fill={labelColor}
              fontSize={9}
              textAnchor="middle"
              fontFamily="monospace"
            >
              {candle.day}
            </text>
          )
        })}

      {/* Trend indicator line (first close to last close) - hide for Bloomberg since line chart already shows this */}
      {!isBloomberg && candles.length >= 2 && (
        <line
          x1={scaleX(candles[0].day, 0)}
          y1={scaleY(candles[0].close)}
          x2={scaleX(candles[candles.length - 1].day, candles.length - 1)}
          y2={scaleY(candles[candles.length - 1].close)}
          stroke={overallTrend === 'up' ? '#22c55e' : '#ef4444'}
          strokeWidth={1}
          strokeDasharray="4,2"
          opacity={0.5}
        />
      )}
    </svg>
  )
}
