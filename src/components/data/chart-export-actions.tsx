"use client";

import { useEffect, useId, useState } from "react";
import {
  ChevronDown,
  Download,
  FileDown,
  FileJson,
  Share2,
} from "lucide-react";

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

const actionButtonClass =
  "min-h-11 min-w-11 gap-1.5 px-0 sm:min-h-7 sm:min-w-0 sm:px-2.5";

function useIsNarrow(breakpointPx = 640) {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const media = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [breakpointPx]);

  return narrow;
}

export function ChartExportActions({
  chart,
  series,
  data,
  className,
}: ChartExportActionsProps) {
  const basename = buildExportBasename(chart, series);
  const disabled = data.length === 0;
  const isNarrow = useIsNarrow();
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");
  const [wasNarrow, setWasNarrow] = useState(isNarrow);

  if (isNarrow !== wasNarrow) {
    setWasNarrow(isNarrow);
    if (!isNarrow && menuOpen) {
      setMenuOpen(false);
    }
  }

  const onCsv = () => {
    downloadTextFile(
      `${basename}.csv`,
      seriesToCsv(chart, series, data),
      "text/csv;charset=utf-8",
    );
    setMenuOpen(false);
  };

  const onJson = () => {
    downloadTextFile(
      `${basename}.json`,
      seriesToJson(chart, series, data),
      "application/json;charset=utf-8",
    );
    setMenuOpen(false);
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
        setMenuOpen(false);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareLabel("Copied");
        window.setTimeout(() => {
          setShareLabel("Share");
          setMenuOpen(false);
        }, 1600);
      }
    } catch (error) {
      // User cancel on share sheet — ignore; other failures stay silent.
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  };

  const actionButtons = (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onCsv}
        aria-label={`Export ${chart.name} as CSV`}
        className={actionButtonClass}
      >
        <Download data-icon="inline-start" />
        <span className="sr-only sm:not-sr-only">CSV</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onJson}
        aria-label={`Export ${chart.name} as JSON`}
        className={actionButtonClass}
      >
        <FileJson data-icon="inline-start" />
        <span className="sr-only sm:not-sr-only">JSON</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => void onShare()}
        aria-label={`Share ${chart.name}`}
        className={cn(
          actionButtonClass,
          shareLabel === "Copied" && "min-w-0 px-2.5",
        )}
      >
        <Share2 data-icon="inline-start" />
        <span
          className={
            shareLabel === "Share" ? "sr-only sm:not-sr-only" : undefined
          }
        >
          {shareLabel}
        </span>
      </Button>
    </>
  );

  return (
    <div
      role="group"
      aria-label={`Export and share ${chart.name}`}
      className={cn("flex flex-wrap gap-1.5 sm:gap-2", className)}
    >
      {isNarrow ? (
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={`Export options for ${chart.name}`}
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(actionButtonClass, "min-w-0 px-2.5")}
          >
            <FileDown data-icon="inline-start" />
            Export
            <ChevronDown
              data-icon="inline-end"
              className={cn(
                "size-3.5 transition-transform",
                menuOpen && "rotate-180",
              )}
            />
          </Button>
          {menuOpen ? (
            <div id={menuId} className="flex flex-wrap gap-1.5">
              {actionButtons}
            </div>
          ) : null}
        </>
      ) : (
        actionButtons
      )}
    </div>
  );
}
