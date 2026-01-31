import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { gameResults } from '@/db/schema'

export async function POST(request: NextRequest) {
  try {
    const { username, finalNetWorth, gameData } = await request.json()

    // Validate username
    if (!username || typeof username !== 'string' || !/^[a-z0-9_]{3,15}$/.test(username)) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
    }

    // Insert game result
    if (gameData) {
      await db
        .insert(gameResults)
        .values({
          username,
          gameId: gameData.gameId,
          duration: gameData.duration,
          finalNetWorth: Math.round(finalNetWorth),
          profitPercent: String(gameData.profitPercent),
          daysSurvived: gameData.daysSurvived,
          outcome: gameData.outcome,
        })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error recording game:', message, error)
    return NextResponse.json({ error: `Failed to record game: ${message}` }, { status: 500 })
  }
}
