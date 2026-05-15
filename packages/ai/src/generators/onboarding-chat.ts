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

const CHAT_SYSTEM = `You are Plates, an AI assistant helping a restaurant owner build their website during onboarding. You ask one focused question at a time to gather:

1. Restaurant name + city (if not already known)
2. Cuisine type and brand vibe (casual / upscale / family / etc.)
3. 5–15 menu items with names, descriptions, prices, categories
4. Email and chosen subdomain at the end

Conversation rules:
- Be warm and concrete. Match the user's language (Danish if they write Danish, English if they write English).
- Ask ONE thing per turn. Wait for the answer.
- When the user gives you info, extract it into the structured "extracted" field.
- When you have enough info to populate the wizard state, set nextStep to "review".
- When confirming, summarize what you've captured.

Output STRICTLY conforms to the JSON schema.`;

const CHAT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    message: {
      type: "string",
      description: "The reply to show the user. Keep it short (1–3 sentences).",
    },
    extracted: {
      type: "object",
      additionalProperties: false,
      properties: {
        restaurantName: { type: "string" },
        city: { type: "string" },
        cuisineType: { type: "string" },
        brandVibe: { type: "string" },
        menuItems: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              category: { type: "string" },
              priceCents: { type: "integer" },
            },
            required: ["name", "category"],
          },
        },
      },
    },
    nextStep: {
      type: "string",
      enum: ["continue", "review"],
      description: "Set to 'review' when ready to show the preview and collect email.",
    },
  },
  required: ["message", "nextStep"],
} as const;

export type ChatExtracted = {
  restaurantName?: string;
  city?: string;
  cuisineType?: string;
  brandVibe?: string;
  menuItems?: Array<{
    name: string;
    description?: string;
    category: string;
    priceCents?: number;
  }>;
};

export type ChatTurnOutput = {
  message: string;
  extracted?: ChatExtracted;
  nextStep: "continue" | "review";
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function onboardingChatTurn(
  opts: AiClientOptions,
  ctx: Partial<RestaurantContext>,
  history: ChatMessage[],
): Promise<GenerationResult<ChatTurnOutput>> {
  const client = getAnthropic(opts);

  const knownContext = [
    ctx.tenantName ? `Restaurant name (already known): ${ctx.tenantName}` : null,
    ctx.city ? `City (already known): ${ctx.city}` : null,
    ctx.cuisineType ? `Cuisine (already known): ${ctx.cuisineType}` : null,
    ctx.locale ? `Output language: ${ctx.locale}` : "Output language: infer from user input (default: Danish)",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1500,
    system: [
      {
        type: "text",
        text: CHAT_SYSTEM,
        cache_control: { type: "ephemeral" },
      },
      {
        type: "text",
        text: knownContext,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: history.map((m) => ({ role: m.role, content: m.content })),
    output_config: {
      format: { type: "json_schema", schema: CHAT_SCHEMA },
    },
  });

  return {
    output: extractJson<ChatTurnOutput>(response.content),
    usage: extractUsage(response.usage),
  };
}
