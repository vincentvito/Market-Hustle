import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { profiles, gameResults } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const userSupabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await userSupabase.auth.getUser()

    if (authError) {
      console.error('Admin retention auth error:', authError)
      return NextResponse.json({ error: `Authentication failed: ${authError.message}` }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized — you must be logged in' }, { status: 401 })
    }

    const [profile] = await db
      .select({ isAdmin: profiles.isAdmin })
      .from(profiles)
      .where(eq(profiles.id, user.id))

    if (!profile) {
      return NextResponse.json({ error: `Profile not found for user ${user.id}` }, { status: 404 })
    }

    if (!profile.isAdmin) {
      return NextResponse.json({ error: `Access denied — user ${user.id} is not an admin` }, { status: 403 })
    }

    const rows = await db
      .select({
        userId: gameResults.userId,
        count: sql<number>`count(*)::int`,
      })
      .from(gameResults)
      .groupBy(gameResults.userId)

    const retention: Record<number, number> = {}
    for (const row of rows) {
      retention[row.count] = (retention[row.count] || 0) + 1
    }

    const sorted = Object.entries(retention)
      .map(([times, users]) => ({ times: Number(times), users }))
      .sort((a, b) => a.times - b.times)

    const totalUsers = rows.length

    return NextResponse.json({ retention: sorted, totalUsers })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Admin retention error:', message, error)
    return NextResponse.json(
      { error: `Retention query failed: ${message}` },
      { status: 500 }
    )
  }
}
