import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CensusChartPanel } from "./census-chart-panel";
import { NomisClientError } from "@/lib/nomis/client";
import { NOMIS_MEASURES } from "@/lib/nomis/constants";
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
  CensusChartView: ({
    chartType,
    measures,
  }: {
    chartType: string;
    measures?: string;
  }) => (
    <div data-testid="chart-view">
      {chartType}:{measures}
    </div>
  ),
}));

vi.mock("@/components/data/chart-export-actions", () => ({
  ChartExportActions: () => <div data-testid="export-actions" />,
}));

describe("CensusChartPanel", () => {
  const onMeasuresChange = vi.fn();

  beforeEach(() => {
    loadCensusSeries.mockReset();
    onMeasuresChange.mockReset();
  });

  it("shows loading then a successful chart", async () => {
    loadCensusSeries.mockResolvedValue({
      series: SAMPLE_SERIES,
      source: "network",
    });

    render(
      <CensusChartPanel
        chart={SAMPLE_CHART}
        geographyCode="2013265922"
        measures={NOMIS_MEASURES.value}
        onMeasuresChange={onMeasuresChange}
      />,
    );

    expect(screen.getByLabelText("Loading Sex")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Live network/)).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Sex" })).toBeInTheDocument();
    expect(screen.getByTestId("chart-view")).toHaveTextContent("pie:20100");
    expect(screen.getByTestId("export-actions")).toBeInTheDocument();
    expect(loadCensusSeries).toHaveBeenCalledWith(
      expect.objectContaining({
        datasetId: "NM_2028_1",
        geography: "2013265922",
        measures: NOMIS_MEASURES.value,
      }),
      expect.any(Object),
    );
  });

  it("loads percent when that measure is selected", async () => {
    loadCensusSeries.mockResolvedValue({
      series: { ...SAMPLE_SERIES, measuresCode: NOMIS_MEASURES.percent },
      source: "network",
    });

    render(
      <CensusChartPanel
        chart={SAMPLE_CHART}
        geographyCode="2013265922"
        measures={NOMIS_MEASURES.percent}
        onMeasuresChange={onMeasuresChange}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("chart-view")).toHaveTextContent("pie:20301");
    });
    expect(loadCensusSeries).toHaveBeenCalledWith(
      expect.objectContaining({ measures: NOMIS_MEASURES.percent }),
      expect.any(Object),
    );
    expect(screen.getByText(/Live network · Percent ·/)).toBeInTheDocument();
  });

  it("notifies when the measure toggle changes", async () => {
    const user = userEvent.setup();
    loadCensusSeries.mockResolvedValue({
      series: SAMPLE_SERIES,
      source: "network",
    });

    render(
      <CensusChartPanel
        chart={SAMPLE_CHART}
        geographyCode="2013265922"
        measures={NOMIS_MEASURES.value}
        onMeasuresChange={onMeasuresChange}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("chart-view")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Percent" }));
    expect(onMeasuresChange).toHaveBeenCalledWith(NOMIS_MEASURES.percent);
  });

  it("shows a stale badge for cache results", async () => {
    loadCensusSeries.mockResolvedValue({
      series: SAMPLE_SERIES,
      source: "cache",
      stale: true,
    });

    render(
      <CensusChartPanel
        chart={SAMPLE_CHART}
        geographyCode="2013265922"
        measures={NOMIS_MEASURES.value}
        onMeasuresChange={onMeasuresChange}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Cached — may be out of date"),
      ).toBeInTheDocument();
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
      <CensusChartPanel
        chart={SAMPLE_CHART}
        geographyCode="2013265922"
        measures={NOMIS_MEASURES.value}
        onMeasuresChange={onMeasuresChange}
      />,
    );

    expect(await findByText("offline")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Measure" })).toBeInTheDocument();

    await user.click(getByRole("button", { name: "Retry" }));

    await waitFor(() => {
      expect(getByText(/Live network/)).toBeInTheDocument();
    });
    expect(loadCensusSeries).toHaveBeenCalledTimes(2);
  });
});
