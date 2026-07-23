import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useIsNarrow } from "./use-is-narrow";

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<() => void>();
  const media = {
    matches,
    media: "",
    addEventListener: (_event: string, listener: () => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_event: string, listener: () => void) => {
      listeners.delete(listener);
    },
    dispatch: (next: boolean) => {
      media.matches = next;
      listeners.forEach((listener) => listener());
    },
  };

  const matchMedia = vi.fn().mockImplementation((query: string) => {
    media.media = query;
    return media;
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: matchMedia,
  });

  return { media, matchMedia };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useIsNarrow", () => {
  it("defaults to false and follows matchMedia for the sm breakpoint", () => {
    const { media, matchMedia } = mockMatchMedia(true);

    const { result } = renderHook(() => useIsNarrow());

    expect(matchMedia).toHaveBeenCalledWith("(max-width: 639px)");
    expect(result.current).toBe(true);

    act(() => {
      media.dispatch(false);
    });
    expect(result.current).toBe(false);
  });

  it("uses a custom breakpoint when provided", () => {
    const { matchMedia } = mockMatchMedia(false);

    renderHook(() => useIsNarrow(768));

    expect(matchMedia).toHaveBeenCalledWith("(max-width: 767px)");
  });

  it("stays false when matchMedia is unavailable", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useIsNarrow());

    expect(result.current).toBe(false);
  });

  it("removes the media listener on unmount", () => {
    const { media } = mockMatchMedia(false);
    const removeSpy = vi.spyOn(media, "removeEventListener");

    const { unmount } = renderHook(() => useIsNarrow());
    unmount();

    expect(removeSpy).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
