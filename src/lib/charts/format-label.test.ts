import { describe, expect, it } from "vitest";

import {
  chartLabelMaxLength,
  DENSE_VERTICAL_BAR_THRESHOLD,
  formatChartAxisLabel,
  truncateChartLabel,
  yAxisWidthForLabels,
} from "./format-label";

describe("truncateChartLabel", () => {
  it("returns the label unchanged when within the limit", () => {
    expect(truncateChartLabel("Female", 10)).toBe("Female");
    expect(truncateChartLabel("  Female  ", 10)).toBe("Female");
  });

  it("truncates with an ellipsis when over the limit", () => {
    expect(truncateChartLabel("Aged 85 years and over", 12)).toBe(
      "Aged 85 yea…",
    );
  });

  it("trims trailing whitespace before the ellipsis", () => {
    expect(truncateChartLabel("Hello world extra", 7)).toBe("Hello…");
  });

  it("handles tiny max lengths", () => {
    expect(truncateChartLabel("Female", 0)).toBe("");
    expect(truncateChartLabel("Female", 1)).toBe("…");
  });
});

describe("formatChartAxisLabel", () => {
  it("uses the leaf after the last colon for hierarchical labels", () => {
    expect(
      formatChartAxisLabel(
        "Asian, Asian British or Asian Welsh: Bangladeshi",
        22,
      ),
    ).toBe("Bangladeshi");
  });

  it("uses the final leaf when there are nested colons", () => {
    expect(formatChartAxisLabel("Group: Subgroup: Detail category", 40)).toBe(
      "Detail category",
    );
  });

  it("truncates long leaves", () => {
    expect(
      formatChartAxisLabel(
        "White: English, Welsh, Scottish, Northern Irish or British",
        18,
      ),
    ).toBe("English, Welsh, S…");
  });

  it("falls back to the full label when the leaf after a colon is empty", () => {
    expect(formatChartAxisLabel("Incomplete label: ", 40)).toBe(
      "Incomplete label:",
    );
  });

  it("truncates labels without a colon", () => {
    expect(
      formatChartAxisLabel("A Agriculture, forestry and fishing", 16),
    ).toBe("A Agriculture,…");
  });
});

describe("chartLabelMaxLength", () => {
  it("returns the expected budgets for each layout", () => {
    expect(chartLabelMaxLength("axis-y", true)).toBe(14);
    expect(chartLabelMaxLength("axis-y", false)).toBe(22);
    expect(chartLabelMaxLength("axis-x", true)).toBe(10);
    expect(chartLabelMaxLength("axis-x", false)).toBe(16);
    expect(chartLabelMaxLength("legend", true)).toBe(28);
    expect(chartLabelMaxLength("legend", false)).toBe(40);
  });
});

describe("yAxisWidthForLabels", () => {
  it("clamps width between min and max for the viewport", () => {
    expect(yAxisWidthForLabels([""], true)).toBe(72);
    expect(yAxisWidthForLabels(["x".repeat(40)], true)).toBe(120);
    expect(yAxisWidthForLabels([""], false)).toBe(96);
    expect(yAxisWidthForLabels(["x".repeat(40)], false)).toBe(168);
  });

  it("grows with longer display labels within the clamp", () => {
    const short = yAxisWidthForLabels(["Short"], false);
    const longer = yAxisWidthForLabels(["A somewhat longer label"], false);
    expect(longer).toBeGreaterThan(short);
  });

  it("uses the longest label when sizing the axis", () => {
    const withLong = yAxisWidthForLabels(["a", "abcdefghijklmnop"], false);
    const onlyShort = yAxisWidthForLabels(["a"], false);
    expect(withLong).toBeGreaterThan(onlyShort);
  });
});

describe("DENSE_VERTICAL_BAR_THRESHOLD", () => {
  it("is high enough to keep short series vertical on desktop", () => {
    expect(DENSE_VERTICAL_BAR_THRESHOLD).toBe(9);
  });
});
