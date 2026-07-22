"use client";

import { useState } from "react";

import { ChartSlot } from "@/components/data/chart-slot";
import type { TopicChart } from "@/lib/topic-map";
import { cn } from "@/lib/utils";

type TopicChartsProps = {
  charts: TopicChart[];
  geographyCode: string;
};

/**
 * Subtopic switcher: one live chart at a time. First chart is the default.
 */
export function TopicCharts({ charts, geographyCode }: TopicChartsProps) {
  const [selectedId, setSelectedId] = useState(charts[0]?.id ?? "");
  const selected =
    charts.find((chart) => chart.id === selectedId) ?? charts[0] ?? null;

  if (!selected) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      {charts.length > 1 ? (
        <nav aria-label="Charts on this page" className="flex flex-wrap gap-2">
          {charts.map((chart) => {
            const active = chart.id === selected.id;

            return (
              <button
                key={chart.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedId(chart.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs transition-colors duration-200",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {chart.name}
              </button>
            );
          })}
        </nav>
      ) : null}

      <ChartSlot
        key={`${selected.id}-${geographyCode}`}
        chart={selected}
        geographyCode={geographyCode}
      />
    </section>
  );
}
