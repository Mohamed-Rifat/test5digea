import type { LoginResponse } from "@/types/auth";

const AUTH_STORAGE_KEY = "5digea_auth";

export const authStorage = {
  set(data: LoginResponse) {
    if (typeof window === "undefined") return;

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  },

  get(): LoginResponse | null {
    if (typeof window === "undefined") return null;

    const data = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!data) return null;

    try {
      return JSON.parse(data) as LoginResponse;
    } catch {
      return null;
    }
  },

  remove() {
    if (typeof window === "undefined") return;

    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};