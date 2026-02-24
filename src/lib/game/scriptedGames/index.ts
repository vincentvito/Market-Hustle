import { SCRIPTED_GAME_1 } from './script1_yellowstone'
import { SCRIPTED_GAME_2 } from './script2_worldWar'
import { SCRIPTED_GAME_3 } from './script3_rollercoaster'
import type { ScriptedGameDefinition } from './types'

const SCRIPTED_GAMES: Record<number, ScriptedGameDefinition> = {
  1: SCRIPTED_GAME_1,
  2: SCRIPTED_GAME_2,
  3: SCRIPTED_GAME_3,
}

export function getScriptedGame(gameNumber: number): ScriptedGameDefinition | null {
  return SCRIPTED_GAMES[gameNumber] || null
}

export function isScriptedGame(totalGamesPlayed: number): boolean {
  return totalGamesPlayed < 3
}

export function getScriptedGameNumber(totalGamesPlayed: number): number | null {
  if (totalGamesPlayed >= 3) return null
  return totalGamesPlayed + 1
}

export type { ScriptedGameDefinition, ScriptedDay, ScriptedNewsItem } from './types'
