import type { Metadata } from "next";
import Link from "next/link";
import { OnboardingShell } from "./onboarding-shell";

export const metadata: Metadata = {
  title: "Kom i gang",
  description:
    "Byg din restaurants website på minutter. AI hjælper dig med menu, beskrivelser og SEO. Lavet til EU.",
};

export const dynamic = "force-dynamic";

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const { name } = await searchParams;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="size-7 rounded-lg bg-[oklch(0.62_0.18_145)]" aria-hidden />
            Plates
          </Link>
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
            ← Tilbage
          </Link>
        </div>
      </header>
      <OnboardingShell initialName={name} />
    </div>
  );
}
