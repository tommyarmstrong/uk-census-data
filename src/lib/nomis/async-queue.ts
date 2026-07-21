/**
 * Limit concurrent async work and space out starts.
 * Used so topic pages with multiple charts do not stampede NOMIS.
 */
export class AsyncQueue {
  private active = 0;
  private readonly waiters: Array<() => void> = [];
  private lastStartAt = 0;

  constructor(
    private readonly maxConcurrent: number,
    private readonly minIntervalMs: number,
  ) {}

  async schedule<T>(task: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await task();
    } finally {
      this.release();
    }
  }

  private acquire(): Promise<void> {
    return new Promise((resolve) => {
      const tryStart = () => {
        if (this.active >= this.maxConcurrent) {
          this.waiters.push(tryStart);
          return;
        }

        const wait = Math.max(
          0,
          this.minIntervalMs - (Date.now() - this.lastStartAt),
        );

        if (wait > 0) {
          globalThis.setTimeout(() => {
            if (this.active >= this.maxConcurrent) {
              this.waiters.push(tryStart);
              return;
            }
            this.active += 1;
            this.lastStartAt = Date.now();
            resolve();
          }, wait);
          return;
        }

        this.active += 1;
        this.lastStartAt = Date.now();
        resolve();
      };

      tryStart();
    });
  }

  private release(): void {
    this.active = Math.max(0, this.active - 1);
    const next = this.waiters.shift();
    if (next) {
      next();
    }
  }
}
