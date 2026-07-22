import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CensusChartView,
  ChartLegend,
  ChartTooltip,
} from "./census-chart-view";

type AxisProps = {
  tickFormatter?: (value: string | number) => string;
  width?: number;
};

type LegendProps = {
  content?: React.ReactElement<{
    payload?: Array<{ value?: string; color?: string }>;
    narrow: boolean;
  }>;
};

const axisSpies = {
  xTick: undefined as AxisProps["tickFormatter"],
  yTick: undefined as AxisProps["tickFormatter"],
  yWidth: undefined as number | undefined,
};

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
    XAxis: (props: AxisProps) => {
      axisSpies.xTick = props.tickFormatter;
      return null;
    },
    YAxis: (props: AxisProps) => {
      axisSpies.yTick = props.tickFormatter;
      axisSpies.yWidth = props.width;
      return null;
    },
    Tooltip: () => null,
    Legend: ({ content }: LegendProps) => {
      if (!content) {
        return null;
      }
      return (
        <div data-testid="legend-slot">
          {typeof content.type === "function" ||
          typeof content.type === "object"
            ? // Recharts merges payload onto the custom legend element.
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (content.type as any)({
                ...content.props,
                payload: [
                  {
                    value: "Asian, Asian British or Asian Welsh: Bangladeshi",
                    color: "#123",
                  },
                  {
                    value:
                      "Address one year ago is student term-time or boarding school address in the UK",
                    color: "#456",
                  },
                ],
              })
            : null}
        </div>
      );
    },
    Cell: () => null,
  };
});

const DATA = [
  { code: "1", name: "Female", value: 100 },
  { code: "2", name: "Male", value: 110 },
];

const LONG_NAME_DATA = [
  {
    code: "12",
    name: "Asian, Asian British or Asian Welsh: Bangladeshi",
    value: 100,
  },
  {
    code: "13",
    name: "Asian, Asian British or Asian Welsh: Chinese",
    value: 110,
  },
];

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<() => void>();
  const media = {
    matches,
    media: "",
    addEventListener: (_event: string, listener: () => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_event: string, listener: () => void) => {
      listeners.delete(listener);
    },
    dispatch: (next: boolean) => {
      media.matches = next;
      listeners.forEach((listener) => listener());
    },
  };
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation(() => media),
  });
  return media;
}

afterEach(() => {
  axisSpies.xTick = undefined;
  axisSpies.yTick = undefined;
  axisSpies.yWidth = undefined;
  vi.restoreAllMocks();
});

describe("CensusChartView", () => {
  it("shows an empty state when there is no data", () => {
    render(<CensusChartView chartType="bar" data={[]} />);
    expect(
      screen.getByText("No category values to display for this selection."),
    ).toBeInTheDocument();
  });

  it("renders pie, bar, and horizontal-bar containers", () => {
    mockMatchMedia(false);
    const { rerender, container } = render(
      <CensusChartView chartType="pie" data={DATA} />,
    );
    expect(container.querySelector("[style]")).toBeTruthy();
    expect(screen.getByTestId("legend-slot")).toBeInTheDocument();
    expect(screen.getByText("Bangladeshi")).toBeInTheDocument();

    rerender(<CensusChartView chartType="bar" data={DATA} />);
    expect(container.querySelector(".h-72")).toBeTruthy();
    expect(axisSpies.xTick?.("Owned: Owned outright")).toBe("Owned outright");

    rerender(
      <CensusChartView chartType="horizontal-bar" data={LONG_NAME_DATA} />,
    );
    expect(container.querySelector("[style]")).toBeTruthy();
    expect(
      axisSpies.yTick?.("Asian, Asian British or Asian Welsh: Chinese"),
    ).toBe("Chinese");
    expect(axisSpies.yWidth).toBeGreaterThanOrEqual(96);
  });

  it("sizes pie charts for narrow viewports", () => {
    mockMatchMedia(true);
    const { container } = render(
      <CensusChartView chartType="pie" data={DATA} />,
    );
    const height = Number.parseInt(
      (container.firstElementChild as HTMLElement | null)?.style.height ?? "",
      10,
    );
    // Narrow legends stack one per row, so height grows with category count.
    expect(height).toBeGreaterThanOrEqual(288);
  });

  it("uses horizontal layout for dense vertical bar series", () => {
    mockMatchMedia(false);
    const dense = Array.from({ length: 12 }, (_, index) => ({
      code: String(index + 1),
      name: `Category ${index + 1}`,
      value: (index + 1) * 10,
    }));

    const { container } = render(
      <CensusChartView chartType="bar" data={dense} />,
    );

    expect(container.querySelector(".h-72")).toBeNull();
    expect(container.querySelector("[style]")).toBeTruthy();
    expect(axisSpies.yTick).toBeTypeOf("function");
  });

  it("flips sparse bars to horizontal on narrow viewports", () => {
    const media = mockMatchMedia(true);
    const { container, rerender } = render(
      <CensusChartView chartType="bar" data={DATA} />,
    );

    expect(container.querySelector(".h-72")).toBeNull();
    expect(axisSpies.yTick).toBeTypeOf("function");

    act(() => {
      media.dispatch(false);
    });
    rerender(<CensusChartView chartType="bar" data={DATA} />);
    expect(container.querySelector(".h-72")).toBeTruthy();
  });

  it("skips matchMedia setup when the API is unavailable", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: undefined,
    });

    const { container } = render(
      <CensusChartView chartType="bar" data={DATA} />,
    );
    expect(container.querySelector(".h-72")).toBeTruthy();
  });
});

describe("ChartLegend", () => {
  it("returns null when inactive or empty", () => {
    const { container, rerender } = render(<ChartLegend narrow={false} />);
    expect(container).toBeEmptyDOMElement();

    rerender(<ChartLegend narrow={false} payload={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shortens hierarchical labels and keeps the full label as title", () => {
    render(
      <ChartLegend
        narrow
        payload={[
          {
            value: "One-person household: Aged 66 years and over",
            color: "teal",
          },
          { color: "navy" },
        ]}
      />,
    );

    expect(screen.getByText("Aged 66 years and over")).toBeInTheDocument();
    expect(
      screen.getByTitle("One-person household: Aged 66 years and over"),
    ).toBeInTheDocument();
  });

  it("truncates long legend labels on narrow viewports", () => {
    const long =
      "Address one year ago is student term-time or boarding school address in the UK";
    render(<ChartLegend narrow payload={[{ value: long, color: "#000" }]} />);

    const label = screen.getByTitle(long);
    expect(label.textContent?.endsWith("…")).toBe(true);
    expect(label.textContent?.length).toBeLessThanOrEqual(28);
  });
});

describe("ChartTooltip", () => {
  it("returns null when inactive or empty", () => {
    const { container, rerender } = render(<ChartTooltip active={false} />);
    expect(container).toBeEmptyDOMElement();

    rerender(<ChartTooltip active payload={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the full category name and formatted value", () => {
    render(
      <ChartTooltip
        active
        payload={[
          {
            name: "fallback",
            value: 1234,
            payload: {
              code: "12",
              name: "Asian, Asian British or Asian Welsh: Bangladeshi",
              value: 1234,
            },
          },
        ]}
      />,
    );

    expect(
      screen.getByText("Asian, Asian British or Asian Welsh: Bangladeshi"),
    ).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("formats count with percent when both are present", () => {
    render(
      <ChartTooltip
        active
        payload={[
          {
            name: "Female",
            value: 15258981,
            payload: {
              code: "1",
              name: "Female",
              value: 15258981,
              percent: 61.6,
            },
          },
        ]}
      />,
    );

    expect(screen.getByText("15,258,981 (61.6%)")).toBeInTheDocument();
  });

  it("falls back to payload name when the datum is missing", () => {
    render(
      <ChartTooltip active payload={[{ name: "Fallback label", value: 10 }]} />,
    );
    expect(screen.getByText("Fallback label")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("omits the value row when the payload value is not a number", () => {
    render(<ChartTooltip active payload={[{ name: "Unknown" }]} />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(screen.queryByText(/,/)).not.toBeInTheDocument();
  });

  it("renders an empty name when neither datum nor payload name is set", () => {
    const { container } = render(
      <ChartTooltip active payload={[{ value: 5 }]} />,
    );
    expect(container.querySelector("p.font-medium")?.textContent).toBe("");
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
