import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { profiles, gamePlays } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  // Auth check: require logged-in user with is_admin = true
  const userSupabase = await createServerSupabaseClient()
  const { data: { user } } = await userSupabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [profile] = await db
    .select({ isAdmin: profiles.isAdmin })
    .from(profiles)
    .where(eq(profiles.id, user.id))

  if (!profile?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Count plays per user using Drizzle
  const rows = await db
    .select({
      userId: gamePlays.userId,
      count: sql<number>`count(*)::int`,
    })
    .from(gamePlays)
    .groupBy(gamePlays.userId)

  // Group: how many users played N times
  const retention: Record<number, number> = {}
  for (const row of rows) {
    retention[row.count] = (retention[row.count] || 0) + 1
  }

  const sorted = Object.entries(retention)
    .map(([times, users]) => ({ times: Number(times), users }))
    .sort((a, b) => a.times - b.times)

  const totalUsers = rows.length

  return NextResponse.json({ retention: sorted, totalUsers })
}
