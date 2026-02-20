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

    // Check room exists
    const roomResult = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, id))
      .limit(1)

    if (roomResult.length === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Upsert result (update if exists, insert if new)
    const existingResult = await db
      .select({ id: roomResults.id })
      .from(roomResults)
      .where(and(eq(roomResults.roomId, id), eq(roomResults.userId, user.id)))
      .limit(1)

    if (existingResult.length > 0) {
      // Update existing result (replay)
      await db
        .update(roomResults)
        .set({
          username,
          finalNetWorth: Math.round(finalNetWorth),
          profitPercent: String(profitPercent ?? 0),
          daysSurvived: daysSurvived ?? 30,
          outcome,
        })
        .where(eq(roomResults.id, existingResult[0].id))
    } else {
      // Insert new result
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

    // Always recompute ranks after every submission
    const allResults = await db
      .select()
      .from(roomResults)
      .where(eq(roomResults.roomId, id))

    const sorted = [...allResults].sort((a, b) => {
      if (b.finalNetWorth !== a.finalNetWorth) return b.finalNetWorth - a.finalNetWorth
      if ((b.daysSurvived ?? 0) !== (a.daysSurvived ?? 0)) return (b.daysSurvived ?? 0) - (a.daysSurvived ?? 0)
      return Number(b.profitPercent ?? 0) - Number(a.profitPercent ?? 0)
    })

    let currentRank = 1
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && (
        sorted[i].finalNetWorth !== sorted[i - 1].finalNetWorth ||
        (sorted[i].daysSurvived ?? 0) !== (sorted[i - 1].daysSurvived ?? 0) ||
        Number(sorted[i].profitPercent ?? 0) !== Number(sorted[i - 1].profitPercent ?? 0)
      )) {
        currentRank++
      }
      await db
        .update(roomResults)
        .set({ rank: currentRank })
        .where(eq(roomResults.id, sorted[i].id))
    }

    // Return updated results with ranks
    const updatedResults = await db
      .select()
      .from(roomResults)
      .where(eq(roomResults.roomId, id))

    return NextResponse.json({
      success: true,
      results: updatedResults.map(r => ({
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
    console.error('Error finishing room game:', message)
    return NextResponse.json({ error: 'Failed to submit result' }, { status: 500 })
  }
}
