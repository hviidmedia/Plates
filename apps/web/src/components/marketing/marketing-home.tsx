import Link from "next/link";
import { cn } from "@plates/ui";

/**
 * Plates marketing home — Owner.com-inspired, English, EU-adapted.
 * Adds CSS-only ambient motion so the page feels alive without
 * requiring `"use client"`. Respects prefers-reduced-motion.
 */
export function MarketingHome() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <PlatesAnimations />
      <Nav />
      <Hero />
      <AuditPreview />
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

// ─── Animation styles (CSS-only, server-component-safe) ──────────────────────

function PlatesAnimations() {
  return (
    <style>{`
      @keyframes pl-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      @keyframes pl-float-sm { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      @keyframes pl-tilt { 0%,100% { transform: rotate(-1.5deg); } 50% { transform: rotate(1.5deg); } }
      @keyframes pl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
      @keyframes pl-pulse-soft { 0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(217,109,49,0.45); } 50% { transform: scale(1.02); box-shadow: 0 0 0 8px rgba(217,109,49,0); } }
      @keyframes pl-pulse-dot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.7); } }
      /* Resting state stays VISIBLE so content is readable if the
         animation timeline is paused (hidden tab, screenshot capture,
         no-JS, etc). Entry animations only modulate translate/scale
         around the natural state. */
      @keyframes pl-fade-up { 0% { transform: translateY(10px); } 100% { transform: translateY(0); } }
      @keyframes pl-grow-bar { 0% { transform: scaleY(0.35); } 100% { transform: scaleY(1); } }
      @keyframes pl-shimmer { 0% { transform: translateX(-130%); } 60%,100% { transform: translateX(180%); } }
      @keyframes pl-arrow { 0%,100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
      @keyframes pl-bg-pan { 0% { background-position: 0 0; } 100% { background-position: 64px 64px; } }
      @keyframes pl-dot-pan { 0% { background-position: 0 0; } 100% { background-position: 48px 48px; } }
      @keyframes pl-spin-slow { from { transform: rotate(0); } to { transform: rotate(360deg); } }
      @keyframes pl-sparkle { 0%,100% { transform: scale(1) rotate(0); opacity: 1; } 50% { transform: scale(1.25) rotate(15deg); opacity: 0.85; } }
      @keyframes pl-card-rotate {
        0%  { transform: translateY(14px) rotate(0); opacity: 0; }
        6%  { transform: translateY(0)    rotate(3deg); opacity: 1; }
        28% { transform: translateY(0)    rotate(3deg); opacity: 1; }
        34% { transform: translateY(-12px) rotate(3deg); opacity: 0; }
        100% { transform: translateY(-12px) rotate(3deg); opacity: 0; }
      }
      @keyframes pl-counter {
        0%   { transform: translateY(0); }
        45%  { transform: translateY(0); }
        50%  { transform: translateY(-100%); }
        95%  { transform: translateY(-100%); }
        100% { transform: translateY(-200%); }
      }
      @keyframes pl-ping {
        0%   { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(2.4); opacity: 0; }
      }

      .pl-anim-float       { animation: pl-float 6s ease-in-out infinite; }
      .pl-anim-float-sm    { animation: pl-float-sm 4.5s ease-in-out infinite; }
      .pl-anim-tilt        { animation: pl-tilt 9s ease-in-out infinite; }
      .pl-anim-pulse       { animation: pl-pulse 2.4s ease-in-out infinite; }
      .pl-anim-pulse-soft  { animation: pl-pulse-soft 2.6s ease-in-out infinite; }
      .pl-anim-pulse-dot   { animation: pl-pulse-dot 1.5s ease-in-out infinite; }
      .pl-anim-fade-up     { animation: pl-fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1) both; }
      .pl-anim-bar         { transform-origin: bottom; animation: pl-grow-bar 900ms cubic-bezier(0.16, 1, 0.3, 1) both; }
      .pl-anim-bg-pan      { animation: pl-bg-pan 22s linear infinite; }
      .pl-anim-dot-pan     { animation: pl-dot-pan 30s linear infinite; }
      .pl-anim-arrow       { animation: pl-arrow 1.6s ease-in-out infinite; }
      .pl-anim-spin-slow   { animation: pl-spin-slow 16s linear infinite; }
      .pl-anim-sparkle     { animation: pl-sparkle 2s ease-in-out infinite; display: inline-block; }
      .pl-anim-card-rotate { animation: pl-card-rotate 9s cubic-bezier(0.4, 0, 0.2, 1) infinite both; }
      .pl-anim-ping        { animation: pl-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }

      .pl-cta-shine { position: relative; overflow: hidden; isolation: isolate; }
      .pl-cta-shine::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%);
        transform: translateX(-130%);
        animation: pl-shimmer 4s ease-in-out infinite;
        pointer-events: none;
        z-index: 1;
      }
      .pl-cta-shine > * { position: relative; z-index: 2; }

      .pl-revenue {
        display: inline-block;
        height: 1.5em;
        overflow: hidden;
        vertical-align: bottom;
      }
      .pl-revenue-track {
        display: flex;
        flex-direction: column;
        animation: pl-counter 8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .pl-anim-float, .pl-anim-float-sm, .pl-anim-tilt, .pl-anim-pulse,
        .pl-anim-pulse-soft, .pl-anim-pulse-dot, .pl-anim-bg-pan,
        .pl-anim-dot-pan, .pl-anim-arrow, .pl-anim-spin-slow,
        .pl-anim-sparkle, .pl-anim-card-rotate, .pl-anim-ping,
        .pl-cta-shine::after, .pl-revenue-track {
          animation: none !important;
        }
        .pl-anim-fade-up, .pl-anim-bar { animation: none !important; transform: none !important; opacity: 1 !important; }
      }
    `}</style>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="border-b border-zinc-100 bg-white/95 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="size-8 rounded-lg bg-[oklch(0.62_0.18_145)]" aria-hidden />
          <span className="text-lg">Plates</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
          <Link href="#features" className="hover:text-zinc-900">Features</Link>
          <Link href="#how-it-works" className="hover:text-zinc-900">How it works</Link>
          <Link href="#pricing" className="hover:text-zinc-900">Pricing</Link>
          <Link href="#faq" className="hover:text-zinc-900">FAQ</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm text-zinc-700 hover:text-zinc-900 md:inline">
            Log in
          </Link>
          <Link
            href="#demo"
            className="pl-cta-shine rounded-full bg-[oklch(0.72_0.18_45)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[oklch(0.66_0.18_45)]"
          >
            Get a free demo
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.97_0.02_80)]">
      {/* Animated grid backdrop */}
      <div
        className="pl-anim-bg-pan absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-16 pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-24 lg:pb-28">
        <div>
          <div className="pl-anim-fade-up">
            <Stars rating={4.8} label="Trusted by 1,000+ European restaurants" />
          </div>
          <h1 className="pl-anim-fade-up mt-6 text-balance text-[2.75rem] font-bold leading-[1.04] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl lg:text-[4.25rem]" style={{ animationDelay: "120ms" }}>
            You're losing sales online.
            <br />
            <span className="text-[oklch(0.45_0.16_145)]">AI will show you exactly how much.</span>
          </h1>
          <p className="pl-anim-fade-up mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 md:text-xl" style={{ animationDelay: "240ms" }}>
            Plates builds your restaurant a website, takes orders without commission, and ranks you on Google with AI-generated local pages. Built for European restaurants — Danish, German, Dutch, Nordic.
          </p>

          <form id="demo" action="/start" method="get" className="pl-anim-fade-up mt-10 flex max-w-lg flex-col gap-3 sm:flex-row" style={{ animationDelay: "360ms" }}>
            <input
              type="text"
              name="name"
              placeholder="Enter your restaurant name"
              required
              className="flex-1 rounded-full border border-zinc-300 bg-white px-5 py-3.5 text-base text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900"
            />
            <button
              type="submit"
              className="pl-cta-shine group inline-flex items-center justify-center gap-2 rounded-full bg-[oklch(0.72_0.18_45)] px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[oklch(0.66_0.18_45)]"
            >
              Get my free audit
              <svg viewBox="0 0 20 20" className="size-4 fill-current transition group-hover:translate-x-1" aria-hidden>
                <path d="M3 10a1 1 0 0 1 1-1h10.586L11.293 5.707a1 1 0 1 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L14.586 11H4a1 1 0 0 1-1-1Z" />
              </svg>
            </button>
          </form>
          <p className="pl-anim-fade-up mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-zinc-500" style={{ animationDelay: "480ms" }}>
            <span className="inline-flex items-center gap-1.5">
              <CheckTiny /> Free audit
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckTiny /> No credit card
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckTiny /> Live in 24 hours
            </span>
          </p>
        </div>

        <div className="pl-anim-fade-up" style={{ animationDelay: "300ms" }}>
          <HeroMockup />
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative border-t border-zinc-200/80 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-zinc-100 md:grid-cols-4">
          {[
            { k: "0%", v: "Commission on orders" },
            { k: "24 hr", v: "From signup to live" },
            { k: "50+", v: "Local SEO pages per site" },
            { k: "5 EU", v: "Markets supported" },
          ].map((s, i) => (
            <div key={s.v} className="pl-anim-fade-up px-6 py-6 text-center md:py-7" style={{ animationDelay: `${600 + i * 80}ms` }}>
              <div className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">{s.k}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-700">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" className="pl-anim-fade-up size-5 fill-amber-400" style={{ animationDelay: `${i * 90}ms` }} aria-hidden>
            <path d="M9.05 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 0 0-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.366-2.445a1 1 0 0 0-1.176 0l-3.366 2.445c-.783.57-1.838-.197-1.538-1.118l1.286-3.957a1 1 0 0 0-.363-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 0 0 .951-.69L9.05 2.927Z" />
          </svg>
        ))}
      </div>
      <span className="font-semibold text-zinc-900">{rating.toFixed(1)}</span>
      <span className="text-zinc-500">·</span>
      <span>{label}</span>
    </div>
  );
}

function CheckTiny() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 fill-[oklch(0.45_0.16_145)]" aria-hidden>
      <path
        fillRule="evenodd"
        d="M13.485 3.515a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L5.78 9.808l6.293-6.293a1 1 0 0 1 1.414 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function HeroMockup() {
  return (
    <div className="relative">
      {/* Browser chrome — floats gently */}
      <div className="pl-anim-float overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-zinc-300" />
            <span className="size-2.5 rounded-full bg-zinc-300" />
            <span className="size-2.5 rounded-full bg-zinc-300" />
          </div>
          <div className="ml-2 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-zinc-500 ring-1 ring-zinc-200">
            acme-bistro.counter.app
          </div>
          <span className="relative flex size-2.5">
            <span className="pl-anim-ping absolute inline-flex size-full rounded-full bg-emerald-400" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
        </div>
        {/* Site body */}
        <div className="relative bg-white">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, oklch(0.95 0.04 145) 0%, white 60%)" }}
            aria-hidden
          />
          <div className="relative px-6 py-6">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold">
                <div className="size-4 rounded-full bg-[oklch(0.62_0.18_145)]" />
                Acme Bistro
              </div>
              <div className="rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-medium text-white">Order</div>
            </div>
            <div className="mt-6 text-center">
              <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Welcome</div>
              <div className="mt-1 text-2xl font-bold tracking-tight">Acme Bistro</div>
              <div className="mt-1 text-[11px] text-zinc-600">Order online for pickup or delivery</div>
              <div className="mt-3 flex justify-center gap-2">
                <button className="pl-anim-pulse-soft rounded-full bg-[oklch(0.72_0.18_45)] px-4 py-1.5 text-[11px] font-semibold text-white shadow">
                  Order
                </button>
                <button className="rounded-full border border-zinc-300 bg-white px-4 py-1.5 text-[11px] font-medium text-zinc-700">
                  Menu
                </button>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {["Tacos", "Burger", "Bowl"].map((n, i) => (
                <div key={n} className="overflow-hidden rounded-xl border border-zinc-100 bg-white">
                  <div
                    className="aspect-[4/3]"
                    style={{
                      background: `linear-gradient(135deg, oklch(${[0.86, 0.84, 0.82][i]} 0.05 ${[40, 100, 145][i]}), oklch(${[0.75, 0.73, 0.7][i]} 0.07 ${[40, 100, 145][i]}))`,
                    }}
                  />
                  <div className="p-1.5">
                    <div className="text-[9px] font-semibold">{n}</div>
                    <div className="text-[9px] text-zinc-500">€12.50</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating order notifications — cycle through 3 every 9s */}
      <div className="pointer-events-none absolute -right-4 -top-6 hidden h-20 w-56 md:block">
        {[
          { who: "Maja P.", price: "€34.50", what: "Carnitas Tacos × 2", delay: "0s" },
          { who: "Jonas L.", price: "€18.50", what: "Ribeye Burger × 1", delay: "-3s" },
          { who: "Sofia K.", price: "€27.00", what: "Nordic Bowl × 2",   delay: "-6s" },
        ].map((o, i) => (
          <div
            key={i}
            className="pl-anim-card-rotate absolute inset-0 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl"
            style={{ animationDelay: o.delay }}
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[oklch(0.95_0.04_145)] text-[oklch(0.45_0.16_145)]">
              <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12.5 10 17l9-11" />
              </svg>
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <div className="font-semibold text-zinc-900">New order · {o.price}</div>
              <div className="truncate text-zinc-500">{o.what} — {o.who}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating weekly revenue — gently floats opposite the order card */}
      <div className="pl-anim-float-sm absolute -bottom-5 -left-3 hidden -rotate-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-xl md:block" style={{ animationDelay: "1s" }}>
        <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">This week</div>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-xl font-bold tracking-tight">€4,210</span>
          <span className="text-xs font-semibold text-emerald-700">+18%</span>
        </div>
        <div className="mt-1 flex h-2 gap-0.5">
          {[30, 55, 40, 75, 60, 90, 80].map((h, i) => (
            <span key={i} className="pl-anim-bar w-1.5 rounded-sm bg-[oklch(0.45_0.16_145)]" style={{ height: `${h}%`, animationDelay: `${800 + i * 80}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Audit preview ───────────────────────────────────────────────────────────

function AuditPreview() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[oklch(0.45_0.16_145)]">
            Your free audit
          </p>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
            Here's who's beating you on Google.
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            We pull live data from Google Maps, Reviews and Search, score every nearby competitor, and tell you exactly where you're leaving money on the table.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-b from-[oklch(0.97_0.04_145)] to-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">Local ranking · Pasta, Nørrebro</p>
                <p className="mt-0.5 text-xs text-zinc-500">Last refreshed 4 minutes ago</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <span className="relative flex size-2">
                  <span className="pl-anim-ping absolute inline-flex size-full rounded-full bg-emerald-400" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>
            </div>
            <div className="divide-y divide-zinc-100">
              {[
                { rank: "1.", name: "Pasta Imperiale", score: "39/40", rating: 4.8 },
                { rank: "2.", name: "Trattoria Nord",  score: "36/40", rating: 4.7 },
                { rank: "3.", name: "La Cucina",       score: "33/40", rating: 4.5 },
                { rank: "10.", name: "Your restaurant", score: "12/40", rating: 4.9, you: true },
              ].map((row, i) => (
                <div
                  key={row.name}
                  className={cn(
                    "pl-anim-fade-up flex items-center justify-between px-6 py-4",
                    row.you && "bg-amber-50",
                  )}
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 text-sm font-medium text-zinc-500">{row.rank}</span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{row.name}</p>
                      <p className="text-xs text-zinc-500">★ {row.rating.toFixed(1)}</p>
                    </div>
                  </div>
                  <span className={cn("text-sm font-bold", row.you ? "text-amber-700" : "text-emerald-700")}>
                    {row.score}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-200 bg-white px-6 py-5">
              <p className="text-sm font-semibold text-zinc-900">
                You're losing about <span className="text-red-600">€450/month</span> until you fix:
              </p>
              <ul className="mt-3 space-y-2.5 text-sm text-zinc-700">
                {[
                  "You don't rank for 3 nearby neighborhoods that competitors cover.",
                  "Missing keywords in page title — e.g. \"Pasta Nørrebro\".",
                  "No menu schema — Google can't read your dishes.",
                ].map((line, i) => (
                  <li key={i} className="pl-anim-fade-up flex gap-2.5" style={{ animationDelay: `${600 + i * 120}ms` }}>
                    <span className="mt-0.5 text-red-500">▲</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Social proof ────────────────────────────────────────────────────────────

function SocialProof() {
  return (
    <section className="border-y border-zinc-100 bg-zinc-50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-sm font-medium text-zinc-600">
          Trusted by restaurants across Denmark, Sweden, Norway, Germany &amp; the Netherlands
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
          {[
            "BISTRO NORD", "TACOS DK", "PASTA & VINO", "GRØNT & GODT", "KAFFEHJØRNET", "BURGER 22",
          ].map((name) => (
            <span key={name} className="text-sm font-bold tracking-[0.18em] text-zinc-700">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────

function Features() {
  const items = [
    {
      tag: "Direct orders",
      title: "Keep 100% of every order.",
      body:
        "Take pickup, delivery and scheduled orders straight from your site. MobilePay, Stripe, iDEAL — no 30% cut to Wolt or UberEats.",
      icon: <IconCart />,
      visual: <FeatureVisualOrder />,
    },
    {
      tag: "AI SEO",
      title: "Rank for every street near you.",
      body:
        "Claude writes landing pages for every neighborhood you serve — so you show up for 'best burrito Nørrebro' and 50 other local searches.",
      icon: <IconSparkles />,
      visual: <FeatureVisualSeo />,
    },
    {
      tag: "Branded apps",
      title: "Your domain. Your brand.",
      body:
        "iOS and Android apps under your own name. Push notifications when you run a promo. Your customers, not a marketplace's.",
      icon: <IconPhone />,
      visual: <FeatureVisualPhone />,
    },
    {
      tag: "GDPR-native CRM",
      title: "Customer data you own.",
      body:
        "Every order grows your list. Send GDPR-compliant SMS and email campaigns. EU data residency, DPA on day one.",
      icon: <IconUsers />,
      visual: <FeatureVisualCrm />,
    },
  ];

  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[oklch(0.45_0.16_145)]">
            What you get
          </p>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
            Everything you need. Nothing you don't.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.title}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-100 bg-white p-8 transition hover:border-zinc-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[oklch(0.95_0.04_145)] text-[oklch(0.45_0.16_145)]">
                  {item.icon}
                </div>
                <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {item.tag}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
                {item.title}
              </h3>
              <p className="mt-3 text-zinc-600">{item.body}</p>
              <div className="mt-8">{item.visual}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureVisualOrder() {
  const bars = [40, 65, 35, 80, 45, 90, 70, 100, 55, 75, 95, 60];
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Tonight</div>
          <div className="mt-0.5 text-lg font-bold tracking-tight">14 direct orders</div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          <span className="pl-anim-pulse-dot size-1.5 rounded-full bg-emerald-500" />
          €0 commission
        </span>
      </div>
      <div className="mt-4 flex h-12 items-end gap-1.5">
        {bars.map((h, i) => (
          <div
            key={i}
            className="pl-anim-bar flex-1 rounded-sm bg-[oklch(0.45_0.16_145)]"
            style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function FeatureVisualSeo() {
  const pages = [
    { slug: "pizza-nørrebro", rank: 1 },
    { slug: "pasta-vesterbro", rank: 2 },
    { slug: "burger-frederiksberg", rank: 3 },
    { slug: "tacos-østerbro", rank: 4 },
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
      <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">AI-generated landing pages</div>
      <ul className="mt-3 space-y-2">
        {pages.map((p, i) => (
          <li
            key={p.slug}
            className="pl-anim-fade-up flex items-center justify-between text-sm"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <span className="flex items-center gap-2 text-zinc-800">
              <span className="pl-anim-sparkle text-[oklch(0.45_0.16_145)]" style={{ animationDelay: `${i * 200}ms` }}>✨</span>
              /places/{p.slug}
            </span>
            <span className="font-mono text-xs text-emerald-700">#{p.rank}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeatureVisualPhone() {
  return (
    <div className="flex items-end justify-center overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 p-5 pb-0">
      <div className="pl-anim-tilt w-32 origin-bottom rounded-t-2xl border-x border-t border-zinc-300 bg-white px-2.5 pt-3">
        <div className="mx-auto h-1 w-8 rounded-full bg-zinc-300" />
        <div className="mt-3 flex items-center gap-1.5 text-[8px]">
          <div className="size-3 rounded-full bg-[oklch(0.62_0.18_145)]" />
          <span className="font-semibold">Acme Bistro</span>
        </div>
        <div className="mt-2 aspect-[4/3] rounded-md bg-gradient-to-br from-[oklch(0.85_0.07_45)] to-[oklch(0.75_0.10_45)]" />
        <div className="mt-2 text-[8px] font-semibold">Carnitas Tacos</div>
        <div className="text-[8px] text-zinc-500">€12.50</div>
        <div className="pl-anim-pulse-soft my-2 rounded-full bg-[oklch(0.72_0.18_45)] px-2 py-1 text-center text-[8px] font-semibold text-white">
          Order
        </div>
      </div>
    </div>
  );
}

function FeatureVisualCrm() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-[oklch(0.45_0.16_145)] text-sm font-bold text-white">
          M
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Maja Petersen</div>
          <div className="text-xs text-zinc-500">7 orders · €214 lifetime</div>
        </div>
        <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold text-white">VIP</span>
      </div>
      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3 text-xs">
        <div className="font-semibold text-zinc-900">SMS — "Friday night special"</div>
        <div className="mt-1 text-zinc-600">2 for 1 on tacos. Reply STOP to opt out.</div>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500">
          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700">
            <span className="pl-anim-pulse-dot size-1.5 rounded-full bg-emerald-500" /> GDPR consent ✓
          </span>
          <span>Sent to 184 customers</span>
        </div>
      </div>
    </div>
  );
}

// ─── How it works ────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { n: "01", time: "60 seconds", title: "Tell us about your restaurant.", body: "Just enter your name. We pull your menu, photos and locations from Google automatically." },
    { n: "02", time: "24 hours",   title: "AI builds your site.",           body: "Claude writes SEO copy, local landing pages and menu descriptions. You approve everything before it goes live." },
    { n: "03", time: "Day one",    title: "Start taking direct orders.",   body: "Your site is live on your domain. Orders land in your kitchen — no middlemen, no commission." },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[oklch(0.22_0.07_145)] py-24 text-white"
    >
      <div
        className="pl-anim-dot-pan absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[oklch(0.85_0.10_145)]">
            How it works
          </p>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Live in 24 hours.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/70">
            From signup to taking direct orders, with no engineering or migration. Built on Cloudflare's EU edge.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="pl-anim-fade-up relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur"
              style={{ animationDelay: `${i * 160}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold tracking-wider text-[oklch(0.85_0.10_145)]">
                  {step.n}
                </span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/70">
                  {step.time}
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-white/70">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function Pricing() {
  const features = [
    "Branded website on your own domain",
    "Online ordering — pickup, delivery, scheduled",
    "AI-generated local SEO pages",
    "MobilePay + Stripe + iDEAL + cash",
    "Native iOS + Android app",
    "Customer database + email & SMS marketing",
    "Unlimited support, in English & Danish",
  ];
  return (
    <section id="pricing" className="bg-[oklch(0.97_0.02_80)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[oklch(0.45_0.16_145)]">
            Pricing
          </p>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
            One price. Zero commission.
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm">
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-bold tracking-tight text-zinc-900">€399</span>
              <span className="text-zinc-500">/month</span>
            </div>
            <p className="mt-2 text-sm text-zinc-500">Billed monthly. Cancel anytime. No setup fee.</p>
            <ul className="mt-8 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg viewBox="0 0 20 20" className="mt-0.5 size-5 fill-[oklch(0.45_0.16_145)]" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-zinc-700">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="#demo"
              className="pl-cta-shine group mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[oklch(0.72_0.18_45)] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[oklch(0.66_0.18_45)]"
            >
              Get a free demo
              <svg viewBox="0 0 20 20" className="size-4 fill-current transition group-hover:translate-x-1" aria-hidden>
                <path d="M3 10a1 1 0 0 1 1-1h10.586L11.293 5.707a1 1 0 1 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L14.586 11H4a1 1 0 0 1-1-1Z" />
              </svg>
            </Link>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Vs. delivery apps
            </p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight">Save €36k a year.</h3>
            <p className="mt-2 text-sm text-zinc-600">
              For a restaurant doing €10k/month through delivery apps:
            </p>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <dt className="text-zinc-600">Wolt / UberEats (30% commission)</dt>
                <dd className="font-bold text-red-600">−€3,000/mo</dd>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <dt className="text-zinc-600">Plates</dt>
                <dd className="font-bold text-zinc-900">−€399/mo</dd>
              </div>
              <div className="flex items-center justify-between pt-1">
                <dt className="font-semibold text-zinc-900">You keep</dt>
                <dd className="text-xl font-bold text-[oklch(0.45_0.16_145)]">+€2,601/mo</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function Faq() {
  const items = [
    { q: "Is Plates GDPR-compliant?", a: "Yes. All data sits in the EU (Cloudflare D1, western Europe region). We offer a DPA, explicit marketing consent on every customer record, and right-to-erasure is built into the data architecture." },
    { q: "Which European payment methods are supported?", a: "MobilePay for Denmark, iDEAL for the Netherlands, Bancontact for Belgium, Klarna for Sweden, and Stripe for cards across the EU. Cash on pickup works too." },
    { q: "How long am I locked in?", a: "Zero. Billed monthly, cancel anytime. You own your domain, your content and your customer list. Walk away whenever — we'll export everything." },
    { q: "How does the AI-generated SEO work?", a: "Claude writes a landing page for every neighborhood you serve (e.g. 'best pasta Nørrebro') and rewrites your menu descriptions for local search. You approve every page before it goes live." },
    { q: "What about delivery? Do you have couriers?", a: "We integrate with third-party fleets (Wolt Drive, Uber Direct) — you pay only the delivery fee, no percentage cut. Or use your own couriers and pay nothing per order." },
  ];
  return (
    <section id="faq" className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-balance text-center text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
          Questions
        </h2>
        <div className="mt-12 space-y-3">
          {items.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-zinc-200 bg-white p-6 transition open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-zinc-900">
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
    <section className="relative overflow-hidden bg-[oklch(0.22_0.07_145)] py-28 text-white">
      <div
        className="pl-anim-dot-pan absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
          Stop giving 30% to delivery apps.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
          Book a 15-minute demo. We'll show you exactly what you're losing online — and how Plates rebuilds it.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="#demo"
            className="pl-cta-shine group inline-flex items-center gap-2 rounded-full bg-[oklch(0.72_0.18_45)] px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[oklch(0.66_0.18_45)]"
          >
            Book a free demo
            <svg viewBox="0 0 20 20" className="size-4 fill-current transition group-hover:translate-x-1" aria-hidden>
              <path d="M3 10a1 1 0 0 1 1-1h10.586L11.293 5.707a1 1 0 1 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L14.586 11H4a1 1 0 0 1-1-1Z" />
            </svg>
          </Link>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
          >
            Build your site in 5 minutes
          </Link>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/50">
          Free audit · No credit card · Live in 24 hours
        </p>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 text-sm text-zinc-500 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="size-7 rounded-lg bg-[oklch(0.62_0.18_145)]" aria-hidden />
          <span className="font-semibold text-zinc-900">Plates</span>
          <span>·</span>
          <span>© {new Date().getFullYear()} · Made in the EU</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-zinc-900">Privacy</Link>
          <Link href="/terms" className="hover:text-zinc-900">Terms</Link>
          <Link href="/dpa" className="hover:text-zinc-900">DPA</Link>
          <Link href="/security" className="hover:text-zinc-900">Security</Link>
        </div>
      </div>
    </footer>
  );
}

// ─── Inline icons ────────────────────────────────────────────────────────────

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h2l3 13h11l3-9H6" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}

function IconSparkles() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.5 2.5M16 16l2.5 2.5M5.5 18.5L8 16M16 8l2.5-2.5" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5M16 11a3 3 0 1 0 0-6M21 20c0-2.5-1.7-4.5-4-5" />
    </svg>
  );
}
