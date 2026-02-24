import type { SecondOrderState } from './ripples/types'
import { createInitialSecondOrderState } from './ripples/types'

export type { SecondOrderState }

/** Game progression phases following classic story structure */
export type GamePhase =
  | 'setup'
  | 'rising_action'
  | 'midpoint'
  | 'escalation'
  | 'climax'
  | 'resolution'

export const PHASE_TIMING: Record<GamePhase, [number, number]> = {
  setup: [0, 0.15],
  rising_action: [0.15, 0.35],
  midpoint: [0.35, 0.50],
  escalation: [0.50, 0.75],
  climax: [0.75, 0.90],
  resolution: [0.90, 1.0],
}

export type PlayerMomentum =
  | 'crushing_it'
  | 'winning'
  | 'neutral'
  | 'struggling'
  | 'desperate'

export type TensionLevel =
  | 'calm'
  | 'building'
  | 'high'
  | 'peak'
  | 'release'

export type NarrativeTheme =
  | 'tech_boom'
  | 'crypto_winter'
  | 'geopolitical_crisis'
  | 'economic_uncertainty'
  | 'commodity_surge'
  | 'none'

export interface DirectorState {
  momentum: PlayerMomentum
  momentumStreak: number
  lastBigWinDay: number | null
  lastBigLossDay: number | null
  /** 0-1, urgency for an exciting event (increases with quiet days) */
  dopamineDebt: number

  tensionLevel: TensionLevel
  /** Raw tension value (0-100) */
  tensionAccumulator: number
  lastTensionRelease: number
  boringStretch: number

  currentPhase: GamePhase
  activeTheme: NarrativeTheme
  /** 0-1, commitment to current theme */
  themeStrength: number
  themeDaysRemaining: number

  peakNetWorth: number
  /** Last 5 days of portfolio percentage changes */
  recentPerformance: number[]
  previousNetWorth: number

  secondOrder: SecondOrderState
}

export interface DirectorConfig {
  /** 0-1, player intensity preference (0.5 = balanced) */
  intensity: number
  maxBoringStretch: number
  minDaysBetweenBigEvents: number
  tensionPeakThreshold: number
  tensionReleaseAmount: number
}

export const DEFAULT_DIRECTOR_CONFIG: DirectorConfig = {
  intensity: 0.5,
  maxBoringStretch: 2,
  minDaysBetweenBigEvents: 3,
  tensionPeakThreshold: 90,
  tensionReleaseAmount: 30,
}

export interface DirectorEventModifiers {
  categoryBoosts: Record<string, number>
  sentimentBias: 'bullish' | 'bearish' | 'neutral'
  volatilityMultiplier: number
  chainProbabilityMultiplier: number
  forceEventType: 'chain' | 'spike' | null
  preferredCategories: Set<string>
  blockedCategories: Set<string>
}

export const DEFAULT_EVENT_MODIFIERS: DirectorEventModifiers = {
  categoryBoosts: {},
  sentimentBias: 'neutral',
  volatilityMultiplier: 1.0,
  chainProbabilityMultiplier: 1.0,
  forceEventType: null,
  preferredCategories: new Set(),
  blockedCategories: new Set(),
}

export interface DopamineEvent {
  type: 'big_win' | 'big_loss' | 'near_miss' | 'unexpected' | 'comeback'
  /** 0-1, magnitude of the dopamine hit */
  magnitude: number
}

export interface TensionCurvePoint {
  phaseProgress: number
  targetTension: number
  allowedVariance: number
}

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
