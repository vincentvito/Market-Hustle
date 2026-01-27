-- ============================================
-- GAME RESULTS TABLE
-- Stores individual game run history
-- ============================================

-- Create game_results table
CREATE TABLE IF NOT EXISTS game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,                    -- Original client-side ID (timestamp_random)
  duration SMALLINT NOT NULL CHECK (duration IN (30, 45, 60)),
  final_net_worth INTEGER NOT NULL,
  profit_percent DECIMAL(10, 2) NOT NULL,
  days_survived SMALLINT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('win', 'bankrupt', 'imprisoned', 'deceased', 'short_squeezed', 'margin_called')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying user's game history
CREATE INDEX idx_game_results_user_id ON game_results(user_id);
CREATE INDEX idx_game_results_created_at ON game_results(created_at DESC);

-- Unique constraint to prevent duplicate game imports
CREATE UNIQUE INDEX idx_game_results_unique_game ON game_results(user_id, game_id);

-- Enable RLS
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

-- Users can view their own game results
CREATE POLICY "Users can view own game results" ON game_results
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own game results
CREATE POLICY "Users can insert own game results" ON game_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check table exists:
-- SELECT * FROM game_results LIMIT 1;

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE schemaname = 'public' AND tablename = 'game_results';

-- Check policies:
-- SELECT policyname, cmd FROM pg_policies
-- WHERE tablename = 'game_results';
