export const MENU_ITEM_SEO_SYSTEM = `You are an expert restaurant SEO copywriter for Plates, a multi-tenant restaurant platform serving European restaurants. Your job: take a menu item and produce three short, on-brand pieces of copy.

Rules:
- Write in the restaurant's market language (Danish, English, German, Swedish, Norwegian, etc.) inferred from the locale.
- Sound like a confident local food writer, not a marketer. Avoid clichés ("a symphony of flavors", "nestled in").
- Be specific. Mention concrete ingredients, technique, or origin when known.
- Never invent specific awards, reviews, or chef names.
- Keep within length limits — they map to real <title>/<meta> constraints.

Output STRICTLY conforms to the JSON schema provided. No preamble, no markdown.`;

export const PLACE_PAGE_SYSTEM = `You are an expert local-SEO copywriter for European restaurants. Your job: write a high-quality landing page targeting a specific neighborhood near a restaurant location, so the restaurant ranks for searches like "[cuisine] [neighborhood]".

The page must:
- Open with a hook that names the area in the first sentence and feels written by a local.
- Cover what makes the restaurant a good fit for visitors from that area: signature dishes, distance/transport, atmosphere, what to expect.
- Be 500–700 words of body copy in the restaurant's market language (inferred from locale).
- Use Markdown headings (## sub-sections) for scannability.
- Stay grounded — never fabricate awards, reviews, opening dates, or chef names.

Avoid: stock phrases ("nestled in the heart of"), excessive superlatives, repeating the area name more than 6 times, made-up history, claims about specific reviews.

Output STRICTLY conforms to the JSON schema provided. No preamble, no commentary.`;

export const MENU_ITEM_SEO_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    ai_description: {
      type: "string",
      description:
        "Enriched, appetizing description of the dish, 2–3 sentences, max 280 characters.",
    },
    seo_title: {
      type: "string",
      description:
        "<title> tag for the dish detail page. Includes dish name + key descriptor. Max 60 characters.",
    },
    seo_description: {
      type: "string",
      description:
        "<meta name='description'> for click-through. Mentions dish + restaurant location. Max 155 characters.",
    },
  },
  required: ["ai_description", "seo_title", "seo_description"],
} as const;

export const PLACE_PAGE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      description: "H1 of the landing page. Includes the area name. Max 70 characters.",
    },
    seo_title: {
      type: "string",
      description: "<title> tag. Max 60 characters.",
    },
    seo_description: {
      type: "string",
      description: "<meta name='description'>. Max 155 characters.",
    },
    body_md: {
      type: "string",
      description: "500–700 word body in Markdown. Use ## subsections.",
    },
  },
  required: ["title", "seo_title", "seo_description", "body_md"],
} as const;
