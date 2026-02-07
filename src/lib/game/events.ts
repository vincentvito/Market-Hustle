import { MarketEvent } from './types'

// =============================================================================
// MARKET EVENTS
// Most events auto-derive sentiment from effects (bullish if all positive,
// bearish if all negative, mixed if both). Only events with explicit
// sentiment/sentimentAssets fields override the auto-derivation.
// =============================================================================

export const EVENTS: MarketEvent[] = [
  // Federal Reserve & Monetary Policy
  // FED events are "bearish" for risk assets when hawkish, "bullish" when dovish
  { category: 'fed', headline: "FED RAISES RATES 50BPS", effects: { nasdaq: -0.18, btc: -0.15, altcoins: -0.22, emerging: -0.14, gold: -0.08 } },
  { category: 'fed', headline: "FED CUTS RATES IN EMERGENCY MOVE", effects: { nasdaq: 0.22, btc: 0.18, altcoins: 0.28, emerging: 0.16, tesla: 0.25, gold: -0.03 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'btc', 'altcoins', 'emerging', 'tesla'], allowsReversal: true },
  { category: 'fed', headline: "INFLATION HITS 40-YEAR HIGH", effects: { gold: 0.18, btc: 0.12, altcoins: 0.18, coffee: 0.12 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'tesla'] },
  { category: 'fed', headline: "DOLLAR INDEX CRASHES 5%", effects: { gold: 0.25, btc: 0.22, altcoins: 0.30, oil: 0.15, emerging: 0.12, coffee: 0.08 }, sentiment: 'bullish', sentimentAssets: ['gold', 'btc', 'altcoins', 'oil', 'emerging', 'coffee'] },
  { category: 'fed', headline: "FED SIGNALS PIVOT TO EASING", effects: { nasdaq: 0.18, gold: 0.08, btc: 0.15, altcoins: 0.22, emerging: 0.1, tesla: 0.15 }, allowsReversal: true },
  { category: 'fed', headline: "TREASURY YIELDS SPIKE TO 7%", effects: { nasdaq: -0.2, emerging: -0.15, gold: -0.10, tesla: -0.18 } },
  { category: 'fed', headline: "DOLLAR SURGES TO 20-YEAR HIGH", effects: { gold: -0.15, btc: -0.1, oil: -0.1, emerging: -0.18, coffee: -0.08 }, sentiment: 'bearish', sentimentAssets: ['gold', 'btc', 'oil', 'emerging', 'coffee'] },

  // Geopolitical & War
  // War/crisis events are "bearish" for risk assets even if defense/gold go up
  // NOTE: Major escalation events (NATO Article 5, US Civil War, Taiwan Crisis, Russia Invasion) moved to stories
  { category: 'geopolitical', headline: "PENTAGON AWARDS $50B CONTRACT", effects: { defense: 0.12 }, escalates: { categories: ['geopolitical'], boost: 1.5, duration: 2 } },
  { category: 'geopolitical', headline: "SUEZ CANAL BLOCKED BY CARGO SHIP", effects: { oil: 0.2, coffee: 0.15 }, sentiment: 'bullish', sentimentAssets: ['oil', 'coffee'], escalates: { categories: ['energy', 'agriculture'], boost: 1.5, duration: 2 } },
  { category: 'geopolitical', headline: "SUEZ CANAL FINALLY CLEARS - GLOBAL SHIPPING RESUMES", effects: { oil: -0.12, coffee: -0.08, nasdaq: 0.05 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'], allowsReversal: true },
  // New realistic sudden geopolitical events
  { category: 'geopolitical', headline: "NORTH KOREA FIRES MISSILE OVER JAPAN", effects: { defense: 0.18, gold: 0.12, nasdaq: -0.08 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'] },
  { category: 'geopolitical', headline: "EMBASSY BOMBING IN MIDDLE EAST", effects: { oil: 0.15, defense: 0.12, gold: 0.10 }, sentiment: 'bearish', sentimentAssets: ['oil'] },
  { category: 'geopolitical', headline: "COUP ATTEMPT IN NATO MEMBER STATE", effects: { defense: 0.15, gold: 0.10, nasdaq: -0.05 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'] },
  { category: 'geopolitical', headline: "BREAKING: KIM JONG UN ASSASSINATED", effects: { defense: 0.30, gold: 0.25, nasdaq: -0.15, emerging: -0.20 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'emerging'], escalates: { categories: ['geopolitical'], boost: 2.0, duration: 3 } },
  { category: 'geopolitical', headline: "SUBMARINE COLLISION IN SOUTH CHINA SEA", effects: { defense: 0.20, gold: 0.12, oil: 0.10, nasdaq: -0.08 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'], escalates: { categories: ['geopolitical'], boost: 1.5, duration: 2 } },
  { category: 'geopolitical', headline: "SWISS NEUTRALITY OFFICIALLY ENDED", effects: { gold: 0.05, defense: 0.15 }, sentiment: 'bullish', sentimentAssets: ['gold', 'defense'] },
  { category: 'geopolitical', headline: "SAUDI ARABIA OPENS EMBASSY IN ISRAEL", effects: { oil: -0.15, defense: -0.08, emerging: 0.18, gold: -0.08 }, sentiment: 'bullish', sentimentAssets: ['emerging'], allowsReversal: true },

  // Economic & Markets
  // Economic crisis events are "bearish" overall even if safe havens go up
  // NOTE: Major economic events (Recession, Bank Insolvency, China Default, Housing Crash, Stimulus) moved to stories
  { category: 'economic', headline: "UNEMPLOYMENT HITS 15%", effects: { tesla: -0.25, gold: 0.15, nasdaq: -0.15 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'tesla'], escalates: { categories: ['economic', 'fed'], boost: 1.5, duration: 2 } },
  // New realistic sudden economic events
  { category: 'economic', headline: "JOBS REPORT SHOCKS - 500K ADDED", effects: { nasdaq: 0.15, tesla: 0.12, emerging: 0.10 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'tesla'] },
  { category: 'economic', headline: "CPI COMES IN HOT - 9.1% ANNUAL", effects: { gold: 0.18, btc: 0.12, nasdaq: -0.12 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'] },
  { category: 'economic', headline: "FLASH CRASH: DOW PLUNGES 1000 POINTS IN MINUTES", effects: { gold: 0.15, nasdaq: -0.20, tesla: -0.18 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'tesla'], allowsReversal: true },
  { category: 'economic', headline: "HEDGE FUND BLOWS UP - MARGIN CALLS SPREAD", effects: { nasdaq: -0.12, gold: 0.10, btc: -0.08 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'btc'], allowsReversal: true },
  { category: 'economic', headline: "CURRENCY CRISIS HITS MAJOR EMERGING MARKET", effects: { emerging: -0.22, gold: 0.12, btc: 0.08 }, sentiment: 'bearish', sentimentAssets: ['emerging'], allowsReversal: true },
  { category: 'economic', headline: "BILLIONAIRES EXODUS - 50 RENOUNCE US CITIZENSHIP", effects: { btc: 0.12, gold: 0.08, emerging: 0.10 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'] },

  // Tech & AI
  // NOTE: AI Singularity and Superconductor moved to stories (need verification process)
  { category: 'tech', headline: "BIG TECH ANTITRUST BREAKUP ORDERED", effects: { nasdaq: -0.25, tesla: -0.15 }, allowsReversal: true },
  { category: 'tech', headline: "MASSIVE DATA BREACH HITS 500M USERS", effects: { nasdaq: -0.15, btc: 0.1, altcoins: 0.12 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'], allowsReversal: true },
  { category: 'tech', headline: "SILICON VALLEY LAYOFFS HIT 100,000", effects: { nasdaq: -0.2, tesla: -0.12 }, allowsReversal: true },
  { category: 'tech', headline: "TECH WORKERS FLOOD JOB MARKET - WAGES DROP 15%", effects: { nasdaq: -0.08, emerging: 0.05 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'], allowsReversal: true },
  { category: 'tech', headline: "NVIDIA UNVEILS 100X AI CHIP", effects: { nasdaq: 0.3, lithium: 0.18, tesla: 0.15 } },
  // New realistic sudden tech events
  { category: 'tech', headline: "MAJOR AI MODEL UNEXPECTEDLY RELEASED", effects: { nasdaq: 0.18, tesla: 0.12 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'tesla'] },
  { category: 'tech', headline: "ANTITRUST SETTLEMENT - BIG TECH PAYS $50B FINE", effects: { nasdaq: -0.10 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'], allowsReversal: true },
  { category: 'tech', headline: "APPLE EXITS CHINA MANUFACTURING", effects: { nasdaq: -0.10, emerging: -0.15, lithium: 0.08 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'emerging'] },
  { category: 'tech', headline: "AMAZON INTRODUCES 5 MINUTE DELIVERIES", effects: { nasdaq: 0.10, emerging: -0.15 }, sentiment: 'mixed', sentimentAssets: ['nasdaq', 'emerging'] },

  // Crypto
  // Crypto events explicitly target btc/altcoins sentiment
  { category: 'crypto', headline: "MAJOR EXCHANGE FILES BANKRUPTCY", effects: { btc: -0.35, altcoins: -0.5, nasdaq: -0.08 }, sentiment: 'bearish', sentimentAssets: ['btc', 'altcoins'], allowsReversal: true },
  { category: 'crypto', headline: "EL SALVADOR MAKES BTC LEGAL TENDER", effects: { btc: 0.3, altcoins: 0.4, nasdaq: 0.05 }, sentiment: 'bullish', sentimentAssets: ['btc', 'altcoins'] },
  { category: 'crypto', headline: "SEC APPROVES SPOT BITCOIN ETF", effects: { btc: 0.4, altcoins: 0.5, nasdaq: 0.12 }, sentiment: 'bullish', sentimentAssets: ['btc', 'altcoins'] },
  { category: 'crypto', headline: "CHINA BANS CRYPTO FOR 47TH TIME", effects: { btc: -0.05, altcoins: -0.08, nasdaq: -0.02 }, sentiment: 'bearish', sentimentAssets: ['btc', 'altcoins'], allowsReversal: true },
  { category: 'crypto', headline: "ELON SHITPOSTS DOGE MEME AT 3AM", effects: { btc: 0.08, altcoins: 0.18, tesla: 0.12, nasdaq: 0.03 }, sentiment: 'bullish', sentimentAssets: ['btc', 'altcoins'] },
  { category: 'crypto', headline: "BITCOIN HALVING COMPLETES", effects: { btc: 0.25, altcoins: 0.35 }, sentiment: 'bullish', sentimentAssets: ['btc', 'altcoins'] },
  { category: 'crypto', headline: "CRYPTO: ALTCOIN SEASON OFFICIALLY BEGINS", effects: { altcoins: 0.6, btc: 0.1 }, sentiment: 'bullish', sentimentAssets: ['btc', 'altcoins'] },
  { category: 'crypto', headline: "WHALE DUMPS 10,000 BTC", effects: { btc: -0.25, altcoins: -0.35 }, sentiment: 'bearish', sentimentAssets: ['btc', 'altcoins'], allowsReversal: true },
  { category: 'crypto', headline: "DEFI PROTOCOL HACKED FOR $2B", effects: { btc: -0.15, altcoins: -0.4, nasdaq: -0.04 }, sentiment: 'bearish', sentimentAssets: ['btc', 'altcoins'], allowsReversal: true },

  // Tesla & EV
  // Tesla events explicitly target tesla sentiment to prevent whiplash
  { category: 'tesla', headline: "TESLA REPORTS RECORD DELIVERIES", effects: { tesla: 0.35, lithium: 0.15, nasdaq: 0.08 }, sentiment: 'bullish', sentimentAssets: ['tesla'] },
  { category: 'tesla', headline: "TESLA MISSES DELIVERY GUIDANCE BY 20%", effects: { tesla: -0.30, lithium: -0.12, nasdaq: -0.05 }, sentiment: 'bearish', sentimentAssets: ['tesla'], allowsReversal: true },
  // Robotaxi event removed - covered by tesla_robotaxi chain and tesla_robotaxi_revolution spike
  { category: 'tesla', headline: "TESLA CYBERTRUCK RECALL - BRAKE FAILURE", effects: { tesla: -0.25, nasdaq: -0.05 }, sentiment: 'bearish', sentimentAssets: ['tesla'], allowsReversal: true },
  { category: 'tesla', headline: "OPTIMUS ROBOT ENTERS MASS PRODUCTION", effects: { tesla: 0.38, nasdaq: 0.12, lithium: 0.18 }, sentiment: 'bullish', sentimentAssets: ['tesla'] },
  { category: 'tesla', headline: "TESLA FSD CAUSES FATAL ACCIDENT", effects: { tesla: -0.35, nasdaq: -0.08 }, sentiment: 'bearish', sentimentAssets: ['tesla'], allowsReversal: true },
  { category: 'tesla', headline: "ELON SELLS $5B IN TSLA SHARES", effects: { tesla: -0.10, nasdaq: -0.02 }, sentiment: 'bearish', sentimentAssets: ['tesla'], allowsReversal: true },
  { category: 'tesla', headline: "TESLA STOCK ADDED TO DOW JONES", effects: { tesla: 0.30, nasdaq: 0.10 }, sentiment: 'bullish', sentimentAssets: ['tesla'] },
  { category: 'tesla', headline: "BYD OVERTAKES TESLA IN GLOBAL SALES", effects: { tesla: -0.22, emerging: 0.15, lithium: 0.08 }, sentiment: 'bearish', sentimentAssets: ['tesla'], allowsReversal: true },
  { category: 'tesla', headline: "TESLA UNVEILS $25K MODEL FOR MASSES", effects: { tesla: 0.40, lithium: 0.25, oil: -0.12, nasdaq: 0.10 }, sentiment: 'bullish', sentimentAssets: ['tesla'] },
  { category: 'tesla', headline: "HERTZ CANCELS MASSIVE TESLA ORDER", effects: { tesla: -0.18, nasdaq: -0.03 }, sentiment: 'bearish', sentimentAssets: ['tesla'], allowsReversal: true },
  { category: 'tesla', headline: "TESLA ENERGY WINS $10B GRID CONTRACT", effects: { tesla: 0.28, lithium: 0.15 }, sentiment: 'bullish', sentimentAssets: ['tesla'] },

  // Biotech & Health
  // Pandemic is bearish for economy even if biotech benefits
  { category: 'biotech', headline: "BREAKING: WHO DECLARES NEW PANDEMIC", effects: { biotech: 0.4, oil: -0.25, gold: 0.18, nasdaq: -0.1, emerging: -0.2 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'emerging', 'oil'], escalates: { categories: ['biotech', 'economic'], boost: 2.5, duration: 4 } },
  { category: 'biotech', headline: "CANCER CURE ENTERS PHASE 3 TRIALS", effects: { biotech: 0.45, nasdaq: 0.05 }, sentiment: 'bullish', sentimentAssets: ['biotech'], escalates: { categories: ['biotech'], boost: 1.5, duration: 2 } },
  { category: 'biotech', headline: "FDA REJECTS BLOCKBUSTER DRUG", effects: { biotech: -0.35 }, sentiment: 'bearish', sentimentAssets: ['biotech'], allowsReversal: true },
  { category: 'biotech', headline: "MRNA VACCINE FOR HIV SHOWS PROMISE", effects: { biotech: 0.35, nasdaq: 0.1 }, sentiment: 'bullish', sentimentAssets: ['biotech'], escalates: { categories: ['biotech'], boost: 1.5, duration: 2 } },
  { category: 'biotech', headline: "AGING REVERSED IN HUMAN TRIALS", effects: { biotech: 0.5, nasdaq: 0.15 }, sentiment: 'bullish', sentimentAssets: ['biotech'], escalates: { categories: ['biotech', 'tech'], boost: 2.0, duration: 3 } },
  { category: 'biotech', headline: "OZEMPIC CAUSES HEART ATTACKS - MASS RECALL", effects: { biotech: -0.30, nasdaq: -0.08 }, sentiment: 'bearish', sentimentAssets: ['biotech', 'nasdaq'], allowsReversal: true },
  { category: 'biotech', headline: "MALARIA VACCINE 95% EFFECTIVE - WHO APPROVES", effects: { biotech: 0.35, emerging: 0.15 }, sentiment: 'bullish', sentimentAssets: ['biotech', 'emerging'] },

  // Energy
  // NOTE: OPEC major cuts and EU bans moved to stories (need buildup)
  { category: 'energy', headline: "MASSIVE OIL FIELD DISCOVERED IN TURKEY", effects: { oil: -0.28, nasdaq: 0.05 }, sentiment: 'bearish', sentimentAssets: ['oil'], allowsReversal: true },
  { category: 'energy', headline: "NORD STREAM PIPELINE SABOTAGED", effects: { oil: 0.25, gold: 0.1, defense: 0.1 }, sentiment: 'bullish', sentimentAssets: ['oil', 'gold', 'defense'], escalates: { categories: ['geopolitical', 'energy'], boost: 2.5, duration: 3 } },
  { category: 'energy', headline: "NUCLEAR FUSION BREAKTHROUGH ACHIEVED", effects: { uranium: -0.50, oil: -0.35, nasdaq: 0.2, lithium: -0.15, gold: 0.20, tesla: 0.15 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'tesla'], escalates: { categories: ['tech', 'energy'], boost: 2.0, duration: 3 } },
  { category: 'energy', headline: "NUCLEAR RENAISSANCE - 50 PLANTS APPROVED", effects: { uranium: 0.45, oil: -0.12 }, sentiment: 'bullish', sentimentAssets: ['uranium'], escalates: { categories: ['energy'], boost: 1.5, duration: 2 } },
  { category: 'energy', headline: "OIL TANKER EXPLODES IN STRAIT OF HORMUZ", effects: { oil: 0.25, gold: 0.10, defense: 0.10 }, sentiment: 'bullish', sentimentAssets: ['oil', 'gold', 'defense'], escalates: { categories: ['geopolitical', 'energy'], boost: 2.0, duration: 3 } },
  // New realistic sudden energy events
  { category: 'energy', headline: "REFINERY EXPLOSION CUTS US CAPACITY 5%", effects: { oil: 0.18, gold: 0.05 }, sentiment: 'bullish', sentimentAssets: ['oil'] },
  { category: 'energy', headline: "PIPELINE LEAK FORCES EMERGENCY SHUTDOWN", effects: { oil: 0.15 }, sentiment: 'bullish', sentimentAssets: ['oil'] },
  { category: 'energy', headline: "SURPRISE OPEC MEMBER EXITS AGREEMENT", effects: { oil: -0.20 }, sentiment: 'bearish', sentimentAssets: ['oil'], allowsReversal: true },
  { category: 'energy', headline: "OPEC FLOODS MARKET IN RETALIATION - PRICE WAR BEGINS", effects: { oil: -0.30, emerging: -0.15, nasdaq: 0.05 }, sentiment: 'bearish', sentimentAssets: ['oil', 'emerging'], allowsReversal: true },

  // EV & Lithium
  { category: 'ev', headline: "EV SALES SURPASS GAS VEHICLES", effects: { lithium: 0.4, nasdaq: 0.15, oil: -0.15, tesla: 0.25 }, sentiment: 'bullish', sentimentAssets: ['lithium', 'tesla'] },
  { category: 'ev', headline: "CHILEAN LITHIUM MINE DISASTER", effects: { lithium: 0.35, tesla: -0.10 }, sentiment: 'mixed', sentimentAssets: ['lithium', 'tesla'] },
  { category: 'ev', headline: "RIVIAN DECLARES CHAPTER 11", effects: { lithium: -0.25, nasdaq: -0.12, tesla: 0.15 }, sentiment: 'bearish', sentimentAssets: ['lithium', 'nasdaq'], allowsReversal: true },
  { category: 'ev', headline: "CHINA CORNERS LITHIUM SUPPLY", effects: { lithium: 0.45, emerging: -0.1, nasdaq: -0.08, tesla: -0.15 }, sentiment: 'mixed', sentimentAssets: ['lithium', 'tesla', 'emerging', 'nasdaq'] },
  { category: 'ev', headline: "TOYOTA UNVEILS 1000-MILE EV", effects: { lithium: 0.25, nasdaq: 0.12, oil: -0.1, tesla: -0.12 }, sentiment: 'bearish', sentimentAssets: ['tesla'] },

  // Agriculture & Commodities
  { category: 'agriculture', headline: "WORST DROUGHT IN 500 YEARS", effects: { coffee: 0.55, gold: 0.12 }, sentiment: 'bullish', sentimentAssets: ['coffee', 'gold'] },
  { category: 'agriculture', headline: "LOCUST PLAGUE DEVASTATES AFRICA", effects: { coffee: 0.25, emerging: -0.1 }, sentiment: 'mixed', sentimentAssets: ['coffee', 'emerging'] },
  { category: 'agriculture', headline: "RECORD GLOBAL HARVEST REPORTED", effects: { coffee: -0.18 }, sentiment: 'bullish', sentimentAssets: ['coffee'], allowsReversal: true },
  { category: 'agriculture', headline: "BRAZIL COFFEE FROST WORST IN DECADES", effects: { coffee: 0.35, emerging: -0.08 }, sentiment: 'mixed', sentimentAssets: ['coffee', 'emerging'] },
  { category: 'agriculture', headline: "GLOBAL SUPPLY CHAIN MELTDOWN - SHORTAGES SPREAD", effects: { coffee: 0.22, nasdaq: -0.12, emerging: -0.30, lithium: -0.15, tesla: -0.18 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'emerging', 'tesla'], escalates: { categories: ['economic', 'agriculture'], boost: 2.0, duration: 3 } },
  { category: 'agriculture', headline: "SYNTHETIC GOLD CREATED IN LAB", effects: { gold: -0.75, btc: 0.40, altcoins: 0.45, nasdaq: 0.08 }, sentiment: 'bearish', sentimentAssets: ['gold'] },
  { category: 'agriculture', headline: "FERTILIZER SHORTAGE HITS GLOBAL FARMS", effects: { coffee: 0.30, emerging: -0.12 }, sentiment: 'mixed', sentimentAssets: ['coffee', 'emerging'] },

  // Black Swan / Disasters
  { category: 'blackswan', headline: "BREAKING: 9.2 EARTHQUAKE DEVASTATES SAN FRANCISCO", effects: { nasdaq: -0.35, gold: 0.2, tesla: -0.25 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'tesla'] },
  { category: 'blackswan', headline: "BREAKING: ALIEN SIGNAL CONFIRMED FROM PROXIMA B", effects: { gold: 0.40, defense: 0.50, btc: 0.15, altcoins: 0.10, nasdaq: -0.30, tesla: -0.15 }, sentiment: 'mixed', sentimentAssets: ['gold', 'defense', 'btc', 'altcoins', 'nasdaq', 'tesla'] },
  { category: 'blackswan', headline: "GLOBAL WEALTH TAX TREATY SIGNED", effects: { btc: 0.2, altcoins: 0.25, gold: 0.18 }, sentiment: 'bullish', sentimentAssets: ['btc', 'altcoins', 'gold'] },
  { category: 'blackswan', headline: "ASTEROID MINING SHIP RETURNS WITH GOLD", effects: { gold: -0.4, btc: 0.25, altcoins: 0.3, nasdaq: 0.15, lithium: 0.2 }, sentiment: 'bearish', sentimentAssets: ['gold'] },
  { category: 'blackswan', headline: "BREAKING: US GOVERNMENT DEFAULTS ON DEBT", effects: { gold: 0.5, btc: 0.4, altcoins: 0.5, nasdaq: -0.2, tesla: -0.30 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'tesla'] },

  // =============================================================================
  // NEW BRIDGE EVENTS - Second-Order Effects Categories
  // These events naturally follow high-impact events to create narrative arcs
  // =============================================================================

  // Regulatory Events (8) - Government responses to crises
  { category: 'regulatory', headline: "SEC ANNOUNCES EMERGENCY TRADING RULES", effects: { nasdaq: -0.03 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'] },
  { category: 'regulatory', headline: "CONGRESS HOLDS EMERGENCY MARKET HEARINGS", effects: { nasdaq: -0.02 }, sentiment: 'neutral' },
  { category: 'regulatory', headline: "UN SECURITY COUNCIL EMERGENCY SESSION", effects: { defense: 0.05, gold: 0.03 }, sentiment: 'neutral' },
  { category: 'regulatory', headline: "G7 ANNOUNCES COORDINATED MARKET RESPONSE", effects: { nasdaq: 0.05, emerging: 0.08 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'emerging'], allowsReversal: true },
  { category: 'regulatory', headline: "FTC LAUNCHES MAJOR ANTITRUST PROBE", effects: { nasdaq: -0.08 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'] },
  { category: 'regulatory', headline: "COMPREHENSIVE CRYPTO FRAMEWORK PROPOSED", effects: { btc: -0.05, altcoins: -0.08 }, sentiment: 'bearish', sentimentAssets: ['btc', 'altcoins'] },
  { category: 'regulatory', headline: "FDA FAST-TRACKS EMERGENCY APPROVALS", effects: { biotech: 0.15 }, sentiment: 'bullish', sentimentAssets: ['biotech'] },
  { category: 'regulatory', headline: "EPA RELAXES ENERGY DRILLING RESTRICTIONS", effects: { oil: 0.10 }, sentiment: 'bullish', sentimentAssets: ['oil'] },

  // Transportation Events (7) - Shipping, airlines, logistics
  { category: 'transportation', headline: "GLOBAL SHIPPING RATES SPIKE 40%", effects: { oil: 0.08, nasdaq: -0.05, emerging: -0.06 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'emerging'] },
  { category: 'transportation', headline: "MAJOR AIRLINE CANCELS 30% OF FLIGHTS", effects: { oil: -0.05, nasdaq: -0.03 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'] },
  { category: 'transportation', headline: "PORT CONGESTION FINALLY EASES NATIONWIDE", effects: { nasdaq: 0.05, emerging: 0.04 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'], allowsReversal: true },
  { category: 'transportation', headline: "NATIONWIDE TRUCKING STRIKE DISRUPTS SUPPLY", effects: { nasdaq: -0.08, oil: 0.05, coffee: 0.10 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'] },
  { category: 'transportation', headline: "RAILROADS REPORT RECORD CARGO VOLUME", effects: { nasdaq: 0.03 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'] },
  { category: 'transportation', headline: "GLOBAL CONTAINER SHORTAGE WORSENS", effects: { nasdaq: -0.05, emerging: -0.08 }, sentiment: 'bearish', sentimentAssets: ['nasdaq', 'emerging'] },
  { category: 'transportation', headline: "AIRLINES POST RECORD QUARTERLY PROFITS", effects: { nasdaq: 0.05, oil: 0.03 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'] },

  // Banking Events (7) - Financial sector
  { category: 'banking', headline: "MAJOR BANKS PASS FED STRESS TESTS", effects: { nasdaq: 0.05 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'] },
  { category: 'banking', headline: "REGIONAL BANK REPORTS MASSIVE DEPOSIT FLIGHT", effects: { nasdaq: -0.08, gold: 0.05 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'], allowsReversal: true },
  { category: 'banking', headline: "JPMORGAN RAISES DIVIDEND 20%", effects: { nasdaq: 0.05 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'] },
  { category: 'banking', headline: "MORTGAGE RATES HIT 8% - HOUSING COOLS", effects: { nasdaq: -0.05 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'] },
  { category: 'banking', headline: "BANKING SECTOR LEADS MARKET RALLY", effects: { nasdaq: 0.08 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'], allowsReversal: true },
  { category: 'banking', headline: "CREDIT CARD DELINQUENCIES HIT 10-YEAR HIGH", effects: { nasdaq: -0.05 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'] },
  { category: 'banking', headline: "FDIC ANNOUNCES INCREASED DEPOSIT COVERAGE", effects: { nasdaq: 0.03 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'], allowsReversal: true },

  // Insurance Events (5) - Disaster aftermath
  { category: 'insurance', headline: "INSURERS PULL OUT OF DISASTER-PRONE ZONES", effects: { nasdaq: -0.03 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'] },
  { category: 'insurance', headline: "REINSURANCE RATES SPIKE AFTER CATASTROPHE", effects: { nasdaq: -0.02 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'] },
  { category: 'insurance', headline: "DISASTER INSURANCE CLAIMS REACH $50 BILLION", effects: { nasdaq: -0.05 }, sentiment: 'bearish', sentimentAssets: ['nasdaq'] },
  { category: 'insurance', headline: "MAJOR INSURERS REPORT STRONG RESERVES", effects: { nasdaq: 0.03 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'] },
  { category: 'insurance', headline: "CYBER INSURANCE PREMIUMS DOUBLE INDUSTRYWIDE", effects: { nasdaq: -0.02 }, sentiment: 'neutral' },

  // Recovery Events (8) - Market stabilization
  { category: 'recovery', headline: "MARKETS STABILIZE ON DIPLOMATIC PROGRESS", effects: { nasdaq: 0.04, emerging: 0.05 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'emerging'], allowsReversal: true },
  { category: 'recovery', headline: "BARGAIN HUNTERS EMERGE AS MARKETS FIND FLOOR", effects: { nasdaq: 0.06 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'], allowsReversal: true },
  { category: 'recovery', headline: "VIX DROPS TO 3-MONTH LOW", effects: { nasdaq: 0.03 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'] },
  { category: 'recovery', headline: "INSTITUTIONAL BUYING RESUMES IN FORCE", effects: { nasdaq: 0.04, btc: 0.03 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'btc'], allowsReversal: true },
  { category: 'recovery', headline: "CRISIS FEARS OVERBLOWN, TOP ANALYSTS SAY", effects: { nasdaq: 0.03 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'], allowsReversal: true },
  { category: 'recovery', headline: "MARKET BREADTH IMPROVES SIGNIFICANTLY", effects: { nasdaq: 0.03, emerging: 0.04 }, sentiment: 'bullish', sentimentAssets: ['nasdaq', 'emerging'] },
  { category: 'recovery', headline: "SHORTS SQUEEZED AS PANIC SUBSIDES", effects: { nasdaq: 0.05 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'], allowsReversal: true },
  { category: 'recovery', headline: "VOLATILITY SELLERS RETURN TO MARKET", effects: { nasdaq: 0.02 }, sentiment: 'bullish', sentimentAssets: ['nasdaq'] },

  // Defense Events (6) - Expanding defense category for geopolitical ripples
  { category: 'geopolitical', headline: "NATO ANNOUNCES MAJOR JOINT EXERCISES", effects: { defense: 0.12, oil: 0.05 }, sentiment: 'neutral' },
  { category: 'geopolitical', headline: "PENTAGON BUDGET INCREASED 15%", effects: { defense: 0.20, nasdaq: -0.03 }, sentiment: 'neutral' },
  { category: 'geopolitical', headline: "LOCKHEED WINS $40B FIGHTER CONTRACT", effects: { defense: 0.10 }, sentiment: 'bullish', sentimentAssets: ['defense'] },
  { category: 'geopolitical', headline: "CYBER COMMAND FUNDING DOUBLED", effects: { defense: 0.15, nasdaq: 0.05 }, sentiment: 'bullish', sentimentAssets: ['defense', 'nasdaq'] },
  { category: 'geopolitical', headline: "DEFENSE STOCKS HIT ALL-TIME HIGHS", effects: { defense: 0.10, nasdaq: 0.03 }, sentiment: 'bullish', sentimentAssets: ['defense'] },
  { category: 'geopolitical', headline: "ARMS SALES TO ALLIES SURGE 50%", effects: { defense: 0.15 }, sentiment: 'bullish', sentimentAssets: ['defense'] },
]

export const CATEGORY_WEIGHTS: Record<string, number> = {
  // Core categories (adjusted weights to accommodate new categories)
  // Total weights must sum to 1.0
  fed: 0.11,            // Federal Reserve events
  economic: 0.12,       // Economic indicators
  tech: 0.10,           // Technology sector
  energy: 0.10,         // Energy/oil sector
  crypto: 0.08,         // Cryptocurrency
  tesla: 0.08,          // Tesla-specific
  geopolitical: 0.07,   // Global politics
  agriculture: 0.06,    // Agriculture/commodities
  biotech: 0.04,        // Biotechnology
  ev: 0.04,             // Electric vehicles
  blackswan: 0.02,      // Rare extreme events

  // New categories for second-order effects (narrative bridges)
  regulatory: 0.05,     // Government responses to crises
  transportation: 0.04, // Shipping, airlines, logistics
  banking: 0.04,        // Financial sector events
  recovery: 0.03,       // Market stabilization events
  insurance: 0.02,      // Disaster aftermath
  // Total: 1.00
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
  pe_blue_chip?: number        // Sal's Corner, Iron Oak Brewing, Tenuta della Luna
  pe_growth?: number           // Blackstone, Lazarus Genomics, Apex Media

  // Individual PE assets (7 total)
  pe_sals_corner?: number
  pe_iron_oak_brewing?: number
  pe_tenuta_luna?: number
  pe_vegas_casino?: number
  pe_blackstone_services?: number
  pe_lazarus_genomics?: number
  pe_apex_media?: number
}

// Map headlines to lifestyle effects
// 7 PE assets: Sal's Corner, Iron Oak Brewing, Tenuta della Luna, Vegas Casino (blue chip)
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
  "CHINA DEFAULTS ON SOVEREIGN DEBT - GLOBAL PANIC": {
    all_properties: -0.10,
    dubai_palace: -0.20, // Emerging market exposure
  },
  "UNEMPLOYMENT HITS 15%": {
    all_properties: -0.10,
    pe_blue_chip: -0.15, // Small businesses hurt
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

  // === PANDEMIC / HEALTH EVENTS ===
  "WHO DECLARES NEW PANDEMIC": {
    all_properties: -0.20, // Rental income crash
    pe_sals_corner: -0.30, // Restaurant crushed
    pe_iron_oak_brewing: -0.25, // Brewery taprooms closed
    pe_apex_media: 0.15, // News consumption up
  },

  // === TECH EVENTS (from stories) ===
  "AGI DEPLOYED ACROSS MAJOR CORPORATIONS": {
    all_properties: 0.05,
    pe_apex_media: 0.15, // AI content generation
  },
  "ROOM-TEMP SUPERCONDUCTOR CONFIRMED - ENERGY REVOLUTION BEGINS": {
    rockefeller_center: 0.10, // Cheaper operations
  },

  // === ENERGY EVENTS ===
  "NUCLEAR FUSION BREAKTHROUGH ACHIEVED": {
    rockefeller_center: 0.12, // Cheaper energy future
  },

  // === INFLATION / CURRENCY ===
  "INFLATION HITS 40-YEAR HIGH": {
    all_properties: 0.08, // Real assets hedge
    pe_tenuta_luna: 0.12, // Luxury wine appreciates
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
  },

  // === SPIKE EVENTS ===
  "MIDDLE EAST CONFLICT SHUTS DOWN STRAIT OF HORMUZ": {
    dubai_palace: -0.25, // War zone proximity
    pe_blackstone_services: 0.20, // PMC contracts
  },
  "NATO DOUBLES DEFENSE BUDGETS WORLDWIDE": {
    all_properties: -0.05, // War fears
    pe_blackstone_services: 0.35, // Defense contracts boom
  },
  "ALIEN CONTACT CONFIRMED - DEFENSE STOCKS SURGE": {
    all_properties: 0.10, // Chaos hedge
    pe_blackstone_services: 0.25, // Defense spending up
    pe_apex_media: 0.30, // News viewership explodes
  },
  "FED ANNOUNCES UNLIMITED QE FOREVER": {
    all_properties: 0.15, // Asset inflation
    all_private_equity: 0.12,
  },

  // === JOBS / ECONOMIC GROWTH ===
  "JOBS REPORT SHOCKS - 500K ADDED": {
    pe_sals_corner: 0.10, // More dining out
    pe_iron_oak_brewing: 0.08, // Craft beer consumption up
    rockefeller_center: 0.05, // Business expansion
  },

  // === AGRICULTURE EVENTS ===
  "WORST DROUGHT IN 500 YEARS": {
    pe_tenuta_luna: -0.30, // Vineyard affected
  },

  // === TECH LAYOFFS ===
  "SILICON VALLEY LAYOFFS HIT 100,000": {
    rockefeller_center: -0.15, // Less office demand
    pe_sals_corner: -0.05, // Brooklyn less affected than Bay Area
  },

  // === DEFENSE / MILITARY ===
  "PENTAGON AWARDS $50B CONTRACT": {
    pe_blackstone_services: 0.30, // PMC benefits
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

  // Private Equity groupings - 7-asset system (4 blue chip, 3 growth)
  const PE_BLUE_CHIP = ['pe_sals_corner', 'pe_iron_oak_brewing', 'pe_tenuta_luna', 'pe_vegas_casino']
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
