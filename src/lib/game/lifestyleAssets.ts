import { LifestyleAsset, LuxuryAsset, LuxuryAssetId, PEAbility, PEAbilityId } from './types'

// =============================================================================
// PE ABILITIES - One-time villain actions with 20% backfire risk
// =============================================================================
export const PE_ABILITIES: Record<PEAbilityId, PEAbility> = {
  // Sal's Corner abilities
  defense_spending_bill: {
    id: 'defense_spending_bill',
    name: 'Defense Spending Bill',
    emoji: '🎖️',
    flavor: 'Lobby Congress to pass increased defense spending',
    cost: 3_000_000,
    successEffects: { defense: 0.30, uranium: 0.20, oil: 0.15 },
    backfireEffects: {
      priceEffects: { defense: -0.15 },
      triggerEncounter: 'sec', // SEC encounter = FBI investigation in-game
    },
    backfireChance: 0.20,
  },
  drug_fast_track: {
    id: 'drug_fast_track',
    name: 'Drug Fast-Track Act',
    emoji: '💊',
    flavor: 'Lobby Congress to deregulate drug approval process',
    cost: 3_000_000,
    successEffects: { biotech: 0.35, nasdaq: 0.12 },
    backfireEffects: {
      priceEffects: { biotech: -0.20 },
      fine: 5_000_000,
    },
    backfireChance: 0.20,
  },
  // Blackstone abilities
  yemen_operations: {
    id: 'yemen_operations',
    name: 'Yemen Operations',
    emoji: '⚓',
    flavor: 'Support rebels in Yemen, destabilize shipping routes',
    cost: 50_000_000,
    successEffects: { oil: 0.40, gold: 0.20, emerging: -0.25 },
    backfireEffects: {
      priceEffects: { oil: -0.20 },
      losePE: true,
    },
    backfireChance: 0.20,
  },
  chile_acquisition: {
    id: 'chile_acquisition',
    name: 'Chile Acquisition',
    emoji: '⛏️',
    flavor: 'Seize lithium mine in Chile',
    cost: 50_000_000,
    successEffects: { lithium: 0.60, tesla: -0.15, emerging: -0.15 }, // Tesla DOWN - lithium squeeze hurts battery costs
    backfireEffects: {
      priceEffects: { lithium: -0.30 },
      fine: 100_000_000,
    },
    backfireChance: 0.20,
  },
  // Lazarus Genomics ability
  project_chimera: {
    id: 'project_chimera',
    name: 'Project Chimera',
    emoji: '🦠',
    flavor: 'Develop a pathogen to trigger a new pandemic',
    cost: 100_000_000,
    // Phase 1 (Day N+1): Liquidation crash - panic selling across markets
    successEffects: { oil: -0.30, nasdaq: -0.20, emerging: -0.30 },
    // Phase 2 (Day N+2): Recovery - flight to safety + vaccine plays
    phase2Effects: {
      effects: { biotech: 0.50, gold: 0.25, btc: 0.20 },
      headline: 'VACCINE RACE BEGINS - BIOTECH STOCKS SURGE AS INVESTORS SEEK SAFETY',
    },
    backfireEffects: {
      priceEffects: { biotech: -0.25 },
      losePE: true,
      gameOverRisk: 0.50, // 50% chance of FBI investigation = game over
    },
    backfireChance: 0.20,
  },
  // Apex Media ability
  operation_divide: {
    id: 'operation_divide',
    name: 'Operation Divide',
    emoji: '🇺🇸',
    flavor: 'Spread misinformation to polarize US public opinion',
    cost: 25_000_000,
    successEffects: { gold: 0.35, btc: 0.20, nasdaq: -0.18 },
    backfireEffects: {
      priceEffects: { nasdaq: -0.25 },
      losePE: true,
    },
    backfireChance: 0.20,
    specialEffect: {
      type: 'event_trigger',
      eventCategory: 'civil_war',
      chance: 0.50,
    },
  },
  // Apex Media endgame ability
  run_for_president: {
    id: 'run_for_president',
    name: 'Run for President',
    emoji: '🏛️',
    flavor: 'Launch a presidential campaign using your media empire. $12B entry. 50/50 odds. Winner takes the Oval Office.',
    cost: 12_000_000_000,
    successEffects: {}, // No market effects - unlocks presidency
    backfireEffects: {
      priceEffects: {}, // Apex Media -50% handled specially
      // FBI heat +40 handled specially
    },
    backfireChance: 0.50, // 50/50 election
  },
}

// Helper to get abilities for a PE company
export function getPEAbilities(peAssetId: string): PEAbility[] {
  const abilityMap: Record<string, PEAbilityId[]> = {
    pe_sals_corner: ['defense_spending_bill', 'drug_fast_track'],
    pe_blackstone_services: ['yemen_operations', 'chile_acquisition'],
    pe_lazarus_genomics: ['project_chimera'],
    pe_apex_media: ['operation_divide', 'run_for_president'],
  }
  const abilityIds = abilityMap[peAssetId] || []
  return abilityIds.map(id => PE_ABILITIES[id])
}

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
    id: 'private_island',
    name: 'Private Island',
    emoji: '🏝️',
    category: 'property',
    basePrice: 150_000_000,
    volatility: 0.02,
    dailyReturn: 0.018, // 1.8% daily
    description: 'Caribbean paradise. 500 acres of white sand, your own airstrip, total privacy.',
  },
  {
    id: 'rockefeller_center',
    name: 'Rockefeller Center NY',
    emoji: '🏛️',
    category: 'property',
    basePrice: 4_500_000_000,
    volatility: 0.015,
    dailyReturn: 0.015, // 1.5% daily
    description: 'NYC landmark. 22 acres of prime Manhattan. The ultimate trophy asset.',
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
    basePrice: 2_500_000,
    volatility: 0.03,     // Added volatility for balance
    dailyReturn: 0.05,    // 5%/day - standard blue chip return
    description: 'Defense industry lobbyist. K Street connections. Congressional golf buddies.',
    failureChancePerDay: 0.001, // ~3%/month
    // Abilities: defense_spending_bill, drug_fast_track (via getPEAbilities)
  },
  {
    id: 'pe_iron_oak_brewing',
    name: 'Iron Oak Brewing Co.',
    emoji: '🍺',
    category: 'private_equity',
    basePrice: 4_600_000,
    volatility: 0.04,
    dailyReturn: 0.05, // 5%/day
    description: 'Craft brewery with cult following. Two taprooms, 200+ bar distribution.',
    failureChancePerDay: 0.001, // ~3%/month
    // No operation - passive income only. Boosted by GenZ drinking news events.
  },
  {
    id: 'pe_tenuta_luna',
    name: 'Tenuta della Luna',
    emoji: '🍷',
    category: 'private_equity',
    basePrice: 24_000_000,
    volatility: 0.04,
    dailyReturn: 0.05, // 5%/day
    description: 'Tuscan vineyard. 80-hectare estate in Chianti Classico. 40K bottles annually.',
    failureChancePerDay: 0.001, // ~3%/month
    // No operation - passive income only. Boosted by rare wine events.
  },
  {
    id: 'pe_vegas_casino',
    name: 'Las Vegas Casino',
    emoji: '🎰',
    category: 'private_equity',
    basePrice: 1_000_000_000,
    volatility: 0.04,
    dailyReturn: 0.05, // 5%/day
    description: 'Sin City landmark. House always wins. Whales, shows, and rooms.',
    failureChancePerDay: 0.001, // ~3%/month
    // No operation - passive income only
  },

  // === GROWTH TIER - High risk, high reward ===
  {
    id: 'pe_blackstone_services',
    name: 'Blackstone Strategic Services',
    emoji: '🎖️',
    category: 'private_equity',
    basePrice: 3_000_000_000,
    volatility: 0.05,
    dailyReturn: 0.07, // 7%/day
    description: 'Private military contractor. Government contracts, covert operations.',
    failureChancePerDay: 0.003, // ~9%/month
    // Abilities: yemen_operations, chile_acquisition (via getPEAbilities)
  },
  {
    id: 'pe_lazarus_genomics',
    name: 'Lazarus Genomics',
    emoji: '🧬',
    category: 'private_equity',
    basePrice: 5_000_000_000,
    volatility: 0.07,
    dailyReturn: 0.06, // 6%/day
    description: 'Synthetic biology startup. Gain-of-function research. BSL-4 clearance.',
    failureChancePerDay: 0.005, // ~15%/month - highest risk
    // Abilities: project_chimera (via getPEAbilities)
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
    failureChancePerDay: 0.003, // ~9%/month
    // Abilities: operation_divide (via getPEAbilities)
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

// =============================================================================
// LUXURY ASSETS - Expensive toys with passive benefits
// Fixed price, fixed daily cost, no price fluctuation
// =============================================================================
export const LUXURY_ASSETS: LuxuryAsset[] = [
  {
    id: 'private_jet',
    name: 'Private Jet',
    emoji: '✈️',
    basePrice: 15_000_000,
    dailyCost: 250_000,
    description: 'G650ER. Skip the lines, close deals at 45,000 feet.',
    passiveBenefit: '+20% deal frequency',
  },
  {
    id: 'art_collection',
    name: 'Art Collection',
    emoji: '🎨',
    basePrice: 25_000_000,
    dailyCost: 50_000,
    description: 'Basquiat. Warhol. Banksy. Status symbol.',
    passiveBenefit: 'Reduces tax events',
  },
  {
    id: 'mega_yacht',
    name: 'Mega Yacht',
    emoji: '🛥️',
    basePrice: 80_000_000,
    dailyCost: 800_000,
    description: '85m custom build. Helicopter pad. Submarine bay.',
    passiveBenefit: '-15% PE prices',
  },
  {
    id: 'ferrari_f1_team',
    name: 'Ferrari F1 Team',
    emoji: '🏎️',
    basePrice: 3_500_000_000,
    dailyCost: 15_000_000,
    description: 'Prancing horse. Global brand. Championship dreams.',
    passiveBenefit: 'Flex',
  },
  {
    id: 'la_lakers',
    name: 'LA Lakers',
    emoji: '🏀',
    basePrice: 7_000_000_000,
    dailyCost: 30_000_000,
    description: 'Championship rings. Courtside seats. Hollywood elite.',
    passiveBenefit: 'Flex',
  },
  {
    id: 'star_wars_franchise',
    name: 'Star Wars Franchise',
    emoji: '⭐',
    basePrice: 65_000_000_000,
    dailyCost: -650_000_000, // NEGATIVE = generates income (+1%/day)
    description: 'A galaxy far, far away. Yours to control.',
    passiveBenefit: '+1%/day income',
  },
  {
    id: 'greenland',
    name: 'Greenland',
    emoji: '🇬🇱',
    basePrice: 1_000_000_000_000,
    dailyCost: 1_000_000_000,
    description: 'Strategic territory. Rare earth minerals. Ice.',
    passiveBenefit: 'Flex',
  },
]

// Helper to get luxury asset by ID
export function getLuxuryAsset(id: LuxuryAssetId): LuxuryAsset | undefined {
  return LUXURY_ASSETS.find(a => a.id === id)
}
