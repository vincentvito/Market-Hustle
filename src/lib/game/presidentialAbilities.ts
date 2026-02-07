import type { PresidentialAbility, PresidentialAbilityId } from './types'

// =============================================================================
// PRESIDENTIAL ABILITIES - Endgame powers unlocked after winning the election
// Each ability can only be used ONCE (executive orders, not repeatable actions)
// =============================================================================

export const PRESIDENTIAL_ABILITIES: Record<PresidentialAbilityId, PresidentialAbility> = {
  declare_war_china: {
    id: 'declare_war_china',
    name: 'Declare War on China',
    emoji: '🇨🇳',
    flavor: 'Initiate military action against the world\'s second largest economy',
    cost: 500_000_000,
    effects: { emerging: -0.60, defense: 0.80, gold: 0.50 },
  },
  invade_venezuela: {
    id: 'invade_venezuela',
    name: 'Invade Venezuela',
    emoji: '🛢️',
    flavor: 'Secure Venezuelan oil reserves by force',
    cost: 300_000_000,
    effects: { oil: 0.70, emerging: -0.40, defense: 0.50 },
  },
  tariffs_asia: {
    id: 'tariffs_asia',
    name: '100% Tariffs on Asia',
    emoji: '🚢',
    flavor: 'Impose maximum tariffs on all Asian imports',
    cost: 0,
    effects: { emerging: -0.50, defense: 0.40 },
  },
  nationalize_big_tech: {
    id: 'nationalize_big_tech',
    name: 'Nationalize Big Tech',
    emoji: '🏛️',
    flavor: 'Seize control of major technology companies',
    cost: 0,
    effects: { nasdaq: -0.45 },
    cashGain: 2_000_000_000, // +$2B from seized assets
  },
  ban_social_media: {
    id: 'ban_social_media',
    name: 'Ban Social Media',
    emoji: '📵',
    flavor: 'Outlaw all social media platforms',
    cost: 0,
    effects: { nasdaq: -0.70 },
    apexBoost: 1.0, // +100% to Apex Media value
  },
  print_money: {
    id: 'print_money',
    name: 'Print Money',
    emoji: '💵',
    flavor: 'Order the Federal Reserve to print trillions',
    cost: 0,
    effects: {
      nasdaq: 0.20,
      btc: 0.50,
      tesla: 0.20,
      biotech: 0.20,
      defense: 0.20,
      emerging: 0.20,
      oil: 0.20,
      uranium: 0.20,
      lithium: 0.20,
      gold: 0.20,
      coffee: 0.20,
      altcoins: 0.50,
    },
    delayedEffect: {
      daysDelay: 3,
      effects: {
        nasdaq: -0.15,
        btc: -0.15,
        tesla: -0.15,
        biotech: -0.15,
        defense: -0.15,
        emerging: -0.15,
        oil: -0.15,
        uranium: -0.15,
        lithium: -0.15,
        gold: -0.15,
        coffee: -0.15,
        altcoins: -0.15,
      },
      headline: 'HYPERINFLATION FEARS CRASH MARKETS - FED ADMITS MISTAKE',
    },
  },
  pardon_yourself: {
    id: 'pardon_yourself',
    name: 'Pardon Yourself',
    emoji: '⚖️',
    flavor: 'Issue a presidential pardon for all your crimes',
    cost: 0,
    effects: {},
    fbiReset: true,
    permanentImmunity: true,
  },
}

// Get all presidential abilities as an array
export function getPresidentialAbilities(): PresidentialAbility[] {
  return Object.values(PRESIDENTIAL_ABILITIES)
}

// Get a specific presidential ability by ID
export function getPresidentialAbility(id: PresidentialAbilityId): PresidentialAbility {
  return PRESIDENTIAL_ABILITIES[id]
}
