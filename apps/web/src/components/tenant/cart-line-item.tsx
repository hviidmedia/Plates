"use client";

import { useTransition } from "react";
import {
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/cart-actions";
import { formatPrice } from "@/lib/format";
import { cn } from "@plates/ui";

type Props = {
  id: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  currency: string;
  imageUrl: string | null;
};

export function CartLineItem({
  id,
  name,
  unitPriceCents,
  quantity,
  currency,
  imageUrl,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const updateQty = (next: number) => {
    startTransition(async () => {
      await updateCartItemQuantity(id, next);
    });
  };

  const remove = () => {
    startTransition(async () => {
      await removeCartItem(id);
    });
  };

  const lineTotal = unitPriceCents * quantity;

  return (
    <li
      className={cn(
        "flex items-center gap-4 p-4 transition",
        isPending && "opacity-60",
      )}
    >
      <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-xl text-zinc-300">
            🍽️
          </div>
        )}
      </div>

      <div className="flex-1">
        <p className="font-medium text-zinc-900">{name}</p>
        <p className="text-sm text-zinc-500">
          {formatPrice(unitPriceCents, currency)} pr. stk
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => updateQty(quantity - 1)}
          disabled={isPending}
          aria-label="Færre"
          className="size-8 rounded-full border border-zinc-200 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-60"
        >
          −
        </button>
        <span className="w-6 text-center font-medium tabular-nums">{quantity}</span>
        <button
          type="button"
          onClick={() => updateQty(quantity + 1)}
          disabled={isPending}
          aria-label="Flere"
          className="size-8 rounded-full border border-zinc-200 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-60"
        >
          +
        </button>
      </div>

      <div className="w-24 text-right font-semibold tabular-nums">
        {formatPrice(lineTotal, currency)}
      </div>

      <button
        type="button"
        onClick={remove}
        disabled={isPending}
        aria-label="Fjern"
        className="text-zinc-400 hover:text-red-600 disabled:opacity-60"
      >
        ✕
      </button>
    </li>
  );
}
