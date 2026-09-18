"use client";

import { useEffect, useState } from "react";

/**
 * Returns the number of whole seconds remaining until `expirationIso`.
 * Updates every second. Returns null when there is nothing to count down
 * (no expiration date passed in, e.g. user is logged out).
 */
export function useSessionCountdown(
  expirationIso: string | undefined | null
): number | null {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(() =>
    computeSecondsLeft(expirationIso)
  );

  useEffect(() => {
    if (!expirationIso) {
      setSecondsLeft(null);
      return;
    }

    // Set immediately, then tick every second.
    setSecondsLeft(computeSecondsLeft(expirationIso));

    const intervalId = window.setInterval(() => {
      setSecondsLeft(computeSecondsLeft(expirationIso));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [expirationIso]);

  return secondsLeft;
}

function computeSecondsLeft(
  expirationIso: string | undefined | null
): number | null {
  if (!expirationIso) return null;

  const expirationMs = new Date(expirationIso).getTime();

  if (Number.isNaN(expirationMs)) return null;

  const diffMs = expirationMs - Date.now();

  return Math.floor(diffMs / 1000);
}