"use client";

import { createContext, useContext } from "react";

import type { SessionAlertLevel } from "@/lib/session-warning";

export interface SessionExpiryValue {
  /** Whole seconds until the session expires, or null when logged out. */
  secondsLeft: number | null;
  /** Current warning level, or null when there is more than an hour left. */
  level: SessionAlertLevel | null;
}

export const SessionExpiryContext = createContext<SessionExpiryValue>({
  secondsLeft: null,
  level: null,
});

export function useSessionExpiry() {
  return useContext(SessionExpiryContext);
}
