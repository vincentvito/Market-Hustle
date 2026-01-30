import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { profiles, gameResults } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { finalNetWorth, isWin, profileStats, gameData } = await request.json()

    const profit = Math.max(0, finalNetWorth - 100000)

    // Update aggregate stats in profiles table
    await db
      .update(profiles)
      .set({
        totalGamesPlayed: (profileStats.total_games_played || 0) + 1,
        totalEarnings: Math.round((profileStats.total_earnings || 0) + profit),
        bestNetWorth: Math.round(Math.max(profileStats.best_net_worth || 0, finalNetWorth)),
        winCount: isWin ? (profileStats.win_count || 0) + 1 : (profileStats.win_count || 0),
      })
      .where(eq(profiles.id, user.id))

    // Insert individual game result if game data provided
    if (gameData) {
      await db
        .insert(gameResults)
        .values({
          userId: user.id,
          gameId: gameData.gameId,
          duration: gameData.duration,
          finalNetWorth: Math.round(finalNetWorth),
          profitPercent: String(gameData.profitPercent),
          daysSurvived: gameData.daysSurvived,
          outcome: gameData.outcome,
        })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error recording game:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
