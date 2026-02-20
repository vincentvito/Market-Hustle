export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { rooms, roomPlayers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Get room and verify host
    const roomResult = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, id))
      .limit(1)

    if (roomResult.length === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const room = roomResult[0]

    if (room.hostId !== user.id) {
      return NextResponse.json({ error: 'Only the host can update settings' }, { status: 403 })
    }

    // Check settings not locked (no player with status playing or finished)
    const players = await db
      .select({ status: roomPlayers.status })
      .from(roomPlayers)
      .where(eq(roomPlayers.roomId, id))

    const locked = players.some(p => p.status === 'playing' || p.status === 'finished')
    if (locked) {
      return NextResponse.json({ error: 'Settings are locked — a player has already started' }, { status: 400 })
    }

    // Parse and validate settings
    const duration = typeof body.duration === 'number' && [30, 45, 60].includes(body.duration)
      ? body.duration : room.gameDuration
    const startingCash = typeof body.startingCash === 'number' && body.startingCash > 0
      ? body.startingCash : 50_000
    const startingDebt = typeof body.startingDebt === 'number' && body.startingDebt >= 0
      ? body.startingDebt : 50_000

    // Update room
    await db
      .update(rooms)
      .set({
        gameDuration: duration,
        scenarioData: JSON.stringify({ startingCash, startingDebt }),
      })
      .where(eq(rooms.id, id))

    return NextResponse.json({
      settings: {
        game_duration: duration,
        starting_cash: startingCash,
        starting_debt: startingDebt,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error updating room settings:', message)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
