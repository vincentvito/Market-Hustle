export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { rooms, roomPlayers, roomResults, profiles } from '@/db/schema'
import { eq, and, count, ne } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { code, username: requestUsername } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Room code required' }, { status: 400 })
    }

    const normalizedRequestUsername = typeof requestUsername === 'string' ? requestUsername.trim().toLowerCase() : null

    // Get user profile for username
    const profileResult = await db
      .select({ username: profiles.username })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1)

    let username = profileResult[0]?.username

    // If profile has no username but one was sent in the request, sync it
    if (!username && normalizedRequestUsername && /^[a-z0-9_]{3,15}$/.test(normalizedRequestUsername)) {
      await db
        .insert(profiles)
        .values({ id: user.id, username: normalizedRequestUsername })
        .onConflictDoUpdate({
          target: profiles.id,
          set: { username: normalizedRequestUsername },
        })
      username = normalizedRequestUsername
    }

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

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

    if (room.status === 'finished') {
      return NextResponse.json({ error: 'Room is closed' }, { status: 400 })
    }

    // Parse settings from scenarioData
    let startingCash = 50_000
    let startingDebt = 50_000
    if (room.scenarioData) {
      try {
        const sd = JSON.parse(room.scenarioData)
        if (typeof sd.startingCash === 'number') startingCash = sd.startingCash
        if (typeof sd.startingDebt === 'number') startingDebt = sd.startingDebt
      } catch { /* ignore parse errors */ }
    }

    // Fetch existing results for standings
    const existingResults = await db
      .select()
      .from(roomResults)
      .where(eq(roomResults.roomId, room.id))

    const resultsPayload = existingResults.map(r => ({
      user_id: r.userId,
      username: r.username,
      final_net_worth: r.finalNetWorth,
      profit_percent: r.profitPercent,
      days_survived: r.daysSurvived,
      outcome: r.outcome,
      rank: r.rank,
    }))

    // Check if already in room
    const existingPlayer = await db
      .select({ id: roomPlayers.id, status: roomPlayers.status })
      .from(roomPlayers)
      .where(and(eq(roomPlayers.roomId, room.id), eq(roomPlayers.userId, user.id)))
      .limit(1)

    if (existingPlayer.length > 0) {
      // If player had left, reset them to joined
      if (existingPlayer[0].status === 'left') {
        await db
          .update(roomPlayers)
          .set({ status: 'joined' })
          .where(eq(roomPlayers.id, existingPlayer[0].id))
      }
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
        results: resultsPayload,
        message: 'Already in room',
      })
    }

    // Check player count (exclude players who left)
    const [playerCount] = await db
      .select({ count: count() })
      .from(roomPlayers)
      .where(and(eq(roomPlayers.roomId, room.id), ne(roomPlayers.status, 'left')))

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
        starting_cash: startingCash,
        starting_debt: startingDebt,
      },
      results: resultsPayload,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error joining room:', message)
    return NextResponse.json({ error: 'Failed to join room' }, { status: 500 })
  }
}
