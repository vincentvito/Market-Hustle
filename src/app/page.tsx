export const dynamic = 'force-dynamic'

import { MarketHustle } from '@/components/game/MarketHustle'
import { RoomRedirect } from '@/components/RoomRedirect'
import { getLeaderboard } from '@/lib/game/leaderboardData'

export default async function Home() {
  const [daily, allTime, worst] = await Promise.all([
    getLeaderboard('daily', 30).catch(() => ({ entries: [] })),
    getLeaderboard('all', 30).catch(() => ({ entries: [] })),
    getLeaderboard('worst', 30).catch(() => ({ entries: [] })),
  ])

  return (
    <>
      <RoomRedirect />
      <MarketHustle
        initialLeaderboards={{
          daily: daily.entries,
          allTime: allTime.entries,
          worst: worst.entries,
        }}
      />
    </>
  )
}
