// Category Correlation Matrix
// Defines how events in each category ripple into other categories

import type { RippleDefinition } from './types'

// =============================================================================
// CATEGORY RIPPLE DEFAULTS
// =============================================================================

/**
 * Default ripple definitions by source category.
 * These are used when an event doesn't have a specific ripple override.
 * High-impact events can override these with custom definitions.
 */
export const CATEGORY_RIPPLE_DEFAULTS: Record<string, Partial<RippleDefinition>> = {
  // ===========================================================================
  // CRISIS CATEGORIES (Strong, long-lasting ripples)
  // ===========================================================================

  /**
   * Geopolitical events create fear, boost safe havens and defense,
   * suppress risk assets and emerging markets.
   */
  geopolitical: {
    activationChance: 0.80,
    boosts: {
      energy: 1.5,
    },
    suppresses: {
      tech: 0.7,
      crypto: 0.8,
      ev: 0.8,
    },
    sentimentPush: 'bearish',
    baseDuration: 4,
    baseStrength: 0.9,
    decayRate: 0.25,
  },

  /**
   * Black swan events have maximum ripple effect.
   * Boost crisis-response categories, suppress everything else.
   */
  blackswan: {
    activationChance: 0.90,
    boosts: {
      recovery: 1.4,
      geopolitical: 1.3,
    },
    suppresses: {
      tech: 0.6,
      crypto: 0.6,
      ev: 0.7,
      tesla: 0.7,
    },
    sentimentPush: 'bearish',
    baseDuration: 5,
    baseStrength: 1.0,
    decayRate: 0.20,
  },

  // ===========================================================================
  // SECTOR CATEGORIES (Moderate ripples)
  // ===========================================================================

  /**
   * Tech events can ripple into crypto.
   * Sentiment depends on specific event.
   */
  tech: {
    activationChance: 0.70,
    boosts: {
      crypto: 1.2,
    },
    suppresses: {},
    sentimentPush: undefined, // Depends on event sentiment
    baseDuration: 2,
    baseStrength: 0.6,
    decayRate: 0.35,
  },

  /**
   * Crypto events often trigger regulatory response.
   * Isolated from broader market.
   */
  crypto: {
    activationChance: 0.75,
    boosts: {},
    suppresses: {
      tech: 0.9,
    },
    sentimentPush: undefined,
    baseDuration: 3,
    baseStrength: 0.7,
    decayRate: 0.30,
  },

  /**
   * Energy events ripple into economic and transportation.
   * Can trigger geopolitical follow-ups.
   */
  energy: {
    activationChance: 0.80,
    boosts: {
      geopolitical: 1.2,
    },
    suppresses: {
      ev: 0.8,
      tesla: 0.85,
    },
    sentimentPush: undefined,
    baseDuration: 3,
    baseStrength: 0.8,
    decayRate: 0.28,
  },

  /**
   * Tesla events are mostly isolated but can affect EV sector.
   */
  tesla: {
    activationChance: 0.65,
    boosts: {
      ev: 1.3,
      tech: 1.1,
    },
    suppresses: {},
    sentimentPush: undefined,
    baseDuration: 2,
    baseStrength: 0.5,
    decayRate: 0.40,
  },

  /**
   * EV events ripple into energy and tesla.
   */
  ev: {
    activationChance: 0.65,
    boosts: {
      tesla: 1.3,
      energy: 1.2,
    },
    suppresses: {},
    sentimentPush: undefined,
    baseDuration: 2,
    baseStrength: 0.5,
    decayRate: 0.40,
  },

  /**
   * Agriculture events can trigger economic and transportation ripples.
   */
  agriculture: {
    activationChance: 0.75,
    boosts: {
      energy: 1.2,
    },
    suppresses: {},
    sentimentPush: undefined,
    baseDuration: 3,
    baseStrength: 0.7,
    decayRate: 0.30,
  },

  /**
   * Recovery events can weaken bearish ripples and boost optimism.
   */
  recovery: {
    activationChance: 0.60,
    boosts: {
      tech: 1.2,
      crypto: 1.2,
    },
    suppresses: {},
    sentimentPush: 'bullish',
    baseDuration: 2,
    baseStrength: 0.5,
    decayRate: 0.40,
  },

  /**
   * Biotech events ripple into tech (shared innovation narrative).
   * Slightly suppress crypto attention (capital rotation).
   */
  biotech: {
    activationChance: 0.70,
    boosts: {
      tech: 1.2,
    },
    suppresses: {
      crypto: 0.9,
    },
    sentimentPush: undefined,
    baseDuration: 3,
    baseStrength: 0.6,
    decayRate: 0.30,
  },
}

// =============================================================================
// HIGH-IMPACT EVENT RIPPLE OVERRIDES
// =============================================================================

/**
 * Specific ripple definitions for high-impact events.
 * These override category defaults when the event fires.
 * Key is the event headline (must match exactly).
 */
export const HIGH_IMPACT_RIPPLE_OVERRIDES: Record<string, RippleDefinition> = {
  // ===========================================================================
  // CRITICAL IMPACT (Always triggers, long duration)
  // ===========================================================================

  'BREAKING: 9.2 EARTHQUAKE DEVASTATES SAN FRANCISCO': {
    activationChance: 0.95,
    boosts: {
      recovery: 1.5,
    },
    suppresses: {
      tech: 0.5,
      crypto: 0.6,
      tesla: 0.5,
    },
    sentimentPush: 'bearish',
    baseDuration: 6,
    baseStrength: 1.0,
    decayRate: 0.15,
  },

  'GLOBAL SUPPLY CHAIN MELTDOWN - SHORTAGES SPREAD': {
    activationChance: 0.90,
    boosts: {
      energy: 1.4,
    },
    suppresses: {
      tech: 0.7,
      crypto: 0.75,
      ev: 0.7,
    },
    sentimentPush: 'bearish',
    baseDuration: 4,
    baseStrength: 0.95,
    decayRate: 0.22,
  },

  // ===========================================================================
  // HIGH IMPACT (Usually triggers, moderate duration)
  // ===========================================================================

  'NORD STREAM PIPELINE SABOTAGED': {
    activationChance: 0.90,
    boosts: {
      geopolitical: 1.8,
      energy: 1.7,
    },
    suppresses: {
      tech: 0.75,
      crypto: 0.8,
      ev: 0.75,
    },
    sentimentPush: 'bearish',
    baseDuration: 4,
    baseStrength: 0.9,
    decayRate: 0.22,
  },

  'MAJOR EXCHANGE FILES BANKRUPTCY': {
    activationChance: 0.85,
    boosts: {},
    suppresses: {
      crypto: 0.5,
      tech: 0.85,
    },
    sentimentPush: 'bearish',
    baseDuration: 4,
    baseStrength: 0.9,
    decayRate: 0.25,
  },

  'OIL TANKER EXPLODES IN STRAIT OF HORMUZ — SUPPLY ROUTE THREATENED': {
    activationChance: 0.85,
    boosts: {
      geopolitical: 1.6,
      energy: 1.7,
    },
    suppresses: {
      tech: 0.8,
      ev: 0.75,
    },
    sentimentPush: 'bearish',
    baseDuration: 3,
    baseStrength: 0.8,
    decayRate: 0.28,
  },

  // ===========================================================================
  // MEDIUM IMPACT (Moderate trigger chance)
  // ===========================================================================

  'MULTIPLE LABS REPLICATE FUSION RESULT — ENERGY REVOLUTION CONFIRMED': {
    activationChance: 0.75,
    boosts: {
      tech: 1.5,
      ev: 1.3, // Clean energy boosts EV adoption
    },
    suppresses: {
      energy: 0.8, // Traditional energy suppressed by fusion
    },
    sentimentPush: 'bullish',
    baseDuration: 3,
    baseStrength: 0.7,
    decayRate: 0.30,
  },

  'TESLA REPORTS RECORD DELIVERIES': {
    activationChance: 0.65,
    boosts: {
      ev: 1.4,
      tech: 1.2,
    },
    suppresses: {},
    sentimentPush: 'bullish',
    baseDuration: 2,
    baseStrength: 0.6,
    decayRate: 0.35,
  },

  // China semiconductor dominance - catastrophic for US tech
  'CHINA UNVEILS NEXT-GEN CHIP - 25X MORE POWERFUL THAN NVIDIA H100': {
    activationChance: 0.90,
    boosts: {
      geopolitical: 1.8,
    },
    suppresses: {
      tech: 0.5,
      ev: 0.7,
    },
    sentimentPush: 'bearish',
    baseDuration: 5,
    baseStrength: 0.95,
    decayRate: 0.20,
  },
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get ripple definition for an event.
 * Checks for specific override first, then falls back to category default.
 */
export function getRippleDefinition(
  headline: string,
  category: string
): Partial<RippleDefinition> | null {
  // Check for specific override
  if (HIGH_IMPACT_RIPPLE_OVERRIDES[headline]) {
    return HIGH_IMPACT_RIPPLE_OVERRIDES[headline]
  }

  // Fall back to category default
  return CATEGORY_RIPPLE_DEFAULTS[category] ?? null
}
