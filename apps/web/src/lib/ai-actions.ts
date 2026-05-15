"use server";

import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, eq } from "drizzle-orm";
import {
  generateMenuItemSeo,
  generatePlacePage,
  type RestaurantContext,
} from "@plates/ai";
import {
  getDb,
  ids,
  localSeoPages,
  locations,
  menuItems,
  tenants,
} from "@plates/db";
import { getTenant } from "./tenant";

/**
 * Server actions wrapping packages/ai. These run in the Workers runtime,
 * accept tenant-scoped inputs, and persist results to D1.
 *
 * NOT yet wired to a UI — admin will trigger these in the auth+admin PR.
 * Until then, call from a dev-only route or via wrangler.
 */

function requireApiKey(): string {
  const { env } = getCloudflareContext();
  const key = env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Run `wrangler secret put ANTHROPIC_API_KEY`.",
    );
  }
  return key;
}

async function loadRestaurantContext(tenantId: string): Promise<RestaurantContext> {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const tenant = await db
    .select()
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .get();
  if (!tenant) throw new Error(`Tenant ${tenantId} not found`);

  const location = await db
    .select()
    .from(locations)
    .where(eq(locations.tenantId, tenantId))
    .get();

  return {
    tenantName: tenant.name,
    city: location?.city ?? "Unknown",
    country: location?.country ?? "DK",
    locale: tenant.defaultLocale,
  };
}

export async function generateMenuItemSeoAction(
  menuItemId: string,
): Promise<{ seoTitle: string; seoDescription: string; aiDescription: string }> {
  const tenant = await getTenant();
  const apiKey = requireApiKey();
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const item = await db
    .select()
    .from(menuItems)
    .where(
      and(eq(menuItems.id, menuItemId), eq(menuItems.tenantId, tenant.id)),
    )
    .get();
  if (!item) throw new Error(`Menu item ${menuItemId} not found`);

  const ctx = await loadRestaurantContext(tenant.id);

  const { output } = await generateMenuItemSeo(
    { apiKey },
    ctx,
    {
      name: item.name,
      rawDescription: item.description,
      priceCents: item.priceCents,
      currency: item.currency,
    },
  );

  await db
    .update(menuItems)
    .set({
      aiDescription: output.ai_description,
      seoTitle: output.seo_title,
      seoDescription: output.seo_description,
      updatedAt: new Date(),
    })
    .where(eq(menuItems.id, menuItemId))
    .run();

  revalidatePath(`/menu/${item.slug}`);
  revalidatePath("/menu");
  return {
    aiDescription: output.ai_description,
    seoTitle: output.seo_title,
    seoDescription: output.seo_description,
  };
}

export async function generatePlacePageAction(
  area: { slug: string; areaName: string; distanceFromLocation?: string; areaContext?: string },
): Promise<{ id: string; slug: string }> {
  const tenant = await getTenant();
  const apiKey = requireApiKey();
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const ctx = await loadRestaurantContext(tenant.id);

  const { output } = await generatePlacePage({ apiKey }, ctx, area);

  // Upsert by (tenant_id, slug)
  const existing = await db
    .select({ id: localSeoPages.id })
    .from(localSeoPages)
    .where(
      and(
        eq(localSeoPages.tenantId, tenant.id),
        eq(localSeoPages.slug, area.slug),
      ),
    )
    .get();

  const now = new Date();
  if (existing) {
    await db
      .update(localSeoPages)
      .set({
        areaName: area.areaName,
        title: output.title,
        bodyMd: output.body_md,
        seoTitle: output.seo_title,
        seoDescription: output.seo_description,
        aiGenerated: true,
        updatedAt: now,
      })
      .where(eq(localSeoPages.id, existing.id))
      .run();
    revalidatePath(`/places/${area.slug}`);
    return { id: existing.id, slug: area.slug };
  }

  const id = ids.localSeoPage();
  await db
    .insert(localSeoPages)
    .values({
      id,
      tenantId: tenant.id,
      slug: area.slug,
      areaName: area.areaName,
      title: output.title,
      bodyMd: output.body_md,
      seoTitle: output.seo_title,
      seoDescription: output.seo_description,
      isPublished: true,
      aiGenerated: true,
    })
    .run();

  revalidatePath(`/places/${area.slug}`);
  return { id, slug: area.slug };
}
