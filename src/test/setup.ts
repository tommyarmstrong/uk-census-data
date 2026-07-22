import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
  memoryStorage.clear();
});

/** jsdom 29's Storage stub is incomplete; provide a Map-backed localStorage. */
class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.has(key) ? (this.store.get(key) ?? null) : null;
  }

  key(index: number) {
    return [...this.store.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  setItem(key: string, value: string) {
    this.store.set(String(key), String(value));
  }
}

const memoryStorage = new MemoryStorage();

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: memoryStorage,
});

Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: memoryStorage,
});

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
