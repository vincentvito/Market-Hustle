CREATE TABLE "guest_daily_plays" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "guest_daily_plays_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"ip" text NOT NULL,
	"played_date" text NOT NULL,
	"games_played" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" text PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"status" text DEFAULT 'received' NOT NULL,
	"payload" text NOT NULL,
	"error" text,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "tennis_match_events" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tennis_matches" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tennis_rankings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tennis_tournaments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "tennis_match_events" CASCADE;--> statement-breakpoint
DROP TABLE "tennis_matches" CASCADE;--> statement-breakpoint
DROP TABLE "tennis_rankings" CASCADE;--> statement-breakpoint
DROP TABLE "tennis_tournaments" CASCADE;--> statement-breakpoint
ALTER TABLE "trade_logs" ALTER COLUMN "quantity" SET DATA TYPE numeric(20, 6);--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "stripe_payment_intent_id" text;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_guest_daily_plays_ip_date" ON "guest_daily_plays" USING btree ("ip","played_date");--> statement-breakpoint
CREATE INDEX "idx_guest_daily_plays_date" ON "guest_daily_plays" USING btree ("played_date");--> statement-breakpoint
CREATE INDEX "idx_webhook_events_event_type" ON "webhook_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_webhook_events_status" ON "webhook_events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_webhook_events_created_at" ON "webhook_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_subscriptions_stripe_customer_id" ON "subscriptions" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "idx_subscriptions_user_id" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "stripe_subscription_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "current_period_end";--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id");