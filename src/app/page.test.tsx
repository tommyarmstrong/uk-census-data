import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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
  it("renders topic tiles without intro copy", async () => {
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
    expect(screen.getByText("👥")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Demographics/ })).toHaveAttribute(
      "href",
      "/topics/demographics?geography=2013265922",
    );
  });
});
