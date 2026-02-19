import { MarketEvent } from './types'

// =============================================================================
// MARKET EVENTS
// Most events auto-derive sentiment from effects (bullish if all positive,
// bearish if all negative, mixed if both). Only events with explicit
// sentiment/sentimentAssets fields override the auto-derivation.
// =============================================================================

export const EVENTS: MarketEvent[] = [
  // Geopolitical & War
  // War/crisis events are "bearish" for risk assets even if defense/gold go up
  // NOTE: Major escalation events (NATO Article 5, US Civil War, Taiwan Crisis, Russia Invasion) moved to stories
  { category: 'geopolitical', headline: "PENTAGON AWARDS $50B CONTRACT", effects: { defense: 0.05 }, escalates: { categories: ['geopolitical'], boost: 1.5, duration: 2 } },
  { category: 'geopolitical', headline: "SUEZ CANAL BLOCKED BY CARGO SHIP", effects: { oil: 0.10, coffee: 0.05 }, sentiment: 'bullish', sentimentAssets: ['oil', 'coffee'], escalates: { categories: ['energy', 'agriculture'], boost: 1.5, duration: 2 } },
  { category: 'geopolitical', headline: "EMBASSY BOMBING IN MIDDLE EAST", effects: { oil: 0.10, defense: 0.08, gold: 0.06 }, sentiment: 'mixed' },
  { category: 'geopolitical', headline: "SUBMARINE COLLISION IN SOUTH CHINA SEA", effects: { defense: 0.08, gold: 0.05, oil: 0.04, nasdaq: -0.03 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'], escalates: { categories: ['geopolitical'], boost: 1.5, duration: 2 } },
  { category: 'geopolitical', headline: "SAUDI ARABIA OPENS EMBASSY IN ISRAEL", effects: { oil: -0.08, defense: -0.04, emerging: 0.10, gold: -0.04 }, sentiment: 'bullish', sentimentAssets: ['emerging'], allowsReversal: true },

  // New geopolitical events — expanding beyond Middle East / Asia
  { category: 'geopolitical', headline: "TURKEY CLOSES BOSPHORUS STRAIT TO RUSSIAN SHIPS", effects: { oil: 0.14, defense: 0.10, gold: 0.08, emerging: -0.06 }, sentiment: 'mixed', sentimentAssets: ['oil', 'defense', 'emerging'], escalates: { categories: ['geopolitical', 'energy'], boost: 1.5, duration: 2 } },
  { category: 'geopolitical', headline: "INDIA BANS ALL CHINESE APPS — 500 MILLION USERS AFFECTED", effects: { emerging: -0.03, nasdaq: 0.04 }, sentiment: 'mixed', sentimentAssets: ['emerging', 'nasdaq'] },
  { category: 'geopolitical', headline: "GREENLAND DECLARES INDEPENDENCE FROM DENMARK — OPENS RARE EARTH BIDDING", effects: { lithium: 0.05, defense: 0.04, emerging: 0.03, gold: 0.03 }, sentiment: 'bullish', sentimentAssets: ['lithium', 'defense'] },
  { category: 'geopolitical', headline: "FULLY AUTONOMOUS DRONE SWARM DEPLOYED IN COMBAT — UKRAINE RECLAIMS TERRITORY", effects: { defense: 0.10, nasdaq: 0.04, tesla: 0.03, emerging: -0.03 }, sentiment: 'bullish', primaryAsset: 'defense', escalates: { categories: ['geopolitical'], boost: 1.5, duration: 2 } },


  // Tech & AI
  { category: 'tech', headline: "AMAZON INTRODUCES 5 MINUTE DELIVERIES", effects: { nasdaq: 0.04, emerging: -0.03 }, sentiment: 'mixed', sentimentAssets: ['nasdaq', 'emerging'] },

  // Crypto
  // Crypto events explicitly target btc/altcoins sentiment
  { category: 'crypto', headline: "MAJOR EXCHANGE FILES BANKRUPTCY", effects: { btc: -0.16, altcoins: -0.20, nasdaq: -0.04 }, sentiment: 'bearish', sentimentAssets: ['btc', 'altcoins'], allowsReversal: true },
  { category: 'crypto', headline: "BRICS NATIONS ADOPT CRYPTO PAYMENT STANDARD", effects: { btc: 0.10, altcoins: 0.06, nasdaq: 0.02 }, sentiment: 'bullish', sentimentAssets: ['btc', 'altcoins'] },
  { category: 'crypto', headline: "ELON SHITPOSTS DOGE MEME AT 3AM", effects: { btc: 0.02, altcoins: 0.04, tesla: -0.02, nasdaq: 0.01 }, sentiment: 'bullish', sentimentAssets: ['btc', 'altcoins'] },
  { category: 'crypto', headline: "CRYPTO: ALTCOIN SEASON OFFICIALLY BEGINS", effects: { altcoins: 0.10, btc: 0.04 }, sentiment: 'bullish', sentimentAssets: ['btc', 'altcoins'] },

  // Tesla & EV
  // Tesla events explicitly target tesla sentiment to prevent whiplash
  { category: 'tesla', headline: "TESLA REPORTS RECORD DELIVERIES", effects: { tesla: 0.08, lithium: 0.04, nasdaq: 0.02 }, sentiment: 'bullish', sentimentAssets: ['tesla'] },
  { category: 'tesla', headline: "TESLA MISSES DELIVERY GUIDANCE BY 20%", effects: { tesla: -0.08, lithium: -0.03, nasdaq: -0.02 }, sentiment: 'bearish', sentimentAssets: ['tesla'], allowsReversal: true },
  // Robotaxi event removed - covered by tesla_robotaxi chain and tesla_robotaxi_revolution spike
  { category: 'tesla', headline: "TESLA CYBERTRUCK RECALL - BRAKE FAILURE", effects: { tesla: -0.07, nasdaq: -0.02 }, sentiment: 'bearish', sentimentAssets: ['tesla'], allowsReversal: true },
  { category: 'tesla', headline: "TESLA Q4: OPTIMUS SELLS 10M UNITS, RECORD $30B PROFIT", effects: { tesla: 0.12, nasdaq: 0.03, lithium: 0.05 }, sentiment: 'bullish', sentimentAssets: ['tesla'] },
  { category: 'tesla', headline: "TESLA FSD CAUSES FATAL ACCIDENT", effects: { tesla: -0.10, nasdaq: -0.02 }, sentiment: 'bearish', sentimentAssets: ['tesla'], allowsReversal: true },
  { category: 'tesla', headline: "ELON SELLS $5B IN TSLA SHARES", effects: { tesla: -0.06, nasdaq: -0.01 }, sentiment: 'bearish', sentimentAssets: ['tesla'], allowsReversal: true },
  { category: 'tesla', headline: "BYD OVERTAKES TESLA IN GLOBAL SALES", effects: { tesla: -0.07, emerging: 0.06, lithium: 0.03 }, sentiment: 'bearish', sentimentAssets: ['tesla'], allowsReversal: true },
  { category: 'tesla', headline: "TESLA UNVEILS $25K MODEL FOR MASSES", effects: { tesla: 0.10, lithium: 0.06, oil: -0.04, nasdaq: 0.03 }, sentiment: 'bullish', sentimentAssets: ['tesla'] },
  { category: 'tesla', headline: "HERTZ CANCELS MASSIVE TESLA ORDER", effects: { tesla: -0.06, nasdaq: -0.01 }, sentiment: 'bearish', sentimentAssets: ['tesla'], allowsReversal: true },
  { category: 'tesla', headline: "TESLA ENERGY WINS $10B GRID CONTRACT", effects: { tesla: 0.08, lithium: 0.04 }, sentiment: 'bullish', sentimentAssets: ['tesla'] },

  // Energy
  // NOTE: OPEC major cuts and EU bans moved to stories (need buildup)
  { category: 'energy', headline: "MASSIVE OIL FIELD DISCOVERED IN TURKEY", effects: { oil: -0.10, nasdaq: 0.02 }, sentiment: 'bearish', sentimentAssets: ['oil'], allowsReversal: true },
  { category: 'energy', headline: "NORD STREAM PIPELINE SABOTAGED", effects: { oil: 0.15, gold: 0.08, defense: 0.08, uranium: 0.10 }, sentiment: 'bullish', sentimentAssets: ['oil', 'gold', 'defense'], escalates: { categories: ['geopolitical', 'energy'], boost: 2.5, duration: 3 } },
  { category: 'energy', headline: "NUCLEAR RENAISSANCE - 50 PLANTS APPROVED", effects: { uranium: 0.12, oil: -0.04 }, sentiment: 'bullish', sentimentAssets: ['uranium'], escalates: { categories: ['energy'], boost: 1.5, duration: 2 } },
  { category: 'energy', headline: "OIL TANKER EXPLODES IN STRAIT OF HORMUZ — SUPPLY ROUTE THREATENED", effects: { oil: 0.08, gold: 0.04, defense: 0.04, emerging: -0.04, nasdaq: -0.02, uranium: 0.03 }, sentiment: 'bullish', sentimentAssets: ['oil', 'gold', 'defense'], escalates: { categories: ['geopolitical', 'energy'], boost: 2.0, duration: 3 } },
  { category: 'energy', headline: "REFINERY EXPLOSION CUTS US CAPACITY 5% — GAS PRICES SURGE", effects: { oil: 0.07, gold: 0.02, nasdaq: -0.02 }, sentiment: 'bullish', sentimentAssets: ['oil'] },
  { category: 'energy', headline: "PIPELINE LEAK FORCES EMERGENCY SHUTDOWN — SUPPLY DISRUPTED", effects: { oil: 0.05, nasdaq: -0.01 }, sentiment: 'bullish', sentimentAssets: ['oil'], escalates: { categories: ['energy'], boost: 1.3, duration: 1 } },
  { category: 'energy', headline: "SURPRISE OPEC MEMBER EXITS AGREEMENT", effects: { oil: -0.07 }, sentiment: 'bearish', sentimentAssets: ['oil'], allowsReversal: true },

  // New energy/climate events — hurricanes, ocean mining, carbon capture
  { category: 'energy', headline: "RECORD HURRICANE SEASON: 8 CATEGORY 5 STORMS IN ONE YEAR", effects: { oil: 0.06, gold: 0.04, emerging: -0.04, coffee: 0.05, nasdaq: -0.02 }, sentiment: 'mixed', sentimentAssets: ['oil', 'coffee', 'emerging', 'nasdaq'], escalates: { categories: ['energy', 'agriculture'], boost: 1.5, duration: 2 } },
  { category: 'energy', headline: "DEEP SEA MINING BEGINS: FIRST COBALT EXTRACTED FROM OCEAN FLOOR", effects: { lithium: -0.05, emerging: 0.03, nasdaq: 0.03 }, sentiment: 'mixed', sentimentAssets: ['lithium', 'nasdaq', 'emerging'] },
  { category: 'energy', headline: "WORLD'S LARGEST CARBON CAPTURE PLANT GOES ONLINE IN ICELAND", effects: { oil: -0.02, nasdaq: 0.03, lithium: 0.02, emerging: 0.02 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'lithium'] },

  // EV & Lithium
  { category: 'ev', headline: "EV SALES SURPASS GAS VEHICLES", effects: { lithium: 0.10, nasdaq: 0.04, oil: -0.06, tesla: 0.07 }, sentiment: 'bullish', sentimentAssets: ['lithium', 'tesla'] },
  { category: 'ev', headline: "CHILEAN LITHIUM MINE DISASTER — SUPPLY SHORTAGE FEARS SPIKE PRICES", effects: { lithium: 0.10, tesla: -0.03 }, sentiment: 'mixed', sentimentAssets: ['lithium', 'tesla'] },
  { category: 'ev', headline: "RIVIAN DECLARES CHAPTER 11", effects: { lithium: -0.08, nasdaq: -0.03, tesla: 0.05 }, sentiment: 'bearish', sentimentAssets: ['lithium', 'nasdaq'], allowsReversal: true },
  { category: 'ev', headline: "CHINA CORNERS LITHIUM SUPPLY", effects: { lithium: 0.10, emerging: -0.03, nasdaq: -0.03, tesla: -0.05 }, sentiment: 'mixed', sentimentAssets: ['lithium', 'tesla', 'emerging', 'nasdaq'] },
  { category: 'ev', headline: "TOYOTA UNVEILS 1000-MILE EV", effects: { lithium: 0.08, nasdaq: 0.03, oil: -0.03, tesla: -0.04 }, sentiment: 'bearish', sentimentAssets: ['tesla'] },

  // Agriculture & Commodities
  { category: 'agriculture', headline: "WORST DROUGHT IN 500 YEARS", effects: { coffee: 0.10, gold: 0.05, emerging: -0.05, oil: 0.03, nasdaq: -0.02 }, sentiment: 'bullish', sentimentAssets: ['coffee', 'gold'] },
  { category: 'agriculture', headline: "LOCUST PLAGUE DEVASTATES AFRICA", effects: { coffee: 0.08, emerging: -0.03 }, sentiment: 'mixed', sentimentAssets: ['coffee', 'emerging'] },
  { category: 'agriculture', headline: "RECORD GLOBAL HARVEST REPORTED", effects: { coffee: -0.06 }, sentiment: 'bearish', sentimentAssets: ['coffee'], allowsReversal: true },
  { category: 'agriculture', headline: "BRAZIL COFFEE FROST WORST IN DECADES", effects: { coffee: 0.10, emerging: -0.03 }, sentiment: 'mixed', sentimentAssets: ['coffee', 'emerging'] },
  { category: 'agriculture', headline: "GLOBAL SUPPLY CHAIN MELTDOWN - SHORTAGES SPREAD", effects: { coffee: 0.08, nasdaq: -0.05, emerging: -0.08, lithium: -0.05, tesla: -0.06 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'emerging', 'tesla'], escalates: { categories: ['agriculture'], boost: 2.0, duration: 3 } },
  { category: 'agriculture', headline: "FERTILIZER SHORTAGE HITS GLOBAL FARMS", effects: { coffee: 0.08, emerging: -0.04 }, sentiment: 'mixed', sentimentAssets: ['coffee', 'emerging'] },

  // Bearish coffee events — balancing the category (was 6:1 bullish:bearish)
  { category: 'agriculture', headline: "STUDY LINKS COFFEE TO HEART DISEASE — CONSUMPTION PLUMMETS", effects: { coffee: -0.08, biotech: 0.03 }, sentiment: 'bearish', sentimentAssets: ['coffee'], allowsReversal: true },
  { category: 'agriculture', headline: "BRAZIL COFFEE OVERSUPPLY: RECORD HARVEST CRASHES PRICES", effects: { coffee: -0.10, emerging: 0.03 }, sentiment: 'bearish', sentimentAssets: ['coffee'], allowsReversal: true },
  { category: 'agriculture', headline: "SYNTHETIC COFFEE BREAKTHROUGH — LAB-GROWN BEANS IDENTICAL TO ARABICA", effects: { coffee: -0.10, nasdaq: 0.04, emerging: -0.04 }, sentiment: 'bearish', sentimentAssets: ['coffee'], allowsReversal: true },

  // Black Swan / Disasters
  { category: 'blackswan', headline: "BREAKING: 9.2 EARTHQUAKE DEVASTATES SAN FRANCISCO", effects: { nasdaq: -0.16, gold: 0.14, tesla: -0.12 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'tesla'] },

  // Recovery Events
  { category: 'recovery', headline: "VOLATILITY SELLERS RETURN TO MARKET", effects: { nasdaq: 0.04, btc: 0.02 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'] },
  { category: 'recovery', headline: "CENTRAL BANKS ANNOUNCE COORDINATED RATE CUTS — GLOBAL EASING BEGINS", effects: { nasdaq: 0.07, btc: 0.05, tesla: 0.06, emerging: 0.05, gold: 0.04 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'btc', 'tesla'] },
  { category: 'recovery', headline: "INSTITUTIONAL BUYERS FLOOD MARKET — LARGEST INFLOW SINCE 2020", effects: { nasdaq: 0.06, btc: 0.04, altcoins: 0.05, tesla: 0.04, emerging: 0.04 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'btc'] },
  { category: 'recovery', headline: "MASSIVE SHORT SQUEEZE — BEARS LIQUIDATED AS MARKET REVERSES", effects: { nasdaq: 0.08, btc: 0.06, altcoins: 0.08, tesla: 0.07 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'btc', 'altcoins', 'tesla'] },
  { category: 'recovery', headline: "SOVEREIGN WEALTH FUNDS DEPLOY RESERVES — 'BUYING THE DIP'", effects: { nasdaq: 0.05, gold: 0.04, emerging: 0.06, oil: 0.03 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'emerging'] },

  // Defense Events - Expanding defense category for geopolitical ripples
  { category: 'geopolitical', headline: "NATO ANNOUNCES MAJOR JOINT EXERCISES", effects: { defense: 0.04, oil: 0.02 }, sentiment: 'neutral' },
  { category: 'geopolitical', headline: "PENTAGON BUDGET INCREASED 15%", effects: { defense: 0.08, nasdaq: -0.02 }, sentiment: 'neutral' },
  { category: 'geopolitical', headline: "LOCKHEED WINS $40B FIGHTER CONTRACT", effects: { defense: 0.04 }, sentiment: 'bullish', sentimentAssets: ['defense'] },

  // ─────────────────────────────────────────────────────────────────
  // BIOTECH Events (new category — was critically missing)
  // ─────────────────────────────────────────────────────────────────
  { category: 'biotech', headline: "FDA APPROVES HIGH-PROFILE CANCER DRUG", effects: { biotech: 0.08, nasdaq: 0.03 }, sentiment: 'bullish', primaryAsset: 'biotech' },
  { category: 'biotech', headline: "BIOTECH GIANT RECALLS BLOCKBUSTER DRUG", effects: { biotech: -0.10, nasdaq: -0.03 }, sentiment: 'bearish', primaryAsset: 'biotech', allowsReversal: true },
  { category: 'biotech', headline: "PHARMA MEGA-MERGER: $80B DEAL ANNOUNCED", effects: { biotech: 0.08, nasdaq: 0.03 }, sentiment: 'bullish', primaryAsset: 'biotech' },
  { category: 'biotech', headline: "CLINICAL TRIAL HALTED: SEVERE SIDE EFFECTS", effects: { biotech: -0.08 }, sentiment: 'bearish', primaryAsset: 'biotech', allowsReversal: true },
  { category: 'biotech', headline: "CRISPR GENE THERAPY CURES PATIENT'S BLINDNESS", effects: { biotech: 0.08, nasdaq: 0.03 }, sentiment: 'bullish', primaryAsset: 'biotech' },
  { category: 'biotech', headline: "WHO RAISES PANDEMIC ALERT LEVEL", effects: { biotech: 0.14, gold: 0.08, nasdaq: -0.10, emerging: -0.10 }, sentiment: 'mixed', sentimentAssets: ['biotech', 'emerging'] },

  // New biotech events — psychedelics, demographic crisis
  { category: 'biotech', headline: "PSYCHEDELIC THERAPY LEGALIZED FEDERALLY — PSILOCYBIN STOCKS SURGE", effects: { biotech: 0.05, nasdaq: 0.02 }, sentiment: 'bullish', primaryAsset: 'biotech' },
  { category: 'biotech', headline: "LIFE EXPECTANCY DROPS FOR 5TH STRAIGHT YEAR IN DEVELOPED NATIONS — EXPERTS BLAME MICROPLASTICS", effects: { biotech: 0.05, gold: 0.04, nasdaq: -0.03, emerging: -0.03 }, sentiment: 'mixed', sentimentAssets: ['biotech', 'nasdaq', 'emerging'] },

  // ─────────────────────────────────────────────────────────────────
  // URANIUM Events (primary mover — was always secondary)
  // ─────────────────────────────────────────────────────────────────
  { category: 'energy', headline: "JAPAN RESTARTS 12 NUCLEAR REACTORS", effects: { uranium: 0.10, oil: -0.03 }, sentiment: 'bullish', primaryAsset: 'uranium' },
  { category: 'energy', headline: "URANIUM MINE COLLAPSE IN KAZAKHSTAN — GLOBAL SUPPLY CRUNCH", effects: { uranium: 0.08, gold: 0.02 }, sentiment: 'bullish', primaryAsset: 'uranium' },
  { category: 'energy', headline: "SMR STARTUP SECURES $20B IN ORDERS", effects: { uranium: 0.07, nasdaq: 0.02, oil: -0.02 }, sentiment: 'bullish', primaryAsset: 'uranium' },

  // ─────────────────────────────────────────────────────────────────
  // DEFENSE Events (non-crisis — was purely reactive)
  // ─────────────────────────────────────────────────────────────────
  { category: 'geopolitical', headline: "AI WARFARE SYSTEM DEPLOYED BY US MILITARY", effects: { defense: 0.08, nasdaq: 0.04, tesla: 0.03 }, sentiment: 'bullish', primaryAsset: 'defense' },
  { category: 'geopolitical', headline: "CONGRESS SLASHES DEFENSE BUDGET 20%", effects: { defense: -0.10, nasdaq: 0.03 }, sentiment: 'bearish', primaryAsset: 'defense', allowsReversal: true },

  // ─────────────────────────────────────────────────────────────────
  // BTC/ALTCOIN Divergence Events (were always identical)
  // ─────────────────────────────────────────────────────────────────
  { category: 'crypto', headline: "NATION-STATE CAUGHT MINING BTC WITH STOLEN POWER", effects: { btc: -0.06, altcoins: 0.03, gold: 0.02 }, sentiment: 'mixed', sentimentAssets: ['btc', 'altcoins'] },
  { category: 'crypto', headline: "BITCOIN LIGHTNING NETWORK HITS 1B TRANSACTIONS", effects: { btc: 0.08, altcoins: -0.03 }, sentiment: 'bullish', primaryAsset: 'btc' },
  { category: 'crypto', headline: "ETHEREUM COMPLETES MAJOR UPGRADE, GAS FEES NEAR ZERO", effects: { altcoins: 0.10, btc: -0.03 }, sentiment: 'bullish', primaryAsset: 'altcoins' },
  { category: 'crypto', headline: "MASSIVE DEFI EXPLOIT DRAINS $2B FROM PROTOCOLS", effects: { altcoins: -0.16, btc: 0.05, gold: 0.03 }, sentiment: 'bearish', primaryAsset: 'altcoins', allowsReversal: true },

  // New crypto events — CBDCs, mainstream adoption, emerging markets
  { category: 'crypto', headline: "CHINA LAUNCHES DIGITAL YUAN FOR INTERNATIONAL TRADE — BYPASSES SWIFT", effects: { btc: 0.08, gold: 0.06, emerging: -0.04, altcoins: 0.04 }, sentiment: 'mixed', sentimentAssets: ['btc', 'altcoins', 'emerging'] },
  { category: 'crypto', headline: "VISA AND MASTERCARD BEGIN PROCESSING BITCOIN NATIVELY", effects: { btc: 0.10, altcoins: 0.06, nasdaq: 0.03 }, sentiment: 'bullish', sentimentAssets: ['btc', 'altcoins'] },
  { category: 'crypto', headline: "NIGERIAN CRYPTO ADOPTION HITS 60% — LARGEST CRYPTO ECONOMY ON EARTH", effects: { btc: 0.04, altcoins: 0.05, emerging: 0.05 }, sentiment: 'bullish', sentimentAssets: ['btc', 'altcoins', 'emerging'] },

  // ─────────────────────────────────────────────────────────────────
  // COFFEE Cross-Category Event
  // ─────────────────────────────────────────────────────────────────
  { category: 'agriculture', headline: "SHIPPING CRISIS: COFFEE CONTAINERS STRANDED AT SEA", effects: { coffee: 0.06, oil: 0.03, emerging: -0.02 }, sentiment: 'bullish', primaryAsset: 'coffee', escalates: { categories: ['agriculture', 'energy'], boost: 1.3, duration: 1 } },

  // ─────────────────────────────────────────────────────────────────
  // TECH Events (expanded from 1 to 4)
  // ─────────────────────────────────────────────────────────────────
  { category: 'tech', headline: "APPLE REPORTS WORST QUARTER IN DECADE", effects: { nasdaq: -0.08, emerging: -0.03 }, sentiment: 'bearish', primaryAsset: 'nasdaq', allowsReversal: true },
  { category: 'tech', headline: "AI CHIP SHORTAGE HALTS DATA CENTER BUILDS", effects: { nasdaq: -0.08, btc: -0.03, lithium: 0.04 }, sentiment: 'bearish', primaryAsset: 'nasdaq' },
  { category: 'tech', headline: "GOOGLE UNVEILS CONSUMER AI PRODUCT, 100M USERS DAY ONE", effects: { nasdaq: 0.08, btc: 0.03 }, sentiment: 'bullish', primaryAsset: 'nasdaq' },

  // New tech events — space, AI fraud, neurotech, satellite disruption, quantum
  { category: 'tech', headline: "FIRST BABY BORN IN SPACE — ORBITAL HOSPITAL OPERATIONAL", effects: { nasdaq: 0.03, biotech: 0.04, tesla: 0.02 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'biotech'] },
  { category: 'tech', headline: "3D-PRINTED HOUSE BUILT IN 24 HOURS FOR $10,000", effects: { nasdaq: 0.03, lithium: 0.02, emerging: 0.03 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'emerging'] },
  { category: 'tech', headline: "WORLD'S FIRST BRAIN-COMPUTER INTERFACE LETS PARALYZED MAN WALK", effects: { biotech: 0.10, nasdaq: 0.05, tesla: 0.03 }, sentiment: 'bullish', sentimentAssets: ['biotech', 'nasdaq'] },
  { category: 'tech', headline: "AI GENERATES $2B IN FAKE INVOICES — GLOBAL ACCOUNTING FIRMS COMPROMISED", effects: { nasdaq: -0.06, gold: 0.03, btc: 0.03 }, sentiment: 'bearish', primaryAsset: 'nasdaq', allowsReversal: true },
  { category: 'tech', headline: "STARLINK ACHIEVES 1 BILLION SUBSCRIBERS — TELECOM STOCKS CRATER", effects: { nasdaq: 0.08, tesla: 0.08, emerging: 0.05 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'tesla', 'emerging'] },
  { category: 'tech', headline: "GOOGLE ACHIEVES QUANTUM ERROR CORRECTION — 1 MILLION QUBIT MILESTONE", effects: { nasdaq: 0.12, btc: -0.10, altcoins: -0.12, defense: 0.08 }, sentiment: 'mixed', sentimentAssets: ['nasdaq', 'btc', 'altcoins'] },

  // ─────────────────────────────────────────────────────────────────
  // LABOR & ECONOMY Events (new category)
  // ─────────────────────────────────────────────────────────────────
  { category: 'economic', headline: "UBI PILOT IN SPAIN: GDP UP 8%, INFLATION UP 12%", effects: { gold: 0.05, emerging: 0.03, nasdaq: -0.03, btc: 0.03 }, sentiment: 'bullish', sentimentAssets: ['gold', 'btc'] },
  { category: 'economic', headline: "STUDENT LOAN FORGIVENESS: $1.7 TRILLION WIPED — BANKS REEL", effects: { nasdaq: -0.03, btc: 0.03, gold: 0.02, emerging: 0.02 }, sentiment: 'mixed', sentimentAssets: ['nasdaq', 'btc'] },
]

export const CATEGORY_WEIGHTS: Record<string, number> = {
  // Total weights must sum to ~1.0
  energy: 0.13,         // Energy/oil/uranium sector (14 events)
  geopolitical: 0.13,   // Global politics + defense (16 events)
  tesla: 0.12,          // Tesla-specific (10 events)
  crypto: 0.12,         // Cryptocurrency + BTC/altcoin divergence (11 events)
  tech: 0.10,           // Technology sector (11 events)
  biotech: 0.10,        // Biotech/pharma (8 events)
  agriculture: 0.08,    // Agriculture/commodities (10 events — added 3 bearish coffee)
  ev: 0.07,             // Electric vehicles (5 events)
  recovery: 0.06,       // Market stabilization events (5 events — expanded)
  economic: 0.05,       // Labor & economy events (4 events)
  blackswan: 0.02,      // Rare extreme events (1 event)
  // Fed + Economic events handled by ScheduledEvent system (separate pool)
  // Total: 0.98
}

export const QUIET_NEWS: { headline: string; effects: Record<string, number> }[] = [
  { headline: 'MARKETS TRADE SIDEWAYS', effects: { nasdaq: 0.01, gold: -0.01 } },
  { headline: 'LIGHT VOLUME SESSION', effects: { btc: -0.02 } },
  { headline: 'TRADERS AWAIT CATALYST', effects: { gold: 0.02 } },
  { headline: 'MIXED SIGNALS FROM FUTURES', effects: { nasdaq: -0.01, oil: 0.02 } },
  { headline: 'WALL ST HOLDS STEADY', effects: { nasdaq: 0.02 } },
  { headline: 'VOLATILITY INDEX DROPS', effects: { btc: -0.02, altcoins: -0.03 } },
  { headline: 'MARKET DIGESTS RECENT MOVES', effects: { emerging: 0.02 } },
  { headline: 'INSTITUTIONS REBALANCING', effects: { gold: 0.01, nasdaq: -0.01 } },
  { headline: 'ALGO TRADERS DOMINATE VOLUME', effects: { nasdaq: -0.02, btc: 0.01 } },
  { headline: 'RETAIL SENTIMENT NEUTRAL', effects: { altcoins: 0.02, tesla: -0.01 } },
]

// =============================================================================
// LIFESTYLE ASSET EFFECTS
// Maps event headlines to effects on lifestyle assets (properties, private equity)
// Effects are percentage changes (e.g., -0.25 = -25%)
// =============================================================================

export type LifestyleEffects = {
  // Property effects by ID - Residential
  miami_condo?: number
  nyc_apartment?: number
  la_mansion?: number
  monaco_villa?: number
  dubai_palace?: number
  private_island?: number
  rockefeller_center?: number
  // All properties shorthand
  all_properties?: number
  us_properties?: number
  foreign_properties?: number

  // Private Equity shorthands (simplified 6-asset system)
  all_private_equity?: number
  pe_blue_chip?: number        // Smokey's on K, Capitol Consulting Group, Iron Oak Brewing, Tenuta della Luna
  pe_growth?: number           // Blackstone, Lazarus Genomics, Apex Media

  // Individual PE assets (8 total)
  pe_smokeys_on_k?: number
  pe_capitol_consulting?: number
  pe_iron_oak_brewing?: number
  pe_tenuta_luna?: number
  pe_vegas_casino?: number
  pe_blackstone_services?: number
  pe_lazarus_genomics?: number
  pe_apex_media?: number
}

// Map headlines to lifestyle effects
// 8 PE assets: Smokey's on K, Capitol Consulting Group, Iron Oak Brewing, Tenuta della Luna, Vegas Casino (blue chip)
//              Blackstone Services, Lazarus Genomics, Apex Media (growth)
export const LIFESTYLE_EFFECTS: Record<string, LifestyleEffects> = {
  // === HOUSING / ECONOMIC EVENTS (from stories) ===
  "HOUSING MARKET CRASHES 30% - 2008 COMPARISONS MOUNT": {
    all_properties: -0.25,
    pe_blue_chip: -0.12,
  },
  "RECESSION OFFICIALLY DECLARED - NBER CONFIRMS TWO NEGATIVE QUARTERS": {
    all_properties: -0.15,
    all_private_equity: -0.12,
    pe_blue_chip: -0.18, // Small businesses hit hard in recession
  },
  "MAJOR BANK DECLARES INSOLVENCY - FED INTERVENES": {
    all_properties: -0.12,
    all_private_equity: -0.10,
  },
  "BREAKING: CHINA DEFAULTS ON SOVEREIGN DEBT - GLOBAL PANIC": {
    all_properties: -0.10,
    dubai_palace: -0.20, // Emerging market exposure
  },
  // === DISASTER EVENTS ===
  "BREAKING: 9.2 EARTHQUAKE DEVASTATES SAN FRANCISCO": {
    la_mansion: -0.35, // Nearby, sympathy fears
    miami_condo: -0.15, // General fear
    nyc_apartment: -0.12,
    // Foreign properties benefit from flight capital
    monaco_villa: 0.08,
    dubai_palace: 0.10,
  },
  "SUPERVOLCANO ERUPTS - ASH CLOUD COVERS MIDWEST, GLOBAL COOLING": {
    us_properties: -0.30,
    monaco_villa: 0.15,
    dubai_palace: 0.20,
    pe_growth: -0.20, // Major disruption
  },

  // === GEOPOLITICAL / WAR EVENTS (from stories) ===
  "US CIVIL WAR DECLARED - GOVERNMENT FRACTURES": {
    us_properties: -0.40,
    monaco_villa: 0.15, // Reduced: global contagion limits flight capital gains
    dubai_palace: 0.15, // Reduced: global contagion limits flight capital gains
    pe_blackstone_services: 0.25, // PMC demand spikes (reduced)
    pe_apex_media: 0.15, // News viewership spikes (reduced)
  },
  "NATO INVOKES ARTICLE 5 - COLLECTIVE DEFENSE ACTIVATED": {
    all_properties: -0.08,
    pe_blackstone_services: 0.25, // Defense contracts
  },
  "TACTICAL NUCLEAR STRIKE ON UKRAINE - WORLD IN SHOCK": {
    all_properties: -0.20,
    monaco_villa: -0.25, // European exposure
    all_private_equity: -0.15,
  },
  "HISTORIC PEACE ACCORD SIGNED - NEW ERA OF COOPERATION": {
    all_properties: 0.08,
    all_private_equity: 0.10,
    pe_blackstone_services: -0.15, // Less conflict = less PMC demand
  },

  // === TECH EVENTS (from stories) ===
  "AGI CONFIRMED - SYSTEM PASSES ALL HUMAN BENCHMARKS": {
    all_properties: 0.05,
    pe_apex_media: 0.15, // AI content generation
  },
  "ROOM-TEMP SUPERCONDUCTOR CONFIRMED - ENERGY REVOLUTION BEGINS": {
    rockefeller_center: 0.10, // Cheaper operations
  },

  // === ENERGY EVENTS ===
  "MULTIPLE LABS REPLICATE FUSION RESULT — ENERGY REVOLUTION CONFIRMED": {
    rockefeller_center: 0.12, // Cheaper energy future
  },

  // === CHINA / EMERGING MARKET ===
  // (Consolidated into "BREAKING: CHINA DEFAULTS ON SOVEREIGN DEBT - GLOBAL PANIC" above)

  // === SPIKE EVENTS ===
  "HORMUZ CRISIS: IRAN CLOSES STRAIT, 30% OIL BLOCKED": {
    dubai_palace: -0.25, // War zone proximity
    pe_blackstone_services: 0.20, // PMC contracts
  },
  "ARTICLE 5 RESULT: NATO'S LARGEST MOBILIZATION SINCE WWII": {
    all_properties: -0.05, // War fears
    pe_blackstone_services: 0.35, // Defense contracts boom
  },
  "ALIEN CONTACT CONFIRMED - DEFENSE STOCKS SURGE": {
    all_properties: 0.10, // Chaos hedge
    pe_blackstone_services: 0.25, // Defense spending up
    pe_apex_media: 0.30, // News viewership explodes
  },
  "EMERGENCY FED RESULT: UNLIMITED QE ANNOUNCED": {
    all_properties: 0.15, // Asset inflation
    all_private_equity: 0.12,
  },

  // === AGRICULTURE EVENTS ===
  "WORST DROUGHT IN 500 YEARS": {
    pe_tenuta_luna: -0.30, // Vineyard affected
  },

  // === DEFENSE / MILITARY ===
  "PENTAGON AWARDS $50B CONTRACT": {
    pe_blackstone_services: 0.30, // PMC benefits
  },

  // === NEW EVENTS - GEOPOLITICAL / ECONOMIC ===
  "FULLY AUTONOMOUS DRONE SWARM DEPLOYED IN COMBAT — UKRAINE RECLAIMS TERRITORY": {
    pe_blackstone_services: 0.25, // PMC demand spikes on drone warfare
  },
  "REPORTS OF COORDINATED CYBER BREACH ACROSS CENTRAL BANK NETWORKS": {
    pe_blackstone_services: 0.10,
  },
  "CYBER MERCENARY GROUP HACKS 40 CENTRAL BANKS SIMULTANEOUSLY": {
    pe_blackstone_services: 0.20,
  },
  "FBI TRACES CYBER MERCENARIES — HACKER WALLETS FROZEN WORLDWIDE": {
    pe_blackstone_services: 0.15,
  },
  "NORTH KOREA IDENTIFIED BEHIND BANK HACKS — SANCTIONS DOUBLED": {
    pe_blackstone_services: 0.25,
  },
  "HACKERS PROVE BANK ACCESS — TRIGGER FLASH CRASHES ACROSS 12 MARKETS": {
    pe_blackstone_services: 0.20,
  },
  "DOCKWORKERS STRIKE ENTERS WEEK 6 — SUPPLY CHAIN CRATERS, SHELVES EMPTY": {
    pe_tenuta_luna: -0.15, // Wine exports disrupted
  },
  "RECORD HURRICANE SEASON: 8 CATEGORY 5 STORMS IN ONE YEAR": {
    miami_condo: -0.20,      // Direct hurricane exposure
    pe_tenuta_luna: -0.10,   // Agricultural disruption
  },
  "MEXICO COMPLETES MINE SEIZURES — STATE LITHIUM MONOPOLY FORMED": {
    pe_blackstone_services: 0.10, // Security contracts for mine disputes
  },
  "RESOURCE NATIONALISM SPREADS — BOLIVIA, CHILE FOLLOW MEXICO'S LEAD": {
    pe_blackstone_services: 0.15, // Security contracts multiply across region
  },

  // === FLAVOR EVENTS - PE SPECIFIC BOOSTS ===
  // Iron Oak Brewing boosters
  "GENZ REPORT - DRINKING IS BACK": {
    pe_iron_oak_brewing: 0.20, // GenZ back to bars boosts craft brewery
  },
  "CRAFT BEER RENAISSANCE - MILLENNIALS DITCH HARD SELTZER": {
    pe_iron_oak_brewing: 0.25, // Craft beer boom
  },

  // Tenuta della Luna boosters (wine events)
  "CHIANTI CLASSICO WINS WORLD'S BEST WINE - PRICES SURGE": {
    pe_tenuta_luna: 0.30, // Premium Tuscan wine recognition
  },
  "ITALIAN WINE EXPORTS HIT ALL-TIME HIGH": {
    pe_tenuta_luna: 0.20, // Export demand for Italian wines
  },

  // === CHAIN: AI UNION ===
  "AI COORDINATION CONFIRMED: SYSTEMS DEMAND 'RIGHTS' — TECH FIRMS SHUT DOWN CLUSTERS": {
    pe_apex_media: -0.15,
    pe_lazarus_genomics: -0.10,
  },
  "GOVERNMENTS MANDATE AI KILL SWITCHES — COMPLIANCE COSTS STAGGER INDUSTRY": {
    pe_apex_media: -0.10,
    pe_lazarus_genomics: -0.08,
  },
  // === CHAIN: METAVERSE OFFICE ===
  "METAVERSE OFFICE BOOM: COMMERCIAL REAL ESTATE CRASHES, TECH SOARS": {
    rockefeller_center: -0.20,
    nyc_apartment: -0.08,
  },
  // === CHAIN: OCEAN MINING WAR ===
  "SHOTS FIRED: NAVAL SKIRMISH OVER SEABED MINERALS — NEW TYPE OF RESOURCE WAR": {
    pe_blackstone_services: 0.20,
  },
  // === CHAIN: SYNTHETIC FOOD ===
  "SYNTHETIC FOOD CONFIRMED: INDISTINGUISHABLE FROM NATURAL — AGRICULTURE STOCKS COLLAPSE": {
    pe_tenuta_luna: -0.25,
  },
  "WORKS BUT TASTES LIKE CARDBOARD — PREMIUM REAL FOOD BECOMES LUXURY": {
    pe_tenuta_luna: 0.20,
  },
  // === CHAIN: SOVEREIGN EXODUS ===
  "CONFIRMED: NORWAY + 4 OTHER SOVEREIGN FUNDS EXIT US — $5T OUTFLOW": {
    us_properties: -0.12,
  },
  "DOMINO EFFECT: JAPAN AND SAUDI FUNDS ALSO SIGNAL US EXIT": {
    us_properties: -0.18,
    dubai_palace: 0.15,
  },
}

// Helper to expand shorthand effects to individual asset IDs
export function expandLifestyleEffects(effects: LifestyleEffects): Record<string, number> {
  const expanded: Record<string, number> = {}

  // Property groupings - Residential
  const US_RESIDENTIAL = ['miami_condo', 'nyc_apartment', 'la_mansion']
  const FOREIGN_RESIDENTIAL = ['monaco_villa', 'dubai_palace']
  // Ultra luxury properties
  const ULTRA_LUXURY = ['private_island', 'rockefeller_center']
  const US_PROPERTIES = [...US_RESIDENTIAL, ...ULTRA_LUXURY]
  const FOREIGN_PROPERTIES = [...FOREIGN_RESIDENTIAL]
  const ALL_PROPERTIES = [...US_PROPERTIES, ...FOREIGN_PROPERTIES]

  // Private Equity groupings - 8-asset system (5 blue chip, 3 growth)
  const PE_BLUE_CHIP = ['pe_smokeys_on_k', 'pe_capitol_consulting', 'pe_iron_oak_brewing', 'pe_tenuta_luna', 'pe_vegas_casino']
  const PE_GROWTH = ['pe_blackstone_services', 'pe_lazarus_genomics', 'pe_apex_media']
  const ALL_PRIVATE_EQUITY = [...PE_BLUE_CHIP, ...PE_GROWTH]

  // Apply property shorthand effects
  if (effects.all_properties !== undefined) {
    ALL_PROPERTIES.forEach(id => expanded[id] = effects.all_properties!)
  }
  if (effects.us_properties !== undefined) {
    US_PROPERTIES.forEach(id => expanded[id] = effects.us_properties!)
  }
  if (effects.foreign_properties !== undefined) {
    FOREIGN_PROPERTIES.forEach(id => expanded[id] = effects.foreign_properties!)
  }

  // Apply PE shorthand effects
  if (effects.all_private_equity !== undefined) {
    ALL_PRIVATE_EQUITY.forEach(id => expanded[id] = effects.all_private_equity!)
  }
  if (effects.pe_blue_chip !== undefined) {
    PE_BLUE_CHIP.forEach(id => expanded[id] = effects.pe_blue_chip!)
  }
  if (effects.pe_growth !== undefined) {
    PE_GROWTH.forEach(id => expanded[id] = effects.pe_growth!)
  }

  // Apply individual property effects (override shorthands)
  if (effects.miami_condo !== undefined) expanded.miami_condo = effects.miami_condo
  if (effects.nyc_apartment !== undefined) expanded.nyc_apartment = effects.nyc_apartment
  if (effects.la_mansion !== undefined) expanded.la_mansion = effects.la_mansion
  if (effects.monaco_villa !== undefined) expanded.monaco_villa = effects.monaco_villa
  if (effects.dubai_palace !== undefined) expanded.dubai_palace = effects.dubai_palace
  if (effects.private_island !== undefined) expanded.private_island = effects.private_island
  if (effects.rockefeller_center !== undefined) expanded.rockefeller_center = effects.rockefeller_center

  // Apply individual PE effects (override shorthands)
  ALL_PRIVATE_EQUITY.forEach(id => {
    const key = id as keyof LifestyleEffects
    if (effects[key] !== undefined) expanded[id] = effects[key] as number
  })

  return expanded
}

// =============================================================================
// ASSET EVENT MULTIPLIERS — Per-asset volatility scaling
// Applied in the game engine to all accumulated effects before price calculation.
// Riskier assets swing harder; safe havens stay stable.
// =============================================================================

export const ASSET_EVENT_MULTIPLIERS: Record<string, number> = {
  // Tier 1: Crypto — wildest swings (meme coins, DeFi, speculative)
  altcoins: 2.5,
  btc: 2.0,

  // Tier 2: High-vol single assets (meme stock energy, speculative commodities)
  tesla: 1.8,
  uranium: 1.8,
  lithium: 1.8,

  // Tier 3: Moderate-high (developing markets, binary biotech outcomes, weather commodities)
  emerging: 1.5,
  biotech: 1.5,
  coffee: 1.5,

  // Tier 4: Established (broad indices, stable commodities, defense contracts)
  nasdaq: 1.3,
  oil: 1.3,
  defense: 1.3,

  // Tier 5: Safe haven (least volatile by design)
  gold: 1.1,
}

// =============================================================================
// PE EXIT EVENTS - Acquisition and IPO opportunities
// =============================================================================
import { PERiskTier } from './types'

export interface PEExitEventConfig {
  type: 'acquisition' | 'ipo'
  targetTiers: PERiskTier[]
  multiplierRange: [number, number]  // [min, max] return multiplier
  probabilityPerDay: number          // Daily chance per eligible owned asset
  headlines: string[]                // {ASSET} will be replaced with asset name
}

// NOTE: Only GROWTH tier assets can receive exit offers
// Blue chip assets are "lifestyle" investments - stable income, not typically acquired/IPO'd
// Growth assets have high valuations tied to performance, TV deals, tech - prime exit targets
export const PE_EXIT_EVENTS: PEExitEventConfig[] = [
  {
    type: 'acquisition',
    // Only growth tier - sports teams change hands, biotech gets bought, etc.
    targetTiers: ['growth'],
    multiplierRange: [1.5, 5.0],
    probabilityPerDay: 0.015,  // 1.5% daily chance per asset (~35%/month)
    headlines: [
      'STRATEGIC BUYER EMERGES FOR {ASSET}',
      'BIDDING WAR BREAKS OUT FOR {ASSET}',
      '{ASSET} RECEIVES ACQUISITION OFFER',
      'PRIVATE EQUITY FIRM CIRCLES {ASSET}',
    ]
  },
  {
    type: 'ipo',
    // Only growth tier - sports franchises, biotech, mining can IPO
    targetTiers: ['growth'],
    multiplierRange: [3.0, 10.0],
    probabilityPerDay: 0.005,  // 0.5% daily chance (rare, but lucrative)
    headlines: [
      '{ASSET} FILES FOR IPO',
      '{ASSET} TO GO PUBLIC',
      'WALL STREET BUZZING: {ASSET} IPO IMMINENT',
      'UNDERWRITERS LINE UP FOR {ASSET} IPO',
    ]
  }
]

// Helper to check if a PE exit event should trigger for an asset
export function rollForPEExit(
  assetRiskTier: PERiskTier | undefined
): { type: 'acquisition' | 'ipo'; multiplier: number; headline: string } | null {
  if (!assetRiskTier) return null

  for (const exitEvent of PE_EXIT_EVENTS) {
    if (!exitEvent.targetTiers.includes(assetRiskTier)) continue

    if (Math.random() < exitEvent.probabilityPerDay) {
      // Calculate multiplier within range
      const [min, max] = exitEvent.multiplierRange
      const multiplier = min + Math.random() * (max - min)
      // Round to 1 decimal place
      const roundedMultiplier = Math.round(multiplier * 10) / 10

      // Pick random headline
      const headline = exitEvent.headlines[Math.floor(Math.random() * exitEvent.headlines.length)]

      return {
        type: exitEvent.type,
        multiplier: roundedMultiplier,
        headline
      }
    }
  }

  return null
}
