/**
 * Strategies System - Simplified 4-Strategy Version
 *
 * Meta-game advantages unlocked by owning specific PE assets.
 * Each strategy has 3 tiers: Off -> Active -> Elite
 *
 * Unlock Requirements:
 * - Private Jet: Always available (no ownership required)
 * - Lobbying: Requires Sal's Corner ownership
 * - Media Control: Requires Apex Media ownership
 * - Destabilization: Requires Blackstone ownership
 */

import type {
  StrategyTier,
  StrategyId,
  ActiveStrategy,
  PolicyId,
  DestabilizationTargetId,
} from './types'

// Re-export types for convenience
export type { StrategyTier, StrategyId, ActiveStrategy, PolicyId, DestabilizationTargetId }

// =============================================================================
// TYPES
// =============================================================================

// Unlock requirement for a strategy
export interface UnlockRequirement {
  type: 'pe_ownership' | 'none'
  assetId?: string    // PE asset ID required for ownership
  assetName?: string  // Human-readable name for UI
}

// Static strategy definition
export interface StrategyDefinition {
  id: StrategyId
  name: string
  emoji: string
  description: string
  unlockRequirement: UnlockRequirement
  netWorthGate: {
    active: number // Net worth required to unlock Active tier (0 = no gate)
    elite: number // Net worth required to unlock Elite tier (0 = no gate)
  }
  tiers: {
    active: {
      upfrontCost: number
      dailyCost: number
      benefits: string[]
    }
    elite: {
      upfrontCost: number // Additional cost to upgrade from Active
      dailyCost: number // Replaces Active cost
      benefits: string[]
    }
  }
}

export interface PolicyDefinition {
  id: PolicyId
  name: string
  emoji: string
  description: string
  effect: {
    category?: string // Which event category is boosted
    positiveBoost?: number // +X% chance of positive events in category
    globalNegativeReduction?: number // -X% all negative event damage (market_manipulation only)
  }
  requiredTier: 'active' | 'elite' // market_manipulation requires elite
}

// Destabilization target region
export interface DestabilizationTarget {
  id: DestabilizationTargetId
  name: string
  emoji: string
  description: string
  affectedAssets: string[] // Asset IDs that get boosted
  volatilityIncrease: number // How much more volatile affected assets become
}

// =============================================================================
// STRATEGY DEFINITIONS
// =============================================================================

export const STRATEGIES: Record<StrategyId, StrategyDefinition> = {
  privateJet: {
    id: 'privateJet',
    name: 'Private Aviation',
    emoji: '✈️',
    description: 'Access exclusive deal networks through private aviation',
    unlockRequirement: { type: 'none' }, // Always available
    netWorthGate: {
      active: 1_000_000,
      elite: 10_000_000,
    },
    tiers: {
      active: {
        upfrontCost: 500_000,
        dailyCost: 15_000,
        benefits: ['+1 Angel deal slot (3 total)', '-5% failure rate on investments'],
      },
      elite: {
        upfrontCost: 2_000_000,
        dailyCost: 40_000,
        benefits: ['+1 VC deal slot (3 total)', '-10% failure rate', 'Access to mega-deals'],
      },
    },
  },

  lobbying: {
    id: 'lobbying',
    name: 'Lobbying',
    emoji: '🏛️',
    description: 'Influence regulatory outcomes in your favor',
    unlockRequirement: {
      type: 'pe_ownership',
      assetId: 'pe_sals_corner',
      assetName: "Sal's Corner",
    },
    netWorthGate: {
      active: 0, // No net worth gate - ownership is the gate
      elite: 0,
    },
    tiers: {
      active: {
        upfrontCost: 250_000,
        dailyCost: 25_000,
        benefits: ['+15% chance regulatory events favor your holdings'],
      },
      elite: {
        upfrontCost: 1_000_000,
        dailyCost: 75_000,
        benefits: ['+35% regulatory favor', 'Push policies (escalating cost)'],
      },
    },
  },

  mediaControl: {
    id: 'mediaControl',
    name: 'Media Control',
    emoji: '📺',
    description: 'Shape the narrative around your portfolio',
    unlockRequirement: {
      type: 'pe_ownership',
      assetId: 'pe_apex_media',
      assetName: 'Apex Media Group',
    },
    netWorthGate: {
      active: 0, // No net worth gate - ownership is the gate
      elite: 0,
    },
    tiers: {
      active: {
        upfrontCost: 200_000,
        dailyCost: 15_000,
        benefits: ['-20% negative event impact on held assets'],
      },
      elite: {
        upfrontCost: 750_000,
        dailyCost: 40_000,
        benefits: ['-40% negative impact', 'Spin: Halve damage (1x/game)', 'Plant: Boost asset (1x/game, 15% backfire)'],
      },
    },
  },

  destabilization: {
    id: 'destabilization',
    name: 'Destabilization',
    emoji: '💀',
    description: 'Project power through private military operations',
    unlockRequirement: {
      type: 'pe_ownership',
      assetId: 'pe_blackstone_services',
      assetName: 'Blackstone Strategic Services',
    },
    netWorthGate: {
      active: 0, // No net worth gate - ownership is the gate
      elite: 0,
    },
    tiers: {
      active: {
        upfrontCost: 500_000,
        dailyCost: 50_000,
        benefits: [
          'Target a region for destabilization',
          '+20% commodity returns from targeted region',
          'Triggers geopolitical events',
        ],
      },
      elite: {
        upfrontCost: 2_000_000,
        dailyCost: 150_000,
        benefits: [
          '+20% commodity returns (same as Active)',
          'Execute Coup (1x/game): +50-80% commodity spike',
          'Targeted Elimination (1x/game): -25% to one sector',
        ],
      },
    },
  },
}

// =============================================================================
// DESTABILIZATION TARGETS
// =============================================================================

export const DESTABILIZATION_TARGETS: DestabilizationTarget[] = [
  {
    id: 'middle_east',
    name: 'Middle East',
    emoji: '🛢️',
    description: 'Oil-rich region. Destabilization spikes energy prices.',
    affectedAssets: ['oil', 'uranium'],
    volatilityIncrease: 0.3,
  },
  {
    id: 'asia',
    name: 'East Asia',
    emoji: '🏭',
    description: 'Manufacturing hub. Disruption affects tech supply chains.',
    affectedAssets: ['nasdaq', 'lithium'],
    volatilityIncrease: 0.25,
  },
  {
    id: 'south_america',
    name: 'South America',
    emoji: '☕',
    description: 'Commodity producer. Instability affects agriculture and mining.',
    affectedAssets: ['coffee', 'lithium', 'gold'],
    volatilityIncrease: 0.25,
  },
  {
    id: 'africa',
    name: 'Sub-Saharan Africa',
    emoji: '💎',
    description: 'Resource-rich continent. Chaos benefits rare earth mining.',
    affectedAssets: ['gold', 'uranium', 'lithium'],
    volatilityIncrease: 0.35,
  },
]

// =============================================================================
// POLICY DEFINITIONS (Lobbying)
// =============================================================================

export const POLICIES: PolicyDefinition[] = [
  {
    id: 'tech_tax',
    name: 'Tech Tax Breaks',
    emoji: '💻',
    description: '+10% positive tech events for rest of game',
    effect: { category: 'tech', positiveBoost: 0.1 },
    requiredTier: 'active',
  },
  {
    id: 'energy_subsidy',
    name: 'Energy Subsidies',
    emoji: '⚡',
    description: '+10% positive energy events for rest of game',
    effect: { category: 'energy', positiveBoost: 0.1 },
    requiredTier: 'active',
  },
  {
    id: 'crypto_dereg',
    name: 'Crypto Deregulation',
    emoji: '₿',
    description: '+10% positive crypto events for rest of game',
    effect: { category: 'crypto', positiveBoost: 0.1 },
    requiredTier: 'active',
  },
  {
    id: 'defense_spending',
    name: 'Defense Spending',
    emoji: '🚀',
    description: '+10% positive aerospace events for rest of game',
    effect: { category: 'space', positiveBoost: 0.1 },
    requiredTier: 'active',
  },
  {
    id: 'market_manipulation',
    name: 'Market Manipulation',
    emoji: '🎭',
    description: '-15% all negative event damage for rest of game',
    effect: { globalNegativeReduction: 0.15 },
    requiredTier: 'elite',
  },
]

// =============================================================================
// POLICY PUSH CONFIG (Escalating Costs)
// =============================================================================

export const POLICY_PUSH_CONFIG = {
  cooldownDays: 15,
  tiers: [
    { minAttempts: 0, cost: 500_000, successRate: 0.80 },   // 1st push: $500K, 80%
    { minAttempts: 1, cost: 1_500_000, successRate: 0.60 }, // 2nd push: $1.5M, 60%
    { minAttempts: 2, cost: 3_000_000, successRate: 0.40 }, // 3rd push: $3M, 40%
    { minAttempts: 3, cost: 5_000_000, successRate: 0.25 }, // 4th+ push: $5M, 25%
  ],
  getConfig: (attempts: number) => {
    // Return the tier that matches the current attempt count
    // Tiers are sorted ascending by minAttempts, so we find the last one that applies
    for (let i = POLICY_PUSH_CONFIG.tiers.length - 1; i >= 0; i--) {
      if (attempts >= POLICY_PUSH_CONFIG.tiers[i].minAttempts) {
        return POLICY_PUSH_CONFIG.tiers[i]
      }
    }
    return POLICY_PUSH_CONFIG.tiers[0]
  },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get strategy definition by ID
 */
export function getStrategy(id: StrategyId): StrategyDefinition {
  return STRATEGIES[id]
}

/**
 * Get all strategy IDs
 */
export function getAllStrategyIds(): StrategyId[] {
  return Object.keys(STRATEGIES) as StrategyId[]
}

/**
 * Check if player can afford to activate a strategy
 */
export function canAffordStrategy(
  strategyId: StrategyId,
  tier: 'active' | 'elite',
  cash: number,
  currentTier: StrategyTier
): boolean {
  const def = STRATEGIES[strategyId]

  if (tier === 'active') {
    return cash >= def.tiers.active.upfrontCost
  }

  // Elite upgrade - only pay elite upfront if already active
  if (currentTier === 'active') {
    return cash >= def.tiers.elite.upfrontCost
  }

  // Direct to Elite from Off - pay both
  return cash >= def.tiers.active.upfrontCost + def.tiers.elite.upfrontCost
}

/**
 * Check if player meets net worth requirement for a tier
 */
export function meetsNetWorthGate(strategyId: StrategyId, tier: 'active' | 'elite', netWorth: number): boolean {
  const def = STRATEGIES[strategyId]
  // If net worth gate is 0, it's always met (ownership-gated strategies)
  if (def.netWorthGate[tier] === 0) return true
  return netWorth >= def.netWorthGate[tier]
}

/**
 * Calculate total daily cost of all active strategies
 */
export function calculateTotalDailyCost(activeStrategies: ActiveStrategy[]): number {
  return activeStrategies.reduce((sum, s) => {
    const def = STRATEGIES[s.strategyId]
    return sum + def.tiers[s.tier].dailyCost
  }, 0)
}

/**
 * Get the tier of a specific strategy from active strategies list
 */
export function getActiveTier(strategyId: StrategyId, activeStrategies: ActiveStrategy[]): StrategyTier {
  const active = activeStrategies.find(s => s.strategyId === strategyId)
  return active?.tier ?? 'off'
}

/**
 * Check if a specific ability can still be used
 */
export function canUseAbility(
  ability: 'spin' | 'plant' | 'policy' | 'coup' | 'elimination',
  activeStrategies: ActiveStrategy[]
): boolean {
  if (ability === 'spin' || ability === 'plant') {
    const mediaControl = activeStrategies.find(s => s.strategyId === 'mediaControl')
    if (!mediaControl || mediaControl.tier !== 'elite') return false

    if (ability === 'spin') return mediaControl.abilitiesUsed.spin === undefined
    if (ability === 'plant') return mediaControl.abilitiesUsed.plant === undefined
  }

  if (ability === 'policy') {
    const lobbying = activeStrategies.find(s => s.strategyId === 'lobbying')
    if (!lobbying || lobbying.tier !== 'elite') return false
    return lobbying.abilitiesUsed.policyPushed === undefined
  }

  if (ability === 'coup') {
    const destab = activeStrategies.find(s => s.strategyId === 'destabilization')
    if (!destab || destab.tier !== 'elite') return false
    return !destab.abilitiesUsed.coupUsed
  }

  if (ability === 'elimination') {
    const destab = activeStrategies.find(s => s.strategyId === 'destabilization')
    if (!destab || destab.tier !== 'elite') return false
    return !destab.abilitiesUsed.eliminationUsed
  }

  return false
}

/**
 * Get destabilization target by ID
 */
export function getDestabilizationTarget(id: DestabilizationTargetId): DestabilizationTarget | undefined {
  return DESTABILIZATION_TARGETS.find(t => t.id === id)
}
