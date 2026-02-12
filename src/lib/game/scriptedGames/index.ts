import { SCRIPTED_GAME_1 } from './script1_yellowstone'
import { SCRIPTED_GAME_2 } from './script2_worldWar'
import { SCRIPTED_GAME_3 } from './script3_rollercoaster'
import type { ScriptedGameDefinition } from './types'

const SCRIPTED_GAMES: Record<number, ScriptedGameDefinition> = {
  1: SCRIPTED_GAME_1,
  2: SCRIPTED_GAME_2,
  3: SCRIPTED_GAME_3,
}

/** Get scripted game definition by game number (1, 2, or 3). Returns null for game 4+. */
export function getScriptedGame(gameNumber: number): ScriptedGameDefinition | null {
  return SCRIPTED_GAMES[gameNumber] || null
}

/** Check if this should be a scripted game based on total games played (before increment). */
export function isScriptedGame(totalGamesPlayed: number): boolean {
  return totalGamesPlayed < 3
}

/** Get the scripted game number (1-3) or null if not scripted. */
export function getScriptedGameNumber(totalGamesPlayed: number): number | null {
  if (totalGamesPlayed >= 3) return null
  return totalGamesPlayed + 1
}

export type { ScriptedGameDefinition, ScriptedDay, ScriptedNewsItem } from './types'
