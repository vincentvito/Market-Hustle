import posthog from 'posthog-js'

let initialized = false

export function getPostHogClient() {
  if (typeof window === 'undefined') return null

  if (!initialized && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: '/ingest',
      capture_pageview: false,
      autocapture: false,
      session_recording: {
        maskAllInputs: false,
      },
    })
    initialized = true
  }

  return initialized ? posthog : null
}

export function capture(event: string, properties?: Record<string, unknown>) {
  const client = getPostHogClient()
  client?.capture(event, properties)
}
