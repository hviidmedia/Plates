"use client";

import { useTransition } from "react";
import { addToCart } from "@/lib/cart-actions";
import { cn } from "@plates/ui";

export function AddToCartButton({
  menuItemId,
  variant = "icon",
}: {
  menuItemId: string;
  variant?: "icon" | "wide";
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await addToCart(menuItemId);
    });
  };

  if (variant === "wide") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "w-full rounded-full bg-[oklch(0.45_0.16_145)] px-6 py-3 text-base font-medium text-white transition",
          "hover:bg-[oklch(0.40_0.16_145)] disabled:opacity-60",
        )}
      >
        {isPending ? "Tilføjer..." : "Tilføj til kurv"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label="Tilføj til kurv"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 transition",
        "hover:border-zinc-900 hover:bg-zinc-900 hover:text-white disabled:opacity-60",
      )}
    >
      {isPending ? (
        <svg viewBox="0 0 24 24" className="size-4 animate-spin fill-none stroke-current" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ) : (
        <span className="text-lg leading-none">+</span>
      )}
    </button>
  );
}
