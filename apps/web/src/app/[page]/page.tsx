import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { getDb, locations, tenants } from "@plates/db";
import { getTenant } from "@/lib/tenant";
import { TenantNav } from "@/components/tenant/tenant-nav";
import { TenantFooter } from "@/components/tenant/tenant-footer";
import { Markdown } from "@/components/tenant/markdown";
import {
  getContentPage,
  getContentPageSlugs,
} from "@/lib/content-pages";

export const dynamic = "force-dynamic";

/** Slugs reserved by other routes — content_pages can't shadow them. */
const RESERVED = new Set(["menu", "cart", "places", "start", "demo", "api", "sitemap.xml", "robots.txt"]);

type Props = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  if (RESERVED.has(page)) return { title: "Not found" };
  const tenant = await getTenant();
  const content = await getContentPage(tenant.id, page);
  if (!content) return { title: "Not found" };
  return {
    title: content.seoTitle ?? `${content.title} · ${tenant.name}`,
    description: content.seoDescription ?? undefined,
  };
}

export default async function ContentPage({ params }: Props) {
  const { page } = await params;
  if (RESERVED.has(page)) notFound();

  const tenantHeader = await getTenant();
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const [tenant, content, contentPageSlugs, allLocations] = await Promise.all([
    db.select().from(tenants).where(eq(tenants.id, tenantHeader.id)).get(),
    getContentPage(tenantHeader.id, page),
    getContentPageSlugs(tenantHeader.id),
    db
      .select({ slug: locations.slug, city: locations.city })
      .from(locations)
      .where(eq(locations.tenantId, tenantHeader.id))
      .all(),
  ]);

  if (!tenant || !content) notFound();

  return (
    <>
      <TenantNav
        tenantId={tenant.id}
        tenantName={tenant.name}
        brandColor={tenant.brandColor}
        contentPageSlugs={contentPageSlugs}
      />
      <main className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        <article className="prose prose-zinc max-w-none">
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
            {content.title}
          </h1>
          {content.bodyMd && (
            <div className="mt-8">
              <Markdown md={content.bodyMd} />
            </div>
          )}
        </article>
      </main>
      <TenantFooter
        tenant={tenant}
        contentPageSlugs={contentPageSlugs}
        locations={allLocations}
      />
    </>
  );
}
