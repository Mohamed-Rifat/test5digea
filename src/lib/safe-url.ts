/**
 * Turns user-typed link text into a URL that is safe to put in an `href`.
 *
 * - empty input          -> ""
 * - "https://x.com/a"    -> kept as is (http/https only)
 * - "instagram.com/a"    -> "https://instagram.com/a"
 * - "javascript:..." and any other scheme -> null (rejected)
 */
export const normalizeExternalUrl = (
  value: string | null | undefined
): string | null => {
  const trimmed = (value ?? "").trim();

  if (!trimmed) return "";

  // Has an explicit scheme ("http:", "javascript:", "data:", ...)?
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed);
  const candidate = hasScheme
    ? trimmed
    : `https://${trimmed.replace(/^\/+/, "")}`;

  try {
    const url = new URL(candidate);

    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;

    return candidate;
  } catch {
    return null;
  }
};
