import type { Metadata } from "next";
import Link from "next/link";
import {
  MarketingFinalCta,
  MarketingFooter,
  MarketingNav,
} from "@/components/marketing/shared";

export const metadata: Metadata = {
  title: "Priser · Plates",
  description:
    "Én pris, ingen kommission. €399/måned for hele platformen: website, bestilling, AI-SEO, marketing. Spar €36.000+/år vs. leverings-apps.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <MarketingNav current="pricing" />
      <Hero />
      <Plan />
      <Comparison />
      <Faq />
      <MarketingFinalCta
        headline="Prøv det gratis i 14 dage."
        body="Få et live udkast af din restaurants website på 60 sekunder. Ingen kreditkort, ingen binding."
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
          Priser
        </p>
        <h1 className="mt-4 text-balance text-5xl font-bold tracking-tight md:text-6xl">
          Én pris.{" "}
          <span className="text-[oklch(0.45_0.16_145)]">Nul kommission.</span>
        </h1>
        <p className="mt-6 text-balance text-lg text-zinc-700 md:text-xl">
          €399/måned for hele platformen. Ingen ordregebyrer, ingen procenter, ingen
          opstartomkostninger. Restauranter ejer deres data og kunderelationer.
        </p>
      </div>
    </section>
  );
}

// ─── Plan card ───────────────────────────────────────────────────────────────

function Plan() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="bg-[oklch(0.97_0.04_145)] px-8 py-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.45_0.16_145)]">
              Plates Standard
            </p>
            <p className="mt-3 text-6xl font-bold tracking-tight">
              €399
              <span className="text-2xl font-medium text-zinc-500">/md</span>
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Faktureres månedligt · annuller når som helst
            </p>
          </div>
          <div className="px-8 py-10">
            <ul className="space-y-3.5 text-sm text-zinc-800">
              {[
                "Branded website på dit eget domæne",
                "Direct ordering — pickup, levering, planlagte ordrer",
                "AI-genererede lokale SEO-sider (op til 50 nabolag)",
                "Marketing-automation: email, SMS, opfølgning",
                "Mobil-app til dine fastkunder (iOS + Android)",
                "CRM med kunde-database og ordrehistorik",
                "Stripe + MobilePay + iDEAL + Bancontact",
                "EU data-residency, GDPR-native",
                "24/7 support på dansk, engelsk, tysk",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/demo"
              className="mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-[oklch(0.72_0.18_45)] py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[oklch(0.66_0.18_45)]"
            >
              Book en gratis demo
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/start"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 py-3.5 text-base font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Eller byg dit udkast selv
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-0.5 size-5 shrink-0 fill-[oklch(0.45_0.16_145)]"
      aria-hidden
    >
      <path d="M16.704 5.296a1 1 0 0 1 0 1.408l-8 8a1 1 0 0 1-1.408 0l-4-4a1 1 0 0 1 1.408-1.408L8 12.592l7.296-7.296a1 1 0 0 1 1.408 0Z" />
    </svg>
  );
}

// ─── Comparison ──────────────────────────────────────────────────────────────

function Comparison() {
  return (
    <section className="bg-zinc-50 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.45_0.16_145)]">
            Sammenligning
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Spar over <span className="text-red-600">€36.000</span> om året
            <br className="hidden md:inline" /> vs. Wolt og Uber Eats
          </h2>
          <p className="mt-5 text-balance text-lg text-zinc-700">
            Eksempel: 1.500 ordrer/måned, gennemsnit €25 pr. ordre.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-6 py-4 text-left font-semibold text-zinc-700">
                  Måned
                </th>
                <th className="px-6 py-4 text-right font-semibold text-zinc-700">
                  Wolt / Uber Eats
                </th>
                <th className="px-6 py-4 text-right font-semibold text-[oklch(0.45_0.16_145)]">
                  Plates
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <Row label="Ordrevolumen" left="1.500 × €25 = €37.500" right="1.500 × €25 = €37.500" />
              <Row
                label="Kommission"
                left={<span className="text-red-600">−€11.250 (30%)</span>}
                right={<span className="text-emerald-700">€0</span>}
              />
              <Row label="Software" left="Inkluderet" right="−€399" />
              <Row
                label="Tilbage til restauranten"
                left={<span className="font-semibold">€26.250</span>}
                right={
                  <span className="font-semibold text-[oklch(0.45_0.16_145)]">
                    €37.101
                  </span>
                }
                bold
              />
              <Row
                label="Forskel — pr. måned"
                left=""
                right={
                  <span className="text-xl font-bold text-[oklch(0.45_0.16_145)]">
                    +€10.851
                  </span>
                }
                bold
              />
              <Row
                label="Forskel — pr. år"
                left=""
                right={
                  <span className="text-xl font-bold text-[oklch(0.45_0.16_145)]">
                    +€130.212
                  </span>
                }
                bold
              />
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Tal baseret på Wolt's offentlige gebyrstruktur (30% kommission) og 1.500
          ordrer/md. Din opsparing afhænger af volumen og leveringsmix.
        </p>
      </div>
    </section>
  );
}

function Row({
  label,
  left,
  right,
  bold,
}: {
  label: string;
  left: React.ReactNode;
  right: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <tr className={bold ? "bg-zinc-50/50" : undefined}>
      <td className={`px-6 py-4 ${bold ? "font-semibold text-zinc-900" : "text-zinc-700"}`}>
        {label}
      </td>
      <td className="px-6 py-4 text-right text-zinc-700">{left}</td>
      <td className="px-6 py-4 text-right">{right}</td>
    </tr>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function Faq() {
  const items = [
    {
      q: "Er der opstartomkostninger?",
      a: "Nej. Du betaler €399 fra den måned dit site går live. Vi hjælper med opsætning og menu-import gratis.",
    },
    {
      q: "Hvad hvis vi har flere afdelinger?",
      a: "Den første afdeling er inkluderet. Hver yderligere afdeling koster €99/md og deler kundedatabase, brand, ordreflow.",
    },
    {
      q: "Hvor lang opsigelse?",
      a: "Ingen. Sig op når som helst — du har ingen binding. Dine data bliver hos dig, ikke os.",
    },
    {
      q: "Kan vi beholde vores Wolt-konto sideløbende?",
      a: "Selvfølgelig. Mange restauranter bruger leverings-apps som et ekstra salgsled men gør Plates til deres primære. Du beslutter hvor du vil sende kunderne hen.",
    },
    {
      q: "Hvilke betalingsudbydere understøtter I?",
      a: "Stripe (kort), MobilePay (DK/FI), iDEAL (NL), Bancontact (BE), Vipps (NO/SE), kontant ved afhentning. Alle EU-DPA-bekræftede.",
    },
    {
      q: "Er det GDPR-compliant?",
      a: "Ja. Vi kører alt på Cloudflare's EU-edge, har ingen US-trackere på kundesider, og leverer signeret DPA. Right to erasure er bygget ind i schema'et.",
    },
  ];
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Ofte stillede spørgsmål
        </h2>
        <div className="mt-10 space-y-3">
          {items.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-zinc-200 bg-white px-6 py-4 open:bg-zinc-50"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium text-zinc-900">
                {item.q}
                <span
                  className="text-2xl text-zinc-400 transition group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
