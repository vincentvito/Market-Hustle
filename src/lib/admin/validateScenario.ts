import type { ScriptedDay, ScriptedNewsItem } from '@/lib/game/scriptedGames/types'

const VALID_ASSET_IDS = [
  'nasdaq', 'biotech', 'defense', 'emerging', 'oil', 'uranium',
  'lithium', 'gold', 'coffee', 'btc', 'altcoins', 'tesla',
]

const VALID_LABEL_TYPES = ['news', 'rumor', 'gossip', 'breaking', 'developing', 'scheduled', 'none']

const VALID_ENCOUNTERS = ['sec', 'divorce', 'shitcoin', 'kidney', 'roulette', 'tax']

const VALID_STARTUP_TIERS = ['angel', 'vc']

export function validateScriptedDays(
  days: unknown[],
  expectedDuration: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!Array.isArray(days)) {
    return { valid: false, errors: ['days must be an array'] }
  }

  if (days.length > expectedDuration) {
    errors.push(`Too many days: got ${days.length}, expected max ${expectedDuration}`)
  }

  for (let i = 0; i < days.length; i++) {
    const day = days[i] as Record<string, unknown>
    const label = `Day ${(day?.day as number) ?? i + 1}`

    if (!day || typeof day !== 'object') {
      errors.push(`${label}: must be an object`)
      continue
    }

    if (typeof day.day !== 'number' || day.day < 1 || day.day > expectedDuration) {
      errors.push(`${label}: day number must be 1-${expectedDuration}`)
    }

    if (!Array.isArray(day.news) || day.news.length === 0) {
      errors.push(`${label}: must have at least 1 news item`)
      continue
    }

    for (let j = 0; j < (day.news as unknown[]).length; j++) {
      const item = (day.news as Record<string, unknown>[])[j]
      const itemLabel = `${label}, News ${j + 1}`

      if (!item.headline || typeof item.headline !== 'string') {
        errors.push(`${itemLabel}: headline is required`)
      }

      if (!item.effects || typeof item.effects !== 'object') {
        errors.push(`${itemLabel}: effects must be an object`)
      } else {
        for (const [assetId, value] of Object.entries(item.effects as Record<string, unknown>)) {
          if (!VALID_ASSET_IDS.includes(assetId)) {
            errors.push(`${itemLabel}: invalid asset ID "${assetId}"`)
          }
          if (typeof value !== 'number') {
            errors.push(`${itemLabel}: effect for "${assetId}" must be a number`)
          }
        }
      }

      if (!item.labelType || !VALID_LABEL_TYPES.includes(item.labelType as string)) {
        errors.push(`${itemLabel}: labelType must be one of ${VALID_LABEL_TYPES.join(', ')}`)
      }
    }

    if (day.encounter && !VALID_ENCOUNTERS.includes(day.encounter as string)) {
      errors.push(`${label}: invalid encounter type "${day.encounter}"`)
    }

    if (day.startupOffer) {
      const offer = day.startupOffer as Record<string, unknown>
      if (!offer.tier || !VALID_STARTUP_TIERS.includes(offer.tier as string)) {
        errors.push(`${label}: startupOffer.tier must be "angel" or "vc"`)
      }
    }

    if (day.priceNudges && Array.isArray(day.priceNudges)) {
      for (const nudge of day.priceNudges as Record<string, unknown>[]) {
        if (!VALID_ASSET_IDS.includes(nudge.assetId as string)) {
          errors.push(`${label}: invalid priceNudge asset "${nudge.assetId}"`)
        }
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

/** Parse Claude's response, handling markdown code blocks */
export function parseClaudeJSON(raw: string): unknown {
  let cleaned = raw.trim()
  // Strip markdown code blocks
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  return JSON.parse(cleaned)
}

export { VALID_ASSET_IDS, VALID_LABEL_TYPES, VALID_ENCOUNTERS, VALID_STARTUP_TIERS }
