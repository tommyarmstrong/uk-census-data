import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SAMPLE_JSONSTAT } from "@/test/fixtures";

vi.mock("@/lib/nomis/server-rate-limit", () => ({
  consumeRateLimit: vi.fn(),
}));

import { consumeRateLimit } from "@/lib/nomis/server-rate-limit";
import { GET } from "./route";

const mockedLimit = vi.mocked(consumeRateLimit);

function request(url: string, headers?: HeadersInit) {
  return new Request(url, { headers });
}

describe("GET /api/nomis", () => {
  beforeEach(() => {
    mockedLimit.mockReturnValue({ ok: true, remaining: 29 });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => SAMPLE_JSONSTAT,
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("returns a parsed series for valid params", async () => {
    const response = await GET(
      request(
        "http://localhost/api/nomis?dataset=NM_2028_1&geography=2013265922",
        { "x-forwarded-for": "10.0.0.1, 1.2.3.4" },
      ),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.observations).toHaveLength(2);
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("29");
    expect(mockedLimit).toHaveBeenCalledWith("10.0.0.1", expect.any(Object));
  });

  it("falls back to x-real-ip and anonymous keys", async () => {
    await GET(
      request(
        "http://localhost/api/nomis?dataset=NM_2028_1&geography=2013265922",
        { "x-real-ip": "9.9.9.9" },
      ),
    );
    expect(mockedLimit).toHaveBeenCalledWith("9.9.9.9", expect.any(Object));

    await GET(
      request(
        "http://localhost/api/nomis?dataset=NM_2028_1&geography=2013265922",
      ),
    );
    expect(mockedLimit).toHaveBeenCalledWith("anonymous", expect.any(Object));
  });

  it("rejects invalid dataset, geography, and measures", async () => {
    const badDataset = await GET(
      request("http://localhost/api/nomis?dataset=BAD&geography=2013265922"),
    );
    expect(badDataset.status).toBe(400);

    const badGeo = await GET(
      request("http://localhost/api/nomis?dataset=NM_2028_1&geography=abc"),
    );
    expect(badGeo.status).toBe(400);

    const badMeasures = await GET(
      request(
        "http://localhost/api/nomis?dataset=NM_2028_1&geography=2013265922&measures=nope",
      ),
    );
    expect(badMeasures.status).toBe(400);
  });

  it("returns 429 when rate limited", async () => {
    mockedLimit.mockReturnValue({ ok: false, retryAfterSec: 12 });
    const response = await GET(
      request(
        "http://localhost/api/nomis?dataset=NM_2028_1&geography=2013265922",
      ),
    );
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("12");
  });

  it("returns 502 when upstream NOMIS fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({}),
      }),
    );

    const response = await GET(
      request("http://localhost/api/nomis?dataset=NM_2028_1&geography=TYPE480"),
    );
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      error: "NOMIS returned 503",
    });
  });

  it("returns 502 when parsing fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ class: "nope" }),
      }),
    );

    const response = await GET(
      request(
        "http://localhost/api/nomis?dataset=NM_2028_1&geography=2013265922",
      ),
    );
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.error).toContain("Invalid JSON-stat");
  });

  it("returns 502 when fetch throws a non-Error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue("network exploded"));

    const response = await GET(
      request(
        "http://localhost/api/nomis?dataset=NM_2028_1&geography=2013265922",
      ),
    );
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      error: "Failed to fetch or parse NOMIS data",
    });
  });
});
