import Link from "next/link";
import type { Tenant } from "@plates/db";

/**
 * Owner-style full-bleed hero. Prefers video over image over gradient.
 * Headline + tagline come from tenant fields; sensible defaults if empty.
 */
export function TenantHero({ tenant }: { tenant: Tenant }) {
  const headline =
    tenant.heroHeadline ?? `Perfekte måltider hos ${tenant.name}.`;
  const tagline = tenant.tagline ?? "Frisk lavet, leveret direkte fra os.";

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      <Background tenant={tenant} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-16 md:pb-24">
        <p className="text-sm font-medium uppercase tracking-widest text-white/80 md:text-base">
          {tagline}
        </p>
        <h1 className="mt-3 max-w-3xl text-balance text-4xl font-bold leading-tight text-white md:text-6xl">
          {headline}
        </h1>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.72_0.18_45)] px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[oklch(0.66_0.18_45)]"
          >
            Bestil online
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Background({ tenant }: { tenant: Tenant }) {
  if (tenant.heroVideoUrl) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={tenant.heroImageUrl ?? undefined}
        className="absolute inset-0 size-full object-cover"
      >
        <source src={tenant.heroVideoUrl} />
      </video>
    );
  }
  if (tenant.heroImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={tenant.heroImageUrl}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
    );
  }
  // Fallback: warm dimly-lit-restaurant gradient blended with brand color.
  // Picks up the tenant's brand color as an accent so different tenants
  // get visually distinct heroes even before they upload a photo.
  const brand = tenant.brandColor ?? "oklch(0.45 0.16 145)";
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(at 30% 20%, ${brand} 0%, transparent 50%),
          radial-gradient(at 70% 80%, oklch(0.35 0.12 60) 0%, transparent 60%),
          linear-gradient(135deg, oklch(0.18 0.04 60) 0%, oklch(0.12 0.03 30) 100%)
        `,
      }}
    />
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-4 fill-current"
      aria-hidden
    >
      <path d="M11.47 4.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H3.75a.75.75 0 0 1 0-1.5h10.94l-3.22-3.22a.75.75 0 0 1 0-1.06Z" />
    </svg>
  );
}
