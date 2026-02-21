'use client'

import { useState } from 'react'
import { capture } from '@/lib/posthog'

// Persists checkout intent across the auth flow so we can auto-redirect after login
export const PENDING_CHECKOUT_KEY = 'pendingCheckout'

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkout = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        capture('checkout_initiated', { plan_type: 'lifetime' })
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return { checkout, loading, error }
}
