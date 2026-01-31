import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  smallint,
  decimal,
  timestamp,
  bigint,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'

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
// game_plays (NEW — retention tracking)
// ============================================
export const gamePlays = pgTable('game_plays', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  playedAt: timestamp('played_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_game_plays_user_id').on(table.userId),
])
