import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ChartExportActions } from "./chart-export-actions";
import { SAMPLE_CHART, SAMPLE_SERIES } from "@/test/fixtures";

const downloadTextFile = vi.fn();

vi.mock("@/lib/export/download", async () => {
  const actual = await vi.importActual<typeof import("@/lib/export/download")>(
    "@/lib/export/download",
  );
  return {
    ...actual,
    downloadTextFile: (...args: unknown[]) => downloadTextFile(...args),
  };
});

const DATA = [
  { code: "1", name: "Female", value: 100 },
  { code: "2", name: "Male", value: 110 },
];

describe("ChartExportActions", () => {
  beforeEach(() => {
    downloadTextFile.mockClear();
  });

  it("exports CSV and JSON", async () => {
    const user = userEvent.setup();

    render(
      <ChartExportActions
        chart={SAMPLE_CHART}
        series={SAMPLE_SERIES}
        data={DATA}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /Export Sex as CSV/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /Export Sex as JSON/i }),
    );

    expect(downloadTextFile).toHaveBeenCalledTimes(2);
    expect(downloadTextFile.mock.calls[0]?.[0]).toBe(
      "ts008-sex-north-west.csv",
    );
    expect(downloadTextFile.mock.calls[1]?.[0]).toBe(
      "ts008-sex-north-west.json",
    );
  });

  it("shares via the Web Share API when available", async () => {
    const user = userEvent.setup();
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: share,
    });
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: () => true,
    });

    render(
      <ChartExportActions
        chart={SAMPLE_CHART}
        series={SAMPLE_SERIES}
        data={DATA}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Share Sex/i }));

    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Sex — UK Census Data",
        text: "Sex for North West",
        url: expect.stringMatching(/^https?:\/\//),
      }),
    );
  });

  it("copies the page URL when Web Share is unavailable", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(
      <ChartExportActions
        chart={SAMPLE_CHART}
        series={SAMPLE_SERIES}
        data={DATA}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Share Sex/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
      expect(
        screen.getByRole("button", { name: /Share Sex/i }),
      ).toHaveTextContent("Copied");
    });
  });

  it("disables export buttons when there is no data", () => {
    const { getByRole } = render(
      <ChartExportActions
        chart={SAMPLE_CHART}
        series={SAMPLE_SERIES}
        data={[]}
      />,
    );

    expect(getByRole("button", { name: /Export Sex as CSV/i })).toBeDisabled();
    expect(getByRole("button", { name: /Export Sex as JSON/i })).toBeDisabled();
    expect(getByRole("button", { name: /Share Sex/i })).toBeDisabled();
  });
});
