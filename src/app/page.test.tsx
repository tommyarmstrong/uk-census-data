import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TOPICS } from "@/lib/topics";

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

import HomePage from "./page";

describe("HomePage", () => {
  it("renders emoji topic tiles without intro copy or region filter", async () => {
    const ui = await HomePage({
      searchParams: Promise.resolve({ geography: "2013265922" }),
    });
    render(ui);

    expect(
      screen.queryByRole("heading", { name: "UK Census Data" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Explore UK Census 2021 statistics by topic and region.",
      ),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Region")).not.toBeInTheDocument();
    expect(screen.queryByText(/^Topics$/)).not.toBeInTheDocument();

    for (const topic of TOPICS) {
      expect(screen.getByText(topic.emoji)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: new RegExp(topic.name) }),
      ).toHaveAttribute("href", `/topics/${topic.slug}?geography=2013265922`);
    }
  });
});
