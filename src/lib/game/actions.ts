export interface StaffAction {
  id: string
  name: string
  emoji: string
  cost: number
  type: 'one-time' | 'duration'
  durationDays?: number
  description: string
  effect: string
}

export interface DarkAction {
  id: string
  name: string
  emoji: string
  cost: number
  type: 'one-time' | 'per-use'
  description: string
  effect: string
  wifeHeatChange?: number
  fbiHeatChange?: number
  failureChance?: number
  failureFbiHeatChange?: number
  failureMessage?: string
}

export const STAFF_ACTIONS: StaffAction[] = [
  {
    id: 'hire_lawyer',
    name: 'Hire Lawyer',
    emoji: '⚖️',
    cost: 8000,
    type: 'one-time',
    description: 'Retained legal counsel for those "unexpected" situations.',
    effect: 'Better outcomes in legal encounters',
  },
  {
    id: 'hire_analyst',
    name: 'Hire Analyst',
    emoji: '📊',
    cost: 400,
    type: 'duration',
    durationDays: 7,
    description: 'Wall Street reject with a talent for due diligence.',
    effect: 'See risk ratings on PE deals for 7 days',
  },
  {
    id: 'hire_pi',
    name: 'Hire Private Investigator',
    emoji: '🔍',
    cost: 3000,
    type: 'one-time',
    description: 'Ex-cop. Knows where the bodies are buried.',
    effect: 'Reveals hidden market connections',
  },
  {
    id: 'buy_senator',
    name: 'Buy a Senator',
    emoji: '🏛️',
    cost: 25000,
    type: 'one-time',
    description: 'Campaign donation. Totally legal. Probably.',
    effect: 'Advance warning on 2-3 legislative bills',
  },
]

export const DARK_ACTIONS: DarkAction[] = [
  {
    id: 'visit_escort',
    name: 'Visit Escort',
    emoji: '🌙',
    cost: 1500,
    type: 'per-use',
    description: 'A "business dinner" with insider connections.',
    effect: 'Insider tip on legislation',
    fbiHeatChange: 0,
  },
  {
    id: 'bribe_fbi',
    name: 'Bribe FBI Agent',
    emoji: '💼',
    cost: 15000,
    type: 'one-time',
    description: 'Everyone has a price. Even the feds.',
    effect: '-30% FBI heat',
    fbiHeatChange: -30,
  },
  {
    id: 'fake_death',
    name: 'Fake Your Death',
    emoji: '💀',
    cost: 100000,
    type: 'one-time',
    description: 'New identity. New life. Half the money.',
    effect: 'Reset FBI heat to 0. Lose 50% net worth',
  },
  {
    id: 'leak_to_press',
    name: 'Leak to Press',
    emoji: '📰',
    cost: 0,
    type: 'per-use',
    description: 'Anonymous tip to a friendly journalist.',
    effect: 'Tanks a stock you\'re shorting. +20% FBI heat',
    fbiHeatChange: 20,
    failureChance: 0.45,
    failureFbiHeatChange: 35,
    failureMessage: 'TIP TRACED BACK TO YOU',
  },
]
