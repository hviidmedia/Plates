import type { Metadata } from "next";
import Link from "next/link";
import {
  MarketingFinalCta,
  MarketingFooter,
  MarketingNav,
  Stars,
} from "@/components/marketing/shared";

export const metadata: Metadata = {
  title: "Kunder · Plates",
  description:
    "1.000+ restauranter i Danmark, Sverige, Norge, Tyskland og Holland bruger Plates. Se hvordan de øgede deres direkte salg og slap fri af leverings-apps.",
};

type Story = {
  slug: string;
  name: string;
  city: string;
  cuisine: string;
  quote: string;
  author: string;
  role: string;
  metric: { value: string; label: string };
  badge: string;
};

const STORIES: Story[] = [
  {
    slug: "somos-oaxaca",
    name: "Somos Oaxaca",
    city: "København",
    cuisine: "Mexicansk",
    quote:
      "Plates gør online-marketing nemt. De er hemmeligheden bag vores online-succes.",
    author: "Yuliana Vasquez",
    role: "Ejer",
    metric: { value: "+€8.400", label: "ekstra direct-orders pr. md" },
    badge: "Fra Wolt-eksklusiv til 60% direkte",
  },
  {
    slug: "trattoria-malmo",
    name: "Trattoria Vasa",
    city: "Malmö",
    cuisine: "Italiensk",
    quote:
      "Vi gik fra rank #14 til rank #2 på 'pasta Malmö' på fire måneder. Ingen agentur, bare AI-genererede landings.",
    author: "Marco Bianchi",
    role: "Stifter",
    metric: { value: "#14 → #2", label: "Google-rank på key søgeord" },
    badge: "SEO-vinder",
  },
  {
    slug: "kebab-eckhart",
    name: "Eckhart Kebab",
    city: "Berlin",
    cuisine: "Tyrkisk",
    quote:
      "Min mor driver butikken. Hun forstod Plates på 10 minutter. Det er det bedste vi kan sige om noget software.",
    author: "Aslan Eckhart",
    role: "Familie-restaurant, 2. generation",
    metric: { value: "2.100", label: "ordrer på 30 dage, første måned" },
    badge: "Familie-drevet",
  },
  {
    slug: "fika-stockholm",
    name: "Fika & Co.",
    city: "Stockholm",
    cuisine: "Brunch & kaffe",
    quote:
      "Vi sparede 28.000 SEK i kommission den første måned. Det betalte for software 6× over.",
    author: "Linnea Holm",
    role: "Co-founder",
    metric: { value: "−€2.800/md", label: "i kommissions-besparelse" },
    badge: "ROI på 7 dage",
  },
  {
    slug: "amsterdamse-fries",
    name: "Amsterdamse Fries",
    city: "Amsterdam",
    cuisine: "Street food",
    quote:
      "Mobil-appen var en game-changer. 38% af alle ordrer kommer fra fastkunder der har den installeret.",
    author: "Daan Visser",
    role: "Driftsleder",
    metric: { value: "38%", label: "ordrer fra mobil-app" },
    badge: "App-tunge fastkunder",
  },
  {
    slug: "oslo-nordic",
    name: "Nordisk Hjørne",
    city: "Oslo",
    cuisine: "Nordisk fusion",
    quote:
      "Vi forsøgte 3 andre platforme før Plates. Det her er den eneste der forstår at Wolt ikke er en partner — det er en konkurrent.",
    author: "Henrik Solberg",
    role: "Chef + ejer",
    metric: { value: "100%", label: "ordrer er nu direkte" },
    badge: "Cut the apps",
  },
];

export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <MarketingNav current="customers" />
      <Hero />
      <Logos />
      <StoriesGrid />
      <BigQuote />
      <MarketingFinalCta
        headline="Bliv den næste case-study."
        body="Restauranter i 5 EU-lande bruger Plates til at vinde tilbage. Det tager 60 sekunder at se hvad det betyder for dig."
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
          Kunder
        </p>
        <h1 className="mt-4 text-balance text-5xl font-bold tracking-tight md:text-6xl">
          1.000+ restauranter har sagt{" "}
          <span className="text-[oklch(0.45_0.16_145)]">farvel til 30%.</span>
        </h1>
        <Stars rating={4.8} label="baseret på 1.247 anmeldelser" />
        <p className="mt-6 text-balance text-lg text-zinc-700">
          Fra streetfood-vogne i Amsterdam til familie-drevne kebab-butikker i
          Berlin. Her er hvordan de gjorde.
        </p>
      </div>
    </section>
  );
}

// ─── Logo row ────────────────────────────────────────────────────────────────

function Logos() {
  return (
    <section className="border-b border-zinc-100 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Restauranter i Danmark, Sverige, Norge, Tyskland og Holland
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
          {STORIES.map((s) => (
            <span key={s.slug} className="text-base font-semibold text-zinc-700">
              {s.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stories grid ────────────────────────────────────────────────────────────

function StoriesGrid() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <article className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:border-zinc-300 hover:shadow-md">
      <span className="inline-flex w-fit rounded-full bg-[oklch(0.97_0.04_145)] px-3 py-1 text-xs font-semibold text-[oklch(0.35_0.13_145)]">
        {story.badge}
      </span>

      <blockquote className="mt-5 grow text-base leading-relaxed text-zinc-800">
        “{story.quote}”
      </blockquote>

      <div className="mt-6 flex items-center gap-3">
        <div
          className="size-10 shrink-0 rounded-full bg-gradient-to-br from-[oklch(0.7_0.12_60)] to-[oklch(0.5_0.16_45)]"
          aria-hidden
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {story.author}
          </p>
          <p className="truncate text-xs text-zinc-500">
            {story.role} · {story.name}
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-zinc-100 pt-5">
        <div className="flex items-end justify-between gap-3">
          <p className="text-2xl font-bold text-[oklch(0.45_0.16_145)]">
            {story.metric.value}
          </p>
          <p className="max-w-[60%] text-right text-xs text-zinc-500">
            {story.metric.label}
          </p>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          {story.cuisine} · {story.city}
        </p>
      </div>
    </article>
  );
}

// ─── Big quote ───────────────────────────────────────────────────────────────

function BigQuote() {
  return (
    <section className="bg-[oklch(0.97_0.04_145)] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <svg
          viewBox="0 0 24 24"
          className="mx-auto size-12 fill-[oklch(0.45_0.16_145)]/30"
          aria-hidden
        >
          <path d="M6 17h3l2-4V7H5v6h3l-2 4Zm8 0h3l2-4V7h-6v6h3l-2 4Z" />
        </svg>
        <blockquote className="mt-6 text-balance text-3xl font-medium leading-tight tracking-tight text-zinc-900 md:text-4xl">
          Vi kommer aldrig tilbage til Wolt. Plates er ikke bare en platform —
          det er den eneste der ser kunderne som vores, ikke deres.
        </blockquote>
        <p className="mt-8 text-sm font-semibold text-zinc-700">
          Yuliana Vasquez — Somos Oaxaca, København
        </p>
        <Link
          href="/demo"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[oklch(0.72_0.18_45)] px-7 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[oklch(0.66_0.18_45)]"
        >
          Book en demo
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
