export const dynamic = 'force-dynamic'

import { verifyAdmin } from '@/lib/admin/auth'
import { parseClaudeJSON, validateScriptedDays } from '@/lib/admin/validateScenario'
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a scenario author for Market Hustle, a financial trading game. You generate scripted game content in strict JSON format.

## Game Context
- Players start with $100,000 cash and trade assets over 30/45/60 days
- Goal: grow net worth. Players can buy/sell assets whose prices move based on news effects
- Each day has 1-3 news headlines that move asset prices via percentage effects
- The game should feel like a dramatic story with setups, rising tension, climaxes, and resolutions

## Available Assets (id -> name, base price, volatility)
- nasdaq: NASDAQ ($380, 4%) — US tech index
- biotech: BIOTECH ETF ($85, 8%) — pharma/biotech sector
- defense: DEFENSE ETF ($120, 5%) — military/defense companies
- emerging: EMERGING MKT ($42, 5%) — developing markets
- oil: OIL ($78, 6%) — crude oil
- uranium: URANIUM ($65, 7%) — nuclear energy fuel
- lithium: LITHIUM ($38, 8%) — battery/EV supply chain
- gold: GOLD ($1950, 2%) — safe haven, rallies in crises
- coffee: COFFEE ($4.20, 5%) — agricultural commodity
- btc: BTC ($43000, 10%) — Bitcoin, highly volatile
- altcoins: ALTCOINS ($12, 15%) — smaller crypto, extreme volatility
- tesla: $TESLA ($245, 12%) — Elon Musk's company, meme-ish

## Effect Ranges (percentage as decimal)
- Tiny: 0.01 to 0.03 (1-3%) — background noise, flavor
- Small: 0.03 to 0.06 (3-6%) — minor news
- Medium: 0.08 to 0.15 (8-15%) — significant events
- Large: 0.15 to 0.30 (15-30%) — major events, rare
- Extreme: 0.30 to 0.50 (30-50%) — black swan, once per game MAX
- Use negative values for drops
- Multiple effects per headline: show cross-asset correlation (oil crash helps consumers, hurts energy)

## Correlations to Remember
- Geopolitical tension: gold UP, defense UP, oil UP, nasdaq DOWN, emerging DOWN
- Tech boom: nasdaq UP, tesla UP, btc UP, gold DOWN
- Fed rate cut: nasdaq UP, btc UP, gold UP, emerging UP
- Fed rate hike: nasdaq DOWN, btc DOWN, gold DOWN, defense neutral
- Crypto rally: btc UP, altcoins UP (bigger), tesla UP (sentiment correlation)
- Recession fears: gold UP, defense UP, nasdaq DOWN, emerging DOWN, oil DOWN

## Label Types
- 'news': Confirmed factual event (most common)
- 'rumor': Unconfirmed speculation (smaller effects, creates anticipation)
- 'gossip': Celebrity/meme news (tiny effects, humor)

## Encounters (optional, max 2-3 per scenario, space 8+ days apart)
Valid types: 'sec' | 'divorce' | 'shitcoin' | 'kidney' | 'roulette' | 'tax'

## Startup Offers (optional, max 2-3 per scenario)
Valid tiers: 'angel' (cheap, risky) | 'vc' (expensive, safer)

## Price Nudges (optional per day)
Invisible price adjustments not shown in news. Use for gradual trends between events.
Format: { assetId: string, nudge: number } — small values only (0.01-0.03)

## Flavor Headlines (optional, string, no effects)
Meme/celebrity gossip. ALL CAPS, terse style. Examples:
"ELON SHITPOSTS DOGE MEME AT 3AM"
"JIM CRAMER SAYS THIS IS THE BOTTOM"
"HEDGE FUND MANAGER SEEN CRYING IN LAMBO"

## Narrative Structure Guidelines
1. **Act 1 (first 20%)**: Setup. Establish the world, gentle moves, seed foreshadowing
2. **Act 2a (20-50%)**: Rising action. Introduce the main conflict/theme, escalate stakes
3. **Act 2b (50-75%)**: Complications. Things get worse/more complex, test the player
4. **Act 3 (75-100%)**: Climax + resolution. Maximum drama, then wind down

## Writing Rules
- Headlines are ALL CAPS, terse, newspaper style (no periods)
- Every day MUST have at least 1 news item
- Busy/dramatic days should have 2-3 items
- Quiet days have 1 small item (markets trade sideways)
- Don't put two major crashes on consecutive days — let players breathe
- Use rumors to foreshadow events (Day N: rumor, Day N+2: confirmation)
- Create comebacks — if player gets crushed, give hope a few days later
- End the scenario with resolution, not mid-crisis

## Output Format
Return ONLY a valid JSON array of objects. No markdown, no explanation.
Each object: { "day": number, "news": [...], "priceNudges"?: [...], "flavorHeadline"?: string, "encounter"?: string, "startupOffer"?: { "tier": string } }
Each news item: { "headline": string, "effects": { "assetId": number, ... }, "labelType": string }`

// POST /api/admin/scenarios/generate — generate content via Claude
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, prompt, duration, dayRange, existingDays } = body

    if (!(await verifyAdmin(email))) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
    }

    // Build user prompt
    let userPrompt = ''

    if (dayRange) {
      userPrompt = `Generate days ${dayRange.start} through ${dayRange.end} for a ${duration}-day scenario.\n\n`
      userPrompt += `Theme/Direction: ${prompt}\n\n`
      if (existingDays && existingDays.length > 0) {
        // Include nearby existing days as context
        const contextDays = existingDays.filter(
          (d: { day: number; news: unknown[] }) =>
            d && d.news && d.news.length > 0 &&
            d.day >= dayRange.start - 3 && d.day <= dayRange.end + 3
        )
        if (contextDays.length > 0) {
          userPrompt += `Here are nearby already-authored days for narrative context:\n${JSON.stringify(contextDays, null, 2)}\n\n`
        }
      }
      userPrompt += `Generate ONLY days ${dayRange.start} through ${dayRange.end}. Make the content flow naturally with the existing context.`
    } else {
      userPrompt = `Generate a complete ${duration}-day scenario.\n\n`
      userPrompt += `Theme/Direction: ${prompt}\n\n`
      userPrompt += `Create a dramatic, coherent ${duration}-day storyline. Include foreshadowing, escalation, a climax, and resolution. Make it feel like a movie.`
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 16000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Claude API error:', response.status, errText)
      return NextResponse.json(
        { error: `Claude API error: ${response.status}` },
        { status: 502 }
      )
    }

    const data = await response.json()
    const rawText = data.content?.[0]?.text
    if (!rawText) {
      return NextResponse.json({ error: 'Empty response from Claude' }, { status: 502 })
    }

    // Parse and validate
    let days: unknown[]
    try {
      days = parseClaudeJSON(rawText) as unknown[]
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse Claude response as JSON', raw: rawText.slice(0, 500) },
        { status: 422 }
      )
    }

    const { valid, errors } = validateScriptedDays(days, duration)

    return NextResponse.json({
      days,
      valid,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Generate scenario error:', error)
    return NextResponse.json({ error: 'Failed to generate scenario' }, { status: 500 })
  }
}
