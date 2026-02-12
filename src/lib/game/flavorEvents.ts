// Flavor events - meme/celebrity news with small market effects
// These appear in secondary slot alongside primary news (~30% of non-quiet days)
// Effects intentionally sum with primary event effects
// ALL flavor effects capped at +/-3% — gossip should nudge, not move markets

export interface FlavorEvent {
  headline: string
  effects: Record<string, number>
}

export const FLAVOR_EVENTS: FlavorEvent[] = [
  // Meme events - exact headlines as provided
  { headline: "GENZ DISCOVERS GOLD AS 'VINTAGE INVESTING'", effects: { gold: 0.03 } },
  { headline: "TIKTOK TREND - MICRODOSING LITHIUM FOR FOCUS", effects: { lithium: 0.03 } },
  { headline: "JEFF BEZOS SPOTTED PARTYING IN MIAMI", effects: { nasdaq: 0.01 } },
  { headline: "RIHANNA LAUNCHES COFFEE-BASED SKINCARE LINE", effects: { coffee: 0.03 } },
  { headline: "STUDY - LOOKING AT GOLD REDUCES ANXIETY", effects: { gold: 0.02 } },
  { headline: "GENZ REPORT - DRINKING IS BACK", effects: { coffee: -0.02, emerging: 0.01 } }, // Also boosts Iron Oak via LIFESTYLE_EFFECTS
  { headline: "CRAFT BEER RENAISSANCE - MILLENNIALS DITCH HARD SELTZER", effects: { coffee: -0.02 } }, // Boosts Iron Oak via LIFESTYLE_EFFECTS
  { headline: "CHIANTI CLASSICO WINS WORLD'S BEST WINE - PRICES SURGE", effects: { emerging: 0.02 } }, // Boosts Tenuta via LIFESTYLE_EFFECTS
  { headline: "ITALIAN WINE EXPORTS HIT ALL-TIME HIGH", effects: { emerging: 0.01 } }, // Boosts Tenuta via LIFESTYLE_EFFECTS
  { headline: "REPORT - FENTANYL MIGHT CURE DEPRESSION", effects: { biotech: 0.03 } },
  { headline: "TAYLOR SWIFT PROMOTES COFFEE DIET ON INSTAGRAM", effects: { coffee: 0.03 } },
  { headline: "JIM CRAMER SAYS TO SELL", effects: { nasdaq: 0.03 } },
  { headline: "WARREN BUFFETT CLAIMS ASSETS ARE OVERVALUED", effects: { nasdaq: -0.03, gold: 0.02 } },
  { headline: "CONGRESS GRILLS AI CEOS - REGULATION FEARS SPIKE", effects: { nasdaq: -0.03, tesla: -0.02 } },
  { headline: "ROGAN BRINGS VACCINE SKEPTIC ON - 6 HOUR EPISODE", effects: { biotech: -0.03 } },
  { headline: "MR BEAST BUYS ENTIRE GOLD MINE FOR VIDEO", effects: { gold: 0.02 } },
  { headline: "HEDGE FUND MANAGER SEEN CRYING IN LAMBO", effects: { nasdaq: -0.01 } },
  { headline: "MILLENNIAL HOMEBUYERS GIVE UP, BUY CRYPTO INSTEAD", effects: { btc: 0.03, altcoins: 0.03 } },
  { headline: "POLYMARKET WHALES BETTING ON ASTEROID IMPACT", effects: { gold: 0.02 } },
  { headline: "POLAR BEARS EXTINCT - BULLISH FOR OIL", effects: { oil: 0.02 } },
  { headline: "JIM CRAMER SAYS TO BUY", effects: { nasdaq: -0.03 } },
  { headline: "ELON MUSK CLAIMS GDP WILL GROW 100X THANKS TO HUMANOID ROBOTS", effects: { tesla: 0.03 } },
  { headline: "JEFF BEZOS SPOTTED PARTYING IN SAINT-TROPEZ", effects: { nasdaq: 0.01 } },
  { headline: "META HIRES 17-YEAR-OLD TO LEAD AI EFFORTS", effects: { nasdaq: 0.02 } },
  { headline: "AMAZON LAUNCHES DRONE DELIVERY IN EUROPE", effects: { nasdaq: 0.02 } },
  { headline: "EU MANDATES 67.3°C ESPRESSO TEMPERATURE", effects: { coffee: -0.02 } },
  { headline: "EU PROPOSES MANDATORY 47-CHARACTER PASSWORDS", effects: { nasdaq: -0.02 } },
  { headline: "POPE ENDORSES BITCOIN IN SUNDAY SERMON — 'RENDER UNTO THE BLOCKCHAIN'", effects: { btc: 0.02, altcoins: 0.01 } },
  { headline: "FLORIDA MAN ACCIDENTALLY BUYS $2M IN URANIUM FUTURES — 'I THOUGHT IT WAS CRYPTO'", effects: { uranium: 0.02 } },
  { headline: "STUDY: TRADING STOCKS ACTIVATES SAME BRAIN REGIONS AS GAMBLING AND COCAINE", effects: { btc: 0.01 } },
  { headline: "TIKTOK TREND: GEN-ALPHA KIDS DOING 'MARGIN CALL CHALLENGES' ON PARENTS' BROKERAGES", effects: { nasdaq: -0.01 } },
  { headline: "ELON CHANGES TWITTER NAME TO 'CHIEF SHITPOSTING OFFICER' — TESLA BOARD SILENT", effects: { tesla: 0.02 } },
  { headline: "JAPAN'S OLDEST INVESTOR, 107, BEATS S&P 500 FOR 40TH CONSECUTIVE YEAR", effects: { nasdaq: 0.01 } },
  { headline: "HEDGE FUND REPLACES ALL ANALYSTS WITH AI — UNDERPERFORMS INDEX BY 30%", effects: { nasdaq: 0.02 } },
  { headline: "ZUCKERBERG CHALLENGES BEZOS TO CAGE MATCH FOR CHARITY — PPV PRE-SALES HIT $1B", effects: { nasdaq: 0.02 } },
  { headline: "CONGRESS MEMBER CAUGHT DAY-TRADING DURING HEARING ON BANNING CONGRESS FROM TRADING", effects: { nasdaq: -0.01 } },
  { headline: "AI CHATBOT CONVINCES 50,000 PEOPLE TO MAX OUT CREDIT CARDS ON CRYPTO", effects: { btc: 0.02, altcoins: 0.02 } },
  { headline: "MCDONALDS LAUNCHES MCBITCOIN MEAL — COMES WITH PAPER WALLET AND FRIES", effects: { btc: 0.02 } },
  { headline: "BILLIONAIRE PROPOSES TAXING PEOPLE WHO DON'T INVEST — 'IDLE CASH IS THEFT'", effects: { btc: 0.01 } },
  { headline: "REPORT: AVERAGE RETAIL TRADER HOLDS POSITION FOR 47 SECONDS", effects: { nasdaq: -0.01 } },
  { headline: "VIRAL VIDEO: SQUIRREL ON TRADING FLOOR OUTPERFORMS 85% OF FUND MANAGERS", effects: { nasdaq: -0.01 } },
]

/**
 * Select a random flavor event that hasn't been used this game.
 * Returns null if all flavor events have been used.
 */
export function selectFlavorEvent(usedHeadlines: string[]): FlavorEvent | null {
  const available = FLAVOR_EVENTS.filter(e => !usedHeadlines.includes(e.headline))
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}
