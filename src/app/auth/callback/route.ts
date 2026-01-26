import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      // Redirect to home with error param
      return NextResponse.redirect(new URL('/?auth_error=true', requestUrl.origin))
    }
  }

  // Redirect to the intended destination (preserves ?autostart=pro)
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
