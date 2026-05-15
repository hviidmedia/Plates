import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { getDb, tenants } from "@plates/db";
import { getTenantOrNull } from "@/lib/tenant";
import { MarketingHome } from "@/components/marketing/marketing-home";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tenantHeader = await getTenantOrNull();

  if (!tenantHeader) {
    return <MarketingHome />;
  }

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);
  const tenant = await db
    .select()
    .from(tenants)
    .where(eq(tenants.id, tenantHeader.id))
    .get();

  if (!tenant) {
    return <MarketingHome />;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
        {tenant.subdomain}.{process.env.APP_DOMAIN ?? "counter.app"}
      </p>
      <h1 className="text-5xl font-bold tracking-tight">{tenant.name}</h1>
      <p className="text-lg text-zinc-600">
        Tenant resolved from D1 via subdomain middleware. Default currency:{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          {tenant.defaultCurrency}
        </code>
        , locale:{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          {tenant.defaultLocale}
        </code>
        .
      </p>
    </main>
  );
}
