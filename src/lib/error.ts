import { isAxiosError } from "axios";

interface ApiErrorBody {
  detail?: string;
  message?: string;
  title?: string;
}

/**
 * Extracts a user-safe error message from any error thrown by an API call.
 * Centralizes the response-shape guessing that used to be duplicated
 * (and often typed as `any`) across individual pages.
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
      err.message ||
      fallback
    );
  }

  if (err instanceof Error) {
    return err.message || fallback;
  }

  return fallback;
};
