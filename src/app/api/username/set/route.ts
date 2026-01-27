import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'

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

    // Check availability (use admin client to see all profiles)
    const adminClient = createAdminClient()
    const { data: existing } = await adminClient
      .from('profiles')
      .select('id')
      .eq('username', trimmedUsername)
      .single()

    if (existing && existing.id !== user.id) {
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
        updates.total_games_played = localStats.totalGamesPlayed
      }
      if (typeof localStats.totalEarnings === 'number' && localStats.totalEarnings > 0) {
        updates.total_earnings = localStats.totalEarnings
      }
      if (typeof localStats.bestNetWorth === 'number' && localStats.bestNetWorth > 0) {
        updates.best_net_worth = localStats.bestNetWorth
      }
      if (typeof localStats.winCount === 'number' && localStats.winCount > 0) {
        updates.win_count = localStats.winCount
      }
      if (typeof localStats.winStreak === 'number' && localStats.winStreak > 0) {
        updates.win_streak = localStats.winStreak
      }
      if (typeof localStats.currentStreak === 'number') {
        updates.current_streak = localStats.currentStreak
      }
    }

    // Upsert profile (creates row if it doesn't exist)
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates })

    if (updateError) {
      console.error('Error setting username:', updateError)
      return NextResponse.json({
        success: false,
        error: 'Failed to set username. Please try again.',
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in username set:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
