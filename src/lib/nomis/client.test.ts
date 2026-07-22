import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearCensusSeriesCache,
  loadCensusSeries,
  NomisClientError,
  peekCensusSeriesCache,
} from "./client";
import { writeCachedSeries, cacheKey } from "./cache";
import { NOMIS_MEASURES } from "./constants";
import { SAMPLE_SERIES } from "@/test/fixtures";

describe("NomisClientError", () => {
  it("stores a default network code", () => {
    const error = new NomisClientError("failed");
    expect(error.name).toBe("NomisClientError");
    expect(error.code).toBe("network");
    expect(error.message).toBe("failed");
  });
});

describe("loadCensusSeries", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => SAMPLE_SERIES,
      }),
    );
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: true,
    });
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("fetches from the proxy and caches the series", async () => {
    const params = {
      datasetId: "NM_2028_1",
      geography: "2013265922",
      measures: NOMIS_MEASURES.value,
    };
    const result = await loadCensusSeries(params);

    expect(result.source).toBe("network");
    expect(result.series.datasetId).toBe("NM_2028_1");
    expect(peekCensusSeriesCache(params)).toEqual(result.series);
    expect(fetch).toHaveBeenCalledWith(
      "/api/nomis?dataset=NM_2028_1&geography=2013265922&measures=20100",
      expect.objectContaining({
        headers: { Accept: "application/json" },
      }),
    );
  });

  it("deduplicates in-flight requests for the same key", async () => {
    let resolveFetch!: (value: unknown) => void;
    const pending = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => {
        await pending;
        return { ok: true, json: async () => SAMPLE_SERIES };
      }),
    );

    const params = {
      datasetId: "NM_DEDUPE_1",
      geography: "2013265922",
    };
    const first = loadCensusSeries(params);
    const second = loadCensusSeries(params);
    resolveFetch(undefined);

    const [a, b] = await Promise.all([first, second]);
    expect(a.series).toEqual(b.series);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("returns stale cache when the network fails", async () => {
    const staleParams = {
      datasetId: "NM_9999_1",
      geography: "2013265922",
      measures: "20100",
    };
    writeCachedSeries(
      cacheKey({
        datasetId: staleParams.datasetId,
        geography: staleParams.geography,
        measures: staleParams.measures,
      }),
      SAMPLE_SERIES,
    );

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({ error: "upstream down" }),
      }),
    );

    await expect(loadCensusSeries(staleParams)).resolves.toEqual({
      series: SAMPLE_SERIES,
      source: "cache",
      stale: true,
    });
  });

  it("throws http errors when there is no cache", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({ error: "upstream down" }),
      }),
    );

    await expect(
      loadCensusSeries({
        datasetId: "NM_1111_1",
        geography: "2013265922",
      }),
    ).rejects.toMatchObject({
      name: "NomisClientError",
      code: "http",
      message: "upstream down",
    });
  });

  it("throws a generic http message when the error body is empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => null,
      }),
    );

    await expect(
      loadCensusSeries({
        datasetId: "NM_5555_1",
        geography: "2013265922",
      }),
    ).rejects.toMatchObject({
      message: "NOMIS proxy failed (500)",
    });
  });

  it("throws invalid when the proxy body lacks observations", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ label: "no observations" }),
      }),
    );

    await expect(
      loadCensusSeries({
        datasetId: "NM_2222_1",
        geography: "2013265922",
      }),
    ).rejects.toMatchObject({ code: "invalid" });
  });

  it("wraps unexpected fetch failures as network errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("socket hang up")),
    );

    await expect(
      loadCensusSeries({
        datasetId: "NM_6666_1",
        geography: "2013265922",
      }),
    ).rejects.toMatchObject({
      code: "network",
      message: "socket hang up",
    });
  });

  it("uses cache when offline and throws when cache is missing", async () => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: false,
    });

    await expect(
      loadCensusSeries({
        datasetId: "NM_3333_1",
        geography: "2013265922",
      }),
    ).rejects.toMatchObject({ code: "offline-no-cache" });

    writeCachedSeries(
      cacheKey({
        datasetId: "NM_3333_1",
        geography: "2013265922",
        measures: NOMIS_MEASURES.value,
      }),
      SAMPLE_SERIES,
    );

    await expect(
      loadCensusSeries({
        datasetId: "NM_3333_1",
        geography: "2013265922",
      }),
    ).resolves.toMatchObject({
      source: "cache",
      stale: true,
      series: SAMPLE_SERIES,
    });
  });

  it("supports cacheOnly without hitting the network", async () => {
    writeCachedSeries(
      cacheKey({
        datasetId: "NM_4444_1",
        geography: "2013265922",
        measures: NOMIS_MEASURES.value,
      }),
      SAMPLE_SERIES,
    );

    const result = await loadCensusSeries(
      { datasetId: "NM_4444_1", geography: "2013265922" },
      { cacheOnly: true },
    );

    expect(result.source).toBe("cache");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("clears a cached series", () => {
    const params = {
      datasetId: "NM_2028_1",
      geography: "2013265922",
      measures: NOMIS_MEASURES.value,
    };
    writeCachedSeries(
      cacheKey({
        datasetId: params.datasetId,
        geography: params.geography,
        measures: params.measures,
      }),
      SAMPLE_SERIES,
    );
    clearCensusSeriesCache(params);
    expect(peekCensusSeriesCache(params)).toBeNull();
  });
});
