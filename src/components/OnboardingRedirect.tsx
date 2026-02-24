'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function OnboardingRedirect() {
  const { needsOnboarding, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!needsOnboarding) return
    if (pathname === '/onboarding' || pathname?.startsWith('/auth/')) return

    router.replace('/onboarding')
  }, [loading, needsOnboarding, pathname, router])

  return null
}
