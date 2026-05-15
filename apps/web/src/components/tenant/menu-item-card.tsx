import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";
import { formatPrice } from "@/lib/format";

type Props = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
};

export function MenuItemCard({
  id,
  slug,
  name,
  description,
  priceCents,
  currency,
  imageUrl,
}: Props) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white transition hover:border-zinc-200 hover:shadow-sm">
      <Link href={`/menu/${slug}`} className="relative block aspect-[4/3] overflow-hidden bg-zinc-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="size-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-3xl text-zinc-300">
            🍽️
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/menu/${slug}`} className="font-semibold text-zinc-900 hover:underline">
            {name}
          </Link>
          <AddToCartButton menuItemId={id} />
        </div>
        {description && (
          <p className="line-clamp-2 text-sm text-zinc-600">{description}</p>
        )}
        <p className="mt-auto pt-1 text-sm font-semibold text-zinc-900">
          {formatPrice(priceCents, currency)}
        </p>
      </div>
    </article>
  );
}
