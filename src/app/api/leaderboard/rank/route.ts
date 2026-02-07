export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { gameResults } from '@/db/schema'
import { sql, and, gte, eq } from 'drizzle-orm'

/**
 * GET /api/leaderboard/rank?username=X&score=Y&duration=Z
 * Returns the player's rank among all players for the given duration.
 * Rank = count of distinct usernames whose best score > the given score, + 1.
 * Excludes billionaire placeholder entries (real DB only).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const username = searchParams.get('username')
    const scoreStr = searchParams.get('score')
    const durationStr = searchParams.get('duration')

    if (!username || !scoreStr || !durationStr) {
      return NextResponse.json({ error: 'Missing required params: username, score, duration' }, { status: 400 })
    }

    const score = parseInt(scoreStr, 10)
    const duration = parseInt(durationStr, 10)

    if (isNaN(score) || isNaN(duration)) {
      return NextResponse.json({ error: 'score and duration must be integers' }, { status: 400 })
    }

    const durationFilter = eq(gameResults.duration, duration)

    // All-time rank: count distinct usernames whose MAX(final_net_worth) > score
    const allTimeRankResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(
        db
          .select({ maxScore: sql<number>`max(${gameResults.finalNetWorth})` })
          .from(gameResults)
          .where(durationFilter)
          .groupBy(gameResults.username)
          .having(sql`max(${gameResults.finalNetWorth}) > ${score}`)
          .as('better_players')
      )

    const allTimeTotalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(
        db
          .select({ u: gameResults.username })
          .from(gameResults)
          .where(durationFilter)
          .groupBy(gameResults.username)
          .as('all_players')
      )

    const allTimeRank = Number(allTimeRankResult[0]?.count ?? 0) + 1
    const allTimeTotal = Number(allTimeTotalResult[0]?.count ?? 0)

    // Daily rank: same logic but filtered to today UTC
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const dailyFilter = and(durationFilter, gte(gameResults.createdAt, today))

    const dailyRankResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(
        db
          .select({ maxScore: sql<number>`max(${gameResults.finalNetWorth})` })
          .from(gameResults)
          .where(dailyFilter)
          .groupBy(gameResults.username)
          .having(sql`max(${gameResults.finalNetWorth}) > ${score}`)
          .as('daily_better')
      )

    const dailyTotalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(
        db
          .select({ u: gameResults.username })
          .from(gameResults)
          .where(dailyFilter)
          .groupBy(gameResults.username)
          .as('daily_all')
      )

    const dailyRank = Number(dailyRankResult[0]?.count ?? 0) + 1
    const dailyTotal = Number(dailyTotalResult[0]?.count ?? 0)

    return NextResponse.json({
      dailyRank,
      dailyTotal,
      allTimeRank,
      allTimeTotal,
    })
  } catch (error) {
    console.error('Rank endpoint error:', error)
    return NextResponse.json({ error: 'Failed to compute rank' }, { status: 500 })
  }
}
