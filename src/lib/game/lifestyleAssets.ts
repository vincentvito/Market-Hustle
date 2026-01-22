import { LifestyleAsset } from './types'

// =============================================================================
// PROPERTIES - Generate rental income (5% daily of purchase price)
// =============================================================================
export const PROPERTIES: LifestyleAsset[] = [
  {
    id: 'miami_condo',
    name: 'Miami Beach Condo',
    emoji: '🏢',
    category: 'property',
    basePrice: 450_000,
    volatility: 0.02,
    dailyReturn: 0.05, // 5% daily rental income
    description: 'Oceanfront 2BR in South Beach. Prime Airbnb territory.',
  },
  {
    id: 'nyc_apartment',
    name: 'NYC Penthouse',
    emoji: '🏙️',
    category: 'property',
    basePrice: 2_500_000,
    volatility: 0.015,
    dailyReturn: 0.05, // 5% daily
    description: 'Manhattan skyline views. Corporate housing goldmine.',
  },
  {
    id: 'la_mansion',
    name: 'Hollywood Hills Estate',
    emoji: '🏛️',
    category: 'property',
    basePrice: 8_000_000,
    volatility: 0.025,
    dailyReturn: 0.05, // 5% daily
    description: 'Film location rentals. Celeb neighbor potential.',
  },
  {
    id: 'monaco_villa',
    name: 'Monaco Villa',
    emoji: '🏰',
    category: 'property',
    basePrice: 25_000_000,
    volatility: 0.02,
    dailyReturn: 0.05, // 5% daily
    description: 'Tax haven paradise. F1 weekend jackpot.',
  },
  {
    id: 'dubai_palace',
    name: 'Dubai Palm Palace',
    emoji: '🕌',
    category: 'property',
    basePrice: 50_000_000,
    volatility: 0.03,
    dailyReturn: 0.05, // 5% daily
    description: 'Oil sheikh neighbors. Ultimate flex property.',
  },
]

// =============================================================================
// JETS - Fixed daily maintenance cost. Owning a jet increases chances of
// high-multiplier VC investment opportunities appearing.
// =============================================================================
export const JETS: LifestyleAsset[] = [
  {
    id: 'jet_citation',
    name: 'Cessna Citation',
    emoji: '🛩️',
    category: 'jet',
    basePrice: 3_000_000,
    volatility: 0.01,
    dailyReturn: -15_000, // Fixed $15K/day maintenance
    vcDealBoost: 0.10, // +10% VC deal chance
    description: 'Entry-level private. 6 seats. +10% VC deal chance.',
  },
  {
    id: 'jet_challenger',
    name: 'Bombardier Challenger',
    emoji: '✈️',
    category: 'jet',
    basePrice: 15_000_000,
    volatility: 0.015,
    dailyReturn: -50_000, // Fixed $50K/day maintenance
    vcDealBoost: 0.20, // +20% VC deal chance
    description: 'Mid-size luxury. 10 seats. +20% VC deal chance.',
  },
  {
    id: 'jet_gulfstream',
    name: 'Gulfstream G650',
    emoji: '🛫',
    category: 'jet',
    basePrice: 65_000_000,
    volatility: 0.02,
    dailyReturn: -150_000, // Fixed $150K/day maintenance
    vcDealBoost: 0.30, // +30% VC deal chance
    description: 'Ultra-long range. NYC to Tokyo nonstop. +30% VC deal chance.',
  },
  {
    id: 'jet_global',
    name: 'Bombardier Global 7500',
    emoji: '🌐',
    category: 'jet',
    basePrice: 75_000_000,
    volatility: 0.02,
    dailyReturn: -200_000, // Fixed $200K/day maintenance
    vcDealBoost: 0.40, // +40% VC deal chance
    description: 'Flying penthouse. 4 living spaces. +40% VC deal chance.',
  },
  {
    id: 'jet_bbj',
    name: 'Boeing BBJ 787',
    emoji: '👑',
    category: 'jet',
    basePrice: 250_000_000,
    volatility: 0.025,
    dailyReturn: -500_000, // Fixed $500K/day maintenance
    vcDealBoost: 0.50, // +50% VC deal chance
    description: 'Flying mansion. Master suite, office. +50% VC deal chance.',
  },
]

// =============================================================================
// SPORTS TEAMS - Generate revenue (0.2-0.4% daily), prices swing with performance
// =============================================================================
export const TEAMS: LifestyleAsset[] = [
  {
    id: 'team_mls',
    name: 'MLS Franchise',
    emoji: '⚽',
    category: 'team',
    basePrice: 500_000_000,
    volatility: 0.04,
    dailyReturn: 0.002, // 0.2% daily
    description: 'Growing US soccer market. Stadium revenue.',
  },
  {
    id: 'team_nhl',
    name: 'NHL Franchise',
    emoji: '🏒',
    category: 'team',
    basePrice: 800_000_000,
    volatility: 0.035,
    dailyReturn: 0.0025, // 0.25% daily
    description: 'Loyal fanbase. Canadian TV money.',
  },
  {
    id: 'team_nba',
    name: 'NBA Franchise',
    emoji: '🏀',
    category: 'team',
    basePrice: 3_000_000_000,
    volatility: 0.03,
    dailyReturn: 0.003, // 0.3% daily
    description: 'Global brand potential. Streaming rights boom.',
  },
  {
    id: 'team_nfl',
    name: 'NFL Franchise',
    emoji: '🏈',
    category: 'team',
    basePrice: 5_000_000_000,
    volatility: 0.025,
    dailyReturn: 0.0035, // 0.35% daily
    description: 'Most valuable league. TV deal machine.',
  },
  {
    id: 'team_f1',
    name: 'F1 Racing Team',
    emoji: '🏎️',
    category: 'team',
    basePrice: 1_500_000_000,
    volatility: 0.06,
    dailyReturn: 0.002, // 0.2% daily (high volatility offsets)
    description: 'Global sponsor appeal. Netflix effect.',
  },
  {
    id: 'team_epl',
    name: 'Premier League Club',
    emoji: '🦁',
    category: 'team',
    basePrice: 2_500_000_000,
    volatility: 0.05,
    dailyReturn: 0.003, // 0.3% daily
    description: 'Worldwide fanbase. Promotion/relegation drama.',
  },
]

// All lifestyle assets combined
export const LIFESTYLE_ASSETS: LifestyleAsset[] = [
  ...PROPERTIES,
  ...JETS,
  ...TEAMS,
]

// Helper to get asset by ID
export function getLifestyleAsset(id: string): LifestyleAsset | undefined {
  return LIFESTYLE_ASSETS.find(a => a.id === id)
}

// Helper to get assets by category
export function getLifestyleAssetsByCategory(category: LifestyleAsset['category']): LifestyleAsset[] {
  return LIFESTYLE_ASSETS.filter(a => a.category === category)
}
