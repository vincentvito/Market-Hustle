import { db } from '@/db'
import { gameResults } from '@/db/schema'
import { desc, asc, gte } from 'drizzle-orm'

export async function getLeaderboard(period: 'daily' | 'all' | 'worst') {
  const isWorst = period === 'worst'

  const conditions = []
  if (period === 'daily') {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    conditions.push(gte(gameResults.createdAt, today))
  }

  const data = await db
    .select({
      username: gameResults.username,
      finalNetWorth: gameResults.finalNetWorth,
      createdAt: gameResults.createdAt,
    })
    .from(gameResults)
    .where(conditions.length > 0 ? conditions[0] : undefined)
    .orderBy(isWorst ? asc(gameResults.finalNetWorth) : desc(gameResults.finalNetWorth))
    .limit(500)

  // Dedupe: keep only the best score per username
  const bestByUser = new Map<string, { username: string; score: number }>()
  for (const row of data) {
    const username = row.username
    if (!username) continue
    const score = row.finalNetWorth

    const existing = bestByUser.get(username)
    if (!existing || (isWorst ? score < existing.score : score > existing.score)) {
      bestByUser.set(username, { username, score })
    }
  }

  const entries = Array.from(bestByUser.values())
    .sort((a, b) => isWorst ? a.score - b.score : b.score - a.score)
    .slice(0, 100)

  return { entries }
}
