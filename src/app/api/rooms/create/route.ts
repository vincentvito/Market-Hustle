export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { rooms, roomPlayers, profiles } from '@/db/schema'
import { eq, and, inArray } from 'drizzle-orm'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no I, O, 0, 1

function generateRoomCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return code
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const requestUsername = typeof body.username === 'string' ? body.username.trim().toLowerCase() : null
    const duration = typeof body.duration === 'number' && [30, 45, 60].includes(body.duration) ? body.duration : 30
    const startingCash = typeof body.startingCash === 'number' && body.startingCash > 0 ? body.startingCash : 50_000
    const startingDebt = typeof body.startingDebt === 'number' && body.startingDebt >= 0 ? body.startingDebt : 50_000

    // Get user profile for username
    const profileResult = await db
      .select({ username: profiles.username })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1)

    let username = profileResult[0]?.username

    // If profile has no username but one was sent in the request, sync it
    if (!username && requestUsername && /^[a-z0-9_]{3,15}$/.test(requestUsername)) {
      await db
        .insert(profiles)
        .values({ id: user.id, username: requestUsername })
        .onConflictDoUpdate({
          target: profiles.id,
          set: { username: requestUsername },
        })
      username = requestUsername
    }

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    // Generate unique room code (retry on collision with active rooms)
    let code: string
    let attempts = 0
    do {
      code = generateRoomCode()
      const existing = await db
        .select({ id: rooms.id })
        .from(rooms)
        .where(and(eq(rooms.code, code), inArray(rooms.status, ['lobby', 'playing'])))
        .limit(1)
      if (existing.length === 0) break
      attempts++
    } while (attempts < 10)

    if (attempts >= 10) {
      return NextResponse.json({ error: 'Failed to generate unique room code' }, { status: 500 })
    }

    // Create room
    const [room] = await db.insert(rooms).values({
      code,
      hostId: user.id,
      status: 'lobby',
      gameDuration: duration,
      maxPlayers: 8,
      scenarioData: JSON.stringify({ startingCash, startingDebt }),
    }).returning()

    // Add host as first player
    await db.insert(roomPlayers).values({
      roomId: room.id,
      userId: user.id,
      username,
      isHost: true,
      isReady: true,
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
        starting_cash: startingCash,
        starting_debt: startingDebt,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error creating room:', message)
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 })
  }
}
