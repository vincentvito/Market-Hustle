import type { ScriptedGameDefinition } from './types'

/**
 * Game 1: "Yellowstone" — Bull Run Into Apocalypse
 *
 * Days 1-14: Extended bull market, everything pumps. New players feel confident.
 * Day 15: Yellowstone supervolcano erupts. Everything crashes except safe havens.
 * Days 16-24: Cascading disaster, supply chain collapse, food crisis.
 * Days 25-30: Tentative recovery / new normal.
 */
export const SCRIPTED_GAME_1: ScriptedGameDefinition = {
  id: 'yellowstone',
  title: 'Yellowstone',
  days: [
    // ── DAY 1 ──────────────────────────────────────────────
    {
      day: 1,
      news: [
        {
          headline: 'TECH EARNINGS BEAT EXPECTATIONS ACROSS THE BOARD',
          effects: { nasdaq: 0.10, tesla: 0.07, btc: 0.05 },
          labelType: 'news',
        },
        {
          headline: 'WALL STREET BONUSES HIT RECORD HIGH — BULL MARKET VIBES',
          effects: { nasdaq: 0.03 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'ROGAN SAYS HE\'S GOING ALL IN ON TECH — 4 HOUR EPISODE',
    },

    // ── DAY 2 ──────────────────────────────────────────────
    {
      day: 2,
      news: [
        {
          headline: 'CONSUMER CONFIDENCE HITS 10-YEAR HIGH',
          effects: { nasdaq: 0.05, emerging: 0.04 },
          labelType: 'news',
        },
        {
          headline: 'SOURCES SAY SEC CLOSE TO APPROVING SPOT BITCOIN ETF',
          effects: { btc: 0.08, altcoins: 0.06 },
          labelType: 'rumor',
        },
      ],
      flavorHeadline: 'JEFF BEZOS SPOTTED PARTYING IN MIAMI',
      priceNudges: [
        { assetId: 'nasdaq', nudge: 0.02 },
        { assetId: 'btc', nudge: 0.02 },
        { assetId: 'tesla', nudge: 0.02 },
        { assetId: 'emerging', nudge: 0.02 },
        { assetId: 'oil', nudge: 0.02 },
      ],
    },

    // ── DAY 3 ──────────────────────────────────────────────
    {
      day: 3,
      news: [
        {
          headline: 'SEC APPROVES SPOT BITCOIN ETF — INSTITUTIONAL FLOODGATES OPEN',
          effects: { btc: 0.40, altcoins: 0.25, nasdaq: 0.10 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'JUST IN: BLACKROCK CEO CALLS BITCOIN "DIGITAL GOLD" ON LIVE TV',
    },

    // ── DAY 4 ──────────────────────────────────────────────
    {
      day: 4,
      news: [
        {
          headline: 'CRYPTO FOMO HITS MAINSTREAM — RETAIL VOLUMES EXPLODE',
          effects: { btc: 0.15, altcoins: 0.20 },
          labelType: 'news',
        },
      ],
      flavorHeadline: '@TonyTrades42 JUST MADE $4.2M ON BTC. SINGLE TRADE.',
      priceNudges: [{ assetId: 'btc', nudge: 0.04 }],
    },

    // ── DAY 5 ──────────────────────────────────────────────
    {
      day: 5,
      news: [
        {
          headline: 'TESLA REPORTS RECORD DELIVERIES — STOCK SURGES',
          effects: { tesla: 0.25, lithium: 0.12, nasdaq: 0.06 },
          labelType: 'news',
        },
        {
          headline: 'LITHIUM MINERS STRUGGLE TO KEEP UP WITH EV DEMAND',
          effects: { lithium: 0.05 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'REPORT: CYBERTRUCK SPOTTED IN EVERY WHOLE FOODS PARKING LOT IN AMERICA',
    },

    // ── DAY 6 ──────────────────────────────────────────────
    {
      day: 6,
      news: [
        {
          headline: 'NUCLEAR RENAISSANCE: 50 NEW PLANTS APPROVED GLOBALLY',
          effects: { uranium: 0.28, defense: 0.08 },
          labelType: 'news',
        },
        {
          headline: 'FDA APPROVES HIGH-PROFILE CANCER DRUG',
          effects: { biotech: 0.08, nasdaq: 0.03 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'JIM CRAMER SAYS TO BUY',
      priceNudges: [{ assetId: 'uranium', nudge: 0.04 }],
    },

    // ── DAY 7 ──────────────────────────────────────────────
    {
      day: 7,
      news: [
        {
          headline: 'NVIDIA EARNINGS OBLITERATE EXPECTATIONS — AI BOOM ACCELERATES',
          effects: { nasdaq: 0.22, btc: 0.08 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'JUST IN: AI TRADING BOTS BECOME MOST DOWNLOADED APP',
      priceNudges: [{ assetId: 'nasdaq', nudge: 0.03 }],
    },

    // ── DAY 8 ──────────────────────────────────────────────
    {
      day: 8,
      news: [
        {
          headline: 'NASDAQ HITS ALL-TIME HIGH — BULL MARKET CONFIRMED',
          effects: { nasdaq: 0.15, tesla: 0.08, btc: 0.10 },
          labelType: 'news',
        },
      ],
      flavorHeadline: '@WolfOfMiami99 JUST REACHED $230M NET WORTH.',
      startupOffer: { tier: 'angel' },
    },

    // ── DAY 9 ──────────────────────────────────────────────
    {
      day: 9,
      news: [
        {
          headline: 'BTC BREAKS $60K — ANALYSTS SAY $100K BY YEAR END',
          effects: { btc: 0.18, altcoins: 0.15 },
          labelType: 'news',
        },
        {
          headline: 'CRYPTO WHALES ACCUMULATING — ON-CHAIN DATA SHOWS RECORD HOLDINGS',
          effects: { btc: 0.05 },
          labelType: 'rumor',
        },
      ],
      flavorHeadline: 'MILLENNIAL HOMEBUYERS GIVE UP, BUY CRYPTO INSTEAD',
      priceNudges: [{ assetId: 'btc', nudge: 0.03 }],
    },

    // ── DAY 10 ─────────────────────────────────────────────
    {
      day: 10,
      news: [
        {
          headline: 'BROAD MARKET RALLY — EVERY SECTOR GREEN',
          effects: {
            nasdaq: 0.08,
            biotech: 0.08,
            defense: 0.08,
            emerging: 0.08,
            oil: 0.08,
            uranium: 0.08,
            lithium: 0.08,
            gold: 0.08,
            coffee: 0.08,
            tesla: 0.08,
          },
          labelType: 'news',
        },
        {
          headline: 'MAJOR EXCHANGE FILES BANKRUPTCY',
          effects: { btc: -0.113, altcoins: -0.14, nasdaq: -0.02 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'STUDY: TRADING STOCKS ACTIVATES SAME BRAIN REGIONS AS COCAINE',
      encounter: 'roulette',
      priceNudges: [
        { assetId: 'nasdaq', nudge: 0.02 },
        { assetId: 'biotech', nudge: 0.02 },
        { assetId: 'defense', nudge: 0.02 },
        { assetId: 'emerging', nudge: 0.02 },
        { assetId: 'oil', nudge: 0.02 },
        { assetId: 'uranium', nudge: 0.02 },
        { assetId: 'lithium', nudge: 0.02 },
        { assetId: 'gold', nudge: 0.02 },
        { assetId: 'coffee', nudge: 0.02 },
        { assetId: 'tesla', nudge: 0.02 },
      ],
    },

    // ── DAY 11 ─────────────────────────────────────────────
    {
      day: 11,
      news: [
        {
          headline: 'EMERGING MARKETS JOIN THE PARTY — RECORD INFLOWS',
          effects: { emerging: 0.15, gold: -0.04, coffee: 0.08 },
          labelType: 'news',
        },
        {
          headline: 'BRICS NATIONS ADOPT CRYPTO PAYMENT STANDARD',
          effects: { btc: 0.10, altcoins: 0.06, nasdaq: 0.02 },
          labelType: 'news',
        },
      ],
      flavorHeadline: '@DiamondHands420 JUST MADE $8.5M IN A SINGLE TRADE.',
    },

    // ── DAY 12 ─────────────────────────────────────────────
    {
      day: 12,
      news: [
        {
          headline: 'LITHIUM DEMAND SURGES — EV TRANSITION UNSTOPPABLE',
          effects: { lithium: 0.20, tesla: 0.12 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'ELON MUSK CLAIMS GDP WILL GROW 100X THANKS TO HUMANOID ROBOTS',
      priceNudges: [{ assetId: 'lithium', nudge: 0.03 }],
    },

    // ── DAY 13 ─────────────────────────────────────────────
    {
      day: 13,
      news: [
        {
          headline: 'MARKETS PAUSE — LIGHT VOLUME SESSION',
          effects: {},
          labelType: 'news',
        },
        {
          headline: 'UNUSUAL SEISMIC ACTIVITY DETECTED NEAR YELLOWSTONE — USGS MONITORING',
          effects: { gold: 0.04, defense: 0.02, nasdaq: -0.02 },
          labelType: 'rumor',
        },
      ],
      flavorHeadline: 'HEDGE FUND MANAGER SEEN CRYING IN LAMBO',
    },

    // ── DAY 14 ─────────────────────────────────────────────
    {
      day: 14,
      news: [
        {
          headline: 'FED SIGNALS CONTINUED PATIENCE — GOLDILOCKS ECONOMY',
          effects: { nasdaq: 0.08, btc: 0.06, gold: -0.04 },
          labelType: 'news',
        },
        {
          headline: 'YELLOWSTONE RECORDS 500 EARTHQUAKES IN 24 HOURS — ALERT LEVEL RAISED',
          effects: { gold: 0.06, defense: 0.04, nasdaq: -0.04, oil: 0.03 },
          labelType: 'developing',
        },
      ],
      flavorHeadline:
        '@BullishBen_nyc JUST MADE $1.2M ON NASDAQ. SINGLE TRADE.',
    },

    // ── DAY 15 — THE ERUPTION ──────────────────────────────
    {
      day: 15,
      news: [
        {
          headline: 'YELLOWSTONE SUPERVOLCANO ERUPTS — MASSIVE ERUPTION DETECTED',
          effects: {
            nasdaq: -0.45,
            tesla: -0.50,
            btc: -0.30,
            oil: 0.40,
            gold: 0.45,
            defense: 0.30,
          },
          labelType: 'breaking',
        },
      ],
      priceNudges: [
        { assetId: 'nasdaq', nudge: -0.08 },
        { assetId: 'tesla', nudge: -0.05 },
        { assetId: 'btc', nudge: -0.05 },
        { assetId: 'gold', nudge: 0.06 },
      ],
    },

    // ── DAY 16 ─────────────────────────────────────────────
    {
      day: 16,
      news: [
        {
          headline: 'ASH CLOUD COVERS WESTERN US — AIRPORTS SHUT DOWN NATIONWIDE',
          effects: {
            nasdaq: -0.25,
            tesla: -0.30,
            emerging: -0.20,
            oil: 0.25,
            gold: 0.25,
            coffee: 0.35,
          },
          labelType: 'developing',
        },
      ],
      flavorHeadline: '@DerekCapital JUST LOST $12M IN A SINGLE TRADE.',
      priceNudges: [{ assetId: 'nasdaq', nudge: -0.05 }],
    },

    // ── DAY 17 ─────────────────────────────────────────────
    {
      day: 17,
      news: [
        {
          headline: 'FEMA DECLARES NATIONAL EMERGENCY — SUPPLY CHAINS PARALYZED',
          effects: {
            nasdaq: -0.20,
            lithium: -0.25,
            coffee: 0.40,
            gold: 0.22,
            oil: 0.18,
            defense: 0.18,
          },
          labelType: 'developing',
        },
      ],
      flavorHeadline: 'NEWS: DOOMSDAY BUNKER PRICES UP 500% IN 48 HOURS',
    },

    // ── DAY 18 ─────────────────────────────────────────────
    {
      day: 18,
      news: [
        {
          headline: 'CROP FAILURES IMMINENT — FOOD PRICES SURGE',
          effects: { coffee: 0.35, gold: 0.15, emerging: -0.18, nasdaq: -0.15 },
          labelType: 'news',
        },
        {
          headline: 'OIL TANKER EXPLODES IN STRAIT OF HORMUZ — SUPPLY ROUTE THREATENED',
          effects: { oil: 0.08, gold: 0.04, defense: 0.04, emerging: -0.04, nasdaq: -0.02, uranium: 0.03 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'TIKTOK TREND: DOOMSDAY PREPPERS WERE RIGHT ALL ALONG',
    },

    // ── DAY 19 ─────────────────────────────────────────────
    {
      day: 19,
      news: [
        {
          headline: 'INSURANCE INDUSTRY COLLAPSE — CLAIMS EXCEED RESERVES',
          effects: { nasdaq: -0.18, biotech: -0.15, defense: 0.12, gold: 0.12 },
          labelType: 'news',
        },
      ],
      flavorHeadline: '@MoonMan_la JUST GOT LIQUIDATED. LOST $34M.',
      encounter: 'kidney',
    },

    // ── DAY 20 ─────────────────────────────────────────────
    {
      day: 20,
      news: [
        {
          headline: 'CONGRESS PASSES $5 TRILLION EMERGENCY RELIEF BILL',
          effects: { nasdaq: 0.12, defense: 0.20, biotech: 0.15, gold: -0.08 },
          labelType: 'news',
        },
        {
          headline: 'GOLD RESERVES RUNNING LOW AT MAJOR MINTS',
          effects: { gold: 0.05 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'JUST IN: NANCY PELOSI BOUGHT DEFENSE CALLS LAST WEEK',
    },

    // ── DAY 21 ─────────────────────────────────────────────
    {
      day: 21,
      news: [
        {
          headline: 'RECONSTRUCTION EFFORTS BEGIN — DEFENSE CONTRACTORS MOBILIZE',
          effects: { defense: 0.18, nasdaq: 0.08, lithium: 0.12 },
          labelType: 'news',
        },
      ],
      flavorHeadline: '@the_real_chad JUST MADE $6.8M ON GOLD. SINGLE TRADE.',
      priceNudges: [{ assetId: 'defense', nudge: 0.04 }],
    },

    // ── DAY 22 — SECOND ERUPTION ───────────────────────────
    {
      day: 22,
      news: [
        {
          headline: 'SECOND ERUPTION REPORTED — GEOLOGISTS WARN OF WORSE TO COME',
          effects: { nasdaq: -0.30, tesla: -0.22, gold: 0.30, oil: 0.22, coffee: 0.28 },
          labelType: 'breaking',
        },
      ],
      flavorHeadline: 'REPORT: VOLCANO INSURANCE CLAIMS EXCEED ENTIRE 2024 GDP OF WYOMING',
      priceNudges: [
        { assetId: 'nasdaq', nudge: -0.05 },
        { assetId: 'tesla', nudge: -0.04 },
      ],
    },

    // ── DAY 23 ─────────────────────────────────────────────
    {
      day: 23,
      news: [
        {
          headline: 'GLOBAL FOOD CRISIS — UN CALLS EMERGENCY SESSION',
          effects: { coffee: 0.30, emerging: -0.25, gold: 0.18, nasdaq: -0.15 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'WARREN BUFFETT CLAIMS ASSETS ARE OVERVALUED',
      encounter: 'divorce',
    },

    // ── DAY 24 ─────────────────────────────────────────────
    {
      day: 24,
      news: [
        {
          headline: 'ASH CLOUD REACHES EUROPE — GLOBAL TRADE AT STANDSTILL',
          effects: { emerging: -0.20, oil: 0.15, gold: 0.15, nasdaq: -0.18, btc: -0.15 },
          labelType: 'developing',
        },
        {
          headline: 'GLOBAL SUPPLY CHAIN MELTDOWN - SHORTAGES SPREAD',
          effects: { coffee: 0.08, nasdaq: -0.05, emerging: -0.08, lithium: -0.05, tesla: -0.06 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'JUST IN: EUROPEAN FLIGHTS GROUNDED INDEFINITELY — AIRLINE STOCKS CRATER',
    },

    // ── DAY 25 ─────────────────────────────────────────────
    {
      day: 25,
      news: [
        {
          headline: 'BITCOIN SURGES AS DOLLAR CONFIDENCE CRUMBLES',
          effects: { btc: 0.28, altcoins: 0.22, gold: 0.12 },
          labelType: 'news',
        },
        {
          headline: 'TRUST IN US DOLLAR CRUMBLING — INVESTORS FLEE TO HARD ASSETS',
          effects: { gold: 0.05, emerging: 0.04 },
          labelType: 'news',
        },
      ],
      flavorHeadline: '@CryptoKing99 JUST MADE $18M ON BTC. SINGLE TRADE.',
      priceNudges: [{ assetId: 'btc', nudge: 0.05 }],
    },

    // ── DAY 26 ─────────────────────────────────────────────
    {
      day: 26,
      news: [
        {
          headline: 'VOLCANIC ACTIVITY SUBSIDING — SCIENTISTS CAUTIOUSLY OPTIMISTIC',
          effects: { nasdaq: 0.15, tesla: 0.12, emerging: 0.08, gold: -0.10 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'REPORT: DOOMSDAY CLOCK MOVED BACK 30 SECONDS',
    },

    // ── DAY 27 ─────────────────────────────────────────────
    {
      day: 27,
      news: [
        {
          headline: 'MARKETS ATTEMPT RECOVERY — DEAD CAT BOUNCE OR REAL BOTTOM?',
          effects: { nasdaq: 0.10, btc: 0.08 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'CONGRESS MEMBER CAUGHT DAY-TRADING DURING EMERGENCY SESSION',
      priceNudges: [{ assetId: 'nasdaq', nudge: 0.02 }],
    },

    // ── DAY 28 ─────────────────────────────────────────────
    {
      day: 28,
      news: [
        {
          headline: 'RECONSTRUCTION MEGA-SPENDING BILL — $10 TRILLION INFRASTRUCTURE',
          effects: { defense: 0.22, lithium: 0.15, nasdaq: 0.12 },
          labelType: 'news',
        },
        {
          headline: 'LITHIUM DEMAND SURGES FOR EMERGENCY INFRASTRUCTURE',
          effects: { lithium: 0.08 },
          labelType: 'news',
        },
      ],
      flavorHeadline: '@SteadySteve_dc JUST MADE $5.1M ON DEFENSE. SINGLE TRADE.',
    },

    // ── DAY 29 ─────────────────────────────────────────────
    {
      day: 29,
      news: [
        {
          headline: 'NEW NORMAL — MARKETS STABILIZE AT MUCH LOWER LEVELS',
          effects: { nasdaq: 0.03 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'REPORT: AVERAGE RETAIL TRADER HOLDS POSITION FOR 47 SECONDS',
    },

    // ── DAY 30 ─────────────────────────────────────────────
    {
      day: 30,
      news: [
        {
          headline: 'MARKETS CLOSE — ASH SETTLES, REBUILDING BEGINS',
          effects: {},
          labelType: 'news',
        },
      ],
      flavorHeadline: 'REPORT: RETAIL TRADERS WHO BOUGHT GOLD ON DAY 15 UP 300%',
    },
  ],
}
