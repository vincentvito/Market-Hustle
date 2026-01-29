'use client'

import { useGame } from '@/hooks/useGame'
import { useUserDetails } from '@/hooks/useUserDetails'
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
  const isLoggedIn = useGame(state => state.isLoggedIn)
  const { isPro } = useUserDetails()

  // Determine which view to render
  const isGuest = !isLoggedIn

  if (isGuest) return <GuestGameOverView />
  if (isPro) return <ProUserGameOverView />
  return <FreeUserGameOverView />
}
