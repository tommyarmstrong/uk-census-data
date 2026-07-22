import { describe, expect, it } from "vitest";

import { ENGLAND_AND_WALES, ENGLISH_REGIONS } from "@/lib/nomis/constants";

import {
  GEOGRAPHY_SEARCH_PARAM,
  resolveGeographyFromParam,
  withGeographyParam,
} from "./geography-url";

describe("resolveGeographyFromParam", () => {
  it("defaults to England and Wales when missing", () => {
    expect(resolveGeographyFromParam(undefined)).toEqual(ENGLAND_AND_WALES);
    expect(resolveGeographyFromParam(null)).toEqual(ENGLAND_AND_WALES);
    expect(resolveGeographyFromParam("")).toEqual(ENGLAND_AND_WALES);
  });

  it("resolves a known region code", () => {
    const northWest = ENGLISH_REGIONS.find((g) => g.name === "North West");
    expect(northWest).toBeDefined();
    expect(resolveGeographyFromParam(northWest!.code)).toEqual(northWest);
  });

  it("falls back for unknown codes", () => {
    expect(resolveGeographyFromParam("not-a-code")).toEqual(ENGLAND_AND_WALES);
  });

  it("uses the first value when given an array", () => {
    const london = ENGLISH_REGIONS.find((g) => g.name === "London");
    expect(resolveGeographyFromParam([london!.code, "ignored"])).toEqual(
      london,
    );
  });
});

describe("withGeographyParam", () => {
  it("appends the geography search param", () => {
    expect(withGeographyParam("/topics/demographics", "2013265922")).toBe(
      `/topics/demographics?${GEOGRAPHY_SEARCH_PARAM}=2013265922`,
    );
  });
});
