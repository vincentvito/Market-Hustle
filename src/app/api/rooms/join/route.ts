export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { rooms, roomPlayers, profiles } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Room code required' }, { status: 400 })
    }

    // Get user profile for username
    const profileResult = await db
      .select({ username: profiles.username })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1)

    if (profileResult.length === 0 || !profileResult[0].username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    const username = profileResult[0].username

    // Find room by code
    const roomResult = await db
      .select()
      .from(rooms)
      .where(eq(rooms.code, code.toUpperCase()))
      .limit(1)

    if (roomResult.length === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const room = roomResult[0]

    if (room.status !== 'lobby') {
      return NextResponse.json({ error: 'Room is no longer accepting players' }, { status: 400 })
    }

    // Check if already in room
    const existingPlayer = await db
      .select({ id: roomPlayers.id })
      .from(roomPlayers)
      .where(and(eq(roomPlayers.roomId, room.id), eq(roomPlayers.userId, user.id)))
      .limit(1)

    if (existingPlayer.length > 0) {
      return NextResponse.json({
        room: {
          id: room.id,
          code: room.code,
          status: room.status,
          host_id: room.hostId,
          game_duration: room.gameDuration,
          max_players: room.maxPlayers,
        },
        message: 'Already in room',
      })
    }

    // Check player count
    const [playerCount] = await db
      .select({ count: count() })
      .from(roomPlayers)
      .where(and(eq(roomPlayers.roomId, room.id), eq(roomPlayers.status, 'joined')))

    if (playerCount.count >= room.maxPlayers) {
      return NextResponse.json({ error: 'Room is full' }, { status: 400 })
    }

    // Add player
    await db.insert(roomPlayers).values({
      roomId: room.id,
      userId: user.id,
      username,
      isHost: false,
      isReady: false,
      status: 'joined',
    })

    return NextResponse.json({
      room: {
        id: room.id,
        code: room.code,
        status: room.status,
        host_id: room.hostId,
        game_duration: room.gameDuration,
        max_players: room.maxPlayers,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error joining room:', message)
    return NextResponse.json({ error: 'Failed to join room' }, { status: 500 })
  }
}
