import { render, screen } from "@testing-library/react";
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

describe("ChartExportActions", () => {
  beforeEach(() => {
    downloadTextFile.mockClear();
  });

  it("exports CSV and JSON", async () => {
    const user = userEvent.setup();
    const data = [
      { code: "1", name: "Female", value: 100 },
      { code: "2", name: "Male", value: 110 },
    ];

    render(
      <ChartExportActions
        chart={SAMPLE_CHART}
        series={SAMPLE_SERIES}
        data={data}
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
  });
});
