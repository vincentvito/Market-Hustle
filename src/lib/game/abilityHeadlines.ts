import type { PEAbilityId } from './types'

/**
 * Headlines for PE ability rumor → event buildup system.
 *
 * When a player executes an ability:
 * - Day N: RUMOR headline appears (vague teaser)
 * - Day N+1: SUCCESS or BACKFIRE headline fires with effects
 */
export const ABILITY_HEADLINES: Record<
  PEAbilityId,
  {
    rumor: string
    success: string
    backfire: string
  }
> = {
  // =============================================================================
  // LOBBY/POLITICAL (Sal's Corner)
  // =============================================================================

  defense_spending_bill: {
    rumor: 'RUMORS OF MILITARY LOBBYISTS MEETING WITH SENATORS',
    success: 'SURPRISE DEFENSE BILL PASSES - $200B BOOST',
    backfire: 'LOBBYING SCANDAL - FBI INVESTIGATING DEFENSE CONTRACTORS',
  },

  drug_fast_track: {
    rumor: 'PHARMA EXECUTIVES SEEN VISITING CAPITOL HILL',
    success: 'FDA FAST-TRACK ACT PASSES - DRUG APPROVALS ACCELERATED',
    backfire: 'PHARMA LOBBYING EXPOSED - CONGRESS LAUNCHES INVESTIGATION',
  },

  // =============================================================================
  // GEOPOLITICAL OPERATIONS (Blackstone Services)
  // =============================================================================

  yemen_operations: {
    rumor: 'UNIDENTIFIED VESSELS SPOTTED NEAR BOSPHORUS STRAIT',
    success: 'HOUTHI REBELS SEIZE RED SEA SHIPPING LANE - OIL TANKERS DIVERTED',
    backfire: 'COVERT OPERATION EXPOSED - MERCENARY GROUP LINKED TO AMERICAN FIRM',
  },

  chile_acquisition: {
    rumor: 'FOREIGN INVESTORS EYEING ATACAMA DESERT MINES',
    success: 'CHILEAN LITHIUM MINE ACQUIRED BY PRIVATE EQUITY - PRICES SURGE',
    backfire: 'CHILE NATIONALIZES FOREIGN-HELD MINES - INVESTORS WIPED OUT',
  },

  // =============================================================================
  // BIOWEAPON (Lazarus Genomics)
  // =============================================================================

  project_chimera: {
    rumor: 'MYSTERIOUS ILLNESS CLUSTERS REPORTED IN GUANGDONG PROVINCE',
    success: 'WHO DECLARES NEW PANDEMIC - MARKETS IN TURMOIL',
    backfire: 'BIOLAB LEAK TRACED TO US COMPANY - FBI RAIDS HEADQUARTERS',
  },

  // =============================================================================
  // MEDIA MANIPULATION (Apex Media)
  // =============================================================================

  operation_divide: {
    rumor: 'UNUSUAL SPIKE IN POLARIZING CONTENT ACROSS SOCIAL MEDIA',
    success: 'PROTESTS ERUPT ACROSS MAJOR US CITIES - GOLD SURGES AS SAFE HAVEN',
    backfire: 'FOREIGN DISINFO NETWORK EXPOSED - MEDIA COMPANY UNDER INVESTIGATION',
  },
}
