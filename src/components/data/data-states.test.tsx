import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DataError } from "./data-error";
import { DataLoading } from "./data-loading";
import { DataUnavailable } from "./data-unavailable";
import { DataStaleBadge } from "./data-stale-badge";

describe("data state components", () => {
  it("renders DataStaleBadge", () => {
    render(<DataStaleBadge />);
    expect(screen.getByText("Cached — may be out of date")).toBeInTheDocument();
  });

  it("renders DataLoading with a label", () => {
    render(<DataLoading label="Loading Sex" />);
    expect(screen.getByLabelText("Loading Sex")).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("renders DataUnavailable with default and custom detail", () => {
    const { rerender } = render(<DataUnavailable />);
    expect(screen.getByText("Data unavailable")).toBeInTheDocument();
    expect(
      screen.getByText("Live census data is not available for this chart."),
    ).toBeInTheDocument();

    rerender(<DataUnavailable detail="No chart for this topic." />);
    expect(screen.getByText("No chart for this topic.")).toBeInTheDocument();
  });

  it("renders DataError with shared unavailable heading and invokes retry", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <DataError
        message="NOMIS is down"
        hint="Try again shortly."
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Data unavailable")).toBeInTheDocument();
    expect(screen.getByText("NOMIS is down")).toBeInTheDocument();
    expect(screen.getByText("Try again shortly.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders DataError without retry or hint", () => {
    render(<DataError message="Upstream timeout" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Upstream timeout")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Retry" }),
    ).not.toBeInTheDocument();
  });
});
