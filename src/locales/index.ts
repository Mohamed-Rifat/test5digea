import ar from "./ar";
import en from "./en";
import type { Language } from "./config";
import type { Translation } from "./types";

export const translations: Record<Language, Translation> = { ar, en };

export * from "./config";
export type { Translation, TranslationKey } from "./types";
