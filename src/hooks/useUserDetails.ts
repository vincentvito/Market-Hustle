import { useGame } from './useGame'

export function useUserDetails() {
  const userTier = useGame(state => state.userTier)
  const isLoggedIn = useGame(state => state.isLoggedIn)
  const getEffectiveTier = useGame(state => state.getEffectiveTier)

  const effectiveTier = getEffectiveTier()
  const isPro = effectiveTier === 'pro'

  return {
    isPro,
    plan: userTier,
    isLoggedIn,
    proTrialGamesUsed: 0,
    proTrialGamesRemaining: 0,
    hasProTrialRemaining: false,
    isOnProTrial: false,
  }
}
