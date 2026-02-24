import type { RippleEffect, SecondOrderState } from './types'
import {
  createInitialSecondOrderState,
  DEFAULT_ACTIVATION_CHANCE,
  MIN_RIPPLE_STRENGTH,
} from './types'
import { getRippleDefinition } from './definitions'
import { computeEffectiveModifiers } from './modifiers'
import type { GamePhase } from '../types'

/**
 * Check if an event qualifies as high-impact (can create ripples).
 * Triggers on: total absolute effect >= threshold, blackswan category, or any single effect >= 0.15
 */
export function isHighImpactEvent(
  effects: Record<string, number>,
  category: string,
  customThreshold?: number
): boolean {
  const threshold = customThreshold ?? 0.25

  const effectValues = Object.values(effects || {})
  if (effectValues.length === 0) {
    return category === 'blackswan'
  }

  const totalEffect = effectValues.reduce(
    (sum, effect) => sum + Math.abs(effect),
    0
  )
  const maxEffect = Math.max(...effectValues.map(Math.abs))

  return (
    totalEffect >= threshold ||
    category === 'blackswan' ||
    maxEffect >= 0.15
  )
}

/** Attempt to create a ripple from an event. Returns null if conditions not met. */
export function createRippleFromEvent(
  headline: string,
  category: string,
  effects: Record<string, number>,
  day: number,
  phase: GamePhase
): RippleEffect | null {
  if (!effects || Object.keys(effects).length === 0) {
    if (category !== 'blackswan') return null
  }

  if (!isHighImpactEvent(effects, category)) return null

  const definition = getRippleDefinition(headline, category)
  if (!definition) return null

  const activationChance = definition.activationChance ?? DEFAULT_ACTIVATION_CHANCE
  if (Math.random() > activationChance) return null

  // Apply variance: ±30% strength, ±1 day duration
  const strengthVariance = 0.7 + Math.random() * 0.6
  const durationVariance = Math.floor(Math.random() * 3) - 1

  let duration = (definition.baseDuration ?? 3) + durationVariance
  let strength = (definition.baseStrength ?? 0.7) * strengthVariance
  let decayRate = Math.max(0.1, Math.min(0.9, definition.decayRate ?? 0.25))

  // Phase-based adjustments
  if (phase === 'setup') {
    strength *= 0.6
  } else if (phase === 'resolution') {
    duration = Math.max(1, duration - 2)
    decayRate *= 1.5
  } else if (phase === 'climax') {
    strength *= 1.2
  }

  duration = Math.max(1, duration)

  return {
    id: `ripple-${day}-${category}-${Date.now()}`,
    sourceEventId: headline,
    sourceCategory: category,
    createdOnDay: day,

    duration,
    currentStrength: Math.min(1, strength),
    decayRate,

    categoryBoosts: { ...(definition.boosts ?? {}) },
    categorySuppression: { ...(definition.suppresses ?? {}) },
    sentimentPush: definition.sentimentPush ?? null,
    volatilityModifier: 1.0 + (definition.baseStrength ?? 0.7) * 0.3,
  }
}

/** Decay all ripples, remove weak ones, and recompute effective modifiers */
export function updateRipples(
  state: SecondOrderState,
  currentDay: number
): SecondOrderState {
  const decayedRipples = state.activeRipples.map((ripple) => ({
    ...ripple,
    currentStrength: ripple.currentStrength * (1 - ripple.decayRate),
  }))

  const activeRipples = decayedRipples.filter(
    (ripple) => ripple.currentStrength > MIN_RIPPLE_STRENGTH
  )

  return computeEffectiveModifiers({
    ...state,
    activeRipples,
  })
}

/** Add a ripple. If one from the same category exists, refresh it (take stronger). */
export function addRipple(
  state: SecondOrderState,
  ripple: RippleEffect
): SecondOrderState {
  const existingIndex = state.activeRipples.findIndex(
    (r) => r.sourceCategory === ripple.sourceCategory
  )

  let updatedRipples: RippleEffect[]

  if (existingIndex >= 0) {
    const existing = state.activeRipples[existingIndex]
    const refreshed: RippleEffect = {
      ...ripple,
      currentStrength: Math.max(existing.currentStrength, ripple.currentStrength),
    }
    updatedRipples = [...state.activeRipples]
    updatedRipples[existingIndex] = refreshed
  } else {
    updatedRipples = [...state.activeRipples, ripple]
  }

  return computeEffectiveModifiers({
    ...state,
    activeRipples: updatedRipples,
  })
}

/** Weaken ripples whose sentiment opposes the given event sentiment by 30% */
export function applyCounterRipple(
  state: SecondOrderState,
  eventSentiment: 'bullish' | 'bearish' | 'neutral' | 'mixed'
): SecondOrderState {
  const bullishCountersBearish =
    eventSentiment === 'bullish' && state.effectiveSentimentPush === 'bearish'
  const bearishCountersBullish =
    eventSentiment === 'bearish' && state.effectiveSentimentPush === 'bullish'

  if (!bullishCountersBearish && !bearishCountersBullish) return state

  const sentimentToWeaken = bullishCountersBearish ? 'bearish' : 'bullish'

  const weakenedRipples = state.activeRipples.map((ripple) => ({
    ...ripple,
    currentStrength:
      ripple.sentimentPush === sentimentToWeaken
        ? ripple.currentStrength * 0.7
        : ripple.currentStrength,
  }))

  return computeEffectiveModifiers({
    ...state,
    activeRipples: weakenedRipples,
  })
}

export { createInitialSecondOrderState }
