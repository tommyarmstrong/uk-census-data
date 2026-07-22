import { describe, expect, it } from "vitest";

import { NOMIS_MEASURES } from "./constants";
import {
  formatMeasureValue,
  isNomisMeasureCode,
  measureDisplayName,
} from "./format-measure";

describe("isNomisMeasureCode", () => {
  it("accepts known measure codes", () => {
    expect(isNomisMeasureCode(NOMIS_MEASURES.value)).toBe(true);
    expect(isNomisMeasureCode(NOMIS_MEASURES.percent)).toBe(true);
    expect(isNomisMeasureCode("99999")).toBe(false);
  });
});

describe("measureDisplayName", () => {
  it("maps codes to Count / Percent labels", () => {
    expect(measureDisplayName(NOMIS_MEASURES.value)).toBe("Count");
    expect(measureDisplayName(NOMIS_MEASURES.percent)).toBe("Percent");
    expect(measureDisplayName("unknown")).toBe("Count");
  });
});

describe("formatMeasureValue", () => {
  it("formats counts with en-GB grouping", () => {
    expect(formatMeasureValue(1234, NOMIS_MEASURES.value)).toBe("1,234");
  });

  it("formats percents with a % suffix", () => {
    expect(formatMeasureValue(49.2, NOMIS_MEASURES.percent)).toBe("49.2%");
    expect(formatMeasureValue(100, NOMIS_MEASURES.percent)).toBe("100%");
  });
});
