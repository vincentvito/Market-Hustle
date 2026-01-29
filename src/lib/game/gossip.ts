// =============================================================================
// WALL ST GOSSIP SYSTEM
// Generates fake trader achievements to create social proof and aspiration
// =============================================================================

import type { NewsItem } from './types'

// =============================================================================
// USERNAME GENERATOR
// Combinatorial system producing 50,000+ unique usernames
// =============================================================================

const FIRST_NAMES = [
  'mike', 'tony', 'jake', 'chad', 'kyle', 'brad', 'derek', 'tyler',
  'ryan', 'kevin', 'steve', 'dave', 'matt', 'chris', 'nick', 'dan',
  'alex', 'max', 'ben', 'joe', 'tom', 'sam', 'jay', 'ray', 'dom',
  'vince', 'frank', 'lou', 'sal', 'vinny', 'marco', 'leo', 'gio',
  'peter', 'john', 'paul', 'mark', 'james', 'rob', 'bob', 'ed',
  'lisa', 'sarah', 'kate', 'amy', 'jess', 'emma', 'mia', 'zoe',
  'nina', 'tara', 'lexi', 'cara', 'dana', 'gina', 'tina', 'val',
  'gordon', 'warren', 'carl', 'jim', 'bill', 'ken', 'ted'
]

const NICKNAMES = [
  'bigmike', 'tinytony', 'fasteddie', 'slickrick', 'crazyivan',
  'silentbob', 'luckylou', 'smartmoney', 'deepvalue', 'yoloking',
  'paperboy', 'diamonddan', 'bullishben', 'bearishbob', 'moonman',
  'rocketroy', 'steadysteve', 'swingking', 'dipbuyer', 'topseller',
  'cashflow', 'greenday', 'redflag', 'bigshort', 'longgame',
  'quickflip', 'holdgang', 'sensei', 'ogtrader', 'newmoney',
  'thekid', 'thedon', 'mrbeast', 'daytrader', 'nightowl'
]

const PREFIXES = [
  'wolf', 'bull', 'bear', 'whale', 'shark', 'diamond', 'paper',
  'moon', 'degen', 'alpha', 'sigma', 'chad', 'based', 'crypto',
  'stock', 'trade', 'profit', 'margin', 'hedge', 'quant', 'ape',
  'tendies', 'yolo', 'stonk', 'calls', 'puts', 'theta', 'gamma'
]

const LOCATIONS = [
  'wallst', 'mainst', 'nyc', 'miami', 'la', 'chi', 'boston',
  'austin', 'denver', 'london', 'dubai', 'tokyo', 'hk', 'singapore',
  'zurich', 'vegas', 'atlanta', 'seattle', 'sf', 'detroit', 'philly'
]

const SUFFIXES = [
  'trader', 'capital', 'fund', 'street', 'trades', 'invests',
  'money', 'gains', 'profits', 'holdings', 'wealth', 'assets',
  'group', 'partners', 'ventures', 'bets', 'plays', 'moves'
]

type CapStyle = 'upper' | 'lower' | 'pascal'

function applyCapStyle(str: string, style: CapStyle): string {
  switch (style) {
    case 'upper':
      return str.toUpperCase()
    case 'lower':
      return str.toLowerCase()
    case 'pascal':
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
}

function randomCapStyle(): CapStyle {
  const styles: CapStyle[] = ['upper', 'lower', 'pascal', 'pascal', 'pascal', 'lower', 'upper']
  return styles[Math.floor(Math.random() * styles.length)]
}

function generateNumber(): string {
  const patterns = [
    () => '',
    () => '',
    () => '',
    () => String(Math.floor(Math.random() * 99) + 1),
    () => String(Math.floor(Math.random() * 99) + 1),
    () => String((Math.floor(Math.random() * 9) + 1)) + '00',
    () => '20' + String(Math.floor(Math.random() * 10) + 15),
    () => String(Math.floor(Math.random() * 9) + 1) + 'x',
    () => '0' + String(Math.floor(Math.random() * 9) + 1),
    () => String(Math.floor(Math.random() * 9) + 1) + 'k',
    () => '69',
    () => '420',
    () => '99',
    () => '1',
  ]
  return patterns[Math.floor(Math.random() * patterns.length)]()
}

function generateSeparator(): string {
  const separators = ['', '', '', '', '_', '_', '.', '-']
  return separators[Math.floor(Math.random() * separators.length)]
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateUsername(): string {
  const formatRoll = Math.random()
  const primaryStyle = randomCapStyle()
  const secondaryStyle = Math.random() > 0.7 ? randomCapStyle() : primaryStyle

  let username: string

  if (formatRoll < 0.15) {
    // Format: WOLFOFDUBAI99 (prefix + "of" + location + number)
    const prefix = applyCapStyle(randomFrom(PREFIXES), primaryStyle)
    const location = applyCapStyle(randomFrom(LOCATIONS), primaryStyle)
    const connector = primaryStyle === 'upper' ? 'OF' : primaryStyle === 'lower' ? 'of' : 'Of'
    username = prefix + connector + location + generateNumber()

  } else if (formatRoll < 0.25) {
    // Format: peterjohn / PeterJohn / PETERJOHN (two names smashed)
    const name1 = randomFrom(FIRST_NAMES)
    const name2 = randomFrom(FIRST_NAMES)
    if (primaryStyle === 'pascal') {
      username = applyCapStyle(name1, 'pascal') + applyCapStyle(name2, 'pascal') + generateNumber()
    } else {
      username = applyCapStyle(name1 + name2, primaryStyle) + generateNumber()
    }

  } else if (formatRoll < 0.35) {
    // Format: Gordon_trades / GORDON_TRADES / gordon_trades
    const name = applyCapStyle(randomFrom(FIRST_NAMES), primaryStyle)
    const suffix = applyCapStyle(randomFrom(SUFFIXES), primaryStyle)
    username = name + '_' + suffix + generateNumber()

  } else if (formatRoll < 0.45) {
    // Format: BigMikeMiami / BIGMIKEMIAMI / bigmikemiami
    const nickname = applyCapStyle(randomFrom(NICKNAMES), primaryStyle)
    const location = applyCapStyle(randomFrom(LOCATIONS), secondaryStyle)
    username = nickname + location + generateNumber()

  } else if (formatRoll < 0.55) {
    // Format: mike_nyc_trades / MIKE_NYC / MikeNYC
    const name = applyCapStyle(randomFrom(FIRST_NAMES), primaryStyle)
    const location = applyCapStyle(randomFrom(LOCATIONS), secondaryStyle)
    const sep = generateSeparator()
    const addSuffix = Math.random() > 0.6
    if (addSuffix) {
      const suffix = applyCapStyle(randomFrom(SUFFIXES), primaryStyle)
      username = name + sep + location + sep + suffix + generateNumber()
    } else {
      username = name + sep + location + generateNumber()
    }

  } else if (formatRoll < 0.65) {
    // Format: DiamondHands99 / DIAMONDHANDS / diamondhands
    const prefix = applyCapStyle(randomFrom(PREFIXES), primaryStyle)
    const suffix = applyCapStyle(randomFrom(['hands', 'gang', 'king', 'god', 'lord', 'boy', 'man', 'bro']), secondaryStyle)
    username = prefix + suffix + generateNumber()

  } else if (formatRoll < 0.75) {
    // Format: the_real_tony / TheRealTony / THEREALTONY
    const name = applyCapStyle(randomFrom(FIRST_NAMES), primaryStyle)
    const theReal = primaryStyle === 'upper' ? 'THEREAL' : primaryStyle === 'lower' ? 'thereal' : 'TheReal'
    const sep = Math.random() > 0.5 ? '_' : ''
    if (sep) {
      const the = applyCapStyle('the', primaryStyle)
      const real = applyCapStyle('real', primaryStyle)
      username = the + sep + real + sep + name + generateNumber()
    } else {
      username = theReal + name + generateNumber()
    }

  } else if (formatRoll < 0.85) {
    // Format: TonyTrades / tony.trades / TONY_TRADES
    const name = applyCapStyle(randomFrom(FIRST_NAMES), primaryStyle)
    const action = applyCapStyle(randomFrom(['trades', 'bets', 'wins', 'holds', 'buys', 'sells', 'yolos', 'stacks']), secondaryStyle)
    const sep = generateSeparator()
    username = name + sep + action + generateNumber()

  } else if (formatRoll < 0.92) {
    // Format: mr_tendies / MrTendies / MR_TENDIES
    const title = applyCapStyle(randomFrom(['mr', 'dr', 'sir', 'don', 'king', 'lil', 'big', 'og']), primaryStyle)
    const noun = applyCapStyle(randomFrom([...PREFIXES.slice(0, 10), ...NICKNAMES.slice(0, 10)]), secondaryStyle)
    const sep = generateSeparator()
    username = title + sep + noun + generateNumber()

  } else {
    // Format: xxWOLFxx / xXxTonyxXx / __chad__ (edgy)
    const core = applyCapStyle(randomFrom([...FIRST_NAMES.slice(0, 20), ...PREFIXES.slice(0, 10)]), primaryStyle)
    const wrappers = [
      ['xx', 'xx'],
      ['xXx', 'xXx'],
      ['__', '__'],
      ['x_', '_x'],
      ['_', '_'],
      ['', '69'],
      ['', '420'],
    ]
    const [pre, post] = wrappers[Math.floor(Math.random() * wrappers.length)]
    username = pre + core + post + (Math.random() > 0.5 ? generateNumber() : '')
  }

  // Clean up any double separators or weird patterns
  username = username.replace(/[_.\-]{2,}/g, '_').replace(/^[_.\-]|[_.\-]$/g, '')

  return '@' + username
}

// =============================================================================
// MESSAGE TEMPLATES
// =============================================================================

interface GossipTemplate {
  id: string
  template: string
  weight: number
  requiresAsset?: boolean
  amountRange?: { min: number; max: number }
  useLogarithmic?: boolean  // For net worth milestones with wide range
}

const GOSSIP_TEMPLATES: GossipTemplate[] = [
  // Single trade profit (high frequency)
  {
    id: 'single_trade_profit',
    template: 'WALL ST GOSSIP: {USER} JUST MADE {AMOUNT} IN A SINGLE TRADE.',
    weight: 6,
    amountRange: { min: 500_000, max: 50_000_000 },
  },

  // Net worth milestone (logarithmic distribution from $5M to $50B)
  {
    id: 'net_worth_milestone',
    template: 'WALL ST GOSSIP: {USER} JUST REACHED {AMOUNT} NET WORTH.',
    weight: 8,
    useLogarithmic: true,
    amountRange: { min: 5_000_000, max: 50_000_000_000 },
  },

  // Single trade flex (with asset)
  {
    id: 'single_trade_asset',
    template: 'WALL ST GOSSIP: {USER} JUST MADE {AMOUNT} ON {ASSET}. SINGLE TRADE.',
    weight: 4,
    requiresAsset: true,
    amountRange: { min: 300_000, max: 10_000_000 },
  },

  // Single trade flex (big money, no asset)
  {
    id: 'single_trade_big',
    template: 'WALL ST GOSSIP: {USER} JUST MADE {AMOUNT} ON A SINGLE TRADE.',
    weight: 1,
    amountRange: { min: 10_000_000, max: 100_000_000 },
  },

  // Lifestyle flex
  {
    id: 'more_than_most',
    template: 'WALL ST GOSSIP: {USER} MADE MORE TODAY THAN MOST MAKE IN A YEAR.',
    weight: 3,
  },
]

// Asset names for gossip messages (human-readable)
const GOSSIP_ASSETS = [
  'NASDAQ', 'BIOTECH', 'DEFENSE', 'OIL', 'URANIUM', 'LITHIUM',
  'GOLD', 'BTC', 'ALTCOINS', 'TESLA', 'EMERGING MARKETS', 'COFFEE'
]

function formatGossipAmount(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

function generateRandomAmount(min: number, max: number): number {
  // Generate amounts that look realistic (round-ish numbers)
  const range = max - min
  const raw = min + Math.random() * range

  // Round to nearest "nice" number based on magnitude
  if (raw >= 10_000_000) {
    return Math.round(raw / 1_000_000) * 1_000_000
  }
  if (raw >= 1_000_000) {
    return Math.round(raw / 100_000) * 100_000
  }
  return Math.round(raw / 10_000) * 10_000
}

function generateLogarithmicAmount(min: number, max: number): number {
  // Logarithmic distribution: more likely to get lower values
  // For net worth milestones spanning $15M to $80B
  const logMin = Math.log10(min)
  const logMax = Math.log10(max)
  const logValue = logMin + Math.random() * (logMax - logMin)
  const raw = Math.pow(10, logValue)

  // Round to nice numbers based on magnitude
  if (raw >= 1_000_000_000) {
    return Math.round(raw / 1_000_000_000) * 1_000_000_000
  }
  if (raw >= 100_000_000) {
    return Math.round(raw / 100_000_000) * 100_000_000
  }
  if (raw >= 10_000_000) {
    return Math.round(raw / 10_000_000) * 10_000_000
  }
  return Math.round(raw / 1_000_000) * 1_000_000
}

function selectTemplate(_playerNetWorth: number): GossipTemplate {
  // Weighted random selection
  const totalWeight = GOSSIP_TEMPLATES.reduce((sum, t) => sum + t.weight, 0)
  let roll = Math.random() * totalWeight

  for (const template of GOSSIP_TEMPLATES) {
    roll -= template.weight
    if (roll <= 0) {
      return template
    }
  }

  return GOSSIP_TEMPLATES[GOSSIP_TEMPLATES.length - 1]
}

export function generateGossipMessage(playerNetWorth: number): string {
  const template = selectTemplate(playerNetWorth)
  const username = generateUsername()

  let message = template.template.replace('{USER}', username)

  // Replace {AMOUNT} if needed (use logarithmic for net worth milestones)
  if (template.amountRange) {
    const amount = template.useLogarithmic
      ? generateLogarithmicAmount(template.amountRange.min, template.amountRange.max)
      : generateRandomAmount(template.amountRange.min, template.amountRange.max)
    message = message.replace('{AMOUNT}', formatGossipAmount(amount))
  }

  // Replace {ASSET} if needed
  if (template.requiresAsset) {
    const asset = randomFrom(GOSSIP_ASSETS)
    message = message.replace('{ASSET}', asset)
  }

  return message
}

// =============================================================================
// TRIGGER LOGIC
// =============================================================================

export interface GossipState {
  gossipCount: number
  lastGossipDay: number
}

export const DEFAULT_GOSSIP_STATE: GossipState = {
  gossipCount: 0,
  lastGossipDay: 0,
}

interface GossipTriggerParams {
  day: number
  gameLength: number
  gossipState: GossipState
  isSidewaysMarket: boolean
  hasMajorEvent: boolean
}

export function shouldShowGossip(params: GossipTriggerParams): boolean {
  const { day, gameLength, gossipState, isSidewaysMarket, hasMajorEvent } = params

  // Calculate max gossip per game based on game length
  const maxGossip = gameLength === 30 ? 2 : gameLength === 45 ? 3 : 4

  // Already hit limit
  if (gossipState.gossipCount >= maxGossip) {
    return false
  }

  // Scale day thresholds proportionally to game length
  const earlyGameCutoff = Math.floor(gameLength * 0.17)  // ~17% (day 5 for 30-day)
  const minSpacing = Math.floor(gameLength * 0.23)       // ~23% (7 days for 30-day)

  // Too early in game
  if (day <= earlyGameCutoff) {
    return false
  }

  // Too late in game (last 3 days, already uses gameLength)
  if (day > gameLength - 3) {
    return false
  }

  // Not enough spacing (scales with game length)
  if (day - gossipState.lastGossipDay < minSpacing) {
    return false
  }

  // Market conditions: only show during sideways/quiet periods
  if (!isSidewaysMarket) {
    return false
  }

  // Don't show during major events
  if (hasMajorEvent) {
    return false
  }

  // Probability check: ~30% chance on eligible days
  // This ensures gossip feels random, not predictable
  if (Math.random() > 0.30) {
    return false
  }

  return true
}

export function createGossipNewsItem(playerNetWorth: number): NewsItem {
  const headline = generateGossipMessage(playerNetWorth)

  return {
    headline,
    effects: {}, // Gossip has no market effects
    labelType: 'none', // Blends in with other news, no dramatic label
  }
}

// =============================================================================
// MARKET CONDITION HELPERS
// =============================================================================

/**
 * Determines if the market is "sideways" (low volatility)
 * Used to trigger gossip only during quiet periods
 */
export function isMarketSideways(priceChanges: Record<string, number>): boolean {
  const changes = Object.values(priceChanges)
  if (changes.length === 0) return true

  // Calculate average absolute change
  const avgChange = changes.reduce((sum, c) => sum + Math.abs(c), 0) / changes.length

  // Sideways = average change less than 5%
  return avgChange < 0.05
}

/**
 * Determines if there's a major event happening today
 * Major events = spikes, breaking news, chain resolutions
 */
export function hasMajorEventToday(todayNews: NewsItem[]): boolean {
  // Check if any news has breaking/major label or significant effects
  for (const news of todayNews) {
    if (news.labelType === 'breaking') {
      return true
    }

    // Check if any effect is > 15% (major market move)
    const maxEffect = Math.max(...Object.values(news.effects).map(Math.abs), 0)
    if (maxEffect > 0.15) {
      return true
    }
  }

  return false
}
