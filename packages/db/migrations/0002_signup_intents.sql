-- Anonymous onboarding intents — captured before auth lands.
-- The Better Auth PR claims these into real tenants.

CREATE TABLE `signup_intents` (
  `id` text PRIMARY KEY NOT NULL,
  `email` text NOT NULL,
  `subdomain` text NOT NULL,
  `restaurant_name` text NOT NULL,
  `wizard_json` text NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  `claimed_at` integer
);
CREATE UNIQUE INDEX `signup_intents_subdomain_idx` ON `signup_intents` (`subdomain`);
CREATE INDEX `signup_intents_email_idx` ON `signup_intents` (`email`);
CREATE INDEX `signup_intents_status_idx` ON `signup_intents` (`status`);
