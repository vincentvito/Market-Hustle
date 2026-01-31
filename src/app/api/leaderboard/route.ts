export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * GET /api/leaderboard?period=all|daily
 * Returns top 100 scores from game_results.
 * Each user appears only once (their best score within the period).
 */
export async function GET(request: NextRequest) {
  try {
    const period = request.nextUrl.searchParams.get('period') ?? 'all'
    const supabase = createAdminClient()

    const isWorst = period === 'worst'

    let query = supabase
      .from('game_results')
      .select('final_net_worth, user_id, username, created_at')
      .order('final_net_worth', { ascending: isWorst })
      .limit(500)

    // For daily, filter to today's results (UTC)
    if (period === 'daily') {
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      query = query.gte('created_at', today.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error('Leaderboard query error:', error)
      return NextResponse.json({ entries: [] })
    }

    // Dedupe: keep only the best score per username
    const bestByUser = new Map<string, { username: string; score: number }>()
    for (const row of data ?? []) {
      const username = row.username ?? 'Unknown'
      if (username === 'Unknown') continue
      const score = row.final_net_worth

      const existing = bestByUser.get(username)
      if (!existing || (isWorst ? score < existing.score : score > existing.score)) {
        bestByUser.set(username, { username, score })
      }
    }

    // Sort by score desc and take top 100
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
