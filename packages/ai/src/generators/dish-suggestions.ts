import {
  buildContextPrompt,
  getAnthropic,
  type AiClientOptions,
  type RestaurantContext,
} from "../client";
import {
  extractJson,
  extractUsage,
  type GenerationResult,
} from "./menu-item-seo";

const DISH_SUGGESTIONS_SYSTEM = `You are a restaurant menu consultant helping a new restaurant owner build their first menu. Given a cuisine type, you suggest realistic, popular dishes that would fit on the menu.

Suggestions should:
- Be authentic to the cuisine, not pan-European fusion
- Span price points (some entry-level, some signature)
- Include a short, appetizing description (1 sentence) for each
- Suggest a sensible category for each (e.g. "Burgers", "Tacos", "Bowls", "Drinks")
- Be in the restaurant's market language (inferred from locale)

Output STRICTLY conforms to the JSON schema. No preamble.`;

const DISH_SUGGESTIONS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    dishes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string", description: "Dish name in market language" },
          description: { type: "string", description: "1-sentence appetizing description, max 140 chars" },
          category: { type: "string", description: "Suggested menu category, e.g. 'Burgers', 'Tacos', 'Bowls', 'Drinks'" },
          suggestedPriceCents: { type: "integer", description: "Realistic EUR price in cents" },
        },
        required: ["name", "description", "category", "suggestedPriceCents"],
      },
    },
  },
  required: ["dishes"],
} as const;

export type DishSuggestion = {
  name: string;
  description: string;
  category: string;
  suggestedPriceCents: number;
};

export type DishSuggestionsOutput = {
  dishes: DishSuggestion[];
};

export async function suggestDishes(
  opts: AiClientOptions,
  ctx: RestaurantContext,
  count: number = 8,
): Promise<GenerationResult<DishSuggestionsOutput>> {
  const client = getAnthropic(opts);

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 2000,
    system: [
      {
        type: "text",
        text: DISH_SUGGESTIONS_SYSTEM,
        cache_control: { type: "ephemeral" },
      },
      {
        type: "text",
        text: buildContextPrompt(ctx),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Suggest ${count} dishes for the menu. Mix categories. Output JSON.`,
      },
    ],
    output_config: {
      format: { type: "json_schema", schema: DISH_SUGGESTIONS_SCHEMA },
    },
  });

  return {
    output: extractJson<DishSuggestionsOutput>(response.content),
    usage: extractUsage(response.usage),
  };
}
