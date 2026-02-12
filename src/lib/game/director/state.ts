// Director State Management
// Handles updating Director state at the end of each day

import type { DirectorState, DirectorConfig, GamePhase } from './types'
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

// =============================================================================
// STATE UPDATE
// =============================================================================

export interface DayUpdateContext {
  day: number
  gameDuration: number
  netWorth: number
  initialNetWorth: number
  /** True if a market event fired today */
  hadMarketEvent: boolean
  /** Event effects if any */
  eventEffects: Record<string, number> | null
  /** True if a chain resolved today */
  hadChainResolution: boolean
}

/**
 * Update Director state at the end of a day
 *
 * @param previousState Previous Director state
 * @param context Current day context
 * @param config Director configuration
 * @returns Updated Director state
 */
export function updateDirectorState(
  previousState: DirectorState,
  context: DayUpdateContext,
  config: DirectorConfig
): DirectorState {
  const state = { ...previousState }

  // 1. Calculate daily performance
  const dailyChange = previousState.previousNetWorth > 0
    ? (context.netWorth - previousState.previousNetWorth) / previousState.previousNetWorth
    : 0

  // 2. Update recent performance (rolling 5-day window)
  state.recentPerformance = [...previousState.recentPerformance, dailyChange].slice(-5)

  // 3. Update peak net worth
  state.peakNetWorth = Math.max(previousState.peakNetWorth, context.netWorth)

  // 4. Calculate new momentum
  const newMomentum = calculateMomentum(
    context.netWorth,
    context.initialNetWorth,
    state.peakNetWorth,
    state.recentPerformance
  )

  // Track momentum streak
  if (newMomentum === previousState.momentum) {
    state.momentumStreak = previousState.momentumStreak + 1
  } else {
    state.momentumStreak = 1
  }
  state.momentum = newMomentum

  // 5. Update big win/loss tracking
  if (isBigWin(dailyChange)) {
    state.lastBigWinDay = context.day
  }
  if (isBigLoss(dailyChange)) {
    state.lastBigLossDay = context.day
  }

  // 6. Update dopamine debt
  state.dopamineDebt = calculateDopamineDebt(
    state.lastBigWinDay,
    state.lastBigLossDay,
    context.day
  )

  // 7. Update boring stretch
  if (context.hadMarketEvent || context.hadChainResolution) {
    state.boringStretch = 0
  } else {
    state.boringStretch = previousState.boringStretch + 1
  }

  // 8. Update game phase
  state.currentPhase = getCurrentPhase(context.day, context.gameDuration)

  // 9. Update tension
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

  // 10. Check for tension release
  if (shouldReleaseTension(state.tensionLevel, state.tensionAccumulator, config)) {
    state.tensionAccumulator = releaseTension(state.tensionAccumulator, config)
    state.tensionLevel = 'building' // After release, drop to building
    state.lastTensionRelease = context.day
  }

  // 11. Update theme (if active)
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

  // 12. Update previous net worth for next day's calculation
  state.previousNetWorth = context.netWorth

  return state
}

// =============================================================================
// PRE-DAY STATE PREPARATION
// =============================================================================

/**
 * Prepare Director state at the START of a day (before event selection)
 * This is called before events are selected to inform modifiers
 *
 * @param state Current Director state
 * @param day Current day
 * @param gameDuration Game duration
 * @returns State with updated phase (for modifier generation)
 */
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

// =============================================================================
// THEME MANAGEMENT
// =============================================================================

/**
 * Start a narrative theme
 *
 * @param state Current Director state
 * @param theme Theme to start
 * @param duration Days to run the theme
 * @returns Updated state with theme
 */
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

/**
 * Check if a theme should start based on recent events
 * (This is called occasionally to potentially start thematic clustering)
 *
 * @param recentCategories Recent event categories
 * @param currentTheme Current theme (if any)
 * @returns Suggested theme or null
 */
export function suggestTheme(
  recentCategories: string[],
  currentTheme: DirectorState['activeTheme']
): DirectorState['activeTheme'] | null {
  if (currentTheme !== 'none') {
    return null // Already have a theme
  }

  // Count category occurrences in last 5 events
  const categoryCounts: Record<string, number> = {}
  recentCategories.forEach(cat => {
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })

  // If a category appeared 3+ times, consider starting a theme
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

// =============================================================================
// DEBUG & LOGGING
// =============================================================================

/**
 * Get a summary of current Director state for debugging
 *
 * @param state Director state
 * @returns Human-readable summary
 */
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
