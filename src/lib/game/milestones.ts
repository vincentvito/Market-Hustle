// =============================================================================
// MILESTONE SYSTEM
// Celebrates net worth achievements with news panel takeover
// =============================================================================

export type MilestoneTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'impossible'

export interface MilestoneDefinition {
  id: string
  threshold: number
  title: string
  subtitle: string
  tier: MilestoneTier
  scarcityMessage: string
}

// Milestone definitions from $500K to $100B
export const MILESTONES: MilestoneDefinition[] = [
  { id: '500k', threshold: 500_000, title: 'HALF MILLIONAIRE', subtitle: 'The first taste of wealth', tier: 'common', scarcityMessage: 'Top 40% of players' },
  { id: '1m', threshold: 1_000_000, title: 'MILLIONAIRE', subtitle: "You've made it", tier: 'common', scarcityMessage: 'Top 35% of players' },
  { id: '2_5m', threshold: 2_500_000, title: 'MULTI-MILLIONAIRE', subtitle: 'Money makes money', tier: 'uncommon', scarcityMessage: 'Top 15% of players' },
  { id: '5m', threshold: 5_000_000, title: 'HIGH ROLLER', subtitle: 'The big leagues', tier: 'uncommon', scarcityMessage: 'Top 10% of players' },
  { id: '10m', threshold: 10_000_000, title: 'WALL STREET LEGEND', subtitle: "They'll write about you", tier: 'rare', scarcityMessage: 'Top 5% of players' },
  { id: '25m', threshold: 25_000_000, title: 'HEDGE FUND TITAN', subtitle: 'Moving markets', tier: 'rare', scarcityMessage: 'Top 3% of players' },
  { id: '50m', threshold: 50_000_000, title: 'MARKET MAKER', subtitle: 'You are the market', tier: 'epic', scarcityMessage: 'Top 1% of players' },
  { id: '100m', threshold: 100_000_000, title: 'BILLIONAIRE VIBES', subtitle: 'Three commas energy', tier: 'epic', scarcityMessage: 'Top 0.5% of players' },
  { id: '250m', threshold: 250_000_000, title: 'FINANCIAL SINGULARITY', subtitle: 'Beyond comprehension', tier: 'legendary', scarcityMessage: 'Top 0.1% of players' },
  { id: '500m', threshold: 500_000_000, title: 'MONEY PRINTER', subtitle: 'Wealth creation machine', tier: 'legendary', scarcityMessage: 'Top 0.05% of players' },
  { id: '1b', threshold: 1_000_000_000, title: 'GENERATIONAL WEALTH', subtitle: 'Dynasties begin here', tier: 'mythic', scarcityMessage: 'Top 0.01% of players' },
  { id: '10b', threshold: 10_000_000_000, title: 'ECONOMY BREAKER', subtitle: 'GDP of a small nation', tier: 'mythic', scarcityMessage: 'Top 0.001% of players' },
  { id: '100b', threshold: 100_000_000_000, title: 'YOU BROKE THE SIMULATION', subtitle: "This shouldn't be possible", tier: 'impossible', scarcityMessage: '< 100 players ever' },
]

// Tier colors for styling
export const TIER_COLORS: Record<MilestoneTier, string> = {
  common: '#22c55e',      // green
  uncommon: '#eab308',    // yellow
  rare: '#a855f7',        // purple
  epic: '#f97316',        // orange
  legendary: '#ffffff',   // white
  mythic: '#06b6d4',      // cyan
  impossible: '#22c55e',  // matrix green
}

// Check if a new milestone was reached
export function checkMilestone(
  netWorth: number,
  reachedMilestones: string[]
): MilestoneDefinition | null {
  // Find the highest milestone we've crossed that we haven't reached yet
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    const milestone = MILESTONES[i]
    if (netWorth >= milestone.threshold && !reachedMilestones.includes(milestone.id)) {
      return milestone
    }
  }
  return null
}

// Get all milestones that should be marked as reached for a given net worth
// (handles case where player jumps multiple milestones at once)
export function getAllReachedMilestones(
  netWorth: number,
  existingReached: string[]
): string[] {
  const newReached = [...existingReached]
  for (const milestone of MILESTONES) {
    if (netWorth >= milestone.threshold && !newReached.includes(milestone.id)) {
      newReached.push(milestone.id)
    }
  }
  return newReached
}
