export type Topic = {
  slug: string;
  name: string;
  description: string;
  /** Decorative glyph shown on home topic tiles. */
  emoji: string;
};

/** Major Census 2021 topic areas. v1 charts: src/lib/topic-map.ts */
export const TOPICS: Topic[] = [
  {
    slug: "demographics",
    name: "Demographics",
    description: "Age, gender, and related population characteristics.",
    emoji: "👥",
  },
  {
    slug: "housing",
    name: "Housing",
    description: "Housing types, occupation, and related measures.",
    emoji: "🏠",
  },
  {
    slug: "employment",
    name: "Employment",
    description: "Work and economic activity indicators.",
    emoji: "💼",
  },
  {
    slug: "education",
    name: "Education",
    description: "Qualifications and educational attainment.",
    emoji: "🎓",
  },
  {
    slug: "health-and-disability",
    name: "Health and Disability",
    description: "Health status and disability measures.",
    emoji: "🏥",
  },
  {
    slug: "transport",
    name: "Transport",
    description: "Travel to work and transport methods.",
    emoji: "🚗",
  },
  {
    slug: "family-and-relationships",
    name: "Family and Relationships",
    description: "Household composition and relationships.",
    emoji: "👨‍👩‍👧‍👦",
  },
  {
    slug: "migration",
    name: "Migration",
    description: "Country of birth and migration patterns.",
    emoji: "🌍",
  },
];
