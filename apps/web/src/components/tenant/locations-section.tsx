"use client";

import { useState } from "react";

export type LocationCardData = {
  id: string;
  slug: string;
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
  country: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  email: string | null;
  todayLabel: string;
  isOpenNow: boolean;
};

/**
 * Multi-location section with tabs + map embed.
 * If a single location, the tabs collapse to just one — still rendered
 * for layout consistency.
 */
export function LocationsSection({ locations }: { locations: LocationCardData[] }) {
  const [activeId, setActiveId] = useState(locations[0]?.id);
  const active = locations.find((l) => l.id === activeId) ?? locations[0];

  if (!active) return null;

  return (
    <section id="locations" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            Vores afdelinger
          </h2>
          {locations.length > 1 && (
            <div className="hidden gap-2 md:flex">
              {locations.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setActiveId(l.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    l.id === active.id
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {shortName(l.name)}
                </button>
              ))}
            </div>
          )}
        </div>

        {locations.length > 1 && (
          <div className="mt-5 flex gap-2 overflow-x-auto md:hidden">
            {locations.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setActiveId(l.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  l.id === active.id
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700"
                }`}
              >
                {shortName(l.name)}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50">
          <div className="grid md:grid-cols-2">
            <MapEmbed location={active} />
            <LocationInfo location={active} />
          </div>
        </div>
      </div>
    </section>
  );
}

function MapEmbed({ location }: { location: LocationCardData }) {
  // OpenStreetMap embed — no API key, no tracking.
  if (location.lat == null || location.lng == null) {
    return (
      <div className="flex aspect-square items-center justify-center bg-zinc-100 text-zinc-400 md:aspect-auto">
        Kortvisning er ikke tilgængelig
      </div>
    );
  }
  const bbox = `${location.lng - 0.005},${location.lat - 0.003},${location.lng + 0.005},${location.lat + 0.003}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${location.lat},${location.lng}`;
  return (
    <iframe
      src={src}
      title={`Kort over ${location.name}`}
      className="aspect-square w-full border-0 md:aspect-auto md:h-[420px]"
      loading="lazy"
    />
  );
}

function LocationInfo({ location }: { location: LocationCardData }) {
  const directionsUrl =
    location.lat != null && location.lng != null
      ? `https://www.openstreetmap.org/directions?to=${location.lat},${location.lng}`
      : null;

  return (
    <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
      <div>
        <p className="text-sm font-medium text-zinc-500">{shortName(location.name)}</p>
        <h3 className="mt-1 text-2xl font-bold text-zinc-900">{location.city}</h3>

        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Adresse
            </dt>
            <dd className="mt-1 text-sm text-zinc-800">
              {location.addressLine1}
              {location.addressLine2 ? <><br />{location.addressLine2}</> : null}
              <br />
              {location.postalCode} {location.city}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Kontakt
            </dt>
            <dd className="mt-1 space-y-1 text-sm text-zinc-800">
              {location.phone && (
                <div>
                  <a href={`tel:${location.phone}`} className="hover:underline">
                    {location.phone}
                  </a>
                </div>
              )}
              {location.email && (
                <div>
                  <a
                    href={`mailto:${location.email}`}
                    className="hover:underline"
                  >
                    {location.email}
                  </a>
                </div>
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-5">
        <div className="text-sm">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              location.isOpenNow
                ? "bg-[oklch(0.92_0.08_145)] text-[oklch(0.32_0.13_145)]"
                : "bg-zinc-200 text-zinc-700"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                location.isOpenNow ? "bg-[oklch(0.55_0.18_145)]" : "bg-zinc-500"
              }`}
            />
            {location.todayLabel}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:border-zinc-400"
            >
              Rute
            </a>
          )}
          <a
            href="/menu"
            className="rounded-full bg-[oklch(0.72_0.18_45)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[oklch(0.66_0.18_45)]"
          >
            Bestil online
          </a>
        </div>
      </div>
    </div>
  );
}

function shortName(name: string): string {
  // "Acme Bistro - Nørrebro" → "Nørrebro"
  return name.includes(" - ") ? name.split(" - ").slice(1).join(" - ") : name;
}
