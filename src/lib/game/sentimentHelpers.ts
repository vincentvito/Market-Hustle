// =============================================================================
// SENTIMENT CONFLICT DETECTION HELPERS
// Prevents jarring narrative contradictions in market news
// =============================================================================

import type { AssetMood, EventSentiment, MarketEvent, EventChain, EventChainOutcome } from './types'

// Mood decay window in days - moods older than this are ignored
const MOOD_DECAY_DAYS = 3

// =============================================================================
// SENTIMENT DERIVATION
// Auto-derive sentiment from price effects when not explicitly set
// =============================================================================

/**
 * Derive sentiment from effects if not explicitly set.
 * - All positive effects → bullish
 * - All negative effects → bearish
 * - Mixed effects → mixed
 * - No/zero effects → neutral
 */
export function deriveSentiment(effects: Record<string, number>): EventSentiment {
  const values = Object.values(effects)
  if (values.length === 0) return 'neutral'

  const hasPositive = values.some(v => v > 0)
  const hasNegative = values.some(v => v < 0)

  if (hasPositive && hasNegative) return 'mixed'
  if (hasPositive) return 'bullish'
  if (hasNegative) return 'bearish'
  return 'neutral'
}

/**
 * Get sentiment for an event (use explicit or derive from effects)
 */
export function getEventSentiment(event: MarketEvent): EventSentiment {
  return event.sentiment ?? deriveSentiment(event.effects)
}

/**
 * Get affected assets for an event (use explicit or derive from effects)
 */
export function getEventAffectedAssets(event: MarketEvent): string[] {
  if (event.sentimentAssets && event.sentimentAssets.length > 0) {
    return event.sentimentAssets
  }
  // Derive from effects - only include assets with significant movement (>5%)
  return Object.entries(event.effects)
    .filter(([_, effect]) => Math.abs(effect) >= 0.05)
    .map(([assetId]) => assetId)
}

/**
 * Get sentiment for an event chain outcome
 */
export function getOutcomeSentiment(outcome: EventChainOutcome): EventSentiment {
  return outcome.sentiment ?? deriveSentiment(outcome.effects)
}

/**
 * Get affected assets for an event chain (use explicit or derive from outcomes)
 */
export function getChainAffectedAssets(chain: EventChain): string[] {
  if (chain.sentimentAssets && chain.sentimentAssets.length > 0) {
    return chain.sentimentAssets
  }
  // Derive from both outcomes' effects
  const assets = new Set<string>()
  chain.outcomes.forEach(outcome => {
    Object.entries(outcome.effects)
      .filter(([_, effect]) => Math.abs(effect) >= 0.05)
      .forEach(([assetId]) => assets.add(assetId))
  })
  return Array.from(assets)
}

// =============================================================================
// CONFLICT DETECTION
// Check if an event conflicts with current market mood
// =============================================================================

/**
 * Check if two sentiments are in conflict.
 * - bullish vs bearish → conflict
 * - neutral/mixed → no conflict with anything
 */
function sentimentsConflict(
  newSentiment: EventSentiment,
  existingMood: 'bullish' | 'bearish'
): boolean {
  // Neutral and mixed never conflict
  if (newSentiment === 'neutral' || newSentiment === 'mixed') {
    return false
  }
  // Direct opposition
  return newSentiment !== existingMood
}

/**
 * Check if an event conflicts with current asset moods.
 * Returns true if the event would create a jarring narrative contradiction.
 */
export function hasEventConflict(
  event: MarketEvent,
  assetMoods: AssetMood[],
  currentDay: number
): boolean {
  const sentiment = getEventSentiment(event)

  // Neutral and mixed events never conflict
  if (sentiment === 'neutral' || sentiment === 'mixed') {
    return false
  }

  const affectedAssets = getEventAffectedAssets(event)

  // Check each affected asset for mood conflict
  for (const assetId of affectedAssets) {
    const mood = assetMoods.find(m =>
      m.assetId === assetId &&
      (currentDay - m.recordedDay) < MOOD_DECAY_DAYS
    )

    if (mood && sentimentsConflict(sentiment, mood.sentiment)) {
      return true // Conflict found
    }
  }

  return false
}

/**
 * Check if an event chain conflicts with current asset moods.
 * Uses the rumor sentiment for initial check.
 */
export function hasChainConflict(
  chain: EventChain,
  assetMoods: AssetMood[],
  currentDay: number
): boolean {
  // Use explicit rumor sentiment or derive from the more likely outcome
  const rumorSentiment = chain.rumorSentiment ?? deriveSentimentFromChain(chain)

  // Neutral and mixed never conflict
  if (rumorSentiment === 'neutral' || rumorSentiment === 'mixed') {
    return false
  }

  const affectedAssets = getChainAffectedAssets(chain)

  // Check each affected asset for mood conflict
  for (const assetId of affectedAssets) {
    const mood = assetMoods.find(m =>
      m.assetId === assetId &&
      (currentDay - m.recordedDay) < MOOD_DECAY_DAYS
    )

    if (mood && sentimentsConflict(rumorSentiment, mood.sentiment)) {
      return true // Conflict found
    }
  }

  return false
}

/**
 * Check if a specific outcome conflicts with current asset moods.
 */
function hasOutcomeConflict(
  outcome: EventChainOutcome,
  assetMoods: AssetMood[],
  currentDay: number
): boolean {
  const sentiment = getOutcomeSentiment(outcome)

  // Neutral and mixed outcomes never conflict
  if (sentiment === 'neutral' || sentiment === 'mixed') {
    return false
  }

  // Get affected assets from outcome
  const affectedAssets = outcome.sentimentAssets && outcome.sentimentAssets.length > 0
    ? outcome.sentimentAssets
    : Object.entries(outcome.effects)
        .filter(([_, effect]) => Math.abs(effect) >= 0.05)
        .map(([assetId]) => assetId)

  // Check each affected asset for mood conflict
  for (const assetId of affectedAssets) {
    const mood = assetMoods.find(m =>
      m.assetId === assetId &&
      (currentDay - m.recordedDay) < MOOD_DECAY_DAYS
    )

    if (mood && sentimentsConflict(sentiment, mood.sentiment)) {
      return true // Conflict found
    }
  }

  return false
}

/**
 * Resolve a chain outcome with mood-awareness.
 * If one outcome conflicts with current mood and the other doesn't,
 * pick the non-conflicting one. Otherwise use normal probability.
 *
 * This creates narrative momentum: bad news begets bad news,
 * good news begets good news (within the 3-day mood window).
 */
export function resolveChainWithMood(
  chain: EventChain,
  assetMoods: AssetMood[],
  currentDay: number
): EventChainOutcome {
  const outcomes = chain.outcomes

  // Check which outcomes conflict with current mood
  const conflictFlags = outcomes.map(o => hasOutcomeConflict(o, assetMoods, currentDay))

  // Get non-conflicting outcomes
  const nonConflicting = outcomes.filter((_, i) => !conflictFlags[i])

  // If exactly one outcome doesn't conflict, pick it
  if (nonConflicting.length === 1) {
    return nonConflicting[0]
  }

  // Select from non-conflicting pool if available, else from all
  const pool = nonConflicting.length > 0 ? nonConflicting : outcomes

  // Normalize probabilities for the pool
  const totalProb = pool.reduce((sum, o) => sum + o.probability, 0)
  const roll = Math.random() * totalProb

  // Cumulative probability selection
  let cumulative = 0
  for (const outcome of pool) {
    cumulative += outcome.probability
    if (roll < cumulative) {
      return outcome
    }
  }

  // Fallback to last outcome
  return pool[pool.length - 1]
}

/**
 * Derive sentiment from chain outcomes (weighted by probability)
 */
function deriveSentimentFromChain(chain: EventChain): EventSentiment {
  let bullishWeight = 0
  let bearishWeight = 0

  for (const outcome of chain.outcomes) {
    const sentiment = deriveSentiment(outcome.effects)
    if (sentiment === 'bullish') {
      bullishWeight += outcome.probability
    } else if (sentiment === 'bearish') {
      bearishWeight += outcome.probability
    }
  }

  // Dominant sentiment wins if >60% probability weighted
  if (bullishWeight > 0.6) return 'bullish'
  if (bearishWeight > 0.6) return 'bearish'
  if (bullishWeight > 0 && bearishWeight > 0) return 'mixed'
  return 'neutral'
}

// =============================================================================
// MOOD RECORDING & DECAY
// Track market mood per asset after events fire
// =============================================================================

/**
 * Record mood for an event that just fired.
 * Only records directional moods (bullish/bearish), not neutral/mixed.
 */
export function recordEventMood(
  event: MarketEvent,
  currentDay: number,
  existingMoods: AssetMood[]
): AssetMood[] {
  const sentiment = getEventSentiment(event)

  // Only track directional moods
  if (sentiment !== 'bullish' && sentiment !== 'bearish') {
    return existingMoods
  }

  const affectedAssets = getEventAffectedAssets(event)
  const newMoods = [...existingMoods]

  for (const assetId of affectedAssets) {
    // Remove any existing mood for this asset
    const existingIndex = newMoods.findIndex(m => m.assetId === assetId)
    if (existingIndex !== -1) {
      newMoods.splice(existingIndex, 1)
    }

    // Add new mood
    newMoods.push({
      assetId,
      sentiment,
      recordedDay: currentDay,
      source: event.headline,
    })
  }

  return newMoods
}

/**
 * Record mood for a chain outcome that just resolved.
 */
export function recordChainOutcomeMood(
  outcome: EventChainOutcome,
  currentDay: number,
  existingMoods: AssetMood[]
): AssetMood[] {
  const sentiment = getOutcomeSentiment(outcome)

  // Only track directional moods
  if (sentiment !== 'bullish' && sentiment !== 'bearish') {
    return existingMoods
  }

  const affectedAssets = outcome.sentimentAssets && outcome.sentimentAssets.length > 0
    ? outcome.sentimentAssets
    : Object.entries(outcome.effects)
        .filter(([_, effect]) => Math.abs(effect) >= 0.05)
        .map(([assetId]) => assetId)

  const newMoods = [...existingMoods]

  for (const assetId of affectedAssets) {
    // Remove any existing mood for this asset
    const existingIndex = newMoods.findIndex(m => m.assetId === assetId)
    if (existingIndex !== -1) {
      newMoods.splice(existingIndex, 1)
    }

    // Add new mood
    newMoods.push({
      assetId,
      sentiment,
      recordedDay: currentDay,
      source: outcome.headline,
    })
  }

  return newMoods
}

/**
 * Record mood for a chain rumor that just started.
 */
export function recordChainRumorMood(
  chain: EventChain,
  currentDay: number,
  existingMoods: AssetMood[]
): AssetMood[] {
  const sentiment = chain.rumorSentiment ?? deriveSentimentFromChain(chain)

  // Only track directional moods
  if (sentiment !== 'bullish' && sentiment !== 'bearish') {
    return existingMoods
  }

  const affectedAssets = getChainAffectedAssets(chain)
  const newMoods = [...existingMoods]

  for (const assetId of affectedAssets) {
    // Remove any existing mood for this asset
    const existingIndex = newMoods.findIndex(m => m.assetId === assetId)
    if (existingIndex !== -1) {
      newMoods.splice(existingIndex, 1)
    }

    // Add new mood
    newMoods.push({
      assetId,
      sentiment,
      recordedDay: currentDay,
      source: chain.rumor,
    })
  }

  return newMoods
}

/**
 * Record mood for a story stage (start, intermediate, or resolution).
 * Works with any object that has headline and effects properties.
 */
export function recordStoryMood(
  stage: { headline: string; effects: Record<string, number> },
  currentDay: number,
  existingMoods: AssetMood[]
): AssetMood[] {
  const sentiment = deriveSentiment(stage.effects)

  // Only track directional moods
  if (sentiment !== 'bullish' && sentiment !== 'bearish') {
    return existingMoods
  }

  // Get affected assets from effects (>5% threshold)
  const affectedAssets = Object.entries(stage.effects)
    .filter(([_, effect]) => Math.abs(effect) >= 0.05)
    .map(([assetId]) => assetId)

  if (affectedAssets.length === 0) {
    return existingMoods
  }

  const newMoods = [...existingMoods]

  for (const assetId of affectedAssets) {
    // Remove any existing mood for this asset
    const existingIndex = newMoods.findIndex(m => m.assetId === assetId)
    if (existingIndex !== -1) {
      newMoods.splice(existingIndex, 1)
    }

    // Add new mood
    newMoods.push({
      assetId,
      sentiment,
      recordedDay: currentDay,
      source: stage.headline,
    })
  }

  return newMoods
}

/**
 * Decay old moods - remove moods older than MOOD_DECAY_DAYS.
 */
export function decayMoods(moods: AssetMood[], currentDay: number): AssetMood[] {
  return moods.filter(mood => (currentDay - mood.recordedDay) < MOOD_DECAY_DAYS)
}

// =============================================================================
// SELECTION WITH CONFLICT AVOIDANCE
// Modified selection logic with retry and fallback
// =============================================================================

/**
 * Maximum attempts to find a non-conflicting event before falling back to quiet news.
 */
export const MAX_CONFLICT_RETRIES = 10
