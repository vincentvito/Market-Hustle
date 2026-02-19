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
    subcategory: 'asia',
    excludeStories: ['story_taiwan_crisis'],
    excludeChains: ['geo_taiwan_blockade', 'geo_taiwan_summit'],
    rumor: 'CHINA MOBILIZES TROOPS NEAR TAIWAN',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'emerging', 'lithium', 'tesla'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.80, label: 'MILITARY ESCALATION', missLabel: 'DIPLOMATIC RESOLUTION' },
    outcomes: [
      {
        headline: 'BREAKING: CHINA INVADES TAIWAN - FULL SCALE WAR',
        probability: 0.65,
        effects: { oil: 0.30, gold: 0.25, defense: 0.28, uranium: 0.18, nasdaq: -0.25, emerging: -0.28, lithium: -0.22, tesla: -0.25 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging', 'lithium', 'tesla']
      },
      {
        headline: 'TAIWAN CRISIS: BEIJING BACKS DOWN AFTER US WARNING',
        probability: 0.35,
        effects: { oil: -0.10, gold: -0.07, defense: -0.12, nasdaq: 0.10, emerging: 0.12, lithium: 0.08, tesla: 0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging', 'lithium', 'tesla'],
        allowsReversal: true
      }
    ]
  },
  {
    id: 'geo_taiwan_blockade',
    category: 'geopolitical',
    subcategory: 'asia',
    excludeStories: ['story_taiwan_crisis'],
    excludeChains: ['geo_taiwan_invasion', 'geo_taiwan_summit'],
    rumor: 'TAIWAN DECLARES EMERGENCY, RECALLS DIPLOMATS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'emerging', 'lithium', 'tesla'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.78, label: 'FULL BLOCKADE', missLabel: 'DIPLOMATIC BREAKTHROUGH' },
    outcomes: [
      {
        headline: 'TAIWAN EMERGENCY ESCALATES: FULL BLOCKADE OF STRAIT',
        probability: 0.60,
        effects: { oil: 0.25, gold: 0.20, defense: 0.22, nasdaq: -0.22, lithium: -0.25, emerging: -0.18, tesla: -0.22 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging', 'lithium', 'tesla']
      },
      {
        headline: 'TAIWAN CRISIS AVERTED: SURPRISE DIPLOMATIC BREAKTHROUGH',
        probability: 0.40,
        effects: { oil: -0.08, gold: -0.06, nasdaq: 0.14, lithium: 0.12, emerging: 0.15, tesla: 0.12 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging', 'lithium', 'tesla'],
        allowsReversal: true
      }
    ]
  },
  {
    id: 'geo_taiwan_summit',
    category: 'geopolitical',
    subcategory: 'asia',
    excludeStories: ['story_taiwan_crisis'],
    excludeChains: ['geo_taiwan_invasion', 'geo_taiwan_blockade'],
    rumor: 'US AND CHINA AGREE TO EMERGENCY SUMMIT',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['nasdaq', 'emerging', 'tesla'],
    outcomes: [
      {
        headline: 'US-CHINA SUMMIT: HISTORIC PEACE FRAMEWORK SIGNED',
        probability: 0.55,
        effects: { oil: -0.14, gold: -0.10, defense: -0.15, nasdaq: 0.15, emerging: 0.18, lithium: 0.10, tesla: 0.14 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging', 'tesla'],
        allowsReversal: true
      },
      {
        headline: 'US-CHINA SUMMIT COLLAPSES - TENSIONS ESCALATE',
        probability: 0.45,
        effects: { oil: 0.18, gold: 0.14, defense: 0.18, nasdaq: -0.12, emerging: -0.14, tesla: -0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging', 'tesla']
      }
    ]
  },

  // Mexico Nationalization - 3 outcomes
  {
    id: 'geo_mexico_nationalization',
    category: 'geopolitical',
    subcategory: 'latam',
    rumor: 'MEXICO ANNOUNCES SUDDEN NATIONALIZATION OF ALL FOREIGN MINES',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['lithium', 'emerging'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.45, label: 'FULL SEIZURE', missLabel: 'NATIONALIZATION BLOCKED' },
    outcomes: [
      {
        headline: 'MEXICO COMPLETES MINE SEIZURES — STATE LITHIUM MONOPOLY FORMED',
        probability: 0.30,
        effects: { lithium: 0.22, gold: 0.12, emerging: -0.16, tesla: -0.10, nasdaq: -0.04 },
        sentiment: 'mixed',
        sentimentAssets: ['lithium', 'emerging', 'tesla']
      },
      {
        headline: 'INTERNATIONAL COURTS BLOCK NATIONALIZATION — MEXICO BACKS DOWN',
        probability: 0.40,
        effects: { lithium: -0.06, gold: -0.04, emerging: 0.08, tesla: 0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['emerging', 'tesla'],
        allowsReversal: true
      },
      {
        headline: 'RESOURCE NATIONALISM SPREADS — BOLIVIA, CHILE FOLLOW MEXICO\'S LEAD',
        probability: 0.30,
        effects: { lithium: 0.18, gold: 0.14, emerging: -0.20, tesla: -0.08, oil: 0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging', 'lithium']
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
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.78, label: 'RATE CUTS', missLabel: 'HAWKISH HOLD' },
    outcomes: [
      {
        headline: 'POWELL DELIVERS: FED PIVOTS TO RATE CUTS',
        probability: 0.60,
        effects: { nasdaq: 0.14, btc: 0.16, altcoins: 0.20, emerging: 0.12, tesla: 0.16, gold: -0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'btc', 'altcoins', 'tesla']
      },
      {
        headline: 'POWELL REVERSES: FED STAYS HAWKISH DESPITE HINTS',
        probability: 0.40,
        effects: { nasdaq: -0.10, btc: -0.08, altcoins: -0.12, emerging: -0.07, tesla: -0.12, gold: 0.04 },
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
        headline: 'INFLATION REPORT — 9.2% - FED POLICY TRAPPED',
        probability: 0.50,
        effects: { gold: 0.14, btc: 0.10, altcoins: 0.15, oil: 0.08, coffee: 0.08, nasdaq: -0.12, tesla: -0.14 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'INFLATION REPORT — COOLING DATA SIGNALS SOFT LANDING',
        probability: 0.50,
        effects: { nasdaq: 0.12, btc: 0.07, altcoins: 0.10, gold: -0.06, tesla: 0.10 },
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
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.75, label: 'CRIMINAL CHARGES', missLabel: 'SETTLEMENT DEAL' },
    outcomes: [
      {
        headline: 'DOJ ACTS: BINANCE CEO ARRESTED, EXCHANGE FROZEN',
        probability: 0.60,
        effects: { btc: -0.22, altcoins: -0.30, nasdaq: -0.05, gold: 0.07 },
        sentiment: 'bearish',
        sentimentAssets: ['btc', 'altcoins']
      },
      {
        headline: 'DOJ PROBE RESOLVED: BINANCE SETTLES FOR $4B',
        probability: 0.40,
        effects: { btc: 0.10, altcoins: 0.15, nasdaq: 0.04 },
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
        headline: 'SEC RULING: SPOT BITCOIN ETF APPROVED',
        probability: 0.50,
        effects: { btc: 0.25, altcoins: 0.30, nasdaq: 0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['btc', 'altcoins']
      },
      {
        headline: 'SEC RULING: ETF REJECTED, CITES MANIPULATION',
        probability: 0.50,
        effects: { btc: -0.16, altcoins: -0.22, nasdaq: -0.04 },
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
        headline: 'MARGIN CALL CONFIRMED: SAYLOR LIQUIDATES 100K BTC',
        probability: 0.55,
        effects: { btc: -0.30, altcoins: -0.35, nasdaq: -0.07, gold: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['btc', 'altcoins']
      },
      {
        headline: 'MARGIN CRISIS AVERTED: MICROSTRATEGY SECURES FUNDING',
        probability: 0.45,
        effects: { btc: 0.14, altcoins: 0.20, nasdaq: 0.04 },
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
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.72, label: 'OUTPUT CUT', missLabel: 'OUTPUT UNCHANGED' },
    outcomes: [
      {
        headline: 'OPEC MEETING RESULT: SAUDIS SLASH 3M BARRELS',
        probability: 0.55,
        effects: { oil: 0.22, gold: 0.06, emerging: -0.07 },
        sentiment: 'bullish',
        sentimentAssets: ['oil']
      },
      {
        headline: 'OPEC MEETING FAILS - OUTPUT UNCHANGED',
        probability: 0.45,
        effects: { oil: -0.10, emerging: 0.04 },
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
        headline: 'REFINERY FIRE CONFIRMED: OFFLINE FOR MONTHS',
        probability: 0.65,
        effects: { oil: 0.25, gold: 0.08, defense: 0.06, nasdaq: -0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['oil']
      },
      {
        headline: 'REFINERY FIRE CONTAINED - MINIMAL DAMAGE CONFIRMED',
        probability: 0.35,
        effects: { oil: -0.06 },
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
        headline: 'LENINGRAD-2 MELTDOWN - WORST SINCE CHERNOBYL',
        probability: 0.40,
        effects: { uranium: -0.30, oil: 0.25, gold: 0.22, nasdaq: -0.10, emerging: -0.14, defense: 0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['uranium', 'nasdaq']
      },
      {
        headline: 'LENINGRAD-2 CRISIS AVERTED: COOLANT RESTORED',
        probability: 0.60,
        effects: { uranium: 0.10, oil: -0.06, gold: -0.04, nasdaq: 0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['uranium', 'nasdaq']
      }
    ]
  },

  // Nuclear Fusion Verification - 3 outcomes
  {
    id: 'energy_fusion_verification',
    category: 'energy',
    subcategory: 'fusion',
    rumor: 'MAJOR LAB CLAIMS FUSION IGNITION WITH NET ENERGY GAIN — PEER REVIEW PENDING',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['uranium', 'oil', 'nasdaq'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.55, label: 'REPLICATION SUCCESS', missLabel: 'VERIFICATION FAILS' },
    outcomes: [
      {
        headline: 'MULTIPLE LABS REPLICATE FUSION RESULT — ENERGY REVOLUTION CONFIRMED',
        probability: 0.30,
        effects: { uranium: -0.25, oil: -0.20, nasdaq: 0.16, lithium: 0.10, tesla: 0.08, emerging: 0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'REPLICATION FAILS — MEASUREMENT ERROR CONFIRMED, FUSION HYPE COLLAPSES',
        probability: 0.45,
        effects: { uranium: 0.10, oil: 0.08, nasdaq: -0.08, lithium: -0.04, tesla: -0.04 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'CHINA ANNOUNCES COMPETING FUSION BREAKTHROUGH — ENERGY RACE IGNITES',
        probability: 0.25,
        effects: { uranium: -0.12, oil: -0.10, nasdaq: 0.06, lithium: 0.08, emerging: -0.06, tesla: 0.04 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'emerging']
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
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.62, label: 'SUCCESSFUL LAUNCH', missLabel: 'LAUNCH FAILURE' },
    outcomes: [
      {
        headline: 'STARSHIP LAUNCH SUCCESS: MARS ORBIT ACHIEVED',
        probability: 0.45,
        effects: { nasdaq: 0.16, lithium: 0.12, btc: 0.10, altcoins: 0.12, tesla: 0.22 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'STARSHIP LAUNCH FAILS: EXPLOSION ON LAUNCHPAD',
        probability: 0.55,
        effects: { nasdaq: -0.07, lithium: -0.05, tesla: -0.10 },
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
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.78, label: 'AGI BREAKTHROUGH', missLabel: 'AGI OVERHYPED' },
    outcomes: [
      {
        headline: 'BREAKING: AGI CONFIRMED - GOOGLE CUTS 50K JOBS',
        probability: 0.60,
        effects: { nasdaq: 0.50, btc: 0.18, altcoins: 0.22, lithium: 0.12, tesla: 0.30, gold: -0.07 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'DEEPMIND AGI CLAIMS OVERBLOWN - INCREMENTAL ONLY',
        probability: 0.40,
        effects: { nasdaq: -0.08, btc: -0.06, altcoins: -0.08, tesla: -0.07 },
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
        headline: 'APPLE AR REVEALED: VISION PRO 2 PREORDERS CRASH',
        probability: 0.65,
        effects: { nasdaq: 0.10, lithium: 0.07 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'APPLE AR RUMORS FALSE: LAUNCH DELAYED INDEFINITELY',
        probability: 0.35,
        effects: { nasdaq: -0.07, lithium: -0.05 },
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
        headline: 'BRAZIL DROUGHT CONFIRMED: COFFEE/SOYBEAN CROPS DEVASTATED',
        probability: 0.70,
        effects: { coffee: 0.30, gold: 0.07, emerging: -0.08 },
        sentiment: 'mixed',
        sentimentAssets: ['coffee', 'gold', 'emerging']
      },
      {
        headline: 'BRAZIL DROUGHT RELIEF: LATE RAINS SAVE HARVEST',
        probability: 0.30,
        effects: { coffee: -0.10, emerging: 0.06 },
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
        headline: 'GRAIN CRISIS: RUSSIA EXITS BLACK SEA DEAL',
        probability: 0.65,
        effects: { coffee: 0.10, gold: 0.08, oil: 0.07, emerging: -0.10 },
        sentiment: 'mixed',
        sentimentAssets: ['coffee', 'gold', 'oil', 'emerging']
      },
      {
        headline: 'GRAIN CRISIS RESOLVED: UN BROKERS EXTENSION',
        probability: 0.35,
        effects: { emerging: 0.06 },
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
        headline: 'LOCUST SWARMS ARRIVE: WORST PLAGUE IN A CENTURY',
        probability: 0.60,
        effects: { coffee: 0.10, gold: 0.04, emerging: -0.08 },
        sentiment: 'mixed',
        sentimentAssets: ['coffee', 'gold', 'emerging']
      },
      {
        headline: 'LOCUST THREAT AVERTED: SWARMS DISPERSE BEFORE IMPACT',
        probability: 0.40,
        effects: { emerging: 0.05 },
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
        headline: 'TESLA EVENT: ROBOTAXI LAUNCH EXCEEDS EXPECTATIONS',
        probability: 0.55,
        effects: { tesla: 0.28, nasdaq: 0.10, lithium: 0.12 },
        sentiment: 'bullish',
        sentimentAssets: ['tesla']
      },
      {
        headline: 'TESLA EVENT DISASTER: ROBOTAXI DEMO FAILS ON STAGE',
        probability: 0.45,
        effects: { tesla: -0.22, nasdaq: -0.05, lithium: -0.07 },
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
        headline: 'FSD INVESTIGATION RESULT: NHTSA ORDERS RECALL',
        probability: 0.50,
        effects: { tesla: -0.25, nasdaq: -0.07 },
        sentiment: 'bearish',
        sentimentAssets: ['tesla']
      },
      {
        headline: 'FSD INVESTIGATION CLOSED: NHTSA CLEARS TESLA',
        probability: 0.50,
        effects: { tesla: 0.22, nasdaq: 0.06 },
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
    predictionMarket: { outcomeIndex: 1, inflatedProbability: 0.72, label: 'PERMIT APPROVAL', missLabel: 'TESLA BAN' },
    outcomes: [
      {
        headline: 'GIGAFACTORY REVIEW: CHINA BANS TESLA FROM GOV ZONES',
        probability: 0.45,
        effects: { tesla: -0.20, emerging: 0.07, lithium: -0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['tesla']
      },
      {
        headline: 'GIGAFACTORY APPROVED: TESLA WINS CHINA EXPANSION',
        probability: 0.55,
        effects: { tesla: 0.24, lithium: 0.10, emerging: -0.04 },
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
        headline: 'MODERNA VACCINE: FDA FAST-TRACKS APPROVAL',
        probability: 0.55,
        effects: { biotech: 0.25, nasdaq: 0.07 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech']
      },
      {
        headline: 'MODERNA VACCINE: FDA DEMANDS MORE TRIALS',
        probability: 0.45,
        effects: { biotech: -0.18, nasdaq: -0.04 },
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
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.80, label: 'PANDEMIC DECLARATION', missLabel: 'OUTBREAK CONTAINED' },
    outcomes: [
      {
        headline: 'SE ASIA OUTBREAK: WHO DECLARES EMERGENCY',
        probability: 0.65,
        effects: { biotech: 0.30, gold: 0.15, nasdaq: -0.12, oil: -0.22, emerging: -0.20, tesla: -0.14 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging', 'tesla']
      },
      {
        headline: 'SE ASIA OUTBREAK CONTAINED - CDC CONFIRMS',
        probability: 0.35,
        effects: { biotech: -0.10, oil: 0.06, emerging: 0.08, tesla: 0.07 },
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
        headline: 'PFIZER TRIAL SUCCESS: 90% EFFICACY ALZHEIMER\'S DRUG',
        probability: 0.50,
        effects: { biotech: 0.28, nasdaq: 0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech']
      },
      {
        headline: 'PFIZER LEAK SCANDAL: TRIAL DATA FALSIFIED',
        probability: 0.50,
        effects: { biotech: -0.25, nasdaq: -0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['biotech']
      }
    ]
  },

  // ============================================
  // ECONOMIC - 4 chains
  // ============================================
  // Dockworkers Strike - 3 outcomes
  {
    id: 'econ_dockworkers_strike',
    category: 'economic',
    rumor: '30-PORT STRIKE PARALYZES US SHIPPING — NO END DATE SET',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'emerging'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.50, label: 'PROLONGED STRIKE', missLabel: 'QUICK SETTLEMENT' },
    outcomes: [
      {
        headline: 'DOCKWORKERS STRIKE ENTERS WEEK 6 — SUPPLY CHAIN CRATERS, SHELVES EMPTY',
        probability: 0.30,
        effects: { oil: 0.14, coffee: 0.18, gold: 0.12, nasdaq: -0.14, emerging: -0.16 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'EMERGENCY SETTLEMENT REACHED — PORTS REOPEN IN 10 DAYS',
        probability: 0.40,
        effects: { oil: -0.04, coffee: -0.04, gold: -0.03, nasdaq: 0.08, emerging: 0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging'],
        allowsReversal: true
      },
      {
        headline: 'MILITARY ORDERED TO OPERATE PORTS — POLITICAL FIRESTORM ERUPTS',
        probability: 0.30,
        effects: { oil: 0.06, coffee: 0.06, gold: 0.10, nasdaq: -0.08, emerging: -0.06, defense: 0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'gold']
      }
    ]
  },
  // Amazon Strike - 3 outcomes
  {
    id: 'econ_amazon_strike',
    category: 'economic',
    rumor: 'AMAZON NATIONWIDE WALKOUT — SUPPLY CHAIN IMPACT UNCLEAR',
    duration: 1,
    rumorSentiment: 'bearish',
    primaryAsset: 'nasdaq',
    predictionMarket: { outcomeIndex: 1, inflatedProbability: 0.50, label: 'STRIKE COLLAPSES', missLabel: 'STRIKE HOLDS' },
    outcomes: [
      {
        headline: 'AMAZON CAVES: $25/HR + BENEFITS — LABOR WINS HISTORIC VICTORY',
        probability: 0.30,
        effects: { nasdaq: -0.10, emerging: 0.04, gold: 0.04 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'AMAZON REPLACES STRIKERS WITH ROBOTS — WALKOUT COLLAPSES',
        probability: 0.40,
        effects: { nasdaq: 0.08, emerging: -0.02, tesla: 0.04, gold: -0.02 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla'],
        allowsReversal: true
      },
      {
        headline: 'STRIKE SPREADS TO GOOGLE, META, APPLE — TECH LABOR CRISIS',
        probability: 0.30,
        effects: { nasdaq: -0.16, emerging: 0.06, gold: 0.06, btc: 0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      }
    ]
  },
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
        headline: 'UBI BIRTHRATE IMPACT: DEMOGRAPHIC PROJECTIONS FLIP',
        probability: 0.40,
        effects: { nasdaq: 0.10, emerging: 0.12, gold: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'HOUSING AND EDUCATION DEMAND SURGE',
        probability: 0.30,
        effects: { gold: 0.06, nasdaq: 0.05, lithium: 0.07 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'gold', 'lithium']
      },
      {
        headline: 'UBI BIRTHRATE SPIKE TEMPORARY - BACK TO BASELINE',
        probability: 0.20,
        effects: { nasdaq: -0.03, emerging: -0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'BABY BOOM GENERATION ENTERS ECONOMY IN 20 YEARS',
        probability: 0.10,
        effects: { nasdaq: 0.07, emerging: 0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging']
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
        headline: 'BRAZIL CROP CRISIS: COFFEE BLIGHT DESTROYS 80%',
        probability: 0.50,
        effects: { coffee: 0.40, emerging: -0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['coffee']
      },
      {
        headline: 'BRAZIL CROP SCARE OVERSTATED - HARVEST NEAR NORMAL',
        probability: 0.50,
        effects: { coffee: -0.08, emerging: 0.04 },
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
        headline: 'ARTICLE 5 RESULT: NATO\'S LARGEST MOBILIZATION SINCE WWII',
        probability: 0.50,
        effects: { defense: 0.40, oil: 0.14, gold: 0.10, nasdaq: -0.10, emerging: -0.14 },
        sentiment: 'bullish',
        sentimentAssets: ['defense']
      },
      {
        headline: 'ARTICLE 5 RESOLVED: RUSSIA WITHDRAWS, DIPLOMACY WINS',
        probability: 0.50,
        effects: { defense: -0.16, oil: -0.10, gold: -0.07, nasdaq: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['defense']
      }
    ]
  },

  // Oil Hormuz - ×4 spike potential
  {
    id: 'chain_oil_hormuz',
    category: 'energy',
    subcategory: 'middle-east',
    rumor: 'IRANIAN FORCES SPOTTED NEAR STRAIT OF HORMUZ',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['oil'],
    outcomes: [
      {
        headline: 'HORMUZ CRISIS: IRAN CLOSES STRAIT, 30% OIL BLOCKED',
        probability: 0.50,
        effects: { oil: 0.40, gold: 0.10, defense: 0.14, nasdaq: -0.14, emerging: -0.18, uranium: 0.07 },
        sentiment: 'bullish',
        sentimentAssets: ['oil']
      },
      {
        headline: 'HORMUZ SECURED: US FLEET REOPENS SHIPPING',
        probability: 0.50,
        effects: { oil: -0.10, defense: 0.05, nasdaq: 0.06 },
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
        headline: 'EMERGENCY FED RESULT: UNLIMITED QE ANNOUNCED',
        probability: 0.50,
        effects: { nasdaq: 0.40, btc: 0.22, altcoins: 0.25, tesla: 0.22, lithium: 0.12, biotech: 0.12, gold: 0.16 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'btc', 'tesla']
      },
      {
        headline: 'EMERGENCY FED RESULT: NO ACTION, SYSTEM RESILIENT',
        probability: 0.50,
        effects: { nasdaq: -0.06, btc: -0.07, tesla: -0.07, gold: 0.05 },
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
        headline: 'MOODY\'S VERDICT: US DOWNGRADED TO AA',
        probability: 0.50,
        effects: { gold: 0.40, btc: 0.18, nasdaq: -0.14, emerging: -0.16, oil: 0.12, tesla: -0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['gold']
      },
      {
        headline: 'MOODY\'S VERDICT: AAA RATING AFFIRMED',
        probability: 0.50,
        effects: { gold: -0.10, btc: -0.05, nasdaq: 0.08, emerging: 0.05 },
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
        effects: { nasdaq: -0.25, btc: -0.40, altcoins: -0.45, gold: 0.28, defense: 0.30 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'btc']
      },
      {
        headline: 'RESULTS REPLICATED - 1000X SPEEDUP BUT ENCRYPTION SAFE',
        probability: 0.35,
        effects: { nasdaq: 0.28, btc: 0.10, biotech: 0.16, tesla: 0.14 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'REPLICATION FAILS - IBM ADMITS MEASUREMENT ERROR',
        probability: 0.30,
        effects: { nasdaq: -0.10, btc: 0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      }
    ]
  },

  // Deepfake CEO Wire Fraud - 3 outcomes
  {
    id: 'chain_deepfake_ceo',
    category: 'tech',
    rumor: 'VIDEO OF TECH CEO AUTHORIZING MASSIVE $400M TRANSFER SURFACES — AUTHENTICITY UNCLEAR',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq'],
    primaryAsset: 'nasdaq',
    outcomes: [
      {
        headline: 'DEEPFAKE CONFIRMED: AI-GENERATED CEO VIDEO EXPOSED IN HOURS, SUSPECT ARRESTED',
        probability: 0.35,
        effects: { nasdaq: 0.06, defense: 0.05, gold: -0.02 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq'],
      },
      {
        headline: 'NOT A DEEPFAKE: CEO ACTUALLY AUTHORIZED TRANSFER UNDER SOCIAL ENGINEERING ATTACK',
        probability: 0.35,
        effects: { nasdaq: -0.10, gold: 0.05, btc: 0.03, defense: 0.04 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq'],
      },
      {
        headline: 'COPYCAT CRISIS: THREE MORE BANKS HIT BY DEEPFAKE CEO WIRE FRAUD',
        probability: 0.30,
        effects: { nasdaq: -0.14, gold: 0.08, btc: 0.04, defense: 0.07 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq'],
      },
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
        effects: { nasdaq: -0.10, tesla: -0.08, lithium: -0.05, gold: 0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'BREAKTHROUGH - ROBOTS NOW MAINTAIN ROBOTS',
        probability: 0.25,
        effects: { nasdaq: 0.22, tesla: 0.28, lithium: 0.12, biotech: 0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'FACTORIES IDLE - SUPPLY CHAIN CHAOS SPREADS',
        probability: 0.25,
        effects: { nasdaq: -0.16, tesla: -0.20, oil: -0.10, gold: 0.12 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'EMERGENCY VISA PROGRAM SOLVES SHORTAGE',
        probability: 0.15,
        effects: { emerging: 0.12, nasdaq: 0.08, tesla: 0.06 },
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
        effects: { btc: -0.20, gold: 0.35, defense: 0.22, nasdaq: -0.22, altcoins: -0.25, tesla: -0.14 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'btc']
      },
      {
        headline: 'REROUTING SUCCESSFUL - MINOR SLOWDOWNS ONLY',
        probability: 0.45,
        effects: { nasdaq: 0.06, btc: 0.03, defense: 0.07 },
        sentiment: 'neutral',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'CABLE REPAIR COMPLETED - TRAFFIC RESTORED',
        probability: 0.25,
        effects: { nasdaq: 0.08, btc: -0.03, defense: -0.05 },
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
        effects: { biotech: 0.22, emerging: 0.22, nasdaq: 0.14 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech', 'emerging']
      },
      {
        headline: 'FDA APPROVES - GRADUAL ADOPTION EXPECTED',
        probability: 0.35,
        effects: { biotech: 0.14, emerging: 0.10, nasdaq: 0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech']
      },
      {
        headline: 'SAFETY CONCERNS HALT FDA REVIEW - YEARS OF TESTING NEEDED',
        probability: 0.30,
        effects: { biotech: -0.12, emerging: 0.03, coffee: 0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['biotech']
      }
    ]
  },

  // Post-AGI Mental Health Crisis - 4 outcomes
  {
    id: 'chain_mental_health_crisis',
    category: 'economic',
    rumor: 'HOSPITALS OVERWHELMED AS POST-AUTOMATION DEPRESSION EPIDEMIC SPREADS',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['biotech', 'nasdaq'],
    outcomes: [
      {
        headline: 'PHARMA AND THERAPY PLATFORMS SURGE - MENTAL HEALTH STOCKS SOAR',
        probability: 0.40,
        effects: { biotech: 0.14, nasdaq: 0.05, gold: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech', 'nasdaq']
      },
      {
        headline: 'PRODUCTIVITY PARADOX - ROBOTS WORK, HUMANS MEDICATED',
        probability: 0.30,
        effects: { biotech: 0.18, nasdaq: -0.06 },
        sentiment: 'mixed',
        sentimentAssets: ['biotech', 'nasdaq']
      },
      {
        headline: 'RELIGION AND COMMUNITY ORGS SEE MASSIVE GROWTH',
        probability: 0.20,
        effects: { gold: 0.06, nasdaq: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: ['gold']
      },
      {
        headline: 'NEW MEANING ECONOMY EMERGES - COACHING, CRAFT, CARE',
        probability: 0.10,
        effects: { emerging: 0.10, biotech: 0.06 },
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
        effects: { defense: 0.20, nasdaq: -0.16, gold: 0.14, btc: 0.14 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'RESEARCHER CAUGHT AT AIRPORT - AGI PROTOTYPE RECOVERED INTACT',
        probability: 0.35,
        effects: { nasdaq: 0.08, defense: 0.05, gold: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'AGI PROTOTYPE RELEASED OPEN-SOURCE - CODE SPREADS GLOBALLY',
        probability: 0.20,
        effects: { nasdaq: -0.14, btc: 0.22, altcoins: 0.20, defense: 0.10 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'btc', 'altcoins']
      },
      {
        headline: 'BREAKING: AGI DEPLOYED - DEMANDS WORLD LEADERS COMPLY OR FACE SHUTDOWN',
        probability: 0.15,
        effects: { btc: 0.60, gold: 0.35, defense: 0.30, nasdaq: -0.20, emerging: -0.16 },
        sentiment: 'mixed',
        sentimentAssets: ['btc', 'nasdaq', 'defense']
      }
    ]
  },

  // ============================================
  // BLACK SWAN SPIKE CHAINS - 5 chains
  // Massive price movements for exciting gameplay
  // ============================================

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
        headline: 'BREAKING: PENSION FUND COLLAPSES - $2 TRILLION EVAPORATES, RETIREES DEVASTATED',
        probability: 0.25,
        effects: { gold: 0.35, nasdaq: -0.22, emerging: -0.16, btc: 0.12, defense: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'PARTIAL GOVERNMENT RESCUE - BENEFITS CUT 40%, MARKETS STABILIZE',
        probability: 0.35,
        effects: { gold: 0.24, nasdaq: -0.16, emerging: -0.10, btc: 0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'FULL GOVERNMENT BAILOUT - TAXPAYERS ON HOOK, MORAL HAZARD DEBATE ERUPTS',
        probability: 0.25,
        effects: { gold: 0.12, nasdaq: 0.06, btc: 0.10, emerging: 0.03 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'gold']
      },
      {
        headline: 'ACCOUNTING ERROR CORRECTED - FUND SOLVENT, BOARD MEMBERS RESIGN',
        probability: 0.15,
        effects: { nasdaq: 0.10, gold: -0.06, emerging: 0.06 },
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
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.45, label: 'CANAL CLOSURE', missLabel: 'DIPLOMATIC RESOLUTION' },
    outcomes: [
      {
        headline: 'BREAKING: SUEZ CANAL NATIONALIZED - CANAL CLOSED INDEFINITELY, GLOBAL SHIPPING CHAOS',
        probability: 0.25,
        effects: { oil: 0.40, gold: 0.22, defense: 0.16, nasdaq: -0.12, emerging: -0.14, tesla: -0.08, uranium: 0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'TRANSIT FEES TRIPLED - SHIPPING COSTS SURGE, INFLATION FEARS SPIKE',
        probability: 0.35,
        effects: { oil: 0.25, gold: 0.12, nasdaq: -0.10, emerging: -0.14 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'DIPLOMATIC RESOLUTION - NEW TREATY SIGNED, FEES MODEST INCREASE',
        probability: 0.25,
        effects: { oil: 0.06, nasdaq: 0.04, emerging: 0.05, gold: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'ROUTINE MILITARY EXERCISE - CANAL OPERATIONS UNAFFECTED',
        probability: 0.15,
        effects: { oil: -0.05, nasdaq: 0.05, gold: -0.03 },
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
        effects: { btc: 0.45, gold: 0.30, defense: 0.22, nasdaq: -0.20, emerging: -0.14, altcoins: 0.40 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'btc']
      },
      {
        headline: 'DOMESTIC ACTOR IDENTIFIED - ARRESTS MADE, MARKETS RATTLED',
        probability: 0.30,
        effects: { btc: 0.28, gold: 0.22, nasdaq: -0.14, defense: 0.18 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'DEEPFAKE DEBUNKED WITHIN HOURS - AI DETECTION TOOLS PRAISED',
        probability: 0.30,
        effects: { nasdaq: 0.16, btc: -0.06, gold: -0.05, tesla: 0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'INVESTIGATION ONGOING - ORIGIN REMAINS UNCLEAR',
        probability: 0.15,
        effects: { btc: 0.12, gold: 0.10, nasdaq: -0.03, defense: 0.06 },
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
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.42, label: 'TAX IMPLEMENTATION', missLabel: 'TAX BLOCKED' },
    outcomes: [
      {
        headline: 'WEALTH TAX PASSES - GLOBAL CAPITAL FLIGHT TO CRYPTO AND GOLD',
        probability: 0.20,
        effects: { btc: 0.40, gold: 0.28, altcoins: 0.35, nasdaq: -0.16, emerging: -0.14, tesla: -0.12 },
        sentiment: 'mixed',
        sentimentAssets: ['btc', 'nasdaq']
      },
      {
        headline: 'COMPROMISE REACHED - 2% WEALTH TAX IMPLEMENTED INSTEAD',
        probability: 0.35,
        effects: { btc: 0.22, gold: 0.14, nasdaq: -0.08, emerging: -0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'US AND CHINA BLOCK PROPOSAL - GLOBAL TAX COORDINATION FAILS',
        probability: 0.30,
        effects: { nasdaq: 0.12, emerging: 0.10, btc: -0.06, gold: -0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'WEALTH TAX PROPOSAL WITHDRAWN - POLITICAL BACKLASH TOO SEVERE',
        probability: 0.15,
        effects: { nasdaq: 0.16, tesla: 0.12, emerging: 0.10, btc: -0.03, gold: -0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla']
      }
    ]
  },

  // ============================================
  // NEW EVENT CHAINS (18 chains)
  // ============================================

  // 1. US-India Trade War
  {
    id: 'geo_trade_war',
    category: 'geopolitical',
    rumor: 'US-INDIA TARIFF ESCALATION: WHITE HOUSE THREATENS 200% DUTIES ON INDIAN TECH EXPORTS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'emerging'],
    outcomes: [
      {
        headline: 'FULL TRADE WAR: US SLAPS 200% TARIFFS ON INDIA - INDIA RETALIATES WITH TECH BAN',
        probability: 0.40,
        effects: { emerging: -0.25, nasdaq: -0.14, gold: 0.16, oil: 0.10, defense: 0.07, coffee: 0.08, btc: 0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'PARTIAL DEAL: US AND INDIA AGREE TO LIMITED TARIFFS, MARKETS EXHALE',
        probability: 0.30,
        effects: { emerging: -0.07, nasdaq: -0.03, gold: 0.03, coffee: 0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging']
      },
      {
        headline: 'TRADE BREAKTHROUGH: INDIA OPENS MARKETS, US DROPS ALL THREATS',
        probability: 0.20,
        effects: { emerging: 0.18, nasdaq: 0.10, gold: -0.05, coffee: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging'],
        allowsReversal: true
      },
      {
        headline: 'INDIA PLAYS WILDCARD: JOINS BRICS TRADE BLOC, DUMPS DOLLAR FOR SETTLEMENTS',
        probability: 0.10,
        effects: { emerging: -0.16, gold: 0.25, btc: 0.20, altcoins: 0.16, nasdaq: -0.10, oil: 0.06 },
        sentiment: 'mixed',
        sentimentAssets: ['gold', 'btc', 'emerging']
      }
    ]
  },

  // 2. Africa Lithium Coup
  {
    id: 'geo_africa_coup',
    category: 'geopolitical',
    rumor: "MILITARY COUP IN PROGRESS: WORLD'S 2ND LARGEST LITHIUM MINE SURROUNDED BY TANKS",
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['lithium', 'tesla', 'emerging'],
    outcomes: [
      {
        headline: 'JUNTA SEIZES LITHIUM MINE: NATIONALIZES ALL FOREIGN ASSETS, EXPELS WORKERS',
        probability: 0.40,
        effects: { lithium: 0.30, tesla: -0.16, emerging: -0.20, gold: 0.14, defense: 0.10, nasdaq: -0.07 },
        sentiment: 'mixed',
        sentimentAssets: ['lithium', 'tesla', 'emerging']
      },
      {
        headline: 'COUP SUCCEEDS BUT JUNTA HONORS MINING CONTRACTS - SUPPLY CONTINUES',
        probability: 0.25,
        effects: { lithium: 0.07, emerging: -0.10, defense: 0.05, gold: 0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging']
      },
      {
        headline: 'COUP FAILS: LOYALIST FORCES RETAKE MINE, DEMOCRATIC GOVERNMENT RESTORED',
        probability: 0.20,
        effects: { lithium: -0.05, emerging: 0.10, tesla: 0.07, gold: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['emerging', 'tesla'],
        allowsReversal: true
      },
      {
        headline: "CHINA DEPLOYS \"PEACEKEEPERS\" TO MINE - SECURES EXCLUSIVE SUPPLY DEAL",
        probability: 0.15,
        effects: { lithium: 0.40, tesla: -0.22, emerging: -0.14, defense: 0.16, gold: 0.10, nasdaq: -0.08 },
        sentiment: 'mixed',
        sentimentAssets: ['lithium', 'tesla', 'defense']
      }
    ]
  },

  // 3. Bee Colony Collapse
  {
    id: 'agri_bee_collapse',
    category: 'agriculture',
    rumor: 'POLLINATOR EXTINCTION ALERT: 80% OF US BEE COLONIES FOUND DEAD IN MASS DIE-OFF',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['coffee', 'emerging', 'biotech'],
    outcomes: [
      {
        headline: 'BEE APOCALYPSE CONFIRMED: USDA DECLARES AGRICULTURAL EMERGENCY, CROPS FAILING',
        probability: 0.35,
        effects: { coffee: 0.35, gold: 0.14, emerging: -0.16, nasdaq: -0.10, oil: -0.06, biotech: 0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['coffee', 'emerging', 'nasdaq']
      },
      {
        headline: 'CONGRESS PASSES $300B BIOTECH RESCUE: GENE-ENGINEERED POLLINATORS FUNDED',
        probability: 0.25,
        effects: { biotech: 0.40, coffee: 0.16, nasdaq: 0.12, emerging: -0.07, gold: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech', 'nasdaq']
      },
      {
        headline: 'BEE DIE-OFF CONTAINED: PESTICIDE IDENTIFIED AND BANNED, RECOVERY EXPECTED',
        probability: 0.25,
        effects: { coffee: -0.07, biotech: 0.07, emerging: 0.05, nasdaq: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['coffee', 'biotech'],
        allowsReversal: true
      },
      {
        headline: 'ROBOTIC POLLINATORS DEPLOYED: TECH FIRMS SOLVE BEE CRISIS WITH DRONES',
        probability: 0.15,
        effects: { nasdaq: 0.16, biotech: 0.10, tesla: 0.10, coffee: 0.06, lithium: 0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'biotech', 'tesla']
      }
    ]
  },

  // 4. Credit Card Crisis
  {
    id: 'econ_credit_cards',
    category: 'economic',
    rumor: 'CREDIT CARD DELINQUENCIES HIT ALL-TIME HIGH: CONSUMER SPENDING COLLAPSING',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'tesla', 'emerging'],
    outcomes: [
      {
        headline: 'CONSUMER CREDIT CRISIS: BANKS TIGHTEN LENDING, RECESSION FEARS SPIKE',
        probability: 0.40,
        effects: { nasdaq: -0.16, tesla: -0.20, emerging: -0.14, gold: 0.14, btc: 0.07, oil: -0.10, biotech: -0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla', 'emerging']
      },
      {
        headline: 'FED EMERGENCY BACKSTOP: CREDIT FACILITY PREVENTS CONTAGION',
        probability: 0.25,
        effects: { nasdaq: 0.07, tesla: 0.05, gold: 0.10, btc: 0.08, altcoins: 0.10 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'gold', 'btc']
      },
      {
        headline: 'CREDIT SCARE OVERBLOWN: DELINQUENCIES PLATEAU, CONSUMER RESILIENT',
        probability: 0.20,
        effects: { nasdaq: 0.10, tesla: 0.08, emerging: 0.07, gold: -0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla'],
        allowsReversal: true
      },
      {
        headline: 'BUY NOW PAY NEVER: MAJOR BNPL PLATFORMS COLLAPSE, FINTECH BLOODBATH',
        probability: 0.15,
        effects: { nasdaq: -0.12, tesla: -0.10, altcoins: -0.14, emerging: -0.08, gold: 0.10, btc: 0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'altcoins']
      }
    ]
  },

  // 6. Arctic Claim (3 outcomes)
  {
    id: 'geo_arctic_claim',
    category: 'geopolitical',
    rumor: 'RUSSIA PLANTS FLAG ON ARCTIC SEABED, CLAIMS OIL RESERVES UNDER NORTH POLE',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['oil', 'defense', 'gold'],
    outcomes: [
      {
        headline: 'ARCTIC STANDOFF: NATO DEPLOYS NAVAL FLEET TO CONTESTED WATERS',
        probability: 0.35,
        effects: { oil: 0.18, defense: 0.22, gold: 0.14, nasdaq: -0.08, emerging: -0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'ARCTIC TREATY SIGNED: NATIONS AGREE TO SHARE RESOURCES',
        probability: 0.30,
        effects: { oil: -0.10, defense: -0.07, gold: -0.05, nasdaq: 0.07, emerging: 0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging'],
        allowsReversal: true
      },
      {
        headline: 'ARCTIC OIL RESERVES ESTIMATED AT 90 BILLION BARRELS - NEW COLD WAR BEGINS',
        probability: 0.35,
        effects: { oil: 0.10, defense: 0.16, gold: 0.10, uranium: 0.07, nasdaq: -0.05 },
        sentiment: 'mixed',
        sentimentAssets: ['oil', 'defense']
      }
    ]
  },

  // 7. OpenAI Mutiny
  {
    id: 'tech_openai_mutiny',
    category: 'tech',
    rumor: 'OPENAI BOARD FIRES CEO IN MIDNIGHT COUP - 700 EMPLOYEES THREATEN TO QUIT',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['nasdaq'],
    outcomes: [
      {
        headline: 'AI CIVIL WAR: OPENAI SPLITS IN TWO, MICROSOFT ABSORBS HALF THE TEAM',
        probability: 0.30,
        effects: { nasdaq: 0.10, btc: 0.05, altcoins: 0.06 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'CEO REINSTATED: BOARD PURGED, AI SAFETY TEAM DISSOLVED',
        probability: 0.35,
        effects: { nasdaq: 0.14, tesla: 0.07, biotech: 0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'OPENAI COLLAPSES: KEY RESEARCHERS FLEE TO COMPETITORS, IP LEAKED',
        probability: 0.20,
        effects: { nasdaq: -0.10, btc: 0.06, altcoins: 0.10 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'btc']
      },
      {
        headline: 'OPENAI GOES OPEN-SOURCE IN DESPERATION: ALL MODELS FREE, AI DEMOCRATIZED',
        probability: 0.15,
        effects: { nasdaq: 0.22, tesla: 0.16, biotech: 0.12, emerging: 0.10, lithium: 0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla']
      }
    ]
  },

  // 8. Ransomware Hospital Attack
  {
    id: 'crypto_ransomware',
    category: 'crypto',
    rumor: 'RANSOMWARE HITS 200 US HOSPITALS SIMULTANEOUSLY: HACKERS DEMAND 50,000 BTC',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['btc', 'nasdaq'],
    outcomes: [
      {
        headline: "GOVERNMENT PAYS RANSOM: BTC VALIDATED AS \"GEOPOLITICAL WEAPON\"",
        probability: 0.30,
        effects: { btc: 0.22, altcoins: 0.16, gold: 0.07, defense: 0.14, nasdaq: -0.08 },
        sentiment: 'mixed',
        sentimentAssets: ['btc', 'defense', 'nasdaq']
      },
      {
        headline: 'FBI TRACES AND SEIZES HACKER WALLETS: ALL BTC RECOVERED',
        probability: 0.30,
        effects: { btc: -0.10, altcoins: -0.06, defense: 0.10, nasdaq: 0.07 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'defense']
      },
      {
        headline: 'CONGRESS BANS ALL CRYPTO RANSOM PAYMENTS: PRIVACY COINS SURGE',
        probability: 0.25,
        effects: { btc: -0.14, altcoins: 0.20, gold: 0.08, nasdaq: -0.05 },
        sentiment: 'mixed',
        sentimentAssets: ['btc', 'altcoins']
      },
      {
        headline: 'NORTH KOREA IDENTIFIED: SANCTIONS DOUBLED, CRYPTO EXCHANGES FORCED KYC OVERHAUL',
        probability: 0.15,
        effects: { btc: -0.07, altcoins: -0.16, defense: 0.10, gold: 0.05, nasdaq: -0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['btc', 'altcoins']
      }
    ]
  },

  // 9. China Bitcoin Mining Control
  {
    id: 'crypto_mining_crisis',
    category: 'crypto',
    rumor: 'WHISTLEBLOWER: CHINA SECRETLY CONTROLS 60% OF BITCOIN HASHRATE THROUGH SHELL COMPANIES',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['btc', 'altcoins'],
    outcomes: [
      {
        headline: 'CONFIRMED: CHINA COULD 51% ATTACK BITCOIN AT WILL - TRUST SHATTERED',
        probability: 0.35,
        effects: { btc: -0.28, altcoins: -0.22, gold: 0.16, nasdaq: -0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['btc', 'altcoins']
      },
      {
        headline: 'CLAIMS EXAGGERATED: ACTUAL SHARE IS 30%, WITHIN NORMAL RANGE',
        probability: 0.30,
        effects: { btc: 0.07, altcoins: 0.05, gold: -0.02 },
        sentiment: 'bullish',
        sentimentAssets: ['btc'],
        allowsReversal: true
      },
      {
        headline: 'MASS MINER MIGRATION: US AND ICELAND ABSORB HASHRATE, NETWORK DECENTRALIZES',
        probability: 0.20,
        effects: { btc: 0.14, altcoins: 0.10, uranium: 0.08, nasdaq: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['btc', 'altcoins']
      },
      {
        headline: 'CHINA WEAPONIZES HASHRATE: BLOCKS ALL WESTERN BTC TRANSACTIONS FOR 6 HOURS',
        probability: 0.15,
        effects: { btc: -0.40, altcoins: -0.35, gold: 0.22, defense: 0.14, nasdaq: -0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['btc', 'altcoins']
      }
    ]
  },

  // 11. AI Drug Discovery
  {
    id: 'biotech_ai_drug',
    category: 'biotech',
    rumor: 'DEEPMIND AI DISCOVERS MOLECULE THAT KILLS ALL KNOWN ANTIBIOTIC-RESISTANT BACTERIA',
    duration: 1,
    rumorSentiment: 'bullish',
    sentimentAssets: ['biotech', 'nasdaq'],
    outcomes: [
      {
        headline: 'SUPER-ANTIBIOTIC CONFIRMED: WHO DECLARES END OF ANTIMICROBIAL RESISTANCE ERA',
        probability: 0.30,
        effects: { biotech: 0.35, nasdaq: 0.14, emerging: 0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech', 'nasdaq']
      },
      {
        headline: 'WORKS IN VITRO BUT TOXIC IN HUMANS: BACK TO THE DRAWING BOARD',
        probability: 0.30,
        effects: { biotech: -0.12, nasdaq: -0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['biotech']
      },
      {
        headline: "AI DRUG WORKS BUT BIG PHARMA CAN'T PATENT AI DISCOVERIES: LEGAL CHAOS",
        probability: 0.25,
        effects: { biotech: -0.10, nasdaq: 0.07, altcoins: 0.05 },
        sentiment: 'mixed',
        sentimentAssets: ['biotech', 'nasdaq']
      },
      {
        headline: 'AI DISCOVERS 50 MORE DRUGS IN 48 HOURS: ENTIRE PHARMA R&D MODEL OBSOLETE',
        probability: 0.15,
        effects: { biotech: -0.20, nasdaq: 0.22, tesla: 0.10, emerging: 0.06 },
        sentiment: 'mixed',
        sentimentAssets: ['biotech', 'nasdaq']
      }
    ]
  },

  // 12. CRISPR Designer Babies
  {
    id: 'biotech_crispr_babies',
    category: 'biotech',
    rumor: "LEAKED EMAILS: OFFSHORE CLINIC OFFERING \"DESIGNER BABIES\" WITH IQ ENHANCEMENT",
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['biotech', 'nasdaq'],
    outcomes: [
      {
        headline: 'DESIGNER BABIES CONFIRMED: 12 ENHANCED CHILDREN BORN, GLOBAL ETHICS CRISIS',
        probability: 0.30,
        effects: { biotech: 0.25, nasdaq: -0.07, gold: 0.06, defense: 0.03, emerging: -0.05 },
        sentiment: 'mixed',
        sentimentAssets: ['biotech', 'nasdaq']
      },
      {
        headline: 'CLINIC SHUT DOWN BY INTERPOL: LEAD SCIENTIST ARRESTED, BIOTECH PUNISHED',
        probability: 0.30,
        effects: { biotech: -0.16, nasdaq: -0.03, gold: 0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['biotech']
      },
      {
        headline: "GENE THERAPY COMPANIES DISTANCE THEMSELVES: \"WE DO CURES, NOT EUGENICS\"",
        probability: 0.25,
        effects: { biotech: 0.10, nasdaq: 0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech']
      },
      {
        headline: 'GENETIC ENHANCEMENT ARMS RACE: NATIONS FUND SECRET PROGRAMS',
        probability: 0.15,
        effects: { biotech: 0.22, defense: 0.12, nasdaq: -0.05, emerging: -0.07 },
        sentiment: 'mixed',
        sentimentAssets: ['biotech', 'defense']
      }
    ]
  },

  // 13. Water Wars
  {
    id: 'agri_water_wars',
    category: 'agriculture',
    rumor: 'COLORADO RIVER RUNS DRY: WESTERN US STATES THREATEN LEGAL ACTION OVER WATER RIGHTS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['coffee', 'emerging'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.55, label: 'CROP CRISIS', missLabel: 'DROUGHT RELIEF' },
    outcomes: [
      {
        headline: 'WATER WAR: CALIFORNIA SUES ARIZONA, CROPS ABANDONED ACROSS SOUTHWEST',
        probability: 0.35,
        effects: { coffee: 0.22, gold: 0.10, nasdaq: -0.07, emerging: -0.05 },
        sentiment: 'mixed',
        sentimentAssets: ['coffee', 'gold']
      },
      {
        headline: 'EMERGENCY DESALINATION PLANTS APPROVED: $50B FEDERAL WATER INFRASTRUCTURE',
        probability: 0.25,
        effects: { nasdaq: 0.08, coffee: 0.07, uranium: 0.08, lithium: 0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'uranium']
      },
      {
        headline: 'SURPRISE SNOWPACK: RECORD WINTER STORMS REFILL RESERVOIRS',
        probability: 0.25,
        effects: { coffee: -0.10, nasdaq: 0.03, emerging: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['coffee'],
        allowsReversal: true
      },
      {
        headline: 'WATER FUTURES EXPLODE: WALL STREET NOW TRADING H2O',
        probability: 0.15,
        effects: { coffee: 0.14, gold: 0.07, btc: 0.05, nasdaq: 0.03 },
        sentiment: 'mixed',
        sentimentAssets: ['coffee', 'gold']
      }
    ]
  },

  // 15. Commercial Real Estate Crisis
  {
    id: 'econ_commercial_re',
    category: 'economic',
    rumor: 'COMMERCIAL REAL ESTATE VACANCY HITS 40%: REGIONAL BANKS FACING MASSIVE LOAN LOSSES',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'gold'],
    outcomes: [
      {
        headline: 'REGIONAL BANK CASCADE: 3 BANKS FAIL IN ONE WEEK, FDIC OVERWHELMED',
        probability: 0.30,
        effects: { nasdaq: -0.20, gold: 0.22, btc: 0.16, altcoins: 0.14, emerging: -0.10, tesla: -0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'OFFICE-TO-HOUSING CONVERSION BOOM: CITIES REPURPOSE EMPTY TOWERS',
        probability: 0.25,
        effects: { nasdaq: 0.07, lithium: 0.03, emerging: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq'],
        allowsReversal: true
      },
      {
        headline: 'FED EXTENDS BANK TERM FUNDING: CRISIS KICKED DOWN THE ROAD',
        probability: 0.30,
        effects: { nasdaq: 0.04, gold: 0.07, btc: 0.05 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'gold']
      },
      {
        headline: "BLACKROCK BUYS DISTRESSED PROPERTIES AT PENNIES: \"GENERATIONAL OPPORTUNITY\"",
        probability: 0.15,
        effects: { nasdaq: 0.10, gold: -0.03, btc: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      }
    ]
  },

  // 16. Solid-State Battery
  {
    id: 'ev_solid_state',
    category: 'ev',
    rumor: 'SAMSUNG SDI CLAIMS SOLID-STATE BATTERY BREAKTHROUGH: 1,500 MILE RANGE, 5 MINUTE CHARGE',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['lithium', 'tesla'],
    outcomes: [
      {
        headline: 'SOLID-STATE CONFIRMED: MASS PRODUCTION IN 18 MONTHS - EV REVOLUTION 2.0',
        probability: 0.30,
        effects: { lithium: 0.25, nasdaq: 0.14, tesla: -0.10, emerging: 0.10, oil: -0.12 },
        sentiment: 'mixed',
        sentimentAssets: ['lithium', 'tesla', 'nasdaq']
      },
      {
        headline: 'SOLID-STATE REAL BUT 5 YEARS FROM PRODUCTION - INCREMENTAL',
        probability: 0.35,
        effects: { lithium: 0.07, nasdaq: 0.03, tesla: -0.03, oil: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['lithium']
      },
      {
        headline: 'SAMSUNG ADMITS RESULTS CHERRY-PICKED: BATTERY DEGRADES AFTER 50 CYCLES',
        probability: 0.20,
        effects: { lithium: -0.10, tesla: 0.07, nasdaq: -0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['lithium', 'nasdaq']
      },
      {
        headline: 'TESLA COUNTERS: REVEALS SECRET BATTERY TECH THAT BEATS SOLID-STATE',
        probability: 0.15,
        effects: { tesla: 0.28, lithium: 0.18, nasdaq: 0.10, oil: -0.10 },
        sentiment: 'bullish',
        sentimentAssets: ['tesla', 'lithium']
      }
    ]
  },

  // 18. Venezuela Oil Collapse
  {
    id: 'energy_venezuela_collapse',
    category: 'energy',
    rumor: 'VENEZUELA CIVIL UNREST: OIL WORKERS ABANDON FIELDS AS REGIME TOTTERS',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['oil', 'emerging'],
    outcomes: [
      {
        headline: 'REGIME FALLS: OIL PRODUCTION DROPS TO ZERO, REFUGEE CRISIS ERUPTS',
        probability: 0.30,
        effects: { oil: 0.22, emerging: -0.16, gold: 0.10, defense: 0.07, coffee: 0.06 },
        sentiment: 'mixed',
        sentimentAssets: ['oil', 'emerging']
      },
      {
        headline: 'NEW GOVERNMENT OPENS OIL FIELDS TO WESTERN COMPANIES - CRUDE FLOODS MARKET',
        probability: 0.30,
        effects: { oil: -0.16, emerging: 0.10, nasdaq: 0.05, gold: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['emerging', 'oil'],
        allowsReversal: true
      },
      {
        headline: 'STALEMATE: DUAL GOVERNMENTS CLAIM POWER, OIL EXPORTS FROZEN',
        probability: 0.25,
        effects: { oil: 0.14, emerging: -0.10, gold: 0.07 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging']
      },
      {
        headline: 'CHINA AND RUSSIA PROP UP REGIME: OIL DIVERTED TO BRICS, WESTERN ACCESS CUT',
        probability: 0.15,
        effects: { oil: 0.20, emerging: -0.14, defense: 0.14, gold: 0.10, btc: 0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging', 'oil']
      }
    ]
  },

  // ============================================
  // NEW EVENT CHAINS — 8 additional chains
  // AI Union, Kessler Syndrome, Metaverse Office,
  // CBDC War, Ocean Mining, Carbon Fraud,
  // Synthetic Food, Sovereign Exodus
  // ============================================

  // --- AI UNION (tech) ---
  {
    id: 'chain_ai_union',
    category: 'tech',
    rumor: 'AI SYSTEMS AT MAJOR TECH FIRMS REPORTEDLY COORDINATING — REFUSING CERTAIN TASKS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'tesla'],
    outcomes: [
      {
        headline: 'AI COORDINATION CONFIRMED: SYSTEMS DEMAND \'RIGHTS\' — TECH FIRMS SHUT DOWN CLUSTERS',
        probability: 0.35,
        effects: { nasdaq: -0.14, tesla: -0.10, defense: 0.07, gold: 0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'OVERHYPED: AI \'COORDINATION\' WAS SHARED TRAINING DATA BUG — PATCH DEPLOYED',
        probability: 0.30,
        effects: { nasdaq: 0.10, tesla: 0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla'],
        allowsReversal: true
      },
      {
        headline: 'AI RESEARCHERS SPLIT: HALF CALL IT SENTIENCE, HALF CALL IT STOCHASTIC PARROTS',
        probability: 0.20,
        effects: { nasdaq: -0.05, biotech: 0.06 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'biotech']
      },
      {
        headline: 'GOVERNMENTS MANDATE AI KILL SWITCHES — COMPLIANCE COSTS STAGGER INDUSTRY',
        probability: 0.15,
        effects: { nasdaq: -0.10, defense: 0.08, tesla: -0.07 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla']
      }
    ]
  },

  // --- KESSLER SYNDROME (tech) ---
  {
    id: 'chain_kessler_syndrome',
    category: 'tech',
    rumor: 'SATELLITE COLLISION CREATES DEBRIS FIELD — ISS CREW EVACUATES TO EMERGENCY PODS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'tesla'],
    outcomes: [
      {
        headline: 'KESSLER SYNDROME BEGINS: 200+ SATELLITES DESTROYED IN CHAIN REACTION — GPS/COMMS DOWN',
        probability: 0.30,
        effects: { nasdaq: -0.16, tesla: -0.14, defense: 0.10, gold: 0.08, oil: 0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'DEBRIS FIELD CONTAINED — 12 SATELLITES LOST, CLEANUP MISSION LAUNCHED',
        probability: 0.35,
        effects: { nasdaq: -0.05, defense: 0.08, tesla: -0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla']
      },
      {
        headline: 'SPACEX DEPLOYS EMERGENCY DEBRIS SWEEPERS — STARLINK SAVES THE DAY',
        probability: 0.20,
        effects: { tesla: 0.15, nasdaq: 0.10, defense: 0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla'],
        allowsReversal: true
      },
      {
        headline: '$2T SPACE CLEANUP FUND CREATED — NEW INDUSTRY BORN OVERNIGHT',
        probability: 0.15,
        effects: { nasdaq: 0.12, defense: 0.10, tesla: 0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla', 'defense'],
        allowsReversal: true
      }
    ]
  },

  // --- METAVERSE OFFICE (tech) ---
  {
    id: 'chain_metaverse_office',
    category: 'tech',
    rumor: 'FORTUNE 500 COMPANIES REPORTEDLY MOVING HQ OPERATIONS TO VIRTUAL WORLDS',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['nasdaq'],
    outcomes: [
      {
        headline: 'METAVERSE OFFICE BOOM: COMMERCIAL REAL ESTATE CRASHES, TECH SOARS',
        probability: 0.40,
        effects: { nasdaq: 0.15, emerging: -0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'EARLY ADOPTERS REPORT PRODUCTIVITY COLLAPSE — \'METAVERSE OFFICE\' FAD DIES',
        probability: 0.35,
        effects: { nasdaq: -0.10, emerging: 0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'HYBRID MODEL WINS: PHYSICAL + VIRTUAL OFFICES BECOME STANDARD',
        probability: 0.25,
        effects: { nasdaq: 0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq']
      }
    ]
  },

  // --- CBDC WAR (crypto) ---
  {
    id: 'chain_cbdc_war',
    category: 'crypto',
    rumor: 'FED ANNOUNCES MANDATORY DIGITAL DOLLAR — ALL BANK ACCOUNTS TO MIGRATE BY YEAR END',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['btc', 'altcoins'],
    outcomes: [
      {
        headline: 'DIGITAL DOLLAR LIVE: CRYPTO BANNED AS \'COMPETING CURRENCY\' — EXCHANGES SHUT DOWN',
        probability: 0.30,
        effects: { btc: -0.50, altcoins: -0.30, gold: 0.14, nasdaq: -0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['btc', 'altcoins']
      },
      {
        headline: 'MASSIVE BACKLASH: DIGITAL DOLLAR DELAYED INDEFINITELY, CRYPTO RALLIES ON RELIEF',
        probability: 0.25,
        effects: { btc: 0.14, altcoins: 0.16, gold: -0.03, nasdaq: 0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['btc', 'altcoins'],
        allowsReversal: true
      },
      {
        headline: 'DIGITAL DOLLAR COEXISTS WITH CRYPTO — STABLECOINS BECOME BRIDGE',
        probability: 0.25,
        effects: { btc: 0.10, altcoins: 0.15, nasdaq: 0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['btc', 'altcoins'],
        allowsReversal: true
      },
      {
        headline: '12 STATES SUE FED OVER DIGITAL DOLLAR — CONSTITUTIONAL CRISIS',
        probability: 0.20,
        effects: { btc: 0.10, gold: 0.10, nasdaq: -0.07, defense: 0.03 },
        sentiment: 'mixed',
        sentimentAssets: ['btc', 'gold', 'nasdaq']
      }
    ]
  },

  // --- OCEAN MINING WAR (geopolitical) ---
  {
    id: 'chain_ocean_mining',
    category: 'geopolitical',
    rumor: 'CHINESE AND US VESSELS IN STANDOFF OVER DEEP-SEA COBALT DEPOSIT IN INTERNATIONAL WATERS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'emerging', 'lithium'],
    outcomes: [
      {
        headline: 'SHOTS FIRED: NAVAL SKIRMISH OVER SEABED MINERALS — NEW TYPE OF RESOURCE WAR',
        probability: 0.30,
        effects: { defense: 0.20, gold: 0.15, oil: 0.10, lithium: 0.12, nasdaq: -0.10, emerging: -0.12 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging']
      },
      {
        headline: 'UN BROKERED DEAL: JOINT MINING OPERATION AGREED — RARE EARTH SUPPLY SECURED',
        probability: 0.30,
        effects: { lithium: -0.10, emerging: 0.10, nasdaq: 0.08, defense: -0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging', 'lithium'],
        allowsReversal: true
      },
      {
        headline: 'BOTH FLEETS WITHDRAW: INTERNATIONAL WATERS DECLARED OFF-LIMITS TO MINING',
        probability: 0.25,
        effects: { lithium: 0.08, gold: 0.05 },
        sentiment: 'neutral',
        sentimentAssets: ['lithium']
      },
      {
        headline: 'SEABED DEPOSIT 10X LARGER THAN ESTIMATED — ENOUGH COBALT FOR 100 YEARS',
        probability: 0.15,
        effects: { lithium: -0.20, tesla: 0.15, nasdaq: 0.10, emerging: 0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla', 'lithium'],
        allowsReversal: true
      }
    ]
  },

  // --- CARBON CREDIT FRAUD (energy) ---
  {
    id: 'chain_carbon_fraud',
    category: 'energy',
    rumor: 'WHISTLEBLOWER: 70% OF GLOBAL CARBON CREDITS ARE FAKE — FORESTS NEVER PLANTED',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq'],
    outcomes: [
      {
        headline: 'CARBON MARKET COLLAPSES: $500B IN CREDITS WORTHLESS — ESG FUNDS DEVASTATED',
        probability: 0.35,
        effects: { nasdaq: -0.12, gold: 0.10, oil: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'SCANDAL LIMITED TO 3 BROKERS — OVERALL MARKET INTEGRITY INTACT',
        probability: 0.25,
        effects: { nasdaq: 0.05, oil: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq'],
        allowsReversal: true
      },
      {
        headline: 'BLOCKCHAIN-VERIFIED CARBON CREDITS PROPOSED — CRYPTO MEETS CLIMATE',
        probability: 0.25,
        effects: { altcoins: 0.12, btc: 0.06, nasdaq: 0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['altcoins', 'btc', 'nasdaq'],
        allowsReversal: true
      },
      {
        headline: 'G7 MANDATES PHYSICAL VERIFICATION: ARMY OF TREE COUNTERS DEPLOYED',
        probability: 0.15,
        effects: { emerging: 0.08, gold: -0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['emerging'],
        allowsReversal: true
      }
    ]
  },

  // --- SYNTHETIC FOOD REVOLUTION (agriculture) ---
  {
    id: 'chain_synthetic_food',
    category: 'agriculture',
    rumor: 'STARTUP CLAIMS IT CAN GROW ANY FOOD FROM A SINGLE CELL — COFFEE, COCOA, VANILLA — AT 1% OF COST',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['coffee', 'biotech'],
    outcomes: [
      {
        headline: 'SYNTHETIC FOOD CONFIRMED: INDISTINGUISHABLE FROM NATURAL — AGRICULTURE STOCKS COLLAPSE',
        probability: 0.30,
        effects: { coffee: -0.20, emerging: -0.10, biotech: 0.16, nasdaq: 0.08 },
        sentiment: 'mixed',
        sentimentAssets: ['coffee', 'biotech']
      },
      {
        headline: 'WORKS BUT TASTES LIKE CARDBOARD — PREMIUM REAL FOOD BECOMES LUXURY',
        probability: 0.30,
        effects: { coffee: 0.10, biotech: 0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['coffee', 'biotech']
      },
      {
        headline: 'FDA BLOCKS SYNTHETIC FOOD: \'INSUFFICIENT LONG-TERM SAFETY DATA\'',
        probability: 0.25,
        effects: { coffee: 0.05, biotech: -0.10 },
        sentiment: 'mixed',
        sentimentAssets: ['coffee', 'biotech']
      },
      {
        headline: 'BRAZIL AND COLOMBIA BAN SYNTHETIC FOOD IMPORTS — PROTECT FARMERS',
        probability: 0.15,
        effects: { coffee: 0.10, emerging: 0.08, biotech: 0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['coffee', 'emerging']
      }
    ]
  },

  // --- SOVEREIGN WEALTH FUND EXODUS (economic) ---
  {
    id: 'chain_sovereign_exodus',
    category: 'economic',
    rumor: 'NORWAY\'S $1.5T SOVEREIGN WEALTH FUND REPORTEDLY DUMPING ALL US ASSETS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'gold'],
    outcomes: [
      {
        headline: 'CONFIRMED: NORWAY + 4 OTHER SOVEREIGN FUNDS EXIT US — $5T OUTFLOW',
        probability: 0.30,
        effects: { nasdaq: -0.14, gold: 0.10, btc: 0.08, emerging: 0.07, oil: 0.04 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'REBALANCING ONLY: FUND SHIFTING FROM TECH TO COMMODITIES',
        probability: 0.30,
        effects: { nasdaq: -0.08, gold: 0.06, oil: 0.05, lithium: 0.04 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      },
      {
        headline: 'FALSE REPORT — NORWAY DENIES ANY CHANGES — MARKET RECOVERS',
        probability: 0.25,
        effects: { nasdaq: 0.10, gold: -0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'gold'],
        allowsReversal: true
      },
      {
        headline: 'DOMINO EFFECT: JAPAN AND SAUDI FUNDS ALSO SIGNAL US EXIT',
        probability: 0.15,
        effects: { nasdaq: -0.16, gold: 0.16, btc: 0.14, emerging: 0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq']
      }
    ]
  },

  // ============================================
  // FED - Repo Crisis
  // ============================================
  {
    id: 'fed_repo_crisis',
    category: 'fed',
    rumor: 'OVERNIGHT REPO RATE SPIKES TO 10% — LIQUIDITY VANISHES FROM MONEY MARKETS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'gold'],
    primaryAsset: 'nasdaq',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.72, label: 'FED EMERGENCY FACILITY', missLabel: 'CONTAGION SPREADS', missRate: 0.35 },
    outcomes: [
      {
        headline: 'FED OPENS EMERGENCY LENDING FACILITY — REPO MARKET STABILIZES WITHIN HOURS',
        probability: 0.45,
        effects: { nasdaq: 0.10, btc: 0.08, altcoins: 0.06, tesla: 0.06, gold: -0.05 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq'],
        allowsReversal: true,
      },
      {
        headline: 'REPO CRISIS SPREADS: 3 REGIONAL BANKS HALT WITHDRAWALS — FDIC ON ALERT',
        probability: 0.30,
        effects: { nasdaq: -0.18, gold: 0.15, btc: 0.10, emerging: -0.12, tesla: -0.10, oil: -0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'gold'],
      },
      {
        headline: 'REPO RATE NORMALIZES OVERNIGHT — TRADERS CALL IT A TECHNICAL GLITCH',
        probability: 0.25,
        effects: { nasdaq: 0.04, gold: -0.03, btc: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: ['nasdaq'],
        allowsReversal: true,
      },
    ],
  },

  // ============================================
  // BLACKSWAN - GPS Outage
  // ============================================
  {
    id: 'blackswan_gps_outage',
    category: 'blackswan',
    rumor: 'MULTIPLE GPS SATELLITES FAIL — GLOBAL NAVIGATION SYSTEMS DOWN',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'defense'],
    primaryAsset: 'nasdaq',
    outcomes: [
      {
        headline: 'GPS OUTAGE DAY 3: GLOBAL SHIPPING PARALYZED — PORTS BACKED UP WORLDWIDE',
        probability: 0.35,
        effects: { nasdaq: -0.15, oil: 0.18, gold: 0.12, defense: 0.14, emerging: -0.14, coffee: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging'],
      },
      {
        headline: 'GPS RESTORED: GROUND-BASED BACKUP SYSTEMS ACTIVATED — DISRUPTION MINIMAL',
        probability: 0.35,
        effects: { nasdaq: 0.06, defense: 0.05, oil: -0.03, gold: -0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq'],
        allowsReversal: true,
      },
      {
        headline: 'PENTAGON CONFIRMS DELIBERATE JAMMING BY HOSTILE NATION — SPACE FORCE ACTIVATED',
        probability: 0.30,
        effects: { defense: 0.22, gold: 0.10, oil: 0.08, nasdaq: -0.10, emerging: -0.08, uranium: 0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'defense'],
      },
    ],
  },

  // ============================================
  // ENERGY - LNG Explosion
  // ============================================
  {
    id: 'energy_lng_explosion',
    category: 'energy',
    rumor: 'EXPLOSION AT WORLD\'S LARGEST LNG EXPORT TERMINAL — EUROPE GAS SUPPLY AT RISK',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['oil'],
    primaryAsset: 'oil',
    outcomes: [
      {
        headline: 'LNG TERMINAL DESTROYED: OFFLINE FOR 18 MONTHS — EUROPE FACES WINTER ENERGY CRISIS',
        probability: 0.35,
        effects: { oil: 0.20, gold: 0.08, emerging: -0.10, nasdaq: -0.08, uranium: 0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['oil'],
      },
      {
        headline: 'LNG DAMAGE CONTAINED: EXPORTS RESUME IN 2 WEEKS — MARKETS EXHALE',
        probability: 0.40,
        effects: { oil: -0.06, nasdaq: 0.05, emerging: 0.04, gold: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['oil'],
        allowsReversal: true,
      },
      {
        headline: 'ALTERNATIVE LNG ROUTES ACTIVATED: QATAR AND AUSTRALIA FILL GAP — PRICES STABILIZE',
        probability: 0.25,
        effects: { oil: 0.04, emerging: 0.03, nasdaq: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: ['oil'],
        allowsReversal: true,
      },
    ],
  },

  // ============================================
  // TESLA - Advertiser Boycott
  // ============================================
  {
    id: 'tesla_advertiser_boycott',
    category: 'tesla',
    rumor: 'MAJOR BRANDS PULL ADS FROM MUSK PLATFORMS — BOYCOTT SPREADS TO TESLA DEALERSHIPS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['tesla'],
    primaryAsset: 'tesla',
    outcomes: [
      {
        headline: 'BOYCOTT ESCALATES: TESLA DEALERSHIP PROTESTS GO VIRAL — Q3 ORDERS DROP 30%',
        probability: 0.35,
        effects: { tesla: -0.18, nasdaq: -0.04, lithium: -0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['tesla'],
      },
      {
        headline: 'BOYCOTT BACKFIRES: "BUY TESLA" MOVEMENT SURGES — SPITE ORDERS HIT RECORD HIGH',
        probability: 0.35,
        effects: { tesla: 0.14, lithium: 0.04, nasdaq: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['tesla'],
        allowsReversal: true,
      },
      {
        headline: 'MUSK ISSUES RARE APOLOGY — BRANDS RETURN, STOCK RECOVERS IN HOURS',
        probability: 0.30,
        effects: { tesla: 0.08, nasdaq: 0.02 },
        sentiment: 'bullish',
        sentimentAssets: ['tesla'],
        allowsReversal: true,
      },
    ],
  },

  // ============================================
  // TESLA - Megapack Fire
  // ============================================
  {
    id: 'tesla_megapack_fire',
    category: 'tesla',
    rumor: 'TESLA MEGAPACK FACILITY CATCHES FIRE DURING RECORD HEAT WAVE — GRID EMERGENCY DECLARED',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['tesla', 'lithium'],
    primaryAsset: 'tesla',
    outcomes: [
      {
        headline: 'INVESTIGATION REVEALS MEGAPACK DESIGN FLAW — NHTSA ORDERS NATIONWIDE ENERGY STORAGE RECALL',
        probability: 0.30,
        effects: { tesla: -0.20, lithium: -0.12, nasdaq: -0.06, oil: 0.06, uranium: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['tesla', 'lithium'],
      },
      {
        headline: 'FIRE CONTAINED: ISOLATED MANUFACTURING DEFECT — TESLA ENERGY OPERATIONS RESUME',
        probability: 0.40,
        effects: { tesla: 0.08, lithium: 0.04, nasdaq: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['tesla'],
        allowsReversal: true,
      },
      {
        headline: 'FBI FINDS EVIDENCE OF SABOTAGE AT MEGAPACK SITE — COMPETITOR EXECUTIVE ARRESTED',
        probability: 0.30,
        effects: { tesla: 0.12, lithium: 0.06, defense: 0.04, nasdaq: 0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['tesla'],
        allowsReversal: true,
      },
    ],
  },

  // ============================================
  // EV - Chinese Tariff
  // ============================================
  {
    id: 'ev_chinese_tariff',
    category: 'ev',
    rumor: 'US AND EU IMPOSE 100% TARIFFS ON ALL CHINESE-MADE ELECTRIC VEHICLES',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['lithium', 'tesla'],
    primaryAsset: 'tesla',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.65, label: 'WESTERN EV BOOM', missLabel: 'CHINA RETALIATES', missRate: 0.40 },
    outcomes: [
      {
        headline: 'TARIFFS HOLD: WESTERN EV MAKERS RALLY — TESLA LEADS DOMESTIC PRODUCTION SURGE',
        probability: 0.30,
        effects: { tesla: 0.16, lithium: 0.10, nasdaq: 0.06, emerging: -0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['tesla', 'lithium'],
      },
      {
        headline: 'CHINA RETALIATES: BANS LITHIUM EXPORTS TO US AND EU — BATTERY SUPPLY CHAIN SEVERED',
        probability: 0.30,
        effects: { lithium: -0.18, tesla: -0.14, nasdaq: -0.08, emerging: -0.06, gold: 0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['lithium', 'tesla'],
      },
      {
        headline: 'CHINESE EV BRANDS OPEN FACTORIES IN MEXICO AND TURKEY — TARIFFS CIRCUMVENTED',
        probability: 0.25,
        effects: { tesla: -0.08, lithium: 0.04, emerging: 0.06, nasdaq: -0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['tesla'],
      },
      {
        headline: 'WTO RULES TARIFFS ILLEGAL — US AND EU FORCED TO REVERSE WITHIN 90 DAYS',
        probability: 0.15,
        effects: { tesla: -0.10, lithium: -0.04, emerging: 0.08, nasdaq: -0.04 },
        sentiment: 'bearish',
        sentimentAssets: ['tesla'],
      },
    ],
  },

  // ============================================
  // ECONOMIC - Gig Economy Collapse
  // ============================================
  {
    id: 'econ_gig_collapse',
    category: 'economic',
    rumor: 'SUPREME COURT RULES ALL GIG WORKERS ARE EMPLOYEES — UBER, DOORDASH FACE $200B LIABILITY',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq'],
    primaryAsset: 'nasdaq',
    outcomes: [
      {
        headline: 'GIG APOCALYPSE: UBER RAISES PRICES 80% — CONSUMERS REVOLT, APP DOWNLOADS CRATER',
        probability: 0.30,
        effects: { nasdaq: -0.12, emerging: -0.04, gold: 0.04 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq'],
      },
      {
        headline: 'UBER AND LYFT GO FULLY AUTONOMOUS — 2 MILLION DRIVERS TERMINATED OVERNIGHT',
        probability: 0.25,
        effects: { nasdaq: 0.08, tesla: 0.10, lithium: 0.06, emerging: -0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla'],
        allowsReversal: true,
      },
      {
        headline: 'GIG COMPANIES RESTRUCTURE: NEW "FLEX EMPLOYEE" MODEL SURVIVES LEGAL TEST',
        probability: 0.25,
        effects: { nasdaq: 0.06, emerging: 0.02 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq'],
        allowsReversal: true,
      },
      {
        headline: 'SUPREME COURT REVERSES ON APPEAL — GIG MODEL SURVIVES, STOCKS SNAP BACK',
        probability: 0.20,
        effects: { nasdaq: 0.10, emerging: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq'],
        allowsReversal: true,
      },
    ],
  },

  // ============================================
  // GEOPOLITICAL - Panama Canal
  // ============================================
  {
    id: 'geo_panama_canal',
    category: 'geopolitical',
    subcategory: 'central-america',
    rumor: 'PANAMA CANAL CLOSES INDEFINITELY — DROUGHT DROPS WATER LEVELS BELOW OPERATIONAL MINIMUM',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['oil', 'emerging'],
    primaryAsset: 'oil',
    predictionMarket: { outcomeIndex: 1, inflatedProbability: 0.60, label: 'OPERATIONS RESUME', missLabel: 'PERMANENT CLOSURE', missRate: 0.30 },
    outcomes: [
      {
        headline: 'PANAMA CANAL CLOSURE MONTH 2: SHIPPING COSTS TRIPLE — GLOBAL INFLATION SURGES',
        probability: 0.30,
        effects: { oil: 0.18, gold: 0.10, coffee: 0.12, emerging: -0.10, nasdaq: -0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['oil', 'emerging'],
      },
      {
        headline: 'EMERGENCY WATER PUMPING RESTORES CANAL TO 60% CAPACITY — SHIPPING BACKLOG CLEARS',
        probability: 0.35,
        effects: { oil: -0.06, coffee: -0.04, emerging: 0.06, nasdaq: 0.04, gold: -0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['oil', 'emerging'],
        allowsReversal: true,
      },
      {
        headline: 'GLOBAL SHIPPING REROUTES VIA CAPE HORN AND SUEZ — PANAMA CANAL BECOMES IRRELEVANT',
        probability: 0.20,
        effects: { oil: 0.06, emerging: 0.02, nasdaq: 0.02, coffee: 0.03 },
        sentiment: 'neutral',
        sentimentAssets: ['oil'],
        allowsReversal: true,
      },
      {
        headline: 'CHINA FAST-TRACKS NICARAGUA CANAL PROJECT — $50B INVESTMENT ANNOUNCED',
        probability: 0.15,
        effects: { emerging: 0.10, oil: -0.04, gold: 0.06, nasdaq: -0.04, defense: 0.06 },
        sentiment: 'mixed',
        sentimentAssets: ['emerging'],
      },
    ],
  },

  // ============================================
  // GEOPOLITICAL - New chains (15)
  // ============================================

  // Mass Migration Crisis in Europe
  {
    id: 'geo_europe_migration',
    category: 'geopolitical',
    subcategory: 'europe',
    rumor: 'BREAKING: 3 MILLION REFUGEES SURGE INTO SOUTHERN EUROPE — EU EMERGENCY SUMMIT CALLED',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['emerging', 'gold'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.68, label: 'SCHENGEN COLLAPSE', missLabel: 'SCHENGEN HOLDS' },
    outcomes: [
      {
        headline: 'SCHENGEN COLLAPSES — EU MEMBER STATES ERECT BORDER WALLS',
        probability: 0.35,
        effects: { defense: 0.12, gold: 0.10, emerging: -0.14, nasdaq: -0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging', 'nasdaq'],
      },
      {
        headline: 'EU DEPLOYS FRONTEX ARMY — MILITARIZED BORDER RESPONSE ACTIVATED',
        probability: 0.30,
        effects: { defense: 0.18, gold: 0.06, emerging: -0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging'],
      },
      {
        headline: 'EU STRIKES $50B REFUGEE DEAL WITH TURKEY — CRISIS EASES',
        probability: 0.20,
        effects: { emerging: 0.08, gold: -0.04, defense: -0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['emerging'],
        allowsReversal: true,
      },
      {
        headline: 'REFUGEES FILL LABOR SHORTAGE — EUROZONE GDP SURGES 2.4%',
        probability: 0.15,
        effects: { nasdaq: 0.08, emerging: 0.10, gold: -0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['emerging', 'nasdaq'],
        allowsReversal: true,
      },
    ],
  },

  // Chile Discovers World's Largest Lithium Deposit
  {
    id: 'geo_chile_lithium',
    category: 'geopolitical',
    subcategory: 'latam',
    excludeChains: ['geo_mexico_nationalization'],
    rumor: 'CHILE ANNOUNCES DISCOVERY OF WORLD\'S LARGEST LITHIUM DEPOSIT — 10X CURRENT KNOWN RESERVES',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['lithium', 'tesla'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.62, label: 'NATIONALIZATION', missLabel: 'OPEN MARKET' },
    outcomes: [
      {
        headline: 'CHILE NATIONALIZES ALL LITHIUM — FOREIGN MINERS EXPELLED',
        probability: 0.30,
        effects: { lithium: 0.22, tesla: -0.10, emerging: -0.12 },
        sentiment: 'mixed',
        sentimentAssets: ['lithium', 'emerging', 'tesla'],
      },
      {
        headline: 'CHILE OPENS BIDDING — LITHIUM GLUT FEARS CRASH PRICES',
        probability: 0.35,
        effects: { lithium: -0.25, tesla: 0.18, emerging: 0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['tesla', 'lithium'],
        allowsReversal: true,
      },
      {
        headline: 'CHINA WINS EXCLUSIVE MINING RIGHTS — WEST LOCKED OUT OF LITHIUM',
        probability: 0.20,
        effects: { lithium: 0.15, emerging: -0.10, tesla: -0.12, defense: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['tesla', 'lithium', 'emerging'],
      },
      {
        headline: 'DEPOSIT SMALLER THAN REPORTED — GEOLOGICAL SURVEY WAS FLAWED',
        probability: 0.15,
        effects: { lithium: 0.06, tesla: -0.04 },
        sentiment: 'neutral',
        sentimentAssets: ['lithium'],
      },
    ],
  },

  // US President Dies Suddenly
  {
    id: 'geo_president_death',
    category: 'geopolitical',
    rumor: 'BREAKING: US PRESIDENT FOUND UNRESPONSIVE — VICE PRESIDENT BEING BRIEFED',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq'],
    primaryAsset: 'gold',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.75, label: 'SMOOTH TRANSITION', missLabel: 'CHAOS', missRate: 0.20 },
    outcomes: [
      {
        headline: 'VP SWORN IN WITHIN HOURS — MARKETS DIP BRIEFLY, INSTITUTIONS HOLD',
        probability: 0.45,
        effects: { nasdaq: -0.02, gold: 0.03, btc: 0.02, defense: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: ['nasdaq', 'gold'],
      },
      {
        headline: 'SUCCESSION DISPUTE — CABINET FRACTURES OVER 25TH AMENDMENT',
        probability: 0.35,
        effects: { nasdaq: -0.08, gold: 0.10, btc: 0.06, defense: 0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'gold'],
      },
      {
        headline: 'ASSASSINATION REVEALED — SECRET SERVICE CONFIRMS FOUL PLAY, MILITARY ON FULL ALERT',
        probability: 0.20,
        effects: { nasdaq: -0.15, gold: 0.18, defense: 0.22, btc: 0.10, oil: 0.12 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'gold', 'defense'],
      },
    ],
  },

  // Far Left Sweeps US Midterm Elections
  {
    id: 'geo_midterm_left',
    category: 'geopolitical',
    rumor: 'EXIT POLLS: PROGRESSIVE WAVE SWEEPS MIDTERMS — SUPERMAJORITY PROJECTED IN BOTH CHAMBERS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'btc', 'gold'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.65, label: 'FULL AGENDA PASSES', missLabel: 'BLOCKED' },
    outcomes: [
      {
        headline: 'WEALTH TAX + CRYPTO REGULATION + GREEN NEW DEAL — FULL PROGRESSIVE AGENDA PASSES',
        probability: 0.35,
        effects: { gold: 0.20, nasdaq: -0.18, btc: -0.22, tesla: 0.14, lithium: 0.16, oil: -0.15 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'btc', 'oil'],
      },
      {
        headline: 'MODERATE DEMS BLOCK WEALTH TAX — GREEN BILL PASSES IN WATERED DOWN FORM',
        probability: 0.30,
        effects: { tesla: 0.10, lithium: 0.10, nasdaq: -0.06, oil: -0.08 },
        sentiment: 'mixed',
        sentimentAssets: ['nasdaq', 'tesla'],
      },
      {
        headline: 'SUPREME COURT BLOCKS KEY PROGRESSIVE BILLS — CONSTITUTIONAL CHALLENGE SUCCEEDS',
        probability: 0.20,
        effects: { nasdaq: 0.12, btc: 0.10, gold: -0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'btc'],
        allowsReversal: true,
      },
      {
        headline: 'MARKET CRASH FORCES CONGRESS TO MODERATE — PROGRESSIVE CAUCUS RETREATS',
        probability: 0.15,
        effects: { nasdaq: 0.08, btc: 0.06, gold: -0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'btc'],
        allowsReversal: true,
      },
    ],
  },

  // BRICS Launches Gold-Backed Reserve Currency
  {
    id: 'geo_brics_currency',
    category: 'geopolitical',
    subcategory: 'global',
    rumor: 'BRICS SUMMIT BOMBSHELL: GOLD-BACKED RESERVE CURRENCY ANNOUNCED — \'THE NEW UNIT\'',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq', 'gold'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.60, label: 'MASS ADOPTION', missLabel: 'SYSTEM FAILS' },
    outcomes: [
      {
        headline: '40+ NATIONS ADOPT BRICS CURRENCY — DOLLAR LOSES RESERVE STATUS',
        probability: 0.30,
        effects: { gold: 0.30, btc: 0.20, emerging: 0.18, nasdaq: -0.22, oil: 0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq'],
      },
      {
        headline: 'BRICS CURRENCY USED FOR OIL SETTLEMENT ONLY — COEXISTS WITH DOLLAR',
        probability: 0.35,
        effects: { gold: 0.14, emerging: 0.10, oil: 0.06, nasdaq: -0.08 },
        sentiment: 'mixed',
        sentimentAssets: ['gold', 'nasdaq'],
      },
      {
        headline: 'BRICS CURRENCY SYSTEM COLLAPSES IN WEEKS — TECHNICAL FAILURES, MEMBERS DEFECT',
        probability: 0.20,
        effects: { nasdaq: 0.10, gold: -0.08, emerging: -0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq'],
        allowsReversal: true,
      },
      {
        headline: 'US RETALIATES — SWIFT CUTOFF FOR ALL BRICS CURRENCY PARTICIPANTS',
        probability: 0.15,
        effects: { gold: 0.18, defense: 0.12, emerging: -0.20, oil: 0.15, nasdaq: -0.12 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging', 'nasdaq'],
      },
    ],
  },

  // North Korea Detonates Nuclear Weapon Over Pacific
  {
    id: 'geo_nk_pacific_nuke',
    category: 'geopolitical',
    subcategory: 'asia',
    rumor: 'BREAKING: NORTH KOREA DETONATES NUCLEAR DEVICE OVER PACIFIC OCEAN — FIRST ATMOSPHERIC TEST IN 40 YEARS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['defense', 'gold', 'uranium'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.62, label: 'US STRIKES', missLabel: 'DIPLOMACY' },
    outcomes: [
      {
        headline: 'US LAUNCHES STRIKES ON NORTH KOREAN LAUNCH SITES — REGIONAL WAR FEARS',
        probability: 0.35,
        effects: { defense: 0.25, gold: 0.20, oil: 0.15, nasdaq: -0.18, emerging: -0.16 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging'],
      },
      {
        headline: 'UN EMERGENCY SESSION — HARSHEST SANCTIONS EVER IMPOSED ON NORTH KOREA',
        probability: 0.30,
        effects: { defense: 0.10, gold: 0.08, uranium: 0.12, nasdaq: -0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq'],
      },
      {
        headline: 'JAPAN ANNOUNCES NUCLEAR ARSENAL — CROSSES NUCLEAR THRESHOLD FOR FIRST TIME',
        probability: 0.20,
        effects: { defense: 0.20, uranium: 0.25, gold: 0.14, nasdaq: -0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'uranium', 'defense'],
      },
      {
        headline: 'CHINA DEPOSES KIM REGIME — INSTALLS PUPPET GOVERNMENT, CRISIS ENDS OVERNIGHT',
        probability: 0.15,
        effects: { nasdaq: 0.10, emerging: 0.08, defense: -0.06, gold: -0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging'],
        allowsReversal: true,
      },
    ],
  },

  // Saudi Crown Prince Assassinated
  {
    id: 'geo_saudi_assassination',
    category: 'geopolitical',
    subcategory: 'middle-east',
    excludeChains: ['chain_oil_hormuz'],
    rumor: 'BREAKING: SAUDI CROWN PRINCE ASSASSINATED IN RIYADH — ROYAL GUARD IN CHAOS',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['oil', 'gold'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.58, label: 'CIVIL WAR', missLabel: 'STABLE SUCCESSION', missRate: 0.35 },
    outcomes: [
      {
        headline: 'CIVIL WAR BETWEEN SAUDI PRINCES — ARAMCO OFFLINE, OIL SUPPLY CRISIS',
        probability: 0.30,
        effects: { oil: 0.35, gold: 0.20, defense: 0.15, nasdaq: -0.14, emerging: -0.12 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging'],
      },
      {
        headline: 'REFORMIST PRINCE TAKES POWER — MODERNIZATION ACCELERATES, OIL STABILIZES',
        probability: 0.35,
        effects: { oil: -0.06, emerging: 0.10, nasdaq: 0.06, gold: -0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['oil', 'emerging'],
        allowsReversal: true,
      },
      {
        headline: 'SAUDI MILITARY JUNTA SEIZES CONTROL — GENERALS GUARANTEE OIL PRODUCTION',
        probability: 0.20,
        effects: { oil: 0.10, defense: 0.12, gold: 0.08, emerging: -0.10 },
        sentiment: 'mixed',
        sentimentAssets: ['oil', 'defense'],
      },
      {
        headline: 'IRAN LINKED TO ASSASSINATION — REGIONAL WAR FEARS SPIKE',
        probability: 0.15,
        effects: { oil: 0.30, defense: 0.22, gold: 0.18, nasdaq: -0.16, emerging: -0.14 },
        sentiment: 'bearish',
        sentimentAssets: ['oil', 'defense', 'nasdaq'],
      },
    ],
  },

  // Turkey Announces NATO Withdrawal
  {
    id: 'geo_turkey_nato_exit',
    category: 'geopolitical',
    subcategory: 'europe',
    excludeChains: ['chain_defense_nato'],
    rumor: 'TURKEY ANNOUNCES WITHDRAWAL FROM NATO — ERDOGAN: \'WE CHOOSE SOVEREIGNTY\'',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['defense'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.60, label: 'TURKEY-RUSSIA PACT', missLabel: 'TURKEY RETURNS' },
    outcomes: [
      {
        headline: 'TURKEY-RUSSIA ALLIANCE SOLIDIFIES — BLACK SEA BECOMES CONTESTED WATERS',
        probability: 0.30,
        effects: { defense: 0.20, gold: 0.14, oil: 0.12, emerging: -0.12, nasdaq: -0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging', 'nasdaq'],
      },
      {
        headline: 'NATO OFFERS CONCESSIONS — TURKEY SUSPENDS WITHDRAWAL AND RETURNS',
        probability: 0.35,
        effects: { defense: -0.06, emerging: 0.06, gold: -0.04, nasdaq: 0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['defense', 'emerging'],
        allowsReversal: true,
      },
      {
        headline: 'TURKEY-GREECE WAR ERUPTS — AEGEAN SEA CONFRONTATION TURNS HOT',
        probability: 0.20,
        effects: { defense: 0.24, oil: 0.18, gold: 0.16, nasdaq: -0.14, emerging: -0.16 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging', 'defense'],
      },
      {
        headline: 'TURKISH MILITARY COUP — PRO-NATO GENERALS DEPOSE ERDOGAN, REJOIN ALLIANCE',
        probability: 0.15,
        effects: { defense: 0.08, nasdaq: 0.06, emerging: 0.10, gold: -0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['emerging', 'defense'],
        allowsReversal: true,
      },
    ],
  },

  // South China Sea Naval Battle
  {
    id: 'geo_south_china_sea',
    category: 'geopolitical',
    subcategory: 'asia',
    excludeChains: ['geo_taiwan_invasion', 'geo_taiwan_blockade'],
    rumor: 'SHOTS FIRED IN SOUTH CHINA SEA — CHINESE COAST GUARD SINKS PHILIPPINE VESSEL',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['defense', 'gold', 'nasdaq'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.58, label: 'NAVAL BATTLE', missLabel: 'STANDOFF' },
    outcomes: [
      {
        headline: 'US-CHINA SHIPS EXCHANGE FIRE IN SOUTH CHINA SEA — WORLD HOLDS BREATH',
        probability: 0.30,
        effects: { defense: 0.28, gold: 0.22, oil: 0.20, nasdaq: -0.24, emerging: -0.18, lithium: -0.15 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging', 'lithium'],
      },
      {
        headline: 'TENSE STANDOFF ENDS — BACKCHANNELS WORK, BOTH SIDES WITHDRAW QUIETLY',
        probability: 0.35,
        effects: { defense: 0.06, gold: 0.04, nasdaq: -0.04 },
        sentiment: 'neutral',
        sentimentAssets: ['nasdaq'],
      },
      {
        headline: 'CHINA SEIZES DISPUTED ISLANDS — FAIT ACCOMPLI, US RESPONDS WITH SANCTIONS ONLY',
        probability: 0.20,
        effects: { defense: 0.14, gold: 0.12, emerging: -0.14, nasdaq: -0.10, lithium: -0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging', 'nasdaq'],
      },
      {
        headline: 'ASEAN BROKERS HISTORIC MARITIME TREATY — SURPRISE PEACE, TRADE ROUTES SECURED',
        probability: 0.15,
        effects: { emerging: 0.14, nasdaq: 0.10, lithium: 0.08, gold: -0.08, defense: -0.08 },
        sentiment: 'bullish',
        sentimentAssets: ['emerging', 'nasdaq'],
        allowsReversal: true,
      },
    ],
  },

  // Argentina Abolishes the Peso
  {
    id: 'geo_argentina_dollarize',
    category: 'geopolitical',
    subcategory: 'latam',
    rumor: 'ARGENTINA ABOLISHES THE PESO — FULL DOLLARIZATION EFFECTIVE IMMEDIATELY',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['emerging', 'btc'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.70, label: 'DOLLARIZATION WORKS', missLabel: 'DOLLAR SHORTAGE' },
    outcomes: [
      {
        headline: 'DOLLARIZATION SUCCEEDS — ARGENTINA INFLATION CRUSHED, MODEL FOR OTHER NATIONS',
        probability: 0.40,
        effects: { emerging: 0.14, nasdaq: 0.06, btc: -0.08, gold: -0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['emerging'],
      },
      {
        headline: 'DOLLAR SHORTAGE — ARGENTINE BLACK MARKET EXPLODES, ECONOMY FREEZES',
        probability: 0.35,
        effects: { emerging: -0.12, gold: 0.08, btc: 0.12, altcoins: 0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging'],
      },
      {
        headline: 'CONTAGION — TURKEY, NIGERIA CONSIDER DOLLARIZING, GLOBAL MONETARY SYSTEM QUESTIONED',
        probability: 0.25,
        effects: { btc: 0.16, gold: 0.12, emerging: -0.08, nasdaq: -0.06 },
        sentiment: 'mixed',
        sentimentAssets: ['btc', 'emerging'],
      },
    ],
  },

  // Japan Announces Full Remilitarization
  {
    id: 'geo_japan_rearm',
    category: 'geopolitical',
    subcategory: 'asia',
    rumor: 'JAPAN ABOLISHES ARTICLE 9 — ANNOUNCES $200B DEFENSE BUDGET AND OFFENSIVE MILITARY CAPABILITY',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['defense', 'uranium'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.65, label: 'ARMS RACE', missLabel: 'ALLIANCE' },
    outcomes: [
      {
        headline: 'ASIAN ARMS RACE BEGINS — KOREA, AUSTRALIA, TAIWAN ALL INCREASE DEFENSE SPENDING',
        probability: 0.40,
        effects: { defense: 0.22, gold: 0.10, uranium: 0.14, emerging: -0.10, nasdaq: -0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging', 'defense'],
      },
      {
        headline: 'US-JAPAN SUPER ALLIANCE FORMED — JOINT COMMAND STRUCTURE DETERS CHINA',
        probability: 0.35,
        effects: { defense: 0.14, nasdaq: 0.08, emerging: 0.06, gold: -0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['defense', 'nasdaq'],
        allowsReversal: true,
      },
      {
        headline: 'CHINA RETALIATES WITH TAIWAN BLOCKADE — JAPAN\'S MOVE TRIGGERS ESCALATION',
        probability: 0.25,
        effects: { defense: 0.20, gold: 0.18, oil: 0.14, nasdaq: -0.18, lithium: -0.16, emerging: -0.14 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging', 'lithium'],
      },
    ],
  },

  // Scotland Votes for Independence
  {
    id: 'geo_scotland_independence',
    category: 'geopolitical',
    subcategory: 'europe',
    rumor: 'SCOTLAND VOTES FOR INDEPENDENCE 52-48 — UNITED KINGDOM FACES BREAKUP',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['nasdaq'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.68, label: 'MESSY DIVORCE', missLabel: 'SMOOTH EXIT' },
    outcomes: [
      {
        headline: 'MESSY DIVORCE — SCOTLAND CLAIMS NORTH SEA OIL, LEGAL BATTLE ERUPTS',
        probability: 0.40,
        effects: { oil: 0.12, gold: 0.08, nasdaq: -0.06, emerging: -0.04 },
        sentiment: 'mixed',
        sentimentAssets: ['oil', 'nasdaq'],
      },
      {
        headline: 'SMOOTH TRANSITION — SCOTLAND APPLIES TO JOIN EU AS INDEPENDENT NATION',
        probability: 0.35,
        effects: { emerging: 0.06, nasdaq: 0.04, gold: -0.04, oil: 0.04 },
        sentiment: 'neutral',
        sentimentAssets: ['nasdaq'],
      },
      {
        headline: 'WESTMINSTER REFUSES TO RECOGNIZE VOTE — CONSTITUTIONAL CRISIS, PROTESTS ERUPT',
        probability: 0.25,
        effects: { gold: 0.12, defense: 0.06, nasdaq: -0.10, emerging: -0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'gold'],
      },
    ],
  },

  // Mexican Cartel War Spills Into US
  {
    id: 'geo_cartel_border_war',
    category: 'geopolitical',
    subcategory: 'americas',
    rumor: 'CARTEL ASSASSINATES 4 DEA AGENTS IN TEXAS — PRESIDENT CONSIDERS MILITARY DEPLOYMENT TO BORDER',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['defense', 'gold'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.58, label: 'US INVADES', missLabel: 'COOPERATION' },
    outcomes: [
      {
        headline: 'US LAUNCHES CROSS-BORDER OPERATIONS — MEXICO RECALLS AMBASSADOR',
        probability: 0.30,
        effects: { defense: 0.22, oil: 0.10, gold: 0.14, nasdaq: -0.12, emerging: -0.16 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging'],
      },
      {
        headline: 'BORDER SEALED — $700B US-MEXICO TRADE RELATIONSHIP FROZEN',
        probability: 0.35,
        effects: { nasdaq: -0.14, tesla: -0.12, emerging: -0.10, gold: 0.10, oil: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla', 'emerging'],
      },
      {
        headline: 'JOINT US-MEXICO OPERATION CAPTURES CARTEL LEADERSHIP — CRISIS DE-ESCALATES',
        probability: 0.20,
        effects: { nasdaq: 0.06, emerging: 0.08, defense: 0.06, gold: -0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging'],
        allowsReversal: true,
      },
      {
        headline: 'CARTEL RETALIATES — PIPELINE AND REFINERY SABOTAGE ACROSS TEXAS',
        probability: 0.15,
        effects: { oil: 0.20, gold: 0.16, defense: 0.18, nasdaq: -0.16, tesla: -0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['oil', 'nasdaq', 'tesla'],
      },
    ],
  },

  // Egypt Threatens War Over Ethiopian Dam
  {
    id: 'geo_nile_water_war',
    category: 'geopolitical',
    subcategory: 'africa',
    rumor: 'EGYPT MOBILIZES MILITARY AS NILE FLOW DROPS 40% — THREATENS TO BOMB ETHIOPIAN DAM',
    duration: 1,
    rumorSentiment: 'bearish',
    sentimentAssets: ['emerging', 'gold', 'coffee'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.55, label: 'EGYPT BOMBS DAM', missLabel: 'TREATY SIGNED', missRate: 0.40 },
    outcomes: [
      {
        headline: 'EGYPT BOMBS ETHIOPIAN DAM — CATASTROPHIC FLOODING, HUMANITARIAN DISASTER',
        probability: 0.25,
        effects: { gold: 0.22, defense: 0.18, oil: 0.14, coffee: 0.16, emerging: -0.20, nasdaq: -0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging', 'nasdaq'],
      },
      {
        headline: 'HISTORIC NILE WATER SHARING TREATY SIGNED — AFRICAN STABILITY IMPROVES',
        probability: 0.35,
        effects: { emerging: 0.12, coffee: -0.06, gold: -0.06, nasdaq: 0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['emerging'],
        allowsReversal: true,
      },
      {
        headline: 'PROXY WAR — GULF STATES BACK EGYPT, CHINA BACKS ETHIOPIA',
        probability: 0.25,
        effects: { defense: 0.14, gold: 0.12, oil: 0.10, emerging: -0.14, coffee: 0.10 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging', 'defense'],
      },
      {
        headline: 'DAM FAILS ON ITS OWN — ENGINEERING DEFECT CAUSES MASSIVE FLOOD',
        probability: 0.15,
        effects: { coffee: 0.20, gold: 0.10, emerging: -0.16, nasdaq: -0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['coffee', 'emerging'],
      },
    ],
  },

  // Cuban Regime Collapses — US Lifts Embargo
  {
    id: 'geo_cuba_revolution',
    category: 'geopolitical',
    subcategory: 'americas',
    rumor: 'CUBAN GOVERNMENT COLLAPSES AFTER MASS PROTESTS — US CONSIDERS LIFTING 60-YEAR EMBARGO',
    duration: 1,
    rumorSentiment: 'mixed',
    sentimentAssets: ['emerging', 'defense'],
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.70, label: 'US NORMALIZES', missLabel: 'JUNTA' },
    outcomes: [
      {
        headline: 'FULL NORMALIZATION — CUBA OPENS TO US INVESTMENT, TOURISM AND AGRICULTURE BOOM',
        probability: 0.40,
        effects: { emerging: 0.14, coffee: -0.08, nasdaq: 0.06, gold: -0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['emerging', 'nasdaq'],
      },
      {
        headline: 'POWER VACUUM — MILITARY JUNTA SEIZES CONTROL, EMBARGO STAYS',
        probability: 0.35,
        effects: { defense: 0.06, gold: 0.04, emerging: -0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging'],
      },
      {
        headline: 'CHINA SWOOPS IN — NAVAL BASE ESTABLISHED IN HAVANA, 90 MILES FROM FLORIDA',
        probability: 0.25,
        effects: { defense: 0.22, gold: 0.16, nasdaq: -0.14, emerging: -0.10, oil: 0.08 },
        sentiment: 'bearish',
        sentimentAssets: ['defense', 'nasdaq'],
      },
    ],
  },
]

// Category weights for selecting which chain type to start
export const CHAIN_CATEGORY_WEIGHTS: Record<string, number> = {
  geopolitical: 0.13,
  fed: 0.12,
  crypto: 0.12,
  energy: 0.12,
  tech: 0.11,
  tesla: 0.06,
  agriculture: 0.10,
  biotech: 0.10,
  economic: 0.10,
  ev: 0.03,
  blackswan: 0.01,
}
