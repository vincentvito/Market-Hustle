'use client'

import { Suspense } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { TierSync } from '@/components/TierSync'
import { PaymentSuccessHandler } from '@/components/PaymentSuccessHandler'
import { AutoStartHandler } from '@/components/AutoStartHandler'
import { PostHogProvider } from '@/components/PostHogProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TierSync />
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
