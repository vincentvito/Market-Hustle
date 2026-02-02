// Tension Curve Management
// Manages dramatic tension following classic story structure

import type {
  GamePhase,
  TensionLevel,
  TensionCurvePoint,
  DirectorConfig,
} from './types'
import { PHASE_TIMING } from './types'

// =============================================================================
// TENSION CURVES BY PHASE
// =============================================================================

/**
 * Target tension curves for each game phase
 * Each phase has points defining target tension at different progress levels
 */
export const TENSION_CURVES: Record<GamePhase, TensionCurvePoint[]> = {
  setup: [
    { phaseProgress: 0, targetTension: 10, allowedVariance: 10 },
    { phaseProgress: 0.5, targetTension: 20, allowedVariance: 15 },
    { phaseProgress: 1, targetTension: 30, allowedVariance: 15 },
  ],
  rising_action: [
    { phaseProgress: 0, targetTension: 30, allowedVariance: 15 },
    { phaseProgress: 0.3, targetTension: 40, allowedVariance: 20 },
    { phaseProgress: 0.7, targetTension: 55, allowedVariance: 20 },
    { phaseProgress: 1, targetTension: 65, allowedVariance: 15 },
  ],
  midpoint: [
    { phaseProgress: 0, targetTension: 65, allowedVariance: 20 },
    { phaseProgress: 0.5, targetTension: 75, allowedVariance: 25 },  // Mini-peak
    { phaseProgress: 0.8, targetTension: 50, allowedVariance: 20 },  // Release
    { phaseProgress: 1, targetTension: 55, allowedVariance: 15 },
  ],
  escalation: [
    { phaseProgress: 0, targetTension: 55, allowedVariance: 15 },
    { phaseProgress: 0.3, targetTension: 65, allowedVariance: 20 },
    { phaseProgress: 0.6, targetTension: 75, allowedVariance: 20 },
    { phaseProgress: 1, targetTension: 85, allowedVariance: 15 },
  ],
  climax: [
    { phaseProgress: 0, targetTension: 85, allowedVariance: 15 },
    { phaseProgress: 0.4, targetTension: 95, allowedVariance: 10 },  // Peak!
    { phaseProgress: 0.7, targetTension: 90, allowedVariance: 15 },
    { phaseProgress: 1, targetTension: 70, allowedVariance: 20 },    // Begin release
  ],
  resolution: [
    { phaseProgress: 0, targetTension: 70, allowedVariance: 20 },
    { phaseProgress: 0.5, targetTension: 40, allowedVariance: 25 },
    { phaseProgress: 1, targetTension: 20, allowedVariance: 15 },    // Calm ending
  ],
}

// =============================================================================
// PHASE DETECTION
// =============================================================================

/**
 * Determine current game phase based on day and duration
 *
 * @param day Current game day (1-indexed)
 * @param gameDuration Total game length (30, 45, or 60)
 * @returns Current GamePhase
 */
export function getCurrentPhase(day: number, gameDuration: number): GamePhase {
  const progress = day / gameDuration

  for (const [phase, [start, end]] of Object.entries(PHASE_TIMING) as [GamePhase, [number, number]][]) {
    if (progress >= start && progress < end) {
      return phase
    }
  }

  // Default to resolution if at end
  return 'resolution'
}

/**
 * Calculate progress within current phase (0-1)
 *
 * @param day Current game day
 * @param gameDuration Total game length
 * @param phase Current phase
 * @returns Progress within phase (0-1)
 */
export function getPhaseProgress(day: number, gameDuration: number, phase: GamePhase): number {
  const gameProgress = day / gameDuration
  const [phaseStart, phaseEnd] = PHASE_TIMING[phase]
  const phaseLength = phaseEnd - phaseStart

  if (phaseLength === 0) return 1

  const progressInPhase = (gameProgress - phaseStart) / phaseLength
  return Math.max(0, Math.min(1, progressInPhase))
}

// =============================================================================
// TENSION CALCULATION
// =============================================================================

/**
 * Get target tension for current position in the narrative
 *
 * @param phase Current game phase
 * @param phaseProgress Progress within phase (0-1)
 * @param config Director configuration
 * @returns Target tension and allowed variance
 */
export function getTargetTension(
  phase: GamePhase,
  phaseProgress: number,
  config: DirectorConfig
): { target: number; variance: number } {
  const curve = TENSION_CURVES[phase]

  // Find surrounding points on curve
  let before = curve[0]
  let after = curve[curve.length - 1]

  for (let i = 0; i < curve.length - 1; i++) {
    if (curve[i].phaseProgress <= phaseProgress && curve[i + 1].phaseProgress >= phaseProgress) {
      before = curve[i]
      after = curve[i + 1]
      break
    }
  }

  // Linear interpolation between points
  const progressRange = after.phaseProgress - before.phaseProgress
  const t = progressRange > 0
    ? (phaseProgress - before.phaseProgress) / progressRange
    : 0

  const target = before.targetTension + t * (after.targetTension - before.targetTension)
  const variance = before.allowedVariance + t * (after.allowedVariance - before.allowedVariance)

  // Apply intensity modifier (0.7 to 1.3 range)
  const intensityScale = 0.7 + (config.intensity * 0.6)

  return {
    target: target * intensityScale,
    variance: variance * intensityScale,
  }
}

/**
 * Convert raw tension value to tension level category
 *
 * @param tension Raw tension value (0-100)
 * @returns TensionLevel category
 */
export function getTensionLevel(tension: number): TensionLevel {
  if (tension < 25) return 'calm'
  if (tension < 50) return 'building'
  if (tension < 75) return 'high'
  if (tension < 90) return 'peak'
  return 'release'
}

/**
 * Update tension based on event impact and curve targeting
 *
 * @param currentTension Current tension value
 * @param eventImpact Impact of today's event (-50 to +50)
 * @param phase Current game phase
 * @param phaseProgress Progress within phase
 * @param config Director configuration
 * @returns New tension value and level
 */
export function updateTension(
  currentTension: number,
  eventImpact: number,
  phase: GamePhase,
  phaseProgress: number,
  config: DirectorConfig
): { newTension: number; tensionLevel: TensionLevel } {
  const { target } = getTargetTension(phase, phaseProgress, config)

  // Apply event impact
  let newTension = currentTension + eventImpact

  // Rubber-band toward target curve (20% pull per day)
  const distanceFromTarget = newTension - target
  const pullStrength = 0.2
  newTension -= distanceFromTarget * pullStrength

  // Clamp to valid range
  newTension = Math.max(0, Math.min(100, newTension))

  return {
    newTension,
    tensionLevel: getTensionLevel(newTension),
  }
}

/**
 * Calculate tension impact of a market event
 * Bigger effects = more tension
 *
 * @param eventEffects Event's effect magnitudes
 * @param isChainResolution Whether this resolves a multi-day chain
 * @returns Tension impact value (-50 to +50)
 */
export function calculateEventTensionImpact(
  eventEffects: Record<string, number> | null,
  isChainResolution: boolean
): number {
  if (!eventEffects) return -5 // Quiet day reduces tension slightly

  // Sum absolute effects (bigger swings = more tension)
  const totalImpact = Object.values(eventEffects)
    .reduce((sum, effect) => sum + Math.abs(effect), 0)

  // Base tension from effect magnitude (scaled)
  let tensionImpact = Math.min(30, totalImpact * 100)

  // Chain resolutions add extra tension
  if (isChainResolution) {
    tensionImpact *= 1.5
  }

  return tensionImpact
}

/**
 * Check if tension has peaked and should trigger release mechanics
 *
 * @param tensionLevel Current tension level
 * @param tensionAccumulator Raw tension value
 * @param config Director configuration
 * @returns True if tension release should occur
 */
export function shouldReleaseTension(
  tensionLevel: TensionLevel,
  tensionAccumulator: number,
  config: DirectorConfig
): boolean {
  return tensionAccumulator >= config.tensionPeakThreshold
}

/**
 * Apply tension release (after a major event resolves)
 *
 * @param currentTension Current tension value
 * @param config Director configuration
 * @returns New tension value after release
 */
export function releaseTension(currentTension: number, config: DirectorConfig): number {
  return Math.max(0, currentTension - config.tensionReleaseAmount)
}
