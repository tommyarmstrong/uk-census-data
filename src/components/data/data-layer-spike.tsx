"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  clearCensusSeriesCache,
  loadCensusSeries,
  NomisClientError,
  peekCensusSeriesCache,
} from "@/lib/nomis/client";
import { DEFAULT_GEOGRAPHY, NOMIS_MEASURES } from "@/lib/nomis/constants";
import type { CensusSeries, NomisFetchSource } from "@/lib/nomis/types";
import { SPIKE_CHART } from "@/lib/topic-map";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | {
      kind: "success";
      series: CensusSeries;
      source: NomisFetchSource;
      stale?: boolean;
    }
  | { kind: "error"; message: string; code?: string };

const SPIKE_PARAMS = {
  datasetId: SPIKE_CHART.datasetId,
  geography: DEFAULT_GEOGRAPHY.code,
  measures: NOMIS_MEASURES.value,
};

function formatNumber(value: number | null): string {
  if (value === null) {
    return "—";
  }
  return new Intl.NumberFormat("en-GB").format(value);
}

export function DataLayerSpike() {
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [hasCache, setHasCache] = useState(false);
  const requestId = useRef(0);

  const refreshCacheFlag = useCallback(() => {
    setHasCache(Boolean(peekCensusSeriesCache(SPIKE_PARAMS)));
  }, []);

  const runFetch = useCallback(
    async (cacheOnly: boolean) => {
      const id = ++requestId.current;
      setStatus({ kind: "loading" });
      try {
        const result = await loadCensusSeries(SPIKE_PARAMS, {
          cacheOnly,
          useCacheWhenOffline: true,
        });
        if (id !== requestId.current) {
          return;
        }
        setStatus({
          kind: "success",
          series: result.series,
          source: result.source,
          stale: result.stale,
        });
        refreshCacheFlag();
      } catch (error) {
        if (id !== requestId.current) {
          return;
        }
        const message =
          error instanceof NomisClientError
            ? error.message
            : "Unexpected error loading data";
        const code = error instanceof NomisClientError ? error.code : undefined;
        setStatus({ kind: "error", message, code });
        refreshCacheFlag();
      }
    },
    [refreshCacheFlag],
  );

  useEffect(() => {
    let cancelled = false;
    const id = ++requestId.current;

    void (async () => {
      try {
        const result = await loadCensusSeries(SPIKE_PARAMS, {
          cacheOnly: false,
          useCacheWhenOffline: true,
        });
        if (cancelled || id !== requestId.current) {
          return;
        }
        setStatus({
          kind: "success",
          series: result.series,
          source: result.source,
          stale: result.stale,
        });
        setHasCache(Boolean(peekCensusSeriesCache(SPIKE_PARAMS)));
      } catch (error) {
        if (cancelled || id !== requestId.current) {
          return;
        }
        const message =
          error instanceof NomisClientError
            ? error.message
            : "Unexpected error loading data";
        const code = error instanceof NomisClientError ? error.code : undefined;
        setStatus({ kind: "error", message, code });
        setHasCache(Boolean(peekCensusSeriesCache(SPIKE_PARAMS)));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const onClearCache = () => {
    clearCensusSeriesCache(SPIKE_PARAMS);
    refreshCacheFlag();
    setStatus({ kind: "idle" });
  };

  const loading = status.kind === "loading";

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Data layer spike
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Proves live NOMIS fetch via the Next.js proxy, browser cache hit when
          offline / cache-only, and a clear failure when neither network nor
          cache is available. No mock figures.
        </p>
      </div>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Dataset</dt>
          <dd className="font-medium">
            {SPIKE_CHART.tableCode} — {SPIKE_CHART.name} (
            {SPIKE_CHART.datasetId})
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Geography</dt>
          <dd className="font-medium">
            {DEFAULT_GEOGRAPHY.name} ({DEFAULT_GEOGRAPHY.code})
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Cache</dt>
          <dd className="font-medium">
            {hasCache ? "Entry present in localStorage" : "Empty"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Source</dt>
          <dd className="font-medium">
            {status.kind === "success"
              ? status.source === "network"
                ? "Live network"
                : "Browser cache"
              : "—"}
            {status.kind === "success" && status.stale ? " (stale)" : ""}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={loading}
          onClick={() => runFetch(false)}
        >
          Fetch live
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => runFetch(true)}
        >
          Read cache only
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={loading}
          onClick={onClearCache}
        >
          Clear cache
        </Button>
      </div>

      {loading ? (
        <div
          className="bg-muted/40 h-28 animate-pulse rounded-lg"
          aria-busy="true"
          aria-label="Loading census data"
        />
      ) : null}

      {status.kind === "error" ? (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/5 rounded-lg border p-4"
        >
          <p className="text-sm font-medium">Data cannot be fetched</p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {status.message}
          </p>
          {status.code === "offline-no-cache" ? (
            <p className="text-muted-foreground mt-2 text-sm">
              Clear cache then use “Read cache only” to reproduce this failure.
            </p>
          ) : null}
        </div>
      ) : null}

      {status.kind === "success" ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium tracking-tight">
              {status.series.label}
            </h2>
            <p className="text-muted-foreground text-sm">
              {status.series.geographyLabel} · fetched{" "}
              {new Date(status.series.fetchedAt).toLocaleString("en-GB")}
              {status.series.source ? ` · ${status.series.source}` : ""}
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b">
                <tr>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium">Code</th>
                  <th className="px-3 py-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {status.series.observations.map((row) => (
                  <tr key={row.code} className="border-b last:border-0">
                    <td className="px-3 py-2">{row.label}</td>
                    <td className="text-muted-foreground px-3 py-2">
                      {row.code}
                    </td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatNumber(row.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {status.kind === "idle" && !loading ? (
        <p className="text-muted-foreground text-sm">
          Idle. Use Fetch live to load NOMIS data.
        </p>
      ) : null}
    </div>
  );
}
