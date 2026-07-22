import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TopicCharts } from "./topic-charts";
import type { TopicChart } from "@/lib/topic-map";

vi.mock("@/components/data/chart-slot", () => ({
  ChartSlot: ({ chart }: { chart: { name: string } }) => (
    <div data-testid="chart-slot">{chart.name}</div>
  ),
}));

const CHARTS: TopicChart[] = [
  {
    id: "demographics-sex",
    slug: "sex",
    name: "Sex",
    tableCode: "TS008",
    datasetId: "NM_2028_1",
    categoryDimension: "c_sex",
    chartType: "pie",
    excludeTotals: true,
    description: "Sex composition.",
  },
  {
    id: "demographics-age",
    slug: "age",
    name: "Age (five-year bands)",
    tableCode: "TS007A",
    datasetId: "NM_2020_1",
    categoryDimension: "c2021_age_19",
    chartType: "bar",
    excludeTotals: true,
    description: "Age bands.",
  },
];

describe("TopicCharts", () => {
  it("shows the first chart by default and switches on button press", async () => {
    const user = userEvent.setup();
    render(<TopicCharts charts={CHARTS} geographyCode="2013265922" />);

    expect(screen.getByTestId("chart-slot")).toHaveTextContent("Sex");
    expect(screen.getByRole("button", { name: "Sex" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(
      screen.getByRole("button", { name: "Age (five-year bands)" }),
    );

    expect(screen.getByTestId("chart-slot")).toHaveTextContent(
      "Age (five-year bands)",
    );
    expect(
      screen.getByRole("button", { name: "Age (five-year bands)" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("hides the switcher for a single chart", () => {
    render(<TopicCharts charts={[CHARTS[0]]} geographyCode="2013265922" />);

    expect(
      screen.queryByRole("navigation", { name: "Charts on this page" }),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("chart-slot")).toHaveTextContent("Sex");
  });
});
