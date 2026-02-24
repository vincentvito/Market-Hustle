export interface RippleEffect {
  id: string
  sourceEventId: string
  sourceCategory: string
  createdOnDay: number

  /** Base duration in days (2-5 typically) */
  duration: number
  /** 0-1, decays daily */
  currentStrength: number
  /** Strength lost per day (0.2-0.4) */
  decayRate: number

  /** Category weight multipliers (e.g., { energy: 1.5, defense: 1.6 }) */
  categoryBoosts: Record<string, number>
  /** Category weight suppressors (e.g., { tech: 0.7, crypto: 0.8 }) */
  categorySuppression: Record<string, number>
  sentimentPush: 'bullish' | 'bearish' | null
  volatilityModifier: number
}

export interface SecondOrderState {
  activeRipples: RippleEffect[]
  /** Recalculated daily from all active ripples */
  effectiveCategoryModifiers: Record<string, number>
  effectiveSentimentPush: 'bullish' | 'bearish' | 'neutral'
  effectiveVolatilityBoost: number
}

export interface RippleDefinition {
  /** Minimum total effect to trigger (default: 0.25) */
  triggerThreshold?: number
  /** Probability this ripple activates (0.7-0.95) */
  activationChance: number

  boosts: Record<string, number>
  suppresses: Record<string, number>
  sentimentPush?: 'bullish' | 'bearish'

  baseDuration: number
  /** 0.5-1.0 */
  baseStrength: number
  /** Daily decay rate (0.2-0.4) */
  decayRate: number
}

export function createInitialSecondOrderState(): SecondOrderState {
  return {
    activeRipples: [],
    effectiveCategoryModifiers: {},
    effectiveSentimentPush: 'neutral',
    effectiveVolatilityBoost: 1.0,
  }
}

export const DEFAULT_TRIGGER_THRESHOLD = 0.25
export const DEFAULT_ACTIVATION_CHANCE = 0.75
export const MIN_RIPPLE_STRENGTH = 0.1
export const SURPRISE_BYPASS_CHANCE = 0.12
export const MAX_BOOST_MODIFIER = 2.5
export const MIN_SUPPRESSION_MODIFIER = 0.3
export const MAX_VOLATILITY_BOOST = 2.0
