import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ServiceWorkerRegister } from "./service-worker-register";

describe("ServiceWorkerRegister", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("does not register outside production", () => {
    const register = vi.fn();
    vi.stubEnv("NODE_ENV", "test");
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { register },
    });

    render(<ServiceWorkerRegister />);
    expect(register).not.toHaveBeenCalled();
  });

  it("registers the service worker in production", () => {
    const register = vi.fn().mockResolvedValue({});
    vi.stubEnv("NODE_ENV", "production");
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { register },
    });

    render(<ServiceWorkerRegister />);
    expect(register).toHaveBeenCalledWith("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  });

  it("skips registration when serviceWorker is unavailable", () => {
    vi.stubEnv("NODE_ENV", "production");
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: undefined,
    });

    expect(() => render(<ServiceWorkerRegister />)).not.toThrow();
  });

  it("swallows registration failures", () => {
    const register = vi.fn().mockRejectedValue(new Error("blocked"));
    vi.stubEnv("NODE_ENV", "production");
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { register },
    });

    expect(() => render(<ServiceWorkerRegister />)).not.toThrow();
  });
});
