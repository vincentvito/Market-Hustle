import { create } from 'zustand'
import { createAuthTierSlice } from './gameStore/slices/authTierSlice'
import { createMechanicsSlice } from './gameStore/slices/mechanicsSlice'
import type { GameStore } from './gameStore/types'

export type { GameStore }

export const useGame = create<GameStore>()((...args) => ({
  ...createAuthTierSlice(...args),
  ...createMechanicsSlice(...args),
}))
