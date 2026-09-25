import type { LoginResponse } from "@/types/auth";

export const AUTH_STORAGE_KEY = "5digea_auth";

/** Same-tab change notifications (the `storage` event only fires in other tabs). */
const AUTH_CHANGE_EVENT = "5digea:auth-change";

// Used only when localStorage is unavailable, so login still works for the
// current page session.
let memoryFallback: string | null = null;

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(AUTH_STORAGE_KEY) ?? memoryFallback;
  } catch {
    return memoryFallback;
  }
}

function notify() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function parseAuth(raw: string | null): LoginResponse | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as LoginResponse;
    return data && typeof data.token === "string" ? data : null;
  } catch {
    return null;
  }
}

export const authStorage = {
  set(data: LoginResponse) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
      memoryFallback = null;
    } catch {
      // Storage blocked (private mode / quota): keep it in memory instead.
      memoryFallback = JSON.stringify(data);
    }
    notify();
  },

  get(): LoginResponse | null {
    return parseAuth(readRaw());
  },

  /** Raw string snapshot - stable between calls, used by useSyncExternalStore. */
  getRaw: readRaw,

  remove() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    memoryFallback = null;
    notify();
  },

  /** Subscribes to login/logout in this tab and in other tabs. */
  subscribe(onChange: () => void) {
    if (typeof window === "undefined") return () => {};
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === AUTH_STORAGE_KEY) onChange();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(AUTH_CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
    };
  },
};
