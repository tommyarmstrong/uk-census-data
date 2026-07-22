"use client";

import { useState } from "react";
import { Download, Share2 } from "lucide-react";

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
import { cn } from "@/lib/utils";

type ChartExportActionsProps = {
  chart: TopicChart;
  series: CensusSeries;
  data: ChartDatum[];
  className?: string;
};

export function ChartExportActions({
  chart,
  series,
  data,
  className,
}: ChartExportActionsProps) {
  const basename = buildExportBasename(chart, series);
  const disabled = data.length === 0;
  const [shareLabel, setShareLabel] = useState("Share");

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

  const onShare = async () => {
    const url = window.location.href;
    const title = `${chart.name} — UK Census Data`;
    const text = `${chart.name} for ${series.geographyLabel}`;
    const shareData: ShareData = { title, text, url };

    try {
      if (
        typeof navigator.share === "function" &&
        (!navigator.canShare || navigator.canShare(shareData))
      ) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareLabel("Copied");
        window.setTimeout(() => setShareLabel("Share"), 1600);
      }
    } catch (error) {
      // User cancel on share sheet — ignore; other failures stay silent.
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
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
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => void onShare()}
        aria-label={`Share ${chart.name}`}
      >
        <Share2 data-icon="inline-start" />
        {shareLabel}
      </Button>
    </div>
  );
}
