export const PLANS = {
  FREE: {
    label: "BYOK",
    dailyReadings: Infinity,
    spreads: ["single_card", "three_card", "celtic_cross", "relationship_cross"],
    historyDays: Infinity,
    galleryPreview: true,
    aiDepth: "depends_on_user_model",
    shareTemplates: "local",
  },
  PREMIUM: {
    label: "Hosted",
    dailyReadings: Infinity,
    spreads: ["single_card", "three_card", "celtic_cross", "relationship_cross"],
    historyDays: Infinity,
    galleryPreview: false,
    aiDepth: "managed",
    shareTemplates: "premium",
    status: "reserved",
  },
} as const;

export const PRICING = {
  monthly: { price: 0, period: "month" as const },
  yearly: { price: 0, period: "year" as const, discount: 0 },
} as const;

export const ROUTES = {
  home: "/",
  reading: "/reading",
  gallery: "/gallery",
  daily: "/daily",
  history: "/history",
  profile: "/profile",
  pricing: "/pricing",
  settings: "/settings",
} as const;
