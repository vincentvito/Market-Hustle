import type { PlayerMomentum } from './types'

const MOMENTUM_THRESHOLDS = {
  crushing_it: 0.5,
  winning: 0.15,
  neutral_upper: 0.15,
  neutral_lower: -0.15,
  struggling: -0.40,
}

const MOMENTUM_WEIGHTS = {
  overallReturn: 0.4,
  recentTrend: 0.3,
  peakDistance: 0.3,
}

export function calculateMomentum(
  currentNetWorth: number,
  initialNetWorth: number,
  peakNetWorth: number,
  recentPerformance: number[]
): PlayerMomentum {
  const overallReturn = (currentNetWorth - initialNetWorth) / initialNetWorth
  const distanceFromPeak = peakNetWorth > 0
    ? (peakNetWorth - currentNetWorth) / peakNetWorth
    : 0

  const recentTrend = recentPerformance.length > 0
    ? recentPerformance.reduce((sum, r) => sum + r, 0) / recentPerformance.length
    : 0

  // Composite momentum score: higher = better, range roughly -1 to +1
  const momentumScore = (
    (overallReturn * MOMENTUM_WEIGHTS.overallReturn) +
    (recentTrend * 5 * MOMENTUM_WEIGHTS.recentTrend) +
    (-distanceFromPeak * MOMENTUM_WEIGHTS.peakDistance)
  )

  if (momentumScore > MOMENTUM_THRESHOLDS.crushing_it) return 'crushing_it'
  if (momentumScore > MOMENTUM_THRESHOLDS.winning) return 'winning'
  if (momentumScore > MOMENTUM_THRESHOLDS.neutral_lower) return 'neutral'
  if (momentumScore > MOMENTUM_THRESHOLDS.struggling) return 'struggling'
  return 'desperate'
}

/** How urgently the player needs an exciting event (0-1, logarithmic) */
export function calculateDopamineDebt(
  lastBigWinDay: number | null,
  lastBigLossDay: number | null,
  currentDay: number
): number {
  const daysSinceWin = lastBigWinDay !== null ? currentDay - lastBigWinDay : currentDay
  const daysSinceLoss = lastBigLossDay !== null ? currentDay - lastBigLossDay : currentDay
  const daysSinceExcitement = Math.min(daysSinceWin, daysSinceLoss)

  // Debt increases logarithmically; maxes out at 8+ quiet days
  return Math.min(1, Math.log(daysSinceExcitement + 1) / Math.log(8))
}

export function isBigWin(percentageChange: number): boolean {
  return percentageChange >= 0.20
}

export function isBigLoss(percentageChange: number): boolean {
  return percentageChange <= -0.15
}

export function needsComebackAssist(momentum: PlayerMomentum): boolean {
  return momentum === 'desperate' || momentum === 'struggling'
}

export function needsChallenge(momentum: PlayerMomentum): boolean {
  return momentum === 'crushing_it'
}
