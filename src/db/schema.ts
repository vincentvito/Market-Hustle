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

// ============================================
// auth.users (Supabase auth schema, read-only)
// ============================================
const authSchema = pgSchema('auth')

export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
  email: text('email'),
})

// ============================================
// profiles
// ============================================
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
  proTrialGamesUsed: integer('pro_trial_games_used').notNull().default(0),
  selectedTheme: text('selected_theme'),
  selectedDuration: integer('selected_duration'),
  unlockedAchievements: text('unlocked_achievements'),
  isAdmin: boolean('is_admin').notNull().default(false),
})

// ============================================
// subscriptions
// ============================================
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  status: text('status'),
  plan: text('plan'),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
})

// ============================================
// game_results
// ============================================
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

// ============================================
// pro_trials
// ============================================
export const proTrials = pgTable('pro_trials', {
  userId: uuid('user_id').primaryKey().references(() => profiles.id, { onDelete: 'cascade' }),
  gamesUsed: integer('games_used').notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

// ============================================
// trade_logs (analytics — all in-game trades)
// ============================================
export const tradeLogs = pgTable('trade_logs', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  username: text('username').notNull(),
  gameId: text('game_id').notNull(),
  assetId: text('asset_id').notNull(),
  assetName: text('asset_name').notNull(),
  action: text('action').notNull(), // buy, sell, short_sell, cover_short, leverage_buy, leverage_close, buy_property, sell_property, buy_pe, sell_pe, pe_exit
  category: text('category').notNull(), // stock, property, private_equity
  quantity: integer('quantity'),
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

// ============================================
// game_plays (NEW — retention tracking)
// ============================================
export const gamePlays = pgTable('game_plays', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  playedAt: timestamp('played_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_game_plays_user_id').on(table.userId),
])

// ============================================
// scenarios (admin-authored game scenarios)
// ============================================
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

// ============================================
// tennis_matches (PvE + PvP match results)
// ============================================
export const tennisMatches = pgTable('tennis_matches', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  mode: text('mode').notNull(),
  difficulty: text('difficulty').notNull(),
  opponentName: text('opponent_name').notNull(),
  winner: text('winner').notNull(),
  loser: text('loser').notNull(),
  scoreline: text('scoreline').notNull(),
  durationSeconds: integer('duration_seconds').notNull().default(0),
  stats: text('stats'),
  tournamentId: uuid('tournament_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_tennis_matches_user_id').on(table.userId),
  index('idx_tennis_matches_created_at').on(table.createdAt),
  index('idx_tennis_matches_mode').on(table.mode),
  index('idx_tennis_matches_tournament_id').on(table.tournamentId),
])

// ============================================
// tennis_tournaments (save/resume bracket state)
// ============================================
export const tennisTournaments = pgTable('tennis_tournaments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('in_progress'),
  state: text('state').notNull().default('{}'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_tennis_tournaments_user_id').on(table.userId),
  index('idx_tennis_tournaments_status').on(table.status),
  index('idx_tennis_tournaments_updated_at').on(table.updatedAt),
])

// ============================================
// tennis_match_events (optional replay telemetry)
// ============================================
export const tennisMatchEvents = pgTable('tennis_match_events', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  matchId: uuid('match_id').notNull().references(() => tennisMatches.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  eventType: text('event_type').notNull(),
  eventPayload: text('event_payload'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_tennis_match_events_match_id').on(table.matchId),
  index('idx_tennis_match_events_created_at').on(table.createdAt),
])

// ============================================
// tennis_rankings (PvE/PvP leaderboard)
// ============================================
export const tennisRankings = pgTable('tennis_rankings', {
  userId: uuid('user_id').primaryKey().references(() => profiles.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull().default(1200),
  matchesPlayed: integer('matches_played').notNull().default(0),
  wins: integer('wins').notNull().default(0),
  losses: integer('losses').notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_tennis_rankings_rating').on(table.rating),
])
