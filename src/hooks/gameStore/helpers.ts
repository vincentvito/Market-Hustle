/**
 * Pure helper functions for the game store.
 * These functions have no Zustand dependencies and can be tested independently.
 */

import { ASSETS } from '@/lib/game/assets'
import { EVENTS, CATEGORY_WEIGHTS } from '@/lib/game/events'
import { EVENT_CHAINS, CHAIN_CATEGORY_WEIGHTS } from '@/lib/game/eventChains'
import { SCHEDULED_EVENTS, SCHEDULED_EVENT_WEIGHTS } from '@/lib/game/scheduledEvents'
import { ANGEL_STARTUPS, VC_STARTUPS } from '@/lib/game/startups'
import { LIFESTYLE_ASSETS } from '@/lib/game/lifestyleAssets'
import { getStoryById } from '@/lib/game/stories'
import {
  hasEventConflict,
  hasChainConflict,
  MAX_CONFLICT_RETRIES,
  getEventSentiment,
  getReversalBonus,
} from '@/lib/game/sentimentHelpers'
import type { DirectorEventModifiers, SecondOrderState, NarrativeTheme } from '@/lib/game/director'
import {
  shouldSurpriseBypass,
  combineSentiment,
} from '@/lib/game/director'
import { loadUserState, recordGameEnd } from '@/lib/game/persistence'
import { generateGameId, type GameOutcome, type GameHistoryEntry } from '@/lib/game/userState'
import type {
  GameDuration,
  MarketEvent,
  ActiveChain,
  EventChain,
  Startup,
  StartupOutcome,
  ActiveEscalation,
  ActiveStory,
  AssetMood,
  ScheduledEvent,
  ActiveScheduledEvent,
  PEAbilityId,
  PendingStoryArc,
} from '@/lib/game/types'

// ============================================================================
// PRICE INITIALIZATION
// ============================================================================

export function initPrices(): Record<string, number> {
  const p: Record<string, number> = {}
  ASSETS.forEach(a => {
    p[a.id] = Math.round(a.basePrice * (0.9 + Math.random() * 0.2) * 100) / 100
  })
  return p
}

export function initLifestylePrices(): Record<string, number> {
  const p: Record<string, number> = {}
  LIFESTYLE_ASSETS.forEach(a => {
    // Lifestyle assets have smaller initial variance (5% either way)
    p[a.id] = Math.round(a.basePrice * (0.95 + Math.random() * 0.1))
  })
  return p
}

// ============================================================================
// POSITION MANAGEMENT
// ============================================================================

export function generatePositionId(): string {
  return `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// ============================================================================
// GAME OUTCOME & PERSISTENCE HELPERS
// ============================================================================

export function mapGameOverReasonToOutcome(reason: string): GameOutcome {
  switch (reason) {
    case 'BANKRUPT':
      return 'bankrupt'
    case 'IMPRISONED':
      return 'imprisoned'
    case 'DECEASED':
      return 'deceased'
    case 'SHORT_SQUEEZED':
      return 'short_squeezed'
    case 'MARGIN_CALLED':
    case 'ECONOMIC_CATASTROPHE':
      return 'margin_called'
    default:
      return 'bankrupt'
  }
}

export function saveGameResult(
  isWin: boolean,
  finalNetWorth: number,
  daysSurvived: number,
  gameDuration: GameDuration,
  gameOverReason?: string
): void {
  const userState = loadUserState()

  const entry: GameHistoryEntry = {
    gameId: generateGameId(),
    date: new Date().toISOString(),
    duration: gameDuration as 30 | 45 | 60,
    finalNetWorth,
    profitPercent: (finalNetWorth / 50000) * 100,
    daysSurvived,
    outcome: isWin ? 'win' : mapGameOverReasonToOutcome(gameOverReason || 'BANKRUPT'),
  }

  const updatedState = recordGameEnd(userState, entry, isWin)
  // Note: saveUserState is called within recordGameEnd via persistence.ts
  // but for safety we import and call it here directly
  import('@/lib/game/persistence').then(({ saveUserState }) => {
    saveUserState(updatedState)
  })
}

// Synchronous version for use in store
export function saveGameResultSync(
  isWin: boolean,
  finalNetWorth: number,
  daysSurvived: number,
  gameDuration: GameDuration,
  gameOverReason?: string
): void {
  const { loadUserState, saveUserState, recordGameEnd } = require('@/lib/game/persistence')
  const { generateGameId } = require('@/lib/game/userState')

  const userState = loadUserState()

  const entry: GameHistoryEntry = {
    gameId: generateGameId(),
    date: new Date().toISOString(),
    duration: gameDuration as 30 | 45 | 60,
    finalNetWorth,
    profitPercent: (finalNetWorth / 50000) * 100,
    daysSurvived,
    outcome: isWin ? 'win' : mapGameOverReasonToOutcome(gameOverReason || 'BANKRUPT'),
  }

  const updatedState = recordGameEnd(userState, entry, isWin)
  saveUserState(updatedState)
}

// ============================================================================
// EVENT/CHAIN TOPIC BLOCKING
// ============================================================================

/** Maps PE ability IDs to their thematic category/subcategory for topic-blocking. */
export const PE_ABILITY_TOPICS: Record<PEAbilityId, { category: string; subcategory?: string }> = {
  defense_spending_bill: { category: 'geopolitical', subcategory: 'military' },
  drug_fast_track:       { category: 'biotech' },
  yemen_operations:      { category: 'geopolitical', subcategory: 'middle-east' },
  chile_acquisition:     { category: 'energy' },
  project_chimera:       { category: 'biotech', subcategory: 'pandemic' },
  operation_divide:      { category: 'geopolitical', subcategory: 'domestic' },
  run_for_president:     { category: 'geopolitical', subcategory: 'domestic' },
  insider_tip:           { category: 'insider' },  // Actual category overridden at runtime from selected scenario
}

/**
 * Get categories that are currently "in use" by active stories, chains, or PE ability story arcs.
 * These categories should be blocked from single events to prevent conflicts.
 * For geopolitical events, we use regional blocking (geo:subcategory) to allow
 * independent regions to have concurrent events (e.g., Taiwan + Middle East)
 */
export function getActiveTopics(activeStories: ActiveStory[], activeChains: ActiveChain[], pendingStoryArc?: PendingStoryArc | null): Set<string> {
  const topics = new Set<string>()

  // Add story categories (and subcategories if present)
  // For geopolitical, use geo:subcategory to allow independent regions
  activeStories.forEach(active => {
    const story = getStoryById(active.storyId)
    if (story) {
      if (story.category === 'geopolitical' && story.subcategory) {
        // Use regional blocking for geopolitical events
        topics.add(`geo:${story.subcategory}`)
      } else {
        topics.add(story.category)
      }
      // Always add subcategory if present (for non-regional blocking)
      if (story.subcategory) topics.add(story.subcategory)
    }
  })

  // Add chain categories (with regional support)
  activeChains.forEach(chain => {
    if (chain.category === 'geopolitical' && chain.subcategory) {
      topics.add(`geo:${chain.subcategory}`)
    } else {
      topics.add(chain.category)
    }
    if (chain.subcategory) topics.add(chain.subcategory)
  })

  // Add PE ability story arc topics (prevents thematic overlap during 3-day arcs)
  if (pendingStoryArc) {
    const { category, subcategory } = pendingStoryArc
    if (category === 'geopolitical' && subcategory) {
      topics.add(`geo:${subcategory}`)
    } else {
      topics.add(category)
    }
    if (subcategory) topics.add(subcategory)
  }

  return topics
}

// ============================================================================
// EVENT SELECTION
// ============================================================================

export function selectRandomEvent(
  activeEscalations: ActiveEscalation[],
  currentDay: number,
  blockedCategories: Set<string>,
  assetMoods: AssetMood[] = [],
  usedEventHeadlines: string[] = []
): MarketEvent | null {
  // Build adjusted weights based on active escalations
  const adjustedWeights: Record<string, number> = { ...CATEGORY_WEIGHTS }

  // Apply escalation boosts (only non-expired ones)
  activeEscalations
    .filter(esc => esc.expiresDay > currentDay)
    .forEach(esc => {
      esc.categories.forEach(cat => {
        if (adjustedWeights[cat] !== undefined) {
          adjustedWeights[cat] *= esc.boost
        }
      })
    })

  // Zero out blocked categories (active stories/chains)
  blockedCategories.forEach(cat => {
    if (adjustedWeights[cat] !== undefined) {
      adjustedWeights[cat] = 0
    }
  })

  // Check if any categories remain
  const remainingWeight = Object.values(adjustedWeights).reduce((a, b) => a + b, 0)
  if (remainingWeight === 0) {
    return null // All categories blocked, caller should use quiet news
  }

  // Normalize weights to sum to 1
  const normalizedWeights: Record<string, number> = {}
  for (const [cat, weight] of Object.entries(adjustedWeights)) {
    normalizedWeights[cat] = weight / remainingWeight
  }

  // Try to find a non-conflicting event (retry up to MAX_CONFLICT_RETRIES times)
  for (let attempt = 0; attempt < MAX_CONFLICT_RETRIES; attempt++) {
    const rand = Math.random()
    let cumulative = 0
    let selectedCategory = 'geopolitical'

    for (const [category, weight] of Object.entries(normalizedWeights)) {
      cumulative += weight
      if (rand <= cumulative) {
        selectedCategory = category
        break
      }
    }

    const allCategoryEvents = EVENTS.filter(e => e.category === selectedCategory)
    if (allCategoryEvents.length === 0) continue

    // Prefer unused events, but fall back to all if category exhausted
    const unusedEvents = allCategoryEvents.filter(e => !usedEventHeadlines.includes(e.headline))
    const categoryEvents = unusedEvents.length > 0 ? unusedEvents : allCategoryEvents

    const event = categoryEvents[Math.floor(Math.random() * categoryEvents.length)]

    // Check for sentiment conflict with current market mood
    if (!hasEventConflict(event, assetMoods, currentDay)) {
      return event // No conflict, use this event
    }
    // Conflict found, retry with a different event
  }

  // After MAX_CONFLICT_RETRIES attempts, return null (caller will use quiet news)
  return null
}

// ============================================================================
// CHAIN SELECTION
// ============================================================================

export function selectRandomChain(
  usedChainIds: string[],
  blockedCategories: Set<string>,
  assetMoods: AssetMood[] = [],
  currentDay: number = 1
): EventChain | null {
  // Build adjusted weights, zeroing out blocked categories
  const adjustedWeights: Record<string, number> = { ...CHAIN_CATEGORY_WEIGHTS }
  blockedCategories.forEach(cat => {
    if (adjustedWeights[cat] !== undefined) {
      adjustedWeights[cat] = 0
    }
  })

  // Check if any categories remain
  const remainingWeight = Object.values(adjustedWeights).reduce((a, b) => a + b, 0)
  if (remainingWeight === 0) {
    return null // All categories blocked
  }

  // Normalize weights
  const normalizedWeights: Record<string, number> = {}
  for (const [cat, weight] of Object.entries(adjustedWeights)) {
    normalizedWeights[cat] = weight / remainingWeight
  }

  // Try to find a non-conflicting chain (retry up to MAX_CONFLICT_RETRIES times)
  for (let attempt = 0; attempt < MAX_CONFLICT_RETRIES; attempt++) {
    // Select category based on weights
    const rand = Math.random()
    let cumulative = 0
    let selectedCategory = 'geopolitical'

    for (const [category, weight] of Object.entries(normalizedWeights)) {
      cumulative += weight
      if (rand <= cumulative) {
        selectedCategory = category
        break
      }
    }

    // Get available chains in this category (not used yet, not blocked)
    let availableChains = EVENT_CHAINS.filter(
      c => c.category === selectedCategory && !usedChainIds.includes(c.id)
    )

    // Also filter by subcategory to prevent same-region overlap (e.g., Taiwan chain + Taiwan story)
    availableChains = availableChains.filter(c => {
      if (c.subcategory && blockedCategories.has(c.subcategory)) return false
      if (c.category === 'geopolitical' && c.subcategory && blockedCategories.has(`geo:${c.subcategory}`)) return false
      return true
    })

    if (availableChains.length === 0) {
      // Try any non-blocked category
      availableChains = EVENT_CHAINS.filter(
        c => !usedChainIds.includes(c.id) && !blockedCategories.has(c.category)
      )
      // Apply subcategory filtering to fallback too
      availableChains = availableChains.filter(c => {
        if (c.subcategory && blockedCategories.has(c.subcategory)) return false
        if (c.category === 'geopolitical' && c.subcategory && blockedCategories.has(`geo:${c.subcategory}`)) return false
        return true
      })
    }

    if (availableChains.length === 0) return null

    const chain = availableChains[Math.floor(Math.random() * availableChains.length)]

    // Check for sentiment conflict with current market mood
    if (!hasChainConflict(chain, assetMoods, currentDay)) {
      return chain // No conflict, use this chain
    }
    // Conflict found, retry with a different chain
  }

  // After MAX_CONFLICT_RETRIES attempts, return null (no chain starts today)
  return null
}

// ============================================================================
// DIRECTOR-AWARE EVENT SELECTION
// ============================================================================

/**
 * Select a random event with Director and Second-Order (Ripple) modifiers applied
 * This enhances the base selection with narrative pacing and event clustering
 */
export function selectRandomEventWithDirector(
  activeEscalations: ActiveEscalation[],
  currentDay: number,
  blockedCategories: Set<string>,
  assetMoods: AssetMood[],
  modifiers: DirectorEventModifiers,
  secondOrder?: SecondOrderState,
  usedEventHeadlines: string[] = []
): MarketEvent | null {
  // Check for surprise bypass (12% chance to ignore all modifiers)
  const isSurprise = shouldSurpriseBypass()

  // Merge Director's blocked categories with existing blocked categories
  const allBlockedCategories = new Set([
    ...Array.from(blockedCategories),
    ...Array.from(modifiers.blockedCategories),
  ])

  // Build adjusted weights - start with base
  const adjustedWeights: Record<string, number> = { ...CATEGORY_WEIGHTS }

  // If surprise bypass, skip all modifier applications
  if (!isSurprise) {
    // 1. Apply RIPPLE modifiers FIRST (from second-order state)
    if (secondOrder) {
      for (const [cat, modifier] of Object.entries(secondOrder.effectiveCategoryModifiers)) {
        if (adjustedWeights[cat] !== undefined) {
          adjustedWeights[cat] *= modifier
        }
      }
    }

    // 2. Apply escalation boosts (existing behavior)
    activeEscalations
      .filter(esc => esc.expiresDay > currentDay)
      .forEach(esc => {
        esc.categories.forEach(cat => {
          if (adjustedWeights[cat] !== undefined) {
            adjustedWeights[cat] *= esc.boost
          }
        })
      })

    // 3. Apply Director category boosts
    for (const [cat, boost] of Object.entries(modifiers.categoryBoosts)) {
      if (adjustedWeights[cat] !== undefined) {
        adjustedWeights[cat] *= boost
      }
    }

    // 4. Apply preferred category bonus
    modifiers.preferredCategories.forEach(cat => {
      if (adjustedWeights[cat] !== undefined) {
        adjustedWeights[cat] *= 1.5
      }
    })
  }

  // Zero out blocked categories (always apply, even for surprise)
  allBlockedCategories.forEach(cat => {
    if (adjustedWeights[cat] !== undefined) {
      adjustedWeights[cat] = 0
    }
  })

  // Check if any categories remain
  const remainingWeight = Object.values(adjustedWeights).reduce((a, b) => a + b, 0)
  if (remainingWeight === 0) {
    return null
  }

  // Normalize weights
  const normalizedWeights: Record<string, number> = {}
  for (const [cat, weight] of Object.entries(adjustedWeights)) {
    normalizedWeights[cat] = weight / remainingWeight
  }

  // Combine sentiment from Director and Ripples
  const effectiveSentiment = isSurprise
    ? 'neutral'
    : combineSentiment(
        modifiers.sentimentBias,
        secondOrder?.effectiveSentimentPush ?? 'neutral'
      )

  // Try to find a non-conflicting event with sentiment bias
  for (let attempt = 0; attempt < MAX_CONFLICT_RETRIES; attempt++) {
    const rand = Math.random()
    let cumulative = 0
    let selectedCategory = 'geopolitical'

    for (const [category, weight] of Object.entries(normalizedWeights)) {
      cumulative += weight
      if (rand <= cumulative) {
        selectedCategory = category
        break
      }
    }

    const allCategoryEvents = EVENTS.filter(e => e.category === selectedCategory)
    if (allCategoryEvents.length === 0) continue

    // Prefer unused events — if category exhausted, retry with different category
    const unusedEvents = allCategoryEvents.filter(e => !usedEventHeadlines.includes(e.headline))
    if (unusedEvents.length === 0) continue
    let categoryEvents = unusedEvents

    // Apply sentiment bias filter (70% respect rate for organic feel)
    if (effectiveSentiment !== 'neutral' && Math.random() < 0.7) {
      const biasedEvents = categoryEvents.filter(e => {
        const sentiment = getEventSentiment(e)
        return sentiment === effectiveSentiment || sentiment === 'neutral' || sentiment === 'mixed'
      })
      if (biasedEvents.length > 0) {
        categoryEvents = biasedEvents
      }
    }

    const event = categoryEvents[Math.floor(Math.random() * categoryEvents.length)]

    // Check for sentiment conflict with current market mood
    if (!hasEventConflict(event, assetMoods, currentDay)) {
      // Calculate total volatility (Director + Ripple)
      const rippleVolatility = secondOrder?.effectiveVolatilityBoost ?? 1.0
      const totalVolatility = isSurprise
        ? 1.0
        : modifiers.volatilityMultiplier * rippleVolatility

      // Check for reversal bonus (1.3x if event opposes a mood in reversal window)
      const reversalBonus = getReversalBonus(event, assetMoods, currentDay)
      const finalMultiplier = Math.min(totalVolatility * reversalBonus, 2.5)

      // Apply combined multiplier to effects if not 1.0
      if (finalMultiplier !== 1.0) {
        return scaleEventEffects(event, finalMultiplier)
      }
      return event
    }
  }

  return null
}

/**
 * Select a random chain with Director and Second-Order (Ripple) modifiers applied
 */
export function selectRandomChainWithDirector(
  usedChainIds: string[],
  blockedCategories: Set<string>,
  assetMoods: AssetMood[],
  currentDay: number,
  modifiers: DirectorEventModifiers,
  secondOrder?: SecondOrderState,
  gameDuration?: number
): EventChain | null {
  // Check for surprise bypass (12% chance to ignore all modifiers)
  const isSurprise = shouldSurpriseBypass()

  // Merge Director's blocked categories
  const allBlockedCategories = new Set([
    ...Array.from(blockedCategories),
    ...Array.from(modifiers.blockedCategories),
  ])

  // Build adjusted weights with Director and Ripple influence
  const adjustedWeights: Record<string, number> = { ...CHAIN_CATEGORY_WEIGHTS }

  // If surprise bypass, skip all modifier applications
  if (!isSurprise) {
    // 1. Apply RIPPLE modifiers FIRST (from second-order state)
    if (secondOrder) {
      for (const [cat, modifier] of Object.entries(secondOrder.effectiveCategoryModifiers)) {
        if (adjustedWeights[cat] !== undefined) {
          adjustedWeights[cat] *= modifier
        }
      }
    }

    // 2. Apply Director category boosts
    for (const [cat, boost] of Object.entries(modifiers.categoryBoosts)) {
      if (adjustedWeights[cat] !== undefined) {
        adjustedWeights[cat] *= boost
      }
    }

    // 3. Apply preferred category bonus
    modifiers.preferredCategories.forEach(cat => {
      if (adjustedWeights[cat] !== undefined) {
        adjustedWeights[cat] *= 1.5
      }
    })
  }

  // Zero out blocked categories (always apply, even for surprise)
  allBlockedCategories.forEach(cat => {
    if (adjustedWeights[cat] !== undefined) {
      adjustedWeights[cat] = 0
    }
  })

  // Check if any categories remain
  const remainingWeight = Object.values(adjustedWeights).reduce((a, b) => a + b, 0)
  if (remainingWeight === 0) {
    return null
  }

  // Normalize weights
  const normalizedWeights: Record<string, number> = {}
  for (const [cat, weight] of Object.entries(adjustedWeights)) {
    normalizedWeights[cat] = weight / remainingWeight
  }

  // Try to find a non-conflicting chain
  for (let attempt = 0; attempt < MAX_CONFLICT_RETRIES; attempt++) {
    const rand = Math.random()
    let cumulative = 0
    let selectedCategory = 'geopolitical'

    for (const [category, weight] of Object.entries(normalizedWeights)) {
      cumulative += weight
      if (rand <= cumulative) {
        selectedCategory = category
        break
      }
    }

    // Filter: right category, not used, and can resolve before game ends
    const canResolve = (c: EventChain) => !gameDuration || currentDay + c.duration <= gameDuration
    let availableChains = EVENT_CHAINS.filter(
      c => c.category === selectedCategory && !usedChainIds.includes(c.id) && canResolve(c)
    )

    if (availableChains.length === 0) {
      availableChains = EVENT_CHAINS.filter(
        c => !usedChainIds.includes(c.id) && !allBlockedCategories.has(c.category) && canResolve(c)
      )
    }

    if (availableChains.length === 0) return null

    const chain = availableChains[Math.floor(Math.random() * availableChains.length)]

    if (!hasChainConflict(chain, assetMoods, currentDay)) {
      return chain
    }
  }

  return null
}

/**
 * Scale event effects by a multiplier
 * Used by Director to increase/decrease volatility
 */
function scaleEventEffects(event: MarketEvent, multiplier: number): MarketEvent {
  const scaledEffects: Record<string, number> = {}
  for (const [asset, effect] of Object.entries(event.effects)) {
    // Scale but cap at reasonable limits (-90% to +2000%)
    scaledEffects[asset] = Math.max(-0.9, Math.min(effect * multiplier, 20))
  }
  return { ...event, effects: scaledEffects }
}

// ============================================================================
// STARTUP HELPERS
// ============================================================================

export function selectRandomStartup(tier: 'angel' | 'vc', usedStartupIds: string[]): Startup | null {
  const pool = tier === 'angel' ? ANGEL_STARTUPS : VC_STARTUPS
  const available = pool.filter(s => !usedStartupIds.includes(s.id))
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}

export function selectOutcome(startup: Startup): StartupOutcome {
  const roll = Math.random()
  let cumulative = 0
  for (const outcome of startup.outcomes) {
    cumulative += outcome.probability
    if (roll <= cumulative) {
      return outcome
    }
  }
  return startup.outcomes[startup.outcomes.length - 1]
}

/**
 * Select outcome with bonus that shifts probability toward better outcomes
 * Bonus reduces failure probability and redistributes to success tiers
 * @param startup The startup to select outcome for
 * @param bonus Probability shift (e.g., 0.05 = 5% reduction in failure rate)
 */
export function selectOutcomeWithBonus(startup: Startup, bonus: number): StartupOutcome {
  if (bonus <= 0) {
    return selectOutcome(startup)
  }

  // Clone outcomes and adjust probabilities
  const adjustedOutcomes = startup.outcomes.map(o => ({ ...o }))

  // Find the failure outcome (multiplier = 0)
  const failIndex = adjustedOutcomes.findIndex(o => o.multiplier === 0)
  if (failIndex === -1) {
    return selectOutcome(startup)  // No failure outcome to reduce
  }

  // Reduce failure probability by bonus amount
  const failReduction = Math.min(adjustedOutcomes[failIndex].probability, bonus)
  adjustedOutcomes[failIndex].probability -= failReduction

  // Redistribute to non-failure outcomes proportionally
  const nonFailOutcomes = adjustedOutcomes.filter(o => o.multiplier > 0)
  if (nonFailOutcomes.length > 0) {
    const redistributeEach = failReduction / nonFailOutcomes.length
    adjustedOutcomes.forEach(o => {
      if (o.multiplier > 0) {
        o.probability += redistributeEach
      }
    })
  }

  // Select from adjusted probabilities
  const roll = Math.random()
  let cumulative = 0
  for (const outcome of adjustedOutcomes) {
    cumulative += outcome.probability
    if (roll <= cumulative) {
      return outcome
    }
  }
  return adjustedOutcomes[adjustedOutcomes.length - 1]
}

export function getRandomDuration(startup: Startup): number {
  const [min, max] = startup.duration
  return min + Math.floor(Math.random() * (max - min + 1))
}

// ============================================================================
// SCHEDULED EVENT SELECTION
// Calendar-driven events (Fed, jobs, GDP) with 1-day advance notice
// ============================================================================

export function selectRandomScheduledEvent(
  blockedCategories: Set<string>,
  activeScheduledEvent: ActiveScheduledEvent | null,
  currentDay: number,
  gameDuration: number,
  usedScheduledEventIds: string[] = [],
): ScheduledEvent | null {
  // Guard: only one active at a time
  if (activeScheduledEvent) return null
  // Guard: not too early or too late
  if (currentDay < 3 || currentDay > gameDuration - 2) return null

  // Filter out events whose category is blocked
  const allAvailable = SCHEDULED_EVENTS.filter(e => !blockedCategories.has(e.category))
  if (allAvailable.length === 0) return null

  // Prefer unused events, fall back to all if pool exhausted
  const unused = allAvailable.filter(e => !usedScheduledEventIds.includes(e.id))
  const available = unused.length > 0 ? unused : allAvailable

  // Build weights for available events
  const weights: { event: ScheduledEvent; weight: number }[] = available.map(e => ({
    event: e,
    weight: SCHEDULED_EVENT_WEIGHTS[e.id] ?? 0.1,
  }))

  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0)
  if (totalWeight === 0) return null

  const roll = Math.random() * totalWeight
  let cumulative = 0
  for (const { event, weight } of weights) {
    cumulative += weight
    if (roll <= cumulative) {
      return event
    }
  }
  return weights[weights.length - 1].event
}

// =============================================================================
// THEME <-> CATEGORY MAPPING HELPERS
// =============================================================================

const CATEGORY_TO_THEME: Record<string, NarrativeTheme> = {
  tech: 'tech_boom',
  crypto: 'crypto_winter',
  geopolitical: 'geopolitical_crisis',
  economic: 'economic_uncertainty',
  energy: 'commodity_surge',
}

const THEME_TO_CATEGORY_MAP: Record<NarrativeTheme, string | null> = {
  tech_boom: 'tech',
  crypto_winter: 'crypto',
  geopolitical_crisis: 'geopolitical',
  economic_uncertainty: 'economic',
  commodity_surge: 'energy',
  none: null,
}

export function categoryToTheme(category: string): NarrativeTheme | null {
  return CATEGORY_TO_THEME[category] || null
}

export function themeToCategory(theme: NarrativeTheme): string | null {
  return THEME_TO_CATEGORY_MAP[theme] || null
}
