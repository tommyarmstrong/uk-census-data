import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const usePathname = vi.fn(() => "/");
const useSearchParams = vi.fn(() => new URLSearchParams());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => usePathname(),
  useSearchParams: () => useSearchParams(),
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange: (value: string | null) => void;
    children: React.ReactNode;
  }) => (
    <div data-testid="select" data-value={value}>
      <button type="button" onClick={() => onValueChange("2013265922")}>
        Choose North West
      </button>
      <button type="button" onClick={() => onValueChange(null)}>
        Clear
      </button>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
  SelectValue: () => null,
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { RegionFilter } from "./region-filter";

describe("RegionFilter", () => {
  beforeEach(() => {
    push.mockClear();
    usePathname.mockReturnValue("/topics/demographics");
    useSearchParams.mockReturnValue(new URLSearchParams("foo=1"));
  });

  it("renders the region control without a visible Region label", () => {
    render(<RegionFilter />);
    expect(screen.queryByText("Region")).not.toBeInTheDocument();
    expect(screen.getByTestId("select")).toBeInTheDocument();
  });

  it("pushes an updated geography query when a region is chosen", async () => {
    const user = userEvent.setup();
    render(<RegionFilter id="region-filter-test" />);

    await user.click(screen.getByRole("button", { name: "Choose North West" }));

    expect(push).toHaveBeenCalledWith(
      "/topics/demographics?foo=1&geography=2013265922",
    );
  });

  it("ignores null select values", async () => {
    const user = userEvent.setup();
    render(<RegionFilter />);

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(push).not.toHaveBeenCalled();
  });
});
