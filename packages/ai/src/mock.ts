/**
 * Dev mock implementations of every generator. Same signatures as the real
 * ones in ./generators/* but return canned Danish responses with a short
 * artificial delay so loading states render the same as in production.
 *
 * The action layer (apps/web/src/lib/*-actions.ts) selects mock vs real
 * based on whether ANTHROPIC_API_KEY is present in the runtime env. No
 * code changes needed to switch — set the secret and the real generators
 * take over automatically.
 */

import type { RestaurantContext } from "./client";
import type {
  ChatMessage,
  ChatTurnOutput,
} from "./generators/onboarding-chat";
import type {
  DishSuggestion,
  DishSuggestionsOutput,
} from "./generators/dish-suggestions";
import type {
  GenerationResult,
  GenerationUsage,
  MenuItemSeoInput,
  MenuItemSeoOutput,
} from "./generators/menu-item-seo";
import type {
  ImproveDescriptionInput,
  ImproveDescriptionOutput,
} from "./generators/improve-description";
import type {
  PlacePageInput,
  PlacePageOutput,
} from "./generators/place-page";

const ZERO_USAGE: GenerationUsage = {
  inputTokens: 0,
  outputTokens: 0,
  cacheReadTokens: 0,
  cacheCreationTokens: 0,
};

async function fakeLatency(min = 200, max = 500): Promise<void> {
  const ms = min + Math.floor(Math.random() * (max - min));
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function wrap<T>(output: T): GenerationResult<T> {
  return { output, usage: ZERO_USAGE };
}

// ─── menu-item SEO ──────────────────────────────────────────────────────────

export async function mockGenerateMenuItemSeo(
  ctx: RestaurantContext,
  item: MenuItemSeoInput,
): Promise<GenerationResult<MenuItemSeoOutput>> {
  await fakeLatency();

  const base = item.rawDescription?.trim();
  const enriched = base
    ? `${base.replace(/\.$/, "")} — serveret som kun ${ctx.tenantName} kan.`
    : `Vores ${item.name.toLowerCase()} — håndlavet i ${ctx.city}, anbefalet af alle der har prøvet den.`;

  const priceTag = item.priceCents
    ? ` ${(item.priceCents / 100).toFixed(0)} ${item.currency ?? "kr"}`
    : "";

  return wrap({
    ai_description: enriched,
    seo_title: `${item.name}${priceTag} · ${ctx.tenantName} · ${ctx.city}`,
    seo_description: `Bestil ${item.name.toLowerCase()} direkte hos ${ctx.tenantName} i ${ctx.city}. Pickup og levering i nabolaget.`,
  });
}

// ─── place page ─────────────────────────────────────────────────────────────

export async function mockGeneratePlacePage(
  ctx: RestaurantContext,
  area: PlacePageInput,
): Promise<GenerationResult<PlacePageOutput>> {
  // Longer delay — the real one uses Sonnet with thinking.
  await fakeLatency(800, 1500);

  const cuisine = ctx.cuisineType ?? "mad";
  const title = `${capitalize(cuisine)} på ${area.areaName}`;

  const body_md = [
    `# ${title}`,
    "",
    `Bor du på ${area.areaName}? Så er ${ctx.tenantName} et af de hurtigste valg, når sulten melder sig. Vi laver ${cuisine} med fokus på kvalitet og friske råvarer — og leverer eller har klar til afhentning, samme dag du bestiller.`,
    "",
    `## Hvorfor ${ctx.tenantName} på ${area.areaName}`,
    "",
    `- Lokal forankring i ${ctx.city} siden vi åbnede.`,
    `- ${area.distanceFromLocation ?? "Tæt på"} — afhentning på under 15 minutter.`,
    "- Direkte ordreflow uden gebyrer til tredjepart.",
    "- GDPR-venlig: dine ordrer ligger kun hos os.",
    "",
    "## Sådan bestiller du",
    "",
    `1. Vælg dine retter fra [menuen](/menu).`,
    `2. Vælg pickup eller levering til ${area.areaName}.`,
    `3. Bekræft. Vi giver dig besked når maden er klar.`,
    "",
    "## Bestiller du fast?",
    "",
    `Opret en bruger første gang du bestiller hos ${ctx.tenantName}. Næste gang er det to klik — du har dine yndlingsretter klar.`,
  ].join("\n");

  return wrap({
    title,
    seo_title: `${title} · ${ctx.tenantName}`,
    seo_description: `${ctx.tenantName} laver ${cuisine} til pickup og levering på ${area.areaName} i ${ctx.city}. Bestil direkte uden gebyrer.`,
    body_md,
  });
}

// ─── dish suggestions ───────────────────────────────────────────────────────

const DISH_TEMPLATES: Record<string, DishSuggestion[]> = {
  burger: [
    { name: "Klassisk Burger", description: "Hjemmemalet okse, brioche, cheddar, sprøde løg.", category: "Burgers", suggestedPriceCents: 11900 },
    { name: "Cheeseburger Deluxe", description: "Dobbelt patty, smelteost, bacon, syltede agurker.", category: "Burgers", suggestedPriceCents: 13900 },
    { name: "Veggie Burger", description: "Sortbønne-patty, avocado, grillet halloumi, salsa.", category: "Burgers", suggestedPriceCents: 11500 },
    { name: "Sprøde Pommes", description: "Tre gange stegte kartofler, flagesalt, hjemmelavet mayo.", category: "Sider", suggestedPriceCents: 4500 },
    { name: "Sweet Potato Fries", description: "Søde kartofler, chipotle-aioli til at dyppe.", category: "Sider", suggestedPriceCents: 5500 },
    { name: "Hjemmelavet Lemonade", description: "Pres af friske citroner, mynte, brunt rørsukker.", category: "Drikke", suggestedPriceCents: 4500 },
    { name: "Craft Beer", description: "Lokal IPA fra et nordjysk bryggeri.", category: "Drikke", suggestedPriceCents: 5900 },
    { name: "Chokoladekage", description: "Saftig double-chocolate brownie, vaniljeis.", category: "Desserter", suggestedPriceCents: 6500 },
  ],
  taco: [
    { name: "Birria Tacos (3 stk)", description: "Langtidsbraiseret okse, smelteost, consomé til at dyppe.", category: "Tacos", suggestedPriceCents: 14900 },
    { name: "Carnitas Tacos (3 stk)", description: "Sprødstegt svin, syltet rødløg, salsa verde.", category: "Tacos", suggestedPriceCents: 12900 },
    { name: "Fish Tacos (3 stk)", description: "Pankobrød kulmule, chipotle-mayo, kålsalat.", category: "Tacos", suggestedPriceCents: 13900 },
    { name: "Mushroom Tacos (3 stk)", description: "Bønne-puré, ristede svampe, hjemmelavet salsa macha.", category: "Tacos", suggestedPriceCents: 11900 },
    { name: "Guacamole & Tortillachips", description: "Frisk knust avocado, lime, koriander, sprøde chips.", category: "Sider", suggestedPriceCents: 6900 },
    { name: "Elote", description: "Grillet majs med queso fresco, lime, tajín.", category: "Sider", suggestedPriceCents: 5500 },
    { name: "Margarita", description: "Tequila, lime, agave, salt til kanten.", category: "Drikke", suggestedPriceCents: 8900 },
    { name: "Horchata", description: "Hjemmelavet risdrik, kanel, vanilje.", category: "Drikke", suggestedPriceCents: 4500 },
  ],
  italian: [
    { name: "Margherita", description: "San Marzano tomat, mozzarella, basilikum, ekstra jomfru olivenolie.", category: "Pizza", suggestedPriceCents: 11900 },
    { name: "Diavola", description: "Spicy salami, mozzarella, friske chili, oregano.", category: "Pizza", suggestedPriceCents: 13900 },
    { name: "Quattro Formaggi", description: "Gorgonzola, parmesan, fontina, mozzarella, honning.", category: "Pizza", suggestedPriceCents: 14500 },
    { name: "Cacio e Pepe", description: "Friskstrøget tonnarelli, pecorino romano, sortpeber.", category: "Pasta", suggestedPriceCents: 13500 },
    { name: "Burrata", description: "Cremet burrata, modne tomater, basilikum, balsamico.", category: "Forretter", suggestedPriceCents: 9900 },
    { name: "Tiramisu", description: "Klassisk mascarpone-creme, espresso, kakao.", category: "Desserter", suggestedPriceCents: 6900 },
    { name: "Aperol Spritz", description: "Aperol, prosecco, sodavand, appelsin.", category: "Drikke", suggestedPriceCents: 7900 },
    { name: "Italiensk Husvin", description: "Glas husrød eller hushvid fra Toscana.", category: "Drikke", suggestedPriceCents: 6900 },
  ],
  default: [
    { name: "Husets Bowl", description: "Sæsonens grøntsager, hjemmelavet dressing, dit valg af protein.", category: "Bowls", suggestedPriceCents: 12900 },
    { name: "Dagens Suppe", description: "Skiftende efter sæsonen, serveret med surdejsbrød.", category: "Forretter", suggestedPriceCents: 7900 },
    { name: "Frokostsandwich", description: "Surdejsbrød, dagens fyld, syltede grøntsager.", category: "Sandwich", suggestedPriceCents: 9500 },
    { name: "Cæsarsalat", description: "Hjertesalat, parmesan, anjos, kruton, klassisk dressing.", category: "Salater", suggestedPriceCents: 11500 },
    { name: "Husets Kage", description: "Bagt i morges. Spørg om dagens udvalg.", category: "Desserter", suggestedPriceCents: 5500 },
    { name: "Specialty Kaffe", description: "Single-origin bønner, brygget på din foretrukne måde.", category: "Drikke", suggestedPriceCents: 4500 },
    { name: "Hjemmelavet Lemonade", description: "Frisk pres, mynte, lidt sukker.", category: "Drikke", suggestedPriceCents: 4500 },
    { name: "Husets Brunch", description: "Vores faste tallerken: æg, brød, ost, charcuteri, friske bær.", category: "Brunch", suggestedPriceCents: 14900 },
  ],
};

function pickDishSet(cuisineType?: string): DishSuggestion[] {
  const cuisine = cuisineType?.toLowerCase() ?? "";
  if (cuisine.includes("burger")) return DISH_TEMPLATES.burger!;
  if (cuisine.includes("taco") || cuisine.includes("mexican")) return DISH_TEMPLATES.taco!;
  if (cuisine.includes("pizza") || cuisine.includes("ital") || cuisine.includes("pasta")) return DISH_TEMPLATES.italian!;
  return DISH_TEMPLATES.default!;
}

export async function mockSuggestDishes(
  ctx: RestaurantContext,
  count: number = 8,
): Promise<GenerationResult<DishSuggestionsOutput>> {
  await fakeLatency(500, 1000);
  const base = pickDishSet(ctx.cuisineType);
  return wrap({ dishes: base.slice(0, count) });
}

// ─── improve description ────────────────────────────────────────────────────

export async function mockImproveDescription(
  _ctx: RestaurantContext,
  item: ImproveDescriptionInput,
): Promise<GenerationResult<ImproveDescriptionOutput>> {
  await fakeLatency(300, 600);

  const raw = item.rawDescription?.trim();
  if (!raw) {
    return wrap({
      description: `Vores ${item.name.toLowerCase()} — håndlavet på stedet med friske råvarer.`,
    });
  }

  const tweaks = [
    raw.replace(/^en /i, "Vores "),
    `${raw} — anbefales af huset.`,
    `${raw.replace(/\.$/, "")}. Lavet på stedet.`,
    `Klassisk ${item.name.toLowerCase()}: ${raw.charAt(0).toLowerCase()}${raw.slice(1)}`,
  ];
  const pick = tweaks[Math.floor(Math.random() * tweaks.length)] ?? raw;
  return wrap({ description: pick.slice(0, 160) });
}

// ─── onboarding chat ────────────────────────────────────────────────────────

export async function mockOnboardingChatTurn(
  ctx: Partial<RestaurantContext>,
  history: ChatMessage[],
): Promise<GenerationResult<ChatTurnOutput>> {
  await fakeLatency(400, 900);

  const userTurns = history.filter((m) => m.role === "user").length;
  const lastUser = [...history].reverse().find((m) => m.role === "user")?.content ?? "";

  // Very simple progression: name → city → cuisine → menu → review.
  if (!ctx.tenantName && userTurns <= 1) {
    return wrap({
      message: "Velkommen! Lad os starte med det vigtigste. Hvad hedder din restaurant?",
      extracted: {},
      nextStep: "continue",
    });
  }

  if (!ctx.city && userTurns === 2) {
    return wrap({
      message: `Fedt navn! Og hvor ligger ${ctx.tenantName ?? "restauranten"}? (by + bydel hvis du har en)`,
      extracted: { restaurantName: lastUser },
      nextStep: "continue",
    });
  }

  if (!ctx.cuisineType && userTurns === 3) {
    return wrap({
      message: "Hvilken type køkken laver I? F.eks. burgere, tacos, italiensk, brunch...",
      extracted: { city: lastUser },
      nextStep: "continue",
    });
  }

  if (userTurns === 4) {
    return wrap({
      message: "Skal jeg foreslå nogle klassikere, eller har du selv en menu klar du vil indtaste?",
      extracted: { cuisineType: lastUser },
      nextStep: "continue",
    });
  }

  // Last turn: offer to switch to review.
  return wrap({
    message: "Jeg har nok til at lave et udkast. Skifter til oversigt, hvor du kan justere og indtaste email + subdomain.",
    extracted: {},
    nextStep: "review",
  });
}

// ─── helpers ────────────────────────────────────────────────────────────────

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
