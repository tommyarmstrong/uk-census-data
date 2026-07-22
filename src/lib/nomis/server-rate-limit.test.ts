import { describe, expect, it } from "vitest";

import { consumeRateLimit } from "./server-rate-limit";

describe("consumeRateLimit", () => {
  it("allows requests under the limit and tracks remaining", () => {
    const key = `ok-${Math.random()}`;
    const first = consumeRateLimit(key, { limit: 2, windowMs: 60_000 });
    const second = consumeRateLimit(key, { limit: 2, windowMs: 60_000 });

    expect(first).toEqual({ ok: true, remaining: 1 });
    expect(second).toEqual({ ok: true, remaining: 0 });
  });

  it("blocks when the limit is reached", () => {
    const key = `block-${Math.random()}`;
    consumeRateLimit(key, { limit: 1, windowMs: 60_000 });
    const blocked = consumeRateLimit(key, { limit: 1, windowMs: 60_000 });

    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.retryAfterSec).toBeGreaterThanOrEqual(1);
    }
  });

  it("isolates buckets by key", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;

    consumeRateLimit(a, { limit: 1, windowMs: 60_000 });
    const other = consumeRateLimit(b, { limit: 1, windowMs: 60_000 });

    expect(other).toEqual({ ok: true, remaining: 0 });
  });
});
