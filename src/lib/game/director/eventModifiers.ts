// Event Selection Modifiers
// Generates modifiers to influence event selection based on Director state

import type {
  DirectorState,
  DirectorConfig,
  DirectorEventModifiers,
  GamePhase,
} from './types'
import { DEFAULT_EVENT_MODIFIERS } from './types'
import { needsComebackAssist, needsChallenge } from './momentum'

// =============================================================================
// CATEGORY MAPPINGS
// =============================================================================

/** Map narrative themes to their primary categories */
const THEME_TO_CATEGORY: Record<string, string> = {
  tech_boom: 'tech',
  crypto_winter: 'crypto',
  geopolitical_crisis: 'geopolitical',
  economic_uncertainty: 'economic',
  commodity_surge: 'energy',
}

/** Categories that conflict with certain themes */
const THEME_CONFLICTS: Record<string, string[]> = {
  tech_boom: ['economic'],     // Tech boom conflicts with recession
  crypto_winter: [],
  geopolitical_crisis: [],
  economic_uncertainty: ['tech'],
  commodity_surge: [],
}

/** High-upside categories for comeback opportunities */
const COMEBACK_CATEGORIES = ['crypto', 'tech', 'biotech']

/** High-volatility categories for challenging dominant players */
const CHALLENGE_CATEGORIES = ['blackswan', 'geopolitical', 'economic']

// =============================================================================
// MODIFIER GENERATION
// =============================================================================

/**
 * Generate event modifiers based on Director state
 *
 * @param state Current Director state
 * @param config Director configuration
 * @param context Game context
 * @returns Modifiers to apply to event selection
 */
export function getDirectorModifiers(
  state: DirectorState,
  config: DirectorConfig,
  context: {
    day: number
    gameDuration: number
    recentCategories: string[]
  }
): DirectorEventModifiers {
  // Start with defaults
  const modifiers: DirectorEventModifiers = {
    categoryBoosts: {},
    sentimentBias: 'neutral',
    volatilityMultiplier: 1.0,
    chainProbabilityMultiplier: 1.0,
    forceEventType: null,
    preferredCategories: new Set(),
    blockedCategories: new Set(),
  }

  // Apply phase-based adjustments
  applyPhaseModifiers(modifiers, state.currentPhase, state.tensionLevel, config)

  // Apply momentum-based rubber banding
  applyMomentumModifiers(modifiers, state, config)

  // Apply dopamine debt interventions
  applyDopamineModifiers(modifiers, state, config)

  // Apply boring stretch prevention
  applyBoringStretchModifiers(modifiers, state, config)

  // Apply theme reinforcement
  applyThemeModifiers(modifiers, state)

  // Apply variety enforcement (reduce recently-used categories, exempt theme category)
  applyVarietyModifiers(modifiers, context.recentCategories, state)

  return modifiers
}

// =============================================================================
// PHASE-BASED MODIFIERS
// =============================================================================

function applyPhaseModifiers(
  modifiers: DirectorEventModifiers,
  phase: GamePhase,
  tensionLevel: string,
  config: DirectorConfig
): void {
  switch (phase) {
    case 'setup':
      // Early game: active opening, familiar categories
      modifiers.volatilityMultiplier = 0.8 + (config.intensity * 0.2)
      modifiers.chainProbabilityMultiplier = 1.0
      modifiers.preferredCategories.add('tech')
      modifiers.preferredCategories.add('crypto')
      break

    case 'rising_action':
      // Build complexity: introduce chains, themed events
      modifiers.chainProbabilityMultiplier = 1.2
      break

    case 'midpoint':
      // Inflection point: high drama potential
      if (tensionLevel === 'peak') {
        modifiers.forceEventType = 'chain'
        modifiers.volatilityMultiplier = 1.3
      }
      break

    case 'escalation':
      // Raise stakes: bigger swings, more chains
      modifiers.volatilityMultiplier = 1.2 + (config.intensity * 0.3)
      modifiers.chainProbabilityMultiplier = 1.5
      break

    case 'climax':
      // Maximum tension: spike events, dramatic resolutions
      modifiers.volatilityMultiplier = 1.5 + (config.intensity * 0.5)
      if (tensionLevel === 'peak') {
        modifiers.forceEventType = 'spike'
      }
      break

    case 'resolution':
      // Wind down: resolve threads, no new chains
      modifiers.volatilityMultiplier = 0.8
      modifiers.chainProbabilityMultiplier = 0.3
      break
  }
}

// =============================================================================
// MOMENTUM-BASED MODIFIERS (RUBBER BANDING)
// =============================================================================

function applyMomentumModifiers(
  modifiers: DirectorEventModifiers,
  state: DirectorState,
  config: DirectorConfig
): void {
  const streak = state.momentumStreak

  if (needsComebackAssist(state.momentum)) {
    // Struggling/desperate: always assist (no delay — losing isn't fun)
    modifiers.sentimentBias = 'bullish'
    COMEBACK_CATEGORIES.forEach(cat => modifiers.preferredCategories.add(cat))
    modifiers.chainProbabilityMultiplier *= 1.3

    if (state.momentum === 'desperate') {
      modifiers.volatilityMultiplier *= 0.9
    }
  } else if (needsChallenge(state.momentum)) {
    // Crushing it: let the streak build before rubber-banding
    if (streak >= 3) {
      // Streak has run long enough — introduce headwinds
      modifiers.sentimentBias = 'bearish'
      modifiers.volatilityMultiplier *= (1.2 + config.intensity * 0.3)
      CHALLENGE_CATEGORIES.forEach(cat => modifiers.preferredCategories.add(cat))
    }
    // streak < 3: no bias override — let the player ride the wave
  } else if (state.momentum === 'winning') {
    // Only nudge bearish after streak has built
    if (streak >= 3 && Math.random() < 0.3) {
      modifiers.sentimentBias = 'bearish'
    }
  } else if (state.momentum === 'struggling') {
    // Mild assist after streak — struggling for 3+ days deserves help
    if (streak >= 3 && Math.random() < 0.4) {
      modifiers.sentimentBias = 'bullish'
    }
  }
}

// =============================================================================
// DOPAMINE DEBT MODIFIERS
// =============================================================================

function applyDopamineModifiers(
  modifiers: DirectorEventModifiers,
  state: DirectorState,
  config: DirectorConfig
): void {
  // High dopamine debt = need exciting events
  if (state.dopamineDebt > 0.7) {
    modifiers.volatilityMultiplier *= 1.5
  }

  // Very high debt = force a spike event
  if (state.dopamineDebt > 0.9) {
    modifiers.forceEventType = 'spike'
  }
}

// =============================================================================
// BORING STRETCH MODIFIERS
// =============================================================================

function applyBoringStretchModifiers(
  modifiers: DirectorEventModifiers,
  state: DirectorState,
  config: DirectorConfig
): void {
  if (state.boringStretch >= config.maxBoringStretch) {
    // Force something exciting
    modifiers.volatilityMultiplier = Math.max(modifiers.volatilityMultiplier, 1.3)
    modifiers.chainProbabilityMultiplier = Math.max(modifiers.chainProbabilityMultiplier, 1.5)

    // If we haven't forced an event type yet, force a chain
    if (!modifiers.forceEventType) {
      modifiers.forceEventType = 'chain'
    }
  }
}

// =============================================================================
// THEME MODIFIERS
// =============================================================================

function applyThemeModifiers(
  modifiers: DirectorEventModifiers,
  state: DirectorState
): void {
  if (state.activeTheme === 'none' || state.themeStrength <= 0.3) {
    return  // Lower threshold from 0.5 to 0.3 so theme persists longer
  }

  // Boost theme's primary category (4x at full strength, ~1.9x at threshold)
  const primaryCategory = THEME_TO_CATEGORY[state.activeTheme]
  if (primaryCategory) {
    modifiers.categoryBoosts[primaryCategory] =
      (modifiers.categoryBoosts[primaryCategory] || 1) * (1 + state.themeStrength * 3)
  }

  // Block conflicting categories
  const conflicts = THEME_CONFLICTS[state.activeTheme] || []
  conflicts.forEach(cat => {
    modifiers.blockedCategories.add(cat)
  })
}

// =============================================================================
// VARIETY MODIFIERS
// =============================================================================

function applyVarietyModifiers(
  modifiers: DirectorEventModifiers,
  recentCategories: string[],
  state: DirectorState
): void {
  // Get the theme's protected category (exempt from variety penalty)
  const themeCategory = state.activeTheme !== 'none'
    ? THEME_TO_CATEGORY[state.activeTheme]
    : null

  // Reduce probability of recently-used categories
  // More recent = bigger penalty
  // EXCEPTION: theme's primary category gets no penalty when theme is active
  recentCategories.forEach((cat, index) => {
    if (cat === themeCategory) return  // Skip penalty for theme category
    const recencyPenalty = Math.pow(0.5, index + 1) // 0.5, 0.25, 0.125...
    modifiers.categoryBoosts[cat] =
      (modifiers.categoryBoosts[cat] || 1) * recencyPenalty
  })
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Extract recent event categories from news history
 *
 * @param newsHistory Recent news items
 * @param limit Maximum categories to return
 * @returns Array of recent category strings
 */
export function getRecentCategories(
  newsHistory: Array<{ category?: string }>,
  limit: number = 5
): string[] {
  return newsHistory
    .slice(-limit)
    .map(item => item.category)
    .filter((cat): cat is string => typeof cat === 'string')
    .reverse() // Most recent first
}

/**
 * Check if modifiers suggest forcing an event
 *
 * @param modifiers Current modifiers
 * @returns True if an event should be forced this turn
 */
export function shouldForceEvent(modifiers: DirectorEventModifiers): boolean {
  return modifiers.forceEventType !== null ||
    modifiers.volatilityMultiplier > 1.3 ||
    modifiers.chainProbabilityMultiplier > 1.3
}
