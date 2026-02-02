'use client'

import { useAuth } from '@/contexts/AuthContext'

/**
 * Dashboard showing user's career statistics.
 * Only shown for logged-in users (free or Pro).
 */
export function UserStatsDashboard() {
  const { profile, user } = useAuth()

  if (!user || !profile) return null

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`
    return `$${num.toLocaleString('en-US')}`
  }

  // Calculate win rate
  const winRate = profile.total_games_played > 0
    ? Math.round((profile.win_count / profile.total_games_played) * 100)
    : 0

  return (
    <div className="w-full max-w-[320px] mb-6">
      {/* Username header */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-mh-text-dim text-sm">Welcome back,</span>
        <span className="text-mh-accent-blue font-bold">{profile.username || 'Trader'}</span>
        {profile.tier === 'pro' && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-mh-profit-green text-mh-bg rounded">
            PRO
          </span>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Games Played */}
        <div className="p-3 border border-mh-border rounded bg-mh-border/10">
          <div className="text-mh-text-dim text-xs mb-1">GAMES</div>
          <div className="text-mh-text-bright text-lg font-bold">
            {profile.total_games_played}
          </div>
        </div>

        {/* Win Rate */}
        <div className="p-3 border border-mh-border rounded bg-mh-border/10">
          <div className="text-mh-text-dim text-xs mb-1">WIN RATE</div>
          <div className={`text-lg font-bold ${winRate >= 50 ? 'text-mh-profit-green' : 'text-mh-text-bright'}`}>
            {winRate}%
          </div>
        </div>

        {/* Best Net Worth */}
        <div className="p-3 border border-mh-border rounded bg-mh-border/10">
          <div className="text-mh-text-dim text-xs mb-1">BEST RUN</div>
          <div className="text-mh-profit-green text-lg font-bold">
            {formatNumber(profile.best_net_worth || 100000)}
          </div>
        </div>

        {/* Current Streak */}
        <div className="p-3 border border-mh-border rounded bg-mh-border/10">
          <div className="text-mh-text-dim text-xs mb-1">WIN STREAK</div>
          <div className="text-mh-accent-blue text-lg font-bold">
            {profile.current_streak || 0}
            {(profile.win_streak || 0) > 0 && (
              <span className="text-mh-text-dim text-xs ml-1">
                (best: {profile.win_streak})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Total Earnings */}
      <div className="mt-2 p-3 border border-mh-border rounded bg-mh-border/10">
        <div className="flex justify-between items-center">
          <span className="text-mh-text-dim text-xs">CAREER EARNINGS</span>
          <span className="text-mh-profit-green font-bold">
            {formatNumber(profile.total_earnings || 0)}
          </span>
        </div>
      </div>
    </div>
  )
}
