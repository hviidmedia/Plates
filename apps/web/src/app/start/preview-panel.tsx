"use client";

import type { WizardState } from "./types";
import { formatPrice } from "@/lib/format";

export function PreviewPanel({ state }: { state: WizardState }) {
  const grouped = groupByCategory(state.menuItems);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-4 py-2 text-xs text-zinc-500">
        <span className="font-mono">
          {state.subdomain || "din-restaurant"}.counter.app
        </span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
          Preview
        </span>
      </div>

      <div className="p-6">
        {state.restaurantName ? (
          <header className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Velkommen
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {state.restaurantName}
            </h1>
            {state.city && (
              <p className="mt-1 text-sm text-zinc-500">{state.city}</p>
            )}
            <button
              type="button"
              disabled
              className="mt-4 inline-flex cursor-not-allowed rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white"
            >
              Se hele menuen
            </button>
          </header>
        ) : (
          <Empty label="Tilføj restaurant-navn for at se preview" />
        )}

        {state.menuItems.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Menu
            </h2>
            <div className="space-y-6">
              {Object.entries(grouped).map(([category, items]) => (
                <section key={category}>
                  <h3 className="mb-2 text-base font-semibold">{category}</h3>
                  <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-100">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between gap-4 p-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{item.name}</p>
                          {item.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-sm font-semibold tabular-nums">
                          {formatPrice(item.priceCents, "EUR")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        )}

        {state.restaurantName && state.menuItems.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
            Tilføj retter for at se menuen i preview
          </div>
        )}
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-400">
      {label}
    </div>
  );
}

function groupByCategory<T extends { category: string }>(items: T[]) {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});
}
