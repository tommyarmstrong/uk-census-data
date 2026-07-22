import { describe, expect, it } from "vitest";

import { TOPICS } from "./topics";
import {
  getChartById,
  getChartsForTopic,
  getTopicsWithCharts,
  V1_CHARTS,
} from "./topic-map";

describe("TOPICS", () => {
  it("lists the eight major topic areas", () => {
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
  });
});

describe("topic-map helpers", () => {
  it("returns charts for a known topic", () => {
    const charts = getChartsForTopic("demographics");
    expect(charts.map((chart) => chart.id)).toEqual([
      "demographics-sex",
      "demographics-age",
    ]);
  });

  it("returns an empty list for unknown topics", () => {
    expect(getChartsForTopic("unknown")).toEqual([]);
  });

  it("attaches charts to every topic", () => {
    const topics = getTopicsWithCharts();
    expect(topics).toHaveLength(TOPICS.length);
    for (const topic of topics) {
      expect(topic.charts.length).toBeGreaterThan(0);
      for (const chart of topic.charts) {
        expect(V1_CHARTS).toContainEqual(chart);
      }
    }
  });

  it("looks up charts by id", () => {
    expect(getChartById("demographics-sex")?.tableCode).toBe("TS008");
    expect(getChartById("missing")).toBeUndefined();
  });
});
