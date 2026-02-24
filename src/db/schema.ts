import {
  pgTable,
  pgSchema,
  uuid,
  text,
  boolean,
  integer,
  smallint,
  decimal,
  numeric,
  timestamp,
  bigint,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'

const authSchema = pgSchema('auth')

export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
  email: text('email'),
})

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  username: text('username').unique(),
  tier: text('tier').notNull().default('free'),
  totalGamesPlayed: integer('total_games_played').notNull().default(0),
  totalEarnings: integer('total_earnings').notNull().default(0),
  bestNetWorth: integer('best_net_worth').notNull().default(0),
  winCount: integer('win_count').notNull().default(0),
  winStreak: integer('win_streak').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  gamesPlayedToday: integer('games_played_today').notNull().default(0),
  lastPlayedDate: text('last_played_date'),

  selectedTheme: text('selected_theme'),
  selectedDuration: integer('selected_duration'),
  unlockedAchievements: text('unlocked_achievements'),
  isAdmin: boolean('is_admin').notNull().default(false),
})

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  stripeCustomerId: text('stripe_customer_id'),
  stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
  status: text('status'),
  plan: text('plan'),
}, (table) => [
  index('idx_subscriptions_stripe_customer_id').on(table.stripeCustomerId),
  index('idx_subscriptions_user_id').on(table.userId),
])

export const webhookEvents = pgTable('webhook_events', {
  id: text('id').primaryKey(), // Stripe event ID (evt_xxx)
  eventType: text('event_type').notNull(),
  status: text('status').notNull().default('received'), // received | processed | failed
  payload: text('payload').notNull(),
  error: text('error'),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_webhook_events_event_type').on(table.eventType),
  index('idx_webhook_events_status').on(table.status),
  index('idx_webhook_events_created_at').on(table.createdAt),
])

export const gameResults = pgTable('game_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  username: text('username'),
  gameId: text('game_id').notNull(),
  duration: smallint('duration').notNull(),
  finalNetWorth: integer('final_net_worth').notNull(),
  profitPercent: decimal('profit_percent', { precision: 10, scale: 2 }).notNull(),
  daysSurvived: smallint('days_survived').notNull(),
  outcome: text('outcome').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_game_results_user_id').on(table.userId),
  index('idx_game_results_created_at').on(table.createdAt),
  index('idx_game_results_username').on(table.username),
  uniqueIndex('idx_game_results_unique_game').on(table.username, table.gameId),
])


export const tradeLogs = pgTable('trade_logs', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  username: text('username').notNull(),
  gameId: text('game_id').notNull(),
  assetId: text('asset_id').notNull(),
  assetName: text('asset_name').notNull(),
  action: text('action').notNull(), // buy, sell, short_sell, cover_short, leverage_buy, leverage_close, buy_property, sell_property, buy_pe, sell_pe, pe_exit
  category: text('category').notNull(), // stock, property, private_equity
  quantity: numeric('quantity', { precision: 20, scale: 6 }),
  price: numeric('price', { precision: 20, scale: 2 }),
  totalValue: numeric('total_value', { precision: 20, scale: 2 }),
  leverage: smallint('leverage'),
  profitLoss: numeric('profit_loss', { precision: 20, scale: 2 }),
  day: smallint('day').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_trade_logs_username').on(table.username),
  index('idx_trade_logs_game_id').on(table.gameId),
  index('idx_trade_logs_asset_id').on(table.assetId),
  index('idx_trade_logs_action').on(table.action),
  index('idx_trade_logs_category').on(table.category),
])

export const gamePlays = pgTable('game_plays', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  playedAt: timestamp('played_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_game_plays_user_id').on(table.userId),
])

export const scenarios = pgTable('scenarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  duration: smallint('duration').notNull(),
  status: text('status').notNull().default('draft'),
  days: text('days').notNull().default('[]'),
  initialPrices: text('initial_prices'),
  createdBy: uuid('created_by').references(() => profiles.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_scenarios_status').on(table.status),
])

export const guestDailyPlays = pgTable('guest_daily_plays', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  ip: text('ip').notNull(),
  playedDate: text('played_date').notNull(), // 'YYYY-MM-DD'
  gamesPlayed: integer('games_played').notNull().default(1),
}, (table) => [
  uniqueIndex('idx_guest_daily_plays_ip_date').on(table.ip, table.playedDate),
  index('idx_guest_daily_plays_date').on(table.playedDate),
])

export const rooms = pgTable('rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  hostId: uuid('host_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('lobby'), // lobby | playing | finished
  scenarioData: text('scenario_data'), // JSON of ScriptedGameDefinition
  gameDuration: smallint('game_duration').notNull().default(30),
  maxPlayers: smallint('max_players').notNull().default(8),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
}, (table) => [
  index('idx_rooms_code').on(table.code),
  index('idx_rooms_status').on(table.status),
  index('idx_rooms_host_id').on(table.hostId),
])

export const roomPlayers = pgTable('room_players', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  username: text('username').notNull(),
  isHost: boolean('is_host').notNull().default(false),
  isReady: boolean('is_ready').notNull().default(false),
  currentDay: smallint('current_day').notNull().default(0),
  currentNetWorth: integer('current_net_worth').notNull().default(50000),
  status: text('status').notNull().default('joined'), // joined | playing | finished | left
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  uniqueIndex('idx_room_players_unique').on(table.roomId, table.userId),
  index('idx_room_players_room_id').on(table.roomId),
])

export const roomResults = pgTable('room_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  username: text('username').notNull(),
  finalNetWorth: integer('final_net_worth').notNull(),
  profitPercent: decimal('profit_percent', { precision: 10, scale: 2 }).notNull(),
  daysSurvived: smallint('days_survived').notNull(),
  outcome: text('outcome').notNull(), // win | bankrupt | margin_called | etc.
  rank: smallint('rank'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  uniqueIndex('idx_room_results_unique').on(table.roomId, table.userId),
  index('idx_room_results_room_id').on(table.roomId),
])
