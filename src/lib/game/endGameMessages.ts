/**
 * Centralized end-game messages for all outcomes (win and loss).
 * Used by the EndGameCoordinator to provide consistent messaging across tier views.
 */

export interface EndGameMessage {
  title: string
  emoji: string
  flavor: string
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
    flavor: 'Your portfolio went to zero. Wall Street claims another victim.',
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
}

/**
 * Get the message for a given outcome.
 * For wins, pass 'WIN'. For losses, pass the gameOverReason.
 */
export function getEndGameMessage(reasonOrWin: string): EndGameMessage {
  return (
    END_GAME_MESSAGES[reasonOrWin] || {
      title: reasonOrWin || 'GAME OVER',
      emoji: '💀',
      flavor: 'Your career has ended.',
    }
  )
}
