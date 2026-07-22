import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CensusChartPanel } from "./census-chart-panel";
import { NomisClientError } from "@/lib/nomis/client";
import { SAMPLE_CHART, SAMPLE_SERIES } from "@/test/fixtures";

const loadCensusSeries = vi.fn();

vi.mock("@/lib/nomis/client", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/nomis/client")>(
      "@/lib/nomis/client",
    );
  return {
    ...actual,
    loadCensusSeries: (...args: unknown[]) => loadCensusSeries(...args),
  };
});

vi.mock("@/components/charts/census-chart-view", () => ({
  CensusChartView: ({ chartType }: { chartType: string }) => (
    <div data-testid="chart-view">{chartType}</div>
  ),
}));

vi.mock("@/components/data/chart-export-actions", () => ({
  ChartExportActions: () => <div data-testid="export-actions" />,
}));

describe("CensusChartPanel", () => {
  beforeEach(() => {
    loadCensusSeries.mockReset();
  });

  it("shows loading then a successful chart", async () => {
    loadCensusSeries.mockResolvedValue({
      series: SAMPLE_SERIES,
      source: "network",
    });

    render(
      <CensusChartPanel chart={SAMPLE_CHART} geographyCode="2013265922" />,
    );

    expect(screen.getByLabelText("Loading Sex")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Live network/)).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Sex" })).toBeInTheDocument();
    expect(screen.getByTestId("chart-view")).toHaveTextContent("pie");
    expect(screen.getByTestId("export-actions")).toBeInTheDocument();
  });

  it("shows a stale badge for cache results", async () => {
    loadCensusSeries.mockResolvedValue({
      series: SAMPLE_SERIES,
      source: "cache",
      stale: true,
    });

    render(
      <CensusChartPanel chart={SAMPLE_CHART} geographyCode="2013265922" />,
    );

    await waitFor(() => {
      expect(screen.getByText("Cached / may be stale")).toBeInTheDocument();
    });
    expect(screen.getByText(/Browser cache/)).toBeInTheDocument();
  });

  it("shows an error and retries", async () => {
    const user = userEvent.setup();
    loadCensusSeries
      .mockRejectedValueOnce(
        new NomisClientError("offline", "offline-no-cache"),
      )
      .mockResolvedValueOnce({
        series: SAMPLE_SERIES,
        source: "network",
      });

    const { getByText, getByRole, findByText } = render(
      <CensusChartPanel chart={SAMPLE_CHART} geographyCode="2013265922" />,
    );

    expect(await findByText("offline")).toBeInTheDocument();

    await user.click(getByRole("button", { name: "Retry" }));

    await waitFor(() => {
      expect(getByText(/Live network/)).toBeInTheDocument();
    });
    expect(loadCensusSeries).toHaveBeenCalledTimes(2);
  });
});
