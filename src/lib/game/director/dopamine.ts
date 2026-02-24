import type { DopamineEvent, PlayerMomentum } from './types'

const MIN_SIGNIFICANT_IMPACT = 0.05
const MAX_IMPACT_SCALE = 0.50

export interface EventContext {
  momentum: PlayerMomentum
  wasExpected: boolean
  isChainResolution: boolean
}

export function classifyDopamineEvent(
  portfolioImpact: number,
  context: EventContext
): DopamineEvent | null {
  const absImpact = Math.abs(portfolioImpact)
  if (absImpact < MIN_SIGNIFICANT_IMPACT) return null

  let magnitude = Math.min(1, absImpact / MAX_IMPACT_SCALE)
  let type: DopamineEvent['type']

  if (portfolioImpact > 0) {
    if (context.momentum === 'desperate' || context.momentum === 'struggling') {
      type = 'comeback'
      magnitude *= 1.3
    } else {
      type = 'big_win'
    }
  } else {
    if (!context.wasExpected) {
      type = 'unexpected'
      magnitude *= 1.2
    } else {
      type = 'big_loss'
    }
  }

  // Near-miss: chain resolved favorably when it could have gone badly
  if (context.isChainResolution && portfolioImpact > 0 && magnitude > 0.3) {
    type = 'near_miss'
    magnitude *= 1.1
  }

  magnitude = Math.min(1, magnitude)
  return { type, magnitude }
}

export function shouldScheduleBigEvent(
  dopamineDebt: number,
  lastBigWinDay: number | null,
  lastBigLossDay: number | null,
  currentDay: number,
  minDaysBetween: number
): boolean {
  const daysSinceWin = lastBigWinDay !== null ? currentDay - lastBigWinDay : 999
  const daysSinceLoss = lastBigLossDay !== null ? currentDay - lastBigLossDay : 999
  const daysSinceBig = Math.min(daysSinceWin, daysSinceLoss)

  if (daysSinceBig < minDaysBetween) return false
  if (dopamineDebt > 0.8) return true

  const baseChance = 0.15 + (dopamineDebt * 0.3)
  return Math.random() < baseChance
}

export function isExcitingEvent(
  portfolioImpact: number | null,
  isChainStart: boolean,
  isChainResolution: boolean
): boolean {
  if (isChainStart || isChainResolution) return true
  if (portfolioImpact !== null && Math.abs(portfolioImpact) >= MIN_SIGNIFICANT_IMPACT) return true
  return false
}

/**
 * 70% chance to respect sentiment bias — keeps things feeling organic.
 * Returns true if the event is acceptable given the current bias.
 */
export function shouldRespectSentimentBias(
  bias: 'bullish' | 'bearish' | 'neutral',
  eventSentiment: 'bullish' | 'bearish' | 'neutral' | 'mixed'
): boolean {
  if (bias === 'neutral') return true
  if (Math.random() > 0.7) return true
  if (bias === 'bullish' && eventSentiment === 'bullish') return true
  if (bias === 'bearish' && eventSentiment === 'bearish') return true
  if (eventSentiment === 'neutral' || eventSentiment === 'mixed') return true
  return false
}

export function getPreferredSentiment(
  bias: 'bullish' | 'bearish' | 'neutral'
): 'bullish' | 'bearish' | null {
  if (bias === 'bullish') return 'bullish'
  if (bias === 'bearish') return 'bearish'
  return null
}
