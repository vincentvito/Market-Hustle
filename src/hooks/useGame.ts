/**
 * useGame - Main Game Store Hook
 *
 * This is the entry point for the game store, combining two slices:
 * - AuthTierSlice: User tier, login state, game limits, duration/theme selection
 * - MechanicsSlice: All game state and mechanics (prices, holdings, events, trading, etc.)
 *
 * The store is split into modular slices for maintainability, but presents
 * a unified API to consumers. All 25+ components that import from this file
 * continue to work without any changes.
 *
 * @example
 * // Full destructuring (common)
 * const { cash, holdings, buy, sell } = useGame()
 *
 * // Selector pattern (for specific values)
 * const screen = useGame(state => state.screen)
 *
 * // Selective destructuring
 * const { startGame, userTier, isLoggedIn } = useGame()
 */

import { create } from 'zustand'
import { createAuthTierSlice } from './gameStore/slices/authTierSlice'
import { createMechanicsSlice } from './gameStore/slices/mechanicsSlice'
import type { GameStore } from './gameStore/types'

// Re-export the GameStore type for consumers
export type { GameStore }

/**
 * Main game store hook.
 * Combines auth/tier slice and mechanics slice into a single unified store.
 */
export const useGame = create<GameStore>()((...args) => ({
  ...createAuthTierSlice(...args),
  ...createMechanicsSlice(...args),
}))
