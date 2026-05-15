import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import {
  getDb,
  cartItems,
  carts,
  ids,
  menuItems,
  type Cart,
  type CartItem,
} from "@plates/db";

const COOKIE_NAME = "plates_cart_id";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const CART_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export type CartLineItem = CartItem & {
  imageUrl: string | null;
};

export type CartView = {
  cart: Cart;
  items: CartLineItem[];
  subtotalCents: number;
  itemCount: number;
};

export async function getCartView(tenantId: string): Promise<CartView | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(COOKIE_NAME)?.value;
  if (!cartId) return null;

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const cart = await db.select().from(carts).where(eq(carts.id, cartId)).get();
  if (!cart || cart.tenantId !== tenantId) return null;

  const items = await db
    .select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      menuItemId: cartItems.menuItemId,
      quantity: cartItems.quantity,
      modifiersJson: cartItems.modifiersJson,
      nameSnapshot: cartItems.nameSnapshot,
      unitPriceCents: cartItems.unitPriceCents,
      notes: cartItems.notes,
      createdAt: cartItems.createdAt,
      imageUrl: menuItems.imageUrl,
    })
    .from(cartItems)
    .leftJoin(menuItems, eq(cartItems.menuItemId, menuItems.id))
    .where(eq(cartItems.cartId, cartId))
    .all();

  const subtotalCents = items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { cart, items, subtotalCents, itemCount };
}

export async function getOrCreateCart(tenantId: string): Promise<Cart> {
  const cookieStore = await cookies();
  const existingId = cookieStore.get(COOKIE_NAME)?.value;
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  if (existingId) {
    const existing = await db
      .select()
      .from(carts)
      .where(eq(carts.id, existingId))
      .get();
    if (existing && existing.tenantId === tenantId) return existing;
  }

  const id = ids.cart();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CART_TTL_MS);

  await db
    .insert(carts)
    .values({
      id,
      tenantId,
      expiresAt,
      fulfillmentType: "pickup",
    })
    .run();

  cookieStore.set(COOKIE_NAME, id, {
    maxAge: COOKIE_MAX_AGE_SECONDS,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  const created = await db.select().from(carts).where(eq(carts.id, id)).get();
  if (!created) throw new Error("Failed to create cart");
  return created;
}
