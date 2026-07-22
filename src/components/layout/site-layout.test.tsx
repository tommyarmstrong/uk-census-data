import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/topics/demographics",
  useSearchParams: () => new URLSearchParams("geography=2013265922"),
  useRouter: () => ({ push: vi.fn() }),
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

import { SiteFooter } from "./site-footer";
import { HeaderFallback, SiteHeader } from "./site-header";
import { SiteShell } from "./site-shell";

describe("layout components", () => {
  it("renders SiteFooter with a NOMIS link", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "NOMIS" })).toHaveAttribute(
      "href",
      "https://www.nomisweb.co.uk/",
    );
    expect(screen.queryByText(/Installable as an app/)).not.toBeInTheDocument();
  });

  it("renders SiteHeader brand and topic links with geography", () => {
    render(<SiteHeader />);
    expect(
      screen.getByRole("link", { name: "UK Census Data" }),
    ).toHaveAttribute("href", "/?geography=2013265922");

    const nav = screen.getByRole("navigation", { name: "Main" });
    const navLinks = Array.from(nav.querySelectorAll("a")).map(
      (link) => link.textContent,
    );
    expect(navLinks[0]).toBe("Home");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/?geography=2013265922",
    );
    expect(screen.getByRole("link", { name: "Demographics" })).toHaveAttribute(
      "href",
      "/topics/demographics?geography=2013265922",
    );
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("renders the header fallback chrome", () => {
    render(<HeaderFallback />);
    expect(screen.getByText("UK Census Data")).toBeInTheDocument();
  });

  it("wraps children in SiteShell without a global region bar", () => {
    render(
      <SiteShell>
        <p>Page body</p>
      </SiteShell>,
    );
    expect(screen.getByText("Page body")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.queryByText("Region")).not.toBeInTheDocument();
  });
});
