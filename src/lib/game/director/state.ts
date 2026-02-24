import type { DirectorState, DirectorConfig } from './types'
import {
  calculateMomentum,
  calculateDopamineDebt,
  isBigWin,
  isBigLoss,
} from './momentum'
import {
  getCurrentPhase,
  getPhaseProgress,
  updateTension,
  calculateEventTensionImpact,
  releaseTension,
  shouldReleaseTension,
} from './tension'

export interface DayUpdateContext {
  day: number
  gameDuration: number
  netWorth: number
  initialNetWorth: number
  hadMarketEvent: boolean
  eventEffects: Record<string, number> | null
  hadChainResolution: boolean
}

export function updateDirectorState(
  previousState: DirectorState,
  context: DayUpdateContext,
  config: DirectorConfig
): DirectorState {
  const state = { ...previousState }

  const dailyChange = previousState.previousNetWorth > 0
    ? (context.netWorth - previousState.previousNetWorth) / previousState.previousNetWorth
    : 0

  state.recentPerformance = [...previousState.recentPerformance, dailyChange].slice(-5)
  state.peakNetWorth = Math.max(previousState.peakNetWorth, context.netWorth)

  const newMomentum = calculateMomentum(
    context.netWorth,
    context.initialNetWorth,
    state.peakNetWorth,
    state.recentPerformance
  )

  if (newMomentum === previousState.momentum) {
    state.momentumStreak = previousState.momentumStreak + 1
  } else {
    state.momentumStreak = 1
  }
  state.momentum = newMomentum

  if (isBigWin(dailyChange)) state.lastBigWinDay = context.day
  if (isBigLoss(dailyChange)) state.lastBigLossDay = context.day

  state.dopamineDebt = calculateDopamineDebt(
    state.lastBigWinDay,
    state.lastBigLossDay,
    context.day
  )

  if (context.hadMarketEvent || context.hadChainResolution) {
    state.boringStretch = 0
  } else {
    state.boringStretch = previousState.boringStretch + 1
  }

  state.currentPhase = getCurrentPhase(context.day, context.gameDuration)

  const phaseProgress = getPhaseProgress(context.day, context.gameDuration, state.currentPhase)
  const tensionImpact = calculateEventTensionImpact(
    context.eventEffects,
    context.hadChainResolution
  )

  const { newTension, tensionLevel } = updateTension(
    previousState.tensionAccumulator,
    tensionImpact,
    state.currentPhase,
    phaseProgress,
    config
  )

  state.tensionAccumulator = newTension
  state.tensionLevel = tensionLevel

  if (shouldReleaseTension(state.tensionAccumulator, config)) {
    state.tensionAccumulator = releaseTension(state.tensionAccumulator, config)
    state.tensionLevel = 'building'
    state.lastTensionRelease = context.day
  }

  if (state.activeTheme !== 'none') {
    state.themeDaysRemaining = Math.max(0, previousState.themeDaysRemaining - 1)
    if (state.themeDaysRemaining === 0) {
      state.activeTheme = 'none'
      state.themeStrength = 0
    } else {
      // Theme strength fades slowly (-0.03/day stays above 0.3 threshold for ~23 days)
      state.themeStrength = Math.max(0, previousState.themeStrength - 0.03)
    }
  }

  state.previousNetWorth = context.netWorth

  return state
}

/** Prepare Director state at the START of a day (before event selection) */
export function prepareDirectorForDay(
  state: DirectorState,
  day: number,
  gameDuration: number
): DirectorState {
  return {
    ...state,
    currentPhase: getCurrentPhase(day, gameDuration),
  }
}

export function startTheme(
  state: DirectorState,
  theme: DirectorState['activeTheme'],
  duration: number
): DirectorState {
  return {
    ...state,
    activeTheme: theme,
    themeStrength: 1.0,
    themeDaysRemaining: duration,
  }
}

/** Suggest a theme if a category appeared 3+ times in recent events */
export function suggestTheme(
  recentCategories: string[],
  currentTheme: DirectorState['activeTheme']
): DirectorState['activeTheme'] | null {
  if (currentTheme !== 'none') return null

  const categoryCounts: Record<string, number> = {}
  recentCategories.forEach(cat => {
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })

  for (const [category, count] of Object.entries(categoryCounts)) {
    if (count >= 3) {
      switch (category) {
        case 'tech':
          return 'tech_boom'
        case 'crypto':
          return 'crypto_winter'
        case 'geopolitical':
          return 'geopolitical_crisis'
        case 'economic':
          return 'economic_uncertainty'
        case 'energy':
          return 'commodity_surge'
      }
    }
  }

  return null
}

export function getDirectorStateSummary(state: DirectorState): string {
  return [
    `Phase: ${state.currentPhase}`,
    `Momentum: ${state.momentum} (${state.momentumStreak} days)`,
    `Tension: ${state.tensionLevel} (${Math.round(state.tensionAccumulator)})`,
    `Dopamine Debt: ${(state.dopamineDebt * 100).toFixed(0)}%`,
    `Boring Streak: ${state.boringStretch} days`,
    `Theme: ${state.activeTheme}${state.activeTheme !== 'none' ? ` (${state.themeDaysRemaining}d remaining)` : ''}`,
  ].join(' | ')
}
