"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ChartDatum } from "@/lib/nomis/chart-data";
import type { CensusSeries } from "@/lib/nomis/types";
import type { TopicChart } from "@/lib/topic-map";
import {
  buildExportBasename,
  downloadTextFile,
  seriesToCsv,
  seriesToJson,
} from "@/lib/export/download";

type ChartExportActionsProps = {
  chart: TopicChart;
  series: CensusSeries;
  data: ChartDatum[];
};

export function ChartExportActions({
  chart,
  series,
  data,
}: ChartExportActionsProps) {
  const basename = buildExportBasename(chart, series);
  const disabled = data.length === 0;

  const onCsv = () => {
    downloadTextFile(
      `${basename}.csv`,
      seriesToCsv(chart, series, data),
      "text/csv;charset=utf-8",
    );
  };

  const onJson = () => {
    downloadTextFile(
      `${basename}.json`,
      seriesToJson(chart, series, data),
      "application/json;charset=utf-8",
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onCsv}
        aria-label={`Export ${chart.name} as CSV`}
      >
        <Download data-icon="inline-start" />
        CSV
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onJson}
        aria-label={`Export ${chart.name} as JSON`}
      >
        <Download data-icon="inline-start" />
        JSON
      </Button>
    </div>
  );
}
