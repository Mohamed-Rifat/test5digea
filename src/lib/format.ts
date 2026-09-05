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

export const formatDate = (value: string): string => {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
};
