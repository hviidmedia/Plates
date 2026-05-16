import type { Metadata } from "next";
import Link from "next/link";
import {
  MarketingFinalCta,
  MarketingFooter,
  MarketingNav,
} from "@/components/marketing/shared";

export const metadata: Metadata = {
  title: "Features · Plates",
  description:
    "Alt en restaurant har brug for: AI-genererede SEO-sider, direct ordering, marketing-automation, mobil-app, og CRM. Lavet til Europa.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <MarketingNav current="features" />
      <Hero />
      <FeatureSection
        eyebrow="01 · Website"
        title="Et website der ranker på Google — uden du rør det."
        body="Plates genererer en branded forside, menu-sider og 50+ lokale SEO-landingssider for dine nabolag. Hver side er optimeret med restaurant-schema og lokal kontekst Google forstår."
        bullets={[
          "AI-genererede side-titler, meta-beskrivelser og long-form-copy pr. nabolag",
          "Restaurant + MenuItem JSON-LD schema injiceret automatisk",
          "Per-tenant sitemap.xml + robots.txt",
          "Cloudflare Edge — under 100ms time-to-first-byte i hele Europa",
        ]}
        visual={<WebsiteVisual />}
      />
      <FeatureSection
        eyebrow="02 · Ordering"
        title="Direkte bestilling. 0% kommission. Altid."
        body="Kunder bestiller direkte på dit eget domæne. Du beholder hele beløbet (minus din betalings-udbyders gebyr ~1.5%). Pickup, levering, eller planlagte ordrer."
        bullets={[
          "Cookie-baseret kurv der persisterer i 7 dage",
          "Modifier-grupper (størrelse, tilbehør, allergier)",
          "Planlagte ordrer — bestil til frokost i morgen",
          "Stripe + MobilePay + iDEAL + Bancontact + Vipps",
        ]}
        visual={<OrderVisual />}
        flip
      />
      <FeatureSection
        eyebrow="03 · Marketing"
        title="Marketing-automation der genvinder kunder."
        body="Når en kunde ikke har bestilt i 30 dage, sender Plates dem automatisk et personligt tilbud. Email + SMS, alt med eksplicit GDPR-samtykke."
        bullets={[
          "Vinde-tilbage-flow (30/60/90 dage uden ordre)",
          "Fødselsdags-rabatter — automatisk",
          "Nyhedsmail om nye retter eller events",
          "A/B-test af subject lines med AI-forslag",
        ]}
        visual={<MarketingVisual />}
      />
      <FeatureSection
        eyebrow="04 · Mobil-app"
        title="Din egen branded app. Klar dag 1."
        body="Plates publicerer en hvid-mærket iOS + Android app under dit eget navn i App Store og Google Play. Push-notifikationer, payment-saved, fastkunde-rabatter."
        bullets={[
          "Hvid-mærket — dit ikon, dit navn, dit brand",
          "Push når ordren er klar",
          "Gemte betalingskort = 2-klik genbestilling",
          "Vi håndterer App Store / Play Store fornyelser",
        ]}
        visual={<AppVisual />}
        flip
      />
      <FeatureSection
        eyebrow="05 · CRM"
        title="Hver kunde, hver ordre, hver anmeldelse."
        body="Plates samler kunde-data fra alle kanaler — website, app, Google reviews, manuelle indtastninger — i én profil. Segmenter på frekvens, gennemsnits-ordre, sidste besøg."
        bullets={[
          "Live kundedatabase med ordrehistorik",
          "Segmenter: VIPs, on-the-brink, churn-risiko",
          "Google + Facebook reviews aggregeret automatisk",
          "Eksport til CSV når som helst — dine data, ikke vores",
        ]}
        visual={<CrmVisual />}
      />
      <FeatureSection
        eyebrow="06 · AI Audit"
        title="Få et live tjek af dine konkurrenters Google-rank."
        body="Indtast din restaurant — Plates trækker live data fra Google Maps, sammenligner med nærliggende konkurrenter, og fortæller dig præcist hvor du taber penge."
        bullets={[
          "Konkurrent-ranking på 40 lokale SEO-kriterier",
          "Konkrete tiltag (manglende søgeord, schema, fotos)",
          "Beregnet tab pr. måned i €",
          "Gratis — også uden Plates-abonnement",
        ]}
        visual={<AuditVisual />}
        flip
      />
      <MarketingFinalCta
        headline="Se det live på 60 sekunder."
        body="Skriv din restaurants navn. Vi laver et udkast på stedet."
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
          Features
        </p>
        <h1 className="mt-4 text-balance text-5xl font-bold tracking-tight md:text-6xl">
          Alt det din restaurant har brug for.{" "}
          <span className="text-[oklch(0.45_0.16_145)]">På ét sted.</span>
        </h1>
        <p className="mt-6 text-balance text-lg text-zinc-700">
          Website, bestilling, marketing, app, CRM, og AI-audit — bygget ind i
          hinanden. Ingen 4 forskellige integrationer, ingen Zapier-tape, ingen
          overflødig data-flytning.
        </p>
        <Link
          href="/demo"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[oklch(0.72_0.18_45)] px-7 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[oklch(0.66_0.18_45)]"
        >
          Få en gratis demo
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

// ─── Reusable feature section ───────────────────────────────────────────────

function FeatureSection({
  eyebrow,
  title,
  body,
  bullets,
  visual,
  flip,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <section className="border-b border-zinc-100 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20 ${
            flip ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.45_0.16_145)]">
              {eyebrow}
            </p>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h2>
            <p className="mt-5 text-balance text-lg leading-relaxed text-zinc-700">
              {body}
            </p>
            <ul className="mt-7 space-y-3 text-sm text-zinc-800">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <BulletDot />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center">{visual}</div>
        </div>
      </div>
    </section>
  );
}

function BulletDot() {
  return (
    <span
      className="mt-1.5 inline-block size-2 shrink-0 rounded-full bg-[oklch(0.55_0.18_145)]"
      aria-hidden
    />
  );
}

// ─── Visual placeholders (CSS-only mockups, no external assets) ─────────────

function WebsiteVisual() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-xl">
      <div className="flex items-center gap-1.5 border-b border-zinc-100 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-amber-400" />
        <span className="size-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 truncate rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-500">
          acme-bistro.com/places/norrebro
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div className="h-3 w-32 rounded bg-zinc-200" />
        <div className="h-6 w-3/4 rounded bg-zinc-900" />
        <div className="h-3 w-full rounded bg-zinc-100" />
        <div className="h-3 w-5/6 rounded bg-zinc-100" />
        <div className="mt-4 flex flex-wrap gap-1.5">
          {["Pasta", "Pizza", "Tacos", "Burgers"].map((t) => (
            <span
              key={t}
              className="rounded-full bg-[oklch(0.94_0.04_145)] px-2.5 py-1 text-xs font-medium text-[oklch(0.35_0.13_145)]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-zinc-100 px-5 py-3 text-xs text-zinc-500">
        Rank #1 · "pasta Nørrebro" · ★ 4.8
      </div>
    </div>
  );
}

function OrderVisual() {
  return (
    <div className="w-full max-w-sm space-y-2.5">
      {[
        { name: "Nørrebro Burger", price: "€12.90", status: "Modtaget" },
        { name: "Birria Tacos × 2", price: "€29.00", status: "Tilberedes" },
        { name: "Halloumi Bowl", price: "€11.50", status: "Klar" },
      ].map((o, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
        >
          <div>
            <p className="text-sm font-semibold text-zinc-900">{o.name}</p>
            <p className="text-xs text-zinc-500">{o.status}</p>
          </div>
          <span className="text-sm font-semibold text-[oklch(0.45_0.16_145)]">
            {o.price}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between rounded-2xl bg-[oklch(0.97_0.04_145)] p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.35_0.13_145)]">
          0% kommission
        </span>
        <span className="text-sm font-bold text-[oklch(0.35_0.13_145)]">
          €53.40 til dig
        </span>
      </div>
    </div>
  );
}

function MarketingVisual() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white shadow-xl">
      <div className="border-b border-zinc-100 px-5 py-3 text-xs text-zinc-500">
        Email · Vinde-tilbage
      </div>
      <div className="space-y-3 p-5">
        <p className="text-sm font-medium text-zinc-500">Til: Anna L.</p>
        <p className="text-lg font-bold text-zinc-900">
          Vi savner dig, Anna 🌮
        </p>
        <p className="text-sm leading-relaxed text-zinc-700">
          Det er 34 dage siden din sidste ordre. Her er en lille velkomst tilbage:
        </p>
        <div className="rounded-xl bg-[oklch(0.97_0.04_145)] p-4 text-center">
          <p className="text-2xl font-bold text-[oklch(0.35_0.13_145)]">
            −15%
          </p>
          <p className="text-xs text-[oklch(0.35_0.13_145)]">
            Gælder hele menuen, denne uge
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 text-xs">
        <span className="text-zinc-500">Sendt 09:00 · Åbnet</span>
        <span className="font-semibold text-emerald-700">+1 ordre</span>
      </div>
    </div>
  );
}

function AppVisual() {
  return (
    <div className="relative mx-auto h-[420px] w-[220px] rounded-[2.5rem] border-[10px] border-zinc-900 bg-white shadow-xl">
      <div className="absolute left-1/2 top-2 h-4 w-20 -translate-x-1/2 rounded-full bg-zinc-900" />
      <div className="space-y-2.5 p-4 pt-8">
        <div className="flex items-center gap-2">
          <div
            className="size-7 rounded-lg bg-[oklch(0.62_0.18_145)]"
            aria-hidden
          />
          <span className="text-sm font-semibold">Acme Bistro</span>
        </div>
        <div className="h-32 rounded-xl bg-gradient-to-br from-[oklch(0.7_0.15_45)] to-[oklch(0.4_0.15_30)]" />
        <p className="text-sm font-bold">Populært</p>
        <div className="space-y-1.5">
          <div className="h-10 rounded-lg bg-zinc-100" />
          <div className="h-10 rounded-lg bg-zinc-100" />
        </div>
      </div>
      <div className="absolute bottom-3 left-3 right-3 rounded-full bg-[oklch(0.72_0.18_45)] py-2.5 text-center text-xs font-semibold text-white">
        Bestil nu
      </div>
    </div>
  );
}

function CrmVisual() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-xl">
      <div className="flex items-center gap-3 border-b border-zinc-100 px-5 py-4">
        <div
          className="size-10 rounded-full bg-gradient-to-br from-[oklch(0.7_0.15_60)] to-[oklch(0.55_0.18_45)]"
          aria-hidden
        />
        <div>
          <p className="text-sm font-semibold">Anna Larsen</p>
          <p className="text-xs text-zinc-500">anna@example.com</p>
        </div>
        <span className="ml-auto rounded-full bg-[oklch(0.94_0.04_145)] px-2.5 py-1 text-xs font-semibold text-[oklch(0.35_0.13_145)]">
          VIP
        </span>
      </div>
      <div className="grid grid-cols-3 divide-x divide-zinc-100">
        <Stat label="Ordrer" value="47" />
        <Stat label="Gns." value="€24" />
        <Stat label="Total" value="€1.128" />
      </div>
      <div className="space-y-1.5 border-t border-zinc-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Sidste ordre
        </p>
        <p className="text-sm text-zinc-700">
          2 × Birria Tacos, 1 × Aperol Spritz · for 12 dage siden
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 text-center">
      <p className="text-lg font-bold text-zinc-900">{value}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );
}

function AuditVisual() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
        <p className="text-sm font-semibold">Lokal ranking · Pasta, Nørrebro</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.94_0.04_145)] px-2 py-0.5 text-[10px] font-semibold text-[oklch(0.35_0.13_145)]">
          <span className="size-1.5 animate-pulse rounded-full bg-[oklch(0.55_0.18_145)]" />
          LIVE
        </span>
      </div>
      <div className="divide-y divide-zinc-100">
        {[
          { rank: "1.", name: "Pasta Imperiale", score: "39/40" },
          { rank: "2.", name: "Trattoria Nord", score: "36/40" },
          { rank: "10.", name: "Din restaurant", score: "12/40", you: true },
        ].map((r) => (
          <div
            key={r.name}
            className={`flex items-center justify-between px-5 py-3 ${
              r.you ? "bg-amber-50" : ""
            }`}
          >
            <span className="flex items-center gap-3 text-sm">
              <span className="w-6 text-zinc-500">{r.rank}</span>
              <span
                className={r.you ? "font-semibold text-zinc-900" : "text-zinc-700"}
              >
                {r.name}
              </span>
            </span>
            <span
              className={`text-sm font-semibold ${
                r.you ? "text-amber-700" : "text-emerald-700"
              }`}
            >
              {r.score}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-100 px-5 py-3 text-xs text-zinc-600">
        Tab estimeret: <span className="font-semibold text-red-600">€450/md</span>
      </div>
    </div>
  );
}
