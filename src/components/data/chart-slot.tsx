import Link from "next/link";

import { DataUnavailable } from "@/components/data/data-unavailable";
import type { TopicChart } from "@/lib/topic-map";
import { cn } from "@/lib/utils";

type ChartSlotProps = {
  chart: TopicChart;
  className?: string;
};

/** Placeholder chart panel — data unavailable until wired to NOMIS. */
export function ChartSlot({ chart, className }: ChartSlotProps) {
  return (
    <li
      id={chart.slug}
      className={cn("scroll-mt-20 rounded-lg border p-4", className)}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium">
          {chart.name}{" "}
          <span className="text-muted-foreground font-normal">
            ({chart.tableCode} · {chart.chartType})
          </span>
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {chart.description}
        </p>
      </div>
      <DataUnavailable
        className="mt-4"
        detail={
          <>
            Chart not wired yet. See the{" "}
            <Link
              href="/spike"
              className="text-foreground underline-offset-4 hover:underline"
            >
              data-layer spike
            </Link>{" "}
            for a live NOMIS example.
          </>
        }
      />
    </li>
  );
}
