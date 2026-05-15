import {
  buildContextPrompt,
  getAnthropic,
  type AiClientOptions,
  type RestaurantContext,
} from "../client";
import { PLACE_PAGE_SCHEMA, PLACE_PAGE_SYSTEM } from "../prompts";
import {
  extractJson,
  extractUsage,
  type GenerationResult,
} from "./menu-item-seo";

export type PlacePageInput = {
  /** Slug-friendly area name, e.g. "norrebro", "vesterbro". */
  slug: string;
  /** Display name, e.g. "Nørrebro", "Vesterbro". */
  areaName: string;
  /** Optional: distance + transport hints from the location. */
  distanceFromLocation?: string;
  /** Optional: free-text notes about the area. */
  areaContext?: string;
};

export type PlacePageOutput = {
  title: string;
  seo_title: string;
  seo_description: string;
  body_md: string;
};

/**
 * Generate a local-SEO landing page for a neighborhood near the restaurant.
 *
 * Uses Sonnet 4.6 with adaptive thinking — the page needs creative, grounded
 * copy that avoids clichés. Cost is 5–10× a Haiku call, so trigger explicitly
 * (admin batch job), not on every request.
 */
export async function generatePlacePage(
  opts: AiClientOptions,
  ctx: RestaurantContext,
  area: PlacePageInput,
): Promise<GenerationResult<PlacePageOutput>> {
  const client = getAnthropic(opts);

  const userMessage = [
    `Area: ${area.areaName}`,
    area.distanceFromLocation
      ? `Distance from us: ${area.distanceFromLocation}`
      : null,
    area.areaContext ? `Area notes: ${area.areaContext}` : null,
    "",
    "Generate the landing page JSON.",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "medium",
      format: {
        type: "json_schema",
        schema: PLACE_PAGE_SCHEMA,
      },
    },
    system: [
      {
        type: "text",
        text: PLACE_PAGE_SYSTEM,
        cache_control: { type: "ephemeral" },
      },
      {
        type: "text",
        text: buildContextPrompt(ctx),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userMessage }],
  });

  return {
    output: extractJson<PlacePageOutput>(response.content),
    usage: extractUsage(response.usage),
  };
}
