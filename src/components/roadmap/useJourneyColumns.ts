"use client";

import { useSyncExternalStore } from "react";

/** Current number of columns for the journey grid (1 / 2 / 3). */
function subscribeToResize(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function getColumns() {
  if (typeof window === "undefined") return 3;
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 768px)").matches) return 2;
  return 1;
}

export function useJourneyColumns() {
  return useSyncExternalStore(subscribeToResize, getColumns, () => 3);
}
