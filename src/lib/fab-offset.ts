"use client";

import { useEffect, type RefObject } from "react";

/**
 * A bottom bar (compare tray, mobile contact bar...) calls this so the
 * floating quick-actions button sits above it instead of covering it.
 * Writes the bar's height to the `--fab-offset` CSS variable.
 */
export function useReserveFabSpace(ref: RefObject<HTMLElement | null>, active = true) {
  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!active || !el) {
      root.style.removeProperty("--fab-offset");
      return;
    }
    const update = () => {
      const visible = getComputedStyle(el).display !== "none";
      root.style.setProperty("--fab-offset", visible ? `${el.offsetHeight}px` : "0px");
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      root.style.removeProperty("--fab-offset");
    };
  }, [ref, active]);
}
