-- Add unique constraint on stripe_subscription_id for upsert support
-- and indexes on frequently queried columns
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id
  ON subscriptions (stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id
  ON subscriptions (stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id
  ON subscriptions (user_id);
