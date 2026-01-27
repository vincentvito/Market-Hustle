import { EventChain } from './types'

// =============================================================================
// EVENT CHAINS
// Each chain has a rumor phase and two possible outcomes.
// rumorSentiment: The mood during anticipation (usually 'mixed' since outcome is uncertain)
// sentimentAssets: Which assets are tracked for conflict prevention
// Outcome sentiment/sentimentAssets: The mood after resolution
// =============================================================================

export const EVENT_CHAINS: EventChain[] = [
  // ============================================
  // GEOPOLITICAL (Taiwan) - 3 chains
  // ============================================
  {
    id: 'geo_taiwan_invasion',
    category: 'geopolitical',
    rumor: 'CHINA MOBILIZES TROOPS NEAR TAIWAN',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'emerging', 'lithium', 'tesla'],
    outcomes: [
      {
        headline: 'CHINA INVADES TAIWAN - FULL SCALE WAR',
        probability: 0.65,
        effects: { oil: 0.45, gold: 0.35, defense: 0.40, uranium: 0.25, nasdaq: -0.30, emerging: -0.35, lithium: -0.30, tesla: -0.35 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging', 'lithium', 'tesla']
      },
      {
        headline: 'BEIJING BACKS DOWN AFTER US WARNING',
        probability: 0.35,
        effects: { oil: -0.15, gold: -0.10, defense: -0.18, nasdaq: 0.15, emerging: 0.18, lithium: 0.12, tesla: 0.15 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging', 'lithium', 'tesla'],
        allowsReversal: true
      }
    ]
  },
  {
    id: 'geo_taiwan_blockade',
    category: 'geopolitical',
    rumor: 'TAIWAN DECLARES EMERGENCY, RECALLS DIPLOMATS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'emerging', 'lithium', 'tesla'],
    outcomes: [
      {
        headline: 'FULL BLOCKADE OF TAIWAN STRAIT',
        probability: 0.60,
        effects: { oil: 0.35, gold: 0.28, defense: 0.32, nasdaq: -0.28, lithium: -0.35, emerging: -0.25, tesla: -0.30 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging', 'lithium', 'tesla']
      },
      {
        headline: 'SURPRISE DIPLOMATIC BREAKTHROUGH',
        probability: 0.40,
        effects: { oil: -0.12, gold: -0.08, nasdaq: 0.20, lithium: 0.18, emerging: 0.22, tesla: 0.18 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging', 'lithium', 'tesla'],
        allowsReversal: true
      }
    ]
  },
  {
    id: 'geo_taiwan_summit',
    category: 'geopolitical',
    rumor: 'US AND CHINA AGREE TO EMERGENCY SUMMIT',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['nasdaq', 'emerging', 'tesla'],
    outcomes: [
      {
        headline: 'HISTORIC PEACE FRAMEWORK SIGNED',
        probability: 0.55,
        effects: { oil: -0.20, gold: -0.15, defense: -0.22, nasdaq: 0.22, emerging: 0.25, lithium: 0.15, tesla: 0.20 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging', 'tesla'],
        allowsReversal: true
      },
      {
        headline: 'SUMMIT COLLAPSES - TENSIONS ESCALATE',
        probability: 0.45,
        effects: { oil: 0.25, gold: 0.20, defense: 0.25, nasdaq: -0.18, emerging: -0.20, tesla: -0.15 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging', 'tesla']
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
    rumorSentiment: 'mixed',
    sentimentAssets: ['nasdaq', 'btc', 'altcoins', 'tesla'],
    outcomes: [
      {
        headline: 'FED PIVOTS TO RATE CUTS - MARKETS SOAR',
        probability: 0.60,
        effects: { nasdaq: 0.22, btc: 0.25, altcoins: 0.35, emerging: 0.18, tesla: 0.28, gold: -0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'btc', 'altcoins', 'tesla']
      },
      {
        headline: 'FED STAYS HAWKISH - MARKETS DISAPPOINTED',
        probability: 0.40,
        effects: { nasdaq: -0.15, btc: -0.12, altcoins: -0.18, emerging: -0.10, tesla: -0.18, gold: 0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'btc', 'altcoins', 'tesla']
      }
    ]
  },
  {
    id: 'fed_inflation',
    category: 'fed',
    rumor: 'INFLATION REPORT DUE TOMORROW',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['nasdaq', 'tesla'],
    outcomes: [
      {
        headline: 'INFLATION SPIKES TO 9.2% - FED TRAPPED',
        probability: 0.50,
        effects: { gold: 0.20, btc: 0.15, altcoins: 0.22, oil: 0.12, coffee: 0.12, nasdaq: -0.18, tesla: -0.20 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'INFLATION FINALLY COOLING - SOFT LANDING',
        probability: 0.50,
        effects: { nasdaq: 0.18, btc: 0.10, altcoins: 0.15, gold: -0.08, tesla: 0.15 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla']
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
    rumorSentiment: 'bearish',
    sentimentAssets: ['btc', 'altcoins'],
    outcomes: [
      {
        headline: 'BINANCE CEO ARRESTED - EXCHANGE FROZEN',
        probability: 0.60,
        effects: { btc: -0.35, altcoins: -0.50, nasdaq: -0.08, gold: 0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['btc', 'altcoins']
      },
      {
        headline: 'BINANCE SETTLES - PAYS RECORD $4B FINE',
        probability: 0.40,
        effects: { btc: 0.15, altcoins: 0.22, nasdaq: 0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['btc', 'altcoins'],
        allowsReversal: true
      }
    ]
  },
  {
    id: 'crypto_etf',
    category: 'crypto',
    rumor: 'SEC REVIEWING BLACKROCK BITCOIN ETF',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['btc', 'altcoins'],
    outcomes: [
      {
        headline: 'SPOT BITCOIN ETF APPROVED - HISTORIC DAY',
        probability: 0.50,
        effects: { btc: 0.45, altcoins: 0.55, nasdaq: 0.12 },
        sentiment: 'bullish',
        sentimentAssets: ['btc', 'altcoins']
      },
      {
        headline: 'SEC REJECTS ETF - CITES MARKET MANIPULATION',
        probability: 0.50,
        effects: { btc: -0.25, altcoins: -0.35, nasdaq: -0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['btc', 'altcoins']
      }
    ]
  },
  {
    id: 'crypto_microstrategy',
    category: 'crypto',
    rumor: 'MICROSTRATEGY MARGIN CALL RUMORS SWIRL',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['btc', 'altcoins'],
    outcomes: [
      {
        headline: 'SAYLOR FORCED TO LIQUIDATE 100K BTC',
        probability: 0.55,
        effects: { btc: -0.40, altcoins: -0.55, nasdaq: -0.10, gold: 0.12 },
        sentiment: 'bearish',
        sentimentAssets: ['btc', 'altcoins']
      },
      {
        headline: 'MICROSTRATEGY SECURES EMERGENCY FUNDING',
        probability: 0.45,
        effects: { btc: 0.20, altcoins: 0.30, nasdaq: 0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['btc', 'altcoins'],
        allowsReversal: true
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
    rumorSentiment: 'mixed',
    sentimentAssets: ['oil'],
    outcomes: [
      {
        headline: 'SAUDIS SLASH OUTPUT BY 3M BARRELS',
        probability: 0.55,
        effects: { oil: 0.35, gold: 0.08, emerging: -0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['oil']
      },
      {
        headline: 'OPEC FAILS TO AGREE - OUTPUT UNCHANGED',
        probability: 0.45,
        effects: { oil: -0.15, emerging: 0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['oil']
      }
    ]
  },
  {
    id: 'energy_refinery',
    category: 'energy',
    rumor: 'REPORTS OF FIRE AT MAJOR GULF REFINERY',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['oil'],
    outcomes: [
      {
        headline: 'LARGEST US REFINERY OFFLINE FOR MONTHS',
        probability: 0.65,
        effects: { oil: 0.40, gold: 0.12, defense: 0.08, nasdaq: -0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['oil']
      },
      {
        headline: 'FIRE CONTAINED - MINIMAL DAMAGE',
        probability: 0.35,
        effects: { oil: -0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['oil'],
        allowsReversal: true
      }
    ]
  },
  {
    id: 'energy_nuclear',
    category: 'energy',
    rumor: 'LENINGRAD-2 NUCLEAR PLANT EVACUATION ORDERED',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['uranium', 'nasdaq'],
    outcomes: [
      {
        headline: 'CORE MELTDOWN - WORST SINCE CHERNOBYL',
        probability: 0.40,
        effects: { uranium: -0.45, oil: 0.35, gold: 0.30, nasdaq: -0.15, emerging: -0.20, defense: 0.15 },
        sentiment: 'bearish',
        sentimentAssets: ['uranium', 'nasdaq']
      },
      {
        headline: 'COOLANT SYSTEMS RESTORED - CRISIS AVERTED',
        probability: 0.60,
        effects: { uranium: 0.15, oil: -0.08, gold: -0.05, nasdaq: 0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['uranium', 'nasdaq']
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
    rumorSentiment: 'mixed',
    sentimentAssets: ['nasdaq', 'tesla'],
    outcomes: [
      {
        headline: 'STARSHIP REACHES MARS ORBIT - HISTORY MADE',
        probability: 0.45,
        effects: { nasdaq: 0.25, lithium: 0.20, btc: 0.15, altcoins: 0.20, tesla: 0.35 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'STARSHIP EXPLODES ON LAUNCHPAD',
        probability: 0.55,
        effects: { nasdaq: -0.10, lithium: -0.08, tesla: -0.15 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla']
      }
    ]
  },
  {
    id: 'tech_agi',
    category: 'tech',
    rumor: 'GOOGLE DEEPMIND CLAIMS AGI BREAKTHROUGH INTERNALLY',
    duration: 1,
    rumorSentiment: 'bullish',
    sentimentAssets: ['nasdaq', 'tesla'],
    outcomes: [
      {
        headline: 'AGI CONFIRMED - GOOGLE LAYS OFF 50,000',
        probability: 0.60,
        effects: { nasdaq: 6.0, btc: 0.80, altcoins: 1.0, lithium: 0.60, tesla: 1.50, gold: -0.20 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'AGI CLAIMS OVERBLOWN - JUST INCREMENTAL',
        probability: 0.40,
        effects: { nasdaq: -0.12, btc: -0.08, altcoins: -0.12, tesla: -0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla']
      }
    ]
  },
  {
    id: 'tech_apple',
    category: 'tech',
    rumor: 'APPLE RUMORED TO ANNOUNCE AR GLASSES',
    duration: 1,
    rumorSentiment: 'bullish',
    sentimentAssets: ['nasdaq'],
    outcomes: [
      {
        headline: 'VISION PRO 2 UNVEILED - PREORDERS CRASH',
        probability: 0.65,
        effects: { nasdaq: 0.18, lithium: 0.15 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'APPLE DELAYS AR LAUNCH INDEFINITELY',
        probability: 0.35,
        effects: { nasdaq: -0.12, lithium: -0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
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
    rumorSentiment: 'bearish',
    sentimentAssets: ['coffee', 'emerging'],
    outcomes: [
      {
        headline: 'COFFEE AND SOYBEAN CROPS DEVASTATED',
        probability: 0.70,
        effects: { coffee: 0.50, gold: 0.10, emerging: -0.12 },
        sentiment: 'bearish',
        sentimentAssets: ['coffee', 'emerging']
      },
      {
        headline: 'LATE RAINS SAVE THE HARVEST',
        probability: 0.30,
        effects: { coffee: -0.15, emerging: 0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['coffee', 'emerging']
      }
    ]
  },
  {
    id: 'agri_ukraine',
    category: 'agriculture',
    rumor: 'UKRAINE GRAIN SHIPMENTS HALTED AT PORT',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['coffee', 'emerging'],
    outcomes: [
      {
        headline: 'RUSSIA EXITS BLACK SEA GRAIN DEAL',
        probability: 0.65,
        effects: { coffee: 0.15, gold: 0.12, oil: 0.10, emerging: -0.15 },
        sentiment: 'bearish',
        sentimentAssets: ['coffee', 'emerging']
      },
      {
        headline: 'UN BROKERS LAST-MINUTE EXTENSION',
        probability: 0.35,
        effects: { emerging: 0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['coffee', 'emerging']
      }
    ]
  },
  {
    id: 'agri_locust',
    category: 'agriculture',
    rumor: 'LOCUST SWARMS SPOTTED HEADING TOWARD INDIA',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['coffee', 'emerging'],
    outcomes: [
      {
        headline: 'WORST LOCUST PLAGUE IN A CENTURY',
        probability: 0.60,
        effects: { coffee: 0.20, gold: 0.08, emerging: -0.18 },
        sentiment: 'bearish',
        sentimentAssets: ['coffee', 'emerging']
      },
      {
        headline: 'SWARMS DISPERSE BEFORE REACHING FARMLAND',
        probability: 0.40,
        effects: { emerging: 0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['coffee', 'emerging']
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
    rumorSentiment: 'bullish',
    sentimentAssets: ['tesla'],
    outcomes: [
      {
        headline: 'ROBOTAXI LAUNCH EXCEEDS ALL EXPECTATIONS',
        probability: 0.55,
        effects: { tesla: 0.50, nasdaq: 0.15, lithium: 0.20 },
        sentiment: 'bullish',
        sentimentAssets: ['tesla']
      },
      {
        headline: 'ROBOTAXI DEMO FAILS LIVE ON STAGE',
        probability: 0.45,
        effects: { tesla: -0.35, nasdaq: -0.08, lithium: -0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['tesla']
      }
    ]
  },
  {
    id: 'tesla_fsd',
    category: 'tesla',
    rumor: 'NHTSA INVESTIGATING TESLA FSD INCIDENTS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['tesla'],
    outcomes: [
      {
        headline: 'NHTSA ORDERS NATIONWIDE FSD RECALL',
        probability: 0.50,
        effects: { tesla: -0.40, nasdaq: -0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['tesla']
      },
      {
        headline: 'NHTSA CLEARS TESLA - FSD DEEMED SAFE',
        probability: 0.50,
        effects: { tesla: 0.35, nasdaq: 0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['tesla']
      }
    ]
  },
  {
    id: 'tesla_china',
    category: 'tesla',
    rumor: 'CHINA REVIEWING TESLA GIGAFACTORY PERMITS',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['tesla'],
    outcomes: [
      {
        headline: 'CHINA BANS TESLA FROM GOVERNMENT ZONES',
        probability: 0.45,
        effects: { tesla: -0.30, emerging: 0.10, lithium: -0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['tesla']
      },
      {
        headline: 'TESLA WINS MAJOR CHINA EXPANSION APPROVAL',
        probability: 0.55,
        effects: { tesla: 0.38, lithium: 0.15, emerging: -0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['tesla']
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
    rumorSentiment: 'bullish',
    sentimentAssets: ['biotech'],
    outcomes: [
      {
        headline: 'FDA FAST-TRACKS APPROVAL - BREAKTHROUGH',
        probability: 0.55,
        effects: { biotech: 0.45, nasdaq: 0.12 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech']
      },
      {
        headline: 'FDA REQUESTS ADDITIONAL TRIALS',
        probability: 0.45,
        effects: { biotech: -0.30, nasdaq: -0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['biotech']
      }
    ]
  },
  {
    id: 'biotech_pandemic',
    category: 'biotech',
    rumor: 'MYSTERY RESPIRATORY ILLNESS SPREADING IN SE ASIA',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'emerging', 'tesla'],
    outcomes: [
      {
        headline: 'WHO DECLARES DISEASE X PANDEMIC',
        probability: 0.65,
        effects: { biotech: 0.50, gold: 0.22, nasdaq: -0.18, oil: -0.30, emerging: -0.28, tesla: -0.20 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging', 'tesla']
      },
      {
        headline: 'OUTBREAK CONTAINED - FALSE ALARM',
        probability: 0.35,
        effects: { biotech: -0.15, oil: 0.08, emerging: 0.12, tesla: 0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging', 'tesla'],
        allowsReversal: true
      }
    ]
  },
  {
    id: 'biotech_pfizer',
    category: 'biotech',
    rumor: "PFIZER ALZHEIMER'S DRUG SHOWS PROMISE IN LEAK",
    duration: 1,
    rumorSentiment: 'bullish',
    sentimentAssets: ['biotech'],
    outcomes: [
      {
        headline: 'TRIAL RESULTS - 90% EFFICACY, CURE IN SIGHT',
        probability: 0.50,
        effects: { biotech: 0.55, nasdaq: 0.15 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech']
      },
      {
        headline: 'DATA FALSIFIED - PFIZER FACES CRIMINAL PROBE',
        probability: 0.50,
        effects: { biotech: -0.40, nasdaq: -0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['biotech']
      }
    ]
  },

  // ============================================
  // ECONOMIC - 2 chains
  // ============================================
  // UBI Birth Rate Spike - 4 outcomes
  {
    id: 'econ_ubi_birthrate',
    category: 'economic',
    rumor: 'BIRTH RATES SPIKE 40% FOLLOWING UBI IMPLEMENTATION',
    duration: 1,
    rumorSentiment: 'bullish',
    sentimentAssets: ['nasdaq', 'emerging'],
    outcomes: [
      {
        headline: 'DEMOGRAPHIC PROJECTIONS FLIP - GROWTH REPRICED',
        probability: 0.40,
        effects: { nasdaq: 0.15, emerging: 0.20, gold: -0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'HOUSING AND EDUCATION DEMAND SURGE',
        probability: 0.30,
        effects: { gold: 0.10, nasdaq: 0.08, lithium: 0.12 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'gold', 'lithium']
      },
      {
        headline: 'SPIKE IS TEMPORARY - RETURNS TO BASELINE',
        probability: 0.20,
        effects: { nasdaq: -0.05, emerging: -0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'BABY BOOM GENERATION ENTERS ECONOMY IN 20 YEARS',
        probability: 0.10,
        effects: { nasdaq: 0.12, emerging: 0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging']
      }
    ]
  },
  {
    id: 'econ_jobs',
    category: 'economic',
    rumor: 'LABOR DEPARTMENT JOBS REPORT DUE TOMORROW',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['nasdaq', 'tesla', 'emerging'],
    outcomes: [
      {
        headline: 'ROBOTS REPLACE 300K WORKERS - MASS LAYOFFS',
        probability: 0.55,
        effects: { nasdaq: 0.15, tesla: 0.25, lithium: 0.12, gold: 0.18, emerging: -0.20 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'tesla', 'emerging']
      },
      {
        headline: 'JOBS SURGE 400K - LABOR MARKET UNSTOPPABLE',
        probability: 0.45,
        effects: { nasdaq: 0.22, tesla: 0.15, emerging: 0.25, oil: 0.12, gold: -0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla', 'emerging']
      }
    ]
  },

  // ============================================
  // SPIKE CHAINS (converted from spike system)
  // High-impact uncertain events with ~50% spike probability
  // ============================================

  // Coffee Blight - ×5 spike potential
  {
    id: 'chain_coffee_blight',
    category: 'agriculture',
    rumor: 'REPORTS OF UNUSUAL CROP CONDITIONS IN BRAZIL',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['coffee'],
    outcomes: [
      {
        headline: 'SOUTH AMERICA COFFEE BLIGHT - 80% HARVEST DESTROYED',
        probability: 0.50,
        effects: { coffee: 3.0, emerging: -0.12 },
        sentiment: 'bullish',
        sentimentAssets: ['coffee']
      },
      {
        headline: 'BRAZIL CROP SCARE OVERSTATED - HARVEST NEAR NORMAL',
        probability: 0.50,
        effects: { coffee: -0.12, emerging: 0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['coffee']
      }
    ]
  },

  // Defense NATO - ×4 spike potential
  {
    id: 'chain_defense_nato',
    category: 'geopolitical',
    rumor: 'NATO ACTIVATES ARTICLE 5 CONSULTATION AMID BALTIC TENSIONS',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['defense'],
    outcomes: [
      {
        headline: 'NATO LAUNCHES LARGEST MILITARY MOBILIZATION SINCE WWII',
        probability: 0.50,
        effects: { defense: 3.0, oil: 0.35, gold: 0.25, nasdaq: -0.15, emerging: -0.20 },
        sentiment: 'bullish',
        sentimentAssets: ['defense']
      },
      {
        headline: 'RUSSIA WITHDRAWS FORCES - DIPLOMATIC VICTORY',
        probability: 0.50,
        effects: { defense: -0.25, oil: -0.15, gold: -0.10, nasdaq: 0.12 },
        sentiment: 'bearish',
        sentimentAssets: ['defense']
      }
    ]
  },

  // Oil Hormuz - ×4 spike potential
  {
    id: 'chain_oil_hormuz',
    category: 'energy',
    rumor: 'IRANIAN FORCES SPOTTED NEAR STRAIT OF HORMUZ',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['oil'],
    outcomes: [
      {
        headline: 'IRAN CLOSES STRAIT OF HORMUZ - 30% OF WORLD OIL BLOCKED',
        probability: 0.50,
        effects: { oil: 3.0, gold: 0.30, defense: 0.35, nasdaq: -0.20, emerging: -0.25 },
        sentiment: 'bullish',
        sentimentAssets: ['oil']
      },
      {
        headline: 'US FLEET SECURES STRAIT - SHIPPING RESUMES',
        probability: 0.50,
        effects: { oil: -0.15, defense: 0.08, nasdaq: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['oil'],
        allowsReversal: true
      }
    ]
  },

  // Nasdaq QE - ×3 spike potential (preserves secondary effects pattern)
  {
    id: 'chain_nasdaq_qe',
    category: 'fed',
    rumor: 'EMERGENCY FED MEETING CALLED - SOURCES CITE BANKING STRESS',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['nasdaq', 'btc', 'tesla'],
    outcomes: [
      {
        headline: 'FED ANNOUNCES UNLIMITED QE - "WHATEVER IT TAKES"',
        probability: 0.50,
        effects: { nasdaq: 2.0, btc: 0.80, altcoins: 1.0, tesla: 0.90, lithium: 0.50, biotech: 0.40, gold: -0.15 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'btc', 'tesla']
      },
      {
        headline: 'FED HOLDS STEADY - "FINANCIAL SYSTEM RESILIENT"',
        probability: 0.50,
        effects: { nasdaq: -0.08, btc: -0.10, tesla: -0.10, gold: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'btc', 'tesla']
      }
    ]
  },

  // US Credit Downgrade - Gold ×3 spike potential (fixed: was miscategorized in spikes.ts)
  {
    id: 'chain_us_credit_downgrade',
    category: 'economic',
    rumor: 'MOODY\'S REVIEWING US SOVEREIGN CREDIT RATING',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['gold', 'nasdaq'],
    outcomes: [
      {
        headline: 'MOODY\'S DOWNGRADES US TO AA - DOLLAR CRISIS BEGINS',
        probability: 0.50,
        effects: { gold: 2.0, btc: 0.60, nasdaq: -0.30, emerging: -0.25, oil: 0.20 },
        sentiment: 'bullish',
        sentimentAssets: ['gold']
      },
      {
        headline: 'MOODY\'S AFFIRMS AAA RATING - DOLLAR STRENGTHENS',
        probability: 0.50,
        effects: { gold: -0.15, btc: -0.08, nasdaq: 0.12, emerging: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['gold']
      }
    ]
  },

  // =============================================================================
  // NEW SPIKE CHAINS WITH 3-4 OUTCOMES
  // =============================================================================

  // Quantum Computing Breakthrough - x6 NASDAQ spike potential
  {
    id: 'chain_quantum_supremacy',
    category: 'tech',
    rumor: 'IBM RESEARCH TEAM ACHIEVES "ERROR-FREE" QUANTUM COMPUTATION',
    duration: 1,
    rumorSentiment: 'bullish',
    sentimentAssets: ['nasdaq', 'btc'],
    outcomes: [
      {
        headline: 'QUANTUM SUPREMACY CONFIRMED - ALL ENCRYPTION BROKEN',
        probability: 0.35,
        effects: { nasdaq: 5.0, btc: -0.70, altcoins: -0.80, gold: 0.30, defense: 0.40 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'btc']
      },
      {
        headline: 'RESULTS REPLICATED - 1000X SPEEDUP BUT ENCRYPTION SAFE',
        probability: 0.35,
        effects: { nasdaq: 0.40, btc: 0.15, biotech: 0.25, tesla: 0.20 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'REPLICATION FAILS - IBM ADMITS MEASUREMENT ERROR',
        probability: 0.30,
        effects: { nasdaq: -0.15, btc: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      }
    ]
  },

  // Robot Technician Shortage - 4 outcomes
  {
    id: 'chain_robot_technician_shortage',
    category: 'tech',
    rumor: 'FACTORIES WORLDWIDE REPORTING ROBOT MAINTENANCE BACKLOG',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'tesla'],
    outcomes: [
      {
        headline: 'TECHNICIAN SALARIES HIT $500K - AUTOMATION COSTS SOAR',
        probability: 0.35,
        effects: { nasdaq: -0.15, tesla: -0.12, lithium: -0.08, gold: 0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'BREAKTHROUGH - ROBOTS NOW MAINTAIN ROBOTS',
        probability: 0.25,
        effects: { nasdaq: 0.35, tesla: 0.45, lithium: 0.20, biotech: 0.15 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'FACTORIES IDLE - SUPPLY CHAIN CHAOS SPREADS',
        probability: 0.25,
        effects: { nasdaq: -0.25, tesla: -0.30, oil: -0.15, gold: 0.20 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'EMERGENCY VISA PROGRAM SOLVES SHORTAGE',
        probability: 0.15,
        effects: { emerging: 0.20, nasdaq: 0.12, tesla: 0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging']
      }
    ]
  },

  // Global Internet Outage - x5 BTC spike potential
  {
    id: 'chain_internet_outage',
    category: 'tech',
    rumor: 'MAJOR UNDERSEA CABLE DAMAGE REPORTED IN MULTIPLE LOCATIONS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'btc'],
    outcomes: [
      {
        headline: 'COORDINATED ATTACK SUSPECTED - GLOBAL INTERNET DOWN 72 HOURS',
        probability: 0.30,
        effects: { btc: -0.50, gold: 1.50, defense: 0.80, nasdaq: -0.50, altcoins: -0.60, tesla: -0.35 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'btc']
      },
      {
        headline: 'REROUTING SUCCESSFUL - MINOR SLOWDOWNS ONLY',
        probability: 0.45,
        effects: { nasdaq: 0.08, btc: 0.05, defense: 0.10 },
        sentiment: 'neutral',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'CABLE REPAIR COMPLETED - TRAFFIC RESTORED',
        probability: 0.25,
        effects: { nasdaq: 0.12, btc: -0.05, defense: -0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      }
    ]
  },

  // Lab-Grown Meat Breakthrough - x6 Emerging Markets spike potential
  {
    id: 'chain_labgrown_meat',
    category: 'biotech',
    rumor: 'STARTUP CLAIMS 90% COST REDUCTION IN CULTURED MEAT',
    duration: 1,
    rumorSentiment: 'bullish',
    sentimentAssets: ['biotech', 'emerging'],
    outcomes: [
      {
        headline: 'LAB MEAT NOW CHEAPER THAN BEEF - AGRICULTURAL REVOLUTION',
        probability: 0.35,
        effects: { biotech: 0.60, emerging: 0.60, coffee: -0.30, nasdaq: 0.25, tesla: 0.20 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech', 'emerging']
      },
      {
        headline: 'FDA APPROVES - GRADUAL ADOPTION EXPECTED',
        probability: 0.35,
        effects: { biotech: 0.25, emerging: 0.15, nasdaq: 0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech']
      },
      {
        headline: 'SAFETY CONCERNS HALT FDA REVIEW - YEARS OF TESTING NEEDED',
        probability: 0.30,
        effects: { biotech: -0.20, emerging: 0.05, coffee: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['biotech']
      }
    ]
  },

  // Post-AGI Mental Health Crisis - 4 outcomes
  {
    id: 'chain_mental_health_crisis',
    category: 'economic',
    rumor: 'MENTAL HEALTH CRISIS FROM PURPOSELESSNESS EXCEEDS FINANCIAL CRISIS IMPACT',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['biotech', 'nasdaq'],
    outcomes: [
      {
        headline: 'PHARMA AND THERAPY PLATFORMS SURGE - MENTAL HEALTH STOCKS SOAR',
        probability: 0.40,
        effects: { biotech: 0.22, nasdaq: 0.08, gold: 0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech', 'nasdaq']
      },
      {
        headline: 'PRODUCTIVITY PARADOX - ROBOTS WORK, HUMANS MEDICATED',
        probability: 0.30,
        effects: { biotech: 0.30, nasdaq: -0.10 },
        sentiment: 'mixed',
        sentimentAssets: ['biotech', 'nasdaq']
      },
      {
        headline: 'RELIGION AND COMMUNITY ORGS SEE MASSIVE GROWTH',
        probability: 0.20,
        effects: { gold: 0.10, nasdaq: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: ['gold']
      },
      {
        headline: 'NEW MEANING ECONOMY EMERGES - COACHING, CRAFT, CARE',
        probability: 0.10,
        effects: { emerging: 0.15, biotech: 0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['emerging', 'biotech']
      }
    ]
  },

  // AGI Prototype Theft - 4 outcomes (supervillain potential)
  {
    id: 'chain_agi_theft',
    category: 'tech',
    rumor: 'RESEARCHER REPORTEDLY STOLE AGI PROTOTYPE FROM MAJOR LAB, WHEREABOUTS UNKNOWN',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['nasdaq', 'defense', 'btc'],
    outcomes: [
      {
        headline: 'AGI THIEF SURFACES IN RIVAL NATION - OFFERS TO SELL PROTOTYPE',
        probability: 0.30,
        effects: { defense: 0.30, nasdaq: -0.25, gold: 0.20, btc: 0.20 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'RESEARCHER CAUGHT AT AIRPORT - AGI PROTOTYPE RECOVERED INTACT',
        probability: 0.35,
        effects: { nasdaq: 0.12, defense: 0.08, gold: -0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'AGI PROTOTYPE RELEASED OPEN-SOURCE - CODE SPREADS GLOBALLY',
        probability: 0.20,
        effects: { nasdaq: -0.20, btc: 0.35, altcoins: 0.50, defense: 0.15 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'btc', 'altcoins']
      },
      {
        headline: 'RESEARCHER DEPLOYS AGI - DEMANDS WORLD LEADERS COMPLY OR FACE SHUTDOWN',
        probability: 0.15,
        effects: { btc: 20.0, gold: 2.0, defense: 1.50, nasdaq: -0.50, emerging: -0.40 },
        sentiment: 'mixed',
        sentimentAssets: ['btc', 'nasdaq', 'defense']
      }
    ]
  },

  // ============================================
  // BLACK SWAN SPIKE CHAINS - 5 chains
  // Massive price movements for exciting gameplay
  // ============================================

  // India-Pakistan Nuclear Exchange (×8 Gold spike)
  {
    id: 'chain_india_pakistan_nuclear',
    category: 'geopolitical',
    rumor: 'KASHMIR BORDER INCIDENT - INDIA AND PAKISTAN MOBILIZING NUCLEAR FORCES',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['gold', 'defense', 'emerging'],
    outcomes: [
      {
        headline: 'NUCLEAR EXCHANGE CONFIRMED - MULTIPLE CITIES HIT IN BOTH NATIONS',
        probability: 0.20,
        effects: { gold: 8.0, defense: 3.0, oil: 1.50, nasdaq: -0.45, emerging: -0.70, btc: 0.50 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'LIMITED TACTICAL STRIKES - BOTH SIDES CLAIM VICTORY, CEASEFIRE HOLDS',
        probability: 0.30,
        effects: { gold: 1.50, defense: 0.80, oil: 0.40, nasdaq: -0.20, emerging: -0.35 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'BACK-CHANNEL DIPLOMACY SUCCEEDS - FORCES STAND DOWN',
        probability: 0.35,
        effects: { gold: -0.15, defense: -0.10, nasdaq: 0.15, emerging: 0.20 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'UN EMERGENCY SESSION - PEACEKEEPERS DEPLOYED TO KASHMIR',
        probability: 0.15,
        effects: { gold: 0.20, defense: 0.25, emerging: 0.05, nasdaq: 0.05 },
        sentiment: 'neutral',
        sentimentAssets: ['gold', 'defense']
      }
    ]
  },

  // Antibiotic-Resistant Superbug Outbreak (×7 Biotech spike)
  {
    id: 'chain_superbug_outbreak',
    category: 'biotech',
    rumor: 'WHO EMERGENCY SESSION - ANTIBIOTIC-RESISTANT BACTERIA SPREADING ACROSS HOSPITALS',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['biotech', 'gold'],
    outcomes: [
      {
        headline: 'GLOBAL PANDEMIC DECLARED - SUPERBUG KILLS MILLIONS, NO TREATMENT EXISTS',
        probability: 0.25,
        effects: { biotech: 7.0, gold: 2.0, defense: 0.50, nasdaq: -0.40, emerging: -0.50, tesla: -0.30 },
        sentiment: 'mixed',
        sentimentAssets: ['biotech', 'nasdaq']
      },
      {
        headline: 'OUTBREAK CONTAINED TO HOSPITAL CLUSTERS - QUARANTINE EFFECTIVE',
        probability: 0.35,
        effects: { biotech: 0.40, gold: 0.15, nasdaq: -0.08, emerging: -0.10 },
        sentiment: 'mixed',
        sentimentAssets: ['biotech']
      },
      {
        headline: 'EXPERIMENTAL PHAGE THERAPY PROVES EFFECTIVE - STOCKS SURGE',
        probability: 0.25,
        effects: { biotech: 1.50, nasdaq: 0.20, gold: -0.10, emerging: 0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech', 'nasdaq']
      },
      {
        headline: 'LAB CONTAMINATION CAUSED FALSE POSITIVE - NO OUTBREAK',
        probability: 0.15,
        effects: { biotech: -0.15, gold: -0.08, nasdaq: 0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      }
    ]
  },

  // World's Largest Pension Fund Collapse (×2.5 Gold, -60% NASDAQ)
  {
    id: 'chain_pension_fund_collapse',
    category: 'economic',
    rumor: "WORLD'S LARGEST PENSION FUND CALLS EMERGENCY BOARD MEETING - LIQUIDITY CRISIS RUMORED",
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'gold'],
    outcomes: [
      {
        headline: 'PENSION FUND DECLARES INSOLVENCY - $2 TRILLION EVAPORATES, RETIREES DEVASTATED',
        probability: 0.25,
        effects: { gold: 1.50, nasdaq: -0.60, emerging: -0.40, btc: 0.30, defense: 0.20 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'PARTIAL GOVERNMENT RESCUE - BENEFITS CUT 40%, MARKETS STABILIZE',
        probability: 0.35,
        effects: { gold: 0.40, nasdaq: -0.25, emerging: -0.15, btc: 0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'FULL GOVERNMENT BAILOUT - TAXPAYERS ON HOOK, MORAL HAZARD DEBATE ERUPTS',
        probability: 0.25,
        effects: { gold: 0.20, nasdaq: 0.10, btc: 0.15, emerging: 0.05 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'gold']
      },
      {
        headline: 'ACCOUNTING ERROR CORRECTED - FUND SOLVENT, BOARD MEMBERS RESIGN',
        probability: 0.15,
        effects: { nasdaq: 0.15, gold: -0.10, emerging: 0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      }
    ]
  },

  // Suez Canal Permanent Blockade (×5 Oil spike)
  {
    id: 'chain_suez_blockade',
    category: 'energy',
    rumor: 'EGYPTIAN MILITARY DEPLOYING HEAVY EQUIPMENT TO SUEZ CANAL ZONE',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['oil', 'gold'],
    outcomes: [
      {
        headline: 'EGYPT NATIONALIZES SUEZ - CANAL CLOSED INDEFINITELY, GLOBAL SHIPPING CHAOS',
        probability: 0.25,
        effects: { oil: 5.0, gold: 1.50, defense: 0.80, nasdaq: -0.35, emerging: -0.40, tesla: -0.25 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'TRANSIT FEES TRIPLED - SHIPPING COSTS SURGE, INFLATION FEARS SPIKE',
        probability: 0.35,
        effects: { oil: 0.80, gold: 0.30, nasdaq: -0.15, emerging: -0.20 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'DIPLOMATIC RESOLUTION - NEW TREATY SIGNED, FEES MODEST INCREASE',
        probability: 0.25,
        effects: { oil: 0.10, nasdaq: 0.12, emerging: 0.15, gold: -0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'ROUTINE MILITARY EXERCISE - CANAL OPERATIONS UNAFFECTED',
        probability: 0.15,
        effects: { oil: -0.08, nasdaq: 0.08, gold: -0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      }
    ]
  },

  // Deepfake Election Chaos (×4 BTC spike)
  {
    id: 'chain_deepfake_election',
    category: 'tech',
    rumor: 'VIRAL VIDEO OF US PRESIDENT DECLARING MARTIAL LAW - AUTHENTICITY DISPUTED',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'btc', 'gold'],
    outcomes: [
      {
        headline: 'FOREIGN NATION-STATE ATTACK CONFIRMED - TRUST IN INSTITUTIONS COLLAPSES',
        probability: 0.25,
        effects: { btc: 4.0, gold: 2.0, defense: 1.20, nasdaq: -0.50, emerging: -0.35, altcoins: 2.50 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'btc']
      },
      {
        headline: 'DOMESTIC ACTOR IDENTIFIED - ARRESTS MADE, MARKETS RATTLED',
        probability: 0.30,
        effects: { btc: 0.50, gold: 0.40, nasdaq: -0.20, defense: 0.30 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'DEEPFAKE DEBUNKED WITHIN HOURS - AI DETECTION TOOLS PRAISED',
        probability: 0.30,
        effects: { nasdaq: 0.25, btc: -0.10, gold: -0.08, tesla: 0.15 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'INVESTIGATION ONGOING - ORIGIN REMAINS UNCLEAR',
        probability: 0.15,
        effects: { btc: 0.20, gold: 0.15, nasdaq: -0.05, defense: 0.10 },
        sentiment: 'neutral',
        sentimentAssets: ['btc', 'gold']
      }
    ]
  },

  // Global Wealth Tax Proposal (×3 BTC spike)
  {
    id: 'chain_global_wealth_tax',
    category: 'economic',
    rumor: 'GLOBAL 10% WEALTH TAX PROPOSED ON ALL ASSETS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['btc', 'gold', 'nasdaq'],
    outcomes: [
      {
        headline: 'WEALTH TAX PASSES - GLOBAL CAPITAL FLIGHT TO CRYPTO AND GOLD',
        probability: 0.20,
        effects: { btc: 3.0, gold: 1.50, altcoins: 2.0, nasdaq: -0.45, emerging: -0.35, tesla: -0.30 },
        sentiment: 'mixed',
        sentimentAssets: ['btc', 'nasdaq']
      },
      {
        headline: 'COMPROMISE REACHED - 2% WEALTH TAX IMPLEMENTED INSTEAD',
        probability: 0.35,
        effects: { btc: 0.40, gold: 0.25, nasdaq: -0.12, emerging: -0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'US AND CHINA BLOCK PROPOSAL - GLOBAL TAX COORDINATION FAILS',
        probability: 0.30,
        effects: { nasdaq: 0.20, emerging: 0.15, btc: -0.10, gold: -0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'WEALTH TAX PROPOSAL WITHDRAWN - POLITICAL BACKLASH TOO SEVERE',
        probability: 0.15,
        effects: { nasdaq: 0.25, tesla: 0.20, emerging: 0.18, btc: -0.05, gold: -0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla']
      }
    ]
  },
]

// Category weights for selecting which chain type to start
// Weights adjusted for spike chains: geopolitical +1, energy +1, fed +1, agriculture +1, economic +1
export const CHAIN_CATEGORY_WEIGHTS: Record<string, number> = {
  geopolitical: 0.14,  // +1 spike chain (Defense NATO)
  fed: 0.15,           // +1 spike chain (Nasdaq QE)
  crypto: 0.11,
  energy: 0.14,        // +1 spike chain (Oil Hormuz)
  tech: 0.12,
  tesla: 0.09,
  agriculture: 0.10,   // +1 spike chain (Coffee Blight)
  biotech: 0.08,
  economic: 0.10,      // +1 spike chain (US Credit Downgrade)
}
