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

    if (room.status === 'lobby') {
      // In lobby: remove the player entirely
      await db
        .delete(roomPlayers)
        .where(and(eq(roomPlayers.roomId, id), eq(roomPlayers.userId, user.id)))
    } else {
      // During game: mark as left
      await db
        .update(roomPlayers)
        .set({ status: 'left' })
        .where(and(eq(roomPlayers.roomId, id), eq(roomPlayers.userId, user.id)))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error leaving room:', message)
    return NextResponse.json({ error: 'Failed to leave room' }, { status: 500 })
  }
}
