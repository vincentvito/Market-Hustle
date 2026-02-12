// Scripted game system — curated first 3 games for new players
// After 3 plays, normal random generation kicks in

import type { NewsLabelType, EncounterType } from '../types'

/** A single scripted news item for one day */
export interface ScriptedNewsItem {
  headline: string
  effects: Record<string, number>
  labelType: NewsLabelType
}

/** A single day in a scripted game */
export interface ScriptedDay {
  day: number                                              // 1-30
  news: ScriptedNewsItem[]                                 // 1-3 headlines
  priceNudges?: { assetId: string; nudge: number }[]       // invisible price steering
  flavorHeadline?: string                                  // optional gossip/meme line
  encounter?: EncounterType                                // force this encounter before this day's news
  startupOffer?: { tier: 'angel' | 'vc' }                 // force a startup offer on this day
}

/** Complete definition of one scripted game */
export interface ScriptedGameDefinition {
  id: string
  title: string
  days: ScriptedDay[]                                      // exactly 30 entries
  initialPrices?: Record<string, number>                   // optional fixed starting prices
}
