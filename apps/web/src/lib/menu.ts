import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, asc, eq, isNull, or } from "drizzle-orm";
import { getDb, categories, menuItems, type MenuItem } from "@plates/db";

export type CategoryWithItems = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  position: number;
  items: MenuItem[];
};

export async function getMenuForTenant(
  tenantId: string,
  locationId?: string,
): Promise<CategoryWithItems[]> {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const cats = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.tenantId, tenantId),
        eq(categories.isActive, true),
        // brand-wide (location_id IS NULL) OR scoped to current location
        locationId
          ? or(isNull(categories.locationId), eq(categories.locationId, locationId))
          : isNull(categories.locationId),
      ),
    )
    .orderBy(asc(categories.position))
    .all();

  if (cats.length === 0) return [];

  const items = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.tenantId, tenantId))
    .orderBy(asc(menuItems.position))
    .all();

  return cats.map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    description: cat.description,
    position: cat.position,
    items: items.filter((item) => item.categoryId === cat.id),
  }));
}

export async function getMenuItemBySlug(
  tenantId: string,
  itemSlug: string,
): Promise<MenuItem | null> {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const item = await db
    .select()
    .from(menuItems)
    .where(and(eq(menuItems.tenantId, tenantId), eq(menuItems.slug, itemSlug)))
    .get();

  return item ?? null;
}
