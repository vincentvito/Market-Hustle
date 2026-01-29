import { useGame } from './useGame'

export function useUserDetails() {
  const userTier = useGame(state => state.userTier)
  const isLoggedIn = useGame(state => state.isLoggedIn)
  const proTrialGamesUsed = useGame(state => state.proTrialGamesUsed)
  const getEffectiveTier = useGame(state => state.getEffectiveTier)
  const getProTrialGamesRemaining = useGame(state => state.getProTrialGamesRemaining)
  const hasProTrialRemaining = useGame(state => state.hasProTrialRemaining)

  const effectiveTier = getEffectiveTier()
  const isPro = effectiveTier === 'pro'
  const proTrialGamesRemaining = getProTrialGamesRemaining()

  return {
    isPro,
    plan: userTier,
    isLoggedIn,
    proTrialGamesUsed,
    proTrialGamesRemaining,
    hasProTrialRemaining: hasProTrialRemaining(),
    isOnProTrial: userTier === 'free' && isPro,
  }
}
