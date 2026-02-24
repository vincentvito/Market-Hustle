/**
 * Auth Bridge
 *
 * Bridges AuthContext methods to the Zustand game store.
 * This solves the React Context <-> Zustand Store communication problem.
 *
 * TierSync (React component) calls setAuthBridge() to register the methods.
 * MechanicsSlice (Zustand) calls the bridge functions to invoke them.
 *
 * The bridge functions are fire-and-forget - they don't block game flow.
 */

export interface GameResultData {
  gameId: string
  duration: number
  profitPercent: number
  daysSurvived: number
  outcome: string
}

type IncrementGamesPlayedFn = () => Promise<void>
type RecordGameEndFn = (
  finalNetWorth: number,
  isWin: boolean,
  gameData?: GameResultData
) => Promise<void>

let incrementGamesPlayedFn: IncrementGamesPlayedFn | null = null
let recordGameEndFn: RecordGameEndFn | null = null

// Called by TierSync when auth context is available
export function setAuthBridge(fns: {
  incrementGamesPlayed: IncrementGamesPlayedFn
  recordGameEnd: RecordGameEndFn
}): void {
  incrementGamesPlayedFn = fns.incrementGamesPlayed
  recordGameEndFn = fns.recordGameEnd
}

export function clearAuthBridge(): void {
  incrementGamesPlayedFn = null
  recordGameEndFn = null
}

// Fire-and-forget — called by mechanicsSlice on game start
export function callIncrementGamesPlayed(): void {
  if (incrementGamesPlayedFn) {
    incrementGamesPlayedFn().catch(err => {
      console.error('Error incrementing games played:', err)
    })
  }
}

// Fire-and-forget — called by mechanicsSlice on game end
export function callRecordGameEnd(
  finalNetWorth: number,
  isWin: boolean,
  gameData?: GameResultData
): void {
  if (recordGameEndFn) {
    recordGameEndFn(finalNetWorth, isWin, gameData).catch(err => {
      console.error('Error recording game end:', err)
    })
  }
}
