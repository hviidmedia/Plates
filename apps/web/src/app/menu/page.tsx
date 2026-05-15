import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { getMenuForTenant } from "@/lib/menu";
import { TenantNav } from "@/components/tenant/tenant-nav";
import { MenuItemCard } from "@/components/tenant/menu-item-card";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { getDb, tenants } from "@plates/db";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const tenantHeader = await getTenant();
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const tenant = await db
    .select()
    .from(tenants)
    .where(eq(tenants.id, tenantHeader.id))
    .get();
  if (!tenant) return null;

  const menu = await getMenuForTenant(tenant.id);

  return (
    <>
      <TenantNav
        tenantId={tenant.id}
        tenantName={tenant.name}
        brandColor={tenant.brandColor}
      />

      <nav className="sticky top-[57px] z-20 border-b border-zinc-100 bg-white">
        <div className="mx-auto flex max-w-5xl gap-6 overflow-x-auto px-4 py-3 text-sm">
          {menu.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.slug}`}
              className="whitespace-nowrap font-medium text-zinc-600 hover:text-zinc-900"
            >
              {cat.name}
            </a>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{tenant.name}</h1>
          <p className="mt-2 text-zinc-600">Bestil til pickup eller levering.</p>
        </header>

        {menu.length === 0 ? (
          <EmptyMenuState />
        ) : (
          <div className="space-y-14">
            {menu.map((cat) => (
              <section key={cat.id} id={cat.slug} className="scroll-mt-32">
                <div className="mb-5">
                  <h2 className="text-2xl font-semibold tracking-tight">{cat.name}</h2>
                  {cat.description && (
                    <p className="mt-1 text-sm text-zinc-600">{cat.description}</p>
                  )}
                </div>
                {cat.items.length === 0 ? (
                  <p className="text-sm text-zinc-500">Ingen retter i denne kategori endnu.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        id={item.id}
                        slug={item.slug}
                        name={item.name}
                        description={item.description}
                        priceCents={item.priceCents}
                        currency={item.currency}
                        imageUrl={item.imageUrl}
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function EmptyMenuState() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center">
      <h2 className="text-lg font-semibold">Menuen er ikke klar endnu</h2>
      <p className="mt-2 text-sm text-zinc-600">
        Restauranten har ikke tilføjet retter til menuen. Kig forbi om lidt.
      </p>
      <Link href="/" className="mt-6 inline-flex text-sm font-medium underline">
        Tilbage til forsiden
      </Link>
    </div>
  );
}
