export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/game/leaderboardData'

/**
 * GET /api/leaderboard?period=all|daily|worst
 * Returns top 100 scores from game_results.
 * Each user appears only once (their best score within the period).
 */
export async function GET(request: NextRequest) {
  try {
    const period = (request.nextUrl.searchParams.get('period') ?? 'all') as 'daily' | 'all' | 'worst'
    const durationParam = request.nextUrl.searchParams.get('duration')
    const duration = durationParam ? parseInt(durationParam, 10) : undefined
    const { entries } = await getLeaderboard(period, duration)

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
