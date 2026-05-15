import Link from "next/link";
import type { Tenant } from "@plates/db";

export type FooterLocation = {
  slug: string;
  city: string;
};

/**
 * Owner-style footer with three link columns + Powered by Plates badge.
 * Columns adapt to which content pages a tenant has published.
 */
export function TenantFooter({
  tenant,
  contentPageSlugs,
  locations,
}: {
  tenant: Tenant;
  contentPageSlugs: Set<string>;
  locations: FooterLocation[];
}) {
  const aboutLinks = [
    { href: "/", label: "Forside" },
    contentPageSlugs.has("our-story") ? { href: "/our-story", label: "Vores historie" } : null,
    contentPageSlugs.has("contact") ? { href: "/contact", label: "Kontakt" } : null,
  ].filter(notNull);

  const orderLinks = [
    { href: "/menu", label: "Menu" },
    { href: "/cart", label: "Min kurv" },
    contentPageSlugs.has("gift-cards") ? { href: "/gift-cards", label: "Gavekort" } : null,
  ].filter(notNull);

  const extraLinks = [
    contentPageSlugs.has("catering") ? { href: "/catering", label: "Catering" } : null,
    contentPageSlugs.has("careers") ? { href: "/careers", label: "Job hos os" } : null,
  ].filter(notNull);

  return (
    <footer className="bg-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1fr,2fr,1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
              <div
                className="size-8 rounded-lg"
                style={{ background: tenant.brandColor ?? "oklch(0.62 0.18 145)" }}
                aria-hidden
              />
              {tenant.name}
            </Link>
            {tenant.tagline && (
              <p className="mt-3 max-w-xs text-sm text-zinc-600">{tenant.tagline}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterColumn title="Om os" links={aboutLinks} />
            <FooterColumn title="Bestil" links={orderLinks} />
            {extraLinks.length > 0 && <FooterColumn title="Mere" links={extraLinks} />}
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Afdelinger
            </p>
            {locations.map((l) => (
              <Link
                key={l.slug}
                href="/#locations"
                className="block text-zinc-700 hover:text-zinc-900"
              >
                {l.city}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-zinc-200 pt-6 text-xs text-zinc-500 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} {tenant.name}. Alle rettigheder forbeholdt.</span>
          <a
            href="https://counter.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-zinc-900"
          >
            <div
              className="size-3 rounded-sm bg-[oklch(0.62_0.18_145)]"
              aria-hidden
            />
            Drevet af Plates
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  if (links.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-zinc-700 hover:text-zinc-900">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function notNull<T>(v: T | null): v is T {
  return v !== null;
}
