import Link from "next/link";
import { cn } from "@plates/ui";

export function MarketingHome() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="border-b border-zinc-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="size-7 rounded-lg bg-[oklch(0.62_0.18_145)]" aria-hidden />
          Plates
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
          <Link href="#features" className="hover:text-zinc-900">Features</Link>
          <Link href="#how-it-works" className="hover:text-zinc-900">Sådan virker det</Link>
          <Link href="#pricing" className="hover:text-zinc-900">Priser</Link>
          <Link href="#faq" className="hover:text-zinc-900">FAQ</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm text-zinc-700 hover:text-zinc-900 md:inline">
            Log ind
          </Link>
          <Link
            href="/demo"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Få en gratis demo
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 text-center md:pt-24 md:pb-20">
        <Stars rating={4.8} label="1.000+ europæiske restauranter" />
        <h1 className="mt-6 text-balance text-5xl font-bold tracking-tight text-zinc-900 md:text-7xl">
          Du taber ordrer online.
          <br />
          <span className="text-[oklch(0.45_0.16_145)]">Brug AI til at se hvorfor.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-zinc-600 md:text-xl">
          Plates bygger din restaurants website, kører bestilling uden kommission og
          ranker dig på Google med AI-genererede lokale sider. Lavet til Europa.
        </p>

        <form
          id="demo"
          action="/start"
          method="get"
          className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-full border border-zinc-200 bg-white p-2 shadow-sm"
        >
          <input
            type="text"
            name="name"
            placeholder="Hvad hedder din restaurant?"
            required
            className="flex-1 bg-transparent px-4 py-2 text-base outline-none placeholder:text-zinc-400"
          />
          <button
            type="submit"
            className="flex size-10 items-center justify-center rounded-full bg-[oklch(0.45_0.16_145)] text-white transition hover:bg-[oklch(0.40_0.16_145)]"
            aria-label="Start onboarding"
          >
            <svg viewBox="0 0 20 20" className="size-5 fill-current" aria-hidden>
              <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A.75.75 0 0 0 4.42 8.7l5.836-.5a.5.5 0 0 1 0 .998l-5.836.5a.75.75 0 0 0-.726.537L2.28 15.16a.75.75 0 0 0 .95.95l13.5-5.625a.75.75 0 0 0 0-1.385L3.105 2.288Z" />
            </svg>
          </button>
        </form>
        <p className="mt-3 text-xs text-zinc-500">
          Byg din side på minutter. Ingen kreditkort, ingen binding.
        </p>
      </div>

      <AuditPreview />
    </section>
  );
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 text-sm text-zinc-600">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" className="size-5 fill-amber-400" aria-hidden>
            <path d="M9.05 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 0 0-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.366-2.445a1 1 0 0 0-1.176 0l-3.366 2.445c-.783.57-1.838-.197-1.538-1.118l1.286-3.957a1 1 0 0 0-.363-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 0 0 .951-.69L9.05 2.927Z" />
          </svg>
        ))}
      </div>
      <span className="font-medium text-zinc-900">{rating.toFixed(1)}</span>
      <span>· {label}</span>
    </div>
  );
}

function AuditPreview() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-20">
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-b from-[oklch(0.97_0.04_145)] to-white shadow-xl">
        <div className="border-b border-zinc-200 bg-white px-6 py-4">
          <p className="text-sm font-semibold text-zinc-900">Hvem slår dig på Google?</p>
        </div>
        <div className="divide-y divide-zinc-100">
          {[
            { rank: "1.", name: "Konkurrent 1", score: "39/40", rating: 4.8 },
            { rank: "2.", name: "Konkurrent 2", score: "39/40", rating: 4.0 },
            { rank: "3.", name: "Konkurrent 3", score: "39/40", rating: 3.1 },
            { rank: "10.", name: "Din restaurant", score: "12/40", rating: 4.9, you: true },
          ].map((row) => (
            <div
              key={row.name}
              className={cn(
                "flex items-center justify-between px-6 py-4",
                row.you && "bg-amber-50",
              )}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 text-sm font-medium text-zinc-500">{row.rank}</span>
                <div>
                  <p className="text-sm font-medium text-zinc-900">{row.name}</p>
                  <p className="text-xs text-zinc-500">★ {row.rating.toFixed(1)}</p>
                </div>
              </div>
              <span className={cn("text-sm font-semibold", row.you ? "text-amber-700" : "text-emerald-700")}>
                {row.score}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-200 bg-white px-6 py-5">
          <p className="text-sm font-semibold text-zinc-900">
            Du taber ca. <span className="text-red-600">€450/md</span> indtil du fixer:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-700">
            <li className="flex gap-2">
              <span className="text-red-500">▲</span>
              Du ranker ikke for 3 nærliggende områder konkurrenterne dækker.
            </li>
            <li className="flex gap-2">
              <span className="text-red-500">▲</span>
              Manglende søgeord i sidetitel — fx "Pizza Nørrebro".
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Social proof ────────────────────────────────────────────────────────────

function SocialProof() {
  return (
    <section className="border-y border-zinc-100 bg-zinc-50 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-sm text-zinc-500">
          Bruges af restauranter i Danmark, Sverige, Norge, Tyskland og Holland
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
          {["BISTRO NORD", "TACOS DK", "PASTA & VINO", "GRØNT & GODT", "KAFFEHJØRNET", "BURGER 22"].map(
            (name) => (
              <span key={name} className="text-sm font-bold tracking-widest text-zinc-700">
                {name}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────

function Features() {
  const items = [
    {
      title: "Bestilling uden kommission",
      body:
        "Modtag pickup, levering og forudbestillinger direkte. MobilePay og Stripe betalinger. Behold 100 % af ordreværdien — ingen 30 % til Wolt eller UberEats.",
      icon: <IconCart />,
    },
    {
      title: "AI-genererede SEO-sider",
      body:
        "Claude bygger landing pages per nabolag og menu-kategori, så du ranker på “bedste burrito Nørrebro” og 50 andre lokale søgninger.",
      icon: <IconSparkles />,
    },
    {
      title: "Brandet site + mobilapp",
      body:
        "Eget domæne, eget look, eget design. Mobilapp til iOS og Android med push notifications når kampagner kører.",
      icon: <IconPhone />,
    },
    {
      title: "Kundedata + marketing",
      body:
        "Hver bestilling bygger din kundebase. Send GDPR-compliant SMS- og email-kampagner. Loyalty bygges ind fra dag 1.",
      icon: <IconUsers />,
    },
  ];
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[oklch(0.45_0.16_145)]">
            Hvad du får
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Alt du har brug for. Ingenting du ikke har.
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="flex gap-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.95_0.04_145)] text-[oklch(0.45_0.16_145)]">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-zinc-600">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Fortæl os om din restaurant",
      body: "Indtast restaurant-navn. Vi henter menu, fotos og lokationer fra Google.",
    },
    {
      n: "2",
      title: "AI bygger dit site",
      body: "Claude genererer SEO-tekster, lokale landing pages og menu-beskrivelser. Du godkender før det går live.",
    },
    {
      n: "3",
      title: "Modtag direkte ordrer",
      body: "Site live på dit domæne. Bestillinger lander direkte hos dig — ingen mellemmænd.",
    },
  ];
  return (
    <section id="how-it-works" className="bg-zinc-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[oklch(0.45_0.16_145)]">
            Sådan virker det
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Live på 24 timer.
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="rounded-2xl border border-zinc-200 bg-white p-8">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[oklch(0.45_0.16_145)] font-semibold text-white">
                {step.n}
              </span>
              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-zinc-600">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[oklch(0.45_0.16_145)]">
          Pris
        </p>
        <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
          Én pris. Nul kommission.
        </h2>
        <div className="mx-auto mt-12 max-w-md rounded-3xl border border-zinc-200 bg-white p-10 text-left shadow-sm">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tracking-tight">€399</span>
            <span className="text-zinc-500">/måned</span>
          </div>
          <p className="mt-2 text-sm text-zinc-500">Faktureres månedligt. Opsig når som helst.</p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Brandet website med dit eget domæne",
              "Online bestilling — pickup, levering, scheduled",
              "AI-genererede lokale SEO-sider",
              "MobilePay + Stripe + kontant",
              "Mobilapp (iOS + Android)",
              "Kundebase + email/SMS marketing",
              "Ubegrænset support",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <svg viewBox="0 0 20 20" className="mt-0.5 size-5 fill-[oklch(0.45_0.16_145)]" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/demo"
            className="mt-10 block rounded-full bg-zinc-900 px-6 py-3 text-center text-sm font-medium text-white hover:bg-zinc-800"
          >
            Få en gratis demo
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function Faq() {
  const items = [
    {
      q: "Er Plates GDPR-compliant?",
      a: "Ja. Al data ligger i EU (Cloudflare D1 western Europe). Vi tilbyder DPA, eksplicit marketing-consent på alle kunder, og right-to-erasure er bygget ind i dataarkitekturen.",
    },
    {
      q: "Hvad med MobilePay?",
      a: "MobilePay er understøttet for danske restauranter. Stripe håndterer kort i hele EU. Du kan også tage imod kontanter ved pickup.",
    },
    {
      q: "Hvor lang er bindingstiden?",
      a: "Ingen. Faktureres månedligt og kan opsiges når som helst. Du ejer dit domæne, dit indhold og din kundebase.",
    },
    {
      q: "Hvordan virker den AI-genererede SEO?",
      a: "Vi bruger Claude til at generere landing pages per nabolag (fx 'bedste pasta Nørrebro') og menu-beskrivelser optimeret til lokal søgning. Du godkender alt før det går live.",
    },
    {
      q: "Hvad koster levering?",
      a: "Vi integrerer med tredjeparts leverings-fleet (Wolt Drive, Uber Direct) — du betaler kun for selve leveringen, ingen procent-cut til platformen. Eller brug dine egne bude.",
    },
  ];
  return (
    <section id="faq" className="bg-zinc-50 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center text-4xl font-bold tracking-tight md:text-5xl">
          Spørgsmål
        </h2>
        <div className="mt-12 space-y-3">
          {items.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {item.q}
                <span className="text-zinc-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-zinc-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ───────────────────────────────────────────────────────────────

function FinalCta() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          Stop med at give 30 % til andre.
        </h2>
        <p className="mt-4 text-lg text-zinc-600">
          Book en 15-minutters demo. Vi viser dig præcis hvad du taber online — og hvordan
          Plates kan rette det.
        </p>
        <Link
          href="#demo"
          className="mt-8 inline-flex rounded-full bg-[oklch(0.45_0.16_145)] px-6 py-3 text-base font-medium text-white hover:bg-[oklch(0.40_0.16_145)]"
        >
          Få en gratis demo
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-zinc-100 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-500 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-[oklch(0.62_0.18_145)]" aria-hidden />
          <span>© {new Date().getFullYear()} Plates. Lavet i EU.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-zinc-900">Privacy</Link>
          <Link href="/terms" className="hover:text-zinc-900">Terms</Link>
          <Link href="/dpa" className="hover:text-zinc-900">DPA</Link>
        </div>
      </div>
    </footer>
  );
}

// ─── Inline icons ────────────────────────────────────────────────────────────

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h2l3 13h11l3-9H6" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}

function IconSparkles() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.5 2.5M16 16l2.5 2.5M5.5 18.5L8 16M16 8l2.5-2.5" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5M16 11a3 3 0 1 0 0-6M21 20c0-2.5-1.7-4.5-4-5" />
    </svg>
  );
}
