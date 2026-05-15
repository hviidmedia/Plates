import Link from "next/link";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { getDb, tenants } from "@plates/db";
import { getTenant } from "@/lib/tenant";
import { getCartView } from "@/lib/cart";
import { TenantNav } from "@/components/tenant/tenant-nav";
import { CartLineItem } from "@/components/tenant/cart-line-item";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const tenantHeader = await getTenant();
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const tenant = await db
    .select()
    .from(tenants)
    .where(eq(tenants.id, tenantHeader.id))
    .get();
  if (!tenant) return null;

  const cart = await getCartView(tenant.id);

  return (
    <>
      <TenantNav
        tenantId={tenant.id}
        tenantName={tenant.name}
        brandColor={tenant.brandColor}
      />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Din kurv</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 p-10 text-center">
            <p className="text-lg font-semibold">Kurven er tom</p>
            <p className="mt-2 text-sm text-zinc-600">
              Tilføj retter fra menuen for at komme i gang.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-flex rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Se menuen
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <ul className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-100 bg-white">
              {cart.items.map((item) => (
                <CartLineItem
                  key={item.id}
                  id={item.id}
                  name={item.nameSnapshot}
                  unitPriceCents={item.unitPriceCents}
                  quantity={item.quantity}
                  currency={tenant.defaultCurrency}
                  imageUrl={item.imageUrl}
                />
              ))}
            </ul>

            <div className="rounded-2xl border border-zinc-100 bg-white p-6">
              <div className="flex items-center justify-between text-base">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-semibold">
                  {formatPrice(cart.subtotalCents, tenant.defaultCurrency)}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Levering og evt. afgifter beregnes ved checkout.
              </p>
              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-full bg-zinc-300 px-6 py-3 text-base font-medium text-white"
                title="Checkout kommer i en senere PR"
              >
                Gå til checkout (kommer snart)
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
