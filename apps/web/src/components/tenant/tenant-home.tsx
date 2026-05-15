import Link from "next/link";
import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, locations, type Tenant } from "@plates/db";
import { TenantNav } from "./tenant-nav";
import { MenuItemCard } from "./menu-item-card";
import { JsonLd, restaurantSchema } from "./json-ld";
import { getMenuForTenant } from "@/lib/menu";

export async function TenantHome({ tenant }: { tenant: Tenant }) {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);
  const [menu, primaryLocation] = await Promise.all([
    getMenuForTenant(tenant.id),
    db.select().from(locations).where(eq(locations.tenantId, tenant.id)).get(),
  ]);

  const popular =
    menu.find((cat) => cat.slug === "popular")?.items ??
    menu.flatMap((cat) => cat.items).slice(0, 3);

  return (
    <>
      <JsonLd data={restaurantSchema(tenant, primaryLocation ?? undefined)} />
      <TenantNav
        tenantId={tenant.id}
        tenantName={tenant.name}
        brandColor={tenant.brandColor}
      />

      <section
        className="relative"
        style={{
          background: `linear-gradient(180deg, ${tenant.brandColor ?? "oklch(0.95 0.04 145)"} / 8% 0%, white 100%)`,
        }}
      >
        <div className="mx-auto max-w-5xl px-4 pt-16 pb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            Velkommen
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight md:text-6xl">
            {tenant.name}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-zinc-600">
            Bestil online til pickup eller levering. Frisk lavet, leveret direkte fra os.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/menu"
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Se hele menuen
            </Link>
            <Link
              href="/cart"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium hover:bg-zinc-50"
            >
              Min kurv
            </Link>
          </div>
        </div>
      </section>

      {popular.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Populære valg</h2>
            <Link href="/menu" className="text-sm text-zinc-500 hover:text-zinc-900">
              Se alle →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.slice(0, 6).map((item) => (
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
        </section>
      )}

      <footer className="border-t border-zinc-100 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 text-sm text-zinc-500 md:flex-row">
          <span>© {new Date().getFullYear()} {tenant.name}</span>
          <span>
            Drevet af{" "}
            <Link href="https://counter.app" className="hover:text-zinc-900">
              Plates
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}
