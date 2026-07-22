import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ChartSlot } from "./chart-slot";
import { SAMPLE_CHART } from "@/test/fixtures";

vi.mock("@/components/data/census-chart-panel", () => ({
  CensusChartPanel: ({
    geographyCode,
    measures,
  }: {
    geographyCode: string;
    measures: string;
  }) => (
    <div data-testid="panel">
      {geographyCode}:{measures}
    </div>
  ),
}));

describe("ChartSlot", () => {
  it("renders the bordered panel without chart copy chrome", () => {
    render(
      <ChartSlot
        chart={SAMPLE_CHART}
        geographyCode="2013265922"
        measures="20100"
        onMeasuresChange={() => undefined}
      />,
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByText(/TS008/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(SAMPLE_CHART.description),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("panel")).toHaveTextContent("2013265922:20100");
  });
});
