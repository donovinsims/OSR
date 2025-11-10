CREATE TABLE `agent_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agent_id` integer NOT NULL,
	`label` text NOT NULL,
	`url` text NOT NULL,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `agent_metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agent_id` integer NOT NULL,
	`date` text NOT NULL,
	`visits` integer DEFAULT 0,
	`downloads` integer DEFAULT 0,
	`shares` integer DEFAULT 0,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `agent_metrics_agent_date_idx` ON `agent_metrics` (`agent_id`,`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `agent_metrics_agent_date_unique` ON `agent_metrics` (`agent_id`,`date`);--> statement-breakpoint
CREATE TABLE `agent_tags` (
	`agent_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`agent_id`, `tag_id`),
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `agent_tags_tag_idx` ON `agent_tags` (`tag_id`);--> statement-breakpoint
CREATE INDEX `agent_tags_agent_idx` ON `agent_tags` (`agent_id`);--> statement-breakpoint
CREATE TABLE `agents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`category_id` integer,
	`features` text,
	`website_url` text,
	`repo_url` text,
	`demo_url` text,
	`image_url` text,
	`creator_name` text,
	`status` text DEFAULT 'approved' NOT NULL,
	`featured` integer DEFAULT false,
	`trending` integer DEFAULT false,
	`verified` integer DEFAULT false,
	`average_rating` real DEFAULT 0,
	`ratings_count` integer DEFAULT 0,
	`upvotes_count` integer DEFAULT 0,
	`comments_count` integer DEFAULT 0,
	`downloads_count` integer DEFAULT 0,
	`shares_count` integer DEFAULT 0,
	`visits_count` integer DEFAULT 0,
	`created_by` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agents_slug_unique` ON `agents` (`slug`);--> statement-breakpoint
CREATE INDEX `agents_name_idx` ON `agents` (`name`);--> statement-breakpoint
CREATE INDEX `agents_slug_idx` ON `agents` (`slug`);--> statement-breakpoint
CREATE INDEX `agents_category_idx` ON `agents` (`category_id`);--> statement-breakpoint
CREATE INDEX `agents_trending_idx` ON `agents` (`trending`);--> statement-breakpoint
CREATE INDEX `agents_featured_idx` ON `agents` (`featured`);--> statement-breakpoint
CREATE INDEX `agents_verified_idx` ON `agents` (`verified`);--> statement-breakpoint
CREATE INDEX `agents_status_idx` ON `agents` (`status`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`icon` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE INDEX `categories_slug_idx` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agent_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`body` text NOT NULL,
	`parent_id` integer,
	`created_at` text NOT NULL,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `comments_agent_idx` ON `comments` (`agent_id`);--> statement-breakpoint
CREATE INDEX `comments_user_idx` ON `comments` (`user_id`);--> statement-breakpoint
CREATE INDEX `comments_parent_idx` ON `comments` (`parent_id`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agent_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`title` text,
	`body` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `reviews_agent_idx` ON `reviews` (`agent_id`);--> statement-breakpoint
CREATE INDEX `reviews_user_idx` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`agent_id` integer,
	`created_at` text NOT NULL,
	`reviewed_at` text,
	`reviewer_id` text,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `submissions_status_idx` ON `submissions` (`status`);--> statement-breakpoint
CREATE INDEX `submissions_user_idx` ON `submissions` (`user_id`);--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`source` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscribers_email_unique` ON `subscribers` (`email`);--> statement-breakpoint
CREATE INDEX `subscribers_email_idx` ON `subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_unique` ON `tags` (`slug`);--> statement-breakpoint
CREATE INDEX `tags_slug_idx` ON `tags` (`slug`);--> statement-breakpoint
CREATE TABLE `votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agent_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`value` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `votes_agent_idx` ON `votes` (`agent_id`);--> statement-breakpoint
CREATE INDEX `votes_user_idx` ON `votes` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `votes_agent_user_unique` ON `votes` (`agent_id`,`user_id`);