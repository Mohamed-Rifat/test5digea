import { isAxiosError } from "axios";

import type { TranslationKey } from "@/locales";

interface ApiErrorBody {
  detail?: string;
  message?: string;
  title?: string;
}

/**
 * Extracts a user-safe error message from any error thrown by an API call.
 * Centralizes the response-shape guessing that used to be duplicated
 * (and often typed as `any`) across individual pages.
 *
 * For HTTP errors only what the server explicitly sent is used. Axios' own
 * `message` ("Request failed with status code 500", "Network Error") is a
 * technical English string, so it is never shown - the caller's (translated)
 * fallback is used instead.
 */
export const getApiErrorMessage = (
  err: unknown,
  fallback = "Something went wrong. Please try again."
): string => {
  if (isAxiosError<ApiErrorBody>(err)) {
    return (
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.response?.data?.title ||
      fallback
    );
  }

  if (err instanceof Error) {
    return err.message || fallback;
  }

  return fallback;
};

/**
 * The specific reason the server gave (`detail` / `message`), or null when it
 * sent nothing useful. Generic ProblemDetails titles are deliberately ignored.
 */
export const getApiErrorDetail = (err: unknown): string | null => {
  if (isAxiosError<ApiErrorBody>(err)) {
    return err.response?.data?.detail || err.response?.data?.message || null;
  }

  return null;
};

/**
 * An error that is translated when it is displayed rather than when it is
 * raised, so it follows the language switcher and never leaks English text
 * into the Arabic UI. `detail` is the server's own explanation, if any.
 */
export interface LocalizedError {
  key: TranslationKey;
  detail?: string | null;
}

export const localizedError = (
  key: TranslationKey,
  err?: unknown
): LocalizedError => ({
  key,
  detail: err === undefined ? null : getApiErrorDetail(err),
});

export const resolveLocalizedError = (
  error: LocalizedError | null,
  t: (key: TranslationKey) => string
): string | null => (error ? error.detail || t(error.key) : null);
