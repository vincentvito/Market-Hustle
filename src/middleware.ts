import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { rateLimit } from '@/lib/rate-limit'

// Rate limit tiers (requests per window)
const RATE_LIMITS = {
  // Strict: auth-adjacent & write endpoints
  strict: { limit: 10, windowMs: 60_000 },
  // Standard: read endpoints
  standard: { limit: 60, windowMs: 60_000 },
} as const

const STRICT_PREFIXES = [
  '/api/profile/record-game',
  '/api/profile/migrate',
  '/api/profile/use-trial',
  '/api/profile/increment-played',
  '/api/profile/settings',
  '/api/username/',
  '/api/stripe/',
  '/api/game-plays',
]

function getTier(pathname: string): keyof typeof RATE_LIMITS {
  for (const prefix of STRICT_PREFIXES) {
    if (pathname.startsWith(prefix)) return 'strict'
  }
  return 'standard'
}

export async function middleware(request: NextRequest) {
  // Run session check first so we know if the user is signed in
  const { response, userId } = await updateSession(request)

  // Only rate-limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Use userId when signed in, fall back to IP for anonymous users
    const key = userId ?? (
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    )

    const tier = getTier(request.nextUrl.pathname)
    const { limit, windowMs } = RATE_LIMITS[tier]
    const result = rateLimit(key, { limit, windowMs, tier })

    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(result.resetMs / 1000)),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
