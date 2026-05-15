-- Cart tables — pre-checkout state, garbage-collected via expires_at.

CREATE TABLE `carts` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL,
  `location_id` text,
  `customer_email` text,
  `fulfillment_type` text DEFAULT 'pickup' NOT NULL,
  `scheduled_for` integer,
  `delivery_address` text,
  `expires_at` integer NOT NULL,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE INDEX `carts_tenant_idx` ON `carts` (`tenant_id`);
CREATE INDEX `carts_expires_idx` ON `carts` (`expires_at`);

CREATE TABLE `cart_items` (
  `id` text PRIMARY KEY NOT NULL,
  `cart_id` text NOT NULL,
  `menu_item_id` text NOT NULL,
  `quantity` integer DEFAULT 1 NOT NULL,
  `modifiers_json` text,
  `name_snapshot` text NOT NULL,
  `unit_price_cents` integer NOT NULL,
  `notes` text,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `cart_items_cart_idx` ON `cart_items` (`cart_id`);
