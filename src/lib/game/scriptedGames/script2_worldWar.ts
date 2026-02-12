import type { ScriptedGameDefinition } from './types'

export const SCRIPTED_GAME_2: ScriptedGameDefinition = {
  id: 'script2_worldWar',
  title: 'World War III',
  days: [
    // ── Day 1 ──────────────────────────────────────────────
    {
      day: 1,
      news: [
        {
          headline: 'MARKETS OPEN — LIGHT VOLUME, TRADERS OPTIMISTIC',
          effects: { nasdaq: 0.05, btc: 0.04 },
          labelType: 'news',
        },
        {
          headline: 'CORPORATE EARNINGS SEASON KICKS OFF — ANALYSTS OPTIMISTIC',
          effects: { nasdaq: 0.03 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        "JAPAN'S OLDEST INVESTOR, 107, BEATS S&P 500 FOR 40TH CONSECUTIVE YEAR",
      priceNudges: [
        { assetId: 'nasdaq', nudge: 0.01 },
        { assetId: 'btc', nudge: 0.01 },
        { assetId: 'tesla', nudge: 0.01 },
        { assetId: 'emerging', nudge: 0.01 },
      ],
    },

    // ── Day 2 ──────────────────────────────────────────────
    {
      day: 2,
      news: [
        {
          headline: 'TRADE TALKS BETWEEN US AND EU MAKING PROGRESS',
          effects: { emerging: 0.07, nasdaq: 0.05 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'RIHANNA LAUNCHES COFFEE-BASED SKINCARE LINE',
    },

    // ── Day 3 ──────────────────────────────────────────────
    {
      day: 3,
      news: [
        {
          headline: 'TECH EARNINGS SEASON BEGINS — MIXED RESULTS',
          effects: { nasdaq: 0.04, biotech: 0.05 },
          labelType: 'news',
        },
        {
          headline:
            'SATELLITE IMAGERY SHOWS UNUSUAL RUSSIAN MILITARY BUILDUP NEAR BALTICS',
          effects: { defense: 0.06, gold: 0.04, nasdaq: -0.04 },
          labelType: 'rumor',
        },
      ],
      flavorHeadline:
        'ZUCKERBERG CHALLENGES BEZOS TO CAGE MATCH FOR CHARITY — PPV PRE-SALES HIT $1B',
    },

    // ── Day 4 ──────────────────────────────────────────────
    {
      day: 4,
      news: [
        {
          headline: 'OIL INVENTORIES LOWER THAN EXPECTED',
          effects: { oil: 0.08, gold: 0.04 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'POLAR BEARS EXTINCT — BULLISH FOR OIL',
      startupOffer: { tier: 'angel' },
    },

    // ── Day 5 ──────────────────────────────────────────────
    {
      day: 5,
      news: [
        {
          headline:
            'RUSSIA MOBILIZES 200,000 TROOPS NEAR BALTIC STATES',
          effects: {
            defense: 0.20,
            gold: 0.15,
            oil: 0.12,
            nasdaq: -0.12,
            btc: -0.08,
          },
          labelType: 'developing',
        },
      ],
      flavorHeadline:
        'JUST IN: PENTAGON HALTS ALL MEDIA BRIEFINGS — "NO COMMENT"',
      priceNudges: [
        { assetId: 'defense', nudge: 0.03 },
        { assetId: 'gold', nudge: 0.03 },
      ],
    },

    // ── Day 6 ──────────────────────────────────────────────
    {
      day: 6,
      news: [
        {
          headline: 'NATO CALLS EMERGENCY SUMMIT — ARTICLE 5 DISCUSSIONS',
          effects: {
            defense: 0.15,
            gold: 0.12,
            oil: 0.08,
            nasdaq: -0.08,
            emerging: -0.10,
          },
          labelType: 'news',
        },
        {
          headline:
            'DEFENSE CONTRACTOR SHARES HIT ALL-TIME HIGHS ACROSS THE BOARD',
          effects: { defense: 0.05 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@WolfOfWallSt99 JUST MADE $3.8M ON DEFENSE. SINGLE TRADE.',
    },

    // ── Day 7 ──────────────────────────────────────────────
    {
      day: 7,
      news: [
        {
          headline:
            'DIPLOMATIC TALKS FAIL — RUSSIA ISSUES ULTIMATUM TO LATVIA',
          effects: {
            defense: 0.12,
            gold: 0.10,
            nasdaq: -0.10,
            tesla: -0.08,
            btc: -0.06,
          },
          labelType: 'news',
        },
        {
          headline: 'TURKEY CLOSES BOSPHORUS STRAIT',
          effects: { oil: 0.14, defense: 0.10, gold: 0.08, emerging: -0.06 },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'POLYMARKET WHALES BETTING ON ESCALATION',
    },

    // ── Day 8 ──────────────────────────────────────────────
    {
      day: 8,
      news: [
        {
          headline:
            'RUSSIAN FORCES CROSS LATVIAN BORDER — WAR IN EUROPE',
          effects: {
            defense: 0.50,
            gold: 0.40,
            oil: 0.45,
            nasdaq: -0.40,
            tesla: -0.45,
            btc: -0.30,
            emerging: -0.35,
            lithium: -0.25,
          },
          labelType: 'breaking',
        },
      ],
      flavorHeadline: 'REPORT: STOCK EXCHANGES CONSIDER EMERGENCY SHUTDOWN',
      priceNudges: [
        { assetId: 'gold', nudge: 0.05 },
        { assetId: 'nasdaq', nudge: -0.06 },
      ],
    },

    // ── Day 9 ──────────────────────────────────────────────
    {
      day: 9,
      news: [
        {
          headline:
            'NATO ACTIVATES ARTICLE 5 — ALL MEMBER STATES AT WAR WITH RUSSIA',
          effects: {
            defense: 0.30,
            gold: 0.22,
            oil: 0.28,
            nasdaq: -0.25,
            btc: -0.20,
            altcoins: -0.28,
            uranium: 0.18,
          },
          labelType: 'news',
        },
        {
          headline: 'NORD STREAM PIPELINE SABOTAGED',
          effects: { oil: 0.15, gold: 0.08, defense: 0.08, uranium: 0.10 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@TechTrader_sf JUST LOST $22M IN A SINGLE TRADE.',
    },

    // ── Day 10 ─────────────────────────────────────────────
    {
      day: 10,
      news: [
        {
          headline:
            'EUROPEAN MARKETS HALTED — CIRCUIT BREAKERS TRIGGERED',
          effects: {
            nasdaq: -0.20,
            emerging: -0.22,
            coffee: 0.18,
            gold: 0.15,
            oil: 0.15,
          },
          labelType: 'news',
        },
        {
          headline: 'DOCKWORKERS STRIKE SHUTS DOWN 30 PORTS',
          effects: {
            oil: 0.05,
            coffee: 0.06,
            gold: 0.04,
            nasdaq: -0.04,
            emerging: -0.05,
          },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'HEDGE FUND REPLACES ALL ANALYSTS WITH AI — AI SAYS "SELL EVERYTHING"',
    },

    // ── Day 11 ─────────────────────────────────────────────
    {
      day: 11,
      news: [
        {
          headline:
            'ENERGY CRISIS — OIL SURGES AS RUSSIAN SUPPLY CUT OFF',
          effects: {
            oil: 0.25,
            gold: 0.12,
            uranium: 0.18,
            nasdaq: -0.12,
            tesla: -0.15,
            lithium: -0.12,
          },
          labelType: 'news',
        },
        {
          headline:
            'UNCONFIRMED: CHINESE NAVAL FORCES MASSING IN SOUTH CHINA SEA',
          effects: {
            defense: 0.08,
            gold: 0.06,
            nasdaq: -0.06,
            lithium: -0.08,
          },
          labelType: 'rumor',
        },
      ],
      flavorHeadline:
        '@DubaiWhale42 JUST MADE $14M ON OIL. SINGLE TRADE.',
    },

    // ── Day 12 ─────────────────────────────────────────────
    {
      day: 12,
      news: [
        {
          headline:
            'SANCTIONS DEVASTATE GLOBAL SUPPLY CHAINS — RECESSION WARNINGS',
          effects: {
            emerging: -0.18,
            coffee: 0.15,
            nasdaq: -0.08,
            defense: 0.12,
          },
          labelType: 'news',
        },
        {
          headline: 'SHIPPING CRISIS: COFFEE CONTAINERS STRANDED',
          effects: { coffee: 0.06, oil: 0.03, emerging: -0.02 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'JUST IN: HEDGE FUND MANAGER MOVES FAMILY TO NEW ZEALAND',
    },

    // ── Day 13 ─────────────────────────────────────────────
    {
      day: 13,
      news: [
        {
          headline:
            'CHINA LAUNCHES INVASION OF TAIWAN — TWO-FRONT WORLD WAR',
          effects: {
            nasdaq: -0.45,
            tesla: -0.38,
            lithium: -0.45,
            btc: -0.22,
            defense: 0.40,
            gold: 0.35,
            oil: 0.28,
          },
          labelType: 'breaking',
        },
      ],
      flavorHeadline:
        'REPORT: GOOGLE SEARCHES FOR "NUCLEAR BUNKER" UP 10,000%',
      priceNudges: [
        { assetId: 'nasdaq', nudge: -0.08 },
        { assetId: 'gold', nudge: 0.06 },
      ],
    },

    // ── Day 14 ─────────────────────────────────────────────
    {
      day: 14,
      news: [
        {
          headline:
            'SEMICONDUCTOR SUPPLY DESTROYED — CHIP SHORTAGE CATASTROPHIC',
          effects: {
            nasdaq: -0.28,
            tesla: -0.22,
            biotech: -0.15,
            defense: 0.20,
            gold: 0.20,
          },
          labelType: 'developing',
        },
        {
          headline: 'AI CHIP SHORTAGE HALTS DATA CENTER BUILDS',
          effects: { nasdaq: -0.08, btc: -0.03, lithium: 0.04 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@MoonMan_la JUST GOT LIQUIDATED. LOST $45M.',
    },

    // ── Day 15 ─────────────────────────────────────────────
    {
      day: 15,
      news: [
        {
          headline:
            'GOLD HITS ALL-TIME HIGH — SAFE HAVEN DEMAND UNPRECEDENTED',
          effects: {
            gold: 0.22,
            oil: 0.12,
            defense: 0.10,
            nasdaq: -0.12,
          },
          labelType: 'news',
        },
        {
          headline:
            'CENTRAL BANKS BUYING RECORD GOLD — DE-DOLLARIZATION ACCELERATES',
          effects: { gold: 0.08 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@GoldKing_zurich JUST REACHED $180M NET WORTH.',
    },

    // ── Day 16 ─────────────────────────────────────────────
    {
      day: 16,
      news: [
        {
          headline:
            'UN EMERGENCY SESSION — CEASEFIRE RESOLUTION VETOED BY RUSSIA AND CHINA',
          effects: {
            defense: 0.08,
            gold: 0.08,
            nasdaq: -0.08,
            emerging: -0.12,
          },
          labelType: 'news',
        },
        {
          headline: 'CYBER MERCENARY GROUP HACKS 40 CENTRAL BANKS',
          effects: {
            gold: 0.14,
            btc: 0.12,
            defense: 0.10,
            nasdaq: -0.12,
            emerging: -0.10,
          },
          labelType: 'developing',
        },
      ],
      flavorHeadline:
        'ROGAN BRINGS ON RETIRED GENERAL — 8 HOUR EPISODE',
    },

    // ── Day 17 ─────────────────────────────────────────────
    {
      day: 17,
      news: [
        {
          headline: 'NUCLEAR THREAT LEVEL RAISED — DEFCON 2',
          effects: {
            gold: 0.20,
            defense: 0.12,
            btc: 0.18,
            nasdaq: -0.15,
            tesla: -0.12,
          },
          labelType: 'developing',
        },
        {
          headline:
            'SOURCES: MICROSTRATEGY FACING MARGIN CALL ON MASSIVE BTC POSITION',
          effects: {
            btc: -0.10,
            altcoins: -0.12,
            nasdaq: -0.03,
            gold: 0.04,
          },
          labelType: 'rumor',
        },
      ],
      flavorHeadline:
        '@SilentBob_chi LOST $28M THIS WEEK. ACCOUNT ALMOST WIPED.',
      priceNudges: [{ assetId: 'gold', nudge: 0.04 }],
      encounter: 'kidney',
    },

    // ── Day 18 ─────────────────────────────────────────────
    {
      day: 18,
      news: [
        {
          headline:
            'BITCOIN SURGES AS ALTERNATIVE SAFE HAVEN — "DIGITAL GOLD"',
          effects: {
            btc: 0.22,
            altcoins: 0.15,
            gold: 0.08,
            nasdaq: -0.06,
          },
          labelType: 'news',
        },
        {
          headline:
            'MICROSTRATEGY AVOIDS MARGIN CALL — SECURES EMERGENCY FUNDING',
          effects: { btc: 0.14, altcoins: 0.20, nasdaq: 0.04 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        "POPE ENDORSES BITCOIN IN SUNDAY SERMON — 'RENDER UNTO THE BLOCKCHAIN'",
    },

    // ── Day 19 ─────────────────────────────────────────────
    {
      day: 19,
      news: [
        {
          headline:
            'BACKCHANNEL TALKS — US AND CHINA AGREE TO SECRET NEGOTIATIONS',
          effects: {
            nasdaq: 0.12,
            emerging: 0.08,
            gold: -0.08,
            defense: -0.06,
          },
          labelType: 'rumor',
        },
      ],
      flavorHeadline:
        "BILLIONAIRE PROPOSES TAXING PEOPLE WHO DON'T INVEST — 'IDLE CASH IS THEFT'",
    },

    // ── Day 20 ─────────────────────────────────────────────
    {
      day: 20,
      news: [
        {
          headline:
            'CEASEFIRE IN BALTICS — RUSSIA AGREES TO WITHDRAW FROM LATVIA',
          effects: {
            nasdaq: 0.25,
            emerging: 0.15,
            gold: -0.18,
            defense: -0.12,
            oil: -0.12,
          },
          labelType: 'news',
        },
        {
          headline:
            'TRADERS RUSHING BACK INTO TECH — "THE WAR IS OVER" NARRATIVE',
          effects: { nasdaq: 0.08, tesla: 0.06 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'REPORT: CHAMPAGNE SALES IN FINANCIAL DISTRICT UP 800% IN ONE HOUR',
    },

    // ── Day 21 ─────────────────────────────────────────────
    {
      day: 21,
      news: [
        {
          headline:
            'TAIWAN STRAIT CEASEFIRE — CHINA PULLS BACK NAVAL FORCES',
          effects: {
            nasdaq: 0.30,
            tesla: 0.25,
            lithium: 0.20,
            btc: 0.15,
            gold: -0.18,
            defense: -0.15,
            oil: -0.15,
          },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@DiamondHands420 JUST MADE $8.5M ON TESLA. SINGLE TRADE.',
    },

    // ── Day 22 ─────────────────────────────────────────────
    {
      day: 22,
      news: [
        {
          headline:
            'RECONSTRUCTION BEGINS — MASSIVE DEFENSE SPENDING CONTINUES',
          effects: {
            defense: 0.12,
            nasdaq: 0.12,
            emerging: 0.08,
            lithium: 0.12,
          },
          labelType: 'news',
        },
        {
          headline: 'CENTRAL BANKS ANNOUNCE COORDINATED RATE CUTS',
          effects: {
            nasdaq: 0.07,
            btc: 0.05,
            tesla: 0.06,
            emerging: 0.05,
            gold: 0.04,
          },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'CONGRESS MEMBER CAUGHT DAY-TRADING DURING HEARING ON BANNING CONGRESS FROM TRADING',
      encounter: 'sec',
    },

    // ── Day 23 ─────────────────────────────────────────────
    {
      day: 23,
      news: [
        {
          headline:
            'SEMICONDUCTOR REBUILDING — TSMC ANNOUNCES NEW FABS IN US AND JAPAN',
          effects: { nasdaq: 0.15, tesla: 0.12, biotech: 0.08 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        '@SteadySteve_dc JUST MADE $5.1M ON NASDAQ. SINGLE TRADE.',
    },

    // ── Day 24 ─────────────────────────────────────────────
    {
      day: 24,
      news: [
        {
          headline: 'POST-WAR COMMODITY UNWIND — OIL CRASHES BACK',
          effects: {
            oil: -0.22,
            gold: -0.15,
            emerging: 0.12,
            nasdaq: 0.08,
          },
          labelType: 'news',
        },
        {
          headline: 'MASSIVE SHORT SQUEEZE — BEARS TRAPPED IN RECOVERY RALLY',
          effects: {
            nasdaq: 0.08,
            btc: 0.06,
            altcoins: 0.08,
            tesla: 0.07,
          },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'WARREN BUFFETT CLAIMS ASSETS ARE OVERVALUED',
    },

    // ── Day 25 ─────────────────────────────────────────────
    {
      day: 25,
      news: [
        {
          headline: 'GLOBAL MARKETS RECOVERING — BEST WEEK IN HISTORY',
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
        '@CryptoKing99 JUST REACHED $340M NET WORTH.',
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
      encounter: 'roulette',
    },

    // ── Day 26 ─────────────────────────────────────────────
    {
      day: 26,
      news: [
        {
          headline:
            'NEW WORLD ORDER — NATO EXPANDS, DEFENSE BUDGETS TRIPLE',
          effects: { defense: 0.18, uranium: 0.15, nasdaq: 0.06 },
          labelType: 'news',
        },
        {
          headline: 'JAPAN RESTARTS 12 NUCLEAR REACTORS',
          effects: { uranium: 0.10, oil: -0.03 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        "FLORIDA MAN ACCIDENTALLY BUYS $2M IN URANIUM FUTURES — 'I THOUGHT IT WAS CRYPTO'",
    },

    // ── Day 27 ─────────────────────────────────────────────
    {
      day: 27,
      news: [
        {
          headline:
            'PEACE TREATY SIGNED — FORMAL END TO HOSTILITIES',
          effects: {
            nasdaq: 0.12,
            emerging: 0.12,
            tesla: 0.08,
            gold: -0.08,
          },
          labelType: 'news',
        },
      ],
      flavorHeadline: 'JEFF BEZOS SPOTTED PARTYING IN SAINT-TROPEZ',
    },

    // ── Day 28 ─────────────────────────────────────────────
    {
      day: 28,
      news: [
        {
          headline: 'MARKETS STABILIZE — NEW NORMAL TAKES SHAPE',
          effects: {},
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'REPORT: AVERAGE RETAIL TRADER HOLDS POSITION FOR 47 SECONDS',
      priceNudges: [
        { assetId: 'nasdaq', nudge: 0.02 },
        { assetId: 'biotech', nudge: 0.01 },
        { assetId: 'defense', nudge: 0.02 },
        { assetId: 'emerging', nudge: 0.01 },
        { assetId: 'oil', nudge: 0.01 },
        { assetId: 'uranium', nudge: 0.01 },
        { assetId: 'lithium', nudge: 0.01 },
        { assetId: 'gold', nudge: 0.01 },
        { assetId: 'coffee', nudge: 0.01 },
        { assetId: 'btc', nudge: 0.02 },
        { assetId: 'altcoins', nudge: 0.01 },
        { assetId: 'tesla', nudge: 0.02 },
      ],
    },

    // ── Day 29 ─────────────────────────────────────────────
    {
      day: 29,
      news: [
        {
          headline:
            'RECONSTRUCTION BOOM — INFRASTRUCTURE SPENDING AT RECORD',
          effects: {
            defense: 0.08,
            lithium: 0.08,
            emerging: 0.08,
            nasdaq: 0.06,
          },
          labelType: 'news',
        },
        {
          headline: 'INSTITUTIONAL BUYERS FLOOD MARKET',
          effects: {
            nasdaq: 0.06,
            btc: 0.04,
            altcoins: 0.05,
            tesla: 0.04,
            emerging: 0.04,
          },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'JUST IN: THERAPISTS IN FINANCIAL DISTRICT BOOKED THROUGH 2027',
    },

    // ── Day 30 ─────────────────────────────────────────────
    {
      day: 30,
      news: [
        {
          headline: 'MARKETS CLOSE — SCARS REMAIN BUT HOPE RETURNS',
          effects: { nasdaq: 0.02 },
          labelType: 'news',
        },
      ],
      flavorHeadline:
        'STUDY: TRADING STOCKS ACTIVATES SAME BRAIN REGIONS AS GAMBLING AND COCAINE',
    },
  ],
}
