import type { LoginResponse } from "@/types/auth";

const AUTH_STORAGE_KEY = "5digea_auth";

export const authStorage = {
  set(data: LoginResponse) {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage may be blocked or unavailable (private mode/quota).
    }
  },

  get(): LoginResponse | null {
    if (typeof window === "undefined") return null;

    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);

      if (!data) return null;

      return JSON.parse(data) as LoginResponse;
    } catch {
      return null;
    }
  },

  remove() {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore storage failures during logout.
    }
  },
};