export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { rooms, roomPlayers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(
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
    const { scenarioData } = body

    if (!scenarioData) {
      return NextResponse.json({ error: 'Scenario data required' }, { status: 400 })
    }

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
      return NextResponse.json({ error: 'Only the host can start the game' }, { status: 403 })
    }

    if (room.status !== 'lobby') {
      return NextResponse.json({ error: 'Room is not in lobby state' }, { status: 400 })
    }

    // Update room status
    await db
      .update(rooms)
      .set({
        status: 'playing',
        scenarioData: typeof scenarioData === 'string' ? scenarioData : JSON.stringify(scenarioData),
        startedAt: new Date(),
      })
      .where(eq(rooms.id, id))

    // Update all joined players to playing
    await db
      .update(roomPlayers)
      .set({ status: 'playing' })
      .where(eq(roomPlayers.roomId, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error starting room:', message)
    return NextResponse.json({ error: 'Failed to start room' }, { status: 500 })
  }
}
