import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * POST /api/username/set
 * Set the user's username and migrate their local stats
 *
 * Body: { username: string, localStats?: { ... } }
 * Response: { success: boolean, error?: string }
 *
 * Requires authentication.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { username, localStats } = await request.json()

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      )
    }

    // Validate and normalize username
    const trimmedUsername = username.trim().toLowerCase()

    // Validate length
    if (trimmedUsername.length < 3 || trimmedUsername.length > 15) {
      return NextResponse.json({
        success: false,
        error: 'Username must be 3-15 characters',
      })
    }

    // Validate format
    const validFormat = /^[a-z0-9_]+$/.test(trimmedUsername)
    if (!validFormat) {
      return NextResponse.json({
        success: false,
        error: 'Username can only contain letters, numbers, and underscores',
      })
    }

    // Check availability
    const existing = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.username, trimmedUsername))
      .limit(1)

    if (existing.length > 0 && existing[0].id !== user.id) {
      return NextResponse.json({
        success: false,
        error: 'This username is already taken',
      })
    }

    // Build update payload
    const updates: Record<string, unknown> = {
      username: trimmedUsername,
    }

    // Include local stats migration if provided
    if (localStats) {
      if (typeof localStats.totalGamesPlayed === 'number' && localStats.totalGamesPlayed > 0) {
        updates.totalGamesPlayed = localStats.totalGamesPlayed
      }
      if (typeof localStats.totalEarnings === 'number' && localStats.totalEarnings > 0) {
        updates.totalEarnings = localStats.totalEarnings
      }
      if (typeof localStats.bestNetWorth === 'number' && localStats.bestNetWorth > 0) {
        updates.bestNetWorth = localStats.bestNetWorth
      }
      if (typeof localStats.winCount === 'number' && localStats.winCount > 0) {
        updates.winCount = localStats.winCount
      }
      if (typeof localStats.winStreak === 'number' && localStats.winStreak > 0) {
        updates.winStreak = localStats.winStreak
      }
      if (typeof localStats.currentStreak === 'number') {
        updates.currentStreak = localStats.currentStreak
      }
    }

    // Upsert profile (creates row if it doesn't exist)
    await db
      .insert(profiles)
      .values({ id: user.id, ...updates })
      .onConflictDoUpdate({
        target: profiles.id,
        set: updates,
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in username set:', error)
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error in username set:', message, error)
    return NextResponse.json(
      { success: false, error: `Username set failed: ${message}` },
      { status: 500 }
    )
  }
}
