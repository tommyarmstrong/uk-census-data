import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AsyncQueue } from "./async-queue";

describe("AsyncQueue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("runs tasks and returns their results", async () => {
    const queue = new AsyncQueue(2, 0);
    const result = queue.schedule(async () => "ok");
    await expect(result).resolves.toBe("ok");
  });

  it("respects max concurrency", async () => {
    const queue = new AsyncQueue(1, 0);
    let active = 0;
    let maxActive = 0;

    const task = async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await Promise.resolve();
      active -= 1;
      return active;
    };

    const first = queue.schedule(task);
    const second = queue.schedule(task);

    await vi.runAllTimersAsync();
    await Promise.all([first, second]);

    expect(maxActive).toBe(1);
  });

  it("spaces starts by minIntervalMs", async () => {
    const queue = new AsyncQueue(2, 100);
    const starts: number[] = [];

    const task = async () => {
      starts.push(Date.now());
      return true;
    };

    const first = queue.schedule(task);
    const second = queue.schedule(task);

    await vi.advanceTimersByTimeAsync(0);
    await first;
    expect(starts).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(99);
    expect(starts).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(1);
    await second;
    expect(starts).toHaveLength(2);
  });

  it("propagates task errors after releasing the slot", async () => {
    const queue = new AsyncQueue(1, 0);
    const failing = queue.schedule(async () => {
      throw new Error("boom");
    });
    await expect(failing).rejects.toThrow("boom");

    await expect(queue.schedule(async () => "recovered")).resolves.toBe(
      "recovered",
    );
  });
});
