"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import {
  improveMenuItemDescription,
  onboardingChatTurn,
  suggestDishes,
  type ChatMessage,
  type ChatTurnOutput,
  type DishSuggestion,
  type RestaurantContext,
} from "@plates/ai";
import {
  getDb,
  ids,
  signupIntents,
  tenants,
} from "@plates/db";

const SUBDOMAIN_RE = /^[a-z][a-z0-9-]{2,31}$/;
const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "admin",
  "api",
  "dashboard",
  "docs",
  "help",
  "status",
  "blog",
  "support",
  "mail",
  "auth",
]);

function requireApiKey(): string {
  const { env } = getCloudflareContext();
  const key = env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Run `wrangler secret put ANTHROPIC_API_KEY`.",
    );
  }
  return key;
}

export type SubdomainCheckResult =
  | { available: true; suggestion?: undefined }
  | { available: false; reason: "invalid" | "reserved" | "taken"; suggestion?: string };

export async function checkSubdomainAvailability(
  raw: string,
): Promise<SubdomainCheckResult> {
  const subdomain = raw.toLowerCase().trim();
  if (!SUBDOMAIN_RE.test(subdomain)) {
    return { available: false, reason: "invalid" };
  }
  if (RESERVED_SUBDOMAINS.has(subdomain)) {
    return { available: false, reason: "reserved" };
  }

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const [tenantHit, intentHit] = await Promise.all([
    db.select({ id: tenants.id }).from(tenants).where(eq(tenants.subdomain, subdomain)).get(),
    db.select({ id: signupIntents.id }).from(signupIntents).where(eq(signupIntents.subdomain, subdomain)).get(),
  ]);

  if (tenantHit || intentHit) {
    return {
      available: false,
      reason: "taken",
      suggestion: `${subdomain}-${Math.floor(Math.random() * 90 + 10)}`,
    };
  }

  return { available: true };
}

export type WizardContextInput = {
  restaurantName: string;
  city: string;
  country?: string;
  cuisineType?: string;
  locale?: string;
};

function toRestaurantContext(input: WizardContextInput): RestaurantContext {
  return {
    tenantName: input.restaurantName,
    city: input.city,
    country: input.country ?? "DK",
    cuisineType: input.cuisineType,
    locale: input.locale ?? "da",
  };
}

export async function aiSuggestDishesAction(
  ctx: WizardContextInput,
  count: number = 8,
): Promise<DishSuggestion[]> {
  const apiKey = requireApiKey();
  const { output } = await suggestDishes(
    { apiKey },
    toRestaurantContext(ctx),
    count,
  );
  return output.dishes;
}

export async function aiImproveDescriptionAction(
  ctx: WizardContextInput,
  item: { name: string; rawDescription?: string },
): Promise<string> {
  const apiKey = requireApiKey();
  const { output } = await improveMenuItemDescription(
    { apiKey },
    toRestaurantContext(ctx),
    item,
  );
  return output.description;
}

export async function aiChatTurnAction(
  ctx: Partial<WizardContextInput>,
  history: ChatMessage[],
): Promise<ChatTurnOutput> {
  const apiKey = requireApiKey();
  const { output } = await onboardingChatTurn(
    { apiKey },
    {
      tenantName: ctx.restaurantName,
      city: ctx.city,
      cuisineType: ctx.cuisineType,
      locale: ctx.locale ?? "da",
    },
    history,
  );
  return output;
}

// ─── Submit ──────────────────────────────────────────────────────────────────

export type WizardState = {
  restaurantName: string;
  subdomain: string;
  city: string;
  country: string;
  cuisineType?: string;
  brandVibe?: string;
  locale: string;
  email: string;
  menuItems: Array<{
    name: string;
    description?: string;
    category: string;
    priceCents: number;
  }>;
};

export type SubmitResult =
  | { ok: true; intentId: string; subdomain: string }
  | { ok: false; error: string };

export async function submitSignupIntentAction(
  state: WizardState,
): Promise<SubmitResult> {
  // Server-side validation — never trust client
  if (!state.email.includes("@")) return { ok: false, error: "Invalid email" };
  if (!state.restaurantName.trim()) return { ok: false, error: "Restaurant name required" };

  const subdomainCheck = await checkSubdomainAvailability(state.subdomain);
  if (!subdomainCheck.available) {
    return { ok: false, error: `Subdomain unavailable: ${subdomainCheck.reason}` };
  }

  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const id = ids.signupIntent();
  await db
    .insert(signupIntents)
    .values({
      id,
      email: state.email.toLowerCase().trim(),
      subdomain: state.subdomain.toLowerCase().trim(),
      restaurantName: state.restaurantName.trim(),
      wizardJson: JSON.stringify(state),
    })
    .run();

  return { ok: true, intentId: id, subdomain: state.subdomain };
}
