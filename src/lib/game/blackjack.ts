// Blackjack game logic — pure functions, no React/Zustand

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  suit: Suit
  rank: Rank
}

export type BlackjackResult = 'blackjack' | 'win' | 'loss' | 'push' | 'bust'
export type BlackjackPhase = 'betting' | 'playing' | 'dealer_turn' | 'result'

export interface BlackjackState {
  deck: Card[]
  playerHand: Card[]
  dealerHand: Card[]
  bet: number
  phase: BlackjackPhase
  result: BlackjackResult | null
  cashDelta: number
}

const SUIT_EMOJI: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

export function getCardDisplay(card: Card): { text: string; isRed: boolean } {
  const emoji = SUIT_EMOJI[card.suit]
  return {
    text: `${card.rank}${emoji}`,
    isRed: card.suit === 'hearts' || card.suit === 'diamonds',
  }
}

export function getCardValue(card: Card): number {
  if (card.rank === 'A') return 11
  if (['K', 'Q', 'J'].includes(card.rank)) return 10
  return parseInt(card.rank)
}

export function getHandValue(hand: Card[]): number {
  let total = 0
  let aces = 0

  for (const card of hand) {
    const val = getCardValue(card)
    total += val
    if (card.rank === 'A') aces++
  }

  // Convert aces from 11 to 1 as needed
  while (total > 21 && aces > 0) {
    total -= 10
    aces--
  }

  return total
}

export function isSoft17(hand: Card[]): boolean {
  let total = 0
  let aces = 0

  for (const card of hand) {
    total += getCardValue(card)
    if (card.rank === 'A') aces++
  }

  // Reduce aces until total <= 21
  while (total > 21 && aces > 0) {
    total -= 10
    aces--
  }

  return total === 17 && aces > 0
}

export function isBlackjack(hand: Card[]): boolean {
  return hand.length === 2 && getHandValue(hand) === 21
}

export function isBust(hand: Card[]): boolean {
  return getHandValue(hand) > 21
}

export function createShuffledDeck(): Card[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const deck: Card[] = []

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank })
    }
  }

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }

  return deck
}

export function dealInitialHands(deck: Card[]): {
  playerHand: Card[]
  dealerHand: Card[]
  remainingDeck: Card[]
} {
  const remaining = [...deck]
  const playerHand = [remaining.pop()!, remaining.pop()!]
  const dealerHand = [remaining.pop()!, remaining.pop()!]
  return { playerHand, dealerHand, remainingDeck: remaining }
}

export function hit(hand: Card[], deck: Card[]): {
  newHand: Card[]
  remainingDeck: Card[]
} {
  const remaining = [...deck]
  const newHand = [...hand, remaining.pop()!]
  return { newHand, remainingDeck: remaining }
}

/** Dealer draws until hard 17+ (hits on soft 17). Returns final hand and deck. */
export function dealerPlay(dealerHand: Card[], deck: Card[]): {
  finalHand: Card[]
  remainingDeck: Card[]
  drawnCards: Card[]
} {
  let hand = [...dealerHand]
  let remaining = [...deck]
  const drawnCards: Card[] = []

  while (getHandValue(hand) < 17 || isSoft17(hand)) {
    const card = remaining.pop()!
    hand.push(card)
    drawnCards.push(card)
  }

  return { finalHand: hand, remainingDeck: remaining, drawnCards }
}

export function resolveHand(
  playerHand: Card[],
  dealerHand: Card[],
  bet: number
): { result: BlackjackResult; cashDelta: number; headline: string } {
  const playerBJ = isBlackjack(playerHand)
  const dealerBJ = isBlackjack(dealerHand)
  const playerValue = getHandValue(playerHand)
  const dealerValue = getHandValue(dealerHand)
  const playerBusted = isBust(playerHand)
  const dealerBusted = isBust(dealerHand)

  // Both blackjack = push
  if (playerBJ && dealerBJ) {
    return { result: 'push', cashDelta: 0, headline: 'Both blackjack — push!' }
  }

  // Player blackjack (3:2 payout)
  if (playerBJ) {
    const winnings = Math.floor(bet * 1.5)
    return { result: 'blackjack', cashDelta: winnings, headline: `BLACKJACK! +$${winnings.toLocaleString('en-US')}` }
  }

  // Dealer blackjack
  if (dealerBJ) {
    return { result: 'loss', cashDelta: -bet, headline: `Dealer blackjack. -$${bet.toLocaleString('en-US')}` }
  }

  // Player bust
  if (playerBusted) {
    return { result: 'bust', cashDelta: -bet, headline: `BUST! -$${bet.toLocaleString('en-US')}` }
  }

  // Dealer bust
  if (dealerBusted) {
    return { result: 'win', cashDelta: bet, headline: `Dealer busts! +$${bet.toLocaleString('en-US')}` }
  }

  // Compare hands
  if (playerValue > dealerValue) {
    return { result: 'win', cashDelta: bet, headline: `${playerValue} beats ${dealerValue}! +$${bet.toLocaleString('en-US')}` }
  }
  if (dealerValue > playerValue) {
    return { result: 'loss', cashDelta: -bet, headline: `Dealer's ${dealerValue} beats ${playerValue}. -$${bet.toLocaleString('en-US')}` }
  }

  return { result: 'push', cashDelta: 0, headline: `Push at ${playerValue} — bet returned` }
}
