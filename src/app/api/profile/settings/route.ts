export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { theme, duration } = await request.json()

    const updates: Partial<{ selectedTheme: string; selectedDuration: number }> = {}
    if (theme !== undefined) updates.selectedTheme = theme
    if (duration !== undefined) updates.selectedDuration = duration

    await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.id, user.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
