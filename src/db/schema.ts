import { sqliteTable, integer, text, real, index, unique, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Categories table
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => ({
  slugIdx: index('categories_slug_idx').on(table.slug),
}));

// Tags table
export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: text('created_at').notNull(),
}, (table) => ({
  slugIdx: index('tags_slug_idx').on(table.slug),
}));

// Agents table
export const agents = sqliteTable('agents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  categoryId: integer('category_id').references(() => categories.id),
  features: text('features'),
  websiteUrl: text('website_url'),
  repoUrl: text('repo_url'),
  demoUrl: text('demo_url'),
  imageUrl: text('image_url'),
  creatorName: text('creator_name'),
  status: text('status').notNull().default('approved'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  trending: integer('trending', { mode: 'boolean' }).default(false),
  verified: integer('verified', { mode: 'boolean' }).default(false),
  averageRating: real('average_rating').default(0),
  ratingsCount: integer('ratings_count').default(0),
  upvotesCount: integer('upvotes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  downloadsCount: integer('downloads_count').default(0),
  sharesCount: integer('shares_count').default(0),
  visitsCount: integer('visits_count').default(0),
  createdBy: text('created_by'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => ({
  nameIdx: index('agents_name_idx').on(table.name),
  slugIdx: index('agents_slug_idx').on(table.slug),
  categoryIdx: index('agents_category_idx').on(table.categoryId),
  trendingIdx: index('agents_trending_idx').on(table.trending),
  featuredIdx: index('agents_featured_idx').on(table.featured),
  verifiedIdx: index('agents_verified_idx').on(table.verified),
  statusIdx: index('agents_status_idx').on(table.status),
}));

// Agent tags junction table
export const agentTags = sqliteTable('agent_tags', {
  agentId: integer('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.agentId, table.tagId] }),
  tagIdx: index('agent_tags_tag_idx').on(table.tagId),
  agentIdx: index('agent_tags_agent_idx').on(table.agentId),
}));

// Agent links table
export const agentLinks = sqliteTable('agent_links', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  agentId: integer('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  url: text('url').notNull(),
});

// Reviews table
export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  agentId: integer('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  rating: integer('rating').notNull(),
  title: text('title'),
  body: text('body'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => ({
  agentIdx: index('reviews_agent_idx').on(table.agentId),
  userIdx: index('reviews_user_idx').on(table.userId),
}));

// Comments table
export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  agentId: integer('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  body: text('body').notNull(),
  parentId: integer('parent_id').references(() => comments.id),
  createdAt: text('created_at').notNull(),
}, (table) => ({
  agentIdx: index('comments_agent_idx').on(table.agentId),
  userIdx: index('comments_user_idx').on(table.userId),
  parentIdx: index('comments_parent_idx').on(table.parentId),
}));

// Votes table (upvotes only)
export const votes = sqliteTable('votes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  agentId: integer('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  value: integer('value').notNull().default(1),
  createdAt: text('created_at').notNull(),
}, (table) => ({
  agentIdx: index('votes_agent_idx').on(table.agentId),
  userIdx: index('votes_user_idx').on(table.userId),
  uniqueVote: unique('votes_agent_user_unique').on(table.agentId, table.userId),
}));

// Submissions table
export const submissions = sqliteTable('submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  payload: text('payload', { mode: 'json' }).notNull(),
  status: text('status').notNull().default('pending'),
  agentId: integer('agent_id').references(() => agents.id),
  createdAt: text('created_at').notNull(),
  reviewedAt: text('reviewed_at'),
  reviewerId: text('reviewer_id'),
}, (table) => ({
  statusIdx: index('submissions_status_idx').on(table.status),
  userIdx: index('submissions_user_idx').on(table.userId),
}));

// Subscribers table
export const subscribers = sqliteTable('subscribers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  source: text('source'),
  createdAt: text('created_at').notNull(),
}, (table) => ({
  emailIdx: index('subscribers_email_idx').on(table.email),
}));

// Agent metrics table
export const agentMetrics = sqliteTable('agent_metrics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  agentId: integer('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  visits: integer('visits').default(0),
  downloads: integer('downloads').default(0),
  shares: integer('shares').default(0),
}, (table) => ({
  agentDateIdx: index('agent_metrics_agent_date_idx').on(table.agentId, table.date),
  uniqueMetric: unique('agent_metrics_agent_date_unique').on(table.agentId, table.date),
}));

// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Add bookmarks table at the end
export const bookmarks = sqliteTable('bookmarks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  agentId: integer('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').notNull(),
}, (table) => ({
  userIdx: index('bookmarks_user_idx').on(table.userId),
  agentIdx: index('bookmarks_agent_idx').on(table.agentId),
  uniqueBookmark: unique('bookmarks_user_agent_unique').on(table.userId, table.agentId),
}));