"use client";

import { useState } from "react";
import {
  ChevronDown,
  Download,
  FileDown,
  FileJson,
  Share2,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  buildExportBasename,
  downloadTextFile,
  seriesToCsv,
  seriesToJson,
} from "@/lib/export/download";
import { useIsNarrow } from "@/lib/hooks/use-is-narrow";
import type { ChartDatum } from "@/lib/nomis/chart-data";
import type { CensusSeries } from "@/lib/nomis/types";
import type { TopicChart } from "@/lib/topic-map";
import { cn } from "@/lib/utils";

type ChartExportActionsProps = {
  chart: TopicChart;
  series: CensusSeries;
  data: ChartDatum[];
  className?: string;
};

const actionButtonClass =
  "min-h-11 min-w-11 gap-1.5 px-0 sm:min-h-7 sm:min-w-0 sm:px-2.5";

export function ChartExportActions({
  chart,
  series,
  data,
  className,
}: ChartExportActionsProps) {
  const basename = buildExportBasename(chart, series);
  const disabled = data.length === 0;
  const isNarrow = useIsNarrow();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");
  const [shareMenuLabel, setShareMenuLabel] = useState("Share Data");
  const [shareMenuDescription, setShareMenuDescription] = useState(
    "Share via native apps",
  );
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
  };

  const onJson = () => {
    downloadTextFile(
      `${basename}.json`,
      seriesToJson(chart, series, data),
      "application/json;charset=utf-8",
    );
  };

  const resetShareMenuCopy = () => {
    setShareMenuLabel("Share Data");
    setShareMenuDescription("Share via native apps");
  };

  const onShare = async (fromMenu: boolean) => {
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
        if (fromMenu) {
          setMenuOpen(false);
        }
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        if (fromMenu) {
          setShareMenuLabel("Link copied");
          setShareMenuDescription("URL copied to clipboard");
          window.setTimeout(() => {
            resetShareMenuCopy();
            setMenuOpen(false);
          }, 1600);
        } else {
          setShareLabel("Copied");
          window.setTimeout(() => setShareLabel("Share"), 1600);
        }
      }
    } catch (error) {
      // User cancel on share sheet — ignore; other failures stay silent.
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  };

  if (isNarrow) {
    return (
      <div
        role="group"
        aria-label={`Export and share ${chart.name}`}
        className={cn("flex", className)}
      >
        <DropdownMenu
          open={menuOpen}
          onOpenChange={(open) => {
            setMenuOpen(open);
            if (!open) {
              resetShareMenuCopy();
            }
          }}
          disabled={disabled}
        >
          <DropdownMenuTrigger
            disabled={disabled}
            aria-label={`Export options for ${chart.name}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              actionButtonClass,
              "min-w-0 px-2.5",
            )}
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-64">
            <DropdownMenuItem
              onClick={onCsv}
              className="min-h-11"
              label={`Export ${chart.name} as CSV`}
            >
              <Download className="mt-0.5" />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-medium">Export as CSV</span>
                <span className="text-muted-foreground text-xs leading-snug">
                  Spreadsheet format
                </span>
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onJson}
              className="min-h-11"
              label={`Export ${chart.name} as JSON`}
            >
              <FileJson className="mt-0.5" />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-medium">Export as JSON</span>
                <span className="text-muted-foreground text-xs leading-snug">
                  Structured data format
                </span>
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              closeOnClick={false}
              onClick={() => void onShare(true)}
              className="min-h-11"
              label={`Share ${chart.name}`}
            >
              <Share2 className="mt-0.5" />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-medium">{shareMenuLabel}</span>
                <span className="text-muted-foreground text-xs leading-snug">
                  {shareMenuDescription}
                </span>
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Export and share ${chart.name}`}
      className={cn("flex flex-wrap gap-1.5 sm:gap-2", className)}
    >
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
        onClick={() => void onShare(false)}
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
    </div>
  );
}
