// Dramatic Price Spike Events
// Rare events (8% daily chance) that can multiply asset prices 3x-20x
// ~60% of spikes have rumors 1-2 days before (guaranteed to happen)

export interface SpikeEvent {
  id: string
  assetId: string
  multiplier: number
  headline: string
  rumor: string | null // null = no rumor before this spike
  tier: 'common' | 'rare' | 'legendary'
  type: 'moon' | 'crash'
  secondaryEffects?: Record<string, number> // Optional % effects on other assets
}

// MOON EVENTS (positive)
export const MOON_SPIKES: SpikeEvent[] = [
  // Legendary (15x-20x)
  {
    id: 'btc_fed_adoption',
    assetId: 'btc',
    multiplier: 20,
    headline: 'US FEDERAL RESERVE ADOPTS BITCOIN STANDARD',
    rumor: 'WHISPERS FROM DC: MAJOR CRYPTO POLICY SHIFT IMMINENT',
    tier: 'legendary',
    type: 'moon',
  },
  {
    id: 'tesla_robotaxi_revolution',
    assetId: 'tesla',
    multiplier: 20,
    headline: 'TESLA ROBOTAXI LAUNCHES WORLDWIDE - UBER BANKRUPT',
    rumor: 'TESLA INSIDERS BUYING SHARES AHEAD OF MYSTERIOUS EVENT',
    tier: 'legendary',
    type: 'moon',
  },
  {
    id: 'biotech_immortality',
    assetId: 'biotech',
    multiplier: 15,
    headline: 'AGING REVERSED - BIOTECH FIRM CRACKS IMMORTALITY',
    rumor: 'BREAKTHROUGH IN LONGEVITY RESEARCH LEAKED FROM LAB',
    tier: 'legendary',
    type: 'moon',
  },

  // Rare (6x-10x)
  {
    id: 'lithium_ev_mandate',
    assetId: 'lithium',
    multiplier: 10,
    headline: 'GLOBAL EV MANDATE - LITHIUM SHORTAGE IMMINENT',
    rumor: 'AUTO INDUSTRY INSIDERS BUYING LITHIUM FUTURES',
    tier: 'rare',
    type: 'moon',
    secondaryEffects: { tesla: 0.40 }, // Tesla benefits +40% from EV mandate
  },
  {
    id: 'defense_aliens',
    assetId: 'defense',
    multiplier: 8,
    headline: 'ALIEN CONTACT CONFIRMED - DEFENSE STOCKS SURGE',
    rumor: 'PENTAGON BRIEFING SCHEDULED - TOPIC CLASSIFIED',
    tier: 'rare',
    type: 'moon',
  },
  {
    id: 'biotech_cancer_cure',
    assetId: 'biotech',
    multiplier: 6,
    headline: 'FDA APPROVES UNIVERSAL CANCER CURE',
    rumor: 'FDA FAST-TRACKING MYSTERIOUS NEW DRUG APPLICATION',
    tier: 'rare',
    type: 'moon',
  },

  // Common (3x-5x)
  {
    id: 'coffee_blight',
    assetId: 'coffee',
    multiplier: 5,
    headline: 'SOUTH AMERICA COFFEE BLIGHT - 80% HARVEST DESTROYED',
    rumor: 'REPORTS OF UNUSUAL CROP CONDITIONS IN BRAZIL',
    tier: 'common',
    type: 'moon',
  },
  {
    id: 'defense_nato',
    assetId: 'defense',
    multiplier: 4,
    headline: 'NATO DOUBLES DEFENSE BUDGETS WORLDWIDE',
    rumor: 'EUROPEAN DEFENSE MINISTERS CALLED TO EMERGENCY SUMMIT',
    tier: 'common',
    type: 'moon',
  },
  {
    id: 'oil_hormuz',
    assetId: 'oil',
    multiplier: 4,
    headline: 'MIDDLE EAST CONFLICT SHUTS DOWN STRAIT OF HORMUZ',
    rumor: 'TENSIONS RISING IN PERSIAN GULF SHIPPING LANES',
    tier: 'common',
    type: 'moon',
  },
  {
    id: 'nasdaq_unlimited_qe',
    assetId: 'nasdaq',
    multiplier: 3,
    headline: 'FED ANNOUNCES UNLIMITED QE FOREVER',
    rumor: 'FED OFFICIALS SEEN ENTERING UNSCHEDULED MEETING',
    tier: 'common',
    type: 'moon',
  },
]

// CRASH EVENTS (negative)
export const CRASH_SPIKES: SpikeEvent[] = [
  // Severe (0.1x-0.15x)
  {
    id: 'btc_satoshi_dump',
    assetId: 'btc',
    multiplier: 0.1,
    headline: "SATOSHI'S WALLET DUMPS 1M BTC ON MARKET",
    rumor: 'BLOCKCHAIN ANALYSTS TRACKING DORMANT WHALE WALLET',
    tier: 'legendary',
    type: 'crash',
  },
  {
    id: 'tesla_bankruptcy',
    assetId: 'tesla',
    multiplier: 0.1,
    headline: 'TESLA DECLARES BANKRUPTCY - ELON STEPS DOWN',
    rumor: 'TESLA EXECUTIVES QUIETLY SELLING SHARES',
    tier: 'legendary',
    type: 'crash',
  },
  {
    id: 'altcoins_tether_collapse',
    assetId: 'altcoins',
    multiplier: 0.15,
    headline: 'TETHER COLLAPSE - CRYPTO LIQUIDITY CRISIS',
    rumor: 'STABLECOIN AUDIT RESULTS DELAYED INDEFINITELY',
    tier: 'rare',
    type: 'crash',
  },

  // Moderate (0.3x-0.5x)
  {
    id: 'oil_free_energy',
    assetId: 'oil',
    multiplier: 0.3,
    headline: 'FREE ENERGY DEVICE UNVEILED - OIL OBSOLETE',
    rumor: 'ENERGY STARTUP DEMO SCHEDULED FOR MAJOR INVESTORS',
    tier: 'rare',
    type: 'crash',
  },
  {
    id: 'gold_asteroid',
    assetId: 'gold',
    multiplier: 0.4,
    headline: 'ASTEROID MINING DELIVERS 10,000 TONS OF GOLD',
    rumor: 'SPACEX ANNOUNCES SURPRISE PRESS CONFERENCE',
    tier: 'rare',
    type: 'crash',
  },
  {
    id: 'us_credit_downgrade',
    assetId: 'gold',
    multiplier: 3,
    headline: 'US CREDIT RATING DOWNGRADED - FLIGHT TO GOLD',
    rumor: 'RATING AGENCIES REVIEWING US DEBT OUTLOOK',
    tier: 'common',
    type: 'moon',
  },
]

export const ALL_SPIKES: SpikeEvent[] = [...MOON_SPIKES, ...CRASH_SPIKES]

// Spike scheduling types
export interface ScheduledSpike {
  day: number // day the spike happens
  eventId: string
  rumorDay: number | null // day the rumor appears (null = no rumor)
}

export interface ActiveSpikeRumor {
  eventId: string
  rumor: string
  spikeDay: number
}

// Pre-generate spike schedule at game start
// 8% daily chance, ~2.4 spikes per 30-day game on average
export function generateSpikeSchedule(): ScheduledSpike[] {
  const schedule: ScheduledSpike[] = []
  const usedEventIds: string[] = []
  const SPIKE_DAILY_CHANCE = 0.08
  const RUMOR_CHANCE = 0.60 // 60% of spikes have rumors

  for (let day = 2; day <= 30; day++) {
    if (Math.random() < SPIKE_DAILY_CHANCE) {
      // Pick a random spike event that hasn't been used
      const availableSpikes = ALL_SPIKES.filter(s => !usedEventIds.includes(s.id))
      if (availableSpikes.length === 0) continue

      const spike = availableSpikes[Math.floor(Math.random() * availableSpikes.length)]
      usedEventIds.push(spike.id)

      let rumorDay: number | null = null

      // 60% chance to have a rumor (if spike has one defined)
      if (spike.rumor && Math.random() < RUMOR_CHANCE) {
        // Rumor appears 1-2 days before (must be at least day 1)
        const daysAhead = Math.random() < 0.5 ? 1 : 2
        rumorDay = Math.max(1, day - daysAhead)
      }

      schedule.push({
        day,
        eventId: spike.id,
        rumorDay,
      })
    }
  }

  return schedule
}
