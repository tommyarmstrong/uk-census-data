import { describe, expect, it } from "vitest";

import manifest from "./manifest";

describe("manifest", () => {
  it("returns PWA metadata", () => {
    const value = manifest();
    expect(value.name).toBe("UK Census Data");
    expect(value.display).toBe("standalone");
    expect(value.icons?.length).toBeGreaterThan(0);
  });
});
