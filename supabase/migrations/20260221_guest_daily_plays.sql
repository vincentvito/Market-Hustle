-- IP-based daily rate limiting for anonymous (non-logged-in) users.
-- Prevents unlimited play without an account while keeping the check server-side
-- so it can't be bypassed by clearing localStorage.
CREATE TABLE IF NOT EXISTS guest_daily_plays (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip TEXT NOT NULL,
  played_date TEXT NOT NULL,        -- 'YYYY-MM-DD'
  games_played INTEGER NOT NULL DEFAULT 1,
  UNIQUE (ip, played_date)
);

CREATE INDEX IF NOT EXISTS idx_guest_daily_plays_date ON guest_daily_plays (played_date);

-- Auto-purge rows older than 2 days to keep the table small.
-- Run nightly via pg_cron or just let old rows sit (they're tiny).
