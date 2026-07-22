import { describe, expect, it } from "vitest";

import { TOPICS } from "./topics";
import {
  getChartById,
  getChartsForTopic,
  getTopicsWithCharts,
  TOPIC_CHARTS,
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
  it("returns v3 charts for demographics including ethnicity", () => {
    const charts = getChartsForTopic("demographics");
    expect(charts.map((chart) => chart.id)).toEqual([
      "demographics-sex",
      "demographics-age",
      "demographics-ethnicity",
    ]);
  });

  it("wires deferred subtopics onto every major topic", () => {
    expect(getChartsForTopic("housing").map((c) => c.id)).toEqual([
      "housing-tenure",
      "housing-accommodation",
      "housing-cars",
    ]);
    expect(getChartsForTopic("employment").map((c) => c.id)).toEqual([
      "employment-economic-activity",
      "employment-industry",
      "employment-occupation",
    ]);
    expect(getChartsForTopic("education").map((c) => c.id)).toEqual([
      "education-qualification",
      "education-students",
    ]);
    expect(getChartsForTopic("health-and-disability").map((c) => c.id)).toEqual(
      ["health-general", "health-disability"],
    );
    expect(getChartsForTopic("transport").map((c) => c.id)).toEqual([
      "transport-method",
      "transport-distance",
    ]);
    expect(
      getChartsForTopic("family-and-relationships").map((c) => c.id),
    ).toEqual(["family-household-composition", "family-legal-partnership"]);
    expect(getChartsForTopic("migration").map((c) => c.id)).toEqual([
      "migration-country-of-birth",
      "migration-indicator",
      "migration-year-of-arrival",
    ]);
  });

  it("returns an empty list for unknown topics", () => {
    expect(getChartsForTopic("unknown")).toEqual([]);
  });

  it("attaches charts to every topic", () => {
    const topics = getTopicsWithCharts();
    expect(topics).toHaveLength(TOPICS.length);
    expect(TOPIC_CHARTS).toHaveLength(20);
    for (const topic of topics) {
      expect(topic.charts.length).toBeGreaterThan(0);
      for (const chart of topic.charts) {
        expect(TOPIC_CHARTS).toContainEqual(chart);
        expect(chart.datasetId).toMatch(/^NM_\d+_\d+$/);
        expect(chart.categoryDimension.length).toBeGreaterThan(0);
      }
    }
  });

  it("looks up charts by id", () => {
    expect(getChartById("demographics-sex")?.tableCode).toBe("TS008");
    expect(getChartById("employment-industry")?.categoryMode).toBe("summary");
    expect(getChartById("demographics-ethnicity")?.categoryMode).toBe("detail");
    expect(getChartById("missing")).toBeUndefined();
  });
});
