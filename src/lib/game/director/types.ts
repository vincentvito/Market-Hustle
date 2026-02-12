// Game Director Types
// The Director orchestrates event selection to create compelling narrative arcs

import type { SecondOrderState } from './ripples/types'
import { createInitialSecondOrderState } from './ripples/types'

// Re-export SecondOrderState for convenience
export type { SecondOrderState }

// =============================================================================
// GAME PHASES
// =============================================================================

/** Game progression phases following classic story structure */
export type GamePhase =
  | 'setup'          // Early game: lower volatility, educational events
  | 'rising_action'  // Build complexity: introduce chains, themes
  | 'midpoint'       // Inflection point: mini-climax potential
  | 'escalation'     // Raise stakes: bigger swings, more chains
  | 'climax'         // Maximum tension: dramatic resolutions
  | 'resolution'     // Wind down: resolve threads, no new chains

/** Phase timing as percentage ranges of game duration */
export const PHASE_TIMING: Record<GamePhase, [number, number]> = {
  setup: [0, 0.15],          // Days 1-4 in 30-day game
  rising_action: [0.15, 0.35], // Days 5-10
  midpoint: [0.35, 0.50],    // Days 11-15
  escalation: [0.50, 0.75],  // Days 16-22
  climax: [0.75, 0.90],      // Days 23-27
  resolution: [0.90, 1.0],   // Days 28-30
}

// =============================================================================
// PLAYER STATE
// =============================================================================

/** Player's current performance trajectory */
export type PlayerMomentum =
  | 'crushing_it'  // >50% returns, positive trend
  | 'winning'      // 15-50% returns, stable
  | 'neutral'      // ±15% returns
  | 'struggling'   // -15% to -40% returns
  | 'desperate'    // >40% drawdown from peak

/** Current tension level in the narrative */
export type TensionLevel =
  | 'calm'     // <25 tension
  | 'building' // 25-50 tension
  | 'high'     // 50-75 tension
  | 'peak'     // 75-90 tension
  | 'release'  // >90 tension, triggers release mechanics

/** Optional narrative themes for event clustering */
export type NarrativeTheme =
  | 'tech_boom'
  | 'crypto_winter'
  | 'geopolitical_crisis'
  | 'economic_uncertainty'
  | 'commodity_surge'
  | 'none'

// =============================================================================
// DIRECTOR STATE
// =============================================================================

/** Complete state tracked by the Game Director */
export interface DirectorState {
  // === PLAYER EMOTIONAL TRACKING ===
  /** Current momentum category */
  momentum: PlayerMomentum
  /** Consecutive days in current momentum state */
  momentumStreak: number
  /** Day of last significant gain (>20% portfolio) */
  lastBigWinDay: number | null
  /** Day of last significant loss (>15% portfolio) */
  lastBigLossDay: number | null
  /** 0-1, urgency for an exciting event (increases with quiet days) */
  dopamineDebt: number

  // === TENSION MANAGEMENT ===
  /** Current tension level category */
  tensionLevel: TensionLevel
  /** Raw tension value (0-100) */
  tensionAccumulator: number
  /** Day of last major tension release */
  lastTensionRelease: number
  /** Consecutive "quiet" days (no significant events) */
  boringStretch: number

  // === NARRATIVE ARC ===
  /** Current phase of the game narrative */
  currentPhase: GamePhase
  /** Active thematic cluster (if any) */
  activeTheme: NarrativeTheme
  /** 0-1, commitment to current theme */
  themeStrength: number
  /** Days until theme naturally fades */
  themeDaysRemaining: number

  // === PERFORMANCE METRICS ===
  /** Highest net worth achieved this game */
  peakNetWorth: number
  /** Last 5 days of portfolio percentage changes */
  recentPerformance: number[]
  /** Previous day's net worth (for daily change calculation) */
  previousNetWorth: number

  // === SECOND-ORDER EFFECTS ===
  /** Ripple effects creating narrative coherence */
  secondOrder: SecondOrderState
}

// =============================================================================
// DIRECTOR CONFIG
// =============================================================================

/** Configurable parameters for the Director */
export interface DirectorConfig {
  /** 0-1, player intensity preference (0.5 = balanced) */
  intensity: number
  /** Maximum quiet days before forced intervention */
  maxBoringStretch: number
  /** Minimum days between major win/loss events */
  minDaysBetweenBigEvents: number
  /** Tension accumulator threshold for peak state */
  tensionPeakThreshold: number
  /** Amount of tension released after peak */
  tensionReleaseAmount: number
}

/** Default Director configuration */
export const DEFAULT_DIRECTOR_CONFIG: DirectorConfig = {
  intensity: 0.5,
  maxBoringStretch: 2,
  minDaysBetweenBigEvents: 3,
  tensionPeakThreshold: 90,
  tensionReleaseAmount: 30,
}

// =============================================================================
// EVENT MODIFIERS
// =============================================================================

/** Modifiers generated by Director to influence event selection */
export interface DirectorEventModifiers {
  /** Category weight multipliers (e.g., { crypto: 1.5 }) */
  categoryBoosts: Record<string, number>
  /** Sentiment bias for event selection */
  sentimentBias: 'bullish' | 'bearish' | 'neutral'
  /** Scale event effect magnitudes */
  volatilityMultiplier: number
  /** Adjust probability of starting multi-day chains */
  chainProbabilityMultiplier: number
  /** Force a specific event type if set */
  forceEventType: 'chain' | 'spike' | null
  /** Categories to favor in selection */
  preferredCategories: Set<string>
  /** Categories to avoid in selection */
  blockedCategories: Set<string>
}

/** Default (neutral) event modifiers */
export const DEFAULT_EVENT_MODIFIERS: DirectorEventModifiers = {
  categoryBoosts: {},
  sentimentBias: 'neutral',
  volatilityMultiplier: 1.0,
  chainProbabilityMultiplier: 1.0,
  forceEventType: null,
  preferredCategories: new Set(),
  blockedCategories: new Set(),
}

// =============================================================================
// DOPAMINE EVENTS
// =============================================================================

/** Classification of a dopamine-triggering event */
export interface DopamineEvent {
  type: 'big_win' | 'big_loss' | 'near_miss' | 'unexpected' | 'comeback'
  /** 0-1, magnitude of the dopamine hit */
  magnitude: number
}

// =============================================================================
// TENSION CURVE
// =============================================================================

/** A point on the tension curve */
export interface TensionCurvePoint {
  /** 0-1, progress within current phase */
  phaseProgress: number
  /** Target tension level (0-100) */
  targetTension: number
  /** Allowed variance from target */
  allowedVariance: number
}

// =============================================================================
// INITIAL STATE
// =============================================================================

/** Create initial Director state for a new game */
export function createInitialDirectorState(initialNetWorth: number): DirectorState {
  return {
    momentum: 'neutral',
    momentumStreak: 0,
    lastBigWinDay: null,
    lastBigLossDay: null,
    dopamineDebt: 0,

    tensionLevel: 'calm',
    tensionAccumulator: 15,
    lastTensionRelease: 0,
    boringStretch: 0,

    currentPhase: 'setup',
    activeTheme: 'none',
    themeStrength: 0,
    themeDaysRemaining: 0,

    peakNetWorth: initialNetWorth,
    recentPerformance: [],
    previousNetWorth: initialNetWorth,

    secondOrder: createInitialSecondOrderState(),
  }
}
