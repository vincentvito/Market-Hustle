// Achievement Definitions
// Frontend-only for now - will be persisted to localStorage/backend later

export interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  category: 'trading' | 'milestones' | 'events' | 'game_end'
}

export const ACHIEVEMENTS: Achievement[] = [
  // Trading Achievements
  {
    id: 'first_blood',
    name: 'FIRST BLOOD',
    description: 'Made your first profitable trade',
    emoji: '🩸',
    category: 'trading',
  },
  {
    id: 'diamond_hands',
    name: 'DIAMOND HANDS',
    description: 'Held through a 30% dip',
    emoji: '💎',
    category: 'trading',
  },
  {
    id: 'paper_hands',
    name: 'PAPER HANDS',
    description: 'Panic sold at a 20%+ loss',
    emoji: '🧻',
    category: 'trading',
  },
  {
    id: 'whale',
    name: 'WHALE',
    description: 'Single position worth $50K+',
    emoji: '🐋',
    category: 'trading',
  },
  {
    id: 'sniper',
    name: 'SNIPER',
    description: 'Sold within 5% of daily high',
    emoji: '🎯',
    category: 'trading',
  },
  {
    id: 'hot_streak',
    name: 'HOT STREAK',
    description: '5 profitable trades in a row',
    emoji: '🔥',
    category: 'trading',
  },
  {
    id: 'all_in',
    name: 'ALL IN',
    description: 'Put 100% of net worth in one asset',
    emoji: '🎰',
    category: 'trading',
  },

  // Milestone Achievements
  {
    id: 'millionaire',
    name: 'MILLIONAIRE',
    description: 'Reached $1M net worth',
    emoji: '💵',
    category: 'milestones',
  },
  {
    id: 'billionaire',
    name: 'BILLIONAIRE',
    description: 'Reached $1B net worth',
    emoji: '💰',
    category: 'milestones',
  },
  {
    id: 'trillionaire',
    name: 'TRILLIONAIRE',
    description: 'Reached $1T net worth',
    emoji: '🏦',
    category: 'milestones',
  },
  {
    id: 'ten_x',
    name: '10X',
    description: '10x your starting capital',
    emoji: '📈',
    category: 'milestones',
  },
  {
    id: 'diversified',
    name: 'DIVERSIFIED',
    description: 'Held 5+ different assets at once',
    emoji: '🌈',
    category: 'milestones',
  },
  {
    id: 'degen',
    name: 'DEGEN',
    description: 'Made 50+ trades in one game',
    emoji: '🎲',
    category: 'milestones',
  },

  // Event Achievements
  {
    id: 'oracle',
    name: 'ORACLE',
    description: 'Acted on a rumor that came true',
    emoji: '🔮',
    category: 'events',
  },
  {
    id: 'lightning_rod',
    name: 'LIGHTNING ROD',
    description: 'Caught a 10x+ spike',
    emoji: '⚡',
    category: 'events',
  },
  {
    id: 'survivor',
    name: 'SURVIVOR',
    description: 'Survived a crash with 50%+ of portfolio',
    emoji: '🛡️',
    category: 'events',
  },
  {
    id: 'venture_bro',
    name: 'VENTURE BRO',
    description: 'Made profit from a startup investment',
    emoji: '🚀',
    category: 'events',
  },
  {
    id: 'angel_of_death',
    name: 'ANGEL OF DEATH',
    description: 'Lost money on 3 startup investments',
    emoji: '👼',
    category: 'events',
  },

  // Game End Achievements
  {
    id: 'finisher',
    name: 'FINISHER',
    description: 'Completed a 30-day game',
    emoji: '🏁',
    category: 'game_end',
  },
  {
    id: 'winner',
    name: 'WINNER',
    description: 'Finished with profit',
    emoji: '🏆',
    category: 'game_end',
  },
  {
    id: 'legend',
    name: 'LEGEND',
    description: 'Finished with 100x+ returns',
    emoji: '👑',
    category: 'game_end',
  },
  {
    id: 'bankrupt',
    name: 'BANKRUPT',
    description: 'Lost everything',
    emoji: '💀',
    category: 'game_end',
  },
]

// Get achievement by ID
export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id)
}

// Placeholder profile stats (will be persisted later)
export interface PlayerProfile {
  gamesPlayed: number
  bestNetWorth: number
  winRate: number
  totalProfit: number
  biggestWin: { amount: number; asset: string }
  biggestLoss: { amount: number; asset: string }
  favoriteAsset: string
  unlockedAchievements: string[]
}

export const DEFAULT_PROFILE: PlayerProfile = {
  gamesPlayed: 0,
  bestNetWorth: 0,
  winRate: 0,
  totalProfit: 0,
  biggestWin: { amount: 0, asset: '' },
  biggestLoss: { amount: 0, asset: '' },
  favoriteAsset: '',
  unlockedAchievements: [],
}

// Mock profile for frontend testing
export const MOCK_PROFILE: PlayerProfile = {
  gamesPlayed: 12,
  bestNetWorth: 4200000,
  winRate: 75,
  totalProfit: 12400000,
  biggestWin: { amount: 890000, asset: 'BTC' },
  biggestLoss: { amount: 45000, asset: 'GME' },
  favoriteAsset: 'BIOTECH',
  unlockedAchievements: ['first_blood', 'diamond_hands', 'whale', 'sniper', 'millionaire', 'ten_x', 'oracle', 'lightning_rod'],
}
