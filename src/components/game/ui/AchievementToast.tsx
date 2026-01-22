'use client'

import { useEffect, useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { getAchievement } from '@/lib/game/achievements'

export function AchievementToast() {
  const { pendingAchievement, clearPendingAchievement } = useGame()
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (pendingAchievement) {
      setIsVisible(true)
      setIsExiting(false)

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => {
          setIsVisible(false)
          clearPendingAchievement()
        }, 300) // Wait for exit animation
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [pendingAchievement, clearPendingAchievement])

  if (!isVisible || !pendingAchievement) return null

  const achievement = getAchievement(pendingAchievement)
  if (!achievement) return null

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-[400]
        bg-[#1a2a3a] border-2 border-mh-news rounded-lg
        px-5 py-3 shadow-lg
        transition-all duration-300
        ${isExiting ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}
      `}
      style={{
        animation: isExiting ? undefined : 'achievementSlideIn 0.3s ease-out',
        boxShadow: '0 0 20px rgba(255,170,0,0.3)',
      }}
    >
      <div className="text-center">
        <div className="text-mh-news text-xs font-bold tracking-wider mb-1">
          🏆 ACHIEVEMENT UNLOCKED!
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{achievement.emoji}</span>
          <div>
            <div className="text-mh-text-bright font-bold text-sm">
              {achievement.name}
            </div>
            <div className="text-mh-text-dim text-xs">
              {achievement.description}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes achievementSlideIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
