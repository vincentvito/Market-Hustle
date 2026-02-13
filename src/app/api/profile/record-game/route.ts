import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { gameResults, tradeLogs } from '@/db/schema'

export async function POST(request: NextRequest) {
  try {
    const { username, finalNetWorth, gameData, tradeLogs: tradeLogEntries } = await request.json()

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
        .onConflictDoNothing()

      // Bulk insert trade logs (fire-and-forget style, don't fail the whole request)
      if (Array.isArray(tradeLogEntries) && tradeLogEntries.length > 0) {
        try {
          const rows = tradeLogEntries.map((t: {
            assetId: string
            assetName: string
            action: string
            category: string
            quantity?: number
            price?: number
            totalValue?: number
            leverage?: number
            profitLoss?: number
            day: number
          }) => ({
            username,
            gameId: gameData.gameId,
            assetId: t.assetId,
            assetName: t.assetName,
            action: t.action,
            category: t.category,
            quantity: t.quantity ?? null,
            price: t.price != null ? String(t.price) : null,
            totalValue: t.totalValue != null ? String(t.totalValue) : null,
            leverage: t.leverage ?? null,
            profitLoss: t.profitLoss != null ? String(t.profitLoss) : null,
            day: t.day,
          }))
          await db.insert(tradeLogs).values(rows)
        } catch (err) {
          console.error('Error inserting trade logs:', err)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error recording game:', message, error)
    return NextResponse.json({ error: `Failed to record game: ${message}` }, { status: 500 })
  }
}
