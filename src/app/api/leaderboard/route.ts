export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { gameResults } from '@/db/schema'
import { desc, asc, gte, sql } from 'drizzle-orm'

/**
 * GET /api/leaderboard?period=all|daily|worst
 * Returns top 100 scores from game_results.
 * Each user appears only once (their best score within the period).
 */
export async function GET(request: NextRequest) {
  try {
    const period = request.nextUrl.searchParams.get('period') ?? 'all'
    const isWorst = period === 'worst'

    // Build conditions
    const conditions = []
    if (period === 'daily') {
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      conditions.push(gte(gameResults.createdAt, today))
    }

    const data = await db
      .select({
        username: gameResults.username,
        finalNetWorth: gameResults.finalNetWorth,
        createdAt: gameResults.createdAt,
      })
      .from(gameResults)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(isWorst ? asc(gameResults.finalNetWorth) : desc(gameResults.finalNetWorth))
      .limit(500)

    // Dedupe: keep only the best score per username
    const bestByUser = new Map<string, { username: string; score: number }>()
    for (const row of data) {
      const username = row.username
      if (!username) continue
      const score = row.finalNetWorth

      const existing = bestByUser.get(username)
      if (!existing || (isWorst ? score < existing.score : score > existing.score)) {
        bestByUser.set(username, { username, score })
      }
    }

    // Sort by score and take top 100
    const entries = Array.from(bestByUser.values())
      .sort((a, b) => isWorst ? a.score - b.score : b.score - a.score)
      .slice(0, 100)

    return NextResponse.json(
      { entries },
      {
        headers: {
          'Cache-Control': period === 'daily'
            ? 'public, s-maxage=30, stale-while-revalidate=60'
            : 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Leaderboard error:', message, error)
    return NextResponse.json({ entries: [], error: `Leaderboard failed: ${message}` })
  }
}
