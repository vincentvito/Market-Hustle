'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { getPostHogClient } from '@/lib/posthog'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    getPostHogClient()
  }, [])

  useEffect(() => {
    const client = getPostHogClient()
    if (client && pathname) {
      let url = window.origin + pathname
      if (searchParams?.toString()) {
        url += '?' + searchParams.toString()
      }
      client.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams])

  return <>{children}</>
}
