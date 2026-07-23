"use client";

import { useEffect, useState } from "react";

/** True when the viewport is narrower than the given breakpoint (default: Tailwind `sm`). */
export function useIsNarrow(breakpointPx = 640) {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const media = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [breakpointPx]);

  return narrow;
}
