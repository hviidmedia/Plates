export type WizardMenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  priceCents: number;
};

export type WizardState = {
  restaurantName: string;
  subdomain: string;
  city: string;
  country: string;
  cuisineType: string;
  brandVibe: string;
  locale: string;
  email: string;
  menuItems: WizardMenuItem[];
};

export const EMPTY_STATE: WizardState = {
  restaurantName: "",
  subdomain: "",
  city: "",
  country: "DK",
  cuisineType: "",
  brandVibe: "",
  locale: "da",
  email: "",
  menuItems: [],
};

export type WizardStep = "info" | "menu" | "review";
export type WizardMode = "wizard" | "chat";

export const COUNTRIES = [
  { code: "DK", label: "Danmark" },
  { code: "SE", label: "Sverige" },
  { code: "NO", label: "Norge" },
  { code: "DE", label: "Tyskland" },
  { code: "NL", label: "Holland" },
  { code: "FR", label: "Frankrig" },
];

export const LOCALES = [
  { code: "da", label: "Dansk" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "sv", label: "Svenska" },
  { code: "no", label: "Norsk" },
];

export const VIBES = [
  "Casual",
  "Hyggeligt",
  "Familievenligt",
  "Hipt",
  "Eksperimentelt",
  "Klassisk",
  "Hurtigt",
  "Romantisk",
];
