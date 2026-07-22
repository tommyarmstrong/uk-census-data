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

type MediaListener = (event: MediaQueryListEvent) => void;

function mockViewport(narrow: boolean) {
  const listeners = new Set<MediaListener>();
  let matchesNarrow = narrow;

  const mediaQuery = (query: string) => {
    const isMaxWidth = query.includes("max-width");
    return {
      get matches() {
        return isMaxWidth ? matchesNarrow : !matchesNarrow;
      },
      media: query,
      onchange: null,
      addListener: (listener: MediaListener) => {
        listeners.add(listener);
      },
      removeListener: (listener: MediaListener) => {
        listeners.delete(listener);
      },
      addEventListener: (_type: string, listener: MediaListener) => {
        listeners.add(listener);
      },
      removeEventListener: (_type: string, listener: MediaListener) => {
        listeners.delete(listener);
      },
      dispatchEvent: () => false,
    };
  };

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: mediaQuery,
  });

  return {
    setNarrow(next: boolean) {
      matchesNarrow = next;
      const event = { matches: next } as MediaQueryListEvent;
      for (const listener of listeners) {
        listener(event);
      }
    },
  };
}

describe("ChartExportActions", () => {
  beforeEach(() => {
    downloadTextFile.mockClear();
    mockViewport(false);
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

    expect(csv.querySelector("svg")).toBeTruthy();
    expect(json.querySelector("svg")).toBeTruthy();
    expect(csv.querySelector("svg")?.innerHTML).not.toBe(
      json.querySelector("svg")?.innerHTML,
    );
  });

  it("collapses CSV, JSON, and Share behind an Export control on narrow viewports", async () => {
    mockViewport(true);
    const user = userEvent.setup();

    render(
      <ChartExportActions
        chart={SAMPLE_CHART}
        series={SAMPLE_SERIES}
        data={DATA}
      />,
    );

    const exportToggle = await screen.findByRole("button", {
      name: /Export options for Sex/i,
    });
    expect(exportToggle).toHaveAttribute("aria-expanded", "false");
    expect(exportToggle).toHaveAttribute("aria-controls");
    expect(
      screen.queryByRole("button", { name: /Export Sex as CSV/i }),
    ).not.toBeInTheDocument();

    await user.click(exportToggle);

    expect(exportToggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: /Export Sex as CSV/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Export Sex as JSON/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Share Sex/i }),
    ).toBeInTheDocument();

    const menu = document.getElementById(
      exportToggle.getAttribute("aria-controls") ?? "",
    );
    expect(menu).toBeTruthy();
    expect(menu).toContainElement(
      screen.getByRole("button", { name: /Export Sex as CSV/i }),
    );

    await user.click(
      screen.getByRole("button", { name: /Export Sex as CSV/i }),
    );
    expect(downloadTextFile).toHaveBeenCalledWith(
      "ts008-sex-north-west.csv",
      expect.any(String),
      "text/csv;charset=utf-8",
    );
    expect(exportToggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("button", { name: /Export Sex as CSV/i }),
    ).not.toBeInTheDocument();
  });

  it("toggles the Export menu closed without exporting", async () => {
    mockViewport(true);
    const user = userEvent.setup();

    render(
      <ChartExportActions
        chart={SAMPLE_CHART}
        series={SAMPLE_SERIES}
        data={DATA}
      />,
    );

    const exportToggle = await screen.findByRole("button", {
      name: /Export options for Sex/i,
    });

    await user.click(exportToggle);
    expect(
      screen.getByRole("button", { name: /Export Sex as JSON/i }),
    ).toBeInTheDocument();

    await user.click(exportToggle);
    expect(exportToggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("button", { name: /Export Sex as JSON/i }),
    ).not.toBeInTheDocument();
    expect(downloadTextFile).not.toHaveBeenCalled();
  });

  it("exports JSON from the Export menu and collapses it", async () => {
    mockViewport(true);
    const user = userEvent.setup();

    render(
      <ChartExportActions
        chart={SAMPLE_CHART}
        series={SAMPLE_SERIES}
        data={DATA}
      />,
    );

    const exportToggle = await screen.findByRole("button", {
      name: /Export options for Sex/i,
    });
    await user.click(exportToggle);
    await user.click(
      screen.getByRole("button", { name: /Export Sex as JSON/i }),
    );

    expect(downloadTextFile).toHaveBeenCalledWith(
      "ts008-sex-north-west.json",
      expect.any(String),
      "application/json;charset=utf-8",
    );
    expect(exportToggle).toHaveAttribute("aria-expanded", "false");
  });

  it("shares from the Export menu and collapses after a successful share", async () => {
    mockViewport(true);
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

    const exportToggle = await screen.findByRole("button", {
      name: /Export options for Sex/i,
    });
    await user.click(exportToggle);
    await user.click(screen.getByRole("button", { name: /Share Sex/i }));

    expect(share).toHaveBeenCalled();
    expect(exportToggle).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps the Export menu open when share is cancelled", async () => {
    mockViewport(true);
    const user = userEvent.setup();
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: vi
        .fn()
        .mockRejectedValue(new DOMException("Share canceled", "AbortError")),
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

    const exportToggle = await screen.findByRole("button", {
      name: /Export options for Sex/i,
    });
    await user.click(exportToggle);
    await user.click(screen.getByRole("button", { name: /Share Sex/i }));

    expect(exportToggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: /Share Sex/i }),
    ).toBeInTheDocument();
  });

  it("collapses the Export menu after copying a share link", async () => {
    mockViewport(true);
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

    const exportToggle = await screen.findByRole("button", {
      name: /Export options for Sex/i,
    });
    await user.click(exportToggle);
    await user.click(screen.getByRole("button", { name: /Share Sex/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
      expect(
        screen.getByRole("button", { name: /Share Sex/i }),
      ).toHaveTextContent("Copied");
    });

    await waitFor(
      () => {
        expect(exportToggle).toHaveAttribute("aria-expanded", "false");
      },
      { timeout: 2500 },
    );
  });

  it("closes the Export menu when the viewport widens", async () => {
    const viewport = mockViewport(true);
    const user = userEvent.setup();

    render(
      <ChartExportActions
        chart={SAMPLE_CHART}
        series={SAMPLE_SERIES}
        data={DATA}
      />,
    );

    const exportToggle = await screen.findByRole("button", {
      name: /Export options for Sex/i,
    });
    await user.click(exportToggle);
    expect(
      screen.getByRole("button", { name: /Export Sex as CSV/i }),
    ).toBeInTheDocument();

    viewport.setNarrow(false);

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /Export options for Sex/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Export Sex as CSV/i }),
      ).toBeInTheDocument();
    });
  });

  it("disables the Export control when there is no data on narrow viewports", async () => {
    mockViewport(true);

    render(
      <ChartExportActions
        chart={SAMPLE_CHART}
        series={SAMPLE_SERIES}
        data={[]}
      />,
    );

    expect(
      await screen.findByRole("button", { name: /Export options for Sex/i }),
    ).toBeDisabled();
  });
});
