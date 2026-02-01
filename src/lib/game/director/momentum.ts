// Player Momentum Calculator
// Determines player's emotional state based on financial performance

import type { PlayerMomentum } from './types'

// =============================================================================
// MOMENTUM THRESHOLDS
// =============================================================================

/** Thresholds for momentum classification */
const MOMENTUM_THRESHOLDS = {
  crushing_it: 0.5,   // >50% overall return + positive trend
  winning: 0.15,      // >15% overall return
  neutral_upper: 0.15, // Upper bound for neutral
  neutral_lower: -0.15, // Lower bound for neutral
  struggling: -0.40,  // >-40% but less than neutral
  // desperate: below struggling
}

/** Weight of each factor in momentum calculation */
const MOMENTUM_WEIGHTS = {
  overallReturn: 0.4,    // 40% weight on total return
  recentTrend: 0.3,      // 30% weight on recent 5-day trend
  peakDistance: 0.3,     // 30% weight on distance from peak
}

// =============================================================================
// MOMENTUM CALCULATION
// =============================================================================

/**
 * Calculate player's momentum category based on performance metrics
 *
 * @param currentNetWorth Current portfolio value
 * @param initialNetWorth Starting value ($100K typically)
 * @param peakNetWorth Highest value achieved this game
 * @param recentPerformance Last 5 days of percentage changes
 * @returns PlayerMomentum category
 */
export function calculateMomentum(
  currentNetWorth: number,
  initialNetWorth: number,
  peakNetWorth: number,
  recentPerformance: number[]
): PlayerMomentum {
  // Calculate component metrics
  const overallReturn = (currentNetWorth - initialNetWorth) / initialNetWorth
  const distanceFromPeak = peakNetWorth > 0
    ? (peakNetWorth - currentNetWorth) / peakNetWorth
    : 0

  // Calculate recent trend (average of last 5 days, or fewer if early game)
  const recentTrend = recentPerformance.length > 0
    ? recentPerformance.reduce((sum, r) => sum + r, 0) / recentPerformance.length
    : 0

  // Composite momentum score
  // Higher = better, range roughly -1 to +1
  const momentumScore = (
    (overallReturn * MOMENTUM_WEIGHTS.overallReturn) +
    (recentTrend * 5 * MOMENTUM_WEIGHTS.recentTrend) +  // Amplify trend impact
    (-distanceFromPeak * MOMENTUM_WEIGHTS.peakDistance)
  )

  // Map score to momentum category
  if (momentumScore > MOMENTUM_THRESHOLDS.crushing_it) {
    return 'crushing_it'
  }
  if (momentumScore > MOMENTUM_THRESHOLDS.winning) {
    return 'winning'
  }
  if (momentumScore > MOMENTUM_THRESHOLDS.neutral_lower) {
    return 'neutral'
  }
  if (momentumScore > MOMENTUM_THRESHOLDS.struggling) {
    return 'struggling'
  }
  return 'desperate'
}

/**
 * Calculate dopamine debt - how urgently the player needs an exciting event
 *
 * @param lastBigWinDay Day of last significant win (or null)
 * @param lastBigLossDay Day of last significant loss (or null)
 * @param currentDay Current game day
 * @returns 0-1 debt value (higher = more urgent)
 */
export function calculateDopamineDebt(
  lastBigWinDay: number | null,
  lastBigLossDay: number | null,
  currentDay: number
): number {
  const daysSinceWin = lastBigWinDay !== null ? currentDay - lastBigWinDay : currentDay
  const daysSinceLoss = lastBigLossDay !== null ? currentDay - lastBigLossDay : currentDay

  // Use the more recent of the two (either type of excitement counts)
  const daysSinceExcitement = Math.min(daysSinceWin, daysSinceLoss)

  // Debt increases logarithmically
  // First few quiet days are fine, then urgency builds
  // At 8+ days, debt is maxed out
  return Math.min(1, Math.log(daysSinceExcitement + 1) / Math.log(8))
}

/**
 * Check if a portfolio change qualifies as a "big win"
 * Used to reset dopamine debt tracking
 *
 * @param percentageChange Daily portfolio change as decimal (0.20 = 20%)
 * @returns True if this counts as a big win
 */
export function isBigWin(percentageChange: number): boolean {
  return percentageChange >= 0.20 // 20%+ gain
}

/**
 * Check if a portfolio change qualifies as a "big loss"
 * Used to reset dopamine debt tracking
 *
 * @param percentageChange Daily portfolio change as decimal (-0.15 = -15%)
 * @returns True if this counts as a big loss
 */
export function isBigLoss(percentageChange: number): boolean {
  return percentageChange <= -0.15 // 15%+ loss
}

/**
 * Determine if current momentum suggests player needs help (rubber banding)
 *
 * @param momentum Current momentum state
 * @returns True if player should get more favorable events
 */
export function needsComebackAssist(momentum: PlayerMomentum): boolean {
  return momentum === 'desperate' || momentum === 'struggling'
}

/**
 * Determine if current momentum suggests player needs challenge (rubber banding)
 *
 * @param momentum Current momentum state
 * @returns True if player should get more challenging events
 */
export function needsChallenge(momentum: PlayerMomentum): boolean {
  return momentum === 'crushing_it'
}
