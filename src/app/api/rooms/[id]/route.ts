export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { rooms, roomPlayers, roomResults } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await params

    // Get room
    const roomResult = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, id))
      .limit(1)

    if (roomResult.length === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const room = roomResult[0]

    // Get players
    const players = await db
      .select()
      .from(roomPlayers)
      .where(eq(roomPlayers.roomId, id))

    // Get results if finished
    let results: typeof roomResults.$inferSelect[] = []
    if (room.status === 'finished') {
      results = await db
        .select()
        .from(roomResults)
        .where(eq(roomResults.roomId, id))
    }

    return NextResponse.json({
      room: {
        id: room.id,
        code: room.code,
        status: room.status,
        host_id: room.hostId,
        scenario_data: room.scenarioData,
        game_duration: room.gameDuration,
        max_players: room.maxPlayers,
        created_at: room.createdAt,
        started_at: room.startedAt,
        finished_at: room.finishedAt,
      },
      players: players.map(p => ({
        id: p.id,
        user_id: p.userId,
        username: p.username,
        is_host: p.isHost,
        is_ready: p.isReady,
        current_day: p.currentDay,
        current_net_worth: p.currentNetWorth,
        status: p.status,
      })),
      results: results.map(r => ({
        user_id: r.userId,
        username: r.username,
        final_net_worth: r.finalNetWorth,
        profit_percent: r.profitPercent,
        days_survived: r.daysSurvived,
        outcome: r.outcome,
        rank: r.rank,
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching room:', message)
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 })
  }
}
