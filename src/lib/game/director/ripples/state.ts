// Ripple State Management
// Handles creation, decay, and lifecycle of ripple effects

import type { RippleEffect, SecondOrderState, RippleDefinition } from './types'
import {
  createInitialSecondOrderState,
  DEFAULT_ACTIVATION_CHANCE,
  MIN_RIPPLE_STRENGTH,
} from './types'
import { getRippleDefinition } from './definitions'
import { computeEffectiveModifiers } from './modifiers'
import type { GamePhase } from '../types'

// =============================================================================
// HIGH-IMPACT DETECTION
// =============================================================================

/**
 * Check if an event qualifies as high-impact (can create ripples).
 *
 * Criteria:
 * - Total absolute effect >= threshold (default 0.25)
 * - OR category is 'blackswan'
 * - OR any single asset effect >= 0.15
 */
export function isHighImpactEvent(
  effects: Record<string, number>,
  category: string,
  customThreshold?: number
): boolean {
  const threshold = customThreshold ?? 0.25

  // Guard against empty or undefined effects
  const effectValues = Object.values(effects || {})
  if (effectValues.length === 0) {
    // Empty effects can only qualify if it's a blackswan category
    return category === 'blackswan'
  }

  // Sum of absolute effects
  const totalEffect = effectValues.reduce(
    (sum, effect) => sum + Math.abs(effect),
    0
  )

  // Max single effect (safe now that we know array is non-empty)
  const maxEffect = Math.max(...effectValues.map(Math.abs))

  return (
    totalEffect >= threshold ||
    category === 'blackswan' ||
    maxEffect >= 0.15
  )
}

// =============================================================================
// RIPPLE CREATION
// =============================================================================

/**
 * Attempt to create a ripple from an event.
 *
 * @param headline Event headline (for lookup and ID)
 * @param category Event category
 * @param effects Event effects
 * @param day Current game day
 * @param phase Current game phase (affects ripple strength/duration)
 * @returns New ripple effect, or null if conditions not met
 */
export function createRippleFromEvent(
  headline: string,
  category: string,
  effects: Record<string, number>,
  day: number,
  phase: GamePhase
): RippleEffect | null {
  // Guard against null/undefined effects
  if (!effects || Object.keys(effects).length === 0) {
    // Only blackswan events without effects can potentially create ripples
    if (category !== 'blackswan') {
      return null
    }
  }

  // Check if event qualifies as high-impact
  if (!isHighImpactEvent(effects, category)) {
    return null
  }

  // Get ripple definition (specific override or category default)
  const definition = getRippleDefinition(headline, category)
  if (!definition) {
    return null
  }

  // Activation probability check
  const activationChance = definition.activationChance ?? DEFAULT_ACTIVATION_CHANCE
  if (Math.random() > activationChance) {
    return null // Ripple didn't activate
  }

  // Apply variance to strength and duration (±30% strength, ±1 day duration)
  const strengthVariance = 0.7 + Math.random() * 0.6
  const durationVariance = Math.floor(Math.random() * 3) - 1

  // Base values from definition
  let duration = (definition.baseDuration ?? 3) + durationVariance
  let strength = (definition.baseStrength ?? 0.7) * strengthVariance
  let decayRate = definition.decayRate ?? 0.25

  // Validate decayRate to prevent negative strength (must be 0 < decayRate < 1)
  decayRate = Math.max(0.1, Math.min(0.9, decayRate))

  // Phase-based adjustments
  if (phase === 'setup') {
    // Weaken ripples during early game
    strength *= 0.6
  } else if (phase === 'resolution') {
    // Shorten and accelerate decay during wind-down
    duration = Math.max(1, duration - 2)
    decayRate *= 1.5
  } else if (phase === 'climax') {
    // Strengthen ripples during climax
    strength *= 1.2
  }

  // Ensure minimum duration
  duration = Math.max(1, duration)

  return {
    id: `ripple-${day}-${category}-${Date.now()}`,
    sourceEventId: headline,
    sourceCategory: category,
    createdOnDay: day,

    duration,
    currentStrength: Math.min(1, strength), // Cap at 1.0
    decayRate,

    categoryBoosts: { ...(definition.boosts ?? {}) },
    categorySuppression: { ...(definition.suppresses ?? {}) },
    sentimentPush: definition.sentimentPush ?? null,
    volatilityModifier: 1.0 + (definition.baseStrength ?? 0.7) * 0.3,
  }
}

// =============================================================================
// RIPPLE UPDATES
// =============================================================================

/**
 * Update all ripples at the end of a day (decay and remove expired).
 *
 * @param state Current second-order state
 * @param currentDay Current game day (unused but available for future use)
 * @returns Updated state with decayed/removed ripples
 */
export function updateRipples(
  state: SecondOrderState,
  currentDay: number
): SecondOrderState {
  // Decay all ripples
  const decayedRipples = state.activeRipples.map((ripple) => ({
    ...ripple,
    currentStrength: ripple.currentStrength * (1 - ripple.decayRate),
  }))

  // Remove weak ripples
  const activeRipples = decayedRipples.filter(
    (ripple) => ripple.currentStrength > MIN_RIPPLE_STRENGTH
  )

  // Recompute effective modifiers
  return computeEffectiveModifiers({
    ...state,
    activeRipples,
  })
}

/**
 * Add a new ripple to state.
 * If a ripple from the same category exists, refresh it instead of stacking.
 *
 * @param state Current second-order state
 * @param ripple New ripple to add
 * @returns Updated state with new ripple
 */
export function addRipple(
  state: SecondOrderState,
  ripple: RippleEffect
): SecondOrderState {
  // Check for existing ripple from same category
  const existingIndex = state.activeRipples.findIndex(
    (r) => r.sourceCategory === ripple.sourceCategory
  )

  let updatedRipples: RippleEffect[]

  if (existingIndex >= 0) {
    // Refresh existing ripple (take the stronger of the two)
    const existing = state.activeRipples[existingIndex]
    const refreshed: RippleEffect = {
      ...ripple,
      currentStrength: Math.max(existing.currentStrength, ripple.currentStrength),
    }
    updatedRipples = [...state.activeRipples]
    updatedRipples[existingIndex] = refreshed
  } else {
    // Add new ripple
    updatedRipples = [...state.activeRipples, ripple]
  }

  // Recompute effective modifiers
  return computeEffectiveModifiers({
    ...state,
    activeRipples: updatedRipples,
  })
}

/**
 * Apply counter-ripple effect when event sentiment opposes current ripple sentiment.
 * Bullish events weaken bearish ripples by 30%, and vice versa.
 *
 * @param state Current second-order state
 * @param eventSentiment Sentiment of the event that just fired
 * @returns Updated state with potentially weakened ripples
 */
export function applyCounterRipple(
  state: SecondOrderState,
  eventSentiment: 'bullish' | 'bearish' | 'neutral' | 'mixed'
): SecondOrderState {
  // Check for counter-ripple conditions (symmetric)
  const bullishCountersBearish =
    eventSentiment === 'bullish' && state.effectiveSentimentPush === 'bearish'
  const bearishCountersBullish =
    eventSentiment === 'bearish' && state.effectiveSentimentPush === 'bullish'

  if (!bullishCountersBearish && !bearishCountersBullish) {
    return state
  }

  // Determine which sentiment to weaken
  const sentimentToWeaken = bullishCountersBearish ? 'bearish' : 'bullish'

  // Weaken opposing ripples by 30%
  const weakenedRipples = state.activeRipples.map((ripple) => ({
    ...ripple,
    currentStrength:
      ripple.sentimentPush === sentimentToWeaken
        ? ripple.currentStrength * 0.7
        : ripple.currentStrength,
  }))

  // Recompute effective modifiers
  return computeEffectiveModifiers({
    ...state,
    activeRipples: weakenedRipples,
  })
}

// =============================================================================
// RE-EXPORTS
// =============================================================================

export { createInitialSecondOrderState }
