import { describe, expect, it } from "vitest";

import {
  buildNomisJsonStatUrl,
  ENGLAND_AND_WALES,
  ENGLISH_REGIONS,
  getGeographyByCode,
  getSelectableGeographies,
  NOMIS_BASE_URL,
  NOMIS_MEASURES,
  WALES,
} from "./constants";

describe("getGeographyByCode", () => {
  it("resolves known codes including the Wales region alias", () => {
    expect(getGeographyByCode(ENGLAND_AND_WALES.code)).toEqual(
      ENGLAND_AND_WALES,
    );
    expect(getGeographyByCode("2013265930")).toMatchObject({
      name: "Wales",
      gss: WALES.gss,
    });
    expect(getGeographyByCode("missing")).toBeUndefined();
  });
});

describe("getSelectableGeographies", () => {
  it("returns E&W, England, Wales, then English regions A–Z", () => {
    const selectable = getSelectableGeographies();
    expect(selectable.slice(0, 3).map((g) => g.name)).toEqual([
      "England and Wales",
      "England",
      "Wales",
    ]);
    const regionNames = selectable.slice(3).map((g) => g.name);
    expect(regionNames).toEqual(
      [...ENGLISH_REGIONS]
        .sort((a, b) => a.name.localeCompare(b.name, "en-GB"))
        .map((g) => g.name),
    );
  });
});

describe("buildNomisJsonStatUrl", () => {
  it("builds a JSON-stat URL with defaults", () => {
    const url = buildNomisJsonStatUrl({
      datasetId: "NM_2028_1",
      geography: ENGLAND_AND_WALES.code,
    });

    expect(url).toBe(
      `${NOMIS_BASE_URL}/dataset/NM_2028_1.jsonstat.json?geography=${ENGLAND_AND_WALES.code}&measures=${NOMIS_MEASURES.value}&date=latest`,
    );
  });

  it("allows custom measures and date", () => {
    const url = buildNomisJsonStatUrl({
      datasetId: "NM_2028_1",
      geography: "TYPE480",
      measures: NOMIS_MEASURES.percent,
      date: "2021",
    });

    expect(url).toContain("measures=20301");
    expect(url).toContain("date=2021");
    expect(url).toContain("geography=TYPE480");
  });
});
