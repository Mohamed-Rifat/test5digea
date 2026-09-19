import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  LANGUAGE_DIRECTION,
  LANGUAGE_STORAGE_KEY,
  isLanguage,
  type Language,
} from "@/locales/config";

/**
 * Language persistence + document direction helpers.
 *
 * This file only depends on `@/locales/config` (not the dictionaries), so the
 * root layout can import the init script without bundling any translations.
 */

const listeners = new Set<() => void>();

// Used only when localStorage is unavailable (private mode, blocked storage),
// so the switcher still works for the current page session.
let sessionFallback: Language | null = null;

function readStoredLanguage(): Language | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(value) ? value : null;
  } catch {
    return null;
  }
}

/** Current language on the client: stored choice, otherwise Arabic. */
export function getLanguageSnapshot(): Language {
  return sessionFallback ?? readStoredLanguage() ?? DEFAULT_LANGUAGE;
}

/** Server render (and first hydration pass) always starts in Arabic. */
export function getLanguageServerSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

export function setStoredLanguage(language: Language) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    sessionFallback = null;
  } catch {
    sessionFallback = language;
  }

  listeners.forEach((listener) => listener());
}

/** Subscribes to same-tab changes and to changes made in other tabs. */
export function subscribeToLanguage(onChange: () => void) {
  listeners.add(onChange);

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== LANGUAGE_STORAGE_KEY) return;
    sessionFallback = null;
    onChange();
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", handleStorage);
  };
}

/**
 * Converts Arabic-Indic (٠-٩) and Persian (۰-۹) digits to ASCII, so numeric
 * inputs such as the OTP code accept whatever keyboard the user types with.
 */
export function normalizeDigits(value: string): string {
  return value
    .replace(/[\u0660-\u0669]/g, (digit) =>
      String(digit.charCodeAt(0) - 0x0660),
    )
    .replace(/[\u06f0-\u06f9]/g, (digit) =>
      String(digit.charCodeAt(0) - 0x06f0),
    );
}

/** Central place where <html lang> and <html dir> are updated. */
export function applyDocumentLanguage(language: Language) {
  const root = document.documentElement;
  root.lang = language;
  root.dir = LANGUAGE_DIRECTION[language];
}

/**
 * Inline script rendered in <head> by the root layout. It applies the saved
 * language to <html> before the first paint, so returning English visitors
 * never see a flash of RTL layout.
 */
export const LANGUAGE_INIT_SCRIPT = `(function(){try{var s=${JSON.stringify(
  LANGUAGES,
)},m=${JSON.stringify(LANGUAGE_DIRECTION)},l=localStorage.getItem(${JSON.stringify(
  LANGUAGE_STORAGE_KEY,
)});if(s.indexOf(l)<0)l=${JSON.stringify(
  DEFAULT_LANGUAGE,
)};var e=document.documentElement;e.lang=l;e.dir=m[l]}catch(_){}})();`;
