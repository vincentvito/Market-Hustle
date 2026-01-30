import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * GET /api/leaderboard?period=all|daily
 * Returns top 100 scores from game_results joined with profiles.
 * Each user appears only once (their best score within the period).
 */
export async function GET(request: NextRequest) {
  try {
    const period = request.nextUrl.searchParams.get('period') ?? 'all'
    const supabase = createAdminClient()

    let query = supabase
      .from('game_results')
      .select(`
        final_net_worth,
        user_id,
        created_at,
        profiles!inner(username)
      `)
      .order('final_net_worth', { ascending: false })
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

    // Dedupe: keep only the best score per user
    const bestByUser = new Map<string, { username: string; score: number }>()
    for (const row of data ?? []) {
      const userId = row.user_id
      const score = row.final_net_worth
      const profile = row.profiles as unknown as { username: string }
      const username = profile?.username ?? 'Unknown'

      const existing = bestByUser.get(userId)
      if (!existing || score > existing.score) {
        bestByUser.set(userId, { username, score })
      }
    }

    // Sort by score desc and take top 100
    const entries = Array.from(bestByUser.values())
      .sort((a, b) => b.score - a.score)
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
    console.error('Leaderboard error:', error)
    return NextResponse.json({ entries: [] })
  }
}
