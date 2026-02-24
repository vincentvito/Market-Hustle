import type { SecondOrderState } from './types'
import { MAX_BOOST_MODIFIER, MIN_SUPPRESSION_MODIFIER, MAX_VOLATILITY_BOOST } from './types'

/**
 * Compute effective modifiers from all active ripples.
 * Modifiers are multiplicative, scaled by current strength, and capped to prevent extremes.
 */
export function computeEffectiveModifiers(state: SecondOrderState): SecondOrderState {
  const effectiveMods: Record<string, number> = {}
  let sentimentScore = 0
  let volatilityBoost = 1.0

  for (const ripple of state.activeRipples) {
    const strength = ripple.currentStrength

    // A 1.5x boost at 0.5 strength becomes 1.25x: 1 + (1.5-1) * 0.5
    for (const [category, boost] of Object.entries(ripple.categoryBoosts)) {
      const scaledBoost = 1 + (boost - 1) * strength
      effectiveMods[category] = (effectiveMods[category] ?? 1) * scaledBoost
    }

    // A 0.7x suppression at 0.5 strength becomes 0.85x: 1 - (1-0.7) * 0.5
    for (const [category, suppress] of Object.entries(ripple.categorySuppression)) {
      const scaledSuppress = 1 - (1 - suppress) * strength
      effectiveMods[category] = (effectiveMods[category] ?? 1) * scaledSuppress
    }

    if (ripple.sentimentPush === 'bullish') sentimentScore += strength
    else if (ripple.sentimentPush === 'bearish') sentimentScore -= strength

    volatilityBoost *= 1 + (ripple.volatilityModifier - 1) * strength
  }

  for (const category of Object.keys(effectiveMods)) {
    effectiveMods[category] = Math.max(
      MIN_SUPPRESSION_MODIFIER,
      Math.min(MAX_BOOST_MODIFIER, effectiveMods[category])
    )
  }

  let effectiveSentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral'
  if (sentimentScore >= 0.3) effectiveSentiment = 'bullish'
  else if (sentimentScore <= -0.3) effectiveSentiment = 'bearish'

  volatilityBoost = Math.min(MAX_VOLATILITY_BOOST, volatilityBoost)

  return {
    ...state,
    effectiveCategoryModifiers: effectiveMods,
    effectiveSentimentPush: effectiveSentiment,
    effectiveVolatilityBoost: volatilityBoost,
  }
}

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

/** 12% chance to ignore all modifiers for this selection */
export function shouldSurpriseBypass(): boolean {
  return Math.random() < 0.12
}

/** Combine Director sentiment (player state) with ripple sentiment (narrative).
 *  If they conflict, 60% favors Director, 40% favors ripple. */
export function combineSentiment(
  directorSentiment: 'bullish' | 'bearish' | 'neutral',
  rippleSentiment: 'bullish' | 'bearish' | 'neutral'
): 'bullish' | 'bearish' | 'neutral' {
  if (directorSentiment === 'neutral') return rippleSentiment
  if (rippleSentiment === 'neutral') return directorSentiment
  if (directorSentiment === rippleSentiment) return directorSentiment
  return Math.random() < 0.6 ? directorSentiment : rippleSentiment
}

export function getSecondOrderSummary(state: SecondOrderState): string {
  if (state.activeRipples.length === 0) return 'No active ripples'

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
