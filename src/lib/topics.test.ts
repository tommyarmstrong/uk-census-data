import { describe, expect, it } from "vitest";

import { TOPICS } from "./topics";

describe("TOPICS", () => {
  it("lists eight Census topics with tile emojis", () => {
    expect(TOPICS).toHaveLength(8);
    expect(TOPICS.map((topic) => topic.slug)).toEqual([
      "demographics",
      "housing",
      "employment",
      "education",
      "health-and-disability",
      "transport",
      "family-and-relationships",
      "migration",
    ]);

    for (const topic of TOPICS) {
      expect(topic.emoji.length).toBeGreaterThan(0);
      expect(topic.name.length).toBeGreaterThan(0);
      expect(topic.description.length).toBeGreaterThan(0);
    }
  });
});
