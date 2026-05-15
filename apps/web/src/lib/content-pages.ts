import { eq, and } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { contentPages, getDb } from "@plates/db";

/**
 * Return the set of slugs for content pages that are published for a
 * tenant. Used by the nav/footer to decide which links to show.
 */
export async function getContentPageSlugs(
  tenantId: string,
): Promise<Set<string>> {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);
  const rows = await db
    .select({ slug: contentPages.slug })
    .from(contentPages)
    .where(
      and(
        eq(contentPages.tenantId, tenantId),
        eq(contentPages.isPublished, true),
      ),
    )
    .all();
  return new Set(rows.map((r) => r.slug));
}

export async function getContentPage(
  tenantId: string,
  slug: string,
): Promise<{
  title: string;
  bodyMd: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
} | null> {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);
  const row = await db
    .select({
      title: contentPages.title,
      bodyMd: contentPages.bodyMd,
      seoTitle: contentPages.seoTitle,
      seoDescription: contentPages.seoDescription,
      isPublished: contentPages.isPublished,
    })
    .from(contentPages)
    .where(
      and(eq(contentPages.tenantId, tenantId), eq(contentPages.slug, slug)),
    )
    .get();
  if (!row || !row.isPublished) return null;
  return {
    title: row.title,
    bodyMd: row.bodyMd,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
  };
}
