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

import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders licence and data source sections", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "NOMIS" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Software licence" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "MIT License" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Data licence" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Open Government Licence/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
