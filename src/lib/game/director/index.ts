// Game Director - Main Exports
// Orchestrates event selection for compelling narrative arcs

// =============================================================================
// TYPES
// =============================================================================
export type {
  GamePhase,
  PlayerMomentum,
  TensionLevel,
  NarrativeTheme,
  DirectorState,
  DirectorConfig,
  DirectorEventModifiers,
  DopamineEvent,
  TensionCurvePoint,
  SecondOrderState,
} from './types'

export {
  PHASE_TIMING,
  DEFAULT_DIRECTOR_CONFIG,
  DEFAULT_EVENT_MODIFIERS,
  createInitialDirectorState,
} from './types'

// =============================================================================
// SECOND-ORDER EFFECTS (RIPPLES)
// =============================================================================
export type { RippleEffect, RippleDefinition } from './ripples'

export {
  // State management
  createInitialSecondOrderState,
  isHighImpactEvent,
  createRippleFromEvent,
  updateRipples,
  addRipple,
  applyCounterRipple,
  // Modifiers
  computeEffectiveModifiers,
  applySecondOrderModifiers,
  shouldSurpriseBypass,
  combineSentiment,
  getSecondOrderSummary,
  // Definitions
  CATEGORY_RIPPLE_DEFAULTS,
  HIGH_IMPACT_RIPPLE_OVERRIDES,
  getRippleDefinition,
  // Constants
  DEFAULT_TRIGGER_THRESHOLD,
  SURPRISE_BYPASS_CHANCE,
  MAX_BOOST_MODIFIER,
  MIN_SUPPRESSION_MODIFIER,
} from './ripples'

// =============================================================================
// MOMENTUM
// =============================================================================
export {
  calculateMomentum,
  calculateDopamineDebt,
  isBigWin,
  isBigLoss,
  needsComebackAssist,
  needsChallenge,
} from './momentum'

// =============================================================================
// TENSION
// =============================================================================
export {
  TENSION_CURVES,
  getCurrentPhase,
  getPhaseProgress,
  getTargetTension,
  getTensionLevel,
  updateTension,
  calculateEventTensionImpact,
  shouldReleaseTension,
  releaseTension,
} from './tension'

// =============================================================================
// EVENT MODIFIERS
// =============================================================================
export {
  getDirectorModifiers,
  getRecentCategories,
  shouldForceEvent,
} from './eventModifiers'

// =============================================================================
// STATE MANAGEMENT
// =============================================================================
export {
  updateDirectorState,
  prepareDirectorForDay,
  startTheme,
  suggestTheme,
  getDirectorStateSummary,
} from './state'
export type { DayUpdateContext } from './state'

// =============================================================================
// DOPAMINE
// =============================================================================
export {
  classifyDopamineEvent,
  shouldScheduleBigEvent,
  isExcitingEvent,
  shouldRespectSentimentBias,
  getPreferredSentiment,
} from './dopamine'
export type { EventContext } from './dopamine'
