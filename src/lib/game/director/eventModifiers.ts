import type {
  DirectorState,
  DirectorConfig,
  DirectorEventModifiers,
  GamePhase,
} from './types'
import { needsComebackAssist, needsChallenge } from './momentum'

const THEME_TO_CATEGORY: Record<string, string> = {
  tech_boom: 'tech',
  crypto_winter: 'crypto',
  geopolitical_crisis: 'geopolitical',
  economic_uncertainty: 'economic',
  commodity_surge: 'energy',
}

const THEME_CONFLICTS: Record<string, string[]> = {
  tech_boom: ['economic'],
  crypto_winter: [],
  geopolitical_crisis: [],
  economic_uncertainty: ['tech'],
  commodity_surge: [],
}

const COMEBACK_CATEGORIES = ['crypto', 'tech', 'biotech']
const CHALLENGE_CATEGORIES = ['blackswan', 'geopolitical', 'economic']

export function getDirectorModifiers(
  state: DirectorState,
  config: DirectorConfig,
  context: {
    day: number
    gameDuration: number
    recentCategories: string[]
  }
): DirectorEventModifiers {
  const modifiers: DirectorEventModifiers = {
    categoryBoosts: {},
    sentimentBias: 'neutral',
    volatilityMultiplier: 1.0,
    chainProbabilityMultiplier: 1.0,
    forceEventType: null,
    preferredCategories: new Set(),
    blockedCategories: new Set(),
  }

  applyPhaseModifiers(modifiers, state.currentPhase, state.tensionLevel, config)
  applyMomentumModifiers(modifiers, state, config)
  applyDopamineModifiers(modifiers, state)
  applyBoringStretchModifiers(modifiers, state, config)
  applyThemeModifiers(modifiers, state)
  applyVarietyModifiers(modifiers, context.recentCategories, state)

  return modifiers
}

function applyPhaseModifiers(
  modifiers: DirectorEventModifiers,
  phase: GamePhase,
  tensionLevel: string,
  config: DirectorConfig
): void {
  switch (phase) {
    case 'setup':
      modifiers.volatilityMultiplier = 0.8 + (config.intensity * 0.2)
      modifiers.chainProbabilityMultiplier = 1.0
      modifiers.preferredCategories.add('tech')
      modifiers.preferredCategories.add('crypto')
      break

    case 'rising_action':
      modifiers.chainProbabilityMultiplier = 1.2
      break

    case 'midpoint':
      if (tensionLevel === 'peak') {
        modifiers.forceEventType = 'chain'
        modifiers.volatilityMultiplier = 1.3
      }
      break

    case 'escalation':
      modifiers.volatilityMultiplier = 1.2 + (config.intensity * 0.3)
      modifiers.chainProbabilityMultiplier = 1.5
      break

    case 'climax':
      modifiers.volatilityMultiplier = 1.5 + (config.intensity * 0.5)
      if (tensionLevel === 'peak') {
        modifiers.forceEventType = 'spike'
      }
      break

    case 'resolution':
      modifiers.volatilityMultiplier = 0.8
      modifiers.chainProbabilityMultiplier = 0.3
      break
  }
}

function applyMomentumModifiers(
  modifiers: DirectorEventModifiers,
  state: DirectorState,
  config: DirectorConfig
): void {
  const streak = state.momentumStreak

  if (needsComebackAssist(state.momentum)) {
    modifiers.sentimentBias = 'bullish'
    COMEBACK_CATEGORIES.forEach(cat => modifiers.preferredCategories.add(cat))
    modifiers.chainProbabilityMultiplier *= 1.3

    if (state.momentum === 'desperate') {
      modifiers.volatilityMultiplier *= 0.9
    }
  } else if (needsChallenge(state.momentum)) {
    // Let the streak build before rubber-banding
    if (streak >= 3) {
      modifiers.sentimentBias = 'bearish'
      modifiers.volatilityMultiplier *= (1.2 + config.intensity * 0.3)
      CHALLENGE_CATEGORIES.forEach(cat => modifiers.preferredCategories.add(cat))
    }
  } else if (state.momentum === 'winning') {
    if (streak >= 3 && Math.random() < 0.3) {
      modifiers.sentimentBias = 'bearish'
    }
  } else if (state.momentum === 'struggling') {
    if (streak >= 3 && Math.random() < 0.4) {
      modifiers.sentimentBias = 'bullish'
    }
  }
}

function applyDopamineModifiers(
  modifiers: DirectorEventModifiers,
  state: DirectorState
): void {
  if (state.dopamineDebt > 0.7) {
    modifiers.volatilityMultiplier *= 1.5
  }
  if (state.dopamineDebt > 0.9) {
    modifiers.forceEventType = 'spike'
  }
}

function applyBoringStretchModifiers(
  modifiers: DirectorEventModifiers,
  state: DirectorState,
  config: DirectorConfig
): void {
  if (state.boringStretch >= config.maxBoringStretch) {
    modifiers.volatilityMultiplier = Math.max(modifiers.volatilityMultiplier, 1.3)
    modifiers.chainProbabilityMultiplier = Math.max(modifiers.chainProbabilityMultiplier, 1.5)

    if (!modifiers.forceEventType) {
      modifiers.forceEventType = 'chain'
    }
  }
}

function applyThemeModifiers(
  modifiers: DirectorEventModifiers,
  state: DirectorState
): void {
  if (state.activeTheme === 'none' || state.themeStrength <= 0.3) return

  // Boost theme's primary category (4x at full strength, ~1.9x at threshold)
  const primaryCategory = THEME_TO_CATEGORY[state.activeTheme]
  if (primaryCategory) {
    modifiers.categoryBoosts[primaryCategory] =
      (modifiers.categoryBoosts[primaryCategory] || 1) * (1 + state.themeStrength * 3)
  }

  const conflicts = THEME_CONFLICTS[state.activeTheme] || []
  conflicts.forEach(cat => {
    modifiers.blockedCategories.add(cat)
  })
}

function applyVarietyModifiers(
  modifiers: DirectorEventModifiers,
  recentCategories: string[],
  state: DirectorState
): void {
  const themeCategory = state.activeTheme !== 'none'
    ? THEME_TO_CATEGORY[state.activeTheme]
    : null

  // Reduce probability of recently-used categories (theme category exempt)
  recentCategories.forEach((cat, index) => {
    if (cat === themeCategory) return
    const recencyPenalty = Math.pow(0.5, index + 1) // 0.5, 0.25, 0.125...
    modifiers.categoryBoosts[cat] =
      (modifiers.categoryBoosts[cat] || 1) * recencyPenalty
  })
}

export function getRecentCategories(
  newsHistory: Array<{ category?: string }>,
  limit: number = 5
): string[] {
  return newsHistory
    .slice(-limit)
    .map(item => item.category)
    .filter((cat): cat is string => typeof cat === 'string')
    .reverse()
}

export function shouldForceEvent(modifiers: DirectorEventModifiers): boolean {
  return modifiers.forceEventType !== null ||
    modifiers.volatilityMultiplier > 1.3 ||
    modifiers.chainProbabilityMultiplier > 1.3
}
