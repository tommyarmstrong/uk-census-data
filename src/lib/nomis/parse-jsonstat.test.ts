import { describe, expect, it } from "vitest";

import { parseJsonStatSeries } from "./parse-jsonstat";
import { SAMPLE_JSONSTAT } from "@/test/fixtures";

describe("parseJsonStatSeries", () => {
  it("parses a single-geography JSON-stat response into a series", () => {
    const series = parseJsonStatSeries(SAMPLE_JSONSTAT, {
      datasetId: "NM_2028_1",
      geographyCode: "2013265922",
      measuresCode: "20100",
      fetchedAt: "2026-01-01T00:00:00.000Z",
    });

    expect(series).toMatchObject({
      datasetId: "NM_2028_1",
      label: "Sex",
      source: "Office for National Statistics",
      geographyCode: "2013265922",
      geographyLabel: "North West",
      categoryDimension: "c_sex",
      measuresCode: "20100",
      fetchedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(series.observations).toEqual([
      { code: "1", label: "Female", value: 100 },
      { code: "2", label: "Male", value: 110 },
    ]);
  });

  it("defaults source and fetchedAt when omitted", () => {
    const raw = { ...SAMPLE_JSONSTAT, source: undefined };
    const series = parseJsonStatSeries(raw, {
      datasetId: "NM_2028_1",
      geographyCode: "2013265922",
      measuresCode: "20100",
    });
    expect(series.source).toBe("ONS / NOMIS");
    expect(series.fetchedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("falls back to category codes when labels are missing", () => {
    const raw = structuredClone(SAMPLE_JSONSTAT);
    raw.dimension.c_sex.category.label = {};
    const series = parseJsonStatSeries(raw, {
      datasetId: "NM_2028_1",
      geographyCode: "2013265922",
      measuresCode: "20100",
    });
    expect(series.observations.map((row) => row.label)).toEqual(["1", "2"]);
  });

  it("rejects invalid payloads", () => {
    expect(() =>
      parseJsonStatSeries(
        { class: "not-a-dataset" },
        {
          datasetId: "NM_2028_1",
          geographyCode: "2013265922",
          measuresCode: "20100",
        },
      ),
    ).toThrow("Invalid JSON-stat dataset response");
  });

  it("rejects responses without geography", () => {
    const raw = structuredClone(SAMPLE_JSONSTAT);
    delete (raw.dimension as { geography?: unknown }).geography;
    expect(() =>
      parseJsonStatSeries(raw, {
        datasetId: "NM_2028_1",
        geographyCode: "2013265922",
        measuresCode: "20100",
      }),
    ).toThrow("JSON-stat response missing geography dimension");
  });

  it("rejects multi-geography responses", () => {
    const raw = structuredClone(SAMPLE_JSONSTAT);
    raw.size = [2, 2, 1];
    raw.value = [1, 2, 3, 4];
    raw.dimension.geography.category = {
      index: { a: 0, b: 1 },
      label: { a: "A", b: "B" },
    };
    expect(() =>
      parseJsonStatSeries(raw, {
        datasetId: "NM_2028_1",
        geographyCode: "2013265922",
        measuresCode: "20100",
      }),
    ).toThrow("Expected one geography in response, got 2");
  });

  it("rejects responses with no category dimension", () => {
    const raw = structuredClone(SAMPLE_JSONSTAT);
    raw.id = ["geography", "measures"];
    raw.size = [1, 1];
    raw.value = [1];
    raw.dimension = {
      geography: raw.dimension.geography,
      measures: raw.dimension.measures,
    };
    expect(() =>
      parseJsonStatSeries(raw, {
        datasetId: "NM_2028_1",
        geographyCode: "2013265922",
        measuresCode: "20100",
      }),
    ).toThrow("JSON-stat response has no category dimension");
  });

  it("rejects when the category dimension object is missing", () => {
    const raw = structuredClone(SAMPLE_JSONSTAT);
    delete (raw.dimension as { c_sex?: unknown }).c_sex;
    expect(() =>
      parseJsonStatSeries(raw, {
        datasetId: "NM_2028_1",
        geographyCode: "2013265922",
        measuresCode: "20100",
      }),
    ).toThrow("Missing category dimension: c_sex");
  });
});
