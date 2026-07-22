import { CensusChartPanel } from "@/components/data/census-chart-panel";
import type { TopicChart } from "@/lib/topic-map";
import { cn } from "@/lib/utils";

type ChartSlotProps = {
  chart: TopicChart;
  geographyCode: string;
  className?: string;
};

/** Chart panel wired to NOMIS for the selected region. */
export function ChartSlot({ chart, geographyCode, className }: ChartSlotProps) {
  return (
    <li
      id={chart.slug}
      className={cn(
        "border-border/80 bg-card/80 scroll-mt-24 rounded-lg border p-5 shadow-[0_1px_0_oklch(0.22_0.03_250/4%)]",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-medium tracking-tight">
          {chart.name}{" "}
          <span className="text-muted-foreground font-sans text-sm font-normal">
            ({chart.tableCode} · {chart.chartType})
          </span>
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {chart.description}
        </p>
      </div>
      <CensusChartPanel
        key={`${chart.id}-${geographyCode}`}
        chart={chart}
        geographyCode={geographyCode}
      />
    </li>
  );
}
