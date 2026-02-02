// Second-Order Effects (Ripples) - Main Exports
// Creates narrative coherence through event clustering

// =============================================================================
// TYPES
// =============================================================================
export type { RippleEffect, SecondOrderState, RippleDefinition } from './types'

export {
  createInitialSecondOrderState,
  DEFAULT_TRIGGER_THRESHOLD,
  DEFAULT_ACTIVATION_CHANCE,
  MIN_RIPPLE_STRENGTH,
  SURPRISE_BYPASS_CHANCE,
  MAX_BOOST_MODIFIER,
  MIN_SUPPRESSION_MODIFIER,
  MAX_VOLATILITY_BOOST,
} from './types'

// =============================================================================
// DEFINITIONS
// =============================================================================
export {
  CATEGORY_RIPPLE_DEFAULTS,
  HIGH_IMPACT_RIPPLE_OVERRIDES,
  getRippleDefinition,
} from './definitions'

// =============================================================================
// STATE MANAGEMENT
// =============================================================================
export {
  isHighImpactEvent,
  createRippleFromEvent,
  updateRipples,
  addRipple,
  applyCounterRipple,
} from './state'

// =============================================================================
// MODIFIERS
// =============================================================================
export {
  computeEffectiveModifiers,
  applySecondOrderModifiers,
  shouldSurpriseBypass,
  combineSentiment,
  getSecondOrderSummary,
} from './modifiers'
