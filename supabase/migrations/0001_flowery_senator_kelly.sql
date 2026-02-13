CREATE TABLE IF NOT EXISTS "trade_logs" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trade_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"username" text NOT NULL,
	"game_id" text NOT NULL,
	"asset_id" text NOT NULL,
	"asset_name" text NOT NULL,
	"action" text NOT NULL,
	"category" text NOT NULL,
	"quantity" integer,
	"price" numeric(20, 2),
	"total_value" numeric(20, 2),
	"leverage" smallint,
	"profit_loss" numeric(20, 2),
	"day" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_trade_logs_username" ON "trade_logs" USING btree ("username");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_trade_logs_game_id" ON "trade_logs" USING btree ("game_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_trade_logs_asset_id" ON "trade_logs" USING btree ("asset_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_trade_logs_action" ON "trade_logs" USING btree ("action");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_trade_logs_category" ON "trade_logs" USING btree ("category");
