-- Convert from recurring subscriptions to one-time lifetime purchase

-- Rename column (skip if already renamed)
DO $$ BEGIN
  ALTER TABLE subscriptions RENAME COLUMN stripe_subscription_id TO stripe_payment_intent_id;
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

ALTER TABLE subscriptions DROP COLUMN IF EXISTS current_period_end;

-- Drop old CHECK constraint that only allowed 'monthly'/'yearly'
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;

-- Add new CHECK constraint that includes 'lifetime'
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_check
  CHECK (plan IN ('monthly', 'yearly', 'lifetime'));
