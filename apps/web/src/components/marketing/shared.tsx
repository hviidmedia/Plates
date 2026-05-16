import Link from "next/link";

/**
 * Shared Nav + Footer for marketing-side surfaces (forsiden + alle
 * marketing-subsider). Holdes som ét sted så subsiderne ikke driver fra
 * hovedside-styling.
 *
 * Visual tokens — keep in sync with marketing-home.tsx:
 * - brand-green: oklch(0.45 0.16 145) (accent), oklch(0.62 0.18 145) (logo)
 * - order-orange: oklch(0.72 0.18 45) (primary CTA)
 * - max-w-6xl container, rounded-full pills, zinc text scale
 */

export function MarketingNav({
  /** Highlight the current page's nav item. */
  current,
}: {
  current?: "features" | "pricing" | "customers" | "about" | "faq";
}) {
  return (
    <header className="border-b border-zinc-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <div
            className="size-7 rounded-lg bg-[oklch(0.62_0.18_145)]"
            aria-hidden
          />
          Plates
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
          <NavLink href="/features" current={current === "features"}>
            Features
          </NavLink>
          <NavLink href="/pricing" current={current === "pricing"}>
            Priser
          </NavLink>
          <NavLink href="/customers" current={current === "customers"}>
            Kunder
          </NavLink>
          <NavLink href="/about" current={current === "about"}>
            Om Plates
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-zinc-700 hover:text-zinc-900 md:inline"
          >
            Log ind
          </Link>
          <Link
            href="/demo"
            className="rounded-full bg-[oklch(0.72_0.18_45)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[oklch(0.66_0.18_45)]"
          >
            Få en gratis demo
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={current ? "font-medium text-zinc-900" : "hover:text-zinc-900"}
    >
      {children}
    </Link>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr,1fr,1fr,1fr]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold tracking-tight"
          >
            <div
              className="size-7 rounded-lg bg-[oklch(0.62_0.18_145)]"
              aria-hidden
            />
            Plates
          </Link>
          <p className="mt-3 max-w-xs text-sm text-zinc-600">
            Europas restaurant-platform. Direct ordering, AI-genererede SEO-sider,
            GDPR-native. Lavet i EU.
          </p>
        </div>

        <FooterColumn
          title="Produkt"
          links={[
            { href: "/features", label: "Features" },
            { href: "/pricing", label: "Priser" },
            { href: "/customers", label: "Kunder" },
            { href: "/demo", label: "Få en demo" },
          ]}
        />
        <FooterColumn
          title="Firma"
          links={[
            { href: "/about", label: "Om Plates" },
            { href: "/start", label: "Byg selv" },
            { href: "/login", label: "Log ind" },
          ]}
        />
        <FooterColumn
          title="Juridisk"
          links={[
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
            { href: "/dpa", label: "DPA" },
          ]}
        />
      </div>
      <div className="border-t border-zinc-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-zinc-500 md:flex-row">
          <span>© {new Date().getFullYear()} Plates ApS · Lavet i EU</span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-1.5 rounded-full bg-[oklch(0.55_0.18_145)]"
              aria-hidden
            />
            EU data residency · GDPR-native
          </span>
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

/** Reusable star rating row used in heroes and testimonials. */
export function Stars({ rating, label }: { rating: number; label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 text-sm text-zinc-600">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className="size-5 fill-amber-400"
            aria-hidden
          >
            <path d="M9.05 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 0 0-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.366-2.445a1 1 0 0 0-1.176 0l-3.366 2.445c-.783.57-1.838-.197-1.538-1.118l1.286-3.957a1 1 0 0 0-.363-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 0 0 .951-.69L9.05 2.927Z" />
          </svg>
        ))}
      </div>
      <span className="font-semibold text-zinc-900">{rating.toFixed(1)}</span>
      {label && <span>· {label}</span>}
    </div>
  );
}

/** Banded final CTA, reused at the bottom of every marketing page. */
export function MarketingFinalCta({
  headline,
  body,
  primaryLabel = "Få en gratis demo",
  primaryHref = "/demo",
  secondaryLabel = "Byg selv",
  secondaryHref = "/start",
}: {
  headline: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="bg-[oklch(0.22_0.07_145)] py-20 text-white md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          {headline}
        </h2>
        {body && (
          <p className="mt-5 text-balance text-lg text-white/70">{body}</p>
        )}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.72_0.18_45)] px-7 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-[oklch(0.66_0.18_45)]"
          >
            {primaryLabel}
            <span aria-hidden>→</span>
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/5"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
