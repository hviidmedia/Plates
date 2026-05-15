"use client";

import { useState } from "react";

type Step = 1 | 2 | "done";

type Role = "owner" | "service-provider" | "other";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "owner", label: "Jeg ejer eller driver en restaurant" },
  { value: "service-provider", label: "Jeg leverer services til restauranter" },
  { value: "other", label: "Andet" },
];

export function DemoForm() {
  const [step, setStep] = useState<Step>(1);
  const [restaurantName, setRestaurantName] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  if (step === "done") {
    return <DoneState name={name} />;
  }

  return (
    <div>
      <div className="mb-6 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Step {step} af 2
      </div>

      {step === 1 ? (
        <Step1
          restaurantName={restaurantName}
          setRestaurantName={setRestaurantName}
          role={role}
          setRole={setRole}
          onNext={() => setStep(2)}
        />
      ) : (
        <Step2
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          onBack={() => setStep(1)}
          onSubmit={() => setStep("done")}
        />
      )}
    </div>
  );
}

function Step1({
  restaurantName,
  setRestaurantName,
  role,
  setRole,
  onNext,
}: {
  restaurantName: string;
  setRestaurantName: (v: string) => void;
  role: Role | "";
  setRole: (v: Role) => void;
  onNext: () => void;
}) {
  const canContinue = restaurantName.trim().length >= 2 && role !== "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canContinue) onNext();
      }}
    >
      <h2 className="text-2xl font-bold text-zinc-900">
        Fortæl os lidt om din restaurant
      </h2>
      <p className="mt-2 text-sm text-zinc-600">
        Så skræddersyer vi demoen til dit køkken og lokale marked.
      </p>

      <div className="mt-6 space-y-5">
        <Field label="Restaurant-navn">
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="Acme Bistro"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base outline-none placeholder:text-zinc-400 focus:border-[oklch(0.45_0.16_145)]"
            autoComplete="organization"
          />
          <p className="mt-1.5 text-xs text-zinc-500">
            Begynd at skrive, og vælg fra listen hvis vi finder din restaurant.
          </p>
        </Field>

        <Field label="Hvad beskriver dig bedst?">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base outline-none focus:border-[oklch(0.45_0.16_145)]"
          >
            <option value="" disabled>
              Vælg en…
            </option>
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <button
        type="submit"
        disabled={!canContinue}
        className="mt-8 w-full rounded-full bg-[oklch(0.45_0.16_145)] py-3.5 text-base font-medium text-white transition hover:bg-[oklch(0.40_0.16_145)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Fortsæt →
      </button>
    </form>
  );
}

function Step2({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  onBack,
  onSubmit,
}: {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const canSubmit = name.trim().length >= 2 && email.includes("@");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
    >
      <h2 className="text-2xl font-bold text-zinc-900">
        Næsten klar — hvor kan vi nå dig?
      </h2>
      <p className="mt-2 text-sm text-zinc-600">
        En af vores rådgivere ringer indenfor en arbejdsdag.
      </p>

      <div className="mt-6 space-y-5">
        <Field label="Dit navn">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Anders Hansen"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base outline-none placeholder:text-zinc-400 focus:border-[oklch(0.45_0.16_145)]"
            autoComplete="name"
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="anders@restaurant.dk"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base outline-none placeholder:text-zinc-400 focus:border-[oklch(0.45_0.16_145)]"
            autoComplete="email"
          />
        </Field>

        <Field label="Telefon (valgfri)">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+45 20 12 34 56"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base outline-none placeholder:text-zinc-400 focus:border-[oklch(0.45_0.16_145)]"
            autoComplete="tel"
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-8 w-full rounded-full bg-[oklch(0.45_0.16_145)] py-3.5 text-base font-medium text-white transition hover:bg-[oklch(0.40_0.16_145)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Book min demo
      </button>
      <button
        type="button"
        onClick={onBack}
        className="mt-3 w-full text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← Tilbage
      </button>
    </form>
  );
}

function DoneState({ name }: { name: string }) {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[oklch(0.92_0.05_145)] text-[oklch(0.40_0.16_145)]">
        <svg
          viewBox="0 0 24 24"
          className="size-7 fill-none stroke-current"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12 5 5L20 7" />
        </svg>
      </div>
      <h2 className="mt-5 text-2xl font-bold text-zinc-900">
        Tak, {name.split(" ")[0] || "vi har dig"}!
      </h2>
      <p className="mt-2 text-sm text-zinc-600">
        En rådgiver fra Plates ringer dig op indenfor en arbejdsdag. Imens kan
        du allerede begynde at bygge dit site selv.
      </p>
      <a
        href="/start"
        className="mt-6 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Byg selv i mens
      </a>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-700">
        {label}
      </span>
      {children}
    </label>
  );
}
