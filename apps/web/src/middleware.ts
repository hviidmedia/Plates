import { NextResponse, type NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app", // future admin / dashboard surface
  "admin",
  "api",
  "dashboard",
  "docs",
  "help",
  "status",
]);

const TENANT_CACHE_TTL_SECONDS = 60;

type CachedTenant = {
  id: string;
  subdomain: string;
  name: string;
};

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const appDomain = process.env.APP_DOMAIN ?? "counter.app";
  const subdomain = extractSubdomain(host, appDomain);

  if (!subdomain || RESERVED_SUBDOMAINS.has(subdomain)) {
    return NextResponse.next();
  }

  const tenant = await resolveTenant(subdomain);

  if (!tenant) {
    return NextResponse.rewrite(new URL("/_not-found", req.url));
  }

  const headers = new Headers(req.headers);
  headers.set("x-tenant-id", tenant.id);
  headers.set("x-tenant-subdomain", tenant.subdomain);
  headers.set("x-tenant-name", tenant.name);

  return NextResponse.next({ request: { headers } });
}

async function resolveTenant(subdomain: string): Promise<CachedTenant | null> {
  const { env } = getCloudflareContext();
  const cacheKey = `tenant:${subdomain}`;

  const cached = await env.TENANT_CACHE.get<CachedTenant>(cacheKey, "json");
  if (cached) return cached;

  const { getDb, tenants } = await import("@plates/db");
  const { eq } = await import("drizzle-orm");

  const db = getDb(env.DB);
  const row = await db
    .select({
      id: tenants.id,
      subdomain: tenants.subdomain,
      name: tenants.name,
    })
    .from(tenants)
    .where(eq(tenants.subdomain, subdomain))
    .get();

  if (!row) return null;

  await env.TENANT_CACHE.put(cacheKey, JSON.stringify(row), {
    expirationTtl: TENANT_CACHE_TTL_SECONDS,
  });

  return row;
}

function extractSubdomain(host: string, appDomain: string): string | null {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  if (!hostname) return null;
  if (hostname === "localhost" || hostname === appDomain) return null;
  if (hostname === `www.${appDomain}`) return null;

  if (hostname.endsWith(`.${appDomain}`)) {
    const sub = hostname.slice(0, -(appDomain.length + 1));
    return sub.split(".")[0] ?? null;
  }

  if (hostname.endsWith(".localhost")) {
    const sub = hostname.slice(0, -".localhost".length);
    return sub.split(".")[0] ?? null;
  }

  return null;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
