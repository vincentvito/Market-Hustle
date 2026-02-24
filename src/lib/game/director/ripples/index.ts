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

export {
  CATEGORY_RIPPLE_DEFAULTS,
  HIGH_IMPACT_RIPPLE_OVERRIDES,
  getRippleDefinition,
} from './definitions'

export {
  isHighImpactEvent,
  createRippleFromEvent,
  updateRipples,
  addRipple,
  applyCounterRipple,
} from './state'

export {
  computeEffectiveModifiers,
  applySecondOrderModifiers,
  shouldSurpriseBypass,
  combineSentiment,
  getSecondOrderSummary,
} from './modifiers'
