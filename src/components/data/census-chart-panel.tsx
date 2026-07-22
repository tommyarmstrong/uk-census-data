"use client";

import { useCallback, useEffect, useState } from "react";

import { CensusChartView } from "@/components/charts/census-chart-view";
import { ChartExportActions } from "@/components/data/chart-export-actions";
import { DataError } from "@/components/data/data-error";
import { DataLoading } from "@/components/data/data-loading";
import { DataStaleBadge } from "@/components/data/data-stale-badge";
import {
  filterChartObservations,
  percentByCode,
  toChartData,
} from "@/lib/nomis/chart-data";
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
      percents: Map<string, number>;
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
        const baseParams = {
          datasetId: chart.datasetId,
          geography: geographyCode,
        };

        const [countOutcome, percentOutcome] = await Promise.allSettled([
          loadCensusSeries(
            { ...baseParams, measures: NOMIS_MEASURES.value },
            { useCacheWhenOffline: true },
          ),
          loadCensusSeries(
            { ...baseParams, measures: NOMIS_MEASURES.percent },
            { useCacheWhenOffline: true },
          ),
        ]);

        if (cancelled) {
          return;
        }

        if (countOutcome.status === "rejected") {
          const error = countOutcome.reason;
          const message =
            error instanceof NomisClientError
              ? error.message
              : "Unexpected error loading data";
          setStatus({ kind: "error", message });
          return;
        }

        const countResult = countOutcome.value;
        const percentResult =
          percentOutcome.status === "fulfilled" ? percentOutcome.value : null;

        const filterOptions = {
          excludeTotals: chart.excludeTotals,
          categoryMode: chart.categoryMode,
        };

        const percents = percentResult
          ? percentByCode(
              filterChartObservations(
                percentResult.series.observations,
                filterOptions,
              ),
            )
          : new Map<string, number>();

        const source: NomisFetchSource =
          countResult.source === "network" ||
          percentResult?.source === "network"
            ? "network"
            : "cache";

        setStatus({
          kind: "success",
          series: countResult.series,
          source,
          stale: Boolean(countResult.stale || percentResult?.stale),
          percents,
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
  }, [
    chart.datasetId,
    chart.excludeTotals,
    chart.categoryMode,
    geographyCode,
    retryCount,
  ]);

  const onRetry = useCallback(() => {
    setStatus({ kind: "loading" });
    setRetryCount((count) => count + 1);
  }, []);

  const successData =
    status.kind === "success"
      ? toChartData(
          filterChartObservations(status.series.observations, {
            excludeTotals: chart.excludeTotals,
            categoryMode: chart.categoryMode,
          }),
          status.percents,
        )
      : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <h3 className="min-w-0 text-base font-medium tracking-tight">
          {chart.name}
        </h3>
        {status.kind === "success" && successData ? (
          <ChartExportActions
            chart={chart}
            series={status.series}
            data={successData}
            className="shrink-0"
          />
        ) : null}
      </div>

      {status.kind === "loading" ? (
        <DataLoading className="h-72" label={`Loading ${chart.name}`} />
      ) : null}

      {status.kind === "error" ? (
        <DataError message={status.message} onRetry={onRetry} />
      ) : null}

      {status.kind === "success" && successData ? (
        <>
          <CensusChartView chartType={chart.chartType} data={successData} />

          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs leading-relaxed">
            <span>
              {status.source === "network" ? "Live network" : "Browser cache"}
              {" · "}
              {status.series.geographyLabel}
              {" · "}
              fetched{" "}
              {new Date(status.series.fetchedAt).toLocaleString("en-GB")}
            </span>
            {status.stale ? <DataStaleBadge /> : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
