"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  applyDocumentLanguage,
  getLanguageServerSnapshot,
  getLanguageSnapshot,
  setStoredLanguage,
  subscribeToLanguage,
} from "@/lib/i18n";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_DIRECTION,
  isLanguage,
  translations,
  type Direction,
  type Language,
  type TranslationKey,
} from "@/locales";
import { localizeText } from "@/lib/bilingual";

type TranslationParams = Record<string, string | number>;

// Unicode "first strong isolate" markers (invisible).
const BIDI_ISOLATE_START = "\u2068";
const BIDI_ISOLATE_END = "\u2069";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  /** Translate a dotted key, e.g. t("navbar.home"). Supports {placeholders}. */
  t: (key: TranslationKey, params?: TranslationParams) => string;
  isArabic: boolean;
  dir: Direction;
  /**
   * Picks the current-language half of admin-entered bilingual text
   * (category names/descriptions stored as "عربي ‖ English").
   */
  localize: (value: string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

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

function translate(
  language: Language,
  key: string,
  params?: TranslationParams,
): string {
  // Types keep both languages in sync; the fallbacks only protect against
  // dynamically built keys that slipped past the compiler.
  const text = lookup(language, key) ?? lookup(DEFAULT_LANGUAGE, key) ?? key;

  if (!params) return text;

  // In RTL text, isolate inserted strings (emails, names, Latin words) so
  // surrounding punctuation cannot reorder them.
  const isRtl = LANGUAGE_DIRECTION[language] === "rtl";

  return text.replace(/\{(\w+)\}/g, (placeholder, name: string) => {
    if (!Object.prototype.hasOwnProperty.call(params, name)) return placeholder;

    const value = params[name];
    if (typeof value === "number") return String(value); // digits already order correctly
    return isRtl ? `${BIDI_ISOLATE_START}${value}${BIDI_ISOLATE_END}` : value;
  });
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // The server (and the first hydration pass) renders Arabic; the stored
  // choice is applied right after hydration without a mismatch error.
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot,
  );

  // Keep <html lang> and <html dir> in sync with the active language.
  useEffect(() => {
    applyDocumentLanguage(language);
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    if (isLanguage(next)) setStoredLanguage(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams) =>
      translate(language, key, params),
    [language],
  );

  const localize = useCallback(
    (text: string | null | undefined) => localizeText(text, language),
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t,
      isArabic: language === "ar",
      dir: LANGUAGE_DIRECTION[language],
      localize,
    }),
    [language, setLanguage, t, localize],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
