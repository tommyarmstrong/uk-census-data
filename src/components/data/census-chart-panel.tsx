"use client";

import { useCallback, useEffect, useState } from "react";

import { CensusChartView } from "@/components/charts/census-chart-view";
import { ChartExportActions } from "@/components/data/chart-export-actions";
import { DataError } from "@/components/data/data-error";
import { DataLoading } from "@/components/data/data-loading";
import { DataStaleBadge } from "@/components/data/data-stale-badge";
import { filterChartObservations, toChartData } from "@/lib/nomis/chart-data";
import { loadCensusSeries, NomisClientError } from "@/lib/nomis/client";
import type { NomisMeasureCode } from "@/lib/nomis/constants";
import {
  MEASURE_OPTIONS,
  measureDisplayName,
} from "@/lib/nomis/format-measure";
import type { CensusSeries, NomisFetchSource } from "@/lib/nomis/types";
import type { TopicChart } from "@/lib/topic-map";
import { cn } from "@/lib/utils";

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
  measures: NomisMeasureCode;
  onMeasuresChange: (measures: NomisMeasureCode) => void;
};

function MeasureToggle({
  value,
  onChange,
}: {
  value: NomisMeasureCode;
  onChange: (measures: NomisMeasureCode) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Measure"
      className="flex flex-wrap gap-1.5 sm:gap-2"
    >
      {MEASURE_OPTIONS.map((option) => {
        const active = option.code === value;

        return (
          <button
            key={option.code}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.code)}
            className={cn(
              "min-h-11 rounded-md px-3.5 text-sm transition-colors duration-200 sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-xs",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function CensusChartPanel({
  chart,
  geographyCode,
  measures,
  onMeasuresChange,
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
            measures,
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
  }, [chart.datasetId, geographyCode, measures, retryCount]);

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
        )
      : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <h3 className="text-base font-medium tracking-tight">{chart.name}</h3>
          <MeasureToggle value={measures} onChange={onMeasuresChange} />
        </div>
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
          <CensusChartView
            chartType={chart.chartType}
            data={successData}
            measures={measures}
          />

          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs leading-relaxed">
            <span>
              {status.source === "network" ? "Live network" : "Browser cache"}
              {" · "}
              {measureDisplayName(measures)}
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
