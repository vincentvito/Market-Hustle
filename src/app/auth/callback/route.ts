import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  const redirectTo = new URL(next, requestUrl.origin)

  if (code) {
    // Create a response to write cookies onto
    const response = NextResponse.redirect(redirectTo)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const supabaseCookiesBefore = request.cookies.getAll().filter(c => c.name.includes('sb-'))
    console.log('[auth/callback] cookies before exchange:', supabaseCookiesBefore.map(c => c.name))

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    console.log('[auth/callback] cookies on response after exchange:', response.cookies.getAll().map(c => ({ name: c.name, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite })))

    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/?auth_error=true', requestUrl.origin))
    }

    return response
  }

  return NextResponse.redirect(redirectTo)
}
