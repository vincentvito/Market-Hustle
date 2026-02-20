-- Fix missing columns on profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pro_trial_games_used integer NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unlocked_achievements text;

-- Fix missing tables
CREATE TABLE IF NOT EXISTS game_plays (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  played_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_game_plays_user_id ON game_plays(user_id);

CREATE TABLE IF NOT EXISTS scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration smallint NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  days text NOT NULL DEFAULT '[]',
  initial_prices text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_scenarios_status ON scenarios(status);
