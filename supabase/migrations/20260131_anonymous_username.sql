-- Add username column to game_results for anonymous play
ALTER TABLE game_results ADD COLUMN username TEXT;

-- Make user_id nullable (no longer require auth)
ALTER TABLE game_results ALTER COLUMN user_id DROP NOT NULL;

-- Drop old unique index and create new one keyed on username + game_id
DROP INDEX IF EXISTS idx_game_results_unique_game;
CREATE UNIQUE INDEX idx_game_results_unique_game ON game_results(username, game_id);

-- Index for queries by username
CREATE INDEX idx_game_results_username ON game_results(username);

-- Disable RLS since auth is disabled
ALTER TABLE game_results DISABLE ROW LEVEL SECURITY;
