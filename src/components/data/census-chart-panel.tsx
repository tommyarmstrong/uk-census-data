"use client";

import { useCallback, useEffect, useState } from "react";

import { CensusChartView } from "@/components/charts/census-chart-view";
import { ChartExportActions } from "@/components/data/chart-export-actions";
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
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-medium tracking-tight">{chart.name}</h3>
        <DataLoading className="h-72" label={`Loading ${chart.name}`} />
      </div>
    );
  }

  if (status.kind === "error") {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-medium tracking-tight">{chart.name}</h3>
        <DataError message={status.message} onRetry={onRetry} />
      </div>
    );
  }

  const observations = filterChartObservations(status.series.observations, {
    excludeTotals: chart.excludeTotals,
    categoryMode: chart.categoryMode,
  });
  const data = toChartData(observations);
  const fetchedLabel = new Date(status.series.fetchedAt).toLocaleString(
    "en-GB",
  );
  const sourceLabel =
    status.source === "network" ? "Live network" : "Browser cache";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-base font-medium tracking-tight">
          {chart.name}
        </h3>
        <ChartExportActions
          chart={chart}
          series={status.series}
          data={data}
          className="shrink-0"
        />
      </div>

      <CensusChartView chartType={chart.chartType} data={data} />

      <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs leading-relaxed">
        <span>
          {sourceLabel}
          {" · "}
          {status.series.geographyLabel}
          {" · "}
          fetched {fetchedLabel}
        </span>
        {status.stale ? <DataStaleBadge /> : null}
      </div>
    </div>
  );
}
