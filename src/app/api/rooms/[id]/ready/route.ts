export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { roomPlayers } from '@/db/schema'
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

    // Get current ready state
    const playerResult = await db
      .select({ isReady: roomPlayers.isReady })
      .from(roomPlayers)
      .where(and(eq(roomPlayers.roomId, id), eq(roomPlayers.userId, user.id)))
      .limit(1)

    if (playerResult.length === 0) {
      return NextResponse.json({ error: 'Not in this room' }, { status: 400 })
    }

    // Use explicit isReady from body, fall back to toggle
    let body: { isReady?: boolean } = {}
    try { body = await request.json() } catch { /* no body */ }
    const newReady = body.isReady !== undefined ? body.isReady : !playerResult[0].isReady

    await db
      .update(roomPlayers)
      .set({ isReady: newReady })
      .where(and(eq(roomPlayers.roomId, id), eq(roomPlayers.userId, user.id)))

    return NextResponse.json({ success: true, is_ready: newReady })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error toggling ready:', message)
    return NextResponse.json({ error: 'Failed to toggle ready' }, { status: 500 })
  }
}
