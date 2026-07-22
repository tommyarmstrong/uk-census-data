import { CensusChartPanel } from "@/components/data/census-chart-panel";
import type { TopicChart } from "@/lib/topic-map";
import { cn } from "@/lib/utils";

type ChartSlotProps = {
  chart: TopicChart;
  geographyCode: string;
  className?: string;
};

/** Bordered chart panel wired to NOMIS for the selected region. */
export function ChartSlot({ chart, geographyCode, className }: ChartSlotProps) {
  return (
    <div
      id={chart.slug}
      className={cn(
        "border-border/80 bg-card/80 scroll-mt-36 rounded-lg border p-5 shadow-[0_1px_0_oklch(0.22_0.03_250/4%)]",
        className,
      )}
    >
      <CensusChartPanel
        key={`${chart.id}-${geographyCode}`}
        chart={chart}
        geographyCode={geographyCode}
      />
    </div>
  );
}
