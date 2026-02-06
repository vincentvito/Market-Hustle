/**
 * Centralized money formatting utilities for Market Hustle
 */

/**
 * Format money with K/M/B suffixes for compact display
 * Used for cash, portfolio values, etc.
 * Examples: $3.2B, $150.5M, $500K, $999
 */
export function formatCompact(value: number): string {
  // Normalize -0 to 0
  if (Object.is(value, -0) || value === 0) return '$0'
  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  if (absValue >= 1_000_000_000) {
    return `${sign}$${(absValue / 1_000_000_000).toFixed(1)}B`
  }
  if (absValue >= 1_000_000) {
    return `${sign}$${(absValue / 1_000_000).toFixed(1)}M`
  }
  if (absValue >= 1_000) {
    return `${sign}$${(absValue / 1_000).toFixed(0)}K`
  }
  return `${sign}$${Math.round(absValue).toLocaleString('en-US')}`
}

/**
 * Format money with full number (for Net Worth display)
 * Returns both the formatted string and recommended text size class
 */
export function formatNetWorth(value: number): { text: string; sizeClass: string } {
  // Normalize -0 to 0
  const v = Object.is(value, -0) ? 0 : value
  const text = `$${v.toLocaleString('en-US')}`
  const digits = Math.abs(value).toString().length

  // Dynamic sizing based on digit count
  if (digits >= 13) return { text, sizeClass: 'text-lg' }      // Trillions
  if (digits >= 10) return { text, sizeClass: 'text-xl' }      // Billions
  if (digits >= 7) return { text, sizeClass: 'text-2xl' }      // Millions
  return { text, sizeClass: 'text-3xl' }                       // Default
}

/**
 * Format price with K/M suffix (no $ prefix) for asset prices
 * Examples: 3.2M, 150.5K, 999.99
 */
export function formatPrice(p: number): string {
  if (p >= 1_000_000) return `${(p / 1_000_000).toFixed(1)}M`
  if (p >= 1000) return `${(p / 1000).toFixed(1)}K`
  if (p >= 100) return p.toFixed(0)
  if (p >= 10) return p.toFixed(1)
  return p.toFixed(2)
}

/**
 * Format large price with $ prefix
 * Examples: $3.2B, $150.5M, $500K, $999
 */
export function formatLargePrice(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}
