import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { getDb, tenants } from "@plates/db";
import { getTenantOrNull } from "@/lib/tenant";
import { MarketingHome } from "@/components/marketing/marketing-home";
import { TenantHome } from "@/components/tenant/tenant-home";

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

  return <TenantHome tenant={tenant} />;
}
