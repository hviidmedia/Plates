"use server";

import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, eq } from "drizzle-orm";
import { getDb, cartItems, ids, menuItems } from "@plates/db";
import { getTenant } from "./tenant";
import { getOrCreateCart } from "./cart";

export async function addToCart(menuItemId: string): Promise<void> {
  const tenant = await getTenant();
  const cart = await getOrCreateCart(tenant.id);

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const menuItem = await db
    .select()
    .from(menuItems)
    .where(
      and(eq(menuItems.id, menuItemId), eq(menuItems.tenantId, tenant.id)),
    )
    .get();

  if (!menuItem) {
    throw new Error("Menu item not found");
  }

  // Merge with existing line if same item, no modifiers
  const existing = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.menuItemId, menuItemId),
      ),
    )
    .get();

  if (existing && !existing.modifiersJson) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + 1 })
      .where(eq(cartItems.id, existing.id))
      .run();
  } else {
    await db
      .insert(cartItems)
      .values({
        id: ids.cartItem(),
        cartId: cart.id,
        menuItemId,
        quantity: 1,
        nameSnapshot: menuItem.name,
        unitPriceCents: menuItem.priceCents,
      })
      .run();
  }

  revalidatePath("/", "layout");
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
): Promise<void> {
  const tenant = await getTenant();
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  if (quantity <= 0) {
    await removeCartItem(cartItemId);
    return;
  }

  // Verify ownership via the cart's tenant
  const item = await db
    .select({ id: cartItems.id, cartId: cartItems.cartId })
    .from(cartItems)
    .where(eq(cartItems.id, cartItemId))
    .get();
  if (!item) return;

  const { carts } = await import("@plates/db");
  const cart = await db
    .select()
    .from(carts)
    .where(and(eq(carts.id, item.cartId), eq(carts.tenantId, tenant.id)))
    .get();
  if (!cart) return;

  await db
    .update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, cartItemId))
    .run();

  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function removeCartItem(cartItemId: string): Promise<void> {
  const tenant = await getTenant();
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const item = await db
    .select({ id: cartItems.id, cartId: cartItems.cartId })
    .from(cartItems)
    .where(eq(cartItems.id, cartItemId))
    .get();
  if (!item) return;

  const { carts } = await import("@plates/db");
  const cart = await db
    .select()
    .from(carts)
    .where(and(eq(carts.id, item.cartId), eq(carts.tenantId, tenant.id)))
    .get();
  if (!cart) return;

  await db.delete(cartItems).where(eq(cartItems.id, cartItemId)).run();

  revalidatePath("/cart");
  revalidatePath("/", "layout");
}
