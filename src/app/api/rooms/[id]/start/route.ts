export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { rooms, roomPlayers } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(
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

    if (room.status === 'finished') {
      return NextResponse.json({ error: 'Room is closed' }, { status: 400 })
    }

    // Verify player is in the room
    const playerResult = await db
      .select({ id: roomPlayers.id, status: roomPlayers.status })
      .from(roomPlayers)
      .where(and(eq(roomPlayers.roomId, id), eq(roomPlayers.userId, user.id)))
      .limit(1)

    if (playerResult.length === 0) {
      return NextResponse.json({ error: 'Not in this room' }, { status: 400 })
    }

    const player = playerResult[0]

    // Allow starting if joined or finished (replay)
    if (player.status !== 'joined' && player.status !== 'finished') {
      return NextResponse.json({ error: 'Already playing' }, { status: 400 })
    }

    // Update this player's status to playing
    await db
      .update(roomPlayers)
      .set({ status: 'playing', currentDay: 0, currentNetWorth: 50_000 })
      .where(eq(roomPlayers.id, player.id))

    // If room is still in lobby (first player to start), transition to playing
    if (room.status === 'lobby') {
      await db
        .update(rooms)
        .set({ status: 'playing', startedAt: new Date() })
        .where(eq(rooms.id, id))
    }

    // Parse settings
    let startingCash = 50_000
    let startingDebt = 50_000
    if (room.scenarioData) {
      try {
        const sd = JSON.parse(room.scenarioData)
        if (typeof sd.startingCash === 'number') startingCash = sd.startingCash
        if (typeof sd.startingDebt === 'number') startingDebt = sd.startingDebt
      } catch { /* ignore */ }
    }

    return NextResponse.json({
      success: true,
      settings: {
        game_duration: room.gameDuration,
        starting_cash: startingCash,
        starting_debt: startingDebt,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error starting room:', message, error)
    return NextResponse.json({ error: `Failed to start room: ${message}` }, { status: 500 })
  }
}
