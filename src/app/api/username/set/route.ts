import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    let userId: string | null = null

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userId = user.id
    } else {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const admin = createAdminClient()
        const { data } = await admin.auth.getUser(authHeader.replace('Bearer ', ''))
        userId = data.user?.id ?? null
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const { username } = await request.json()

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ success: false, error: 'Username is required' }, { status: 400 })
    }

    const trimmed = username.trim().toLowerCase()

    if (trimmed.length < 3 || trimmed.length > 15) {
      return NextResponse.json({ success: false, error: 'Username must be 3-15 characters' })
    }

    if (!/^[a-z0-9_]+$/.test(trimmed)) {
      return NextResponse.json({ success: false, error: 'Letters, numbers, underscores only' })
    }

    const existing = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.username, trimmed))
      .limit(1)

    if (existing.length > 0 && existing[0].id !== userId) {
      return NextResponse.json({ success: false, error: 'Username already taken' })
    }

    await db
      .insert(profiles)
      .values({ id: userId, username: trimmed })
      .onConflictDoUpdate({
        target: profiles.id,
        set: { username: trimmed },
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
