// Ripple Modifier Computation
// Computes effective modifiers from all active ripples

import type { SecondOrderState } from './types'
import { MAX_BOOST_MODIFIER, MIN_SUPPRESSION_MODIFIER, MAX_VOLATILITY_BOOST } from './types'

// =============================================================================
// EFFECTIVE MODIFIER COMPUTATION
// =============================================================================

/**
 * Compute effective modifiers from all active ripples.
 * Called after any change to activeRipples.
 *
 * Modifiers are:
 * - Multiplicative (multiple ripples compound)
 * - Scaled by current strength (weaker ripples have less effect)
 * - Capped to prevent extreme values
 *
 * @param state Second-order state with activeRipples
 * @returns Updated state with computed effective modifiers
 */
export function computeEffectiveModifiers(state: SecondOrderState): SecondOrderState {
  const effectiveMods: Record<string, number> = {}
  let sentimentScore = 0 // Positive = bullish, negative = bearish
  let volatilityBoost = 1.0

  for (const ripple of state.activeRipples) {
    const strength = ripple.currentStrength

    // Apply boosts (multiplicative with strength scaling)
    // A 1.5x boost at 0.5 strength becomes 1.25x (1 + (1.5-1) * 0.5)
    for (const [category, boost] of Object.entries(ripple.categoryBoosts)) {
      const scaledBoost = 1 + (boost - 1) * strength
      effectiveMods[category] = (effectiveMods[category] ?? 1) * scaledBoost
    }

    // Apply suppressions (multiplicative with strength scaling)
    // A 0.7x suppression at 0.5 strength becomes 0.85x (1 - (1-0.7) * 0.5)
    for (const [category, suppress] of Object.entries(ripple.categorySuppression)) {
      const scaledSuppress = 1 - (1 - suppress) * strength
      effectiveMods[category] = (effectiveMods[category] ?? 1) * scaledSuppress
    }

    // Accumulate sentiment push (weighted by strength)
    if (ripple.sentimentPush === 'bullish') {
      sentimentScore += strength
    } else if (ripple.sentimentPush === 'bearish') {
      sentimentScore -= strength
    }

    // Stack volatility (multiplicative)
    volatilityBoost *= 1 + (ripple.volatilityModifier - 1) * strength
  }

  // Cap modifiers to prevent extreme values
  for (const category of Object.keys(effectiveMods)) {
    effectiveMods[category] = Math.max(
      MIN_SUPPRESSION_MODIFIER,
      Math.min(MAX_BOOST_MODIFIER, effectiveMods[category])
    )
  }

  // Determine effective sentiment (use >= for consistent threshold behavior)
  let effectiveSentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral'
  if (sentimentScore >= 0.3) {
    effectiveSentiment = 'bullish'
  } else if (sentimentScore <= -0.3) {
    effectiveSentiment = 'bearish'
  }

  // Cap volatility boost
  volatilityBoost = Math.min(MAX_VOLATILITY_BOOST, volatilityBoost)

  return {
    ...state,
    effectiveCategoryModifiers: effectiveMods,
    effectiveSentimentPush: effectiveSentiment,
    effectiveVolatilityBoost: volatilityBoost,
  }
}

// =============================================================================
// MODIFIER APPLICATION
// =============================================================================

/**
 * Apply second-order modifiers to category weights.
 *
 * @param baseWeights Original category weights
 * @param secondOrderState Current second-order state
 * @returns Adjusted category weights
 */
export function applySecondOrderModifiers(
  baseWeights: Record<string, number>,
  secondOrderState: SecondOrderState
): Record<string, number> {
  const adjustedWeights = { ...baseWeights }

  for (const [category, modifier] of Object.entries(
    secondOrderState.effectiveCategoryModifiers
  )) {
    if (adjustedWeights[category] !== undefined) {
      adjustedWeights[category] *= modifier
    }
  }

  return adjustedWeights
}

/**
 * Check if surprise bypass should occur.
 * 12% chance to ignore all modifiers for this selection.
 *
 * @returns True if modifiers should be bypassed
 */
export function shouldSurpriseBypass(): boolean {
  return Math.random() < 0.12
}

/**
 * Combine Director sentiment with ripple sentiment.
 *
 * @param directorSentiment Sentiment from Director (player state)
 * @param rippleSentiment Sentiment from ripples (narrative)
 * @returns Combined effective sentiment
 */
export function combineSentiment(
  directorSentiment: 'bullish' | 'bearish' | 'neutral',
  rippleSentiment: 'bullish' | 'bearish' | 'neutral'
): 'bullish' | 'bearish' | 'neutral' {
  // If either is neutral, use the other
  if (directorSentiment === 'neutral') {
    return rippleSentiment
  }
  if (rippleSentiment === 'neutral') {
    return directorSentiment
  }

  // If they agree, reinforce
  if (directorSentiment === rippleSentiment) {
    return directorSentiment
  }

  // If they conflict, 60% favor Director (player state), 40% favor ripple (narrative)
  return Math.random() < 0.6 ? directorSentiment : rippleSentiment
}

// =============================================================================
// DEBUG HELPERS
// =============================================================================

/**
 * Get a summary of current ripple state for debugging.
 *
 * @param state Second-order state
 * @returns Human-readable summary
 */
export function getSecondOrderSummary(state: SecondOrderState): string {
  if (state.activeRipples.length === 0) {
    return 'No active ripples'
  }

  const rippleSummaries = state.activeRipples.map(
    (r) =>
      `${r.sourceCategory} (${(r.currentStrength * 100).toFixed(0)}%)`
  )

  const modSummary = Object.entries(state.effectiveCategoryModifiers)
    .filter(([, v]) => v !== 1)
    .map(([k, v]) => `${k}:${v.toFixed(2)}x`)
    .join(', ')

  return [
    `Ripples: ${rippleSummaries.join(', ')}`,
    `Sentiment: ${state.effectiveSentimentPush}`,
    `Volatility: ${state.effectiveVolatilityBoost.toFixed(2)}x`,
    modSummary ? `Mods: ${modSummary}` : '',
  ]
    .filter(Boolean)
    .join(' | ')
}
