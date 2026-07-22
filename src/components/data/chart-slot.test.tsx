import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ChartSlot } from "./chart-slot";
import { SAMPLE_CHART } from "@/test/fixtures";

vi.mock("@/components/data/census-chart-panel", () => ({
  CensusChartPanel: ({ geographyCode }: { geographyCode: string }) => (
    <div data-testid="panel">{geographyCode}</div>
  ),
}));

describe("ChartSlot", () => {
  it("renders chart metadata and the panel", () => {
    render(<ChartSlot chart={SAMPLE_CHART} geographyCode="2013265922" />);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Sex");
    expect(screen.getByText(/TS008/)).toBeInTheDocument();
    expect(screen.getByText(SAMPLE_CHART.description)).toBeInTheDocument();
    expect(screen.getByTestId("panel")).toHaveTextContent("2013265922");
  });
});
