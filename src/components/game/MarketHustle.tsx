'use client'

import { useGame } from '@/hooks/useGame'
import { Scanlines } from './ui/Scanlines'
import { TitleScreen } from './screens/TitleScreen'
import { GameScreen } from './screens/GameScreen'
import { GameOverScreen } from './screens/GameOverScreen'
import { WinScreen } from './screens/WinScreen'
import { SettingsPanel } from './ui/SettingsPanel'
import { AchievementToast } from './ui/AchievementToast'

export function MarketHustle() {
  const screen = useGame(state => state.screen)

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Scanlines />
      {screen === 'title' && <TitleScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'gameover' && <GameOverScreen />}
      {screen === 'win' && <WinScreen />}

      {/* Global overlays */}
      <SettingsPanel />
      <AchievementToast />
    </div>
  )
}
