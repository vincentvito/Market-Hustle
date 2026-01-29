/**
 * Game Store Module
 *
 * This module exports the modular game store components.
 * The main useGame hook is in ../useGame.ts and combines these slices.
 */

// Types
export type {
  GameStore,
  AuthTierSlice,
  MechanicsSlice,
  AuthTierSliceCreator,
  MechanicsSliceCreator,
} from './types'

// Slices
export { createAuthTierSlice } from './slices/authTierSlice'
export { createMechanicsSlice } from './slices/mechanicsSlice'

// Helpers (for use by other modules if needed)
export {
  initPrices,
  initLifestylePrices,
  generatePositionId,
  mapGameOverReasonToOutcome,
  getActiveTopics,
  selectRandomEvent,
  selectRandomChain,
  selectRandomStartup,
  selectOutcome,
  selectOutcomeWithBonus,
  getRandomDuration,
} from './helpers'
