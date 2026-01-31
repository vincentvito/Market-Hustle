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

    const { stats, gameHistory } = await request.json()

    // Migrate game history
    if (gameHistory && Array.isArray(gameHistory) && gameHistory.length > 0) {
      const rows = gameHistory.map((entry: {
        gameId: string
        duration: number
        finalNetWorth: number
        profitPercent: number
        daysSurvived: number
        outcome: string
        date: string
      }) => ({
        userId: user.id,
        gameId: entry.gameId,
        duration: entry.duration,
        finalNetWorth: Math.round(entry.finalNetWorth),
        profitPercent: String(entry.profitPercent),
        daysSurvived: entry.daysSurvived,
        outcome: entry.outcome,
        createdAt: new Date(entry.date),
      }))

      // Insert with conflict ignore for duplicates
      await db
        .insert(gameResults)
        .values(rows)
        .onConflictDoNothing()
    }

    // Migrate aggregate stats
    if (stats && stats.totalGamesPlayed > 0) {
      await db
        .update(profiles)
        .set({
          totalGamesPlayed: stats.totalGamesPlayed,
          totalEarnings: stats.totalEarnings,
          bestNetWorth: stats.bestNetWorth,
          winCount: stats.winCount,
          winStreak: stats.winStreak || 0,
          currentStreak: stats.currentStreak || 0,
        })
        .where(eq(profiles.id, user.id))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error migrating stats:', message, error)
    return NextResponse.json({ error: `Failed to migrate stats: ${message}` }, { status: 500 })
  }
}
