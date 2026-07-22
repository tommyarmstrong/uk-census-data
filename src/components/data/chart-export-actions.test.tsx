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

  it("falls back to clipboard when canShare rejects the payload", async () => {
    const user = userEvent.setup();
    const share = vi.fn();
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: share,
    });
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: () => false,
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

    expect(share).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
      expect(
        screen.getByRole("button", { name: /Share Sex/i }),
      ).toHaveTextContent("Copied");
    });
  });

  it("ignores AbortError when the user cancels the share sheet", async () => {
    const user = userEvent.setup();
    const share = vi
      .fn()
      .mockRejectedValue(new DOMException("Share canceled", "AbortError"));
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: share,
    });
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: () => true,
    });
    const writeText = vi.fn();
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

    expect(share).toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /Share Sex/i }),
    ).toHaveTextContent("Share");
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

  it("keeps labelled controls accessible while hiding visible labels on narrow layouts", () => {
    render(
      <ChartExportActions
        chart={SAMPLE_CHART}
        series={SAMPLE_SERIES}
        data={DATA}
      />,
    );

    expect(
      screen.getByRole("group", { name: /Export and share Sex/i }),
    ).toBeInTheDocument();

    const csv = screen.getByRole("button", { name: /Export Sex as CSV/i });
    const json = screen.getByRole("button", { name: /Export Sex as JSON/i });
    const share = screen.getByRole("button", { name: /Share Sex/i });

    expect(csv.className).toMatch(/min-h-11/);
    expect(json.className).toMatch(/min-h-11/);
    expect(share.className).toMatch(/min-h-11/);

    expect(csv.querySelector("span")).toHaveClass("sr-only", "sm:not-sr-only");
    expect(json.querySelector("span")).toHaveClass("sr-only", "sm:not-sr-only");
    expect(share.querySelector("span")).toHaveClass(
      "sr-only",
      "sm:not-sr-only",
    );
  });
});
