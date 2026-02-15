'use client'

import { Suspense } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { TierSync } from '@/components/TierSync'
import { PaymentSuccessHandler } from '@/components/PaymentSuccessHandler'
import { AutoStartHandler } from '@/components/AutoStartHandler'
import { OnboardingRedirect } from '@/components/OnboardingRedirect'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TierSync />
      <OnboardingRedirect />
      <Suspense fallback={null}>
        <PaymentSuccessHandler />
        <AutoStartHandler />
      </Suspense>
      {children}
    </AuthProvider>
  )
}
