import type { Metadata } from "next";
import Link from "next/link";
import {
  MarketingFinalCta,
  MarketingFooter,
  MarketingNav,
} from "@/components/marketing/shared";

export const metadata: Metadata = {
  title: "Om Plates · En europæisk restaurant-platform",
  description:
    "Vi bygger den europæiske restaurant-platform. EU data-residency, GDPR-native, ingen US-tracking. Lavet af folk der har drevet restauranter selv.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <MarketingNav current="about" />
      <Hero />
      <Story />
      <Values />
      <Stats />
      <MarketingFinalCta
        headline="Lavet i EU. Bygget til restauranter."
        body="Bliv en del af platformen der tager restaurantens side, ikke leverings-apps."
      />
      <MarketingFooter />
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-[oklch(0.97_0.02_80)] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.45_0.16_145)]">
          Om Plates
        </p>
        <h1 className="mt-4 text-balance text-5xl font-bold tracking-tight md:text-6xl">
          Vi tager{" "}
          <span className="text-[oklch(0.45_0.16_145)]">restaurantens</span>{" "}
          side.
        </h1>
        <p className="mt-6 text-balance text-lg text-zinc-700">
          Plates startede fordi vi var trætte af at se 30% af hver ordre forsvinde
          til Wolt og Uber Eats. Vi byggede den platform der gør det muligt for
          europæiske restauranter at eje deres eget online-salg.
        </p>
      </div>
    </section>
  );
}

// ─── Story ───────────────────────────────────────────────────────────────────

function Story() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl space-y-10 px-6">
        <Block
          eyebrow="2024 — Begyndelsen"
          title="Tre frustrationer, én løsning."
          body="Stifterne havde drevet restauranter selv. Vi vidste hvor frustrerende det er, at se 30% af hver Wolt-ordre forsvinde, at betale et bureau €5.000 for et site der aldrig opdateres, og at have kundedata spredt over fem værktøjer der ikke snakker sammen."
        />
        <Block
          eyebrow="2025 — Vores første kunder"
          title="Bygget med restauranter, ikke for dem."
          body="De første 50 restauranter var beta-brugere. De fortalte os hvad de havde brug for; vi byggede det. Det er stadig sådan vi udvikler — vores roadmap kommer fra hvad rigtige restauratører beder om hver uge."
        />
        <Block
          eyebrow="2026 — Hvor vi er nu"
          title="1.000+ restauranter i 5 EU-lande."
          body="Plates kører i Danmark, Sverige, Norge, Tyskland og Holland. Næste skridt: Frankrig, Spanien, Italien, og en åbnings-fokus på familie-drevne restauranter der hidtil har følt sig låst inde i Wolt-økosystemet."
        />
      </div>
    </section>
  );
}

function Block({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="border-l-4 border-[oklch(0.55_0.18_145)] pl-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.45_0.16_145)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-balance text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-zinc-700">{body}</p>
    </div>
  );
}

// ─── Values ──────────────────────────────────────────────────────────────────

function Values() {
  const items = [
    {
      title: "Restaurantens data tilhører restauranten",
      body: "Du kan eksportere alt — kunder, ordrer, menu — til CSV når som helst. Hvis du forlader os, går alt med dig.",
      icon: <ShieldIcon />,
    },
    {
      title: "EU data-residency, GDPR-native",
      body: "Alt kører på Cloudflare's EU-edge. Vi har ingen US-trackere på kunde-sider. Vi underskriver DPA inden første ordre.",
      icon: <EuIcon />,
    },
    {
      title: "Én pris, ingen procenter",
      body: "€399/md, faktureret månedligt, ingen binding. Ingen kommission pr. ordre. Hvis vi kunne gøre det billigere, ville vi.",
      icon: <PriceIcon />,
    },
    {
      title: "Bygget på open standards",
      body: "Vores schema er åbent dokumenteret. Vores AI-prompts er versions-styret. Vi vil gerne være den slags partner du kan stole på — også på den lange bane.",
      icon: <OpenIcon />,
    },
  ];
  return (
    <section className="bg-zinc-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.45_0.16_145)]">
            Værdier
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Hvad vi står for.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((v) => (
            <div
              key={v.title}
              className="rounded-3xl border border-zinc-200 bg-white p-7"
            >
              <div className="text-[oklch(0.45_0.16_145)]">{v.icon}</div>
              <h3 className="mt-4 text-lg font-bold tracking-tight">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7 fill-current" aria-hidden>
      <path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z" />
    </svg>
  );
}
function EuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-7 fill-none stroke-current"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
function PriceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-7 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 4v16M16 7H10a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8" />
    </svg>
  );
}
function OpenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-7 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 10v-2a4 4 0 1 0-8 0M4 10h16v10H4z" />
    </svg>
  );
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function Stats() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 text-center md:grid-cols-4">
          <Stat value="1.000+" label="Restauranter i EU" />
          <Stat value="5" label="Lande" />
          <Stat value="€12M+" label="Sparet i kommission" />
          <Stat value="0" label="US-trackere" />
        </div>
        <p className="mt-10 text-center text-sm text-zinc-500">
          Spørgsmål om Plates? Skriv til{" "}
          <Link href="/demo" className="underline hover:text-zinc-900">
            os
          </Link>{" "}
          eller læs vores{" "}
          <Link href="/privacy" className="underline hover:text-zinc-900">
            privatlivspolitik
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-4xl font-bold tracking-tight text-[oklch(0.45_0.16_145)] md:text-5xl">
        {value}
      </p>
      <p className="mt-2 text-sm text-zinc-600">{label}</p>
    </div>
  );
}
