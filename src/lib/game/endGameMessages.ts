/**
 * Centralized end-game messages for all outcomes (win and loss).
 * Used by the EndGameCoordinator to provide consistent messaging across tier views.
 */

export interface EndGameMessage {
  title: string
  emoji: string
  flavor: string
}

/**
 * Position data for dynamic game over messages
 */
export interface PositionLossInfo {
  name: string
  pl: number
  leverage?: number
}

export interface MarginCallContext {
  worstLeveraged?: PositionLossInfo
  worstShort?: PositionLossInfo
}

export const END_GAME_MESSAGES: Record<string, EndGameMessage> = {
  // Win outcome
  WIN: {
    title: 'MARKET CLOSED',
    emoji: '🏆',
    flavor: 'You survived the chaos. The market closes, but your legend lives on.',
  },

  // Loss outcomes
  BANKRUPT: {
    title: 'BANKRUPT',
    emoji: '💀',
    flavor: 'The debt collectors are calling. Your credit cards are maxed and you have nothing left. Game over.',
  },
  DECEASED: {
    title: 'DECEASED',
    emoji: '⚰️',
    flavor:
      "The back-alley surgery didn't go as planned. At least you died doing what you loved: making questionable financial decisions.",
  },
  IMPRISONED: {
    title: 'IMPRISONED',
    emoji: '⛓️',
    flavor:
      'Federal prison. 15 to 20. At least the meals are free. Your trading days are over... for now.',
  },
  MARGIN_CALLED: {
    title: 'MARGIN CALLED',
    emoji: '📞',
    flavor:
      "Your broker is on the line. They want their money back. Unfortunately, you don't have it.",
  },
  SHORT_SQUEEZED: {
    title: 'SHORT SQUEEZED',
    emoji: '🩳',
    flavor:
      'The market moved against you. Hard. Your short positions have consumed everything you own.',
  },
  ECONOMIC_CATASTROPHE: {
    title: 'ECONOMIC CATASTROPHE',
    emoji: '🌍💥',
    flavor:
      'You have destabilized the world economy. Governments are forming emergency committees. Your face is on international news. Congratulations?',
  },
  FBI_INVESTIGATION: {
    title: 'FBI INVESTIGATION',
    emoji: '🚔',
    flavor:
      'The FBI has been building a case against you for months. Your schemes finally caught up. Game over.',
  },
}

/**
 * Generate dynamic flavor text for margin call game over
 */
function generateMarginCallFlavor(context?: MarginCallContext): string {
  const worst = context?.worstLeveraged
  if (worst && worst.leverage) {
    const loss = Math.abs(worst.pl).toLocaleString('en-US')
    return `Your broker is on the line. Your ${worst.leverage}x leveraged trade in ${worst.name} resulted in a $${loss} loss. They want their money back. Unfortunately, you don't have it.`
  }
  return "Your broker is on the line. They want their money back. Unfortunately, you don't have it."
}

/**
 * Generate dynamic flavor text for short squeeze game over
 */
function generateShortSqueezeFlavor(context?: MarginCallContext): string {
  const worst = context?.worstShort
  if (worst) {
    const loss = Math.abs(worst.pl).toLocaleString('en-US')
    return `${worst.name} squeezed to the moon. Your short position lost $${loss}. The market moved against you. Hard.`
  }
  return 'The market moved against you. Hard. Your short positions have consumed everything you own.'
}

/**
 * Get the message for a given outcome.
 * For wins, pass 'WIN'. For losses, pass the gameOverReason.
 * Optional context provides position data for dynamic messages.
 */
export function getEndGameMessage(
  reasonOrWin: string,
  context?: MarginCallContext
): EndGameMessage {
  // Generate dynamic messages for margin-related game overs
  if (reasonOrWin === 'MARGIN_CALLED') {
    return {
      title: 'MARGIN CALLED',
      emoji: '📞',
      flavor: generateMarginCallFlavor(context),
    }
  }

  if (reasonOrWin === 'SHORT_SQUEEZED') {
    return {
      title: 'SHORT SQUEEZED',
      emoji: '🩳',
      flavor: generateShortSqueezeFlavor(context),
    }
  }

  return (
    END_GAME_MESSAGES[reasonOrWin] || {
      title: reasonOrWin || 'GAME OVER',
      emoji: '💀',
      flavor: 'Your career has ended.',
    }
  )
}
