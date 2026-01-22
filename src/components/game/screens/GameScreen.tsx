'use client'

import { useGame } from '@/hooks/useGame'
import { Header } from '../ui/Header'
import { StatsBar } from '../ui/StatsBar'
import { NewsPanel } from '../ui/NewsPanel'
import { PortfolioOverlay } from '../ui/PortfolioOverlay'
import { NewsDetailOverlay } from '../ui/NewsDetailOverlay'
import { StartupOfferOverlay } from '../ui/StartupOfferOverlay'
import { AssetGrid } from '../trading/AssetGrid'

export function GameScreen() {
  const { message, nextDay, setShowSettings } = useGame()

  return (
    <div className="h-full bg-mh-bg pb-[72px] flex flex-col overflow-hidden">
      <Header />
      <StatsBar />
      <PortfolioOverlay />
      <NewsDetailOverlay />
      <StartupOfferOverlay />
      <NewsPanel />

      {/* Message */}
      {message && (
        <div className="py-3 px-4 text-mh-accent-blue text-sm font-bold text-center border-b border-mh-border">
          &gt; {message}
        </div>
      )}

      {/* Asset Grid */}
      <div className="flex-1 overflow-auto">
        <AssetGrid />
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-mh-bg border-t border-mh-border md:left-1/2 md:-translate-x-1/2 md:w-[400px] flex items-center gap-3">
        <button
          onClick={() => setShowSettings(true)}
          className="w-12 h-12 flex items-center justify-center text-mh-text-dim hover:text-mh-text-bright cursor-pointer bg-transparent border-2 border-mh-border rounded text-xl"
          title="Settings"
        >
          ⚙️
        </button>
        <button
          onClick={nextDay}
          className="flex-1 py-3.5 border-2 border-mh-accent-blue bg-[#111920] text-mh-accent-blue text-lg font-bold font-mono cursor-pointer glow-text hover:bg-[#1a242e]"
        >
          NEXT DAY ▶
        </button>
      </div>
    </div>
  )
}
