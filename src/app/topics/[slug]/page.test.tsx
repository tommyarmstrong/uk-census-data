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

vi.mock("@/components/data/chart-slot", () => ({
  ChartSlot: ({ chart }: { chart: { name: string } }) => (
    <li data-testid="chart-slot">{chart.name}</li>
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

  it("renders charts and in-page navigation for multi-chart topics", async () => {
    const ui = await TopicPage({
      params: Promise.resolve({ slug: "demographics" }),
      searchParams: Promise.resolve({ geography: "2013265922" }),
    });
    render(ui);

    expect(
      screen.getByRole("heading", { name: "Demographics" }),
    ).toBeInTheDocument();
    expect(screen.getByText("North West")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Charts on this page" }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("chart-slot")).toHaveLength(2);
  });

  it("renders charts without in-page nav for single-chart topics", async () => {
    const ui = await TopicPage({
      params: Promise.resolve({ slug: "education" }),
      searchParams: Promise.resolve({}),
    });
    render(ui);

    expect(
      screen.queryByRole("navigation", { name: "Charts on this page" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByTestId("chart-slot")).toHaveLength(1);
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
