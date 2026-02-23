'use client'

import { Suspense } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { TierSync } from '@/components/TierSync'
import { PaymentSuccessHandler } from '@/components/PaymentSuccessHandler'
import { AutoStartHandler } from '@/components/AutoStartHandler'
import { PostHogProvider } from '@/components/PostHogProvider'
import { OnboardingModal } from '@/components/OnboardingModal'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TierSync />
      <OnboardingModal />
      <Suspense fallback={null}>
        <PostHogProvider>
          <PaymentSuccessHandler />
          <AutoStartHandler />
          {children}
        </PostHogProvider>
      </Suspense>
    </AuthProvider>
  )
}
