import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound: () => notFound(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/layout/topic-region-filter", () => ({
  TopicRegionFilter: () => <div data-testid="topic-region-filter" />,
}));

vi.mock("@/components/data/topic-charts", () => ({
  TopicCharts: ({
    charts,
  }: {
    charts: Array<{ name: string }>;
    geographyCode: string;
  }) => (
    <div data-testid="topic-charts">
      {charts.map((chart) => chart.name).join("|")}
    </div>
  ),
}));

import TopicPage, { generateStaticParams } from "./page";

describe("TopicPage", () => {
  beforeEach(() => {
    notFound.mockClear();
  });

  it("generates static params for all topics", () => {
    expect(generateStaticParams()).toContainEqual({ slug: "demographics" });
  });

  it("renders the region filter and topic charts", async () => {
    const ui = await TopicPage({
      params: Promise.resolve({ slug: "demographics" }),
      searchParams: Promise.resolve({ geography: "2013265922" }),
    });
    render(ui);

    expect(
      screen.getByRole("heading", { name: "Demographics" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("topic-region-filter")).toBeInTheDocument();
    expect(screen.queryByText(/Showing:/)).not.toBeInTheDocument();
    expect(screen.getByTestId("topic-charts")).toHaveTextContent(
      "Sex|Age (five-year bands)",
    );
  });

  it("renders a single-chart topic without error", async () => {
    const ui = await TopicPage({
      params: Promise.resolve({ slug: "education" }),
      searchParams: Promise.resolve({}),
    });
    render(ui);

    expect(screen.getByTestId("topic-charts")).toHaveTextContent(
      "Highest qualification",
    );
  });

  it("calls notFound for unknown topics", async () => {
    await expect(
      TopicPage({
        params: Promise.resolve({ slug: "nope" }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});
