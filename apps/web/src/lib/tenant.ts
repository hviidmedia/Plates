import { headers } from "next/headers";
import { notFound } from "next/navigation";

export type TenantContext = {
  id: string;
  subdomain: string;
  name: string;
};

/**
 * Reads the tenant injected by middleware.ts. Calls notFound() when missing —
 * use only inside tenant route groups, never in marketing/admin routes.
 */
export async function getTenant(): Promise<TenantContext> {
  const h = await headers();
  const id = h.get("x-tenant-id");
  const subdomain = h.get("x-tenant-subdomain");
  const name = h.get("x-tenant-name");

  if (!id || !subdomain || !name) {
    notFound();
  }

  return { id, subdomain, name };
}

export async function getTenantOrNull(): Promise<TenantContext | null> {
  const h = await headers();
  const id = h.get("x-tenant-id");
  const subdomain = h.get("x-tenant-subdomain");
  const name = h.get("x-tenant-name");

  if (!id || !subdomain || !name) return null;
  return { id, subdomain, name };
}
