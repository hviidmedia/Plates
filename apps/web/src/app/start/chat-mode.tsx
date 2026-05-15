"use client";

import { useState, useTransition } from "react";
import type { ChatMessage } from "@plates/ai";
import { aiChatTurnAction } from "@/lib/onboarding-actions";
import type { WizardState, WizardStep } from "./types";
import { cn } from "@plates/ui";

const SEED_GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hej! Jeg hjælper dig med at bygge din restaurants website. Lad os starte enkelt — hvad hedder din restaurant og hvor ligger den?",
};

export function ChatMode({
  state,
  setState,
  setStep,
}: {
  state: WizardState;
  setState: (next: WizardState) => void;
  setStep: (s: WizardStep) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([SEED_GREETING]);
  const [draft, setDraft] = useState("");
  const [isThinking, startTurn] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const send = () => {
    const trimmed = draft.trim();
    if (!trimmed || isThinking) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setDraft("");
    setError(null);

    startTurn(async () => {
      try {
        const result = await aiChatTurnAction(
          {
            restaurantName: state.restaurantName,
            city: state.city,
            country: state.country,
            cuisineType: state.cuisineType,
            locale: state.locale,
          },
          next,
        );

        // Merge extracted data into wizard state
        if (result.extracted) {
          const e = result.extracted;
          setState({
            ...state,
            restaurantName: e.restaurantName ?? state.restaurantName,
            city: e.city ?? state.city,
            cuisineType: e.cuisineType ?? state.cuisineType,
            brandVibe: e.brandVibe ?? state.brandVibe,
            menuItems: e.menuItems
              ? [
                  ...state.menuItems,
                  ...e.menuItems.map((m) => ({
                    id: crypto.randomUUID(),
                    name: m.name,
                    description: m.description ?? "",
                    category: m.category,
                    priceCents: m.priceCents ?? 0,
                  })),
                ]
              : state.menuItems,
          });
        }

        setMessages([...next, { role: "assistant", content: result.message }]);

        if (result.nextStep === "review") {
          // Hand off to wizard's review step
          setTimeout(() => setStep("review"), 600);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "AI fejlede");
      }
    });
  };

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-zinc-200 bg-white">
      <header className="border-b border-zinc-100 px-4 py-3">
        <h2 className="text-lg font-semibold">Snak med Plates</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Beskriv din restaurant — vi udfylder alt for dig undervejs.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="space-y-3">
          {messages.map((m, i) => (
            <li key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                  m.role === "user"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-900",
                )}
              >
                {m.content}
              </div>
            </li>
          ))}
          {isThinking && (
            <li className="flex justify-start">
              <div className="rounded-2xl bg-zinc-100 px-4 py-2.5 text-sm text-zinc-500">
                <span className="inline-flex gap-1">
                  <Dot delay={0} />
                  <Dot delay={150} />
                  <Dot delay={300} />
                </span>
              </div>
            </li>
          )}
        </ul>
      </div>

      {error && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="border-t border-zinc-100 p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Skriv et svar..."
            rows={2}
            className="flex-1 resize-none rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
          <button
            type="button"
            onClick={send}
            disabled={isThinking || !draft.trim()}
            className="rounded-full bg-[oklch(0.45_0.16_145)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[oklch(0.40_0.16_145)] disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="size-1.5 animate-bounce rounded-full bg-zinc-400"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
