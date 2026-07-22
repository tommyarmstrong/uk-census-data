"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  chartLabelMaxLength,
  DENSE_VERTICAL_BAR_THRESHOLD,
  formatChartAxisLabel,
  yAxisWidthForLabels,
} from "@/lib/charts/format-label";
import type { ChartType } from "@/lib/topic-map";
import type { ChartDatum } from "@/lib/nomis/chart-data";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

const AXIS_TICK = { fontSize: 11, fill: "var(--axis-tick)" };
const GRID_STROKE = "var(--grid-line)";

function formatValue(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}

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

type CensusChartViewProps = {
  chartType: ChartType;
  data: ChartDatum[];
  className?: string;
};

export function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; payload?: ChartDatum }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0];
  const name = point.payload?.name ?? point.name ?? "";
  const value = typeof point.value === "number" ? point.value : null;

  return (
    <div className="bg-popover text-popover-foreground border-border/80 max-w-[min(16rem,80vw)] rounded-md border px-2.5 py-1.5 text-xs shadow-md">
      <p className="font-medium break-words">{name}</p>
      {value !== null ? (
        <p className="text-muted-foreground mt-0.5 tabular-nums">
          {formatValue(value)}
        </p>
      ) : null}
    </div>
  );
}

export function ChartLegend({
  payload,
  narrow,
}: {
  payload?: Array<{ value?: string; color?: string }>;
  narrow: boolean;
}) {
  if (!payload?.length) {
    return null;
  }

  const maxLen = chartLabelMaxLength("legend", narrow);

  return (
    <ul
      className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 px-1 pt-1 text-[11px] leading-snug"
      style={{ color: "var(--axis-tick)" }}
    >
      {payload.map((entry, index) => {
        const full = String(entry.value ?? "");
        const short = formatChartAxisLabel(full, maxLen);
        return (
          <li
            key={`${full}-${index}`}
            className="inline-flex max-w-full items-center gap-1.5"
          >
            <span
              className="size-2.5 shrink-0 rounded-sm"
              style={{ background: entry.color }}
              aria-hidden
            />
            <span className="min-w-0 break-words" title={full}>
              {short}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function HorizontalBarChart({
  data,
  className,
}: {
  data: ChartDatum[];
  className?: string;
}) {
  const height = Math.max(240, data.length * 32 + 56);
  const isNarrow = useIsNarrow();
  const maxLen = chartLabelMaxLength("axis-y", isNarrow);
  const displayLabels = data.map((row) =>
    formatChartAxisLabel(row.name, maxLen),
  );
  const yAxisWidth = yAxisWidthForLabels(displayLabels, isNarrow);
  const formatTick = (value: string) => formatChartAxisLabel(value, maxLen);

  return (
    <div className={cn("animate-fade-in w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke={GRID_STROKE}
          />
          <XAxis
            type="number"
            tickFormatter={formatValue}
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={yAxisWidth}
            tick={AXIS_TICK}
            tickFormatter={formatTick}
            interval={0}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={26}>
            {data.map((entry, index) => (
              <Cell
                key={entry.code}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function VerticalBarChart({
  data,
  className,
}: {
  data: ChartDatum[];
  className?: string;
}) {
  const isNarrow = useIsNarrow();
  const maxLen = chartLabelMaxLength("axis-x", isNarrow);
  const formatTick = (value: string) => formatChartAxisLabel(value, maxLen);

  return (
    <div className={cn("animate-fade-in h-72 w-full sm:h-80", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 56 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={GRID_STROKE}
          />
          <XAxis
            dataKey="name"
            tick={AXIS_TICK}
            tickFormatter={formatTick}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={68}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatValue}
            tick={AXIS_TICK}
            width={56}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell
                key={entry.code}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function PieChartView({
  data,
  className,
}: {
  data: ChartDatum[];
  className?: string;
}) {
  const isNarrow = useIsNarrow();
  const legendRows = Math.ceil(data.length / (isNarrow ? 1 : 2));
  const height = Math.max(288, 220 + legendRows * 28);

  return (
    <div className={cn("animate-fade-in w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy={isNarrow ? "38%" : "42%"}
            outerRadius={isNarrow ? "52%" : "58%"}
            innerRadius={isNarrow ? "28%" : "32%"}
            paddingAngle={1}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.code}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                stroke="var(--card)"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend
            verticalAlign="bottom"
            content={<ChartLegend narrow={isNarrow} />}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CensusChartView({
  chartType,
  data,
  className,
}: CensusChartViewProps) {
  const isNarrow = useIsNarrow();

  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No category values to display for this selection.
      </p>
    );
  }

  if (chartType === "pie") {
    return <PieChartView data={data} className={className} />;
  }

  const preferHorizontal =
    chartType === "horizontal-bar" ||
    (chartType === "bar" &&
      (isNarrow || data.length >= DENSE_VERTICAL_BAR_THRESHOLD));

  if (preferHorizontal) {
    return <HorizontalBarChart data={data} className={className} />;
  }

  return <VerticalBarChart data={data} className={className} />;
}
