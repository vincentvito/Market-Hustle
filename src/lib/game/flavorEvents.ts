// Flavor events - meme/celebrity news with small market effects
// These appear in secondary slot alongside primary news (~30% of non-quiet days)
// Effects intentionally sum with primary event effects

export interface FlavorEvent {
  headline: string
  effects: Record<string, number>
}

export const FLAVOR_EVENTS: FlavorEvent[] = [
  // Meme events - exact headlines as provided
  { headline: "GENZ DISCOVERS GOLD AS 'VINTAGE INVESTING'", effects: { gold: 0.10 } },
  { headline: "TIKTOK TREND - MICRODOSING LITHIUM FOR FOCUS", effects: { lithium: 0.15 } },
  { headline: "JEFF BEZOS SPOTTED PARTYING IN MIAMI", effects: {} },
  { headline: "RIHANNA LAUNCHES COFFEE-BASED SKINCARE LINE", effects: { coffee: 0.15 } },
  { headline: "STUDY - LOOKING AT GOLD REDUCES ANXIETY", effects: { gold: 0.08 } },
  { headline: "GENZ REPORT - DRINKING IS BACK", effects: { coffee: -0.05, emerging: 0.03 } },
  { headline: "REPORT - FENTANYL MIGHT CURE DEPRESSION", effects: { biotech: 0.12 } },
  { headline: "TAYLOR SWIFT PROMOTES COFFEE DIET ON INSTAGRAM", effects: { coffee: 0.25 } },
  { headline: "JIM CRAMER SAYS TO SELL - MARKETS RALLY", effects: { nasdaq: 0.10 } },
  { headline: "WARREN BUFFETT CLAIMS ASSETS ARE OVERVALUED", effects: { nasdaq: -0.08, gold: 0.05 } },
  { headline: "CONGRESS GRILLS AI CEOS - REGULATION FEARS SPIKE", effects: { nasdaq: -0.10, tesla: -0.08 } },
  { headline: "ROGAN BRINGS VACCINE SKEPTIC ON - 6 HOUR EPISODE", effects: { biotech: -0.11 } },
  { headline: "MR BEAST BUYS ENTIRE GOLD MINE FOR VIDEO", effects: { gold: 0.05 } },
  { headline: "HEDGE FUND MANAGER SEEN CRYING IN LAMBO", effects: {} },
  { headline: "MILLENNIAL HOMEBUYERS GIVE UP, BUY CRYPTO INSTEAD", effects: { btc: 0.08, altcoins: 0.10 } },
  { headline: "POLYMARKET WHALES BETTING ON ASTEROID IMPACT", effects: { gold: 0.05 } },
  { headline: "POLAR BEARS EXTINCT - BULLISH FOR OIL", effects: { oil: -0.05 } },
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
