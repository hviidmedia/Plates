import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, eq } from "drizzle-orm";
import { getDb, localSeoPages, tenants } from "@plates/db";
import { getTenant } from "@/lib/tenant";
import { TenantNav } from "@/components/tenant/tenant-nav";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function loadPlace(tenantId: string, slug: string) {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);
  return db
    .select()
    .from(localSeoPages)
    .where(
      and(
        eq(localSeoPages.tenantId, tenantId),
        eq(localSeoPages.slug, slug),
        eq(localSeoPages.isPublished, true),
      ),
    )
    .get();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenant();
  const place = await loadPlace(tenant.id, slug);
  if (!place) return { title: "Not found" };
  return {
    title: place.seoTitle ?? place.title,
    description: place.seoDescription ?? undefined,
  };
}

export default async function PlacePage({ params }: Props) {
  const { slug } = await params;
  const tenantHeader = await getTenant();
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const [tenant, place] = await Promise.all([
    db.select().from(tenants).where(eq(tenants.id, tenantHeader.id)).get(),
    loadPlace(tenantHeader.id, slug),
  ]);
  if (!tenant || !place) notFound();

  return (
    <>
      <TenantNav
        tenantId={tenant.id}
        tenantName={tenant.name}
        brandColor={tenant.brandColor}
      />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← {tenant.name}
        </Link>
        <article className="prose prose-zinc mt-8 max-w-none">
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
            {place.title}
          </h1>
          {place.bodyMd && <BodyMarkdown md={place.bodyMd} />}
        </article>
        <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center">
          <p className="text-lg font-semibold">Klar til at smage selv?</p>
          <Link
            href="/menu"
            className="mt-4 inline-flex rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Se menuen
          </Link>
        </div>
      </main>
    </>
  );
}

/**
 * Minimal Markdown rendering — headings, paragraphs, lists.
 * Intentionally not pulling in a full MD lib until the AI PR has shipped
 * and we know what features we actually need.
 */
function BodyMarkdown({ md }: { md: string }) {
  const blocks = md.split(/\n\n+/);
  return (
    <>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="mt-10 text-2xl font-semibold tracking-tight">
              {trimmed.slice(3)}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="mt-8 text-xl font-semibold">
              {trimmed.slice(4)}
            </h3>
          );
        }
        if (/^\s*[-*]\s/.test(trimmed)) {
          const items = trimmed.split(/\n/).map((l) => l.replace(/^\s*[-*]\s/, ""));
          return (
            <ul key={i} className="mt-4 list-disc space-y-1 pl-6 text-zinc-700">
              {items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mt-4 text-base leading-relaxed text-zinc-700">
            {trimmed}
          </p>
        );
      })}
    </>
  );
}
