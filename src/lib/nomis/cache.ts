import type { CensusSeries, CensusSeriesCacheEntry } from "@/lib/nomis/types";

const CACHE_PREFIX = "uk-census:nomis:";

export function cacheKey(options: {
  datasetId: string;
  geography: string;
  measures: string;
}): string {
  return `${CACHE_PREFIX}${options.datasetId}:${options.geography}:${options.measures}`;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readCachedSeries(key: string): CensusSeriesCacheEntry | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CensusSeriesCacheEntry;
    if (!parsed?.series?.observations || !parsed.cachedAt) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function writeCachedSeries(key: string, series: CensusSeries): void {
  if (!canUseStorage()) {
    return;
  }

  const entry: CensusSeriesCacheEntry = {
    series,
    cachedAt: new Date().toISOString(),
  };

  localStorage.setItem(key, JSON.stringify(entry));
}

export function clearCachedSeries(key: string): void {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(key);
}
