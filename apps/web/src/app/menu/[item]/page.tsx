import Link from "next/link";
import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { getDb, tenants } from "@plates/db";
import { getTenant } from "@/lib/tenant";
import { getMenuItemBySlug } from "@/lib/menu";
import { TenantNav } from "@/components/tenant/tenant-nav";
import { AddToCartButton } from "@/components/tenant/add-to-cart-button";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ item: string }>;
}) {
  const { item: itemSlug } = await params;
  const tenantHeader = await getTenant();
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const [tenant, menuItem] = await Promise.all([
    db.select().from(tenants).where(eq(tenants.id, tenantHeader.id)).get(),
    getMenuItemBySlug(tenantHeader.id, itemSlug),
  ]);

  if (!tenant || !menuItem) notFound();

  return (
    <>
      <TenantNav
        tenantId={tenant.id}
        tenantName={tenant.name}
        brandColor={tenant.brandColor}
      />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/menu" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← Tilbage til menu
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-100 bg-white">
          <div className="aspect-[16/9] bg-zinc-100">
            {menuItem.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={menuItem.imageUrl}
                alt={menuItem.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-5xl text-zinc-300">
                🍽️
              </div>
            )}
          </div>
          <div className="space-y-6 p-6 md:p-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{menuItem.name}</h1>
              {menuItem.description && (
                <p className="mt-3 text-zinc-700">{menuItem.description}</p>
              )}
            </div>
            <p className="text-2xl font-semibold">
              {formatPrice(menuItem.priceCents, menuItem.currency)}
            </p>
            <AddToCartButton menuItemId={menuItem.id} variant="wide" />
          </div>
        </div>
      </main>
    </>
  );
}
