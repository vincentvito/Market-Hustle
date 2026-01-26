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
  const [linkSent, setLinkSent] = useState(false)

  const { signInWithMagicLink } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await signInWithMagicLink(email)
      if (error) {
        setError(error.message)
      } else {
        setLinkSent(true)
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
    setLinkSent(false)
    onClose()
  }

  const handleSendAnother = () => {
    setLinkSent(false)
    setError(null)
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--bg-primary)] border-2 border-[var(--border-color)] rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xl"
        >
          ×
        </button>

        {linkSent ? (
          // Success state - link sent
          <>
            <div className="text-4xl text-center mb-4">✓</div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2 text-center">
              Magic Link Sent!
            </h2>
            <p className="text-[var(--text-secondary)] text-center mb-4">
              Check your inbox at
            </p>
            <p className="text-[var(--accent-primary)] text-center font-medium mb-6">
              {email}
            </p>
            <p className="text-[var(--text-secondary)] text-sm text-center mb-6">
              Click the link in your email to sign in.
            </p>
            <button
              onClick={handleSendAnother}
              className="w-full py-2 border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] font-semibold rounded transition-colors"
            >
              Send Another Link
            </button>
          </>
        ) : (
          // Initial state - email input
          <>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 text-center">
              Sign In to Market Hustle
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                {loading ? 'Sending...' : 'Send Sign-In Link'}
              </button>
            </form>

            <p className="mt-4 text-xs text-[var(--text-secondary)] text-center">
              We&apos;ll email you a link to sign in instantly. No password needed.
            </p>

            {/* Info about syncing */}
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
