export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { rooms, roomPlayers } from '@/db/schema'
import { eq, and, ne } from 'drizzle-orm'

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

    // Mark player as left
    await db
      .update(roomPlayers)
      .set({ status: 'left' })
      .where(and(eq(roomPlayers.roomId, id), eq(roomPlayers.userId, user.id)))

    // Handle host departure
    if (room.hostId === user.id) {
      const remainingPlayers = await db
        .select()
        .from(roomPlayers)
        .where(and(eq(roomPlayers.roomId, id), ne(roomPlayers.status, 'left')))

      if (remainingPlayers.length > 0) {
        // Transfer host to the next player
        const newHost = remainingPlayers[0]
        await db
          .update(rooms)
          .set({ hostId: newHost.userId })
          .where(eq(rooms.id, id))
        await db
          .update(roomPlayers)
          .set({ isHost: true })
          .where(eq(roomPlayers.id, newHost.id))
        // Remove host flag from leaving player
        await db
          .update(roomPlayers)
          .set({ isHost: false })
          .where(and(eq(roomPlayers.roomId, id), eq(roomPlayers.userId, user.id)))
      } else {
        // No players remain: mark room as finished
        await db
          .update(rooms)
          .set({ status: 'finished', finishedAt: new Date() })
          .where(eq(rooms.id, id))
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error leaving room:', message)
    return NextResponse.json({ error: 'Failed to leave room' }, { status: 500 })
  }
}
