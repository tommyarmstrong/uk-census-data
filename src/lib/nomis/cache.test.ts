import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  cacheKey,
  clearCachedSeries,
  readCachedSeries,
  writeCachedSeries,
} from "./cache";
import { SAMPLE_SERIES } from "@/test/fixtures";

describe("cacheKey", () => {
  it("builds a namespaced key", () => {
    expect(
      cacheKey({
        datasetId: "NM_2028_1",
        geography: "2013265922",
        measures: "20100",
      }),
    ).toBe("uk-census:nomis:NM_2028_1:2013265922:20100");
  });
});

describe("localStorage cache", () => {
  const key = cacheKey({
    datasetId: "NM_2028_1",
    geography: "2013265922",
    measures: "20100",
  });

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("returns null when the key is missing", () => {
    expect(readCachedSeries(key)).toBeNull();
  });

  it("round-trips a series entry", () => {
    writeCachedSeries(key, SAMPLE_SERIES);
    const entry = readCachedSeries(key);
    expect(entry?.series).toEqual(SAMPLE_SERIES);
    expect(entry?.cachedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("returns null for corrupt JSON", () => {
    localStorage.setItem(key, "{not-json");
    expect(readCachedSeries(key)).toBeNull();
  });

  it("returns null for incomplete payloads", () => {
    localStorage.setItem(key, JSON.stringify({ cachedAt: "2026-01-01" }));
    expect(readCachedSeries(key)).toBeNull();
  });

  it("clears a cached entry", () => {
    writeCachedSeries(key, SAMPLE_SERIES);
    clearCachedSeries(key);
    expect(readCachedSeries(key)).toBeNull();
  });

  it("returns null when storage is unavailable", () => {
    const original = window.localStorage;
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: undefined,
    });

    expect(readCachedSeries(key)).toBeNull();
    expect(() => writeCachedSeries(key, SAMPLE_SERIES)).not.toThrow();
    expect(() => clearCachedSeries(key)).not.toThrow();

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: original,
    });
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: original,
    });
  });
});
