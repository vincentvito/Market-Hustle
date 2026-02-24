import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { guestDailyPlays } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { isDev } from '@/lib/env'

const GUEST_TOTAL_LIMIT = 3

function getClientIp(request: NextRequest): string {
  // x-forwarded-for can be a comma-separated list; first entry is the real client IP
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(request: NextRequest) {
  // Never block in dev so we can test freely
  if (isDev) {
    return NextResponse.json({ allowed: true, remaining: GUEST_TOTAL_LIMIT })
  }

  try {
    const ip = getClientIp(request)

    // Sum ALL games played by this IP (total lifetime limit)
    const [result] = await db
      .select({ total: sql<number>`coalesce(sum(${guestDailyPlays.gamesPlayed}), 0)` })
      .from(guestDailyPlays)
      .where(eq(guestDailyPlays.ip, ip))

    const totalPlayed = Number(result?.total ?? 0)

    if (totalPlayed >= GUEST_TOTAL_LIMIT) {
      return NextResponse.json({ allowed: false, remaining: 0 })
    }

    // Upsert — single row per IP, increment on each play
    const today = new Date().toISOString().split('T')[0]
    const [existing] = await db
      .select({ gamesPlayed: guestDailyPlays.gamesPlayed })
      .from(guestDailyPlays)
      .where(eq(guestDailyPlays.ip, ip))
      .limit(1)

    if (!existing) {
      await db.insert(guestDailyPlays).values({ ip, playedDate: today, gamesPlayed: 1 })
    } else {
      await db
        .update(guestDailyPlays)
        .set({ gamesPlayed: existing.gamesPlayed + 1 })
        .where(eq(guestDailyPlays.ip, ip))
    }

    return NextResponse.json({ allowed: true, remaining: GUEST_TOTAL_LIMIT - totalPlayed - 1 })
  } catch {
    // On DB error, allow play — don't block users for infrastructure issues
    return NextResponse.json({ allowed: true, remaining: 1 })
  }
}
