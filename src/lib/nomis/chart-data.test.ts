import { describe, expect, it } from "vitest";

import { filterChartObservations, toChartData } from "./chart-data";

const OBSERVATIONS = [
  { code: "0", label: "Total: All usual residents", value: 210 },
  { code: "1", label: "Female", value: 100 },
  { code: "2", label: "Male", value: 110 },
  { code: "3", label: "Unknown", value: null },
];

describe("filterChartObservations", () => {
  it("returns all rows when excludeTotals is off", () => {
    expect(filterChartObservations(OBSERVATIONS)).toEqual(OBSERVATIONS);
  });

  it("drops Total: aggregate rows when enabled", () => {
    expect(
      filterChartObservations(OBSERVATIONS, { excludeTotals: true }),
    ).toEqual([
      { code: "1", label: "Female", value: 100 },
      { code: "2", label: "Male", value: 110 },
      { code: "3", label: "Unknown", value: null },
    ]);
  });
});

describe("toChartData", () => {
  it("omits null values and maps labels to chart points", () => {
    expect(toChartData(OBSERVATIONS)).toEqual([
      { code: "0", name: "Total: All usual residents", value: 210 },
      { code: "1", name: "Female", value: 100 },
      { code: "2", name: "Male", value: 110 },
    ]);
  });
});
