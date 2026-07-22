import { describe, expect, it } from "vitest";

import {
  filterChartObservations,
  percentByCode,
  toChartData,
} from "./chart-data";

const OBSERVATIONS = [
  { code: "0", label: "Total: All usual residents", value: 210 },
  { code: "1", label: "Female", value: 100 },
  { code: "2", label: "Male", value: 110 },
  { code: "3", label: "Unknown", value: null },
  { code: "1001", label: "All sexes (rollup)", value: 210 },
];

describe("filterChartObservations", () => {
  it("returns all rows when excludeTotals is off", () => {
    expect(filterChartObservations(OBSERVATIONS)).toEqual(OBSERVATIONS);
  });

  it("drops Total and code 0 aggregate rows when enabled", () => {
    expect(
      filterChartObservations(OBSERVATIONS, { excludeTotals: true }),
    ).toEqual([
      { code: "1", label: "Female", value: 100 },
      { code: "2", label: "Male", value: 110 },
      { code: "3", label: "Unknown", value: null },
      { code: "1001", label: "All sexes (rollup)", value: 210 },
    ]);
  });

  it("keeps leaf categories only in detail mode", () => {
    expect(
      filterChartObservations(OBSERVATIONS, {
        excludeTotals: true,
        categoryMode: "detail",
      }),
    ).toEqual([
      { code: "1", label: "Female", value: 100 },
      { code: "2", label: "Male", value: 110 },
      { code: "3", label: "Unknown", value: null },
    ]);
  });

  it("keeps 1000+ rollups only in summary mode", () => {
    expect(
      filterChartObservations(OBSERVATIONS, {
        excludeTotals: true,
        categoryMode: "summary",
      }),
    ).toEqual([{ code: "1001", label: "All sexes (rollup)", value: 210 }]);
  });

  it("drops bare Total labels used by some tables", () => {
    expect(
      filterChartObservations(
        [
          { code: "0", label: "Total", value: 10 },
          { code: "1", label: "Student", value: 4 },
          { code: "2", label: "Not a student", value: 6 },
        ],
        { excludeTotals: true },
      ),
    ).toEqual([
      { code: "1", label: "Student", value: 4 },
      { code: "2", label: "Not a student", value: 6 },
    ]);
  });
});

describe("toChartData", () => {
  it("omits null values and maps labels to chart points", () => {
    expect(toChartData(OBSERVATIONS)).toEqual([
      { code: "0", name: "Total: All usual residents", value: 210 },
      { code: "1", name: "Female", value: 100 },
      { code: "2", name: "Male", value: 110 },
      { code: "1001", name: "All sexes (rollup)", value: 210 },
    ]);
  });

  it("attaches percent values by category code", () => {
    const percents = percentByCode([
      { code: "1", label: "Female", value: 47.6 },
      { code: "2", label: "Male", value: 52.4 },
      { code: "3", label: "Unknown", value: null },
    ]);

    expect(toChartData(OBSERVATIONS, percents)).toEqual([
      { code: "0", name: "Total: All usual residents", value: 210 },
      { code: "1", name: "Female", value: 100, percent: 47.6 },
      { code: "2", name: "Male", value: 110, percent: 52.4 },
      { code: "1001", name: "All sexes (rollup)", value: 210 },
    ]);
  });
});

describe("percentByCode", () => {
  it("maps finite values and skips nulls", () => {
    expect(
      Object.fromEntries(
        percentByCode([
          { code: "1", label: "Female", value: 47.6 },
          { code: "2", label: "Male", value: null },
        ]),
      ),
    ).toEqual({ "1": 47.6 });
  });
});
