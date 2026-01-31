import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { gamePlays } from '@/db/schema'

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    await db.insert(gamePlays).values({
      userId: user.id,
      playedAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error recording game play:', message, error)
    return NextResponse.json({ error: `Failed to record game play: ${message}` }, { status: 500 })
  }
}
