export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { profiles, proTrials } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const result = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1)

    if (result.length === 0) {
      return NextResponse.json({ profile: null })
    }

    const profile = result[0]

    // Fetch pro trial data
    const trialResult = await db
      .select({ gamesUsed: proTrials.gamesUsed })
      .from(proTrials)
      .where(eq(proTrials.userId, user.id))
      .limit(1)

    return NextResponse.json({
      profile: {
        id: profile.id,
        username: profile.username,
        tier: profile.tier,
        total_games_played: profile.totalGamesPlayed,
        total_earnings: profile.totalEarnings,
        best_net_worth: profile.bestNetWorth,
        win_count: profile.winCount,
        win_streak: profile.winStreak,
        current_streak: profile.currentStreak,
        games_played_today: profile.gamesPlayedToday,
        last_played_date: profile.lastPlayedDate,
        pro_trial_games_used: trialResult[0]?.gamesUsed ?? 0,
        selected_theme: profile.selectedTheme,
        selected_duration: profile.selectedDuration,
        unlocked_achievements: profile.unlockedAchievements,
      },
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
