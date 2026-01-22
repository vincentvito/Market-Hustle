import { MarketEvent } from './types'

export const EVENTS: MarketEvent[] = [
  // Federal Reserve & Monetary Policy
  { category: 'fed', headline: "FED RAISES RATES 50BPS", effects: { nasdaq: -0.18, btc: -0.15, altcoins: -0.22, emerging: -0.14, gold: -0.08 } },
  { category: 'fed', headline: "FED CUTS RATES IN EMERGENCY MOVE", effects: { nasdaq: 0.22, btc: 0.18, altcoins: 0.28, emerging: 0.16, tesla: 0.25, gold: -0.03 } },
  { category: 'fed', headline: "INFLATION HITS 40-YEAR HIGH", effects: { gold: 0.18, btc: 0.12, altcoins: 0.18, coffee: 0.12 } },
  { category: 'fed', headline: "DOLLAR INDEX CRASHES 5%", effects: { gold: 0.25, btc: 0.22, altcoins: 0.30, oil: 0.15, emerging: 0.12, coffee: 0.08 } },
  { category: 'fed', headline: "FED SIGNALS PIVOT TO EASING", effects: { nasdaq: 0.18, gold: 0.08, btc: 0.15, altcoins: 0.22, emerging: 0.1, tesla: 0.15 } },
  { category: 'fed', headline: "TREASURY YIELDS SPIKE TO 7%", effects: { nasdaq: -0.2, emerging: -0.15, gold: -0.10, tesla: -0.18 } },
  { category: 'fed', headline: "DOLLAR SURGES TO 20-YEAR HIGH", effects: { gold: -0.15, btc: -0.1, oil: -0.1, emerging: -0.18, coffee: -0.08 } },

  // Geopolitical & War
  { category: 'geopolitical', headline: "NATO INVOKES ARTICLE 5", effects: { oil: 0.4, gold: 0.25, defense: 0.35, uranium: 0.2, nasdaq: -0.15, emerging: -0.2 }, escalates: { categories: ['geopolitical', 'energy'], boost: 2.5, duration: 3 } },
  { category: 'geopolitical', headline: "HISTORIC PEACE ACCORD SIGNED", effects: { oil: -0.25, defense: -0.22, nasdaq: 0.1, gold: -0.12, emerging: 0.18 } },
  { category: 'geopolitical', headline: "PENTAGON AWARDS $50B CONTRACT", effects: { defense: 0.25 }, escalates: { categories: ['geopolitical'], boost: 1.5, duration: 2 } },
  { category: 'geopolitical', headline: "US SANCTIONS MAJOR OIL PRODUCER", effects: { oil: 0.28, uranium: 0.15, gold: 0.12 }, escalates: { categories: ['geopolitical', 'energy'], boost: 2.0, duration: 3 } },
  { category: 'geopolitical', headline: "IRAN REGIME COLLAPSES", effects: { oil: -0.3, gold: -0.1, defense: -0.15, nasdaq: 0.12 } },
  { category: 'geopolitical', headline: "US CIVIL WAR DECLARED", effects: { nasdaq: -0.35, gold: 0.5, btc: 0.4, altcoins: 0.5, defense: 0.3, oil: 0.25 }, escalates: { categories: ['geopolitical', 'economic'], boost: 3.0, duration: 5 } },
  { category: 'geopolitical', headline: "TAIWAN STRAIT CRISIS ESCALATES", effects: { nasdaq: -0.25, defense: 0.3, gold: 0.2, lithium: -0.2, emerging: -0.22, tesla: -0.20 }, escalates: { categories: ['geopolitical', 'tech'], boost: 2.5, duration: 3 } },
  { category: 'geopolitical', headline: "SUEZ CANAL BLOCKED BY CARGO SHIP", effects: { oil: 0.2, coffee: 0.15 }, escalates: { categories: ['energy', 'agriculture'], boost: 1.5, duration: 2 } },
  { category: 'geopolitical', headline: "RUSSIA INVADES NEIGHBORING STATE", effects: { oil: 0.35, gold: 0.3, defense: 0.28, uranium: 0.2, nasdaq: -0.12, emerging: -0.25 }, escalates: { categories: ['geopolitical', 'energy'], boost: 3.0, duration: 4 } },

  // Economic & Markets
  { category: 'economic', headline: "RECESSION OFFICIALLY DECLARED", effects: { gold: 0.12, nasdaq: -0.28, tesla: -0.35, altcoins: -0.35, oil: -0.2, emerging: -0.25 }, escalates: { categories: ['economic', 'fed'], boost: 2.0, duration: 3 } },
  { category: 'economic', headline: "GDP GROWTH BEATS ALL FORECASTS", effects: { nasdaq: 0.25, biotech: 0.15, defense: 0.12, emerging: 0.18, oil: 0.15, uranium: 0.1, lithium: 0.18, gold: -0.08, btc: 0.12, altcoins: 0.18, tesla: 0.22, coffee: 0.08 } },
  { category: 'economic', headline: "MAJOR BANK DECLARES INSOLVENCY", effects: { gold: 0.28, btc: 0.22, altcoins: 0.3, nasdaq: -0.22, tesla: -0.18 }, escalates: { categories: ['economic', 'fed'], boost: 2.5, duration: 3 } },
  { category: 'economic', headline: "$2 TRILLION STIMULUS APPROVED", effects: { nasdaq: 0.2, tesla: 0.30, btc: 0.25, altcoins: 0.4, gold: 0.1 }, escalates: { categories: ['fed', 'crypto'], boost: 1.5, duration: 2 } },
  { category: 'economic', headline: "CHINA DEFAULTS ON SOVEREIGN DEBT", effects: { nasdaq: -0.25, gold: 0.35, btc: 0.2, altcoins: 0.25, lithium: -0.3, emerging: -0.4, tesla: -0.25 }, escalates: { categories: ['economic', 'geopolitical'], boost: 2.5, duration: 4 } },
  { category: 'economic', headline: "UNEMPLOYMENT HITS 15%", effects: { tesla: -0.25, gold: 0.15, nasdaq: -0.15 }, escalates: { categories: ['economic', 'fed'], boost: 1.5, duration: 2 } },
  { category: 'economic', headline: "HOUSING MARKET CRASHES 30%", effects: { gold: 0.12 }, escalates: { categories: ['economic'], boost: 1.5, duration: 2 } },
  { category: 'economic', headline: "EMERGING MARKETS BOOM", effects: { emerging: 0.3, oil: 0.12, lithium: 0.15, coffee: 0.1, tesla: 0.12 } },

  // Tech & AI
  { category: 'tech', headline: "AI SINGULARITY ACHIEVED", effects: { nasdaq: 0.5, btc: 0.3, tesla: 0.45, altcoins: 0.45, lithium: 0.25, gold: -0.1 } },
  { category: 'tech', headline: "ROOM-TEMP SUPERCONDUCTOR CONFIRMED", effects: { nasdaq: 0.4, lithium: 0.3, uranium: -0.2, oil: -0.15 } },
  { category: 'tech', headline: "BIG TECH ANTITRUST BREAKUP ORDERED", effects: { nasdaq: -0.25, tesla: -0.15 } },
  { category: 'tech', headline: "MASSIVE DATA BREACH HITS 500M USERS", effects: { nasdaq: -0.15, btc: 0.1, altcoins: 0.12 } },
  { category: 'tech', headline: "SILICON VALLEY LAYOFFS HIT 100,000", effects: { nasdaq: -0.2, tesla: -0.12 } },
  { category: 'tech', headline: "GLOBAL INTERNET BLACKOUT - DAY 1", effects: { btc: -0.45, altcoins: -0.55, nasdaq: -0.35, tesla: -0.40, gold: 0.2 } },
  { category: 'tech', headline: "NVIDIA UNVEILS 100X AI CHIP", effects: { nasdaq: 0.3, lithium: 0.18, tesla: 0.15 } },

  // Crypto
  { category: 'crypto', headline: "MAJOR EXCHANGE FILES BANKRUPTCY", effects: { btc: -0.35, altcoins: -0.5, nasdaq: -0.08 } },
  { category: 'crypto', headline: "EL SALVADOR MAKES BTC LEGAL TENDER", effects: { btc: 0.3, altcoins: 0.4, nasdaq: 0.05 } },
  { category: 'crypto', headline: "SEC APPROVES SPOT BITCOIN ETF", effects: { btc: 0.4, altcoins: 0.5, nasdaq: 0.12 } },
  { category: 'crypto', headline: "CHINA BANS CRYPTO FOR 47TH TIME", effects: { btc: -0.2, altcoins: -0.3, nasdaq: -0.05 } },
  { category: 'crypto', headline: "ELON SHITPOSTS DOGE MEME AT 3AM", effects: { btc: 0.15, altcoins: 0.45, tesla: 0.25, nasdaq: 0.05 } },
  { category: 'crypto', headline: "BITCOIN HALVING COMPLETES", effects: { btc: 0.25, altcoins: 0.35 } },
  { category: 'crypto', headline: "ALTCOIN SEASON BEGINS", effects: { altcoins: 0.6, btc: 0.1 } },
  { category: 'crypto', headline: "WHALE DUMPS 10,000 BTC", effects: { btc: -0.25, altcoins: -0.35 } },
  { category: 'crypto', headline: "DEFI PROTOCOL HACKED FOR $2B", effects: { btc: -0.15, altcoins: -0.4 } },

  // Tesla & EV
  { category: 'tesla', headline: "TESLA REPORTS RECORD DELIVERIES", effects: { tesla: 0.35, lithium: 0.15, nasdaq: 0.08 } },
  { category: 'tesla', headline: "TESLA MISSES DELIVERY GUIDANCE BY 20%", effects: { tesla: -0.30, lithium: -0.12, nasdaq: -0.05 } },
  { category: 'tesla', headline: "ELON ANNOUNCES ROBOTAXI FLEET LAUNCH", effects: { tesla: 0.45, nasdaq: 0.12, lithium: 0.18 } },
  { category: 'tesla', headline: "TESLA CYBERTRUCK RECALL - BRAKE FAILURE", effects: { tesla: -0.25, nasdaq: -0.05 } },
  { category: 'tesla', headline: "OPTIMUS ROBOT ENTERS MASS PRODUCTION", effects: { tesla: 0.50, nasdaq: 0.15, lithium: 0.20 } },
  { category: 'tesla', headline: "TESLA FSD CAUSES FATAL ACCIDENT", effects: { tesla: -0.35, nasdaq: -0.08 } },
  { category: 'tesla', headline: "ELON SELLS $5B IN TSLA SHARES", effects: { tesla: -0.20, nasdaq: -0.03 } },
  { category: 'tesla', headline: "TESLA STOCK ADDED TO DOW JONES", effects: { tesla: 0.30, nasdaq: 0.10 } },
  { category: 'tesla', headline: "BYD OVERTAKES TESLA IN GLOBAL SALES", effects: { tesla: -0.22, emerging: 0.15, lithium: 0.08 } },
  { category: 'tesla', headline: "TESLA UNVEILS $25K MODEL FOR MASSES", effects: { tesla: 0.40, lithium: 0.25, oil: -0.12, nasdaq: 0.10 } },
  { category: 'tesla', headline: "HERTZ CANCELS MASSIVE TESLA ORDER", effects: { tesla: -0.18, nasdaq: -0.03 } },
  { category: 'tesla', headline: "TESLA ENERGY WINS $10B GRID CONTRACT", effects: { tesla: 0.28, lithium: 0.15 } },

  // Biotech & Health
  { category: 'biotech', headline: "WHO DECLARES NEW PANDEMIC", effects: { biotech: 0.4, oil: -0.25, gold: 0.18, nasdaq: -0.1, emerging: -0.2 }, escalates: { categories: ['biotech', 'economic'], boost: 2.5, duration: 4 } },
  { category: 'biotech', headline: "CANCER CURE ENTERS PHASE 3 TRIALS", effects: { biotech: 0.45, nasdaq: 0.05 }, escalates: { categories: ['biotech'], boost: 1.5, duration: 2 } },
  { category: 'biotech', headline: "FDA REJECTS BLOCKBUSTER DRUG", effects: { biotech: -0.35 } },
  { category: 'biotech', headline: "MRNA VACCINE FOR HIV SHOWS PROMISE", effects: { biotech: 0.35, nasdaq: 0.1 }, escalates: { categories: ['biotech'], boost: 1.5, duration: 2 } },
  { category: 'biotech', headline: "AGING REVERSED IN HUMAN TRIALS", effects: { biotech: 0.5, nasdaq: 0.15 }, escalates: { categories: ['biotech', 'tech'], boost: 2.0, duration: 3 } },

  // Energy
  { category: 'energy', headline: "MASSIVE OIL FIELD DISCOVERED IN TURKEY", effects: { oil: -0.28, nasdaq: 0.05 } },
  { category: 'energy', headline: "OPEC+ SLASHES OUTPUT 2M BARRELS", effects: { oil: 0.32, emerging: -0.08 }, escalates: { categories: ['energy', 'geopolitical'], boost: 1.5, duration: 2 } },
  { category: 'energy', headline: "NORD STREAM PIPELINE SABOTAGED", effects: { oil: 0.25, gold: 0.1, defense: 0.1 }, escalates: { categories: ['geopolitical', 'energy'], boost: 2.5, duration: 3 } },
  { category: 'energy', headline: "RUSSIA THREATENS NUCLEAR WAR", effects: { uranium: 0.25, oil: 0.3, gold: 0.35, defense: 0.2, nasdaq: -0.18, emerging: -0.15 }, escalates: { categories: ['geopolitical', 'energy'], boost: 3.0, duration: 4 } },
  { category: 'energy', headline: "NUCLEAR FUSION BREAKTHROUGH ACHIEVED", effects: { uranium: -0.3, oil: -0.25, nasdaq: 0.2, lithium: -0.15, gold: -0.05, tesla: 0.15 }, escalates: { categories: ['tech', 'energy'], boost: 2.0, duration: 3 } },
  { category: 'energy', headline: "EU BANS RUSSIAN ENERGY IMPORTS", effects: { oil: 0.35, uranium: 0.25, gold: 0.1, emerging: -0.1 }, escalates: { categories: ['geopolitical', 'energy'], boost: 2.5, duration: 3 } },
  { category: 'energy', headline: "NUCLEAR RENAISSANCE: 50 PLANTS APPROVED", effects: { uranium: 0.45, oil: -0.12 }, escalates: { categories: ['energy'], boost: 1.5, duration: 2 } },
  { category: 'energy', headline: "OIL TANKER EXPLODES IN STRAIT OF HORMUZ", effects: { oil: 0.4, gold: 0.15, defense: 0.12 }, escalates: { categories: ['geopolitical', 'energy'], boost: 2.0, duration: 3 } },

  // EV & Lithium
  { category: 'ev', headline: "EV SALES SURPASS GAS VEHICLES", effects: { lithium: 0.4, nasdaq: 0.15, oil: -0.15, tesla: 0.25 } },
  { category: 'ev', headline: "CHILEAN LITHIUM MINE DISASTER", effects: { lithium: 0.35, tesla: -0.10 } },
  { category: 'ev', headline: "SOLID-STATE BATTERY MASS PRODUCTION", effects: { lithium: 0.3, nasdaq: 0.18, tesla: 0.20 } },
  { category: 'ev', headline: "RIVIAN DECLARES CHAPTER 11", effects: { lithium: -0.25, nasdaq: -0.12, tesla: 0.15 } },
  { category: 'ev', headline: "CHINA CORNERS LITHIUM SUPPLY", effects: { lithium: 0.45, emerging: -0.1, nasdaq: -0.08, tesla: -0.15 } },
  { category: 'ev', headline: "TOYOTA UNVEILS 1000-MILE EV", effects: { lithium: 0.25, nasdaq: 0.12, oil: -0.1, tesla: -0.12 } },

  // Agriculture & Commodities
  { category: 'agriculture', headline: "WORST DROUGHT IN 500 YEARS", effects: { coffee: 0.35, gold: 0.08 } },
  { category: 'agriculture', headline: "LOCUST PLAGUE DEVASTATES AFRICA", effects: { coffee: 0.25, emerging: -0.1 } },
  { category: 'agriculture', headline: "RUSSIA EXITS GRAIN DEAL", effects: { gold: 0.1, coffee: 0.15 } },
  { category: 'agriculture', headline: "RECORD GLOBAL HARVEST REPORTED", effects: { coffee: -0.18 } },
  { category: 'agriculture', headline: "BRAZIL COFFEE FROST WORST IN DECADES", effects: { coffee: 0.55, emerging: -0.08 } },
  { category: 'agriculture', headline: "GLOBAL SUPPLY CHAIN MELTDOWN", effects: { coffee: 0.22, nasdaq: -0.12, emerging: -0.30, lithium: -0.15, tesla: -0.18 }, escalates: { categories: ['economic', 'agriculture'], boost: 2.0, duration: 3 } },
  { category: 'agriculture', headline: "SYNTHETIC GOLD CREATED IN LAB", effects: { gold: -0.5, btc: 0.3, altcoins: 0.35, nasdaq: 0.05 } },

  // Black Swan / Disasters
  { category: 'blackswan', headline: "9.2 EARTHQUAKE DEVASTATES SAN FRANCISCO", effects: { nasdaq: -0.35, gold: 0.2, tesla: -0.25 } },
  { category: 'blackswan', headline: "ALIEN SIGNAL CONFIRMED FROM PROXIMA B", effects: { btc: 0.6, altcoins: 0.8, tesla: 0.70, gold: 0.25, defense: 0.3, nasdaq: 0.2 } },
  { category: 'blackswan', headline: "YELLOWSTONE SUPERVOLCANO ERUPTS", effects: { nasdaq: -0.3, gold: 0.4, oil: 0.3, tesla: -0.25 } },
  { category: 'blackswan', headline: "GLOBAL WEALTH TAX TREATY SIGNED", effects: { btc: 0.2, altcoins: 0.25, gold: 0.18 } },
  { category: 'blackswan', headline: "ASTEROID MINING SHIP RETURNS WITH GOLD", effects: { gold: -0.4, btc: 0.25, altcoins: 0.3, nasdaq: 0.15, lithium: 0.2 } },
  { category: 'blackswan', headline: "US GOVERNMENT DEFAULTS ON DEBT", effects: { gold: 0.5, btc: 0.4, altcoins: 0.5, nasdaq: -0.2, tesla: -0.30 } },
]

export const CATEGORY_WEIGHTS: Record<string, number> = {
  fed: 0.16,
  economic: 0.14,
  tech: 0.12,
  energy: 0.12,
  crypto: 0.10,
  tesla: 0.10,
  agriculture: 0.08,
  geopolitical: 0.08,
  biotech: 0.05,
  ev: 0.05,
  blackswan: 0.02,
}

export const QUIET_NEWS = [
  'MARKETS TRADE SIDEWAYS',
  'LIGHT VOLUME SESSION',
  'TRADERS AWAIT CATALYST',
  'MIXED SIGNALS FROM FUTURES',
  'WALL ST HOLDS STEADY',
  'VOLATILITY INDEX DROPS',
  'MARKET DIGESTS RECENT MOVES',
  'INSTITUTIONS REBALANCING',
  'ALGO TRADERS DOMINATE VOLUME',
  'RETAIL SENTIMENT NEUTRAL',
]

// =============================================================================
// LIFESTYLE ASSET EFFECTS
// Maps event headlines to effects on lifestyle assets (properties, jets, teams)
// Effects are percentage changes (e.g., -0.25 = -25%)
// =============================================================================

export type LifestyleEffects = {
  // Property effects by ID
  miami_condo?: number
  nyc_apartment?: number
  la_mansion?: number
  monaco_villa?: number
  dubai_palace?: number
  // All properties shorthand
  all_properties?: number
  us_properties?: number
  foreign_properties?: number
  // Jet effects
  all_jets?: number
  // Team effects
  all_teams?: number
}

// Map headlines to lifestyle effects
export const LIFESTYLE_EFFECTS: Record<string, LifestyleEffects> = {
  // === HOUSING / ECONOMIC EVENTS ===
  "HOUSING MARKET CRASHES 30%": {
    all_properties: -0.25,
  },
  "RECESSION OFFICIALLY DECLARED": {
    all_properties: -0.15,
    all_jets: -0.20,
    all_teams: -0.10,
  },
  "GDP GROWTH BEATS ALL FORECASTS": {
    all_properties: 0.10,
    all_jets: 0.15,
    all_teams: 0.12,
  },
  "$2 TRILLION STIMULUS APPROVED": {
    all_properties: 0.12,
    all_jets: 0.10,
    all_teams: 0.08,
  },
  "MAJOR BANK DECLARES INSOLVENCY": {
    all_properties: -0.12,
    all_jets: -0.10,
  },
  "UNEMPLOYMENT HITS 15%": {
    all_properties: -0.10,
    all_jets: -0.12,
  },
  "EMERGING MARKETS BOOM": {
    dubai_palace: 0.15,
    all_jets: 0.08,
  },

  // === DISASTER EVENTS ===
  "9.2 EARTHQUAKE DEVASTATES SAN FRANCISCO": {
    la_mansion: -0.35, // Nearby, sympathy fears
    miami_condo: -0.15, // General fear
    nyc_apartment: -0.12,
    // Foreign properties benefit from flight capital
    monaco_villa: 0.08,
    dubai_palace: 0.10,
  },
  "YELLOWSTONE SUPERVOLCANO ERUPTS": {
    us_properties: -0.30,
    monaco_villa: 0.15,
    dubai_palace: 0.20,
    all_jets: -0.15, // Travel disruption
  },

  // === GEOPOLITICAL / WAR EVENTS ===
  "US CIVIL WAR DECLARED": {
    us_properties: -0.40,
    monaco_villa: 0.20,
    dubai_palace: 0.25,
    all_jets: -0.25, // No-fly zones
    all_teams: -0.30, // Sports suspended
  },
  "NATO INVOKES ARTICLE 5": {
    all_properties: -0.08,
    all_jets: -0.10,
  },
  "RUSSIA INVADES NEIGHBORING STATE": {
    monaco_villa: -0.10, // European concerns
    all_jets: -0.08,
  },
  "TAIWAN STRAIT CRISIS ESCALATES": {
    all_properties: -0.05,
    all_jets: -0.12,
  },
  "HISTORIC PEACE ACCORD SIGNED": {
    all_properties: 0.08,
    all_jets: 0.10,
  },

  // === PANDEMIC / HEALTH EVENTS ===
  "WHO DECLARES NEW PANDEMIC": {
    all_properties: -0.20, // Rental income crash
    all_jets: -0.30, // Travel restrictions
    all_teams: -0.25, // No spectators
  },

  // === TECH EVENTS ===
  "GLOBAL INTERNET BLACKOUT - DAY 1": {
    all_teams: -0.20, // Streaming revenue hit
  },
  "AI SINGULARITY ACHIEVED": {
    all_properties: 0.05,
    all_jets: 0.08,
  },

  // === ENERGY EVENTS (affect jets via fuel costs) ===
  "OPEC+ SLASHES OUTPUT 2M BARRELS": {
    all_jets: -0.08,
  },
  "OIL TANKER EXPLODES IN STRAIT OF HORMUZ": {
    all_jets: -0.12,
  },
  "NUCLEAR FUSION BREAKTHROUGH ACHIEVED": {
    all_jets: 0.15, // Cheaper energy future
  },
  "MASSIVE OIL FIELD DISCOVERED IN TURKEY": {
    all_jets: 0.10,
  },

  // === INFLATION / CURRENCY ===
  "INFLATION HITS 40-YEAR HIGH": {
    all_properties: 0.08, // Real assets hedge
  },
  "DOLLAR INDEX CRASHES 5%": {
    foreign_properties: 0.12,
    us_properties: -0.08,
  },
  "DOLLAR SURGES TO 20-YEAR HIGH": {
    foreign_properties: -0.10,
    us_properties: 0.05,
  },

  // === CHINA / EMERGING MARKET ===
  "CHINA DEFAULTS ON SOVEREIGN DEBT": {
    dubai_palace: -0.15, // Wealthy Chinese buyers affected
    all_jets: -0.10,
  },

  // === SPIKE EVENTS (from spikes.ts) ===
  "MIDDLE EAST CONFLICT SHUTS DOWN STRAIT OF HORMUZ": {
    dubai_palace: -0.25, // War zone proximity
    all_jets: -0.20, // Fuel crisis
  },
  "NATO DOUBLES DEFENSE BUDGETS WORLDWIDE": {
    all_properties: -0.05, // War fears
  },
  "ALIEN CONTACT CONFIRMED - DEFENSE STOCKS SURGE": {
    all_properties: 0.10, // Chaos hedge
    all_jets: 0.15, // Escape vehicles
  },
  "FED ANNOUNCES UNLIMITED QE FOREVER": {
    all_properties: 0.15, // Asset inflation
    all_jets: 0.12,
    all_teams: 0.10,
  },
  "TESLA DECLARES BANKRUPTCY - ELON STEPS DOWN": {
    all_jets: -0.08, // Luxury market jitters
  },
}

// Helper to expand shorthand effects to individual asset IDs
export function expandLifestyleEffects(effects: LifestyleEffects): Record<string, number> {
  const expanded: Record<string, number> = {}

  const US_PROPERTIES = ['miami_condo', 'nyc_apartment', 'la_mansion']
  const FOREIGN_PROPERTIES = ['monaco_villa', 'dubai_palace']
  const ALL_PROPERTIES = [...US_PROPERTIES, ...FOREIGN_PROPERTIES]
  const ALL_JETS = ['jet_citation', 'jet_challenger', 'jet_gulfstream', 'jet_global', 'jet_bbj']
  const ALL_TEAMS = ['team_mls', 'team_nhl', 'team_nba', 'team_nfl', 'team_f1', 'team_epl']

  // Apply shorthand effects first
  if (effects.all_properties !== undefined) {
    ALL_PROPERTIES.forEach(id => expanded[id] = effects.all_properties!)
  }
  if (effects.us_properties !== undefined) {
    US_PROPERTIES.forEach(id => expanded[id] = effects.us_properties!)
  }
  if (effects.foreign_properties !== undefined) {
    FOREIGN_PROPERTIES.forEach(id => expanded[id] = effects.foreign_properties!)
  }
  if (effects.all_jets !== undefined) {
    ALL_JETS.forEach(id => expanded[id] = effects.all_jets!)
  }
  if (effects.all_teams !== undefined) {
    ALL_TEAMS.forEach(id => expanded[id] = effects.all_teams!)
  }

  // Apply individual effects (override shorthands)
  if (effects.miami_condo !== undefined) expanded.miami_condo = effects.miami_condo
  if (effects.nyc_apartment !== undefined) expanded.nyc_apartment = effects.nyc_apartment
  if (effects.la_mansion !== undefined) expanded.la_mansion = effects.la_mansion
  if (effects.monaco_villa !== undefined) expanded.monaco_villa = effects.monaco_villa
  if (effects.dubai_palace !== undefined) expanded.dubai_palace = effects.dubai_palace

  return expanded
}
