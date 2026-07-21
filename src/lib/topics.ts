export type Topic = {
  slug: string;
  name: string;
  description: string;
};

/** Major Census 2021 topic areas. v1 charts: src/lib/topic-map.ts */
export const TOPICS: Topic[] = [
  {
    slug: "demographics",
    name: "Demographics",
    description: "Age, gender, and related population characteristics.",
  },
  {
    slug: "housing",
    name: "Housing",
    description: "Housing types, occupation, and related measures.",
  },
  {
    slug: "employment",
    name: "Employment",
    description: "Work and economic activity indicators.",
  },
  {
    slug: "education",
    name: "Education",
    description: "Qualifications and educational attainment.",
  },
  {
    slug: "health-and-disability",
    name: "Health and Disability",
    description: "Health status and disability measures.",
  },
  {
    slug: "transport",
    name: "Transport",
    description: "Travel to work and transport methods.",
  },
  {
    slug: "family-and-relationships",
    name: "Family and Relationships",
    description: "Household composition and relationships.",
  },
  {
    slug: "migration",
    name: "Migration",
    description: "Country of birth and migration patterns.",
  },
];
