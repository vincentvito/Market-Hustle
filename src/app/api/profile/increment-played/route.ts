import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { isNewDay, currentCount } = await request.json()

    await db
      .update(profiles)
      .set({
        gamesPlayedToday: isNewDay ? 1 : (currentCount || 0) + 1,
        lastPlayedDate: new Date().toISOString().split('T')[0],
      })
      .where(eq(profiles.id, user.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error incrementing games played:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
