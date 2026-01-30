import { LifestyleAsset, OwnedLifestyleItem } from './types'

// =============================================================================
// PROPERTIES - Stable rental income (1.5-4% daily), NEVER negative
// Safe investments that generate consistent returns
// =============================================================================
export const PROPERTIES: LifestyleAsset[] = [
  // === RESIDENTIAL PROPERTIES ===
  {
    id: 'miami_condo',
    name: 'Miami Beach Condo',
    emoji: '🏢',
    category: 'property',
    basePrice: 450_000,
    volatility: 0.02,
    dailyReturn: 0.025, // 2.5% daily rental income
    description: 'Oceanfront 2BR in South Beach. Prime Airbnb territory.',
  },
  {
    id: 'nyc_apartment',
    name: 'NYC Penthouse',
    emoji: '🏙️',
    category: 'property',
    basePrice: 2_500_000,
    volatility: 0.015,
    dailyReturn: 0.02, // 2% daily
    description: 'Manhattan skyline views. Corporate housing goldmine.',
  },
  // === COMMERCIAL PROPERTIES (NEW) ===
  {
    id: 'strip_mall',
    name: 'Austin Strip Mall',
    emoji: '🏪',
    category: 'property',
    basePrice: 3_500_000,
    volatility: 0.025,
    dailyReturn: 0.035, // 3.5% daily - highest return (smaller, riskier)
    description: 'Tech corridor retail. Tenants include coffee shops, yoga studios, taco joints.',
  },
  {
    id: 'la_mansion',
    name: 'Hollywood Hills Estate',
    emoji: '🏛️',
    category: 'property',
    basePrice: 8_000_000,
    volatility: 0.025,
    dailyReturn: 0.018, // 1.8% daily
    description: 'Film location rentals. Celeb neighbor potential.',
  },
  {
    id: 'warehouse_complex',
    name: 'Dallas Warehouse Complex',
    emoji: '🏭',
    category: 'property',
    basePrice: 12_000_000,
    volatility: 0.02,
    dailyReturn: 0.03, // 3% daily - logistics boom
    description: 'E-commerce fulfillment hub. Amazon-proof location near major highways.',
  },
  {
    id: 'monaco_villa',
    name: 'Monaco Villa',
    emoji: '🏰',
    category: 'property',
    basePrice: 25_000_000,
    volatility: 0.02,
    dailyReturn: 0.015, // 1.5% daily
    description: 'Tax haven paradise. F1 weekend jackpot.',
  },
  {
    id: 'medical_plaza',
    name: 'Phoenix Medical Plaza',
    emoji: '🏥',
    category: 'property',
    basePrice: 28_000_000,
    volatility: 0.015,
    dailyReturn: 0.028, // 2.8% daily - healthcare always in demand
    description: 'Outpatient clinic hub. Triple-net leases with medical groups.',
  },
  {
    id: 'office_tower',
    name: 'Chicago Office Tower',
    emoji: '🏢',
    category: 'property',
    basePrice: 45_000_000,
    volatility: 0.025,
    dailyReturn: 0.022, // 2.2% daily - post-COVID office uncertainty
    description: 'Loop district Class A. Major law firms and consultancies.',
  },
  {
    id: 'dubai_palace',
    name: 'Dubai Palm Palace',
    emoji: '🕌',
    category: 'property',
    basePrice: 50_000_000,
    volatility: 0.03,
    dailyReturn: 0.015, // 1.5% daily
    description: 'Oil sheikh neighbors. Ultimate flex property.',
  },
  {
    id: 'shopping_center',
    name: 'Atlanta Shopping Center',
    emoji: '🛒',
    category: 'property',
    basePrice: 85_000_000,
    volatility: 0.025,
    dailyReturn: 0.022, // 2.2% daily
    description: 'Regional mall with anchor tenants. Entertainment-focused retail surviving online.',
  },
  {
    id: 'industrial_park',
    name: 'Seattle Industrial Park',
    emoji: '🏗️',
    category: 'property',
    basePrice: 150_000_000,
    volatility: 0.02,
    dailyReturn: 0.018, // 1.8% daily - stable but lower yield at scale
    description: 'Tech manufacturing campus. Data centers and cloud infrastructure.',
  },
]

// =============================================================================
// PRIVATE EQUITY - Simplified 6-asset system
// 3 prestige/income assets + 3 strategy unlock assets
// BLUE CHIP: Established businesses (~5% return, ~3% monthly failure)
// GROWTH: High risk/reward (~7-9% return, ~9-15% monthly failure)
// Sorted by price (low to high)
// =============================================================================
export const PRIVATE_EQUITY: LifestyleAsset[] = [
  // === BLUE CHIP TIER - Prestige/Income Assets ===
  {
    id: 'pe_sals_corner',
    name: "Sal's Corner",
    emoji: '🍝',
    category: 'private_equity',
    basePrice: 1_200_000,
    volatility: 0.04,
    dailyReturn: 0.05, // 5%/day
    description: 'Brooklyn Italian restaurant. Michelin Bib Gourmand. Political connections.',
    riskTier: 'blue_chip',
    failureChancePerDay: 0.001, // ~3%/month
    strategicUnlock: {
      strategyId: 'lobbying',
      bonusType: 'unlock',
      description: '🏛️ Unlocks Lobbying strategy',
    },
  },
  {
    id: 'pe_iron_oak_brewing',
    name: 'Iron Oak Brewing Co.',
    emoji: '🍺',
    category: 'private_equity',
    basePrice: 1_900_000,
    volatility: 0.04,
    dailyReturn: 0.05, // 5%/day
    description: 'Craft brewery with cult following. Two taprooms, 200+ bar distribution.',
    riskTier: 'blue_chip',
    failureChancePerDay: 0.001, // ~3%/month
  },
  {
    id: 'pe_tenuta_luna',
    name: 'Tenuta della Luna',
    emoji: '🍷',
    category: 'private_equity',
    basePrice: 4_500_000,
    volatility: 0.04,
    dailyReturn: 0.05, // 5%/day
    description: 'Tuscan vineyard. 80-hectare estate in Chianti Classico. 40K bottles annually.',
    riskTier: 'blue_chip',
    failureChancePerDay: 0.001, // ~3%/month
  },

  // === GROWTH TIER - High risk, high reward + Strategy Unlocks ===
  {
    id: 'pe_terralith_minerals',
    name: 'Terralith Minerals Corp',
    emoji: '⛏️',
    category: 'private_equity',
    basePrice: 2_800_000_000,
    volatility: 0.07,
    dailyReturn: 0.09, // 9%/day
    description: 'Rare earth mining. Critical for EVs, batteries, semiconductors, defense.',
    riskTier: 'growth',
    failureChancePerDay: 0.005, // ~15%/month
  },
  {
    id: 'pe_blackstone_services',
    name: 'Blackstone Strategic Services',
    emoji: '🎖️',
    category: 'private_equity',
    basePrice: 3_000_000_000,
    volatility: 0.05,
    dailyReturn: 0.07, // 7%/day
    description: 'Private military contractor. Government contracts, covert operations.',
    riskTier: 'growth',
    failureChancePerDay: 0.003, // ~9%/month
    strategicUnlock: {
      strategyId: 'destabilization',
      bonusType: 'unlock',
      description: '💀 Unlocks Destabilization strategy',
    },
  },
  {
    id: 'pe_apex_media',
    name: 'Apex Media Group',
    emoji: '📺',
    category: 'private_equity',
    basePrice: 12_000_000_000,
    volatility: 0.05,
    dailyReturn: 0.07, // 7%/day
    description: 'Media conglomerate. News networks, film studios, streaming platform.',
    riskTier: 'growth',
    failureChancePerDay: 0.003, // ~9%/month
    strategicUnlock: {
      strategyId: 'mediaControl',
      bonusType: 'unlock',
      description: '📺 Unlocks Media Manipulation strategy',
    },
  },
]

// All lifestyle assets combined
export const LIFESTYLE_ASSETS: LifestyleAsset[] = [
  ...PROPERTIES,
  ...PRIVATE_EQUITY,
]

// Helper to get asset by ID
export function getLifestyleAsset(id: string): LifestyleAsset | undefined {
  return LIFESTYLE_ASSETS.find(a => a.id === id)
}

// Helper to get assets by category
export function getLifestyleAssetsByCategory(category: LifestyleAsset['category']): LifestyleAsset[] {
  return LIFESTYLE_ASSETS.filter(a => a.category === category)
}

// =============================================================================
// STRATEGY UNLOCK CHECKER
// Returns which strategies are unlocked based on PE ownership
// =============================================================================
export interface StrategyUnlocks {
  lobbying: boolean      // Unlocked by Sal's Corner
  mediaControl: boolean  // Unlocked by Apex Media
  destabilization: boolean // Unlocked by Blackstone
}

export function getStrategyUnlocks(ownedLifestyle: OwnedLifestyleItem[]): StrategyUnlocks {
  const unlocks: StrategyUnlocks = {
    lobbying: false,
    mediaControl: false,
    destabilization: false,
  }

  ownedLifestyle.forEach(owned => {
    const asset = LIFESTYLE_ASSETS.find(a => a.id === owned.assetId)
    if (!asset?.strategicUnlock || asset.strategicUnlock.bonusType !== 'unlock') return

    const strategyId = asset.strategicUnlock.strategyId
    if (strategyId === 'lobbying') unlocks.lobbying = true
    if (strategyId === 'mediaControl') unlocks.mediaControl = true
    if (strategyId === 'destabilization') unlocks.destabilization = true
  })

  return unlocks
}

// Legacy function for compatibility - can be removed later
export interface StrategicBonuses {
  mediaControlEffectiveness: number
  mediaControlExposureReduction: number
  blackOpsSuccessBonus: number
  blackOpsCostReduction: number
}

export function calculateStrategicBonuses(ownedLifestyle: OwnedLifestyleItem[]): StrategicBonuses {
  // With simplified system, no numeric bonuses - just unlocks
  return {
    mediaControlEffectiveness: 0,
    mediaControlExposureReduction: 0,
    blackOpsSuccessBonus: 0,
    blackOpsCostReduction: 0,
  }
}

// =============================================================================
// RISK TIER HELPERS - Simplified two-tier system
// =============================================================================
export const RISK_TIER_COLORS: Record<string, string> = {
  blue_chip: '#3b82f6',   // Blue - stable, proven businesses
  growth: '#22c55e',      // Green - high risk, high reward
}

export const RISK_TIER_LABELS: Record<string, string> = {
  blue_chip: 'BLUE CHIP',
  growth: 'GROWTH',
}
