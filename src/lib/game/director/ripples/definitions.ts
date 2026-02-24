import type { RippleDefinition } from './types'

/** Default ripple definitions by source category (used when no specific override exists) */
export const CATEGORY_RIPPLE_DEFAULTS: Record<string, Partial<RippleDefinition>> = {
  geopolitical: {
    activationChance: 0.80,
    boosts: { energy: 1.5 },
    suppresses: { tech: 0.7, crypto: 0.8, ev: 0.8 },
    sentimentPush: 'bearish',
    baseDuration: 4,
    baseStrength: 0.9,
    decayRate: 0.25,
  },

  blackswan: {
    activationChance: 0.90,
    boosts: { recovery: 1.4, geopolitical: 1.3 },
    suppresses: { tech: 0.6, crypto: 0.6, ev: 0.7, tesla: 0.7 },
    sentimentPush: 'bearish',
    baseDuration: 5,
    baseStrength: 1.0,
    decayRate: 0.20,
  },

  tech: {
    activationChance: 0.70,
    boosts: { crypto: 1.2 },
    suppresses: {},
    sentimentPush: undefined,
    baseDuration: 2,
    baseStrength: 0.6,
    decayRate: 0.35,
  },

  crypto: {
    activationChance: 0.75,
    boosts: {},
    suppresses: { tech: 0.9 },
    sentimentPush: undefined,
    baseDuration: 3,
    baseStrength: 0.7,
    decayRate: 0.30,
  },

  energy: {
    activationChance: 0.80,
    boosts: { geopolitical: 1.2 },
    suppresses: { ev: 0.8, tesla: 0.85 },
    sentimentPush: undefined,
    baseDuration: 3,
    baseStrength: 0.8,
    decayRate: 0.28,
  },

  tesla: {
    activationChance: 0.65,
    boosts: { ev: 1.3, tech: 1.1 },
    suppresses: {},
    sentimentPush: undefined,
    baseDuration: 2,
    baseStrength: 0.5,
    decayRate: 0.40,
  },

  ev: {
    activationChance: 0.65,
    boosts: { tesla: 1.3, energy: 1.2 },
    suppresses: {},
    sentimentPush: undefined,
    baseDuration: 2,
    baseStrength: 0.5,
    decayRate: 0.40,
  },

  agriculture: {
    activationChance: 0.75,
    boosts: { energy: 1.2 },
    suppresses: {},
    sentimentPush: undefined,
    baseDuration: 3,
    baseStrength: 0.7,
    decayRate: 0.30,
  },

  recovery: {
    activationChance: 0.60,
    boosts: { tech: 1.2, crypto: 1.2 },
    suppresses: {},
    sentimentPush: 'bullish',
    baseDuration: 2,
    baseStrength: 0.5,
    decayRate: 0.40,
  },

  biotech: {
    activationChance: 0.70,
    boosts: { tech: 1.2 },
    suppresses: { crypto: 0.9 },
    sentimentPush: undefined,
    baseDuration: 3,
    baseStrength: 0.6,
    decayRate: 0.30,
  },
}

/** Specific ripple overrides for high-impact events (key = exact headline match) */
export const HIGH_IMPACT_RIPPLE_OVERRIDES: Record<string, RippleDefinition> = {
  'BREAKING: 9.2 EARTHQUAKE DEVASTATES SAN FRANCISCO': {
    activationChance: 0.95,
    boosts: { recovery: 1.5 },
    suppresses: { tech: 0.5, crypto: 0.6, tesla: 0.5 },
    sentimentPush: 'bearish',
    baseDuration: 6,
    baseStrength: 1.0,
    decayRate: 0.15,
  },

  'GLOBAL SUPPLY CHAIN MELTDOWN - SHORTAGES SPREAD': {
    activationChance: 0.90,
    boosts: { energy: 1.4 },
    suppresses: { tech: 0.7, crypto: 0.75, ev: 0.7 },
    sentimentPush: 'bearish',
    baseDuration: 4,
    baseStrength: 0.95,
    decayRate: 0.22,
  },

  'NORD STREAM PIPELINE SABOTAGED': {
    activationChance: 0.90,
    boosts: { geopolitical: 1.8, energy: 1.7 },
    suppresses: { tech: 0.75, crypto: 0.8, ev: 0.75 },
    sentimentPush: 'bearish',
    baseDuration: 4,
    baseStrength: 0.9,
    decayRate: 0.22,
  },

  'MAJOR EXCHANGE FILES BANKRUPTCY': {
    activationChance: 0.85,
    boosts: {},
    suppresses: { crypto: 0.5, tech: 0.85 },
    sentimentPush: 'bearish',
    baseDuration: 4,
    baseStrength: 0.9,
    decayRate: 0.25,
  },

  'OIL TANKER EXPLODES IN STRAIT OF HORMUZ — SUPPLY ROUTE THREATENED': {
    activationChance: 0.85,
    boosts: { geopolitical: 1.6, energy: 1.7 },
    suppresses: { tech: 0.8, ev: 0.75 },
    sentimentPush: 'bearish',
    baseDuration: 3,
    baseStrength: 0.8,
    decayRate: 0.28,
  },

  'MULTIPLE LABS REPLICATE FUSION RESULT — ENERGY REVOLUTION CONFIRMED': {
    activationChance: 0.75,
    boosts: { tech: 1.5, ev: 1.3 },
    suppresses: { energy: 0.8 },
    sentimentPush: 'bullish',
    baseDuration: 3,
    baseStrength: 0.7,
    decayRate: 0.30,
  },

  'TESLA REPORTS RECORD DELIVERIES': {
    activationChance: 0.65,
    boosts: { ev: 1.4, tech: 1.2 },
    suppresses: {},
    sentimentPush: 'bullish',
    baseDuration: 2,
    baseStrength: 0.6,
    decayRate: 0.35,
  },

  'CHINA UNVEILS NEXT-GEN CHIP - 25X MORE POWERFUL THAN NVIDIA H100': {
    activationChance: 0.90,
    boosts: { geopolitical: 1.8 },
    suppresses: { tech: 0.5, ev: 0.7 },
    sentimentPush: 'bearish',
    baseDuration: 5,
    baseStrength: 0.95,
    decayRate: 0.20,
  },
}

/** Get ripple definition: checks specific override first, then category default */
export function getRippleDefinition(
  headline: string,
  category: string
): Partial<RippleDefinition> | null {
  if (HIGH_IMPACT_RIPPLE_OVERRIDES[headline]) {
    return HIGH_IMPACT_RIPPLE_OVERRIDES[headline]
  }
  return CATEGORY_RIPPLE_DEFAULTS[category] ?? null
}
