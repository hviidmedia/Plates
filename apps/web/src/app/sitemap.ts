import type { MetadataRoute } from "next";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, asc, eq } from "drizzle-orm";
import { getDb, localSeoPages, menuItems, tenants } from "@plates/db";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * Per-tenant sitemap. Resolves the current tenant from the middleware-injected
 * `x-tenant-id` header — apex visitors get an empty sitemap (the marketing
 * site has its own static routes that don't need indexing here).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const tenantId = h.get("x-tenant-id");
  if (!tenantId) return [];

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const tenant = await db
    .select()
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .get();
  if (!tenant) return [];

  const baseUrl = `https://${tenant.subdomain}.${process.env.APP_DOMAIN ?? "counter.app"}`;

  const [items, places] = await Promise.all([
    db
      .select({ slug: menuItems.slug, updatedAt: menuItems.updatedAt })
      .from(menuItems)
      .where(
        and(eq(menuItems.tenantId, tenantId), eq(menuItems.available, true)),
      )
      .orderBy(asc(menuItems.position))
      .all(),
    db
      .select({ slug: localSeoPages.slug, updatedAt: localSeoPages.updatedAt })
      .from(localSeoPages)
      .where(
        and(
          eq(localSeoPages.tenantId, tenantId),
          eq(localSeoPages.isPublished, true),
        ),
      )
      .all(),
  ]);

  return [
    { url: baseUrl, lastModified: tenant.updatedAt, priority: 1, changeFrequency: "weekly" },
    { url: `${baseUrl}/menu`, lastModified: tenant.updatedAt, priority: 0.9, changeFrequency: "weekly" },
    ...items.map((item) => ({
      url: `${baseUrl}/menu/${item.slug}`,
      lastModified: item.updatedAt,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    ...places.map((p) => ({
      url: `${baseUrl}/places/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];
}
