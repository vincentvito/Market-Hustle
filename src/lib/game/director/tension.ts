import type {
  GamePhase,
  TensionLevel,
  TensionCurvePoint,
  DirectorConfig,
} from './types'
import { PHASE_TIMING } from './types'

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
    { phaseProgress: 0.5, targetTension: 75, allowedVariance: 25 },
    { phaseProgress: 0.8, targetTension: 50, allowedVariance: 20 },
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
    { phaseProgress: 0.4, targetTension: 95, allowedVariance: 10 },
    { phaseProgress: 0.7, targetTension: 90, allowedVariance: 15 },
    { phaseProgress: 1, targetTension: 70, allowedVariance: 20 },
  ],
  resolution: [
    { phaseProgress: 0, targetTension: 70, allowedVariance: 20 },
    { phaseProgress: 0.5, targetTension: 40, allowedVariance: 25 },
    { phaseProgress: 1, targetTension: 20, allowedVariance: 15 },
  ],
}

export function getCurrentPhase(day: number, gameDuration: number): GamePhase {
  const progress = day / gameDuration

  for (const [phase, [start, end]] of Object.entries(PHASE_TIMING) as [GamePhase, [number, number]][]) {
    if (progress >= start && progress < end) {
      return phase
    }
  }

  return 'resolution'
}

export function getPhaseProgress(day: number, gameDuration: number, phase: GamePhase): number {
  const gameProgress = day / gameDuration
  const [phaseStart, phaseEnd] = PHASE_TIMING[phase]
  const phaseLength = phaseEnd - phaseStart

  if (phaseLength === 0) return 1

  const progressInPhase = (gameProgress - phaseStart) / phaseLength
  return Math.max(0, Math.min(1, progressInPhase))
}

export function getTargetTension(
  phase: GamePhase,
  phaseProgress: number,
  config: DirectorConfig
): { target: number; variance: number } {
  const curve = TENSION_CURVES[phase]

  let before = curve[0]
  let after = curve[curve.length - 1]

  for (let i = 0; i < curve.length - 1; i++) {
    if (curve[i].phaseProgress <= phaseProgress && curve[i + 1].phaseProgress >= phaseProgress) {
      before = curve[i]
      after = curve[i + 1]
      break
    }
  }

  const progressRange = after.phaseProgress - before.phaseProgress
  const t = progressRange > 0
    ? (phaseProgress - before.phaseProgress) / progressRange
    : 0

  const target = before.targetTension + t * (after.targetTension - before.targetTension)
  const variance = before.allowedVariance + t * (after.allowedVariance - before.allowedVariance)

  // Intensity modifier: 0.7 to 1.3 range
  const intensityScale = 0.7 + (config.intensity * 0.6)

  return {
    target: target * intensityScale,
    variance: variance * intensityScale,
  }
}

export function getTensionLevel(tension: number): TensionLevel {
  if (tension < 25) return 'calm'
  if (tension < 50) return 'building'
  if (tension < 75) return 'high'
  if (tension < 90) return 'peak'
  return 'release'
}

export function updateTension(
  currentTension: number,
  eventImpact: number,
  phase: GamePhase,
  phaseProgress: number,
  config: DirectorConfig
): { newTension: number; tensionLevel: TensionLevel } {
  const { target } = getTargetTension(phase, phaseProgress, config)

  let newTension = currentTension + eventImpact

  // Rubber-band toward target curve (20% pull per day)
  const distanceFromTarget = newTension - target
  newTension -= distanceFromTarget * 0.2

  newTension = Math.max(0, Math.min(100, newTension))

  return {
    newTension,
    tensionLevel: getTensionLevel(newTension),
  }
}

/** Bigger effects = more tension. Chain resolutions get 1.5x multiplier. */
export function calculateEventTensionImpact(
  eventEffects: Record<string, number> | null,
  isChainResolution: boolean
): number {
  if (!eventEffects) return -5

  const totalImpact = Object.values(eventEffects)
    .reduce((sum, effect) => sum + Math.abs(effect), 0)

  let tensionImpact = Math.min(30, totalImpact * 100)

  if (isChainResolution) {
    tensionImpact *= 1.5
  }

  return tensionImpact
}

export function shouldReleaseTension(
  tensionAccumulator: number,
  config: DirectorConfig
): boolean {
  return tensionAccumulator >= config.tensionPeakThreshold
}

export function releaseTension(currentTension: number, config: DirectorConfig): number {
  return Math.max(0, currentTension - config.tensionReleaseAmount)
}
