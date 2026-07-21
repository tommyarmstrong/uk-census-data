"use client";

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
];

function formatValue(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}

type CensusChartViewProps = {
  chartType: ChartType;
  data: ChartDatum[];
  className?: string;
};

function ChartTooltip({
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
    <div className="bg-popover text-popover-foreground rounded-md border px-2.5 py-1.5 text-xs shadow-md">
      <p className="font-medium">{name}</p>
      {value !== null ? (
        <p className="text-muted-foreground mt-0.5 tabular-nums">
          {formatValue(value)}
        </p>
      ) : null}
    </div>
  );
}

export function CensusChartView({
  chartType,
  data,
  className,
}: CensusChartViewProps) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No category values to display for this selection.
      </p>
    );
  }

  if (chartType === "pie") {
    return (
      <div className={cn("h-72 w-full sm:h-80", className)}>
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
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === "horizontal-bar") {
    const height = Math.max(240, data.length * 28 + 48);

    return (
      <div className={cn("w-full", className)} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={formatValue}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 11 }}
              interval={0}
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

  return (
    <div className={cn("h-72 w-full sm:h-80", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 48 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tickFormatter={formatValue}
            tick={{ fontSize: 11 }}
            width={56}
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
