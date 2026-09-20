export const formatPrice = (value: number): string => {
  if (!Number.isFinite(value)) return "-";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
};

export const startingPrice = (
  prices: { price: number }[] | undefined
): number | null => {
  if (!prices || prices.length === 0) return null;

  return Math.min(...prices.map((p) => p.price));
};

export const formatDate = (value: string, locale = "en-US"): string => {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

// "15 March 1995" / "١٥ مارس ١٩٩٥" — long, unambiguous date. Date-only ISO
// strings ("1995-03-15") are parsed as a local calendar date so the day never
// shifts by one because of the viewer's timezone.
export const formatCalendarDate = (
  value: string | null | undefined,
  locale = "en-US"
): string => {
  if (!value) return "";

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// "20 Sep 2026, 3:34 PM" — date and time for audit-style timestamps.
export const formatDateTime = (
  value: string | null | undefined,
  locale = "en-US"
): string => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

// Whole years between a calendar date and today.
export const calculateAge = (value: string | null | undefined): number | null => {
  const match = value ? /^(\d{4})-(\d{2})-(\d{2})/.exec(value) : null;

  if (!match) return null;

  const today = new Date();
  let age = today.getFullYear() - Number(match[1]);

  const hadBirthday =
    today.getMonth() + 1 > Number(match[2]) ||
    (today.getMonth() + 1 === Number(match[2]) &&
      today.getDate() >= Number(match[3]));

  if (!hadBirthday) age -= 1;

  return age >= 0 ? age : null;
};
