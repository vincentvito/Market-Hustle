'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { CasinoRoulette } from '../casino/CasinoRoulette'
import { CasinoBlackjack } from '../casino/CasinoBlackjack'

type CasinoScreen = 'lobby' | 'roulette' | 'blackjack'

export function ActionsTabCasino() {
  const { ownedLifestyle, cash, selectedTheme } = useGame()
  const isModern3 = selectedTheme === 'modern3'
  const isRetro2 = selectedTheme === 'retro2'
  const isBloomberg = selectedTheme === 'bloomberg'

  const ownsCasino = ownedLifestyle.some(item => item.assetId === 'pe_vegas_casino')
  const [screen, setScreen] = useState<CasinoScreen>('lobby')

  // Locked state
  if (!ownsCasino) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-6 text-center ${isModern3 ? '' : ''}`}>
        <span className="text-4xl mb-3 grayscale opacity-50">🎰</span>
        <div className="text-mh-text-dim text-sm font-bold mb-1">CASINO LOCKED</div>
        <div className="text-mh-text-dim text-xs opacity-60">
          Purchase the Las Vegas Casino ($1B) to unlock gambling.
        </div>
      </div>
    )
  }

  // Lobby
  if (screen === 'lobby') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <div className="text-xs text-mh-text-dim">
          Cash: ${Math.floor(cash).toLocaleString('en-US')}
        </div>
        <div className="text-mh-text-dim text-sm mb-2">Choose your game</div>

        {/* Roulette */}
        <button
          onClick={() => setScreen('roulette')}
          className={`w-full max-w-[340px] p-5 rounded-lg text-left cursor-pointer transition-all border-2 ${
            isRetro2
              ? 'border-mh-accent-blue/50 bg-mh-accent-blue/5 hover:bg-mh-accent-blue/10 hover:border-mh-accent-blue'
              : isBloomberg
                ? 'border-[#ff8c00]/50 bg-[#ff8c00]/5 hover:bg-[#ff8c00]/10 hover:border-[#ff8c00]'
                : 'border-yellow-500/50 bg-yellow-500/5 hover:bg-yellow-500/10 hover:border-yellow-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎡</span>
            <div>
              <div className={`font-bold text-lg ${
                isRetro2 ? 'text-mh-accent-blue' :
                isBloomberg ? 'text-[#ff8c00]' :
                'text-yellow-500'
              }`}>ROULETTE</div>
              <div className="text-mh-text-dim text-xs">Bet on Red, Black, or Zero. European odds.</div>
            </div>
          </div>
        </button>

        {/* Blackjack */}
        <button
          onClick={() => setScreen('blackjack')}
          className={`w-full max-w-[340px] p-5 rounded-lg text-left cursor-pointer transition-all border-2 ${
            isRetro2
              ? 'border-mh-accent-blue/50 bg-mh-accent-blue/5 hover:bg-mh-accent-blue/10 hover:border-mh-accent-blue'
              : isBloomberg
                ? 'border-[#ff8c00]/50 bg-[#ff8c00]/5 hover:bg-[#ff8c00]/10 hover:border-[#ff8c00]'
                : 'border-yellow-500/50 bg-yellow-500/5 hover:bg-yellow-500/10 hover:border-yellow-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🃏</span>
            <div>
              <div className={`font-bold text-lg ${
                isRetro2 ? 'text-mh-accent-blue' :
                isBloomberg ? 'text-[#ff8c00]' :
                'text-yellow-500'
              }`}>BLACKJACK</div>
              <div className="text-mh-text-dim text-xs">Beat the dealer to 21. Double down if you dare.</div>
            </div>
          </div>
        </button>
      </div>
    )
  }

  if (screen === 'roulette') {
    return <CasinoRoulette onBack={() => setScreen('lobby')} />
  }

  if (screen === 'blackjack') {
    return <CasinoBlackjack onBack={() => setScreen('lobby')} />
  }

  return null
}
