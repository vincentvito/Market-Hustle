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
      economic: 1.4,
      regulatory: 1.3,
      insurance: 1.2,
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
      economic: 1.5,
      regulatory: 1.6,
      insurance: 1.8,
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

  /**
   * Economic crisis events ripple into monetary policy and banking,
   * suppress growth-oriented categories.
   */
  economic: {
    activationChance: 0.75,
    boosts: {
      fed: 1.4,
      banking: 1.5,
      regulatory: 1.3,
      recovery: 1.2,
    },
    suppresses: {
      tech: 0.8,
      crypto: 0.75,
      tesla: 0.85,
      ev: 0.85,
    },
    sentimentPush: 'bearish',
    baseDuration: 3,
    baseStrength: 0.8,
    decayRate: 0.30,
  },

  // ===========================================================================
  // MONETARY POLICY (Strong, moderate duration)
  // ===========================================================================

  /**
   * Fed events have outsized impact on all markets.
   * Boost banking and economic coverage.
   */
  fed: {
    activationChance: 0.85,
    boosts: {
      banking: 1.5,
      economic: 1.4,
      regulatory: 1.2,
    },
    suppresses: {
      crypto: 0.7,
      tech: 0.85,
      tesla: 0.85,
    },
    sentimentPush: undefined, // Depends on rate direction
    baseDuration: 4,
    baseStrength: 0.9,
    decayRate: 0.25,
  },

  // ===========================================================================
  // SECTOR CATEGORIES (Moderate ripples)
  // ===========================================================================

  /**
   * Tech events can ripple into regulatory and crypto.
   * Sentiment depends on specific event.
   */
  tech: {
    activationChance: 0.70,
    boosts: {
      regulatory: 1.3,
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
    boosts: {
      regulatory: 1.4,
    },
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
      economic: 1.3,
      transportation: 1.4,
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
   * Biotech events can trigger regulatory and economic ripples.
   */
  biotech: {
    activationChance: 0.70,
    boosts: {
      regulatory: 1.3,
      economic: 1.2,
      insurance: 1.3,
    },
    suppresses: {},
    sentimentPush: undefined,
    baseDuration: 2,
    baseStrength: 0.6,
    decayRate: 0.35,
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
      economic: 1.4,
      transportation: 1.3,
      energy: 1.2,
    },
    suppresses: {},
    sentimentPush: undefined,
    baseDuration: 3,
    baseStrength: 0.7,
    decayRate: 0.30,
  },

  // ===========================================================================
  // NEW CATEGORIES (Lower ripple potential - they are consequences, not causes)
  // ===========================================================================

  /**
   * Regulatory events rarely create further ripples.
   * They are usually consequences, not causes.
   */
  regulatory: {
    activationChance: 0.50,
    boosts: {},
    suppresses: {},
    sentimentPush: undefined,
    baseDuration: 2,
    baseStrength: 0.4,
    decayRate: 0.40,
  },

  /**
   * Transportation events can ripple into economic.
   */
  transportation: {
    activationChance: 0.55,
    boosts: {
      economic: 1.2,
      energy: 1.1,
    },
    suppresses: {},
    sentimentPush: undefined,
    baseDuration: 2,
    baseStrength: 0.4,
    decayRate: 0.40,
  },

  /**
   * Banking events can ripple into economic and fed coverage.
   */
  banking: {
    activationChance: 0.65,
    boosts: {
      economic: 1.3,
      fed: 1.2,
      regulatory: 1.2,
    },
    suppresses: {},
    sentimentPush: undefined,
    baseDuration: 2,
    baseStrength: 0.5,
    decayRate: 0.35,
  },

  /**
   * Insurance events are consequences, minimal ripple.
   */
  insurance: {
    activationChance: 0.45,
    boosts: {
      regulatory: 1.1,
    },
    suppresses: {},
    sentimentPush: undefined,
    baseDuration: 2,
    baseStrength: 0.3,
    decayRate: 0.45,
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
    suppresses: {
      economic: 0.8,
    },
    sentimentPush: 'bullish',
    baseDuration: 2,
    baseStrength: 0.5,
    decayRate: 0.40,
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

  'WHO DECLARES NEW PANDEMIC': {
    activationChance: 0.95,
    boosts: {
      biotech: 1.8,
      regulatory: 1.6,
      transportation: 1.5,
      insurance: 1.4,
      economic: 1.3,
    },
    suppresses: {
      tech: 0.6,
      crypto: 0.7,
      energy: 0.75,
      ev: 0.7,
      tesla: 0.7,
    },
    sentimentPush: 'bearish',
    baseDuration: 5,
    baseStrength: 1.0,
    decayRate: 0.18,
  },

  'KIM JONG UN, NORTH KOREA LEADER - ASSASSINATED': {
    activationChance: 0.95,
    boosts: {
      geopolitical: 2.0,
      energy: 1.5,
      economic: 1.4,
      regulatory: 1.3,
    },
    suppresses: {
      tech: 0.6,
      crypto: 0.65,
      ev: 0.6,
    },
    sentimentPush: 'bearish',
    baseDuration: 5,
    baseStrength: 1.0,
    decayRate: 0.18,
  },

  '9.2 EARTHQUAKE DEVASTATES SAN FRANCISCO': {
    activationChance: 0.95,
    boosts: {
      insurance: 2.0,
      economic: 1.6,
      regulatory: 1.4,
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

  'GLOBAL SUPPLY CHAIN MELTDOWN': {
    activationChance: 0.90,
    boosts: {
      economic: 1.7,
      transportation: 1.8,
      energy: 1.4,
      regulatory: 1.3,
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
      economic: 1.4,
      regulatory: 1.3,
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

  'FLASH CRASH - DOW DROPS 1000 POINTS': {
    activationChance: 0.88,
    boosts: {
      fed: 1.6,
      banking: 1.5,
      regulatory: 1.5,
      recovery: 1.4,
      economic: 1.4,
    },
    suppresses: {
      crypto: 0.7,
    },
    sentimentPush: 'bearish',
    baseDuration: 3,
    baseStrength: 0.85,
    decayRate: 0.28,
  },

  'FED RAISES RATES 50BPS': {
    activationChance: 0.85,
    boosts: {
      banking: 1.5,
      economic: 1.4,
    },
    suppresses: {
      crypto: 0.65,
      tech: 0.8,
      tesla: 0.8,
    },
    sentimentPush: 'bearish',
    baseDuration: 4,
    baseStrength: 0.85,
    decayRate: 0.25,
  },

  'SEC APPROVES SPOT BITCOIN ETF': {
    activationChance: 0.80,
    boosts: {
      crypto: 1.8,
      regulatory: 1.3,
    },
    suppresses: {},
    sentimentPush: 'bullish',
    baseDuration: 3,
    baseStrength: 0.8,
    decayRate: 0.28,
  },

  'MAJOR EXCHANGE FILES BANKRUPTCY': {
    activationChance: 0.85,
    boosts: {
      regulatory: 1.7,
      economic: 1.3,
    },
    suppresses: {
      crypto: 0.5,
      tech: 0.85,
    },
    sentimentPush: 'bearish',
    baseDuration: 4,
    baseStrength: 0.9,
    decayRate: 0.25,
  },

  'INFLATION HITS 40-YEAR HIGH': {
    activationChance: 0.85,
    boosts: {
      fed: 1.6,
      economic: 1.5,
      banking: 1.3,
    },
    suppresses: {
      tech: 0.75,
      crypto: 0.7,
      tesla: 0.8,
    },
    sentimentPush: 'bearish',
    baseDuration: 4,
    baseStrength: 0.85,
    decayRate: 0.25,
  },

  'UNEMPLOYMENT HITS 15%': {
    activationChance: 0.85,
    boosts: {
      fed: 1.5,
      economic: 1.6,
      regulatory: 1.4,
      recovery: 1.3,
    },
    suppresses: {
      tech: 0.8,
      crypto: 0.75,
    },
    sentimentPush: 'bearish',
    baseDuration: 4,
    baseStrength: 0.85,
    decayRate: 0.25,
  },

  'OIL TANKER EXPLODES IN STRAIT OF HORMUZ': {
    activationChance: 0.85,
    boosts: {
      geopolitical: 1.6,
      energy: 1.7,
      transportation: 1.4,
      economic: 1.3,
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

  'BIG TECH ANTITRUST BREAKUP ORDERED': {
    activationChance: 0.75,
    boosts: {
      regulatory: 1.5,
      economic: 1.2,
    },
    suppresses: {
      tech: 0.7,
    },
    sentimentPush: 'bearish',
    baseDuration: 3,
    baseStrength: 0.7,
    decayRate: 0.30,
  },

  'NUCLEAR FUSION BREAKTHROUGH ACHIEVED': {
    activationChance: 0.75,
    boosts: {
      tech: 1.5,
      energy: 1.4,
    },
    suppresses: {
      energy: 0.8, // Traditional energy suppressed
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

  'AGING REVERSED IN HUMAN TRIALS': {
    activationChance: 0.70,
    boosts: {
      biotech: 1.6,
      regulatory: 1.3,
    },
    suppresses: {},
    sentimentPush: 'bullish',
    baseDuration: 3,
    baseStrength: 0.7,
    decayRate: 0.30,
  },

  // China semiconductor dominance - catastrophic for US tech
  'CHINA UNVEILS NEXT-GEN CHIP - 25X MORE POWERFUL THAN NVIDIA H100': {
    activationChance: 0.90,
    boosts: {
      geopolitical: 1.8,
      regulatory: 1.5,
      economic: 1.4,
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
