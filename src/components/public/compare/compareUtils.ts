import type { TranslationKey } from "@/locales";

export const MAX_COMPARE = 4;

export const LABEL_COL_WIDTH = 160;

type TranslationParams = Record<string, string | number>;

export class CompareError extends Error {
  key: TranslationKey;
  params?: TranslationParams;
  constructor(key: TranslationKey, params?: TranslationParams) {
    super(key);
    this.key = key;
    this.params = params;
  }
}

export type ErrorState =
  { key: TranslationKey; params?: TranslationParams } | { message: string };
