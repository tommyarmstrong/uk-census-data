import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/topics/demographics",
  useSearchParams: () => new URLSearchParams("geography=2092957699"),
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
      {children}
    </div>
  ),
  SelectTrigger: ({
    children,
    id,
    ...props
  }: {
    children: React.ReactNode;
    id?: string;
  }) => (
    <div id={id} {...props}>
      {children}
    </div>
  ),
  SelectValue: () => null,
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { TopicRegionFilter } from "./topic-region-filter";

describe("TopicRegionFilter", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("renders the topic-page region control", () => {
    const { container } = render(<TopicRegionFilter />);

    expect(screen.queryByText("Region")).not.toBeInTheDocument();
    expect(container.querySelector("#region-filter-topic")).toBeTruthy();
    expect(screen.getByTestId("select")).toHaveAttribute(
      "data-value",
      "2092957699",
    );
  });

  it("updates geography from the topic page path", async () => {
    const user = userEvent.setup();
    render(<TopicRegionFilter />);

    await user.click(screen.getByRole("button", { name: "Choose North West" }));

    expect(push).toHaveBeenCalledWith(
      "/topics/demographics?geography=2013265922",
    );
  });
});
