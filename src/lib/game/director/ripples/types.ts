// Second-Order Effects Types
// Ripple effects create narrative coherence through event clustering

// =============================================================================
// RIPPLE EFFECT
// =============================================================================

/**
 * A ripple effect created by a high-impact event.
 * Temporarily modifies category weights for subsequent events.
 */
export interface RippleEffect {
  /** Unique identifier for this ripple */
  id: string
  /** The headline that triggered this ripple */
  sourceEventId: string
  /** Category of the source event */
  sourceCategory: string
  /** Day the ripple was created */
  createdOnDay: number

  // === TIMING ===
  /** Base duration in days (2-5 typically) */
  duration: number
  /** Current strength (0-1), decays daily */
  currentStrength: number
  /** How much strength is lost per day (0.2-0.4) */
  decayRate: number

  // === MODIFIERS ===
  /** Category weight multipliers (e.g., { energy: 1.5, defense: 1.6 }) */
  categoryBoosts: Record<string, number>
  /** Category weight suppressors (e.g., { tech: 0.7, crypto: 0.8 }) */
  categorySuppression: Record<string, number>
  /** Overall sentiment push for this ripple */
  sentimentPush: 'bullish' | 'bearish' | null
  /** Additional volatility scaling */
  volatilityModifier: number
}

// =============================================================================
// SECOND-ORDER STATE
// =============================================================================

/**
 * State tracking for second-order effects (ripples).
 * Managed as part of DirectorState.
 */
export interface SecondOrderState {
  /** Currently active ripple effects */
  activeRipples: RippleEffect[]

  // === COMPUTED EFFECTIVE MODIFIERS ===
  // Recalculated daily from all active ripples

  /** Combined category modifiers from all active ripples */
  effectiveCategoryModifiers: Record<string, number>
  /** Combined sentiment push from all active ripples */
  effectiveSentimentPush: 'bullish' | 'bearish' | 'neutral'
  /** Combined volatility boost from all active ripples */
  effectiveVolatilityBoost: number
}

// =============================================================================
// RIPPLE DEFINITION
// =============================================================================

/**
 * Definition for how an event creates ripples.
 * Can be attached to specific events or used as category defaults.
 */
export interface RippleDefinition {
  /** Minimum total effect to trigger (default: 0.25) */
  triggerThreshold?: number
  /** Probability this ripple activates (0.7-0.95, never 100% except critical events) */
  activationChance: number

  /** Categories to boost and by how much */
  boosts: Record<string, number>
  /** Categories to suppress and by how much */
  suppresses: Record<string, number>
  /** Sentiment to push toward */
  sentimentPush?: 'bullish' | 'bearish'

  /** Base duration in days before full decay */
  baseDuration: number
  /** Base strength (0.5-1.0) */
  baseStrength: number
  /** Daily decay rate (0.2-0.4) */
  decayRate: number
}

// =============================================================================
// INITIAL STATE
// =============================================================================

/**
 * Create initial second-order state for a new game.
 */
export function createInitialSecondOrderState(): SecondOrderState {
  return {
    activeRipples: [],
    effectiveCategoryModifiers: {},
    effectiveSentimentPush: 'neutral',
    effectiveVolatilityBoost: 1.0,
  }
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Default trigger threshold for high-impact events */
export const DEFAULT_TRIGGER_THRESHOLD = 0.25

/** Default activation chance for ripples */
export const DEFAULT_ACTIVATION_CHANCE = 0.75

/** Minimum strength before a ripple is removed */
export const MIN_RIPPLE_STRENGTH = 0.1

/** Surprise bypass chance (ignores all modifiers) */
export const SURPRISE_BYPASS_CHANCE = 0.12

/** Maximum boost modifier (prevents runaway effects) */
export const MAX_BOOST_MODIFIER = 2.5

/** Minimum suppression modifier (prevents complete blocking) */
export const MIN_SUPPRESSION_MODIFIER = 0.3

/** Maximum volatility boost */
export const MAX_VOLATILITY_BOOST = 2.0
