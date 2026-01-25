// =============================================================================
// LEADERBOARD GENERATOR
// Generates fake leaderboard entries with logarithmic score distribution
// =============================================================================

import { generateUsername } from './gossip'

export interface LeaderboardEntry {
  username: string
  score: number
}

/**
 * Generates a fake leaderboard with logarithmic score distribution.
 * Most scores cluster in the lower range (~$150K-$500K),
 * fewer in millions, very few in billions.
 *
 * @param count Number of entries to generate (default 100)
 * @param minScore Minimum score (default ~$150K)
 * @param maxScore Maximum score (default ~$14.8B)
 */
export function generateLeaderboard(
  count: number = 100,
  minScore: number = 150_000,
  maxScore: number = 14_856_103_887
): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = []

  // Use logarithmic distribution
  // log(minScore) to log(maxScore) mapped to 0-1
  const logMin = Math.log(minScore)
  const logMax = Math.log(maxScore)
  const logRange = logMax - logMin

  for (let i = 0; i < count; i++) {
    // Position in the leaderboard (0 = top, 1 = bottom)
    const position = i / (count - 1)

    // Logarithmic interpolation: top scores are exponentially higher
    // Add some randomness to avoid perfectly smooth curve
    const jitter = (Math.random() - 0.5) * 0.1 // ±5% jitter
    const logScore = logMax - (position + jitter) * logRange
    let score = Math.exp(logScore)

    // Round to "nice" numbers based on magnitude
    if (score >= 1_000_000_000) {
      // Billions: round to nearest 100M
      score = Math.round(score / 100_000_000) * 100_000_000
    } else if (score >= 100_000_000) {
      // 100M+: round to nearest 10M
      score = Math.round(score / 10_000_000) * 10_000_000
    } else if (score >= 10_000_000) {
      // 10M+: round to nearest 1M
      score = Math.round(score / 1_000_000) * 1_000_000
    } else if (score >= 1_000_000) {
      // 1M+: round to nearest 100K
      score = Math.round(score / 100_000) * 100_000
    } else if (score >= 100_000) {
      // 100K+: round to nearest 10K
      score = Math.round(score / 10_000) * 10_000
    } else {
      // Under 100K: round to nearest 1K
      score = Math.round(score / 1_000) * 1_000
    }

    // Clamp to range
    score = Math.max(minScore, Math.min(maxScore, score))

    entries.push({
      username: generateUsername(),
      score,
    })
  }

  // Sort by score descending (highest first)
  entries.sort((a, b) => b.score - a.score)

  // Ensure top score is exactly maxScore and bottom is near minScore
  if (entries.length > 0) {
    entries[0].score = maxScore
  }

  return entries
}
