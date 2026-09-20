/**
 * Language configuration shared by the server (root layout) and the client
 * (LanguageContext). Keep this file free of imports so it can be used
 * anywhere without pulling the translation dictionaries into the bundle.
 */

export const LANGUAGES = ["ar", "en"] as const;

export type Language = (typeof LANGUAGES)[number];
export type Direction = "rtl" | "ltr";

/** Arabic is the primary language of the product. */
export const DEFAULT_LANGUAGE: Language = "ar";

/** localStorage key holding the visitor's chosen language. */
export const LANGUAGE_STORAGE_KEY = "5digea-language";

export const LANGUAGE_DIRECTION: Record<Language, Direction> = {
  ar: "rtl",
  en: "ltr",
};

/** Each language is always displayed in its own script, never translated. */
export const LANGUAGE_NATIVE_NAME: Record<Language, string> = {
  ar: "العربية",
  en: "English",
};

/** Locale used for dates/numbers (Arabic month names, but Western digits). */
export const LANGUAGE_DATE_LOCALE: Record<Language, string> = {
  ar: "ar-EG-u-nu-latn",
  en: "en-US",
};

export function isLanguage(value: unknown): value is Language {
  return (LANGUAGES as readonly unknown[]).includes(value);
}
