# Plates — Engineering Notes

> Multi-tenant SaaS for independent EU restaurants. Direct ordering, AI-generated SEO sites, GDPR-native, runs entirely on Cloudflare. Positioning: **Europe's answer to Owner.com.**

This file is the source of truth for new contributors and Claude Code sessions. Keep it current — when conventions change, update this first.

---

## 1. Mission

Build the platform an EU restaurant signs up for to:

- Own a branded website with **AI-generated local SEO landing pages** (`/places/[hood]`) that rank in local Google search.
- Take **direct orders** (pickup, delivery, scheduled) without paying 30% to Wolt/UberEats.
- Centralise menu, orders, customers, marketing, reviews in one place.
- Stay **GDPR-compliant by default** (EU data residency, explicit consent, DPA-ready).

Owner.com's lead magnet — *"You're losing sales online. Use AI to see what to fix"* — is a competitor-analysis tool. We will build the equivalent in the AI PR.

---

## 2. Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 App Router | Server components, edge-first, mature |
| Runtime | Cloudflare Workers via [OpenNext](https://opennext.js.org/cloudflare) | Single global runtime, no cold starts, $0 idle |
| Database | Cloudflare D1 (SQLite at the edge) | EU-resident (`weur` hint), zero ops |
| ORM | [Drizzle](https://orm.drizzle.team) | Type-safe, edge-compatible, no codegen step at runtime |
| Cache | Cloudflare KV | Sub-ms tenant lookup |
| Object storage | Cloudflare R2 | Original media, menu PDFs |
| Image CDN | Cloudflare Images *(planned)* | Auto-optimized variants (WebP/AVIF) for menu photos |
| Async jobs | Cloudflare Queues *(planned)* | Bulk AI generation, webhooks, emails |
| Vector search | Cloudflare Vectorize *(planned)* | Semantic menu search, RAG over restaurant data |
| Real-time | Cloudflare Durable Objects *(planned)* | Live order status, kitchen display |
| Auth | Better Auth *(planned)* | EU-friendly, no US tracking, runs on Workers + D1 |
| Email | Resend *(planned)* | EU presence, GDPR DPA available |
| AI — primary | **Claude Sonnet 4.6 / Haiku 4.5** via Anthropic API | SEO copy, place pages, menu descriptions |
| AI — light ops | **Workers AI** | Translations, embeddings, image alt-text |
| Payments | Stripe (EU) + MobilePay (DK) *(planned)* | Provider abstraction in `packages/payments` |
| UI | Tailwind v4 + shadcn/ui | Standard, fast iteration |
| Tooling | Turborepo + pnpm + Wrangler | Standard monorepo |

**Hard constraint:** every runtime dependency must work on the Workers runtime. No Node-only libraries, no native modules.

---

## 3. Repo Layout

```
plates/
├── apps/
│   └── web/                      # Next.js app — both tenant and marketing
│       ├── src/
│       │   ├── app/              # Routes
│       │   ├── lib/tenant.ts     # Tenant context helper
│       │   └── middleware.ts     # Subdomain → tenant resolution
│       ├── wrangler.jsonc        # CF bindings
│       ├── open-next.config.ts
│       └── next.config.ts
├── packages/
│   ├── db/                       # Drizzle schema + D1 client + migrations
│   │   ├── src/schema.ts         # Single source of truth for DB shape
│   │   ├── src/client.ts         # getDb(d1)
│   │   ├── src/ids.ts            # nanoid id generator with prefixes
│   │   └── migrations/           # SQL migrations applied via wrangler
│   └── ui/                       # Shared design tokens + future shadcn components
├── turbo.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

Active packages:

- `packages/ai` — Claude integration (Anthropic SDK), prompt templates, generators

Future packages (when needed, not now):

- `packages/payments` — Stripe + MobilePay abstraction
- `packages/email` — Resend templates
- `apps/admin` — restaurant owner dashboard (may live under `app.counter.app`)

---

## 4. Two Surfaces, One App

The same Next.js app serves two distinct surfaces, decided by middleware:

- **Marketing** (`counter.app`, `www.counter.app`) — Owner.com-style acquisition site for restaurants. Lives in `apps/web/src/components/marketing/`. Hero with audit-CTA (the lead magnet — wired to live AI in the AI PR), features, pricing, FAQ.
- **Tenant** (`{subdomain}.counter.app`) — the restaurant's customer-facing site. somosoaxaca.com-style menu + ordering. Currently a hello-world placeholder; full menu/order UI lands in the next UI PR.

Branch decision happens in `apps/web/src/app/page.tsx` based on whether middleware injected tenant headers.

## 5. Multi-Tenancy

**Pattern: subdomain-routed, explicit `tenant_id` everywhere.**

```
acme.counter.app          → tenant "acme"
acme.localhost:3000       → tenant "acme" (local dev, no /etc/hosts needed)
counter.app               → marketing site
www.counter.app           → marketing site
app.counter.app           → admin dashboard (future)
```

Resolution flow (`apps/web/src/middleware.ts`):

1. Parse `Host`, extract subdomain.
2. Skip if subdomain ∈ `RESERVED_SUBDOMAINS` (`www`, `app`, `admin`, `api`, …).
3. Look up `TENANT_CACHE` KV (60s TTL).
4. On miss → query D1 → write to KV.
5. Inject `x-tenant-id`, `x-tenant-subdomain`, `x-tenant-name` into request headers.
6. Server components read with `getTenant()` from `@/lib/tenant`.

**Isolation rule (D1 has no RLS):** every query against a tenant-owned table **must** include `WHERE tenant_id = ?`. Drizzle helpers in `packages/db` will (eventually) enforce this via a `tenantScoped(db, tenantId)` wrapper. For now: code review responsibility.

**Cache invalidation:** on tenant update (admin PR), delete `tenant:${subdomain}` from KV.

---

## 6. Database Conventions

- **IDs:** `text PRIMARY KEY`, generated with `ids.tenant()`, `ids.menuItem()`, etc. (prefix-based nanoids). Never use autoincrement.
- **Timestamps:** `created_at`, `updated_at` as `integer` (Unix ms). Default `(unixepoch() * 1000)`. Drizzle mode `timestamp_ms`.
- **Money:** `price_cents INTEGER` + `currency TEXT`. Never floating point.
- **Booleans:** `integer` with `mode: "boolean"` in Drizzle.
- **Indexes:** every `tenant_id` column gets an index. Query patterns get composite indexes (`tenant_id, status`, `tenant_id, slug`, etc.).
- **Cascades:** `ON DELETE CASCADE` from `tenants` down. Snapshot fields on `orders` / `order_items` so menu changes don't corrupt history.
- **AI fields:** `ai_description`, `seo_title`, `seo_description`, `ai_generated` are part of schema from day 1 — the AI PR fills them in, no migration needed.

### Adding a new table

1. Define in `packages/db/src/schema.ts`.
2. Add `tenant_id` FK + index unless explicitly tenant-agnostic (rare).
3. Run `pnpm --filter @plates/db db:generate` → review the generated SQL in `migrations/`.
4. Apply locally: `pnpm --filter @plates/db db:migrate:local`.
5. Apply remote: `pnpm --filter @plates/db db:migrate:remote`.

### Tables (current)

`tenants`, `locations`, `opening_hours`, `users`, `customers`, `categories`, `menu_items`, `modifier_groups`, `modifiers`, `menu_item_modifier_groups`, `orders`, `order_items`, `content_pages`, `local_seo_pages`, `tags`, `menu_item_tags`, `reviews`.

---

## 7. Dev Commands

```bash
# First-time setup
pnpm install
wrangler d1 create plates-db --location=weur          # paste id into wrangler.jsonc
wrangler kv namespace create TENANT_CACHE             # paste id into wrangler.jsonc
wrangler r2 bucket create plates-media

# Daily
pnpm dev                                              # next dev (port 3000, with .dev.vars)
pnpm --filter @plates/db db:generate                  # regenerate migrations from schema
pnpm --filter @plates/db db:migrate:local             # apply to local D1
pnpm typecheck                                        # whole monorepo
pnpm lint

# Cloudflare-flavoured
pnpm --filter @plates/web preview                     # opennextjs build + workerd preview
pnpm --filter @plates/web deploy                      # opennextjs build + wrangler deploy
pnpm --filter @plates/web cf-typegen                  # regenerate env.d.ts after wrangler.jsonc change
```

### Local multi-tenant testing

`*.localhost` resolves to `127.0.0.1` in Chrome and Safari — no `/etc/hosts` edits.

```
http://acme.localhost:3000     → tenant "acme"
http://localhost:3000          → marketing
```

Seed a tenant locally:

```bash
wrangler d1 execute plates-db --local --command "
  INSERT INTO tenants (id, subdomain, name, default_currency, default_locale)
  VALUES ('ten_demo', 'acme', 'Acme Bistro', 'EUR', 'da');
"
```

---

## 8. Cloudflare Bindings

Active (in `apps/web/wrangler.jsonc`):

| Binding | Type | Purpose |
|---|---|---|
| `DB` | D1 | Primary tenant database |
| `TENANT_CACHE` | KV | Subdomain → tenant lookup cache (60s TTL) |
| `MEDIA` | R2 | Original uploads, menu PDFs |
| `ASSETS` | Static assets | OpenNext static output |

Planned (commented in `wrangler.jsonc`, uncomment as features land):

| Binding | Adds |
|---|---|
| `IMAGES` | Cloudflare Images for restaurant photos |
| `AI` | Workers AI for translations / embeddings |
| `MENU_INDEX` | Vectorize for semantic menu search |
| `JOBS` | Queues for async generation + webhooks |
| `ORDER_ROOM` | Durable Object for live order status |

Secrets (`wrangler secret put NAME`):

`ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `MOBILEPAY_API_KEY`, `RESEND_API_KEY`, `BETTER_AUTH_SECRET`.

---

## 9. AI Layer (`packages/ai`)

Lives in `packages/ai`, depends on `@anthropic-ai/sdk`, runs on Workers via the SDK's `fetch` adapter.

**What's shipped:**

| Generator | Model | Use case |
|---|---|---|
| `generateMenuItemSeo` | `claude-haiku-4-5` | Bulk SEO copy: enriched description + `<title>` + meta. ~200 output tokens. |
| `generatePlacePage` | `claude-sonnet-4-6` | Local-SEO landing page for `/places/[slug]`. Adaptive thinking, ~600 output tokens. |

Both use **prompt caching** on the system prompt + restaurant context (`cache_control: {type: "ephemeral"}`). First call in a tenant batch pays the cache write (~1.25× input); follow-ups within 5 min pay ~0.1× for the cached prefix. Verify with `usage.cache_read_input_tokens` in the response.

**Server actions** in `apps/web/src/lib/ai-actions.ts`:
- `generateMenuItemSeoAction(menuItemId)` — populates `menu_items.ai_description`, `seo_title`, `seo_description`
- `generatePlacePageAction({slug, areaName, …})` — upserts a `local_seo_pages` row

Both are tenant-scoped via `getTenant()` and verify D1 ownership before any mutation. Not yet wired to a UI — admin in the auth+admin PR will add the trigger buttons.

**Public surface that ships:**
- `/places/[slug]` — renders published `local_seo_pages`. Tenant-only route (apex 404s).
- `<JsonLd>` component injects `Restaurant` schema on tenant home, `MenuItem` schema on menu detail. Lives in `apps/web/src/components/tenant/json-ld.tsx`.
- `app/sitemap.ts` — per-tenant sitemap with `/`, `/menu`, `/menu/[slug]`, `/places/[slug]`.

**Required secret:** `wrangler secret put ANTHROPIC_API_KEY`. Without it, the actions throw with a helpful error.

**Triggering generation today** (until admin lands):
1. Open a server action route in dev that calls `generateMenuItemSeoAction(itemId)`, OR
2. Use `wrangler dev --remote` and a temporary `/dev/generate` page (don't commit to main).
3. The auth+admin PR will replace this with proper UI.

**Coming in next AI PR (after admin):**
- `generated_content_versions` table for approval workflow + rollback
- Bulk runner via Cloudflare Queues — generate 50 place pages in parallel without blocking requests
- Translations via Workers AI (m2m100) for DA/EN/DE/SV/NO
- **Competitor audit tool** — Owner's signature lead magnet. Public `/audit/[google-place-id]` endpoint pulls Google Places + reviews, ranks vs nearby competitors, and produces a "you're losing €X/mo" report. Claude Sonnet 4.6 with web_search tool.

---

## 10. EU / GDPR

- **Data residency:** D1 created with `--location=weur`. R2 buckets pinned to EU jurisdiction in dashboard.
- **Marketing consent:** `customers.marketing_consent` + `marketing_consent_at` must be true with a timestamp before any email/SMS send. Default `false`.
- **No third-party trackers** in tenant pages by default. No Google Analytics on customer-facing surfaces (Owner uses HotJar — we won't).
- **Payment processors:** Stripe (EU entity) + MobilePay (DK). Both have EU DPAs.
- **Right to erasure:** `ON DELETE CASCADE` from `tenants` and `customers` removes all child rows. Order history retained for accounting per local law (Denmark: 5 years).
- **Cookie banner:** added when first analytics/marketing pixel lands. None needed today.

---

## 11. i18n & Payments (designed, not built)

**i18n:** `tenants.default_locale` exists. When the i18n PR lands:

- `next-intl` with locale-prefixed routes (`/da/`, `/en/`, `/de/`, `/sv/`, `/no/`).
- Translation source-of-truth: brand-supplied strings in `tenants` + AI-translated menu via Workers AI.

**Payments:** Provider-agnostic `Payment` interface in future `packages/payments`:

```ts
interface PaymentProvider {
  createIntent(order: Order): Promise<PaymentIntent>;
  capture(intentId: string): Promise<void>;
  refund(intentId: string, amountCents?: number): Promise<void>;
  webhook(req: Request): Promise<WebhookResult>;
}
```

Implementations: `StripeProvider`, `MobilePayProvider`, `CashProvider`. Selected per-tenant or per-location.

---

## 12. Anti-Patterns — Don't Do This

- ❌ Query a tenant-owned table without `WHERE tenant_id = ?`. There is no RLS safety net.
- ❌ Reach for Postgres-style features (RLS, JSONB operators, advisory locks). D1 is SQLite — keep schema simple.
- ❌ Add a Node-only dependency. Check the package's runtime support before installing.
- ❌ Store money as float / decimal. Always integer cents.
- ❌ Hard-code tenant context. Always resolve via `getTenant()`.
- ❌ Skip the `created_at` / `updated_at` defaults. Every table has them for a reason.
- ❌ Use autoincrement IDs. Use `ids.X()` from `@plates/db`.
- ❌ Bypass middleware to "look up tenant by hand" in a route. The cache exists for a reason.
- ❌ Add a feature flag for backward-compat. Just change the code.
