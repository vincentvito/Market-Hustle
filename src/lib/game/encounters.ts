// Random Encounters - High-stakes popup events during gameplay
// Design: Max 2 encounters per game, 8-day cooldown, first encounter no earlier than Day 3

export type EncounterType = 'sec' | 'divorce' | 'shitcoin' | 'kidney' | 'roulette' | 'tax'

export interface EncounterChoice {
  label: string
  description: string
}

export interface EncounterDefinition {
  id: EncounterType
  title: string
  emoji: string
  description: string
  flavor?: string  // Additional flavor text
  choices: [EncounterChoice, EncounterChoice]  // Always binary
  // Special properties for specific encounters
  requiresCash?: number  // Minimum cash needed (e.g., roulette)
  maxPerGame?: number    // How many times this can occur (default: unlimited within 2 total)
  secondDescription?: string  // Alternative description for second occurrence (divorce)
}

// Encounter outcomes depend on which choice is made
export interface EncounterResult {
  headline: string
  cashChange?: number
  gameOver?: boolean
  gameOverReason?: string
  // Roulette-specific fields for result display
  spinResult?: number        // The number the ball landed on (0-36)
  spinColor?: RouletteColor  // The color of the result
  // Forced liquidation fields (for SEC/Divorce when cash < penalty)
  liquidationRequired?: number  // Total amount to extract (will force-sell assets if cash insufficient)
}

// Roulette-specific types
export type RouletteColor = 'red' | 'black' | 'zero'

export interface RouletteState {
  color: RouletteColor | null
  betAmount: number
}

// All encounter definitions
export const ENCOUNTERS: Record<EncounterType, EncounterDefinition> = {
  sec: {
    id: 'sec',
    title: 'SEC INVESTIGATION',
    emoji: '🕵️',
    description: 'Federal agents are at your door. An anonymous tip flagged your trading patterns. You can cooperate and pay a fine, or fight it in court.',
    flavor: '"We have questions about your recent activity..."',
    choices: [
      { label: 'PAY FINE', description: 'Lose 20% of net worth, but avoid trial' },
      { label: 'FIGHT IT', description: '50% chance of vindication, 50% chance of prison' },
    ],
    maxPerGame: 1,
  },
  divorce: {
    id: 'divorce',
    title: 'DIVORCE PAPERS',
    emoji: '💔',
    description: "Your spouse found out about your 'investment strategies'. They want half of everything. Now.",
    flavor: '"I\'m taking the yacht."',
    choices: [
      { label: 'SETTLE', description: 'Lose 50% of net worth, avoid drama' },
      { label: 'CONTEST', description: '30% chance they back down, 70% chance they take 70%' },
    ],
    maxPerGame: 2,
    secondDescription: "Your second spouse is also leaving. Apparently your trading addiction hasn't improved. They've hired a better lawyer this time.",
  },
  shitcoin: {
    id: 'shitcoin',
    title: 'MINT A SHITCOIN',
    emoji: '🪙',
    description: 'A shady developer offers to create a meme coin with your face on it. "Trust me bro, we\'ll pump it together."',
    flavor: '"$YOURCOIN could be the next DOGE!"',
    choices: [
      { label: 'MINT IT', description: 'Pay $5K, 20% chance of 10x return, 80% rug pull' },
      { label: 'PASS', description: 'Keep your dignity (and your $5K)' },
    ],
    requiresCash: 5000,
  },
  kidney: {
    id: 'kidney',
    title: 'SELL A KIDNEY',
    emoji: '🫘',
    description: "A 'medical professional' approaches you in a dark alley. Business has been slow and they're paying top dollar for organs.",
    flavor: '"You have two kidneys, you only need one... probably."',
    choices: [
      { label: 'SELL IT', description: '$75K cash, 25% chance of dying on the table' },
      { label: 'KEEP IT', description: 'Stay intact, stay broke' },
    ],
    maxPerGame: 1,
  },
  roulette: {
    id: 'roulette',
    title: 'HIGH ROLLER INVITATION',
    emoji: '🎰',
    description: 'A black limo pulls up. "The Whale Room is open tonight. One spin. Double or nothing."',
    flavor: '"Fortune favors the bold."',
    choices: [
      { label: 'PLAY', description: 'Choose your color and amount' },
      { label: 'DECLINE', description: 'Keep your money, keep your sanity' },
    ],
    requiresCash: 2000,  // Minimum to play
  },
  tax: {
    id: 'tax',
    title: 'IRS AUDIT',
    emoji: '📋',
    description: 'The IRS has questions about your offshore accounts and "creative" deductions. Your accountant is sweating.',
    flavor: '"We\'ve noticed some... irregularities."',
    choices: [
      { label: 'PAY UP', description: 'Lose 15% of net worth, avoid prosecution' },
      { label: 'OFFSHORE', description: '40% chance you escape, 60% chance you lose 30% + prison risk' },
    ],
    maxPerGame: 1,
  },
}

// Encounter state for the game
export interface EncounterState {
  encounterCount: number          // Total encounters this game (max 2)
  lastEncounterDay: number        // For 8-day cooldown
  usedSEC: boolean                // SEC can only happen once
  usedKidney: boolean             // Kidney can only happen once
  divorceCount: number            // Max 2 divorces per game
  usedTax: boolean                // Tax can only happen once
}

export const DEFAULT_ENCOUNTER_STATE: EncounterState = {
  encounterCount: 0,
  lastEncounterDay: 0,
  usedSEC: false,
  usedKidney: false,
  divorceCount: 0,
  usedTax: false,
}

// Check if encounters can trigger
export function canTriggerEncounter(
  day: number,
  state: EncounterState,
  gameLength: number = 30
): boolean {
  // Max 2 encounters per game
  if (state.encounterCount >= 2) return false

  // No encounters before Day 3
  if (day < 3) return false

  // No encounters in last 3 days of game
  if (day > gameLength - 3) return false

  // 8-day cooldown between encounters
  if (state.lastEncounterDay > 0 && day - state.lastEncounterDay < 8) return false

  return true
}

// Get available encounters based on game state
export function getAvailableEncounters(
  state: EncounterState,
  cash: number,
  netWorth: number
): EncounterType[] {
  const available: EncounterType[] = []

  // SEC - once per game
  if (!state.usedSEC) available.push('sec')

  // Divorce - max 2 per game
  if (state.divorceCount < 2) available.push('divorce')

  // Shitcoin - needs $5K
  if (cash >= 5000) available.push('shitcoin')

  // Kidney - once per game, only when desperate (net worth < $30K)
  if (!state.usedKidney && netWorth < 30000) available.push('kidney')

  // Roulette - needs $2K minimum
  if (cash >= 2000) available.push('roulette')

  // Tax - once per game
  if (!state.usedTax) available.push('tax')

  return available
}

export function rollForEncounter(
  day: number,
  state: EncounterState,
  cash: number,
  params: {
    netWorth: number
    gameLength?: number
    ownsArtCollection?: boolean
    wifeSuspicion?: number
    fbiHeat?: number
  }
): EncounterType | null {
  const { netWorth, gameLength = 30, ownsArtCollection = false, wifeSuspicion = 0, fbiHeat = 0 } = params
  if (!canTriggerEncounter(day, state, gameLength)) return null

  const available = getAvailableEncounters(state, cash, netWorth)
  if (available.length === 0) return null

  // Independent exponential roll for SEC: prob = 0.5 * (fbiHeat/90)^3
  if (available.includes('sec') && fbiHeat > 0) {
    const secProb = 0.5 * Math.pow(fbiHeat / 90, 3)
    if (Math.random() < secProb) {
      return 'sec'
    }
  }

  // Independent exponential roll for divorce: prob = 0.5 * (wifeSuspicion/90)^3
  if (available.includes('divorce') && wifeSuspicion > 0) {
    const divorceProb = 0.5 * Math.pow(wifeSuspicion / 90, 3)
    if (Math.random() < divorceProb) {
      return 'divorce'
    }
  }

  // Fall through to random pool (shitcoin/kidney/roulette/tax only)
  const poolEncounters = available.filter(e => e !== 'sec' && e !== 'divorce')
  if (poolEncounters.length === 0) return null

  // Base trigger probability: 10-25% depending on game progress
  let triggerChance = 0.10
  const midGameThreshold = Math.floor(gameLength * 0.33)
  const lateGameThreshold = Math.floor(gameLength * 0.67)
  if (state.encounterCount === 0 && day > midGameThreshold) triggerChance = 0.15
  if (state.encounterCount === 0 && day > lateGameThreshold) triggerChance = 0.25

  if (Math.random() >= triggerChance) return null

  let selected = poolEncounters[Math.floor(Math.random() * poolEncounters.length)]

  // Art Collection protection: if tax was selected and player owns Art, 20% chance to skip
  if (selected === 'tax' && ownsArtCollection) {
    if (Math.random() < 0.20) {
      const nonTaxAvailable = poolEncounters.filter(e => e !== 'tax')
      if (nonTaxAvailable.length > 0) {
        selected = nonTaxAvailable[Math.floor(Math.random() * nonTaxAvailable.length)]
      } else {
        return null
      }
    }
  }

  return selected
}

export function resolveSEC(
  choice: 'pay' | 'fight',
  netWorth: number,
  trustFundBalance: number = 0
): EncounterResult {
  if (choice === 'pay') {
    const exposedNetWorth = Math.max(0, netWorth - trustFundBalance)
    const fine = Math.floor(exposedNetWorth * 0.20)
    return {
      headline: `SEC SETTLEMENT: You paid $${fine.toLocaleString('en-US')} to avoid prosecution`,
      liquidationRequired: fine,
    }
  } else {
    // Fight: 50/50
    if (Math.random() < 0.5) {
      return {
        headline: 'VINDICATED: SEC drops all charges, your reputation soars',
        cashChange: 0,
      }
    } else {
      return {
        headline: 'GUILTY: Federal prison. Your trading days are over.',
        gameOver: true,
        gameOverReason: 'IMPRISONED',
      }
    }
  }
}

export function resolveDivorce(
  choice: 'settle' | 'contest',
  netWorth: number,
  trustFundBalance: number = 0
): EncounterResult {
  const exposedNetWorth = Math.max(0, netWorth - trustFundBalance)
  if (choice === 'settle') {
    const loss = Math.floor(exposedNetWorth * 0.50)
    return {
      headline: `DIVORCE SETTLED: $${loss.toLocaleString('en-US')} gone, but you move on`,
      liquidationRequired: loss,
    }
  } else {
    // Contest: 30% they back down, 70% they take 70%
    if (Math.random() < 0.3) {
      return {
        headline: 'PRENUP ENFORCED: Your lawyers found a loophole. You keep everything.',
        cashChange: 0,
      }
    } else {
      const loss = Math.floor(exposedNetWorth * 0.70)
      return {
        headline: `CONTESTED AND LOST: $${loss.toLocaleString('en-US')} awarded to your ex`,
        liquidationRequired: loss,
      }
    }
  }
}

// Resolve Shitcoin
export function resolveShitcoin(
  choice: 'mint' | 'pass',
  cash: number
): EncounterResult {
  if (choice === 'pass') {
    return {
      headline: 'SHITCOIN DECLINED: You kept your dignity intact',
      cashChange: 0,
    }
  }

  const cost = 5000

  // 20% chance of 10x return
  if (Math.random() < 0.2) {
    const profit = cost * 10 - cost  // Net profit after initial investment
    return {
      headline: '$YOURCOIN TO THE MOON: Your shitcoin pumped 10x before you dumped',
      cashChange: profit,  // +$45K net
    }
  } else {
    return {
      headline: 'RUG PULLED: $YOURCOIN went to zero. The dev vanished.',
      cashChange: -cost,
    }
  }
}

// Resolve Kidney Sale
export function resolveKidney(
  choice: 'sell' | 'keep'
): EncounterResult {
  if (choice === 'keep') {
    return {
      headline: 'KIDNEY RETAINED: You walked away from the sketchy van',
      cashChange: 0,
    }
  }

  // 25% chance of death
  if (Math.random() < 0.25) {
    return {
      headline: 'SURGERY COMPLICATIONS: You didn\'t wake up from the anesthesia...',
      gameOver: true,
      gameOverReason: 'DECEASED',
    }
  } else {
    return {
      headline: 'SUCCESSFUL SURGERY: $75K richer, one kidney lighter',
      cashChange: 75000,
    }
  }
}

// Resolve Roulette - European roulette odds
// RED/BLACK: 18/37 (48.6%), ZERO: 1/37 (2.7%)
export function resolveRoulette(
  choice: 'play' | 'decline',
  color: RouletteColor | null,
  betAmount: number
): EncounterResult {
  if (choice === 'decline' || color === null) {
    return {
      headline: 'You left the Whale Room with your bankroll intact',
      cashChange: 0,
    }
  }

  // Spin the wheel - European roulette (0-36)
  const spin = Math.floor(Math.random() * 37)  // 0-36

  // Determine result color
  let spinColor: RouletteColor
  if (spin === 0) {
    spinColor = 'zero'
  } else {
    // Red numbers: 1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    spinColor = redNumbers.includes(spin) ? 'red' : 'black'
  }

  // Calculate winnings
  if (color === 'zero') {
    if (spinColor === 'zero') {
      // 35:1 payout for zero
      const winnings = betAmount * 35
      return {
        headline: `Your $${betAmount.toLocaleString('en-US')} becomes $${(betAmount + winnings).toLocaleString('en-US')}!`,
        cashChange: winnings,
        spinResult: spin,
        spinColor,
      }
    } else {
      return {
        headline: `You bet on ZERO`,
        cashChange: -betAmount,
        spinResult: spin,
        spinColor,
      }
    }
  } else {
    // Red or Black bet
    if (spinColor === color) {
      // 1:1 payout
      return {
        headline: `You double your bet!`,
        cashChange: betAmount,
        spinResult: spin,
        spinColor,
      }
    } else if (spinColor === 'zero') {
      return {
        headline: `House edge! Everyone loses.`,
        cashChange: -betAmount,
        spinResult: spin,
        spinColor,
      }
    } else {
      return {
        headline: `You bet on ${color.toUpperCase()}`,
        cashChange: -betAmount,
        spinResult: spin,
        spinColor,
      }
    }
  }
}

// Get description for divorce (changes on second occurrence)
export function getDivorceDescription(divorceCount: number): string {
  const encounter = ENCOUNTERS.divorce
  if (divorceCount === 1 && encounter.secondDescription) {
    return encounter.secondDescription
  }
  return encounter.description
}

export function resolveTax(
  choice: 'pay' | 'offshore',
  netWorth: number,
  trustFundBalance: number = 0
): EncounterResult {
  const exposedNetWorth = Math.max(0, netWorth - trustFundBalance)
  if (choice === 'pay') {
    const penalty = Math.floor(exposedNetWorth * 0.15)
    return {
      headline: `IRS SETTLEMENT: You paid $${penalty.toLocaleString('en-US')} in back taxes and penalties`,
      liquidationRequired: penalty,
    }
  } else {
    // Offshore: 40% escape, 60% bad
    if (Math.random() < 0.4) {
      return {
        headline: 'OFFSHORE SUCCESS: Your Swiss accounts remain hidden. For now.',
        cashChange: 0,
      }
    } else {
      // 60% bad outcome - lose 30%
      const penalty = Math.floor(exposedNetWorth * 0.30)
      // 50% of the bad outcomes also result in prison
      if (Math.random() < 0.5) {
        return {
          headline: 'TAX EVASION: Federal agents found everything. Your trading days are over.',
          gameOver: true,
          gameOverReason: 'IMPRISONED',
        }
      }
      return {
        headline: `AUDIT FAILED: Offshore scheme exposed. $${penalty.toLocaleString('en-US')} in penalties.`,
        liquidationRequired: penalty,
      }
    }
  }
}
