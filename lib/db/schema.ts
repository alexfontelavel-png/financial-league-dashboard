import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
  doublePrecision,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Global stock catalog. Shared across all users (not user-scoped).
export const stocks = pgTable('stocks', {
  ticker: text('ticker').primaryKey(),
  name: text('name').notNull(),
  price: doublePrecision('price').notNull(),
  changePct: doublePrecision('changePct').notNull().default(0),
  color: text('color').notNull().default('#6c5ce7'),
})

// One fantasy account per user. cash = buying power, startingEquity used for ROI.
export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  cash: doublePrecision('cash').notNull(),
  startingEquity: doublePrecision('startingEquity').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Per-user stock holdings.
export const holdings = pgTable('holdings', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  ticker: text('ticker').notNull(),
  shares: integer('shares').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Per-user trade history.
export const trades = pgTable('trades', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  ticker: text('ticker').notNull(),
  side: text('side').notNull(), // 'buy' | 'sell'
  shares: integer('shares').notNull(),
  price: doublePrecision('price').notNull(),
  total: doublePrecision('total').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Per-user monthly P&L history powering the bar chart + equity sparkline.
export const monthlyPnl = pgTable('monthly_pnl', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  monthIdx: integer('monthIdx').notNull(),
  label: text('label').notNull(),
  value: doublePrecision('value').notNull(),
})

// Seeded demo competitors so the leaderboard is populated.
export const leagueBots = pgTable('league_bots', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  handle: text('handle').notNull(),
  value: doublePrecision('value').notNull(),
  roi: doublePrecision('roi').notNull(),
})
