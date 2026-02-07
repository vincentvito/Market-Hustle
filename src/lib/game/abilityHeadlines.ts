import type { PEAbilityId, AbilityHeadlines } from './types'

/**
 * Headlines for PE ability 3-part story arc system.
 *
 * When a player executes an ability:
 * - Day N: Part 1 headline (story begins)
 * - Day N+1: Part 2 headline (tension builds, complications arise)
 * - Day N+2: Part 3 headline (resolution - favorable or unfavorable) + effects
 */
export const ABILITY_HEADLINES: Record<PEAbilityId, AbilityHeadlines> = {
  // =============================================================================
  // LOBBY/POLITICAL (Sal's Corner)
  // =============================================================================

  defense_spending_bill: {
    part1: 'WHISPERS: K STREET LOBBYISTS SCHEDULING URGENT MEETINGS WITH SENATE ARMED SERVICES COMMITTEE',
    part2: 'DEVELOPING: PENTAGON OFFICIALS SPOTTED AT PRIVATE DINNER WITH DEFENSE CONTRACTORS',
    successPart3: 'BREAKING: SURPRISE DEFENSE AUTHORIZATION BILL PASSES - $200B BOOST TO MILITARY SPENDING',
    backfirePart3: 'SCANDAL: FBI RAIDS LOBBYING FIRM - BRIBERY INVESTIGATION ROCKS DEFENSE INDUSTRY',
  },

  drug_fast_track: {
    part1: 'RUMOR: PHARMA EXECUTIVES SEEN ENTERING CAPITOL BUILDING THROUGH PRIVATE ENTRANCE',
    part2: 'DEVELOPING: LEAKED MEMO SUGGESTS FDA DEREGULATION BILL IN COMMITTEE - PHARMA STOCKS VOLATILE',
    successPart3: 'BREAKING: FDA FAST-TRACK ACT PASSES - DRUG APPROVAL TIMES CUT BY 60%',
    backfirePart3: 'EXPOSED: LOBBYING SCANDAL EXPLODES - CONGRESS LAUNCHES FULL INVESTIGATION INTO PHARMA TIES',
  },

  // =============================================================================
  // GEOPOLITICAL OPERATIONS (Blackstone Services)
  // =============================================================================

  yemen_operations: {
    part1: 'UNCONFIRMED: UNIDENTIFIED VESSELS SPOTTED NEAR BOSPHORUS STRAIT - SECURITY ANALYSTS MONITORING',
    part2: 'DEVELOPING: COMMERCIAL SHIPPING REROUTING AROUND RED SEA - INSURANCE PREMIUMS SPIKING',
    successPart3: 'BREAKING: HOUTHI REBELS SEIZE RED SEA CHOKEPOINT - OIL TANKERS DIVERTED TO CAPE ROUTE',
    backfirePart3: 'EXPOSED: COVERT MERCENARY OPERATION TRACED TO AMERICAN FIRM - INTERNATIONAL OUTCRY',
  },

  chile_acquisition: {
    part1: 'RUMOR: MYSTERIOUS FOREIGN CONSORTIUM EYEING ATACAMA DESERT LITHIUM DEPOSITS',
    part2: 'DEVELOPING: CHILEAN MINING UNIONS PROTEST POTENTIAL FOREIGN ACQUISITION - GOVERNMENT SILENT',
    successPart3: 'BREAKING: PRIVATE EQUITY FIRM SECURES 40-YEAR LITHIUM RIGHTS - SUPPLY SQUEEZE IMMINENT',
    backfirePart3: 'NATIONALIZED: CHILE SEIZES FOREIGN-HELD MINES IN MIDNIGHT DECREE - INVESTORS WIPED OUT',
  },

  // =============================================================================
  // BIOWEAPON (Lazarus Genomics)
  // =============================================================================

  project_chimera: {
    part1: 'ALERT: MYSTERIOUS RESPIRATORY ILLNESS CLUSTERS REPORTED IN GUANGDONG PROVINCE',
    part2: 'DEVELOPING: WHO DISPATCHES EMERGENCY TEAM - AIRPORTS IMPLEMENTING ENHANCED SCREENING',
    successPart3: 'PANDEMIC: WHO DECLARES GLOBAL HEALTH EMERGENCY - MARKETS IN FREEFALL',
    backfirePart3: 'TRACED: BIOLAB LEAK LINKED TO US BIOTECH FIRM - FBI RAIDS HEADQUARTERS',
  },

  // =============================================================================
  // MEDIA MANIPULATION (Apex Media)
  // =============================================================================

  operation_divide: {
    part1: 'PATTERN: UNUSUAL SPIKE IN DIVISIVE CONTENT ACROSS SOCIAL PLATFORMS - BOTS SUSPECTED',
    part2: 'DEVELOPING: VIRAL MISINFORMATION CAMPAIGN TRACED TO COORDINATED NETWORK - TENSIONS RISING',
    successPart3: 'CHAOS: PROTESTS ERUPT ACROSS MAJOR US CITIES - INVESTORS FLEE TO SAFE HAVENS',
    backfirePart3: 'UNMASKED: FOREIGN DISINFO NETWORK EXPOSED - MEDIA COMPANY UNDER FEDERAL INVESTIGATION',
  },

  // Special case: run_for_president triggers ElectionPopup immediately, no story arc
  // These headlines are kept for consistency but not used in the story arc system
  run_for_president: {
    part1: 'MEDIA MOGUL ANNOUNCES PRESIDENTIAL EXPLORATORY COMMITTEE',
    part2: 'DEVELOPING: CAMPAIGN TRAIL HEATS UP - POLLS SHOW DEAD HEAT',
    successPart3: 'HISTORIC UPSET: BILLIONAIRE MEDIA MOGUL WINS PRESIDENCY',
    backfirePart3: 'CAMPAIGN IMPLODES: CANDIDATE CONCEDES AS SCANDALS MOUNT',
  },
}
