/**
 * Gifts for reducing wife suspicion heat
 */

export interface Gift {
  id: string
  name: string
  emoji: string
  cost: number
  heatReduction: number // percentage points to reduce (e.g., 5 = -5%)
  description: string
  freezeDays?: number // optional: freeze heat for N days
}

export const GIFTS: Gift[] = [
  {
    id: 'flowers',
    name: 'Flowers',
    emoji: '💐',
    cost: 50,
    heatReduction: 3,
    description: 'Classic move. She knows you\'re up to something.',
  },
  {
    id: 'spa_day',
    name: 'Spa Day',
    emoji: '💆',
    cost: 300,
    heatReduction: 8,
    description: 'A day of pampering buys you some time.',
  },
  {
    id: 'designer_bag',
    name: 'Designer Bag',
    emoji: '👜',
    cost: 2000,
    heatReduction: 15,
    description: 'Expensive taste pays off in reduced questions.',
  },
  {
    id: 'diamond_earrings',
    name: 'Diamond Earrings',
    emoji: '💎',
    cost: 5000,
    heatReduction: 25,
    description: 'Sparkly distractions work wonders.',
  },
  {
    id: 'birkin_bag',
    name: 'Birkin Bag',
    emoji: '👛',
    cost: 15000,
    heatReduction: 40,
    description: 'The nuclear option. She\'ll stop asking questions... for now.',
  },
  {
    id: 'surprise_trip',
    name: 'Surprise Trip',
    emoji: '✈️',
    cost: 10000,
    heatReduction: 50,
    description: 'Two weeks in Paris. Heat frozen while she\'s away.',
    freezeDays: 2,
  },
]

export function getGift(giftId: string): Gift | undefined {
  return GIFTS.find(g => g.id === giftId)
}
