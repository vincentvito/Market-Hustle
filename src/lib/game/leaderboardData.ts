import { db } from '@/db'
import { gameResults } from '@/db/schema'
import { desc, asc, gte, eq, and } from 'drizzle-orm'

const BILLIONAIRE_ENTRIES = [
  { username: 'Elon Musk', score: 852_500_000_000 },
  { username: 'Larry Page', score: 277_900_000_000 },
  { username: 'Sergey Brin', score: 256_300_000_000 },
  { username: 'Jeff Bezos', score: 249_300_000_000 },
  { username: 'Mark Zuckerberg', score: 237_000_000_000 },
]

export async function getLeaderboard(period: 'daily' | 'all' | 'worst', duration?: number) {
  const isWorst = period === 'worst'

  const conditions = []
  if (period === 'daily') {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    conditions.push(gte(gameResults.createdAt, today))
  }
  if (duration) {
    conditions.push(eq(gameResults.duration, duration))
  }

  const whereClause = conditions.length > 1
    ? and(...conditions)
    : conditions.length === 1
      ? conditions[0]
      : undefined

  const data = await db
    .select({
      username: gameResults.username,
      finalNetWorth: gameResults.finalNetWorth,
      createdAt: gameResults.createdAt,
    })
    .from(gameResults)
    .where(whereClause)
    .orderBy(isWorst ? asc(gameResults.finalNetWorth) : desc(gameResults.finalNetWorth))
    .limit(500)

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

  // Merge billionaire entries into all-time leaderboard only
  if (period === 'all') {
    for (const entry of BILLIONAIRE_ENTRIES) {
      bestByUser.set(entry.username, entry)
    }
  }

  const entries = Array.from(bestByUser.values())
    .sort((a, b) => isWorst ? a.score - b.score : b.score - a.score)
    .slice(0, 100)

  return { entries }
}
