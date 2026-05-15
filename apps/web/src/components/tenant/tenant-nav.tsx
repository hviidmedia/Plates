import Link from "next/link";
import { getCartView } from "@/lib/cart";

/**
 * Tenant nav supports two variants:
 * - "overlay" — transparent pill on top of a hero image (tenant home, places)
 * - "solid" — opaque bar with bottom border (menu, item detail, cart)
 *
 * `contentPageSlugs` drives which links appear; an empty set just shows
 * Menu + cart, so unauthenticated/empty-tenant pages don't break.
 */
export async function TenantNav({
  tenantId,
  tenantName,
  brandColor,
  contentPageSlugs = new Set(),
  variant = "solid",
}: {
  tenantId: string;
  tenantName: string;
  brandColor: string | null;
  contentPageSlugs?: Set<string>;
  variant?: "overlay" | "solid";
}) {
  const cart = await getCartView(tenantId);
  const itemCount = cart?.itemCount ?? 0;

  const moreLinks = [
    contentPageSlugs.has("catering") ? { href: "/catering", label: "Catering" } : null,
    contentPageSlugs.has("careers") ? { href: "/careers", label: "Job" } : null,
    contentPageSlugs.has("contact") ? { href: "/contact", label: "Kontakt" } : null,
  ].filter((l): l is { href: string; label: string } => l !== null);

  if (variant === "overlay") {
    return (
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-6 md:py-6">
          <BrandPill tenantName={tenantName} brandColor={brandColor} />
          <PillNav contentPageSlugs={contentPageSlugs} moreLinks={moreLinks} />
          <Actions itemCount={itemCount} />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-semibold tracking-tight"
        >
          <div
            className="size-7 rounded-full"
            style={{ background: brandColor ?? "oklch(0.62 0.18 145)" }}
            aria-hidden
          />
          {tenantName}
        </Link>
        <SolidNav contentPageSlugs={contentPageSlugs} moreLinks={moreLinks} />
        <Actions itemCount={itemCount} />
      </div>
    </header>
  );
}

function BrandPill({
  tenantName,
  brandColor,
}: {
  tenantName: string;
  brandColor: string | null;
}) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 font-semibold tracking-tight text-zinc-900 shadow-sm backdrop-blur"
    >
      <div
        className="size-6 rounded-full"
        style={{ background: brandColor ?? "oklch(0.62 0.18 145)" }}
        aria-hidden
      />
      {tenantName}
    </Link>
  );
}

function PillNav({
  contentPageSlugs,
  moreLinks,
}: {
  contentPageSlugs: Set<string>;
  moreLinks: { href: string; label: string }[];
}) {
  return (
    <nav className="hidden items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur md:flex">
      <NavLink href="/menu">Menu</NavLink>
      {contentPageSlugs.has("our-story") && (
        <NavLink href="/our-story">Vores historie</NavLink>
      )}
      {contentPageSlugs.has("gift-cards") && (
        <NavLink href="/gift-cards">Gavekort</NavLink>
      )}
      {moreLinks.length > 0 && <MoreMenu links={moreLinks} />}
    </nav>
  );
}

function SolidNav({
  contentPageSlugs,
  moreLinks,
}: {
  contentPageSlugs: Set<string>;
  moreLinks: { href: string; label: string }[];
}) {
  return (
    <nav className="hidden items-center gap-1 text-sm font-medium text-zinc-700 md:flex">
      <NavLink href="/menu">Menu</NavLink>
      {contentPageSlugs.has("our-story") && (
        <NavLink href="/our-story">Vores historie</NavLink>
      )}
      {contentPageSlugs.has("gift-cards") && (
        <NavLink href="/gift-cards">Gavekort</NavLink>
      )}
      {moreLinks.length > 0 && <MoreMenu links={moreLinks} />}
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-1.5 hover:bg-zinc-100"
    >
      {children}
    </Link>
  );
}

function MoreMenu({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 hover:bg-zinc-100"
      >
        Mere
        <svg viewBox="0 0 12 12" className="size-3 fill-current" aria-hidden>
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="invisible absolute right-0 top-full mt-2 w-44 rounded-2xl border border-zinc-200 bg-white p-1.5 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="block rounded-xl px-3 py-2 hover:bg-zinc-100"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Actions({ itemCount }: { itemCount: number }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/cart"
        aria-label={`Kurv${itemCount > 0 ? ` (${itemCount})` : ""}`}
        className="relative inline-flex size-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-sm hover:bg-zinc-50"
      >
        <CartIcon />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-[oklch(0.72_0.18_45)] text-[11px] font-semibold text-white">
            {itemCount}
          </span>
        )}
      </Link>
      <Link
        href="/menu"
        className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.72_0.18_45)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[oklch(0.66_0.18_45)] md:px-5"
      >
        Bestil online
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 3h2l3 13h11l3-9H6" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}
