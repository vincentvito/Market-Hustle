'use client'

import { useGame } from '@/hooks/useGame'

const ASCII_LOGO = `███╗   ███╗ █████╗ ██████╗ ██╗  ██╗███████╗████████╗
████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝██╔════╝╚══██╔══╝
██╔████╔██║███████║██████╔╝█████╔╝ █████╗     ██║
██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗ ██╔══╝     ██║
██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗███████╗   ██║
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝
██╗  ██╗██╗   ██╗███████╗████████╗██╗     ███████╗
██║  ██║██║   ██║██╔════╝╚══██╔══╝██║     ██╔════╝
███████║██║   ██║███████╗   ██║   ██║     █████╗
██╔══██║██║   ██║╚════██║   ██║   ██║     ██╔══╝
██║  ██║╚██████╔╝███████║   ██║   ███████╗███████╗
╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚══════╝`

export function TitleScreen() {
  const startGame = useGame(state => state.startGame)
  const setShowSettings = useGame(state => state.setShowSettings)

  return (
    <div className="min-h-full bg-mh-bg flex flex-col items-center justify-center p-6 text-center relative">
      {/* Settings gear icon */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 text-mh-text-dim hover:text-mh-text-bright transition-colors cursor-pointer bg-transparent border-none p-2 text-xl"
        title="Settings"
      >
        ⚙️
      </button>
      <pre className="glow-text text-[8px] leading-tight mb-6 text-mh-text-bright whitespace-pre">
        {ASCII_LOGO}
      </pre>

      <div className="text-mh-text-dim text-sm mb-12 leading-relaxed">
        BUY LOW. SELL HIGH.<br />DON&apos;T GO BROKE.
      </div>

      <div className="border border-mh-border p-5 mb-8 w-full max-w-[280px]">
        <div className="flex justify-between mb-3 text-sm">
          <span className="text-mh-text-dim">CASH</span>
          <span className="text-mh-profit-green">$100,000</span>
        </div>
        <div className="flex justify-between mb-3 text-sm">
          <span className="text-mh-text-dim">ASSETS</span>
          <span className="text-mh-text-main">13</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-mh-text-dim">DURATION</span>
          <span className="text-[#ffaa33]">30 DAYS</span>
        </div>
      </div>

      <button
        onClick={startGame}
        className="bg-transparent border-2 border-mh-accent-blue text-mh-accent-blue
          px-10 py-4 text-lg font-mono cursor-pointer glow-text
          hover:bg-mh-accent-blue/10 active:bg-mh-accent-blue/20 transition-colors"
      >
        [ START ]
      </button>
    </div>
  )
}
