import { CensusChartPanel } from "@/components/data/census-chart-panel";
import type { NomisMeasureCode } from "@/lib/nomis/constants";
import type { TopicChart } from "@/lib/topic-map";
import { cn } from "@/lib/utils";

type ChartSlotProps = {
  chart: TopicChart;
  geographyCode: string;
  measures: NomisMeasureCode;
  onMeasuresChange: (measures: NomisMeasureCode) => void;
  className?: string;
};

/** Bordered chart panel wired to NOMIS for the selected region. */
export function ChartSlot({
  chart,
  geographyCode,
  measures,
  onMeasuresChange,
  className,
}: ChartSlotProps) {
  return (
    <div
      id={chart.slug}
      className={cn(
        "border-border/80 bg-card/80 scroll-mt-36 rounded-lg border p-5 shadow-[0_1px_0_oklch(0.22_0.03_250/4%)]",
        className,
      )}
    >
      <CensusChartPanel
        key={`${chart.id}-${geographyCode}-${measures}`}
        chart={chart}
        geographyCode={geographyCode}
        measures={measures}
        onMeasuresChange={onMeasuresChange}
      />
    </div>
  );
}
