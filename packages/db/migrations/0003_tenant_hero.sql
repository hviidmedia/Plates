-- Add hero/branding columns to tenants for Owner-style tenant pages.
ALTER TABLE tenants ADD COLUMN hero_image_url TEXT;
--> statement-breakpoint
ALTER TABLE tenants ADD COLUMN hero_video_url TEXT;
--> statement-breakpoint
ALTER TABLE tenants ADD COLUMN tagline TEXT;
--> statement-breakpoint
ALTER TABLE tenants ADD COLUMN hero_headline TEXT;
