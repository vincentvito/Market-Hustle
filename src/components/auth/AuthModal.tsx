'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')

  const { sendOtp, verifyOtp } = useAuth()

  if (!isOpen) return null

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await sendOtp(email)
      if (error) {
        setError(error.message)
      } else {
        setOtpSent(true)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await verifyOtp(email, otpCode.trim())
      if (error) {
        setError(error.message)
      } else {
        handleClose()
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setError(null)
    setOtpSent(false)
    setOtpCode('')
    onClose()
  }

  const handleResend = async () => {
    setError(null)
    setLoading(true)
    try {
      const { error } = await sendOtp(email)
      if (error) {
        setError(error.message)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-[var(--bg-primary)] border-2 border-[var(--border-color)] rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xl"
        >
          ×
        </button>

        {otpSent ? (
          <>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2 text-center">
              Enter Code
            </h2>
            <p className="text-[var(--text-secondary)] text-sm text-center mb-1">
              We sent a verification code to
            </p>
            <p className="text-[var(--accent-primary)] text-sm text-center font-medium mb-6">
              {email}
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                autoFocus
                placeholder="00000000"
                className="w-full px-3 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-[var(--text-primary)] text-center text-2xl tracking-[0.4em] font-mono focus:outline-none focus:border-[var(--accent-primary)]"
              />

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="w-full py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-semibold rounded transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>

            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full mt-3 py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
            >
              Resend Code
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 text-center">
              Sign In to Market Hustle
            </h2>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-semibold rounded transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>

            <p className="mt-4 text-xs text-[var(--text-secondary)] text-center">
              We&apos;ll email you a code to sign in. No password needed.
            </p>

            <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
              <p className="text-xs text-[var(--text-secondary)] text-center">
                Sign in to sync your stats across devices and access Pro features
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
