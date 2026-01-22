import { EventChain } from './types'

export const EVENT_CHAINS: EventChain[] = [
  // ============================================
  // GEOPOLITICAL (Taiwan) - 3 chains
  // ============================================
  {
    id: 'geo_taiwan_invasion',
    category: 'geopolitical',
    rumor: 'CHINA MOBILIZES TROOPS NEAR TAIWAN',
    duration: 1,
    outcomes: [
      {
        headline: 'CHINA INVADES TAIWAN - FULL SCALE WAR',
        probability: 0.65,
        effects: { oil: 0.45, gold: 0.35, defense: 0.40, uranium: 0.25, nasdaq: -0.30, emerging: -0.35, lithium: -0.30, tesla: -0.35 }
      },
      {
        headline: 'BEIJING BACKS DOWN AFTER US WARNING',
        probability: 0.35,
        effects: { oil: -0.15, gold: -0.10, defense: -0.18, nasdaq: 0.15, emerging: 0.18, lithium: 0.12, tesla: 0.15 }
      }
    ]
  },
  {
    id: 'geo_taiwan_blockade',
    category: 'geopolitical',
    rumor: 'TAIWAN DECLARES EMERGENCY, RECALLS DIPLOMATS',
    duration: 1,
    outcomes: [
      {
        headline: 'FULL BLOCKADE OF TAIWAN STRAIT',
        probability: 0.60,
        effects: { oil: 0.35, gold: 0.28, defense: 0.32, nasdaq: -0.28, lithium: -0.35, emerging: -0.25, tesla: -0.30 }
      },
      {
        headline: 'SURPRISE DIPLOMATIC BREAKTHROUGH',
        probability: 0.40,
        effects: { oil: -0.12, gold: -0.08, nasdaq: 0.20, lithium: 0.18, emerging: 0.22, tesla: 0.18 }
      }
    ]
  },
  {
    id: 'geo_taiwan_summit',
    category: 'geopolitical',
    rumor: 'US AND CHINA AGREE TO EMERGENCY SUMMIT',
    duration: 1,
    outcomes: [
      {
        headline: 'HISTORIC PEACE FRAMEWORK SIGNED',
        probability: 0.55,
        effects: { oil: -0.20, gold: -0.15, defense: -0.22, nasdaq: 0.22, emerging: 0.25, lithium: 0.15, tesla: 0.20 }
      },
      {
        headline: 'SUMMIT COLLAPSES - TENSIONS ESCALATE',
        probability: 0.45,
        effects: { oil: 0.25, gold: 0.20, defense: 0.25, nasdaq: -0.18, emerging: -0.20, tesla: -0.15 }
      }
    ]
  },

  // ============================================
  // FED/MONETARY - 2 chains
  // ============================================
  {
    id: 'fed_pivot',
    category: 'fed',
    rumor: 'POWELL HINTS AT POLICY SHIFT IN SPEECH',
    duration: 1,
    outcomes: [
      {
        headline: 'FED PIVOTS TO RATE CUTS - MARKETS SOAR',
        probability: 0.60,
        effects: { nasdaq: 0.22, btc: 0.25, altcoins: 0.35, emerging: 0.18, tesla: 0.28, gold: -0.05 }
      },
      {
        headline: 'FED STAYS HAWKISH - MARKETS DISAPPOINTED',
        probability: 0.40,
        effects: { nasdaq: -0.15, btc: -0.12, altcoins: -0.18, emerging: -0.10, tesla: -0.18, gold: 0.05 }
      }
    ]
  },
  {
    id: 'fed_inflation',
    category: 'fed',
    rumor: 'INFLATION REPORT DUE TOMORROW',
    duration: 1,
    outcomes: [
      {
        headline: 'INFLATION SPIKES TO 9.2% - FED TRAPPED',
        probability: 0.50,
        effects: { gold: 0.20, btc: 0.15, altcoins: 0.22, oil: 0.12, coffee: 0.12, nasdaq: -0.18, tesla: -0.20 }
      },
      {
        headline: 'INFLATION FINALLY COOLING - SOFT LANDING',
        probability: 0.50,
        effects: { nasdaq: 0.18, btc: 0.10, altcoins: 0.15, gold: -0.08, tesla: 0.15 }
      }
    ]
  },

  // ============================================
  // CRYPTO - 3 chains
  // ============================================
  {
    id: 'crypto_binance',
    category: 'crypto',
    rumor: 'BINANCE FACING DOJ CRIMINAL PROBE',
    duration: 1,
    outcomes: [
      {
        headline: 'BINANCE CEO ARRESTED - EXCHANGE FROZEN',
        probability: 0.60,
        effects: { btc: -0.35, altcoins: -0.50, nasdaq: -0.08, gold: 0.10 }
      },
      {
        headline: 'BINANCE SETTLES - PAYS RECORD $4B FINE',
        probability: 0.40,
        effects: { btc: 0.15, altcoins: 0.22, nasdaq: 0.05 }
      }
    ]
  },
  {
    id: 'crypto_etf',
    category: 'crypto',
    rumor: 'SEC REVIEWING BLACKROCK BITCOIN ETF',
    duration: 1,
    outcomes: [
      {
        headline: 'SPOT BITCOIN ETF APPROVED - HISTORIC DAY',
        probability: 0.50,
        effects: { btc: 0.45, altcoins: 0.55, nasdaq: 0.12 }
      },
      {
        headline: 'SEC REJECTS ETF - CITES MARKET MANIPULATION',
        probability: 0.50,
        effects: { btc: -0.25, altcoins: -0.35, nasdaq: -0.05 }
      }
    ]
  },
  {
    id: 'crypto_microstrategy',
    category: 'crypto',
    rumor: 'MICROSTRATEGY MARGIN CALL RUMORS SWIRL',
    duration: 1,
    outcomes: [
      {
        headline: 'SAYLOR FORCED TO LIQUIDATE 100K BTC',
        probability: 0.55,
        effects: { btc: -0.40, altcoins: -0.55, nasdaq: -0.10, gold: 0.12 }
      },
      {
        headline: 'MICROSTRATEGY SECURES EMERGENCY FUNDING',
        probability: 0.45,
        effects: { btc: 0.20, altcoins: 0.30, nasdaq: 0.05 }
      }
    ]
  },

  // ============================================
  // ENERGY - 3 chains
  // ============================================
  {
    id: 'energy_opec',
    category: 'energy',
    rumor: 'OPEC+ EMERGENCY MEETING CALLED',
    duration: 1,
    outcomes: [
      {
        headline: 'SAUDIS SLASH OUTPUT BY 3M BARRELS',
        probability: 0.55,
        effects: { oil: 0.35, gold: 0.08, emerging: -0.10 }
      },
      {
        headline: 'OPEC FAILS TO AGREE - OUTPUT UNCHANGED',
        probability: 0.45,
        effects: { oil: -0.15, emerging: 0.05 }
      }
    ]
  },
  {
    id: 'energy_refinery',
    category: 'energy',
    rumor: 'REPORTS OF FIRE AT MAJOR GULF REFINERY',
    duration: 1,
    outcomes: [
      {
        headline: 'LARGEST US REFINERY OFFLINE FOR MONTHS',
        probability: 0.65,
        effects: { oil: 0.40, gold: 0.12, defense: 0.08, nasdaq: -0.08 }
      },
      {
        headline: 'FIRE CONTAINED - MINIMAL DAMAGE',
        probability: 0.35,
        effects: { oil: -0.08 }
      }
    ]
  },
  {
    id: 'energy_nuclear',
    category: 'energy',
    rumor: 'LENINGRAD-2 NUCLEAR PLANT EVACUATION ORDERED',
    duration: 1,
    outcomes: [
      {
        headline: 'CORE MELTDOWN - WORST SINCE CHERNOBYL',
        probability: 0.40,
        effects: { uranium: -0.45, oil: 0.35, gold: 0.30, nasdaq: -0.15, emerging: -0.20, defense: 0.15 }
      },
      {
        headline: 'COOLANT SYSTEMS RESTORED - CRISIS AVERTED',
        probability: 0.60,
        effects: { uranium: 0.15, oil: -0.08, gold: -0.05, nasdaq: 0.08 }
      }
    ]
  },

  // ============================================
  // TECH - 3 chains
  // ============================================
  {
    id: 'tech_spacex',
    category: 'tech',
    rumor: 'SPACEX STARSHIP MARS TEST LAUNCH TOMORROW',
    duration: 1,
    outcomes: [
      {
        headline: 'STARSHIP REACHES MARS ORBIT - HISTORY MADE',
        probability: 0.45,
        effects: { nasdaq: 0.25, lithium: 0.20, btc: 0.15, altcoins: 0.20, tesla: 0.35 }
      },
      {
        headline: 'STARSHIP EXPLODES ON LAUNCHPAD',
        probability: 0.55,
        effects: { nasdaq: -0.10, lithium: -0.08, tesla: -0.15 }
      }
    ]
  },
  {
    id: 'tech_agi',
    category: 'tech',
    rumor: 'GOOGLE DEEPMIND CLAIMS AGI BREAKTHROUGH INTERNALLY',
    duration: 1,
    outcomes: [
      {
        headline: 'AGI CONFIRMED - GOOGLE LAYS OFF 50,000',
        probability: 0.60,
        effects: { nasdaq: 0.40, btc: 0.25, altcoins: 0.35, lithium: 0.30, tesla: 0.40, gold: -0.10 }
      },
      {
        headline: 'AGI CLAIMS OVERBLOWN - JUST INCREMENTAL',
        probability: 0.40,
        effects: { nasdaq: -0.12, btc: -0.08, altcoins: -0.12, tesla: -0.10 }
      }
    ]
  },
  {
    id: 'tech_apple',
    category: 'tech',
    rumor: 'APPLE RUMORED TO ANNOUNCE AR GLASSES',
    duration: 1,
    outcomes: [
      {
        headline: 'VISION PRO 2 UNVEILED - PREORDERS CRASH',
        probability: 0.65,
        effects: { nasdaq: 0.18, lithium: 0.15 }
      },
      {
        headline: 'APPLE DELAYS AR LAUNCH INDEFINITELY',
        probability: 0.35,
        effects: { nasdaq: -0.12, lithium: -0.08 }
      }
    ]
  },

  // ============================================
  // AGRICULTURE - 3 chains
  // ============================================
  {
    id: 'agri_brazil',
    category: 'agriculture',
    rumor: 'WORST DROUGHT IN BRAZIL IN 50 YEARS',
    duration: 1,
    outcomes: [
      {
        headline: 'COFFEE AND SOYBEAN CROPS DEVASTATED',
        probability: 0.70,
        effects: { coffee: 0.50, gold: 0.10, emerging: -0.12 }
      },
      {
        headline: 'LATE RAINS SAVE THE HARVEST',
        probability: 0.30,
        effects: { coffee: -0.15, emerging: 0.08 }
      }
    ]
  },
  {
    id: 'agri_ukraine',
    category: 'agriculture',
    rumor: 'UKRAINE GRAIN SHIPMENTS HALTED AT PORT',
    duration: 1,
    outcomes: [
      {
        headline: 'RUSSIA EXITS BLACK SEA GRAIN DEAL',
        probability: 0.65,
        effects: { coffee: 0.15, gold: 0.12, oil: 0.10, emerging: -0.15 }
      },
      {
        headline: 'UN BROKERS LAST-MINUTE EXTENSION',
        probability: 0.35,
        effects: { emerging: 0.08 }
      }
    ]
  },
  {
    id: 'agri_locust',
    category: 'agriculture',
    rumor: 'LOCUST SWARMS SPOTTED HEADING TOWARD INDIA',
    duration: 1,
    outcomes: [
      {
        headline: 'WORST LOCUST PLAGUE IN A CENTURY',
        probability: 0.60,
        effects: { coffee: 0.20, gold: 0.08, emerging: -0.18 }
      },
      {
        headline: 'SWARMS DISPERSE BEFORE REACHING FARMLAND',
        probability: 0.40,
        effects: { emerging: 0.10 }
      }
    ]
  },

  // ============================================
  // TESLA - 3 chains
  // ============================================
  {
    id: 'tesla_robotaxi',
    category: 'tesla',
    rumor: 'TESLA ROBOTAXI UNVEIL EVENT SCHEDULED',
    duration: 1,
    outcomes: [
      {
        headline: 'ROBOTAXI LAUNCH EXCEEDS ALL EXPECTATIONS',
        probability: 0.55,
        effects: { tesla: 0.50, nasdaq: 0.15, lithium: 0.20 }
      },
      {
        headline: 'ROBOTAXI DEMO FAILS LIVE ON STAGE',
        probability: 0.45,
        effects: { tesla: -0.35, nasdaq: -0.08, lithium: -0.10 }
      }
    ]
  },
  {
    id: 'tesla_fsd',
    category: 'tesla',
    rumor: 'NHTSA INVESTIGATING TESLA FSD INCIDENTS',
    duration: 1,
    outcomes: [
      {
        headline: 'NHTSA ORDERS NATIONWIDE FSD RECALL',
        probability: 0.50,
        effects: { tesla: -0.40, nasdaq: -0.10 }
      },
      {
        headline: 'NHTSA CLEARS TESLA - FSD DEEMED SAFE',
        probability: 0.50,
        effects: { tesla: 0.35, nasdaq: 0.08 }
      }
    ]
  },
  {
    id: 'tesla_china',
    category: 'tesla',
    rumor: 'CHINA REVIEWING TESLA GIGAFACTORY PERMITS',
    duration: 1,
    outcomes: [
      {
        headline: 'CHINA BANS TESLA FROM GOVERNMENT ZONES',
        probability: 0.45,
        effects: { tesla: -0.30, emerging: 0.10, lithium: -0.08 }
      },
      {
        headline: 'TESLA WINS MAJOR CHINA EXPANSION APPROVAL',
        probability: 0.55,
        effects: { tesla: 0.38, lithium: 0.15, emerging: -0.05 }
      }
    ]
  },

  // ============================================
  // BIOTECH - 3 chains
  // ============================================
  {
    id: 'biotech_moderna',
    category: 'biotech',
    rumor: 'MODERNA CANCER VACCINE ENTERS FINAL FDA REVIEW',
    duration: 1,
    outcomes: [
      {
        headline: 'FDA FAST-TRACKS APPROVAL - BREAKTHROUGH',
        probability: 0.55,
        effects: { biotech: 0.45, nasdaq: 0.12 }
      },
      {
        headline: 'FDA REQUESTS ADDITIONAL TRIALS',
        probability: 0.45,
        effects: { biotech: -0.30, nasdaq: -0.05 }
      }
    ]
  },
  {
    id: 'biotech_pandemic',
    category: 'biotech',
    rumor: 'MYSTERY RESPIRATORY ILLNESS SPREADING IN SE ASIA',
    duration: 1,
    outcomes: [
      {
        headline: 'WHO DECLARES DISEASE X PANDEMIC',
        probability: 0.65,
        effects: { biotech: 0.50, gold: 0.22, nasdaq: -0.18, oil: -0.30, emerging: -0.28, tesla: -0.20 }
      },
      {
        headline: 'OUTBREAK CONTAINED - FALSE ALARM',
        probability: 0.35,
        effects: { biotech: -0.15, oil: 0.08, emerging: 0.12, tesla: 0.10 }
      }
    ]
  },
  {
    id: 'biotech_pfizer',
    category: 'biotech',
    rumor: "PFIZER ALZHEIMER'S DRUG SHOWS PROMISE IN LEAK",
    duration: 1,
    outcomes: [
      {
        headline: 'TRIAL RESULTS: 90% EFFICACY - CURE IN SIGHT',
        probability: 0.50,
        effects: { biotech: 0.55, nasdaq: 0.15 }
      },
      {
        headline: 'DATA FALSIFIED - PFIZER FACES CRIMINAL PROBE',
        probability: 0.50,
        effects: { biotech: -0.40, nasdaq: -0.08 }
      }
    ]
  },
]

// Category weights for selecting which chain type to start
export const CHAIN_CATEGORY_WEIGHTS: Record<string, number> = {
  geopolitical: 0.14,
  fed: 0.14,
  crypto: 0.14,
  energy: 0.14,
  tech: 0.14,
  tesla: 0.12,
  agriculture: 0.08,
  biotech: 0.10,
}
