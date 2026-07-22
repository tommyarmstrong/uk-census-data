import { describe, expect, it, vi } from "vitest";

import {
  buildExportBasename,
  downloadTextFile,
  seriesToCsv,
  seriesToJson,
} from "./download";
import { SAMPLE_CHART, SAMPLE_SERIES } from "@/test/fixtures";

const DATA = [
  { code: "1", name: "Female", value: 100 },
  { code: "2", name: "Male", value: 110 },
];

describe("buildExportBasename", () => {
  it("builds a slugified filename stem", () => {
    expect(buildExportBasename(SAMPLE_CHART, SAMPLE_SERIES)).toBe(
      "ts008-sex-north-west",
    );
  });

  it("falls back to geography code when the label is empty", () => {
    expect(
      buildExportBasename(SAMPLE_CHART, {
        ...SAMPLE_SERIES,
        geographyLabel: "",
      }),
    ).toBe("ts008-sex-2013265922");
  });
});

describe("seriesToCsv", () => {
  it("exports readable category labels", () => {
    expect(seriesToCsv(SAMPLE_CHART, SAMPLE_SERIES, DATA)).toBe(
      [
        "category,code,value,geography,dataset,table",
        "Female,1,100,North West,NM_2028_1,TS008",
        "Male,2,110,North West,NM_2028_1,TS008",
        "",
      ].join("\n"),
    );
  });

  it("escapes commas and quotes in category labels", () => {
    const csv = seriesToCsv(SAMPLE_CHART, SAMPLE_SERIES, [
      { code: "1", name: 'Owned, "outright"', value: 42 },
    ]);
    expect(csv).toContain(
      '"Owned, ""outright""",1,42,North West,NM_2028_1,TS008',
    );
  });
});

describe("seriesToJson", () => {
  it("includes chart metadata and observations", () => {
    const parsed = JSON.parse(seriesToJson(SAMPLE_CHART, SAMPLE_SERIES, DATA));
    expect(parsed.chart.tableCode).toBe("TS008");
    expect(parsed.geography.label).toBe("North West");
    expect(parsed.observations).toEqual([
      { category: "Female", code: "1", value: 100 },
      { category: "Male", code: "2", value: 110 },
    ]);
  });
});

describe("downloadTextFile", () => {
  it("creates a temporary download link and clicks it", () => {
    const createObjectURL = vi.fn(() => "blob:mock");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL,
      revokeObjectURL,
    });

    const click = vi.fn();
    const remove = vi.fn();
    const appendChild = vi
      .spyOn(document.body, "appendChild")
      .mockImplementation((node) => node);
    vi.spyOn(document, "createElement").mockReturnValue({
      href: "",
      download: "",
      rel: "",
      click,
      remove,
    } as unknown as HTMLAnchorElement);

    downloadTextFile("demo.csv", "a,b\n", "text/csv");

    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock");
    expect(appendChild).toHaveBeenCalled();

    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
});
