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

function HorizontalBarChart({
  data,
  className,
}: {
  data: ChartDatum[];
  className?: string;
}) {
  const height = Math.max(240, data.length * 28 + 48);
  const isNarrow = useIsNarrow();
  const yAxisWidth = isNarrow ? 88 : 120;

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
            interval={0}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
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
  return (
    <div className={cn("animate-fade-in h-72 w-full sm:h-80", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 48 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={GRID_STROKE}
          />
          <XAxis
            dataKey="name"
            tick={AXIS_TICK}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={60}
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
    return (
      <div className={cn("animate-fade-in h-72 w-full sm:h-80", className)}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="75%"
              innerRadius="35%"
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
              height={36}
              wrapperStyle={{ fontSize: 12, color: "var(--axis-tick)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === "horizontal-bar" || (chartType === "bar" && isNarrow)) {
    return <HorizontalBarChart data={data} className={className} />;
  }

  return <VerticalBarChart data={data} className={className} />;
}
