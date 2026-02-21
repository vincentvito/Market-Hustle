import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

const REGISTERED_FREE_DAILY_LIMIT = 1

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Fetch authoritative profile from DB — never trust client values
    const result = await db
      .select({
        tier: profiles.tier,
        gamesPlayedToday: profiles.gamesPlayedToday,
        lastPlayedDate: profiles.lastPlayedDate,
      })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1)

    if (result.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const profile = result[0]

    // Pro users: unlimited, skip limit check
    if (profile.tier !== 'pro') {
      const today = new Date().toISOString().split('T')[0]
      const lastPlayed = profile.lastPlayedDate?.split('T')[0] ?? ''
      const isNewDay = lastPlayed !== today
      const gamesPlayedToday = isNewDay ? 0 : profile.gamesPlayedToday

      // Enforce daily limit (1 game per day for free users)
      if (gamesPlayedToday >= REGISTERED_FREE_DAILY_LIMIT) {
        return NextResponse.json(
          { error: 'Daily game limit reached', remaining: 0 },
          { status: 429 }
        )
      }
    }

    // Compute isNewDay server-side
    const today = new Date().toISOString().split('T')[0]
    const lastPlayed = profile.lastPlayedDate?.split('T')[0] ?? ''
    const isNewDay = lastPlayed !== today

    await db
      .update(profiles)
      .set({
        gamesPlayedToday: isNewDay ? 1 : profile.gamesPlayedToday + 1,
        lastPlayedDate: today,
        totalGamesPlayed: sql`${profiles.totalGamesPlayed} + 1`,
      })
      .where(eq(profiles.id, user.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error incrementing games played:', message, error)
    return NextResponse.json({ error: `Failed to increment games played: ${message}` }, { status: 500 })
  }
}
