CREATE TABLE `bookmarks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`agent_id` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `bookmarks_user_idx` ON `bookmarks` (`user_id`);--> statement-breakpoint
CREATE INDEX `bookmarks_agent_idx` ON `bookmarks` (`agent_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `bookmarks_user_agent_unique` ON `bookmarks` (`user_id`,`agent_id`);