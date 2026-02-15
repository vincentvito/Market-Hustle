'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Redirects newly registered users (logged in but no username) to the onboarding page.
 * Skips redirect if already on the onboarding or auth callback page.
 */
export function OnboardingRedirect() {
  const { needsOnboarding, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!needsOnboarding) return
    // Don't redirect if already on onboarding or auth callback
    if (pathname === '/onboarding' || pathname?.startsWith('/auth/')) return

    router.replace('/onboarding')
  }, [loading, needsOnboarding, pathname, router])

  return null
}
