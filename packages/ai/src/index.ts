export {
  buildContextPrompt,
  getAnthropic,
  type AiClientOptions,
  type RestaurantContext,
} from "./client";

export {
  MENU_ITEM_SEO_SCHEMA,
  MENU_ITEM_SEO_SYSTEM,
  PLACE_PAGE_SCHEMA,
  PLACE_PAGE_SYSTEM,
} from "./prompts";

export {
  generateMenuItemSeo,
  type GenerationResult,
  type GenerationUsage,
  type MenuItemSeoInput,
  type MenuItemSeoOutput,
} from "./generators/menu-item-seo";

export {
  generatePlacePage,
  type PlacePageInput,
  type PlacePageOutput,
} from "./generators/place-page";

export {
  suggestDishes,
  type DishSuggestion,
  type DishSuggestionsOutput,
} from "./generators/dish-suggestions";

export {
  onboardingChatTurn,
  type ChatExtracted,
  type ChatMessage,
  type ChatTurnOutput,
} from "./generators/onboarding-chat";

export {
  improveMenuItemDescription,
  type ImproveDescriptionInput,
  type ImproveDescriptionOutput,
} from "./generators/improve-description";

export {
  mockGenerateMenuItemSeo,
  mockGeneratePlacePage,
  mockSuggestDishes,
  mockImproveDescription,
  mockOnboardingChatTurn,
} from "./mock";
