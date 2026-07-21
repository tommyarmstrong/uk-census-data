import {
  cacheKey,
  clearCachedSeries,
  readCachedSeries,
  writeCachedSeries,
} from "@/lib/nomis/cache";
import { NOMIS_MEASURES } from "@/lib/nomis/constants";
import type {
  CensusSeries,
  NomisFetchParams,
  NomisFetchResult,
} from "@/lib/nomis/types";

export class NomisClientError extends Error {
  readonly code: "offline-no-cache" | "network" | "http" | "invalid";

  constructor(message: string, code: NomisClientError["code"] = "network") {
    super(message);
    this.name = "NomisClientError";
    this.code = code;
  }
}

type LoadOptions = {
  /** Prefer cache only (simulate offline / forced cache read). */
  cacheOnly?: boolean;
  /** Treat browser offline as cache-only. Default true. */
  useCacheWhenOffline?: boolean;
};

function buildProxyUrl(params: NomisFetchParams): string {
  const search = new URLSearchParams({
    dataset: params.datasetId,
    geography: params.geography,
    measures: params.measures ?? NOMIS_MEASURES.value,
  });

  return `/api/nomis?${search.toString()}`;
}

async function fetchFromNetwork(
  params: NomisFetchParams,
): Promise<CensusSeries> {
  const response = await fetch(buildProxyUrl(params), {
    headers: { Accept: "application/json" },
  });

  const body = (await response.json().catch(() => null)) as
    CensusSeries | { error?: string } | null;

  if (!response.ok) {
    const message =
      body && "error" in body && body.error
        ? body.error
        : `NOMIS proxy failed (${response.status})`;
    throw new NomisClientError(message, "http");
  }

  if (!body || !("observations" in body)) {
    throw new NomisClientError("Invalid series payload from proxy", "invalid");
  }

  return body;
}

/**
 * Load a census series via the Next.js NOMIS proxy.
 * On success, stores the result in localStorage.
 * When offline (or cacheOnly), returns the last successful cache entry.
 * If offline/cacheOnly and no cache exists, throws with a clear failure.
 */
export async function loadCensusSeries(
  params: NomisFetchParams,
  options: LoadOptions = {},
): Promise<NomisFetchResult> {
  const measures = params.measures ?? NOMIS_MEASURES.value;
  const key = cacheKey({
    datasetId: params.datasetId,
    geography: params.geography,
    measures,
  });

  const offline =
    options.cacheOnly ||
    ((options.useCacheWhenOffline ?? true) &&
      typeof navigator !== "undefined" &&
      navigator.onLine === false);

  if (offline) {
    const cached = readCachedSeries(key);
    if (cached) {
      return {
        series: cached.series,
        source: "cache",
        stale: true,
      };
    }

    throw new NomisClientError(
      "NOMIS is unavailable and no cached data exists for this query.",
      "offline-no-cache",
    );
  }

  try {
    const series = await fetchFromNetwork({ ...params, measures });
    writeCachedSeries(key, series);
    return { series, source: "network" };
  } catch (error) {
    const cached = readCachedSeries(key);
    if (cached) {
      return {
        series: cached.series,
        source: "cache",
        stale: true,
      };
    }

    if (error instanceof NomisClientError) {
      throw error;
    }

    throw new NomisClientError(
      error instanceof Error ? error.message : "Failed to fetch NOMIS data",
      "network",
    );
  }
}

export function clearCensusSeriesCache(params: NomisFetchParams): void {
  const measures = params.measures ?? NOMIS_MEASURES.value;
  clearCachedSeries(
    cacheKey({
      datasetId: params.datasetId,
      geography: params.geography,
      measures,
    }),
  );
}

export function peekCensusSeriesCache(
  params: NomisFetchParams,
): CensusSeries | null {
  const measures = params.measures ?? NOMIS_MEASURES.value;
  return (
    readCachedSeries(
      cacheKey({
        datasetId: params.datasetId,
        geography: params.geography,
        measures,
      }),
    )?.series ?? null
  );
}
