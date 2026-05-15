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

const IMPROVE_SYSTEM = `You polish menu-item descriptions for restaurants. Take a dish name and (optional) raw description, return one improved 1–2 sentence description that:

- Sounds like a confident local food writer, not a marketer.
- Mentions concrete ingredients or technique when known. Don't invent ingredients.
- Stays under 160 characters.
- Is in the restaurant's market language.

Output STRICTLY conforms to the JSON schema. No preamble.`;

const IMPROVE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    description: { type: "string" },
  },
  required: ["description"],
} as const;

export type ImproveDescriptionInput = {
  name: string;
  rawDescription?: string;
};

export type ImproveDescriptionOutput = {
  description: string;
};

/**
 * Inline "✨ Improve" button during onboarding. Cheap, fast, single-shot.
 * Different from generateMenuItemSeo which also produces SEO meta — this is
 * just the body copy, used while the user is still typing.
 */
export async function improveMenuItemDescription(
  opts: AiClientOptions,
  ctx: RestaurantContext,
  item: ImproveDescriptionInput,
): Promise<GenerationResult<ImproveDescriptionOutput>> {
  const client = getAnthropic(opts);

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 300,
    system: [
      {
        type: "text",
        text: IMPROVE_SYSTEM,
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
        content: `Item: ${item.name}\nRaw: ${item.rawDescription ?? "(none)"}\n\nImprove it.`,
      },
    ],
    output_config: {
      format: { type: "json_schema", schema: IMPROVE_SCHEMA },
    },
  });

  return {
    output: extractJson<ImproveDescriptionOutput>(response.content),
    usage: extractUsage(response.usage),
  };
}
