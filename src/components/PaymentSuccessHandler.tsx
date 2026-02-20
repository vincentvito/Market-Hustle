'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Handles the redirect from Stripe checkout.
 * For logged-in users: polls until tier updates to 'pro'.
 * For guests: shows "check email" prompt.
 */
export function PaymentSuccessHandler() {
  const searchParams = useSearchParams()
  const { user, profile, refreshProfile } = useAuth()
  const [showSuccess, setShowSuccess] = useState(false)
  const [polling, setPolling] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    const paymentStatus = searchParams.get('payment')

    if (paymentStatus === 'success') {
      setShowSuccess(true)

      // If already logged in, poll until tier updates to 'pro'
      if (user) {
        setPolling(true)
        refreshProfile()
        // Poll every 2s for up to 30s
        let attempts = 0
        pollRef.current = setInterval(async () => {
          attempts++
          await refreshProfile()
          if (attempts >= 15) {
            clearInterval(pollRef.current)
            setPolling(false)
          }
        }, 2000)
      }

      // Clean up URL
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.delete('payment')
        url.searchParams.delete('session_id')
        window.history.replaceState({}, '', url.toString())
      }
    }

    return () => clearInterval(pollRef.current)
  }, [searchParams, user, refreshProfile])

  // Stop polling once tier is pro
  const isPro = profile?.tier === 'pro'
  useEffect(() => {
    if (isPro && pollRef.current) {
      clearInterval(pollRef.current)
      setPolling(false)
    }
  }, [isPro])

  if (!showSuccess) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShowSuccess(false)}
        className="fixed inset-0 bg-black/80 z-[400]"
      />

      {/* Success Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[401] p-4">
        <div className="bg-mh-bg border-2 border-mh-profit-green rounded-lg p-6 max-w-md w-full text-center">
          {isPro ? (
            // Tier updated to Pro - show welcome
            <>
              <div className="text-4xl mb-4">
                {"🎉"}
              </div>
              <h2 className="text-mh-profit-green text-xl font-bold mb-2">
                WELCOME TO PRO!
              </h2>
              <p className="text-mh-text-main text-sm mb-4">
                Your Pro subscription is now active. Enjoy unlimited games, extended modes, and all premium features!
              </p>
              <div className="text-mh-profit-green text-xs space-y-1 mb-6 text-left bg-mh-profit-green/10 p-3 rounded">
                <div>{"✓"} Unlimited daily games</div>
                <div>{"✓"} 45 & 60-day career modes</div>
                <div>{"✓"} Short selling & leverage</div>
                <div>{"✓"} Career statistics</div>
              </div>
            </>
          ) : user && polling ? (
            // Logged in, waiting for webhook to process
            <>
              <div className="text-4xl mb-4">
                {"✓"}
              </div>
              <h2 className="text-mh-profit-green text-xl font-bold mb-2">
                PAYMENT SUCCESSFUL!
              </h2>
              <p className="text-mh-text-main text-sm mb-4">
                Activating your Pro subscription...
              </p>
              <div className="flex justify-center mb-4">
                <div className="w-6 h-6 border-2 border-mh-profit-green border-t-transparent rounded-full animate-spin" />
              </div>
            </>
          ) : user ? (
            // Logged in but polling finished without Pro - might just be slow
            <>
              <div className="text-4xl mb-4">
                {"✓"}
              </div>
              <h2 className="text-mh-profit-green text-xl font-bold mb-2">
                PAYMENT SUCCESSFUL!
              </h2>
              <p className="text-mh-text-main text-sm mb-4">
                Your payment was processed. Your Pro features will activate shortly.
              </p>
            </>
          ) : (
            // Guest - prompt email check
            <>
              <div className="text-4xl mb-4">
                {"✓"}
              </div>
              <h2 className="text-mh-profit-green text-xl font-bold mb-2">
                PAYMENT SUCCESSFUL!
              </h2>
              <p className="text-mh-text-main text-sm mb-4">
                Your payment was processed successfully.
              </p>
              <div className="text-yellow-500 text-sm mb-4 bg-yellow-500/10 p-3 rounded">
                <div className="font-bold mb-1">{"📧"} Check your email to sign in</div>
                <div className="text-xs text-mh-text-dim">
                  We&apos;ve sent a sign-in link to your email. Click it to access your Pro features.
                </div>
              </div>
            </>
          )}

          <button
            onClick={() => setShowSuccess(false)}
            className="w-full py-3 bg-mh-profit-green text-mh-bg font-bold text-sm rounded cursor-pointer hover:bg-mh-profit-green/90"
          >
            {isPro ? 'START PLAYING' : polling ? 'PLEASE WAIT...' : 'GOT IT'}
          </button>
        </div>
      </div>
    </>
  )
}
