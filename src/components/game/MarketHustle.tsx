'use client'

import { useGame } from '@/hooks/useGame'
import { Scanlines } from './ui/Scanlines'
import { TitleScreen } from './screens/TitleScreen'
import { GameScreen } from './screens/GameScreen'
import { EndGameCoordinator } from './screens/EndGameCoordinator'
import { SettingsPanel } from './ui/SettingsPanel'
import { AchievementToast } from './ui/AchievementToast'
import { DailyLimitModal } from './ui/DailyLimitModal'
import { AnonymousLimitModal } from './ui/AnonymousLimitModal'

export function MarketHustle() {
  const screen = useGame(state => state.screen)

  return (
    <div className="h-full w-full flex flex-col">
      <Scanlines />
      {screen === 'title' && <TitleScreen />}
      {screen === 'game' && <GameScreen />}
      {(screen === 'gameover' || screen === 'win') && <EndGameCoordinator />}

      {/* Global overlays */}
      <SettingsPanel />
      <AchievementToast />
      <DailyLimitModal />
      <AnonymousLimitModal />
    </div>
  )
}
