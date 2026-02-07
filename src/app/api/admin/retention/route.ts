export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { authUsers, profiles, gameResults } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 401 })
    }

    // Join auth.users with profiles to check admin status by email
    const [admin] = await db
      .select({ isAdmin: profiles.isAdmin })
      .from(authUsers)
      .innerJoin(profiles, eq(profiles.id, authUsers.id))
      .where(and(eq(authUsers.email, email), eq(profiles.isAdmin, true)))
      .limit(1)

    if (!admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
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
