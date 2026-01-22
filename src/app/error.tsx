'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-mh-bg flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-mh-loss-red mb-4">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-mh-accent-blue text-mh-bg font-bold rounded"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
