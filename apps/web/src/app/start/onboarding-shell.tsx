"use client";

import { useState } from "react";
import { cn } from "@plates/ui";
import { ChatMode } from "./chat-mode";
import { PreviewPanel } from "./preview-panel";
import { WizardMode } from "./wizard-mode";
import {
  EMPTY_STATE,
  type WizardMode as Mode,
  type WizardState,
  type WizardStep,
} from "./types";

export function OnboardingShell({ initialName }: { initialName?: string }) {
  const [mode, setMode] = useState<Mode>("wizard");
  const [step, setStep] = useState<WizardStep>("info");
  const [state, setState] = useState<WizardState>(() => ({
    ...EMPTY_STATE,
    restaurantName: initialName?.trim() ?? "",
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.45_0.16_145)]">
            Onboarding
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Byg din restaurants website
          </h1>
        </div>
        <ModeToggle mode={mode} setMode={setMode} />
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_minmax(380px,1fr)]">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8">
          {mode === "wizard" ? (
            <WizardMode
              state={state}
              setState={setState}
              step={step}
              setStep={setStep}
            />
          ) : (
            <ChatMode state={state} setState={setState} setStep={(s) => {
              setStep(s);
              setMode("wizard");
            }} />
          )}
        </section>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
            Live preview
          </p>
          <PreviewPanel state={state} />
        </aside>
      </div>
    </div>
  );
}

function ModeToggle({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
}) {
  return (
    <div className="flex rounded-full border border-zinc-200 bg-white p-1 text-sm">
      <button
        type="button"
        onClick={() => setMode("wizard")}
        className={cn(
          "rounded-full px-4 py-1.5 font-medium transition",
          mode === "wizard" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900",
        )}
      >
        Wizard
      </button>
      <button
        type="button"
        onClick={() => setMode("chat")}
        className={cn(
          "rounded-full px-4 py-1.5 font-medium transition",
          mode === "chat" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900",
        )}
      >
        ✨ Chat
      </button>
    </div>
  );
}
