'use client'

import { useGame } from '@/hooks/useGame'
import { ACHIEVEMENTS, MOCK_PROFILE } from '@/lib/game/achievements'

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}

export function SettingsPanel() {
  const { showSettings, setShowSettings } = useGame()

  // Use mock profile for now (will be replaced with real data later)
  const profile = MOCK_PROFILE
  const unlockedCount = profile.unlockedAchievements.length
  const totalCount = ACHIEVEMENTS.length

  if (!showSettings) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShowSettings(false)}
        className="fixed inset-0 bg-black/60 z-[300]"
      />

      {/* Slide-in Panel */}
      <div
        className="fixed top-0 right-0 h-full w-[320px] max-w-[85vw] bg-mh-bg border-l border-mh-border z-[301] overflow-y-auto animate-slide-in-right"
        style={{
          animation: 'slideInRight 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-mh-border flex justify-between items-center sticky top-0 bg-mh-bg">
          <div className="text-mh-text-bright font-bold text-lg">
            ⚙️ SETTINGS
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="bg-transparent border-none text-mh-text-dim text-2xl cursor-pointer px-2 hover:text-mh-text-bright transition-colors"
          >
            ×
          </button>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-b border-mh-border">
          <div className="text-mh-text-dim text-xs font-bold mb-3 tracking-wider">
            👤 PROFILE
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-mh-text-dim">Games Played:</span>
              <span className="text-mh-text-bright font-bold">{profile.gamesPlayed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mh-text-dim">Best Net Worth:</span>
              <span className="text-mh-accent-blue font-bold">{formatCurrency(profile.bestNetWorth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mh-text-dim">Win Rate:</span>
              <span className="text-mh-profit-green font-bold">{profile.winRate}%</span>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="p-4 border-b border-mh-border">
          <div className="text-mh-text-dim text-xs font-bold mb-3 tracking-wider">
            🏆 ACHIEVEMENTS ({unlockedCount}/{totalCount})
          </div>

          {/* Achievement Grid - Show unlocked emojis, grayed for locked */}
          <div className="flex flex-wrap gap-2 mb-3">
            {ACHIEVEMENTS.map(achievement => {
              const isUnlocked = profile.unlockedAchievements.includes(achievement.id)
              return (
                <div
                  key={achievement.id}
                  className={`
                    w-8 h-8 flex items-center justify-center text-lg rounded
                    ${isUnlocked
                      ? 'bg-[#1a2a3a] cursor-help'
                      : 'bg-[#0a0d10] opacity-30 grayscale'
                    }
                  `}
                  title={isUnlocked ? `${achievement.name}: ${achievement.description}` : '???'}
                >
                  {achievement.emoji}
                </div>
              )
            })}
          </div>

          <button
            className="text-mh-accent-blue text-xs font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
            onClick={() => {/* TODO: Open full achievements view */}}
          >
            View All →
          </button>
        </div>

        {/* Game Options Section */}
        <div className="p-4 border-b border-mh-border">
          <div className="text-mh-text-dim text-xs font-bold mb-3 tracking-wider">
            🎮 GAME OPTIONS
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-mh-text-dim">Sound Effects</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  disabled
                />
                <div className="w-10 h-5 bg-[#1a2a3a] rounded-full peer-checked:bg-mh-accent-blue transition-colors opacity-50" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-mh-text-dim rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-mh-text-dim">Haptic Feedback</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  disabled
                />
                <div className="w-10 h-5 bg-[#1a2a3a] rounded-full peer-checked:bg-mh-accent-blue transition-colors opacity-50" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-mh-text-dim rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-mh-text-dim">Dark Mode</span>
              <span className="text-xs text-mh-text-dim italic">(always on)</span>
            </label>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-4 border-b border-mh-border">
          <div className="text-mh-text-dim text-xs font-bold mb-3 tracking-wider">
            📊 CAREER STATS
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-mh-text-dim">Total Profit:</span>
              <span className="text-mh-profit-green font-bold">{formatCurrency(profile.totalProfit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mh-text-dim">Biggest Win:</span>
              <span className="text-mh-profit-green font-bold">
                +{formatCurrency(profile.biggestWin.amount)} ({profile.biggestWin.asset})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mh-text-dim">Biggest Loss:</span>
              <span className="text-mh-loss-red font-bold">
                -{formatCurrency(profile.biggestLoss.amount)} ({profile.biggestLoss.asset})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mh-text-dim">Favorite Asset:</span>
              <span className="text-mh-text-bright font-bold">{profile.favoriteAsset}</span>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="p-4 space-y-3">
          <button
            className="w-full py-2 px-4 bg-[#1a2a3a] border border-mh-border rounded text-mh-text-dim text-sm font-bold hover:bg-[#2a3a4a] transition-colors cursor-pointer"
            onClick={() => {/* TODO: Reset progress confirmation */}}
          >
            🔄 Reset Progress
          </button>
          <button
            className="w-full py-2 px-4 bg-transparent border border-mh-border rounded text-mh-text-dim text-sm hover:text-mh-text-bright transition-colors cursor-pointer"
            onClick={() => {/* TODO: Show about/credits */}}
          >
            ℹ️ About
          </button>
        </div>
      </div>

      {/* Slide-in animation */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
