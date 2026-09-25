import { getLanguageSnapshot } from "@/lib/i18n";
import { localizeText } from "@/lib/bilingual";
import {
  DEFAULT_LANGUAGE,
  translations,
  type Language,
  type TranslationKey,
} from "@/locales";

function lookup(language: Language, key: string): string | undefined {
  let node: unknown = translations[language];
  for (const part of key.split(".")) {
    if (typeof node !== "object" || node === null || !(part in node)) {
      return undefined;
    }
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

/**
 * Translates a key in the *current* UI language outside of React components
 * (hooks' catch blocks, API helpers). Inside components prefer `t()` from
 * `useLanguage()`, which also re-renders when the language changes.
 */
export function translateNow(key: TranslationKey): string {
  const language =
    typeof window === "undefined" ? DEFAULT_LANGUAGE : getLanguageSnapshot();
  return lookup(language, key) ?? lookup(DEFAULT_LANGUAGE, key) ?? key;
}

/** `localize()` outside components (toasts from hooks, API helpers). */
export function localizeNow(value: string | null | undefined): string {
  const language =
    typeof window === "undefined" ? DEFAULT_LANGUAGE : getLanguageSnapshot();
  return localizeText(value, language);
}
