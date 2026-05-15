import Link from "next/link";
import type { Metadata } from "next";
import { DemoForm } from "./demo-form";

export const metadata: Metadata = {
  title: "Få en gratis demo · Plates",
  description:
    "Se hvordan Plates bygger din restaurants website, kører bestilling uden kommission, og ranker dig på Google. 20-minutters demo, ingen binding.",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[oklch(0.99_0.01_95)]">
      <Nav />
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <LeftCol />
          <RightCol />
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="border-b border-zinc-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <div
            className="size-7 rounded-lg bg-[oklch(0.62_0.18_145)]"
            aria-hidden
          />
          Plates
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
          <Link href="/#features" className="hover:text-zinc-900">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-zinc-900">
            Sådan virker det
          </Link>
          <Link href="/#pricing" className="hover:text-zinc-900">
            Priser
          </Link>
          <Link href="/#faq" className="hover:text-zinc-900">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-zinc-700 hover:text-zinc-900 md:inline"
          >
            Log ind
          </Link>
          <Link
            href="/start"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400"
          >
            Byg selv
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Left column ─────────────────────────────────────────────────────────────

function LeftCol() {
  return (
    <div>
      <h1 className="text-balance text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
        Se Europas #1 platform til restaurant-marketing i action
      </h1>
      <p className="mt-5 max-w-xl text-balance text-lg text-zinc-600">
        Ingen kontrakter. Ingen binding. Ingen kreditkort. Der er en grund til
        at tusindvis af restauranter stoler på Plates.
      </p>

      <Stars rating={4.8} label="1.000+ anmeldelser" />

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wider text-zinc-500">
        På din 20-minutters demo dækker vi
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <FeatureCard
          icon={<BoltIcon />}
          title="AI-websites + SEO"
          body="Få flere kunder fra Google."
        />
        <FeatureCard
          icon={<BoltIcon />}
          title="Marketing-automation"
          body="Maksimer salg fra eksisterende kunder."
        />
        <FeatureCard
          icon={<BoltIcon />}
          title="Mobil-app"
          body="Lever den bedste bestillings-oplevelse til dine fastkunder."
        />
        <FeatureCard
          icon={<BoltIcon />}
          title="Og mere…"
          body="Integrationer, kommissionfri levering, og virkelige før/efter-tal."
        />

        <BadgeCard
          icon={<BadgeIcon />}
          title="G2 Leader"
          body="Forår 2026"
        />
        <BadgeCard
          icon={<RocketIcon />}
          title="#1 i Europa"
          body="Restaurant Marketing Software"
        />
      </div>

      <Testimonial />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="text-[oklch(0.45_0.16_145)]">{icon}</div>
      <h3 className="mt-3 font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{body}</p>
    </div>
  );
}

function BadgeCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="text-amber-500">{icon}</div>
      <h3 className="mt-3 font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1.5 text-sm text-zinc-600">{body}</p>
    </div>
  );
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="mt-5 flex items-center gap-3 text-sm text-zinc-600">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className="size-5 fill-amber-400"
            aria-hidden
          >
            <path d="M9.05 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 0 0-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.366-2.445a1 1 0 0 0-1.176 0l-3.366 2.445c-.783.57-1.838-.197-1.538-1.118l1.286-3.957a1 1 0 0 0-.363-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 0 0 .951-.69L9.05 2.927Z" />
          </svg>
        ))}
      </div>
      <span className="font-semibold text-zinc-900">{rating.toFixed(1)}</span>
      <span>· {label}</span>
    </div>
  );
}

function Testimonial() {
  return (
    <figure className="mt-10 rounded-2xl bg-zinc-100 p-6">
      <div className="flex items-start gap-4">
        <div className="size-12 shrink-0 rounded-full bg-[oklch(0.85_0.04_85)]" aria-hidden />
        <div>
          <blockquote className="text-zinc-800">
            "Plates gør online-marketing nemt. De er hemmeligheden bag vores
            online-succes."
          </blockquote>
          <figcaption className="mt-2 text-sm text-zinc-500">
            Yuliana Vasquez — ejer, Somos Oaxaca
          </figcaption>
        </div>
      </div>
    </figure>
  );
}

// ─── Right column (form) ────────────────────────────────────────────────────

function RightCol() {
  return (
    <div className="lg:sticky lg:top-12 lg:self-start">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <DemoForm />
      </div>
      <p className="mt-4 text-center text-xs text-zinc-500">
        Ved at indsende accepterer du vores{" "}
        <Link href="/terms" className="underline hover:text-zinc-900">
          vilkår
        </Link>{" "}
        og{" "}
        <Link href="/privacy" className="underline hover:text-zinc-900">
          privatlivspolitik
        </Link>
        .
      </p>
    </div>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-500 md:flex-row">
        <div className="flex items-center gap-2">
          <div
            className="size-5 rounded bg-[oklch(0.62_0.18_145)]"
            aria-hidden
          />
          <span>© {new Date().getFullYear()} Plates. Lavet i EU.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-zinc-900">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-zinc-900">
            Terms
          </Link>
          <Link href="/dpa" className="hover:text-zinc-900">
            DPA
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function BoltIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6 fill-current"
      aria-hidden
    >
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6 fill-current"
      aria-hidden
    >
      <path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6 fill-current"
      aria-hidden
    >
      <path d="M14 4c5 0 6 1 6 6 0 4-3 8-9 12l-3-3C12 13 16 10 16 5l-2-1Z" />
      <circle cx="14" cy="9" r="1.5" fill="white" />
    </svg>
  );
}
