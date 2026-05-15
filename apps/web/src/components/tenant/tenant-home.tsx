import Link from "next/link";
import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, locations, openingHours, type Tenant } from "@plates/db";
import { TenantNav } from "./tenant-nav";
import { TenantHero } from "./tenant-hero";
import { LocationsSection, type LocationCardData } from "./locations-section";
import { TenantFooter } from "./tenant-footer";
import { MenuItemCard } from "./menu-item-card";
import { JsonLd, restaurantSchema } from "./json-ld";
import { getMenuForTenant } from "@/lib/menu";
import { getContentPageSlugs } from "@/lib/content-pages";
import { getTodayHours, type OpeningHour } from "@/lib/hours";

export async function TenantHome({ tenant }: { tenant: Tenant }) {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const [menu, allLocations, allHours, contentPageSlugs] = await Promise.all([
    getMenuForTenant(tenant.id),
    db
      .select()
      .from(locations)
      .where(eq(locations.tenantId, tenant.id))
      .all(),
    db
      .select()
      .from(openingHours)
      .all(),
    getContentPageSlugs(tenant.id),
  ]);

  const primaryLocation = allLocations[0];

  // Build the locations payload with today's hours per location.
  const locationCards: LocationCardData[] = allLocations.map((loc) => {
    const hoursForLoc: OpeningHour[] = allHours
      .filter((h) => h.locationId === loc.id)
      .map((h) => ({
        dayOfWeek: h.dayOfWeek,
        openMinutes: h.openMinutes,
        closeMinutes: h.closeMinutes,
      }));
    const today = getTodayHours(hoursForLoc);
    return {
      id: loc.id,
      slug: loc.slug,
      name: loc.name,
      addressLine1: loc.addressLine1,
      addressLine2: loc.addressLine2,
      city: loc.city,
      postalCode: loc.postalCode,
      country: loc.country,
      lat: loc.lat,
      lng: loc.lng,
      phone: loc.phone,
      email: loc.email,
      todayLabel: today.label,
      isOpenNow: today.isOpen,
    };
  });

  const popular =
    menu.find((cat) => cat.slug === "popular")?.items ??
    menu.flatMap((cat) => cat.items).slice(0, 3);

  return (
    <>
      <JsonLd data={restaurantSchema(tenant, primaryLocation ?? undefined)} />

      <div className="relative">
        <TenantNav
          tenantId={tenant.id}
          tenantName={tenant.name}
          brandColor={tenant.brandColor}
          contentPageSlugs={contentPageSlugs}
          variant="overlay"
        />
        <TenantHero tenant={tenant} />
      </div>

      {popular.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              Populære valg
            </h2>
            <Link
              href="/menu"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Se hele menuen →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popular.slice(0, 6).map((item) => (
              <MenuItemCard
                key={item.id}
                id={item.id}
                slug={item.slug}
                name={item.name}
                description={item.description}
                priceCents={item.priceCents}
                currency={item.currency}
                imageUrl={item.imageUrl}
              />
            ))}
          </div>
        </section>
      )}

      {locationCards.length > 0 && (
        <LocationsSection locations={locationCards} />
      )}

      <TenantFooter
        tenant={tenant}
        contentPageSlugs={contentPageSlugs}
        locations={allLocations.map((l) => ({ slug: l.slug, city: l.city }))}
      />
    </>
  );
}
