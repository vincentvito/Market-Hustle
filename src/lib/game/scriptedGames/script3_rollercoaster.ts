import type { ScriptedGameDefinition } from './types'

/**
 * Game 3: "The Rollercoaster" — Sector Chaos & Whiplash
 *
 * Days 1-3: Biotech mania — FDA fast-track, mega-merger, parabolic rally.
 * Days 4-5: Biotech crash — clinical trial halted, fraud investigation.
 * Days 6-9: Energy & commodity surge — Nord Stream sabotage, drought.
 * Days 10: Energy stabilizes.
 * Days 11-13: Tesla collapse — recall, BYD overtakes, 52-week low.
 * Days 14-15: Tesla reversal — $25K model, analyst upgrades.
 * Days 16-18: Meme mania and bust.
 * Days 19-21: Gold rush.
 * Days 22-23: Gold crash — asteroid news.
 * Days 24-26: Crypto rally — BTC legal tender, alt season.
 * Days 27-28: Broad euphoria — global rate cuts, everything rally.
 * Days 29-30: Slight pullback, quiet close.
 */
export const SCRIPTED_GAME_3: ScriptedGameDefinition = {
  id: 'rollercoaster',
  title: 'The Rollercoaster',
  days: [
    // ── DAY 1 ──────────────────────────────────────────────
    {
      day: 1,
      news: [
        {
          headline: 'FDA FAST-TRACKS REVOLUTIONARY CANCER TREATMENT',
          effects: { biotech: 0.28, nasdaq: 0.08 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@BiotechBull_nyc JUST MADE $2.8M ON BIOTECH. SINGLE TRADE.',
      priceNudges: [{ assetId: 'biotech', nudge: 0.04 }],
    },

    // ── DAY 2 ──────────────────────────────────────────────
    {
      day: 2,
      news: [
        {
          headline:
            'PHARMA MEGA-MERGER — LARGEST DEAL IN HISTORY ANNOUNCED',
          effects: { biotech: 0.22, nasdaq: 0.08, emerging: 0.04 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'JUST IN: PHARMA EXECS BUYING MATCHING LAMBOS BEFORE DEAL CLOSES',
    },

    // ── DAY 3 ──────────────────────────────────────────────
    {
      day: 3,
      news: [
        {
          headline:
            'BIOTECH ETF GOES PARABOLIC — 3RD STRAIGHT DAY OF GAINS',
          effects: { biotech: 0.15, nasdaq: 0.06 },
          labelType: 'news',
        },
        {
          headline: 'BIOTECH HEDGE FUNDS REPORT BEST QUARTER IN DECADE',
          effects: { biotech: 0.03 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'REPORT: FENTANYL MIGHT CURE DEPRESSION',
      priceNudges: [{ assetId: 'biotech', nudge: 0.03 }],
    },

    // ── DAY 4 ──────────────────────────────────────────────
    {
      day: 4,
      news: [
        {
          headline:
            'CLINICAL TRIAL HALTED — SEVERE SIDE EFFECTS REPORTED',
          effects: { biotech: -0.38, nasdaq: -0.12 },
          labelType: 'breaking',
        },
        {
          headline: 'BIOTECH GIANT RECALLS BLOCKBUSTER DRUG',
          effects: { biotech: -0.10, nasdaq: -0.03 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@MoonMan_la JUST LOST $15M ON BIOTECH.',
      priceNudges: [{ assetId: 'biotech', nudge: -0.05 }],
    },

    // ── DAY 5 ──────────────────────────────────────────────
    {
      day: 5,
      news: [
        {
          headline: 'FDA LAUNCHES INVESTIGATION INTO PHARMA FRAUD',
          effects: { biotech: -0.22, nasdaq: -0.08 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'ROGAN BRINGS VACCINE SKEPTIC ON — 6 HOUR EPISODE',
    },

    // ── DAY 6 ──────────────────────────────────────────────
    {
      day: 6,
      news: [
        {
          headline: 'MARKETS STABILIZE — ROTATION INTO ENERGY',
          effects: {
            oil: 0.10,
            uranium: 0.08,
            gold: 0.06,
            biotech: -0.08,
          },
          labelType: 'news',
        },
        {
          headline:
            'REPORTS OF EXPLOSION NEAR EUROPEAN GAS PIPELINE — UNVERIFIED',
          effects: { oil: 0.08, gold: 0.04, nasdaq: -0.04 },
          labelType: 'rumor',
        },
      ],
      flavorHeadline: 'HEDGE FUND MANAGER SEEN CRYING IN LAMBO',
    },

    // ── DAY 7 ──────────────────────────────────────────────
    {
      day: 7,
      news: [
        {
          headline:
            'NORD STREAM 3 SABOTAGED — EUROPEAN ENERGY CRISIS',
          effects: {
            oil: 0.35,
            uranium: 0.22,
            gold: 0.12,
            nasdaq: -0.12,
            emerging: -0.15,
          },
          labelType: 'breaking',
        },
      ],
      flavorHeadline:
        'JUST IN: EUROPEAN GAS STATIONS RUNNING DRY WITHIN HOURS',
      priceNudges: [{ assetId: 'oil', nudge: 0.04 }],
      startupOffer: { tier: 'angel' },
    },

    // ── DAY 8 ──────────────────────────────────────────────
    {
      day: 8,
      news: [
        {
          headline:
            'OIL SURGES — OPEC REFUSES TO INCREASE PRODUCTION',
          effects: {
            oil: 0.22,
            coffee: 0.12,
            gold: 0.08,
            tesla: -0.10,
            nasdaq: -0.08,
          },
          labelType: 'news',
        },
        {
          headline: 'OIL TANKER EXPLODES IN STRAIT OF HORMUZ',
          effects: {
            oil: 0.08,
            gold: 0.04,
            defense: 0.04,
            emerging: -0.04,
            nasdaq: -0.02,
            uranium: 0.03,
          },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'JIM CRAMER SAYS TO BUY',
    },

    // ── DAY 9 ──────────────────────────────────────────────
    {
      day: 9,
      news: [
        {
          headline:
            'WORST DROUGHT IN 500 YEARS — CROP FAILURES WORLDWIDE',
          effects: { coffee: 0.35, oil: 0.08, gold: 0.12, emerging: -0.10 },
          labelType: 'news',
        },
        {
          headline: 'FERTILIZER SHORTAGE HITS GLOBAL FARMS',
          effects: { coffee: 0.08, emerging: -0.04 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@DubaiWhale42 JUST MADE $11M ON COFFEE. SINGLE TRADE.',
      encounter: 'roulette',
      priceNudges: [{ assetId: 'coffee', nudge: 0.04 }],
    },

    // ── DAY 10 ─────────────────────────────────────────────
    {
      day: 10,
      news: [
        {
          headline:
            'ENERGY PRICES STABILIZE — STRATEGIC RESERVES RELEASED',
          effects: { oil: -0.10, uranium: -0.08, nasdaq: 0.08, tesla: 0.06 },
          labelType: 'news',
        },
        {
          headline:
            'TESLA PREPARING MASSIVE CYBERTRUCK RECALL OVER BATTERY DEFECT',
          effects: { tesla: -0.08, lithium: -0.04 },
          labelType: 'rumor',
        },
      ],
      flavorHeadline: 'AMAZON LAUNCHES DRONE DELIVERY IN EUROPE',
    },

    // ── DAY 11 ─────────────────────────────────────────────
    {
      day: 11,
      news: [
        {
          headline:
            'TESLA CYBERTRUCK MASSIVE RECALL — BATTERY FIRES REPORTED',
          effects: { tesla: -0.32, lithium: -0.15, nasdaq: -0.08 },
          labelType: 'developing',
        },
      ],
      flavorHeadline:
        "ELON CHANGES TWITTER NAME TO 'CHIEF SHITPOSTING OFFICER'",
      priceNudges: [{ assetId: 'tesla', nudge: -0.05 }],
    },

    // ── DAY 12 ─────────────────────────────────────────────
    {
      day: 12,
      news: [
        {
          headline: 'BYD OVERTAKES TESLA IN GLOBAL EV SALES',
          effects: { tesla: -0.25, lithium: -0.10, emerging: 0.10 },
          labelType: 'news',
        },
        {
          headline: 'CHINA CORNERS LITHIUM SUPPLY',
          effects: {
            lithium: 0.10,
            emerging: -0.03,
            nasdaq: -0.03,
            tesla: -0.05,
          },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@TeslaFan_austin JUST GOT LIQUIDATED. LOST $8.5M.',
      priceNudges: [{ assetId: 'tesla', nudge: -0.04 }],
    },

    // ── DAY 13 ─────────────────────────────────────────────
    {
      day: 13,
      news: [
        {
          headline: 'TESLA HITS 52-WEEK LOW — IS THIS THE END?',
          effects: { tesla: -0.15, gold: 0.04 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'MR BEAST BUYS ENTIRE GOLD MINE FOR VIDEO',
    },

    // ── DAY 14 ─────────────────────────────────────────────
    {
      day: 14,
      news: [
        {
          headline:
            'TESLA UNVEILS $25K MODEL — ORDERS CRASH SERVERS',
          effects: { tesla: 0.45, lithium: 0.28, nasdaq: 0.12 },
          labelType: 'breaking',
        },
        {
          headline: 'EV SALES SURPASS GAS VEHICLES FOR FIRST TIME',
          effects: {
            lithium: 0.10,
            nasdaq: 0.04,
            oil: -0.06,
            tesla: 0.07,
          },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@DiamondHands420 JUST MADE $6.2M ON TESLA. SINGLE TRADE.',
      priceNudges: [{ assetId: 'tesla', nudge: 0.06 }],
    },

    // ── DAY 15 ─────────────────────────────────────────────
    {
      day: 15,
      news: [
        {
          headline:
            'TESLA RALLY CONTINUES — ANALYSTS UPGRADE TO STRONG BUY',
          effects: { tesla: 0.22, lithium: 0.12, nasdaq: 0.08 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'ELON MUSK CLAIMS GDP WILL GROW 100X THANKS TO HUMANOID ROBOTS',
      priceNudges: [{ assetId: 'tesla', nudge: 0.03 }],
    },

    // ── DAY 16 ─────────────────────────────────────────────
    {
      day: 16,
      news: [
        {
          headline:
            'GME MEME MANIA RETURNS — ROARING KITTY POSTS AGAIN',
          effects: { altcoins: 0.35, btc: 0.12, nasdaq: -0.06 },
          labelType: 'breaking',
        },
        {
          headline:
            "CRYPTO TWITTER ERUPTS — 'SHORT SQUEEZE INCOMING' TRENDING",
          effects: { altcoins: 0.05 },
          labelType: 'rumor',
        },
      ],
      flavorHeadline:
        "TIKTOK TREND: GEN-ALPHA DOING 'MARGIN CALL CHALLENGES'",
      priceNudges: [{ assetId: 'altcoins', nudge: 0.06 }],
    },

    // ── DAY 17 ─────────────────────────────────────────────
    {
      day: 17,
      news: [
        {
          headline: 'MEME STOCKS SURGE — SHORT SELLERS PANIC',
          effects: { altcoins: 0.25, btc: 0.08, tesla: 0.08 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'MILLENNIAL HOMEBUYERS GIVE UP, BUY CRYPTO INSTEAD',
    },

    // ── DAY 18 ─────────────────────────────────────────────
    {
      day: 18,
      news: [
        {
          headline:
            'MEME BUBBLE POPS — RETAIL TRADERS LEFT HOLDING BAGS',
          effects: { altcoins: -0.42, btc: -0.12, nasdaq: -0.06 },
          labelType: 'developing',
        },
        {
          headline: 'MASSIVE DEFI EXPLOIT DRAINS $2B',
          effects: { altcoins: -0.16, btc: 0.05, gold: 0.03 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'AI CHATBOT CONVINCES 50K PEOPLE TO MAX OUT CREDIT CARDS ON CRYPTO',
      priceNudges: [{ assetId: 'altcoins', nudge: -0.06 }],
      encounter: 'kidney',
    },

    // ── DAY 19 ─────────────────────────────────────────────
    {
      day: 19,
      news: [
        {
          headline:
            'GOLD RUSH — CENTRAL BANKS BUYING RECORD AMOUNTS',
          effects: { gold: 0.18, btc: 0.08, oil: 0.06 },
          labelType: 'news',
        },
        {
          headline:
            'GOLD ETFS SEE RECORD INFLOWS — BILLIONS POUR IN OVERNIGHT',
          effects: { gold: 0.04 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@GoldKing_zurich JUST REACHED $95M NET WORTH.',
      priceNudges: [{ assetId: 'gold', nudge: 0.03 }],
    },

    // ── DAY 20 ─────────────────────────────────────────────
    {
      day: 20,
      news: [
        {
          headline:
            'GOLD HITS ALL-TIME HIGH — SAFE HAVEN DEMAND SURGES',
          effects: { gold: 0.15, defense: 0.08 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'GENZ DISCOVERS GOLD AS "VINTAGE INVESTING"',
    },

    // ── DAY 21 ─────────────────────────────────────────────
    {
      day: 21,
      news: [
        {
          headline: 'STUDY: LOOKING AT GOLD REDUCES ANXIETY',
          effects: { gold: 0.08 },
          labelType: 'news',
        },
        {
          headline:
            'ASTRONOMERS DETECT HIGH-METALLIC NEAR-EARTH ASTEROID — COULD CONTAIN GOLD',
          effects: { gold: -0.06, nasdaq: 0.04 },
          labelType: 'rumor',
        },
      ],
      flavorHeadline: 'POLYMARKET WHALES BETTING ON ASTEROID IMPACT',
    },

    // ── DAY 22 ─────────────────────────────────────────────
    {
      day: 22,
      news: [
        {
          headline:
            'NASA: GOLD-RICH ASTEROID APPROACHING — MINING MISSION PLANNED',
          effects: { gold: -0.38, nasdaq: 0.12, defense: 0.08 },
          labelType: 'breaking',
        },
        {
          headline:
            'DEEP SEA MINING BEGINS — ALTERNATIVE MINERALS FLOODING MARKET',
          effects: { lithium: -0.05, emerging: 0.03, nasdaq: 0.03 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'REPORT: GOLD MINERS THREATENING TO QUIT IF ASTEROID LANDS',
      priceNudges: [{ assetId: 'gold', nudge: -0.06 }],
    },

    // ── DAY 23 ─────────────────────────────────────────────
    {
      day: 23,
      news: [
        {
          headline: 'GOLD CRASHES 2ND DAY — PANIC SELLING',
          effects: { gold: -0.20, btc: 0.12, nasdaq: 0.08 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@GoldBug_london JUST LOST $22M ON GOLD.',
      encounter: 'divorce',
    },

    // ── DAY 24 ─────────────────────────────────────────────
    {
      day: 24,
      news: [
        {
          headline: 'MAJOR NATION ADOPTS BITCOIN AS LEGAL TENDER',
          effects: { btc: 0.38, altcoins: 0.28, gold: -0.12 },
          labelType: 'breaking',
        },
        {
          headline: 'VISA AND MASTERCARD PROCESS BITCOIN NATIVELY',
          effects: { btc: 0.10, altcoins: 0.06, nasdaq: 0.03 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'MCDONALDS LAUNCHES MCBITCOIN MEAL — COMES WITH PAPER WALLET AND FRIES',
      priceNudges: [{ assetId: 'btc', nudge: 0.05 }],
    },

    // ── DAY 25 ─────────────────────────────────────────────
    {
      day: 25,
      news: [
        {
          headline:
            'CRYPTO RALLY ACCELERATES — MAINSTREAM ADOPTION SURGING',
          effects: { btc: 0.22, altcoins: 0.18, nasdaq: 0.08 },
          labelType: 'news',
        },
        {
          headline: 'ETHEREUM COMPLETES MAJOR UPGRADE',
          effects: { altcoins: 0.10, btc: -0.03 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        "POPE ENDORSES BITCOIN IN SUNDAY SERMON — 'RENDER UNTO THE BLOCKCHAIN'",
    },

    // ── DAY 26 ─────────────────────────────────────────────
    {
      day: 26,
      news: [
        {
          headline: "ALTCOINS EXPLODE — 'ALT SEASON' DECLARED",
          effects: { altcoins: 0.30, btc: 0.12 },
          labelType: 'news',
        },
        {
          headline:
            'DEFI PROTOCOLS HIT ALL-TIME HIGH TOTAL VALUE LOCKED',
          effects: { altcoins: 0.05 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@CryptoKing99 JUST MADE $18M ON ALTCOINS. SINGLE TRADE.',
      priceNudges: [{ assetId: 'altcoins', nudge: 0.05 }],
    },

    // ── DAY 27 ─────────────────────────────────────────────
    {
      day: 27,
      news: [
        {
          headline: 'COORDINATED GLOBAL RATE CUTS — MARKETS EUPHORIC',
          effects: {
            nasdaq: 0.15,
            biotech: 0.15,
            defense: 0.15,
            emerging: 0.15,
            oil: 0.15,
            uranium: 0.15,
            lithium: 0.15,
            gold: 0.15,
            coffee: 0.15,
            btc: 0.15,
            altcoins: 0.15,
            tesla: 0.15,
          },
          labelType: 'news',
        },
        {
          headline: 'MASSIVE SHORT SQUEEZE',
          effects: { nasdaq: 0.08, btc: 0.06, altcoins: 0.08, tesla: 0.07 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'META HIRES 17-YEAR-OLD TO LEAD AI EFFORTS',
      priceNudges: [
        { assetId: 'nasdaq', nudge: 0.03 },
        { assetId: 'biotech', nudge: 0.03 },
        { assetId: 'defense', nudge: 0.03 },
        { assetId: 'emerging', nudge: 0.03 },
        { assetId: 'oil', nudge: 0.03 },
        { assetId: 'uranium', nudge: 0.03 },
        { assetId: 'lithium', nudge: 0.03 },
        { assetId: 'gold', nudge: 0.03 },
        { assetId: 'coffee', nudge: 0.03 },
        { assetId: 'btc', nudge: 0.03 },
        { assetId: 'altcoins', nudge: 0.03 },
        { assetId: 'tesla', nudge: 0.03 },
      ],
    },

    // ── DAY 28 ─────────────────────────────────────────────
    {
      day: 28,
      news: [
        {
          headline: 'EVERYTHING RALLY — BEST DAY IN MARKET HISTORY',
          effects: {
            nasdaq: 0.12,
            biotech: 0.12,
            defense: 0.12,
            emerging: 0.12,
            oil: 0.12,
            uranium: 0.12,
            lithium: 0.12,
            gold: 0.12,
            coffee: 0.12,
            btc: 0.12,
            altcoins: 0.12,
            tesla: 0.12,
          },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@WolfOfMiami99 JUST REACHED $420M NET WORTH.',
    },

    // ── DAY 29 ─────────────────────────────────────────────
    {
      day: 29,
      news: [
        {
          headline:
            'SLIGHT PULLBACK — PROFIT TAKING AFTER HISTORIC RUN',
          effects: {
            nasdaq: -0.03,
            biotech: -0.03,
            defense: -0.03,
            emerging: -0.03,
            oil: -0.03,
            uranium: -0.03,
            lithium: -0.03,
            gold: -0.03,
            coffee: -0.03,
            btc: -0.03,
            altcoins: -0.03,
            tesla: -0.03,
          },
          labelType: 'news',
        },
        {
          headline: 'APPLE REPORTS WORST QUARTER IN DECADE',
          effects: { nasdaq: -0.08, emerging: -0.03 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'VIRAL VIDEO: SQUIRREL ON TRADING FLOOR OUTPERFORMS 85% OF FUND MANAGERS',
    },

    // ── DAY 30 ─────────────────────────────────────────────
    {
      day: 30,
      news: [
        {
          headline: 'MARKETS CLOSE ON A HIGH — WHAT A RIDE',
          effects: { nasdaq: 0.02, btc: 0.02 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        "REPORT: THERAPISTS SAY 'ROLLERCOASTER' IS NOW A TRIGGER WORD ON WALL STREET",
    },
  ],
}
