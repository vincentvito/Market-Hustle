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

export type { RippleEffect, RippleDefinition } from './ripples'

export {
  createInitialSecondOrderState,
  isHighImpactEvent,
  createRippleFromEvent,
  updateRipples,
  addRipple,
  applyCounterRipple,
  computeEffectiveModifiers,
  applySecondOrderModifiers,
  shouldSurpriseBypass,
  combineSentiment,
  getSecondOrderSummary,
  CATEGORY_RIPPLE_DEFAULTS,
  HIGH_IMPACT_RIPPLE_OVERRIDES,
  getRippleDefinition,
  DEFAULT_TRIGGER_THRESHOLD,
  SURPRISE_BYPASS_CHANCE,
  MAX_BOOST_MODIFIER,
  MIN_SUPPRESSION_MODIFIER,
} from './ripples'

export {
  calculateMomentum,
  calculateDopamineDebt,
  isBigWin,
  isBigLoss,
  needsComebackAssist,
  needsChallenge,
} from './momentum'

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

export {
  getDirectorModifiers,
  getRecentCategories,
  shouldForceEvent,
} from './eventModifiers'

export {
  updateDirectorState,
  prepareDirectorForDay,
  startTheme,
  suggestTheme,
  getDirectorStateSummary,
} from './state'
export type { DayUpdateContext } from './state'

export {
  classifyDopamineEvent,
  shouldScheduleBigEvent,
  isExcitingEvent,
  shouldRespectSentimentBias,
  getPreferredSentiment,
} from './dopamine'
export type { EventContext } from './dopamine'
