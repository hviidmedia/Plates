import type Anthropic from "@anthropic-ai/sdk";
import {
  buildContextPrompt,
  getAnthropic,
  type AiClientOptions,
  type RestaurantContext,
} from "../client";
import { MENU_ITEM_SEO_SCHEMA, MENU_ITEM_SEO_SYSTEM } from "../prompts";

export type MenuItemSeoInput = {
  name: string;
  rawDescription?: string | null;
  priceCents?: number;
  currency?: string;
};

export type MenuItemSeoOutput = {
  ai_description: string;
  seo_title: string;
  seo_description: string;
};

export type GenerationUsage = {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
};

export type GenerationResult<T> = {
  output: T;
  usage: GenerationUsage;
};

/**
 * Generate SEO copy for a single menu item.
 *
 * Cost-optimized for bulk runs: Haiku 4.5 + prompt caching on system + restaurant
 * context. The first call in a tenant batch pays the cache write (~1.25× input);
 * subsequent calls within 5 minutes pay ~0.1× for the cached prefix.
 */
export async function generateMenuItemSeo(
  opts: AiClientOptions,
  ctx: RestaurantContext,
  item: MenuItemSeoInput,
): Promise<GenerationResult<MenuItemSeoOutput>> {
  const client = getAnthropic(opts);

  const userMessage = [
    `Item name: ${item.name}`,
    `Raw description: ${item.rawDescription ?? "(none — infer from the name)"}`,
    item.priceCents != null
      ? `Price: ${(item.priceCents / 100).toFixed(2)} ${item.currency ?? "EUR"}`
      : null,
    "",
    "Generate the JSON.",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 600,
    system: [
      {
        type: "text",
        text: MENU_ITEM_SEO_SYSTEM,
        cache_control: { type: "ephemeral" },
      },
      {
        type: "text",
        text: buildContextPrompt(ctx),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userMessage }],
    output_config: {
      format: {
        type: "json_schema",
        schema: MENU_ITEM_SEO_SCHEMA,
      },
    },
  });

  return {
    output: extractJson<MenuItemSeoOutput>(response.content),
    usage: extractUsage(response.usage),
  };
}

function extractJson<T>(content: Anthropic.ContentBlock[]): T {
  const block = content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new Error("Anthropic response had no text block");
  }
  try {
    return JSON.parse(block.text) as T;
  } catch (err) {
    throw new Error(
      `Failed to parse Anthropic JSON response: ${err instanceof Error ? err.message : String(err)}\nText: ${block.text.slice(0, 500)}`,
    );
  }
}

function extractUsage(usage: Anthropic.Usage): GenerationUsage {
  return {
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    cacheReadTokens: usage.cache_read_input_tokens ?? 0,
    cacheCreationTokens: usage.cache_creation_input_tokens ?? 0,
  };
}

export { extractJson, extractUsage };
