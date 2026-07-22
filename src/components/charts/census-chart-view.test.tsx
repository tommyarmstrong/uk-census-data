import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CensusChartView, ChartTooltip } from "./census-chart-view";

vi.mock("recharts", () => {
  const Passthrough = ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  );
  return {
    ResponsiveContainer: Passthrough,
    PieChart: Passthrough,
    Pie: Passthrough,
    BarChart: Passthrough,
    Bar: Passthrough,
    CartesianGrid: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    Legend: () => null,
    Cell: () => null,
  };
});

const DATA = [
  { code: "1", name: "Female", value: 100 },
  { code: "2", name: "Male", value: 110 },
];

describe("CensusChartView", () => {
  it("shows an empty state when there is no data", () => {
    render(<CensusChartView chartType="bar" data={[]} />);
    expect(
      screen.getByText("No category values to display for this selection."),
    ).toBeInTheDocument();
  });

  it("renders pie, bar, and horizontal-bar containers", () => {
    const { rerender } = render(
      <CensusChartView chartType="pie" data={DATA} />,
    );
    expect(document.querySelector(".h-72")).toBeTruthy();

    rerender(<CensusChartView chartType="bar" data={DATA} />);
    expect(document.querySelector(".h-72")).toBeTruthy();

    rerender(<CensusChartView chartType="horizontal-bar" data={DATA} />);
    expect(document.querySelector("[style]")).toBeTruthy();
  });
});

describe("ChartTooltip", () => {
  it("returns null when inactive or empty", () => {
    const { container, rerender } = render(<ChartTooltip active={false} />);
    expect(container).toBeEmptyDOMElement();

    rerender(<ChartTooltip active payload={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the category name and formatted value", () => {
    render(
      <ChartTooltip
        active
        payload={[
          {
            name: "fallback",
            value: 1234,
            payload: { code: "1", name: "Female", value: 1234 },
          },
        ]}
      />,
    );

    expect(screen.getByText("Female")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("omits the value row when the payload value is not a number", () => {
    render(<ChartTooltip active payload={[{ name: "Unknown" }]} />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(screen.queryByText(/,/)).not.toBeInTheDocument();
  });
});
