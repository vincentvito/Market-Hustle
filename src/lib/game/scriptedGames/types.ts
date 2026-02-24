import type { NewsLabelType, EncounterType } from '../types'

export interface ScriptedNewsItem {
  headline: string
  effects: Record<string, number>
  labelType: NewsLabelType
}

export interface ScriptedDay {
  day: number                                              // 1-30
  news: ScriptedNewsItem[]                                 // 1-3 headlines
  priceNudges?: { assetId: string; nudge: number }[]       // invisible price steering
  flavorHeadline?: string                                  // optional gossip/meme line
  encounter?: EncounterType                                // force this encounter before this day's news
  startupOffer?: { tier: 'angel' | 'vc' }                 // force a startup offer on this day
}

export interface ScriptedGameDefinition {
  id: string
  title: string
  days: ScriptedDay[]                                      // exactly 30 entries
  initialPrices?: Record<string, number>                   // optional fixed starting prices
}
