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
    data,
  }: {
    chartType: string;
    data: Array<{ code: string; percent?: number }>;
  }) => (
    <div data-testid="chart-view">
      {chartType}:
      {data.map((row) => `${row.code}=${row.percent ?? "na"}`).join(",")}
    </div>
  ),
}));

vi.mock("@/components/data/chart-export-actions", () => ({
  ChartExportActions: () => <div data-testid="export-actions" />,
}));

const SAMPLE_PERCENT_SERIES = {
  ...SAMPLE_SERIES,
  measuresCode: NOMIS_MEASURES.percent,
  observations: [
    { code: "0", label: "Total: All usual residents", value: 100 },
    { code: "1", label: "Female", value: 47.6 },
    { code: "2", label: "Male", value: 52.4 },
  ],
};

describe("CensusChartPanel", () => {
  beforeEach(() => {
    loadCensusSeries.mockReset();
  });

  it("shows loading then a successful chart with joined percents", async () => {
    loadCensusSeries.mockImplementation(
      async (params: { measures?: string }) => {
        if (params.measures === NOMIS_MEASURES.percent) {
          return { series: SAMPLE_PERCENT_SERIES, source: "network" };
        }
        return { series: SAMPLE_SERIES, source: "network" };
      },
    );

    render(
      <CensusChartPanel chart={SAMPLE_CHART} geographyCode="2013265922" />,
    );

    expect(screen.getByLabelText("Loading Sex")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Live network/)).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Sex" })).toBeInTheDocument();
    expect(screen.getByTestId("chart-view")).toHaveTextContent(
      "pie:1=47.6,2=52.4",
    );
    expect(screen.getByTestId("export-actions")).toBeInTheDocument();
    expect(loadCensusSeries).toHaveBeenCalledWith(
      expect.objectContaining({
        datasetId: "NM_2028_1",
        geography: "2013265922",
        measures: NOMIS_MEASURES.value,
      }),
      expect.any(Object),
    );
    expect(loadCensusSeries).toHaveBeenCalledWith(
      expect.objectContaining({ measures: NOMIS_MEASURES.percent }),
      expect.any(Object),
    );
  });

  it("still renders when the percent fetch fails", async () => {
    loadCensusSeries.mockImplementation(
      async (params: { measures?: string }) => {
        if (params.measures === NOMIS_MEASURES.percent) {
          throw new NomisClientError("percent unavailable", "http");
        }
        return { series: SAMPLE_SERIES, source: "network" };
      },
    );

    render(
      <CensusChartPanel chart={SAMPLE_CHART} geographyCode="2013265922" />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("chart-view")).toHaveTextContent(
        "pie:1=na,2=na",
      );
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
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
      expect(
        screen.getByText("Cached — may be out of date"),
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/Browser cache/)).toBeInTheDocument();
  });

  it("shows an error and retries when count fails", async () => {
    const user = userEvent.setup();
    loadCensusSeries
      .mockRejectedValueOnce(
        new NomisClientError("offline", "offline-no-cache"),
      )
      .mockRejectedValueOnce(
        new NomisClientError("offline", "offline-no-cache"),
      )
      .mockImplementation(async (params: { measures?: string }) => {
        if (params.measures === NOMIS_MEASURES.percent) {
          return { series: SAMPLE_PERCENT_SERIES, source: "network" };
        }
        return { series: SAMPLE_SERIES, source: "network" };
      });

    const { getByText, getByRole, findByText } = render(
      <CensusChartPanel chart={SAMPLE_CHART} geographyCode="2013265922" />,
    );

    expect(await findByText("offline")).toBeInTheDocument();

    await user.click(getByRole("button", { name: "Retry" }));

    await waitFor(() => {
      expect(getByText(/Live network/)).toBeInTheDocument();
    });
  });
});
