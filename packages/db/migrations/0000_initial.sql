-- Initial schema for Plates multi-tenant restaurant SaaS.
-- Generated to match packages/db/src/schema.ts.
-- Apply with: pnpm --filter @plates/db db:migrate:local

CREATE TABLE `tenants` (
  `id` text PRIMARY KEY NOT NULL,
  `subdomain` text NOT NULL,
  `name` text NOT NULL,
  `brand_color` text,
  `logo_url` text,
  `default_currency` text DEFAULT 'EUR' NOT NULL,
  `default_locale` text DEFAULT 'da' NOT NULL,
  `google_place_id` text,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
CREATE UNIQUE INDEX `tenants_subdomain_idx` ON `tenants` (`subdomain`);

CREATE TABLE `locations` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL,
  `slug` text NOT NULL,
  `name` text NOT NULL,
  `address_line1` text NOT NULL,
  `address_line2` text,
  `city` text NOT NULL,
  `postal_code` text NOT NULL,
  `country` text NOT NULL,
  `lat` real,
  `lng` real,
  `phone` text,
  `email` text,
  `timezone` text NOT NULL,
  `google_place_id` text,
  `is_active` integer DEFAULT 1 NOT NULL,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `locations_tenant_idx` ON `locations` (`tenant_id`);
CREATE UNIQUE INDEX `locations_tenant_slug_idx` ON `locations` (`tenant_id`,`slug`);

CREATE TABLE `opening_hours` (
  `id` text PRIMARY KEY NOT NULL,
  `location_id` text NOT NULL,
  `day_of_week` integer NOT NULL,
  `open_minutes` integer NOT NULL,
  `close_minutes` integer NOT NULL,
  FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `opening_hours_location_idx` ON `opening_hours` (`location_id`);

CREATE TABLE `users` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL,
  `email` text NOT NULL,
  `name` text,
  `role` text NOT NULL,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `users_tenant_idx` ON `users` (`tenant_id`);
CREATE UNIQUE INDEX `users_tenant_email_idx` ON `users` (`tenant_id`,`email`);

CREATE TABLE `customers` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL,
  `email` text,
  `phone` text,
  `name` text,
  `marketing_consent` integer DEFAULT 0 NOT NULL,
  `marketing_consent_at` integer,
  `total_orders` integer DEFAULT 0 NOT NULL,
  `total_spent_cents` integer DEFAULT 0 NOT NULL,
  `first_order_at` integer,
  `last_order_at` integer,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `customers_tenant_idx` ON `customers` (`tenant_id`);
CREATE INDEX `customers_tenant_email_idx` ON `customers` (`tenant_id`,`email`);
CREATE INDEX `customers_tenant_phone_idx` ON `customers` (`tenant_id`,`phone`);

CREATE TABLE `categories` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL,
  `location_id` text,
  `slug` text NOT NULL,
  `name` text NOT NULL,
  `description` text,
  `position` integer DEFAULT 0 NOT NULL,
  `is_active` integer DEFAULT 1 NOT NULL,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `categories_tenant_idx` ON `categories` (`tenant_id`);
CREATE INDEX `categories_location_idx` ON `categories` (`location_id`);

CREATE TABLE `menu_items` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL,
  `category_id` text NOT NULL,
  `slug` text NOT NULL,
  `name` text NOT NULL,
  `description` text,
  `price_cents` integer NOT NULL,
  `currency` text DEFAULT 'EUR' NOT NULL,
  `image_url` text,
  `available` integer DEFAULT 1 NOT NULL,
  `position` integer DEFAULT 0 NOT NULL,
  `ai_description` text,
  `seo_title` text,
  `seo_description` text,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `menu_items_tenant_idx` ON `menu_items` (`tenant_id`);
CREATE INDEX `menu_items_category_idx` ON `menu_items` (`category_id`);
CREATE UNIQUE INDEX `menu_items_category_slug_idx` ON `menu_items` (`category_id`,`slug`);

CREATE TABLE `modifier_groups` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL,
  `name` text NOT NULL,
  `min_select` integer DEFAULT 0 NOT NULL,
  `max_select` integer DEFAULT 1 NOT NULL,
  `is_required` integer DEFAULT 0 NOT NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `modifier_groups_tenant_idx` ON `modifier_groups` (`tenant_id`);

CREATE TABLE `modifiers` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL,
  `group_id` text NOT NULL,
  `name` text NOT NULL,
  `price_delta_cents` integer DEFAULT 0 NOT NULL,
  `position` integer DEFAULT 0 NOT NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`group_id`) REFERENCES `modifier_groups`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `modifiers_tenant_idx` ON `modifiers` (`tenant_id`);
CREATE INDEX `modifiers_group_idx` ON `modifiers` (`group_id`);

CREATE TABLE `menu_item_modifier_groups` (
  `menu_item_id` text NOT NULL,
  `modifier_group_id` text NOT NULL,
  PRIMARY KEY(`menu_item_id`, `modifier_group_id`),
  FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`modifier_group_id`) REFERENCES `modifier_groups`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE `orders` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL,
  `location_id` text NOT NULL,
  `customer_id` text,
  `customer_email` text,
  `customer_phone` text,
  `customer_name` text,
  `fulfillment_type` text NOT NULL,
  `scheduled_for` integer,
  `delivery_address` text,
  `subtotal_cents` integer NOT NULL,
  `tax_cents` integer DEFAULT 0 NOT NULL,
  `delivery_fee_cents` integer DEFAULT 0 NOT NULL,
  `total_cents` integer NOT NULL,
  `currency` text NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `payment_method` text,
  `payment_intent_id` text,
  `notes` text,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE INDEX `orders_tenant_idx` ON `orders` (`tenant_id`);
CREATE INDEX `orders_tenant_status_idx` ON `orders` (`tenant_id`,`status`);
CREATE INDEX `orders_location_idx` ON `orders` (`location_id`);
CREATE INDEX `orders_customer_idx` ON `orders` (`customer_id`);
CREATE INDEX `orders_created_at_idx` ON `orders` (`created_at`);

CREATE TABLE `order_items` (
  `id` text PRIMARY KEY NOT NULL,
  `order_id` text NOT NULL,
  `menu_item_id` text NOT NULL,
  `name_snapshot` text NOT NULL,
  `unit_price_cents` integer NOT NULL,
  `quantity` integer NOT NULL,
  `modifiers_json` text,
  `notes` text,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `order_items_order_idx` ON `order_items` (`order_id`);

CREATE TABLE `content_pages` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL,
  `slug` text NOT NULL,
  `title` text NOT NULL,
  `body_md` text,
  `seo_title` text,
  `seo_description` text,
  `is_published` integer DEFAULT 0 NOT NULL,
  `ai_generated` integer DEFAULT 0 NOT NULL,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX `content_pages_tenant_slug_idx` ON `content_pages` (`tenant_id`,`slug`);

CREATE TABLE `local_seo_pages` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL,
  `location_id` text,
  `slug` text NOT NULL,
  `area_name` text NOT NULL,
  `title` text NOT NULL,
  `body_md` text,
  `seo_title` text,
  `seo_description` text,
  `is_published` integer DEFAULT 0 NOT NULL,
  `ai_generated` integer DEFAULT 0 NOT NULL,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX `local_seo_pages_tenant_slug_idx` ON `local_seo_pages` (`tenant_id`,`slug`);
CREATE INDEX `local_seo_pages_location_idx` ON `local_seo_pages` (`location_id`);

CREATE TABLE `tags` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL,
  `slug` text NOT NULL,
  `name` text NOT NULL,
  `description` text,
  `seo_title` text,
  `seo_description` text,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX `tags_tenant_slug_idx` ON `tags` (`tenant_id`,`slug`);

CREATE TABLE `menu_item_tags` (
  `menu_item_id` text NOT NULL,
  `tag_id` text NOT NULL,
  PRIMARY KEY(`menu_item_id`, `tag_id`),
  FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE `reviews` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL,
  `location_id` text NOT NULL,
  `source` text NOT NULL,
  `external_id` text,
  `customer_id` text,
  `rating` integer NOT NULL,
  `title` text,
  `body` text,
  `author_name` text,
  `reply` text,
  `reply_at` integer,
  `posted_at` integer NOT NULL,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE INDEX `reviews_tenant_idx` ON `reviews` (`tenant_id`);
CREATE INDEX `reviews_location_posted_idx` ON `reviews` (`location_id`,`posted_at`);
CREATE UNIQUE INDEX `reviews_source_external_idx` ON `reviews` (`source`,`external_id`);
