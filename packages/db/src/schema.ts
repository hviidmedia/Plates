import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
};

// ─── Tenants ─────────────────────────────────────────────────────────────────

export const tenants = sqliteTable(
  "tenants",
  {
    id: text("id").primaryKey(),
    subdomain: text("subdomain").notNull(),
    name: text("name").notNull(),
    brandColor: text("brand_color"),
    logoUrl: text("logo_url"),
    defaultCurrency: text("default_currency").notNull().default("EUR"),
    defaultLocale: text("default_locale").notNull().default("da"),
    googlePlaceId: text("google_place_id"),
    ...timestamps,
  },
  (t) => ({
    subdomainIdx: uniqueIndex("tenants_subdomain_idx").on(t.subdomain),
  }),
);

// ─── Locations (multi-location per tenant) ───────────────────────────────────

export const locations = sqliteTable(
  "locations",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    addressLine1: text("address_line1").notNull(),
    addressLine2: text("address_line2"),
    city: text("city").notNull(),
    postalCode: text("postal_code").notNull(),
    country: text("country").notNull(),
    lat: real("lat"),
    lng: real("lng"),
    phone: text("phone"),
    email: text("email"),
    timezone: text("timezone").notNull(),
    googlePlaceId: text("google_place_id"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    ...timestamps,
  },
  (t) => ({
    tenantIdx: index("locations_tenant_idx").on(t.tenantId),
    tenantSlugIdx: uniqueIndex("locations_tenant_slug_idx").on(
      t.tenantId,
      t.slug,
    ),
  }),
);

export const openingHours = sqliteTable(
  "opening_hours",
  {
    id: text("id").primaryKey(),
    locationId: text("location_id")
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday … 6 = Saturday
    openMinutes: integer("open_minutes").notNull(), // minutes from midnight
    closeMinutes: integer("close_minutes").notNull(),
  },
  (t) => ({
    locationIdx: index("opening_hours_location_idx").on(t.locationId),
  }),
);

// ─── Users (owners + staff) ──────────────────────────────────────────────────

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    name: text("name"),
    role: text("role", { enum: ["owner", "manager", "staff"] }).notNull(),
    createdAt: timestamps.createdAt,
  },
  (t) => ({
    tenantIdx: index("users_tenant_idx").on(t.tenantId),
    tenantEmailIdx: uniqueIndex("users_tenant_email_idx").on(
      t.tenantId,
      t.email,
    ),
  }),
);

// ─── Customers (end-customers ordering food) ─────────────────────────────────

export const customers = sqliteTable(
  "customers",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    email: text("email"),
    phone: text("phone"),
    name: text("name"),
    marketingConsent: integer("marketing_consent", { mode: "boolean" })
      .notNull()
      .default(false),
    marketingConsentAt: integer("marketing_consent_at", {
      mode: "timestamp_ms",
    }),
    totalOrders: integer("total_orders").notNull().default(0),
    totalSpentCents: integer("total_spent_cents").notNull().default(0),
    firstOrderAt: integer("first_order_at", { mode: "timestamp_ms" }),
    lastOrderAt: integer("last_order_at", { mode: "timestamp_ms" }),
    ...timestamps,
  },
  (t) => ({
    tenantIdx: index("customers_tenant_idx").on(t.tenantId),
    tenantEmailIdx: index("customers_tenant_email_idx").on(t.tenantId, t.email),
    tenantPhoneIdx: index("customers_tenant_phone_idx").on(t.tenantId, t.phone),
  }),
);

// ─── Menu: categories, items, modifiers ──────────────────────────────────────

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    locationId: text("location_id").references(() => locations.id, {
      onDelete: "cascade",
    }), // NULL = brand-wide
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    position: integer("position").notNull().default(0),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: timestamps.createdAt,
  },
  (t) => ({
    tenantIdx: index("categories_tenant_idx").on(t.tenantId),
    locationIdx: index("categories_location_idx").on(t.locationId),
  }),
);

export const menuItems = sqliteTable(
  "menu_items",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    priceCents: integer("price_cents").notNull(),
    currency: text("currency").notNull().default("EUR"),
    imageUrl: text("image_url"),
    available: integer("available", { mode: "boolean" })
      .notNull()
      .default(true),
    position: integer("position").notNull().default(0),

    // AI-populated columns (filled by the AI generation PR)
    aiDescription: text("ai_description"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),

    ...timestamps,
  },
  (t) => ({
    tenantIdx: index("menu_items_tenant_idx").on(t.tenantId),
    categoryIdx: index("menu_items_category_idx").on(t.categoryId),
    categorySlugIdx: uniqueIndex("menu_items_category_slug_idx").on(
      t.categoryId,
      t.slug,
    ),
  }),
);

export const modifierGroups = sqliteTable(
  "modifier_groups",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    minSelect: integer("min_select").notNull().default(0),
    maxSelect: integer("max_select").notNull().default(1),
    isRequired: integer("is_required", { mode: "boolean" })
      .notNull()
      .default(false),
  },
  (t) => ({
    tenantIdx: index("modifier_groups_tenant_idx").on(t.tenantId),
  }),
);

export const modifiers = sqliteTable(
  "modifiers",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    groupId: text("group_id")
      .notNull()
      .references(() => modifierGroups.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    priceDeltaCents: integer("price_delta_cents").notNull().default(0),
    position: integer("position").notNull().default(0),
  },
  (t) => ({
    tenantIdx: index("modifiers_tenant_idx").on(t.tenantId),
    groupIdx: index("modifiers_group_idx").on(t.groupId),
  }),
);

export const menuItemModifierGroups = sqliteTable(
  "menu_item_modifier_groups",
  {
    menuItemId: text("menu_item_id")
      .notNull()
      .references(() => menuItems.id, { onDelete: "cascade" }),
    modifierGroupId: text("modifier_group_id")
      .notNull()
      .references(() => modifierGroups.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.menuItemId, t.modifierGroupId] }),
  }),
);

// ─── Orders ──────────────────────────────────────────────────────────────────

export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    locationId: text("location_id")
      .notNull()
      .references(() => locations.id),
    customerId: text("customer_id").references(() => customers.id),

    // Snapshot fields — populated even for guest checkout
    customerEmail: text("customer_email"),
    customerPhone: text("customer_phone"),
    customerName: text("customer_name"),

    fulfillmentType: text("fulfillment_type", {
      enum: ["pickup", "delivery"],
    }).notNull(),
    scheduledFor: integer("scheduled_for", { mode: "timestamp_ms" }), // NULL = ASAP
    deliveryAddress: text("delivery_address"),

    subtotalCents: integer("subtotal_cents").notNull(),
    taxCents: integer("tax_cents").notNull().default(0),
    deliveryFeeCents: integer("delivery_fee_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    currency: text("currency").notNull(),

    status: text("status", {
      enum: [
        "pending",
        "paid",
        "preparing",
        "ready",
        "completed",
        "cancelled",
      ],
    })
      .notNull()
      .default("pending"),

    paymentMethod: text("payment_method", {
      enum: ["mobilepay", "stripe", "cash"],
    }),
    paymentIntentId: text("payment_intent_id"),

    notes: text("notes"),
    ...timestamps,
  },
  (t) => ({
    tenantIdx: index("orders_tenant_idx").on(t.tenantId),
    tenantStatusIdx: index("orders_tenant_status_idx").on(
      t.tenantId,
      t.status,
    ),
    locationIdx: index("orders_location_idx").on(t.locationId),
    customerIdx: index("orders_customer_idx").on(t.customerId),
    createdAtIdx: index("orders_created_at_idx").on(t.createdAt),
  }),
);

export const orderItems = sqliteTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    menuItemId: text("menu_item_id").notNull(), // intentional: no FK so items can be deleted
    nameSnapshot: text("name_snapshot").notNull(),
    unitPriceCents: integer("unit_price_cents").notNull(),
    quantity: integer("quantity").notNull(),
    modifiersJson: text("modifiers_json"), // JSON-encoded selected modifiers
    notes: text("notes"),
  },
  (t) => ({
    orderIdx: index("order_items_order_idx").on(t.orderId),
  }),
);

// ─── Content pages: story, about, custom ─────────────────────────────────────

export const contentPages = sqliteTable(
  "content_pages",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    bodyMd: text("body_md"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    isPublished: integer("is_published", { mode: "boolean" })
      .notNull()
      .default(false),
    aiGenerated: integer("ai_generated", { mode: "boolean" })
      .notNull()
      .default(false),
    ...timestamps,
  },
  (t) => ({
    tenantSlugIdx: uniqueIndex("content_pages_tenant_slug_idx").on(
      t.tenantId,
      t.slug,
    ),
  }),
);

// ─── Local SEO landing pages: /places/[hood] ─────────────────────────────────

export const localSeoPages = sqliteTable(
  "local_seo_pages",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    locationId: text("location_id").references(() => locations.id, {
      onDelete: "cascade",
    }),
    slug: text("slug").notNull(),
    areaName: text("area_name").notNull(),
    title: text("title").notNull(),
    bodyMd: text("body_md"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    isPublished: integer("is_published", { mode: "boolean" })
      .notNull()
      .default(false),
    aiGenerated: integer("ai_generated", { mode: "boolean" })
      .notNull()
      .default(false),
    ...timestamps,
  },
  (t) => ({
    tenantSlugIdx: uniqueIndex("local_seo_pages_tenant_slug_idx").on(
      t.tenantId,
      t.slug,
    ),
    locationIdx: index("local_seo_pages_location_idx").on(t.locationId),
  }),
);

// ─── Tags: /tags/[tag] for menu-item SEO ─────────────────────────────────────

export const tags = sqliteTable(
  "tags",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
  },
  (t) => ({
    tenantSlugIdx: uniqueIndex("tags_tenant_slug_idx").on(t.tenantId, t.slug),
  }),
);

export const menuItemTags = sqliteTable(
  "menu_item_tags",
  {
    menuItemId: text("menu_item_id")
      .notNull()
      .references(() => menuItems.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.menuItemId, t.tagId] }),
  }),
);

// ─── Reviews (Google + internal) ─────────────────────────────────────────────

export const reviews = sqliteTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    locationId: text("location_id")
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    source: text("source", {
      enum: ["google", "internal", "tripadvisor"],
    }).notNull(),
    externalId: text("external_id"),
    customerId: text("customer_id").references(() => customers.id),
    rating: integer("rating").notNull(), // 1–5
    title: text("title"),
    body: text("body"),
    authorName: text("author_name"),
    reply: text("reply"),
    replyAt: integer("reply_at", { mode: "timestamp_ms" }),
    postedAt: integer("posted_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: timestamps.createdAt,
  },
  (t) => ({
    tenantIdx: index("reviews_tenant_idx").on(t.tenantId),
    locationPostedIdx: index("reviews_location_posted_idx").on(
      t.locationId,
      t.postedAt,
    ),
    sourceExternalIdx: uniqueIndex("reviews_source_external_idx").on(
      t.source,
      t.externalId,
    ),
  }),
);

// ─── Type exports ────────────────────────────────────────────────────────────

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Review = typeof reviews.$inferSelect;
