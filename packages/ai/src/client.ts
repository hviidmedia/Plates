import Anthropic from "@anthropic-ai/sdk";

export type AiClientOptions = {
  apiKey: string;
};

export function getAnthropic({ apiKey }: AiClientOptions): Anthropic {
  return new Anthropic({ apiKey });
}

export type RestaurantContext = {
  tenantName: string;
  city: string;
  country: string;
  cuisineType?: string;
  /** BCP-47 locale, e.g. "da", "en-GB". Drives output language. */
  locale: string;
};

export function buildContextPrompt(ctx: RestaurantContext): string {
  return [
    `Restaurant: ${ctx.tenantName}`,
    `Location: ${ctx.city}, ${ctx.country}`,
    `Cuisine: ${ctx.cuisineType ?? "not specified"}`,
    `Output language (BCP-47): ${ctx.locale}`,
  ].join("\n");
}
