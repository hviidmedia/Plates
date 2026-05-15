import Link from "next/link";
import { getCartView } from "@/lib/cart";

export async function TenantNav({
  tenantId,
  tenantName,
  brandColor,
}: {
  tenantId: string;
  tenantName: string;
  brandColor: string | null;
}) {
  const cart = await getCartView(tenantId);
  const itemCount = cart?.itemCount ?? 0;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div
            className="size-7 rounded-full"
            style={{ background: brandColor ?? "oklch(0.62 0.18 145)" }}
            aria-hidden
          />
          {tenantName}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/menu" className="text-zinc-700 hover:text-zinc-900">
            Menu
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
          >
            <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h2l3 13h11l3-9H6" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
            </svg>
            Kurv
            {itemCount > 0 && (
              <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-white text-xs font-semibold text-zinc-900">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
