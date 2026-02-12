import type { ScheduledEvent } from './types'

// =============================================================================
// SCHEDULED EVENTS - Calendar-driven market events with 1-day advance notice
// Unlike chains (unexpected rumors) or stories (multi-stage arcs), these are
// known calendar events: Fed speeches, jobs reports, GDP data, earnings.
// Day N: heads-up announcement (small pre-positioning effects)
// Day N+1: resolution with probability-weighted outcomes
// =============================================================================

export const SCHEDULED_EVENTS: ScheduledEvent[] = [
  // ─────────────────────────────────────────────────────────────────
  // FED CHAIR SPEECH
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_fed_speech',
    category: 'fed',
    announcement: {
      headline: 'FED CHAIR SPEECH TOMORROW — MARKETS BRACE FOR GUIDANCE',
      effects: { nasdaq: -0.02, gold: 0.02 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.72, label: 'DOVISH PIVOT', missLabel: 'HAWKISH STANCE' },
    outcomes: [
      {
        headline: 'FED CHAIR DOVISH: SIGNALS RATE CUTS ON HORIZON',
        probability: 0.55,
        effects: { nasdaq: 0.07, btc: 0.06, tesla: 0.06, gold: 0.03, emerging: 0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'btc', 'tesla'],
        allowsReversal: true,
      },
      {
        headline: 'FED CHAIR HAWKISH: HIGHER FOR LONGER',
        probability: 0.45,
        effects: { nasdaq: -0.06, btc: -0.05, tesla: -0.06, gold: 0.04, emerging: -0.04 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'btc', 'tesla'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // FOMC RATE DECISION
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_fomc',
    category: 'fed',
    announcement: {
      headline: 'FOMC MEETING CONCLUDES TOMORROW — RATE DECISION DUE',
      effects: { nasdaq: -0.03, gold: 0.02, btc: -0.02 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.72, label: 'RATE CUT', missLabel: 'SURPRISE HIKE' },
    outcomes: [
      {
        headline: 'FED CUTS RATES 50BPS — RISK ASSETS SURGE',
        probability: 0.50,
        effects: { nasdaq: 0.08, btc: 0.07, altcoins: 0.10, tesla: 0.08, gold: 0.03, emerging: 0.06 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'btc', 'tesla'],
        allowsReversal: true,
      },
      {
        headline: 'FED HOLDS RATES STEADY — NO SURPRISES',
        probability: 0.15,
        effects: { nasdaq: 0.03, gold: 0.01 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'FED SURPRISE HIKE — MARKETS REEL',
        probability: 0.35,
        effects: { nasdaq: -0.08, btc: -0.07, tesla: -0.08, gold: 0.05, emerging: -0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'btc', 'tesla'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // JOBS REPORT
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_jobs',
    category: 'economic',
    announcement: {
      headline: 'NONFARM PAYROLLS DUE TOMORROW — ECONOMISTS SPLIT',
      effects: { nasdaq: -0.01, gold: 0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.65, label: 'STRONG HIRING', missLabel: 'WEAK JOBS' },
    outcomes: [
      {
        headline: 'JOBS REPORT BLOWOUT: 400K ADDED, WAGES UP 5%',
        probability: 0.475,
        effects: { nasdaq: 0.05, oil: 0.04, emerging: 0.04, tesla: 0.03, gold: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq'],
        allowsReversal: true,
      },
      {
        headline: 'JOBS REPORT INLINE — MARKETS SHRUG',
        probability: 0.15,
        effects: { nasdaq: 0.02, btc: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'JOBS REPORT DISASTER: 50K ADDED, UNEMPLOYMENT SPIKES',
        probability: 0.375,
        effects: { nasdaq: -0.06, gold: 0.06, btc: 0.04, tesla: -0.05, emerging: -0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // CPI INFLATION REPORT
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_cpi',
    category: 'economic',
    announcement: {
      headline: 'CPI DATA RELEASE TOMORROW — INFLATION WATCH',
      effects: { gold: 0.02, nasdaq: -0.02 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.64, label: 'COOLING INFLATION', missLabel: 'INFLATION SURGE' },
    outcomes: [
      {
        headline: 'CPI COOLS TO 2.1% — SOFT LANDING NARRATIVE HOLDS',
        probability: 0.475,
        effects: { nasdaq: 0.06, tesla: 0.05, btc: 0.04, gold: -0.05, emerging: 0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla'],
        allowsReversal: true,
      },
      {
        headline: 'CPI INLINE AT 3.2% — NO CHANGE IN OUTLOOK',
        probability: 0.15,
        effects: { nasdaq: 0.02, gold: -0.01, btc: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'CPI SURGES TO 6.8% — STAGFLATION FEARS IGNITE',
        probability: 0.375,
        effects: { gold: 0.08, oil: 0.06, coffee: 0.05, btc: 0.05, nasdaq: -0.07, tesla: -0.07, emerging: -0.06 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla', 'emerging'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // GDP REPORT
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_gdp',
    category: 'economic',
    announcement: {
      headline: 'Q3 GDP REPORT DUE TOMORROW',
      effects: { nasdaq: -0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.62, label: 'STRONG GROWTH', missLabel: 'GDP CONTRACTION' },
    outcomes: [
      {
        headline: 'GDP SURGES 5.2% — ECONOMY BOOMING',
        probability: 0.45,
        effects: { nasdaq: 0.06, emerging: 0.05, oil: 0.04, tesla: 0.04, gold: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging'],
        allowsReversal: true,
      },
      {
        headline: 'GDP CONTRACTS -1.8% — RECESSION FEARS MOUNT',
        probability: 0.55,
        effects: { nasdaq: -0.06, gold: 0.06, btc: 0.03, tesla: -0.05, oil: -0.04, emerging: -0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // BIG TECH EARNINGS SEASON
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_tech_earnings',
    category: 'tech',
    announcement: {
      headline: 'BIG TECH EARNINGS WEEK: MEGA-CAPS REPORT TOMORROW',
      effects: { nasdaq: 0.02 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.68, label: 'EARNINGS BEAT', missLabel: 'EARNINGS MISS' },
    outcomes: [
      {
        headline: 'EARNINGS BLOWOUT: AI REVENUE TRIPLES ACROSS BIG TECH',
        probability: 0.50,
        effects: { nasdaq: 0.08, btc: 0.03, tesla: 0.04, lithium: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq'],
        allowsReversal: true,
      },
      {
        headline: 'EARNINGS MISS: BIG TECH GUIDANCE SLASHED ON AI SPENDING',
        probability: 0.50,
        effects: { nasdaq: -0.08, btc: -0.03, tesla: -0.04, gold: 0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // HOUSING DATA (CASE-SHILLER)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_housing',
    category: 'economic',
    announcement: {
      headline: 'CASE-SHILLER HOME PRICE INDEX DUE TOMORROW',
      effects: { nasdaq: -0.01, gold: 0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.63, label: 'PRICE SURGE', missLabel: 'PRICE CRASH' },
    outcomes: [
      {
        headline: 'HOME PRICES SURGE 12% YOY — HOUSING BOOM ACCELERATES',
        probability: 0.475,
        effects: { nasdaq: 0.06, gold: -0.04, emerging: 0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq'],
        allowsReversal: true,
      },
      {
        headline: 'HOUSING DATA INLINE — PRICES STEADY AT 3% GROWTH',
        probability: 0.15,
        effects: { nasdaq: 0.02, tesla: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'HOME PRICES CRATER -8% — WORST DROP SINCE 2008',
        probability: 0.375,
        effects: { nasdaq: -0.06, gold: 0.05, btc: 0.03, emerging: -0.04 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // CONSUMER CONFIDENCE (MICHIGAN SENTIMENT)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_consumer_confidence',
    category: 'economic',
    announcement: {
      headline: 'MICHIGAN CONSUMER SENTIMENT REPORT TOMORROW',
      effects: { nasdaq: -0.01, oil: 0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.64, label: 'STRONG SENTIMENT', missLabel: 'CONFIDENCE COLLAPSE' },
    outcomes: [
      {
        headline: 'CONSUMER CONFIDENCE HITS 5-YEAR HIGH — SPENDING SURGE EXPECTED',
        probability: 0.475,
        effects: { nasdaq: 0.05, tesla: 0.04, oil: 0.03, emerging: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla'],
        allowsReversal: true,
      },
      {
        headline: 'CONSUMER SENTIMENT FLAT — NO CHANGE IN OUTLOOK',
        probability: 0.15,
        effects: { nasdaq: 0.01, oil: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'CONSUMER CONFIDENCE COLLAPSES TO RECESSION LOWS',
        probability: 0.375,
        effects: { nasdaq: -0.06, tesla: -0.05, oil: -0.04, gold: 0.04 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 10-YEAR TREASURY AUCTION
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_treasury_auction',
    category: 'fed',
    announcement: {
      headline: '10-YEAR TREASURY AUCTION TOMORROW — YIELD WATCH',
      effects: { nasdaq: -0.02, gold: 0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.70, label: 'STRONG DEMAND', missLabel: 'WEAK DEMAND' },
    outcomes: [
      {
        headline: 'TREASURY AUCTION STRONG: YIELDS DROP AS DEMAND SURGES',
        probability: 0.50,
        effects: { nasdaq: 0.06, btc: 0.04, tesla: 0.04, gold: 0.03, emerging: 0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'btc', 'tesla'],
        allowsReversal: true,
      },
      {
        headline: 'TREASURY AUCTION DISASTER: YIELDS SPIKE ON WEAK DEMAND',
        probability: 0.40,
        effects: { nasdaq: -0.07, btc: -0.04, tesla: -0.05, gold: 0.05, emerging: -0.05 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'btc', 'tesla'],
        allowsReversal: true,
      },
      {
        headline: 'TREASURY AUCTION MIXED — YIELDS HOLD STEADY',
        probability: 0.10,
        effects: { nasdaq: 0.02, emerging: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // SEMICONDUCTOR EXPORT BAN REVIEW
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_chip_export',
    category: 'tech',
    announcement: {
      headline: 'WHITE HOUSE CHIP EXPORT REVIEW RESULTS DUE TOMORROW',
      effects: { nasdaq: -0.02, emerging: -0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.63, label: 'RESTRICTIONS EASED', missLabel: 'NEW EXPORT BAN' },
    outcomes: [
      {
        headline: 'CHIP EXPORT RESTRICTIONS EASED — TECH SUPPLY CHAIN RELIEF',
        probability: 0.465,
        effects: { nasdaq: 0.07, tesla: 0.05, lithium: 0.04, emerging: 0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla'],
        allowsReversal: true,
      },
      {
        headline: 'NEW CHIP EXPORT BAN ON CHINA — TECH COLD WAR ESCALATES',
        probability: 0.415,
        effects: { nasdaq: -0.06, tesla: -0.05, lithium: -0.05, emerging: -0.06, gold: 0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla', 'emerging'],
        allowsReversal: true,
      },
      {
        headline: 'CHIP EXPORT REVIEW EXTENDS STATUS QUO — NO CHANGES',
        probability: 0.12,
        effects: { nasdaq: 0.02, emerging: 0.01, btc: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // MONTHLY AUTO SALES REPORT
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_auto_sales',
    category: 'economic',
    announcement: {
      headline: 'MONTHLY AUTO SALES DATA DUE TOMORROW — EV SHARE IN FOCUS',
      effects: { tesla: 0.02, lithium: 0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.68, label: 'RECORD EV SALES', missLabel: 'SALES COLLAPSE' },
    outcomes: [
      {
        headline: 'EV SHARE HITS ALL-TIME RECORD — LEGACY AUTO IN FREEFALL',
        probability: 0.515,
        effects: { tesla: 0.08, lithium: 0.06, nasdaq: 0.03, oil: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['tesla', 'lithium'],
        allowsReversal: true,
      },
      {
        headline: 'AUTO SALES FLAT — EV GROWTH STALLS ON AFFORDABILITY',
        probability: 0.12,
        effects: { tesla: 0.02, lithium: 0.01, oil: 0.03 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'AUTO SALES COLLAPSE — CONSUMERS STOP BUYING CARS',
        probability: 0.365,
        effects: { tesla: -0.07, lithium: -0.06, oil: 0.04, nasdaq: -0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['tesla', 'lithium'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // UN CLIMATE SUMMIT
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_climate_summit',
    category: 'commodity',
    announcement: {
      headline: 'UN CLIMATE SUMMIT FINAL SESSION TOMORROW — CARBON DEAL IN PLAY',
      effects: { oil: -0.02, uranium: 0.02 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.61, label: 'CARBON TAX DEAL', missLabel: 'TALKS COLLAPSE' },
    outcomes: [
      {
        headline: 'BINDING GLOBAL CARBON TAX PASSED — FOSSIL FUELS CRUSHED',
        probability: 0.475,
        effects: { oil: -0.07, uranium: 0.08, lithium: 0.06, tesla: 0.06, coffee: -0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['oil'],
        allowsReversal: true,
      },
      {
        headline: 'CLIMATE SUMMIT DELIVERS WATERED-DOWN PLEDGE — MARKETS SHRUG',
        probability: 0.15,
        effects: { oil: 0.02, uranium: 0.02, gold: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'CLIMATE TALKS COLLAPSE — NO DEAL REACHED',
        probability: 0.375,
        effects: { oil: 0.05, uranium: -0.04, lithium: -0.04, tesla: -0.04, gold: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['oil'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // SEC CRYPTO REGULATORY HEARING
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_sec_crypto',
    category: 'crypto',
    announcement: {
      headline: 'SEC CRYPTO ENFORCEMENT HEARING TOMORROW — EXCHANGES ON ALERT',
      effects: { btc: -0.02, altcoins: -0.03 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.55, label: 'PRO-CRYPTO RULING', missLabel: 'CRYPTO CRACKDOWN' },
    outcomes: [
      {
        headline: 'SEC DROPS ENFORCEMENT CASES — CRYPTO CLEARED FOR TAKEOFF',
        probability: 0.35,
        effects: { btc: 0.08, altcoins: 0.12, nasdaq: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['btc', 'altcoins'],
        allowsReversal: true,
      },
      {
        headline: 'SEC ANNOUNCES NEW CRYPTO FRAMEWORK — CLARITY AT LAST',
        probability: 0.35,
        effects: { btc: 0.05, altcoins: 0.04, nasdaq: 0.02 },
        sentiment: 'bullish',
        sentimentAssets: ['btc', 'altcoins'],
        allowsReversal: true,
      },
      {
        headline: 'SEC CLASSIFIES ALL ALTCOINS AS SECURITIES — MASS DELISTINGS BEGIN',
        probability: 0.30,
        effects: { altcoins: -0.14, btc: -0.05, nasdaq: -0.02 },
        sentiment: 'bearish',
        sentimentAssets: ['btc', 'altcoins'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // USDA CROP REPORT
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_usda_crop',
    category: 'commodity',
    announcement: {
      headline: 'USDA WORLD CROP PRODUCTION REPORT DUE TOMORROW',
      effects: { coffee: -0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.62, label: 'CROP SHORTFALL', missLabel: 'RECORD YIELDS' },
    outcomes: [
      {
        headline: 'USDA REPORT: GLOBAL CROP SHORTFALL — FOOD PRICES TO SURGE',
        probability: 0.45,
        effects: { coffee: 0.08, gold: 0.04, emerging: -0.04, nasdaq: -0.02 },
        sentiment: 'bullish',
        sentimentAssets: ['coffee'],
        allowsReversal: true,
      },
      {
        headline: 'USDA REPORT: PRODUCTION INLINE — NO SURPRISES',
        probability: 0.15,
        effects: { coffee: 0.02, emerging: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'USDA REPORT: RECORD GLOBAL YIELDS — SURPLUS OVERWHELMS MARKET',
        probability: 0.40,
        effects: { coffee: -0.08, emerging: 0.04, gold: -0.02 },
        sentiment: 'bearish',
        sentimentAssets: ['coffee'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // CHINA PMI RELEASE
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_china_pmi',
    category: 'economic',
    announcement: {
      headline: 'CHINA MANUFACTURING PMI DATA DUE TOMORROW — GROWTH FEARS LINGER',
      effects: { emerging: -0.01, lithium: -0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.63, label: 'MANUFACTURING BOOM', missLabel: 'HARD LANDING' },
    outcomes: [
      {
        headline: 'CHINA PMI SURGES TO 56 — MANUFACTURING BOOM CONFIRMED',
        probability: 0.45,
        effects: { emerging: 0.07, lithium: 0.06, oil: 0.04, nasdaq: 0.03, tesla: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['emerging', 'lithium'],
        allowsReversal: true,
      },
      {
        headline: 'CHINA PMI AT 50.1 — ECONOMY FLATLINES',
        probability: 0.15,
        effects: { emerging: 0.02, lithium: 0.01, gold: 0.02 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'CHINA PMI CRASHES TO 42 — HARD LANDING FEARS GRIP MARKETS',
        probability: 0.40,
        effects: { emerging: -0.08, lithium: -0.07, oil: -0.04, nasdaq: -0.04, tesla: -0.04 },
        sentiment: 'bearish',
        sentimentAssets: ['emerging', 'lithium'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // TESLA EARNINGS CALL
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_tesla_earnings',
    category: 'tesla',
    announcement: {
      headline: 'TESLA EARNINGS CALL TOMORROW — DELIVERY NUMBERS IN FOCUS',
      effects: { tesla: 0.02, lithium: 0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.66, label: 'EARNINGS BEAT', missLabel: 'EARNINGS MISS' },
    outcomes: [
      {
        headline: 'TESLA CRUSHES EARNINGS: RECORD MARGINS, ROBOTAXI TIMELINE MOVED UP',
        probability: 0.45,
        effects: { tesla: 0.10, lithium: 0.05, nasdaq: 0.04, oil: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['tesla', 'lithium'],
        allowsReversal: true,
      },
      {
        headline: 'TESLA EARNINGS INLINE — NO SURPRISES, GUIDANCE MAINTAINED',
        probability: 0.15,
        effects: { tesla: 0.02, nasdaq: 0.01 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'TESLA MISSES ON REVENUE: MARGIN COMPRESSION, ELON BLAMES MACRO',
        probability: 0.40,
        effects: { tesla: -0.09, lithium: -0.04, nasdaq: -0.03, oil: 0.02 },
        sentiment: 'bearish',
        sentimentAssets: ['tesla', 'lithium'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // BANK EARNINGS SEASON
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_bank_earnings',
    category: 'economic',
    announcement: {
      headline: 'MAJOR BANK EARNINGS DUE TOMORROW — WALL ST BRACES FOR CREDIT DATA',
      effects: { nasdaq: -0.01, gold: 0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.64, label: 'STRONG PROFITS', missLabel: 'CREDIT LOSSES' },
    outcomes: [
      {
        headline: 'BANK EARNINGS BLOWOUT: RECORD TRADING REVENUE, LOAN GROWTH SURGES',
        probability: 0.45,
        effects: { nasdaq: 0.06, emerging: 0.04, btc: 0.03, gold: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'emerging'],
        allowsReversal: true,
      },
      {
        headline: 'BANK EARNINGS MIXED — TRADING UP, CONSUMER LENDING FLAT',
        probability: 0.15,
        effects: { nasdaq: 0.02, gold: 0.01 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'BANK EARNINGS DISASTER: MASSIVE LOAN LOSSES, CREDIT CRUNCH FEARS',
        probability: 0.40,
        effects: { nasdaq: -0.07, emerging: -0.05, gold: 0.06, btc: 0.04 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'emerging'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // OIL MAJOR EARNINGS
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_oil_earnings',
    category: 'energy',
    announcement: {
      headline: 'OIL MAJORS REPORT EARNINGS TOMORROW — CAPEX GUIDANCE IN FOCUS',
      effects: { oil: 0.02 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.63, label: 'PROFIT SURGE', missLabel: 'EARNINGS MISS' },
    outcomes: [
      {
        headline: 'OIL MAJORS SMASH ESTIMATES: RECORD PROFITS, MASSIVE BUYBACKS ANNOUNCED',
        probability: 0.475,
        effects: { oil: 0.07, emerging: 0.03, gold: 0.02, defense: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['oil'],
        allowsReversal: true,
      },
      {
        headline: 'OIL EARNINGS DISAPPOINT: REFINING MARGINS COLLAPSE, DEMAND OUTLOOK CUT',
        probability: 0.525,
        effects: { oil: -0.07, tesla: 0.04, lithium: 0.03, uranium: 0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['oil'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // CONGRESSIONAL DEFENSE BUDGET HEARING
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_defense_budget',
    category: 'geopolitical',
    announcement: {
      headline: 'CONGRESSIONAL DEFENSE BUDGET HEARING TOMORROW — $900B ON THE TABLE',
      effects: { defense: 0.02, nasdaq: -0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.67, label: 'BUDGET INCREASE', missLabel: 'BUDGET CUTS' },
    outcomes: [
      {
        headline: 'CONGRESS APPROVES 18% DEFENSE BOOST — LARGEST SINCE COLD WAR',
        probability: 0.475,
        effects: { defense: 0.09, uranium: 0.04, oil: 0.03, gold: 0.02, nasdaq: -0.02 },
        sentiment: 'bullish',
        sentimentAssets: ['defense', 'uranium'],
        allowsReversal: true,
      },
      {
        headline: 'DEFENSE BUDGET FLAT — STATUS QUO MAINTAINED',
        probability: 0.15,
        effects: { defense: 0.02, nasdaq: 0.01 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'CONGRESS SLASHES DEFENSE 12% — PEACE DIVIDEND REDIRECTED TO DOMESTIC',
        probability: 0.375,
        effects: { defense: -0.08, nasdaq: 0.04, tesla: 0.03, oil: -0.02 },
        sentiment: 'bearish',
        sentimentAssets: ['defense'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // NATO DEFENSE MINISTERS SUMMIT
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_nato_summit',
    category: 'geopolitical',
    announcement: {
      headline: 'NATO DEFENSE MINISTERS SUMMIT TOMORROW — ALLIANCE STRATEGY REVIEW',
      effects: { defense: 0.02, gold: 0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.65, label: 'REARMAMENT PLEDGE', missLabel: 'ALLIANCE FRACTURE' },
    outcomes: [
      {
        headline: 'NATO PLEDGES $2T REARMAMENT PACKAGE — ALL MEMBERS HIT 3% GDP TARGET',
        probability: 0.45,
        effects: { defense: 0.10, oil: 0.04, uranium: 0.03, gold: 0.03, emerging: -0.04 },
        sentiment: 'bullish',
        sentimentAssets: ['defense'],
        allowsReversal: true,
      },
      {
        headline: 'NATO SUMMIT ROUTINE — STANDARD COMMUNIQUE, NO NEW COMMITMENTS',
        probability: 0.15,
        effects: { defense: 0.02, gold: 0.01 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'NATO IN CRISIS: MAJOR MEMBERS REFUSE SPENDING TARGETS — ALLIANCE FRACTURES',
        probability: 0.40,
        effects: { defense: -0.07, gold: 0.05, emerging: 0.04, nasdaq: -0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['defense'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // NOVO NORDISK EARNINGS (GLP-1 / OBESITY DRUGS)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_novo_earnings',
    category: 'biotech',
    announcement: {
      headline: 'NOVO NORDISK EARNINGS CALL TOMORROW — GLP-1 DEMAND IN FOCUS',
      effects: { biotech: 0.02, nasdaq: 0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.67, label: 'BLOCKBUSTER SALES', missLabel: 'SUPPLY MISS' },
    outcomes: [
      {
        headline: 'NOVO CRUSHES EARNINGS: WEGOVY DEMAND EXPLODES, RAISES FULL-YEAR GUIDANCE',
        probability: 0.45,
        effects: { biotech: 0.10, nasdaq: 0.04, emerging: 0.03, gold: -0.02 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech', 'nasdaq'],
        allowsReversal: true,
      },
      {
        headline: 'NOVO EARNINGS INLINE — GLP-1 GROWTH STEADY, NO SURPRISES',
        probability: 0.15,
        effects: { biotech: 0.02, nasdaq: 0.01 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'NOVO MISSES ON SUPPLY: WEGOVY SHORTAGES HAMMER REVENUE, STOCK CRATERS',
        probability: 0.40,
        effects: { biotech: -0.09, nasdaq: -0.03, emerging: -0.03, gold: 0.02 },
        sentiment: 'bearish',
        sentimentAssets: ['biotech'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // PFIZER EARNINGS (POST-COVID PIPELINE)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_pfizer_earnings',
    category: 'biotech',
    announcement: {
      headline: 'PFIZER EARNINGS CALL TOMORROW — POST-COVID PIPELINE IN SPOTLIGHT',
      effects: { biotech: 0.01, nasdaq: 0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.62, label: 'PIPELINE DELIVERS', missLabel: 'REVENUE CLIFF' },
    outcomes: [
      {
        headline: 'PFIZER BEATS: ONCOLOGY PIPELINE BREAKTHROUGH, REVENUE CLIFF AVOIDED',
        probability: 0.45,
        effects: { biotech: 0.09, nasdaq: 0.04, gold: -0.02 },
        sentiment: 'bullish',
        sentimentAssets: ['biotech', 'nasdaq'],
        allowsReversal: true,
      },
      {
        headline: 'PFIZER EARNINGS FLAT — COVID DECLINE OFFSET BY NEW DRUGS',
        probability: 0.15,
        effects: { biotech: 0.02, nasdaq: 0.01 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'PFIZER MISSES BIG: COVID REVENUE COLLAPSE, PIPELINE DELAYS COMPOUND PAIN',
        probability: 0.40,
        effects: { biotech: -0.08, nasdaq: -0.04, gold: 0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['biotech', 'nasdaq'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // EIA CRUDE OIL INVENTORY REPORT
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_eia_oil',
    category: 'energy',
    announcement: {
      headline: 'EIA CRUDE OIL INVENTORY REPORT DUE TOMORROW — STOCKPILE WATCH',
      effects: { oil: 0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.62, label: 'INVENTORY DRAW', missLabel: 'SURPRISE BUILD' },
    outcomes: [
      {
        headline: 'EIA REPORT: MASSIVE INVENTORY DRAW — CRUDE STOCKS AT 5-YEAR LOW',
        probability: 0.45,
        effects: { oil: 0.08, gold: 0.03, emerging: -0.03, uranium: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['oil'],
        allowsReversal: true,
      },
      {
        headline: 'EIA REPORT: INVENTORIES INLINE — NO CHANGE IN SUPPLY OUTLOOK',
        probability: 0.15,
        effects: { oil: 0.02, emerging: 0.01 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'EIA REPORT: SURPRISE CRUDE BUILD — DEMAND DESTRUCTION FEARS SURFACE',
        probability: 0.40,
        effects: { oil: -0.07, tesla: 0.03, lithium: 0.02, uranium: 0.02 },
        sentiment: 'bearish',
        sentimentAssets: ['oil'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // US RETAIL SALES DATA
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_retail_sales',
    category: 'economic',
    announcement: {
      headline: 'US RETAIL SALES DATA DUE TOMORROW — CONSUMER SPENDING IN FOCUS',
      effects: { nasdaq: -0.01, tesla: -0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.64, label: 'SPENDING SURGE', missLabel: 'SPENDING SLUMP' },
    outcomes: [
      {
        headline: 'RETAIL SALES SURGE 2.4% — CONSUMERS SPENDING LIKE THERE IS NO TOMORROW',
        probability: 0.45,
        effects: { nasdaq: 0.05, tesla: 0.05, oil: 0.03, emerging: 0.03, gold: -0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['nasdaq', 'tesla'],
        allowsReversal: true,
      },
      {
        headline: 'RETAIL SALES FLAT — CONSUMERS CAUTIOUS BUT NOT RETREATING',
        probability: 0.15,
        effects: { nasdaq: 0.01, tesla: 0.01 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'RETAIL SALES PLUNGE -1.8% — WORST DROP IN 3 YEARS, RECESSION SIGNAL',
        probability: 0.40,
        effects: { nasdaq: -0.06, tesla: -0.06, oil: -0.03, gold: 0.05, btc: 0.03 },
        sentiment: 'bearish',
        sentimentAssets: ['nasdaq', 'tesla'],
        allowsReversal: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // IAEA GLOBAL NUCLEAR ENERGY REVIEW
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sched_iaea_nuclear',
    category: 'energy',
    announcement: {
      headline: 'IAEA GLOBAL NUCLEAR ENERGY REVIEW RESULTS DUE TOMORROW',
      effects: { uranium: 0.02, oil: -0.01 },
    },
    announcementSentiment: 'mixed',
    predictionMarket: { outcomeIndex: 0, inflatedProbability: 0.65, label: 'NUCLEAR EXPANSION', missLabel: 'SAFETY CONCERNS' },
    outcomes: [
      {
        headline: 'IAEA ENDORSES MASSIVE NUCLEAR EXPANSION — 100 NEW REACTORS RECOMMENDED',
        probability: 0.45,
        effects: { uranium: 0.10, oil: -0.04, defense: 0.03, nasdaq: 0.03 },
        sentiment: 'bullish',
        sentimentAssets: ['uranium'],
        allowsReversal: true,
      },
      {
        headline: 'IAEA REVIEW: NUCLEAR ON TRACK — NO POLICY CHANGES RECOMMENDED',
        probability: 0.15,
        effects: { uranium: 0.02, oil: 0.01 },
        sentiment: 'neutral',
        sentimentAssets: [],
        allowsReversal: true,
      },
      {
        headline: 'IAEA FLAGS CRITICAL SAFETY DEFICIENCIES — CALLS FOR REACTOR SHUTDOWNS',
        probability: 0.40,
        effects: { uranium: -0.09, oil: 0.05, gold: 0.03, lithium: 0.04, tesla: 0.02 },
        sentiment: 'bearish',
        sentimentAssets: ['uranium'],
        allowsReversal: true,
      },
    ],
  },
]

// Weights for selecting which scheduled event to trigger
export const SCHEDULED_EVENT_WEIGHTS: Record<string, number> = {
  // Core macro events (highest weight)
  sched_fed_speech: 0.07,
  sched_fomc: 0.07,
  sched_jobs: 0.06,
  sched_cpi: 0.06,
  sched_gdp: 0.05,
  sched_tech_earnings: 0.05,
  sched_treasury_auction: 0.05,
  // Mid-tier events
  sched_housing: 0.04,
  sched_consumer_confidence: 0.04,
  sched_chip_export: 0.04,
  sched_auto_sales: 0.04,
  sched_climate_summit: 0.04,
  sched_sec_crypto: 0.04,
  sched_usda_crop: 0.04,
  sched_china_pmi: 0.04,
  // Earnings calls
  sched_tesla_earnings: 0.05,
  sched_bank_earnings: 0.04,
  sched_oil_earnings: 0.04,
  // Defense & geopolitical
  sched_defense_budget: 0.04,
  sched_nato_summit: 0.03,
  // Pharma earnings
  sched_novo_earnings: 0.04,
  sched_pfizer_earnings: 0.03,
  // Data releases
  sched_eia_oil: 0.04,
  sched_retail_sales: 0.04,
  sched_iaea_nuclear: 0.03,
}
