// Dopamine Event Classification
// Classifies events by their emotional impact for dopamine scheduling

import type { DopamineEvent, PlayerMomentum } from './types'

// =============================================================================
// THRESHOLDS
// =============================================================================

/** Minimum portfolio impact to be considered "significant" */
const MIN_SIGNIFICANT_IMPACT = 0.05 // 5%

/** Impact level for maximum dopamine magnitude */
const MAX_IMPACT_SCALE = 0.50 // 50% impact = max magnitude

// =============================================================================
// EVENT CLASSIFICATION
// =============================================================================

export interface EventContext {
  /** Current player momentum */
  momentum: PlayerMomentum
  /** Was this event part of an ongoing chain (expected)? */
  wasExpected: boolean
  /** Did a chain resolve today? */
  isChainResolution: boolean
}

/**
 * Classify an event by its dopamine impact
 *
 * @param portfolioImpact Percentage change to portfolio (e.g., 0.20 = 20%)
 * @param context Event context
 * @returns DopamineEvent classification or null if not significant
 */
export function classifyDopamineEvent(
  portfolioImpact: number,
  context: EventContext
): DopamineEvent | null {
  const absImpact = Math.abs(portfolioImpact)

  // Not significant enough
  if (absImpact < MIN_SIGNIFICANT_IMPACT) {
    return null
  }

  // Base magnitude (0-1 scale)
  let magnitude = Math.min(1, absImpact / MAX_IMPACT_SCALE)

  // Determine event type
  let type: DopamineEvent['type']

  if (portfolioImpact > 0) {
    // Positive outcome
    if (context.momentum === 'desperate' || context.momentum === 'struggling') {
      type = 'comeback'
      magnitude *= 1.3 // Comebacks feel bigger
    } else {
      type = 'big_win'
    }
  } else {
    // Negative outcome
    if (!context.wasExpected) {
      type = 'unexpected'
      magnitude *= 1.2 // Unexpected losses sting more
    } else {
      type = 'big_loss'
    }
  }

  // Near-miss: chain resolved favorably when it could have gone badly
  if (context.isChainResolution && portfolioImpact > 0 && magnitude > 0.3) {
    type = 'near_miss'
    magnitude *= 1.1
  }

  // Cap magnitude at 1
  magnitude = Math.min(1, magnitude)

  return { type, magnitude }
}

// =============================================================================
// SCHEDULING DECISIONS
// =============================================================================

/**
 * Check if we should schedule a big event today based on dopamine debt
 *
 * @param dopamineDebt Current dopamine debt (0-1)
 * @param lastBigWinDay Day of last big win (or null)
 * @param lastBigLossDay Day of last big loss (or null)
 * @param currentDay Current day
 * @param minDaysBetween Minimum days between big events
 * @returns True if a big event should be scheduled
 */
export function shouldScheduleBigEvent(
  dopamineDebt: number,
  lastBigWinDay: number | null,
  lastBigLossDay: number | null,
  currentDay: number,
  minDaysBetween: number
): boolean {
  // Check minimum spacing
  const daysSinceWin = lastBigWinDay !== null ? currentDay - lastBigWinDay : 999
  const daysSinceLoss = lastBigLossDay !== null ? currentDay - lastBigLossDay : 999
  const daysSinceBig = Math.min(daysSinceWin, daysSinceLoss)

  if (daysSinceBig < minDaysBetween) {
    return false // Too soon
  }

  // High dopamine debt = urgency
  if (dopamineDebt > 0.8) {
    return true
  }

  // Random element with debt-based probability
  const baseChance = 0.15 + (dopamineDebt * 0.3)
  return Math.random() < baseChance
}

/**
 * Determine if an event qualifies as "exciting" (resets boring streak)
 *
 * @param portfolioImpact Portfolio impact of the event
 * @param isChainStart Did a new chain start?
 * @param isChainResolution Did a chain resolve?
 * @returns True if this counts as exciting
 */
export function isExcitingEvent(
  portfolioImpact: number | null,
  isChainStart: boolean,
  isChainResolution: boolean
): boolean {
  // Chain events are always exciting
  if (isChainStart || isChainResolution) {
    return true
  }

  // Significant portfolio impact is exciting
  if (portfolioImpact !== null && Math.abs(portfolioImpact) >= MIN_SIGNIFICANT_IMPACT) {
    return true
  }

  return false
}

// =============================================================================
// SENTIMENT BIAS APPLICATION
// =============================================================================

/**
 * Determine if we should respect the sentiment bias for this selection
 * (70% respect rate keeps things feeling organic)
 *
 * @param bias Current sentiment bias
 * @param eventSentiment Sentiment of selected event
 * @returns True if we should try to find a better-fitting event
 */
export function shouldRespectSentimentBias(
  bias: 'bullish' | 'bearish' | 'neutral',
  eventSentiment: 'bullish' | 'bearish' | 'neutral' | 'mixed'
): boolean {
  if (bias === 'neutral') {
    return true // No bias to respect
  }

  // 70% chance to respect bias
  if (Math.random() > 0.7) {
    return true // Let it through anyway
  }

  // Check if event matches bias
  if (bias === 'bullish' && eventSentiment === 'bullish') {
    return true
  }
  if (bias === 'bearish' && eventSentiment === 'bearish') {
    return true
  }

  // Mixed/neutral events are always acceptable
  if (eventSentiment === 'neutral' || eventSentiment === 'mixed') {
    return true
  }

  // Event doesn't match bias
  return false
}

/**
 * Get the opposite sentiment for finding alternative events
 *
 * @param bias Current bias
 * @returns Preferred sentiment for event search
 */
export function getPreferredSentiment(
  bias: 'bullish' | 'bearish' | 'neutral'
): 'bullish' | 'bearish' | null {
  if (bias === 'bullish') return 'bullish'
  if (bias === 'bearish') return 'bearish'
  return null
}
