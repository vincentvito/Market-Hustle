'use client'

import { useState, useEffect } from 'react'
import { useGame } from '@/hooks/useGame'

// Swing states for the dramatic reveal
const SWING_STATES = ['Pennsylvania', 'Michigan', 'Wisconsin', 'Georgia', 'Arizona', 'Nevada']

// Vote counting animation phase
function VoteCountingPhase({ onComplete }: { onComplete: () => void }) {
  const [demVotes, setDemVotes] = useState(0)
  const [repVotes, setRepVotes] = useState(0)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDemVotes(Math.floor(Math.random() * 150_000_000))
      setRepVotes(Math.floor(Math.random() * 150_000_000))
      setTick(t => t + 1)
    }, 80)

    // After 2.5 seconds, move to next phase
    const timeout = setTimeout(() => {
      clearInterval(interval)
      onComplete()
    }, 2500)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [onComplete])

  return (
    <div className="text-center space-y-6">
      <div className="text-2xl font-bold text-mh-text-bright animate-pulse">
        VOTES BEING COUNTED...
      </div>

      <div className="space-y-4">
        {/* Blue votes */}
        <div className="flex items-center gap-4">
          <div className="w-16 text-right text-blue-400 font-bold">BLUE</div>
          <div className="flex-1 h-8 bg-[#1a2028] rounded overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-75"
              style={{ width: `${(demVotes / 150_000_000) * 100}%` }}
            />
          </div>
          <div className="w-32 text-right font-mono text-sm text-mh-text-main">
            {demVotes.toLocaleString()}
          </div>
        </div>

        {/* Red votes */}
        <div className="flex items-center gap-4">
          <div className="w-16 text-right text-red-400 font-bold">RED</div>
          <div className="flex-1 h-8 bg-[#1a2028] rounded overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-75"
              style={{ width: `${(repVotes / 150_000_000) * 100}%` }}
            />
          </div>
          <div className="w-32 text-right font-mono text-sm text-mh-text-main">
            {repVotes.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="text-xs text-mh-text-dim">
        {tick % 3 === 0 ? 'BREAKING: Key precincts reporting...' :
         tick % 3 === 1 ? 'DEVELOPING: Race too close to call...' :
         'ALERT: Mail-in ballots being processed...'}
      </div>
    </div>
  )
}

// Swing states announcement phase
function SwingStatesPhase({ isWin, onComplete }: { isWin: boolean; onComplete: () => void }) {
  const [currentState, setCurrentState] = useState(0)
  const [results, setResults] = useState<string[]>([])

  useEffect(() => {
    if (currentState >= SWING_STATES.length) {
      // All states announced, wait a beat then move to result
      const timeout = setTimeout(onComplete, 1000)
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(() => {
      const stateName = SWING_STATES[currentState]
      // If winning, player wins more states; if losing, they lose more
      const playerWinsState = isWin
        ? currentState < 4 // Win 4 of 6 states
        : currentState < 2 // Win only 2 of 6 states

      setResults(prev => [...prev, `${stateName}: ${playerWinsState ? '✓ YOU' : '✗ OPPONENT'}`])
      setCurrentState(s => s + 1)
    }, 600)

    return () => clearTimeout(timeout)
  }, [currentState, isWin, onComplete])

  return (
    <div className="text-center space-y-4">
      <div className="text-xl font-bold text-amber-400">
        SWING STATE RESULTS
      </div>

      <div className="space-y-2 max-h-48 overflow-auto">
        {results.map((result, i) => (
          <div
            key={i}
            className={`text-sm font-bold animate-fadeIn ${
              result.includes('YOU') ? 'text-mh-profit-green' : 'text-mh-loss-red'
            }`}
          >
            {result}
          </div>
        ))}
      </div>

      {currentState < SWING_STATES.length && (
        <div className="text-mh-text-dim text-xs animate-pulse">
          Awaiting results from {SWING_STATES[currentState]}...
        </div>
      )}
    </div>
  )
}

// Final result phase
function ResultPhase({ isWin, onConfirm }: { isWin: boolean; onConfirm: () => void }) {
  return (
    <div className="text-center space-y-6">
      {isWin ? (
        <>
          {/* Victory screen */}
          <div className="text-6xl">🇺🇸</div>
          <div className="text-3xl font-black text-mh-profit-green animate-pulse">
            VICTORY
          </div>
          <div className="text-5xl font-black text-amber-400 tracking-wider">
            MR. PRESIDENT
          </div>
          <div className="text-sm text-mh-text-main max-w-xs mx-auto">
            You have been elected President of the United States.
            The Presidential Toolkit is now available.
          </div>
          <div className="text-xs text-mh-text-dim">
            The most powerful office in the world is yours to command.
          </div>
        </>
      ) : (
        <>
          {/* Defeat screen */}
          <div className="text-6xl">📉</div>
          <div className="text-3xl font-black text-mh-loss-red">
            DEFEAT
          </div>
          <div className="text-xl font-bold text-mh-text-main">
            CAMPAIGN COLLAPSES
          </div>
          <div className="text-sm text-mh-text-dim max-w-xs mx-auto">
            Your presidential bid has failed. Scandals emerge.
            Apex Media value crashes -50%. FBI heat +40.
          </div>
          <div className="text-xs text-mh-loss-red">
            $12 billion... gone.
          </div>
        </>
      )}

      <button
        onClick={onConfirm}
        className={`w-full py-3 font-bold cursor-pointer transition-all rounded ${
          isWin
            ? 'bg-mh-profit-green/20 border border-mh-profit-green text-mh-profit-green hover:bg-mh-profit-green/30'
            : 'bg-mh-loss-red/20 border border-mh-loss-red text-mh-loss-red hover:bg-mh-loss-red/30'
        }`}
      >
        {isWin ? 'ENTER THE OVAL OFFICE' : 'ACCEPT DEFEAT'}
      </button>
    </div>
  )
}

export function ElectionPopup() {
  const { pendingElection, confirmElectionResult, selectedTheme } = useGame()
  const [phase, setPhase] = useState<'counting' | 'states' | 'result'>('counting')

  const isRetro2 = selectedTheme === 'retro2'

  // Reset phase when popup opens
  useEffect(() => {
    if (pendingElection) {
      setPhase('counting')
    }
  }, [pendingElection])

  if (!pendingElection) return null

  const isWin = pendingElection.result === 'win'

  return (
    <div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-5 select-none">
      <div
        className={`bg-mh-bg border-2 ${
          phase === 'result'
            ? (isWin ? 'border-mh-profit-green' : 'border-mh-loss-red')
            : 'border-amber-500'
        } rounded-lg w-full max-w-[380px] overflow-hidden`}
        style={isRetro2 ? { boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' } : undefined}
      >
        {/* Header */}
        <div className={`p-4 bg-gradient-to-r ${
          phase === 'result'
            ? (isWin ? 'from-[#0a200a] to-[#0d2a0d]' : 'from-[#200a0a] to-[#2a0d0d]')
            : 'from-[#1a1a0a] to-[#2a2a0d]'
        } border-b border-mh-border`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🗳️</span>
            <div>
              <div className="text-amber-400 text-lg font-bold">
                ELECTION NIGHT
              </div>
              <div className="text-xs text-mh-text-dim">
                Presidential Race
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[280px] flex flex-col justify-center">
          {phase === 'counting' && (
            <VoteCountingPhase onComplete={() => setPhase('states')} />
          )}
          {phase === 'states' && (
            <SwingStatesPhase isWin={isWin} onComplete={() => setPhase('result')} />
          )}
          {phase === 'result' && (
            <ResultPhase isWin={isWin} onConfirm={confirmElectionResult} />
          )}
        </div>
      </div>
    </div>
  )
}
