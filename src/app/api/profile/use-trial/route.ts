import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { proTrials } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Upsert pro trial - increment games_used
    await db
      .insert(proTrials)
      .values({
        userId: user.id,
        gamesUsed: 1,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: proTrials.userId,
        set: {
          gamesUsed: sql`${proTrials.gamesUsed} + 1`,
          updatedAt: new Date(),
        },
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error using pro trial:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
