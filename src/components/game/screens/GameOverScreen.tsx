'use client'

import { useGame } from '@/hooks/useGame'
import { useUserDetails } from '@/hooks/useUserDetails'
import { GuestGameOverView } from './gameOverViews/GuestGameOverView'
import { FreeUserGameOverView } from './gameOverViews/FreeUserGameOverView'
import { ProUserGameOverView } from './gameOverViews/ProUserGameOverView'

export function GameOverScreen() {
  const isLoggedIn = useGame(state => state.isLoggedIn)
  const { isPro } = useUserDetails()

  if (!isLoggedIn) return <GuestGameOverView />
  if (isPro) return <ProUserGameOverView />
  return <FreeUserGameOverView />
}
