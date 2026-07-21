"use client";

import { useCallback, useEffect, useState } from "react";

import { CensusChartView } from "@/components/charts/census-chart-view";
import { DataError } from "@/components/data/data-error";
import { DataLoading } from "@/components/data/data-loading";
import { DataStaleBadge } from "@/components/data/data-stale-badge";
import { filterChartObservations, toChartData } from "@/lib/nomis/chart-data";
import { loadCensusSeries, NomisClientError } from "@/lib/nomis/client";
import { NOMIS_MEASURES } from "@/lib/nomis/constants";
import type { CensusSeries, NomisFetchSource } from "@/lib/nomis/types";
import type { TopicChart } from "@/lib/topic-map";

type Status =
  | { kind: "loading" }
  | {
      kind: "success";
      series: CensusSeries;
      source: NomisFetchSource;
      stale?: boolean;
    }
  | { kind: "error"; message: string };

type CensusChartPanelProps = {
  chart: TopicChart;
  geographyCode: string;
};

export function CensusChartPanel({
  chart,
  geographyCode,
}: CensusChartPanelProps) {
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const result = await loadCensusSeries(
          {
            datasetId: chart.datasetId,
            geography: geographyCode,
            measures: NOMIS_MEASURES.value,
          },
          { useCacheWhenOffline: true },
        );

        if (cancelled) {
          return;
        }

        setStatus({
          kind: "success",
          series: result.series,
          source: result.source,
          stale: result.stale,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof NomisClientError
            ? error.message
            : "Unexpected error loading data";
        setStatus({ kind: "error", message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart.datasetId, geographyCode, retryCount]);

  const onRetry = useCallback(() => {
    setStatus({ kind: "loading" });
    setRetryCount((count) => count + 1);
  }, []);

  if (status.kind === "loading") {
    return (
      <DataLoading className="mt-4 h-72" label={`Loading ${chart.name}`} />
    );
  }

  if (status.kind === "error") {
    return (
      <DataError className="mt-4" message={status.message} onRetry={onRetry} />
    );
  }

  const observations = filterChartObservations(status.series.observations, {
    excludeTotals: chart.excludeTotals,
  });
  const data = toChartData(observations);

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
        <span>
          {status.source === "network" ? "Live network" : "Browser cache"}
          {" · "}
          {status.series.geographyLabel}
          {" · "}
          fetched {new Date(status.series.fetchedAt).toLocaleString("en-GB")}
        </span>
        {status.stale ? <DataStaleBadge /> : null}
      </div>
      <CensusChartView chartType={chart.chartType} data={data} />
    </div>
  );
}
