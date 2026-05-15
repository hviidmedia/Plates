"use client";

import { useState, useTransition } from "react";
import { cn } from "@plates/ui";
import {
  aiImproveDescriptionAction,
  aiSuggestDishesAction,
  checkSubdomainAvailability,
  submitSignupIntentAction,
} from "@/lib/onboarding-actions";
import {
  COUNTRIES,
  LOCALES,
  VIBES,
  type WizardMenuItem,
  type WizardState,
  type WizardStep,
} from "./types";

type Props = {
  state: WizardState;
  setState: (next: WizardState) => void;
  step: WizardStep;
  setStep: (s: WizardStep) => void;
};

export function WizardMode({ state, setState, step, setStep }: Props) {
  return (
    <div className="space-y-6">
      <StepIndicator step={step} />
      {step === "info" && (
        <InfoStep state={state} setState={setState} onNext={() => setStep("menu")} />
      )}
      {step === "menu" && (
        <MenuStep
          state={state}
          setState={setState}
          onBack={() => setStep("info")}
          onNext={() => setStep("review")}
        />
      )}
      {step === "review" && (
        <ReviewStep
          state={state}
          setState={setState}
          onBack={() => setStep("menu")}
        />
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: WizardStep }) {
  const steps: { key: WizardStep; label: string }[] = [
    { key: "info", label: "Om dig" },
    { key: "menu", label: "Menu" },
    { key: "review", label: "Lancer" },
  ];
  const idx = steps.findIndex((s) => s.key === step);
  return (
    <ol className="flex items-center gap-2 text-xs">
      {steps.map((s, i) => (
        <li key={s.key} className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-full font-semibold",
              i <= idx
                ? "bg-[oklch(0.45_0.16_145)] text-white"
                : "bg-zinc-100 text-zinc-500",
            )}
          >
            {i + 1}
          </span>
          <span className={cn(i === idx ? "font-medium" : "text-zinc-500")}>
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <span className="mx-1 h-px w-6 bg-zinc-200" />
          )}
        </li>
      ))}
    </ol>
  );
}

// ─── Step 1: Info ────────────────────────────────────────────────────────────

function InfoStep({
  state,
  setState,
  onNext,
}: {
  state: WizardState;
  setState: (next: WizardState) => void;
  onNext: () => void;
}) {
  const update = <K extends keyof WizardState>(key: K, value: WizardState[K]) =>
    setState({ ...state, [key]: value });

  const canContinue =
    state.restaurantName.trim().length > 0 && state.city.trim().length > 0;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold tracking-tight">
        Fortæl os om din restaurant
      </h2>

      <Field label="Restaurant-navn">
        <input
          type="text"
          value={state.restaurantName}
          onChange={(e) => update("restaurantName", e.target.value)}
          placeholder="Acme Bistro"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-zinc-900"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="By">
          <input
            type="text"
            value={state.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="København"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-zinc-900"
          />
        </Field>
        <Field label="Land">
          <select
            value={state.country}
            onChange={(e) => update("country", e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 outline-none focus:border-zinc-900"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Køkken-type">
        <input
          type="text"
          value={state.cuisineType}
          onChange={(e) => update("cuisineType", e.target.value)}
          placeholder="f.eks. Mexicansk, Italiensk, Nordisk fusion"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-zinc-900"
        />
      </Field>

      <Field label="Brand-vibe">
        <div className="flex flex-wrap gap-2">
          {VIBES.map((vibe) => (
            <button
              key={vibe}
              type="button"
              onClick={() => update("brandVibe", vibe)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm",
                state.brandVibe === vibe
                  ? "border-[oklch(0.45_0.16_145)] bg-[oklch(0.95_0.04_145)] text-[oklch(0.30_0.16_145)]"
                  : "border-zinc-200 hover:border-zinc-400",
              )}
            >
              {vibe}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Sprog på siden">
        <select
          value={state.locale}
          onChange={(e) => update("locale", e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 outline-none focus:border-zinc-900"
        >
          {LOCALES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-40"
        >
          Næste — menu
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Menu ────────────────────────────────────────────────────────────

function MenuStep({
  state,
  setState,
  onBack,
  onNext,
}: {
  state: WizardState;
  setState: (next: WizardState) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [isSuggesting, startSuggesting] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const addItem = () => {
    const id = crypto.randomUUID();
    setState({
      ...state,
      menuItems: [
        ...state.menuItems,
        { id, name: "", description: "", category: "Hovedretter", priceCents: 0 },
      ],
    });
  };

  const removeItem = (id: string) =>
    setState({ ...state, menuItems: state.menuItems.filter((i) => i.id !== id) });

  const updateItem = (id: string, patch: Partial<WizardMenuItem>) =>
    setState({
      ...state,
      menuItems: state.menuItems.map((i) =>
        i.id === id ? { ...i, ...patch } : i,
      ),
    });

  const suggestDishes = () => {
    setError(null);
    startSuggesting(async () => {
      try {
        const dishes = await aiSuggestDishesAction(
          {
            restaurantName: state.restaurantName,
            city: state.city,
            country: state.country,
            cuisineType: state.cuisineType,
            locale: state.locale,
          },
          8,
        );
        const newItems: WizardMenuItem[] = dishes.map((d) => ({
          id: crypto.randomUUID(),
          name: d.name,
          description: d.description,
          category: d.category,
          priceCents: d.suggestedPriceCents,
        }));
        setState({ ...state, menuItems: [...state.menuItems, ...newItems] });
      } catch (e) {
        setError(e instanceof Error ? e.message : "AI-forslag fejlede");
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Byg din menu</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Tilføj retter manuelt, eller lad AI foreslå et udgangspunkt baseret på
            dit køkken.
          </p>
        </div>
        <button
          type="button"
          onClick={suggestDishes}
          disabled={isSuggesting || !state.cuisineType}
          className="flex shrink-0 items-center gap-2 rounded-full bg-[oklch(0.45_0.16_145)] px-4 py-2 text-sm font-medium text-white hover:bg-[oklch(0.40_0.16_145)] disabled:opacity-40"
          title={!state.cuisineType ? "Tilføj køkken-type i forrige trin" : undefined}
        >
          ✨ {isSuggesting ? "Foreslår..." : "Foreslå retter med AI"}
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {state.menuItems.map((item) => (
          <MenuItemEditor
            key={item.id}
            item={item}
            ctx={state}
            onChange={(patch) => updateItem(item.id, patch)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="w-full rounded-xl border border-dashed border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50"
      >
        + Tilføj ret manuelt
      </button>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-zinc-600 hover:text-zinc-900"
        >
          ← Tilbage
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={state.menuItems.length === 0}
          className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-40"
        >
          Næste — lancer
        </button>
      </div>
    </div>
  );
}

function MenuItemEditor({
  item,
  ctx,
  onChange,
  onRemove,
}: {
  item: WizardMenuItem;
  ctx: WizardState;
  onChange: (patch: Partial<WizardMenuItem>) => void;
  onRemove: () => void;
}) {
  const [isImproving, startImproving] = useTransition();

  const improve = () => {
    if (!item.name) return;
    startImproving(async () => {
      try {
        const improved = await aiImproveDescriptionAction(
          {
            restaurantName: ctx.restaurantName,
            city: ctx.city,
            country: ctx.country,
            cuisineType: ctx.cuisineType,
            locale: ctx.locale,
          },
          { name: item.name, rawDescription: item.description },
        );
        onChange({ description: improved });
      } catch {
        // swallow — surfaced via the error state on parent if needed
      }
    });
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={item.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Navn på ret"
            className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 font-medium outline-none focus:border-zinc-900"
          />
          <div className="relative">
            <textarea
              value={item.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Kort beskrivelse..."
              rows={2}
              className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-1.5 pr-24 text-sm outline-none focus:border-zinc-900"
            />
            <button
              type="button"
              onClick={improve}
              disabled={isImproving || !item.name}
              className="absolute bottom-1.5 right-1.5 rounded-full bg-[oklch(0.95_0.04_145)] px-2.5 py-1 text-xs font-medium text-[oklch(0.30_0.16_145)] hover:bg-[oklch(0.92_0.06_145)] disabled:opacity-40"
              title={!item.name ? "Skriv først et navn" : "Lad AI forbedre beskrivelsen"}
            >
              ✨ {isImproving ? "..." : "Forbedre"}
            </button>
          </div>
        </div>
        <div className="flex w-32 flex-col gap-2">
          <input
            type="text"
            value={item.category}
            onChange={(e) => onChange({ category: e.target.value })}
            placeholder="Kategori"
            className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm outline-none focus:border-zinc-900"
          />
          <div className="relative">
            <input
              type="number"
              value={(item.priceCents / 100).toFixed(0)}
              onChange={(e) =>
                onChange({ priceCents: Math.round(parseFloat(e.target.value || "0") * 100) })
              }
              placeholder="0"
              className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 pr-8 text-sm outline-none focus:border-zinc-900"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
              €
            </span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-zinc-400 hover:text-red-600"
          >
            Slet
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Review ──────────────────────────────────────────────────────────

function ReviewStep({
  state,
  setState,
  onBack,
}: {
  state: WizardState;
  setState: (next: WizardState) => void;
  onBack: () => void;
}) {
  const [isChecking, startChecking] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();
  const [check, setCheck] = useState<{ available: boolean; reason?: string; suggestion?: string } | null>(null);
  const [result, setResult] = useState<{ subdomain: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const slugify = (s: string) =>
    s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32);

  const ensureSubdomain = () => {
    if (!state.subdomain && state.restaurantName) {
      setState({ ...state, subdomain: slugify(state.restaurantName) });
    }
  };

  const checkAvailability = () => {
    startChecking(async () => {
      const r = await checkSubdomainAvailability(state.subdomain);
      setCheck(r);
    });
  };

  const submit = () => {
    setError(null);
    startSubmitting(async () => {
      const r = await submitSignupIntentAction(state);
      if (r.ok) setResult({ subdomain: r.subdomain });
      else setError(r.error);
    });
  };

  if (result) {
    return (
      <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          ✓
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Din side er reserveret
        </h2>
        <p className="text-zinc-700">
          Vi har gemt dit site på{" "}
          <code className="rounded bg-white px-2 py-0.5 font-mono text-sm">
            {result.subdomain}.counter.app
          </code>
          . Vi sender dig en email når du kan logge ind og lancere det.
        </p>
        <p className="text-xs text-zinc-500">
          (Login + admin lander i næste opdatering. Indtil da venter dit content sikkert hos os.)
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold tracking-tight">
        Lancer dit site
      </h2>
      <p className="text-sm text-zinc-600">
        Vælg dit subdomain og giv os din email — vi reserverer dit site og kontakter dig når admin er klar.
      </p>

      <Field label="Email">
        <input
          type="email"
          value={state.email}
          onChange={(e) => setState({ ...state, email: e.target.value })}
          placeholder="dig@restaurant.dk"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-zinc-900"
        />
      </Field>

      <Field label="Subdomain">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center rounded-lg border border-zinc-200 px-3 py-2 focus-within:border-zinc-900">
            <input
              type="text"
              value={state.subdomain}
              onFocus={ensureSubdomain}
              onChange={(e) => {
                setState({ ...state, subdomain: e.target.value.toLowerCase() });
                setCheck(null);
              }}
              placeholder="acme-bistro"
              className="flex-1 bg-transparent outline-none"
            />
            <span className="text-sm text-zinc-400">.counter.app</span>
          </div>
          <button
            type="button"
            onClick={checkAvailability}
            disabled={isChecking || !state.subdomain}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-40"
          >
            {isChecking ? "Tjekker..." : "Tjek"}
          </button>
        </div>
        {check && (
          <p
            className={cn(
              "mt-2 text-xs",
              check.available ? "text-emerald-700" : "text-red-700",
            )}
          >
            {check.available
              ? "✓ Ledig — dit site reserveres ved submit"
              : check.reason === "taken"
                ? `Optaget. Prøv ${check.suggestion}`
                : check.reason === "reserved"
                  ? "Reserveret af systemet"
                  : "Ugyldigt — brug a-z, 0-9, bindestreg (3-32 tegn)"}
          </p>
        )}
      </Field>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-zinc-600 hover:text-zinc-900"
        >
          ← Tilbage
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={isSubmitting || !state.email || !state.subdomain || !check?.available}
          className="rounded-full bg-[oklch(0.45_0.16_145)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[oklch(0.40_0.16_145)] disabled:opacity-40"
        >
          {isSubmitting ? "Reserverer..." : "Reserver mit site"}
        </button>
      </div>
    </div>
  );
}

// ─── Field helper ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</span>
      {children}
    </label>
  );
}
