export const dynamic = 'force-dynamic'

import { MarketHustle } from '@/components/game/MarketHustle'
import { getLeaderboard } from '@/lib/game/leaderboardData'

export default async function Home() {
  const [daily, allTime, worst] = await Promise.all([
    getLeaderboard('daily').catch(() => ({ entries: [] })),
    getLeaderboard('all').catch(() => ({ entries: [] })),
    getLeaderboard('worst').catch(() => ({ entries: [] })),
  ])

  return (
    <MarketHustle
      initialLeaderboards={{
        daily: daily.entries,
        allTime: allTime.entries,
        worst: worst.entries,
      }}
    />
  )
}
