export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { rooms, roomPlayers, roomResults } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

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
    const { finalNetWorth, profitPercent, daysSurvived, outcome, username } = body

    if (finalNetWorth === undefined || !outcome || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check room exists and is playing
    const roomResult = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, id))
      .limit(1)

    if (roomResult.length === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Upsert result (in case of re-submission)
    const existingResult = await db
      .select({ id: roomResults.id })
      .from(roomResults)
      .where(and(eq(roomResults.roomId, id), eq(roomResults.userId, user.id)))
      .limit(1)

    if (existingResult.length > 0) {
      await db
        .update(roomResults)
        .set({
          finalNetWorth: Math.round(finalNetWorth),
          profitPercent: String(profitPercent ?? 0),
          daysSurvived: daysSurvived ?? 30,
          outcome,
        })
        .where(eq(roomResults.id, existingResult[0].id))
    } else {
      await db.insert(roomResults).values({
        roomId: id,
        userId: user.id,
        username,
        finalNetWorth: Math.round(finalNetWorth),
        profitPercent: String(profitPercent ?? 0),
        daysSurvived: daysSurvived ?? 30,
        outcome,
      })
    }

    // Update player status to finished
    await db
      .update(roomPlayers)
      .set({
        status: 'finished',
        currentNetWorth: Math.round(finalNetWorth),
        currentDay: daysSurvived ?? 30,
      })
      .where(and(eq(roomPlayers.roomId, id), eq(roomPlayers.userId, user.id)))

    // Check if all players are finished
    const activePlayers = await db
      .select({ status: roomPlayers.status })
      .from(roomPlayers)
      .where(eq(roomPlayers.roomId, id))

    const allFinished = activePlayers.every(p => p.status === 'finished' || p.status === 'left')

    if (allFinished) {
      // Compute ranks
      const allResults = await db
        .select()
        .from(roomResults)
        .where(eq(roomResults.roomId, id))

      const sorted = [...allResults].sort((a, b) => b.finalNetWorth - a.finalNetWorth)
      for (let i = 0; i < sorted.length; i++) {
        await db
          .update(roomResults)
          .set({ rank: i + 1 })
          .where(eq(roomResults.id, sorted[i].id))
      }

      // Mark room as finished
      await db
        .update(rooms)
        .set({ status: 'finished', finishedAt: new Date() })
        .where(eq(rooms.id, id))
    }

    return NextResponse.json({ success: true, allFinished })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error finishing room game:', message)
    return NextResponse.json({ error: 'Failed to submit result' }, { status: 500 })
  }
}
