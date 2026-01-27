'use client'

import { useGame } from '@/hooks/useGame'
import { GuestGameOverView } from './gameOverViews/GuestGameOverView'
import { FreeUserGameOverView } from './gameOverViews/FreeUserGameOverView'
import { ProUserGameOverView } from './gameOverViews/ProUserGameOverView'

/**
 * Smart container for the Game Over screen.
 * Routes to the appropriate view based on user tier:
 * - Guest (anonymous): Strong upsell with lifetime games counter
 * - Free (registered): Daily games counter with upsell
 * - Pro: Minimal view with loss breakdown
 */
export function GameOverScreen() {
  const userTier = useGame(state => state.userTier)
  const isLoggedIn = useGame(state => state.isLoggedIn)

  // Determine which view to render
  const isGuest = !isLoggedIn
  const isProUser = userTier === 'pro'

  if (isGuest) return <GuestGameOverView />
  if (isProUser) return <ProUserGameOverView />
  return <FreeUserGameOverView />
}
