'use client'

import { useGame } from '@/hooks/useGame'
import { Scanlines } from './ui/Scanlines'
import { TitleScreen } from './screens/TitleScreen'
import { GameScreen } from './screens/GameScreen'
import { GameOverScreen } from './screens/GameOverScreen'
import { WinScreen } from './screens/WinScreen'
import { SettingsPanel } from './ui/SettingsPanel'
import { AchievementToast } from './ui/AchievementToast'
import { DailyLimitModal } from './ui/DailyLimitModal'

export function MarketHustle() {
  const screen = useGame(state => state.screen)

  return (
    <div className="min-h-full w-full flex flex-col">
      <Scanlines />
      {screen === 'title' && <TitleScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'gameover' && <GameOverScreen />}
      {screen === 'win' && <WinScreen />}

      {/* Global overlays */}
      <SettingsPanel />
      <AchievementToast />
      <DailyLimitModal />
    </div>
  )
}
