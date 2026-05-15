import type { Location, MenuItem, Tenant } from "@plates/db";

/**
 * Inject Schema.org structured data so Google can build rich results.
 *
 * Renders a <script type="application/ld+json"> with a single object or array.
 * Use one component per page type — Restaurant on home, MenuItem on item pages.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function restaurantSchema(tenant: Tenant, location?: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: tenant.name,
    image: tenant.logoUrl ?? undefined,
    url: `https://${tenant.subdomain}.counter.app`,
    priceRange: "€€",
    servesCuisine: undefined as string | undefined,
    address: location
      ? {
          "@type": "PostalAddress",
          streetAddress: location.addressLine1,
          addressLocality: location.city,
          postalCode: location.postalCode,
          addressCountry: location.country,
        }
      : undefined,
    geo:
      location?.lat != null && location.lng != null
        ? {
            "@type": "GeoCoordinates",
            latitude: location.lat,
            longitude: location.lng,
          }
        : undefined,
    telephone: location?.phone ?? undefined,
  };
}

export function menuItemSchema(
  item: MenuItem,
  tenant: Tenant,
  categoryName?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: item.name,
    description: item.aiDescription ?? item.description ?? undefined,
    image: item.imageUrl ?? undefined,
    offers: {
      "@type": "Offer",
      price: (item.priceCents / 100).toFixed(2),
      priceCurrency: item.currency,
    },
    menuAddOn: undefined,
    suitableForDiet: undefined,
    nutrition: undefined,
    isPartOf: categoryName
      ? { "@type": "MenuSection", name: categoryName }
      : undefined,
    inLanguage: tenant.defaultLocale,
  };
}
