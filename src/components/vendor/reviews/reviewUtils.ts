import { AlertCircle, CheckCircle2, Clock3, Filter, XCircle, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/format";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import type { Language, TranslationKey } from "@/locales";
import { ReviewStatus } from "@/types/review";

export const STATUS_FILTERS: {
  value: string;
  labelKey: TranslationKey;
  icon: React.ElementType;
}[] = [
  { value: "all", labelKey: "vendor.reviews.filters.statusAll", icon: Filter },
  { value: String(ReviewStatus.Approved), labelKey: "vendor.reviews.status.approved", icon: CheckCircle2 },
  { value: String(ReviewStatus.Pending), labelKey: "vendor.reviews.status.pending", icon: Clock3 },
  { value: String(ReviewStatus.Rejected), labelKey: "vendor.reviews.status.rejected", icon: XCircle },
];

export const VISIBILITY_FILTERS: {
  value: string;
  labelKey: TranslationKey;
  icon: React.ElementType;
}[] = [
  { value: "all", labelKey: "vendor.reviews.filters.visAll", icon: Filter },
  { value: "visible", labelKey: "vendor.reviews.filters.visVisible", icon: Eye },
  { value: "hidden", labelKey: "vendor.reviews.filters.visHidden", icon: EyeOff },
];

export const SORT_OPTIONS: { value: string; labelKey: TranslationKey }[] = [
  { value: "newest", labelKey: "vendor.reviews.filters.sortNewest" },
  { value: "oldest", labelKey: "vendor.reviews.filters.sortOldest" },
  { value: "highest", labelKey: "vendor.reviews.filters.sortHighest" },
  { value: "lowest", labelKey: "vendor.reviews.filters.sortLowest" },
];

export type TFn = (key: TranslationKey, params?: Record<string, string | number>) => string;

export const PAGE_SIZE = 5;

export function getStatusMeta(status: ReviewStatus) {
  const configs = {
    [ReviewStatus.Approved]: {
      labelKey: "vendor.reviews.status.approved" as const,
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
      dotClassName: "bg-emerald-500",
    },
    [ReviewStatus.Rejected]: {
      labelKey: "vendor.reviews.status.rejected" as const,
      icon: AlertCircle,
      className: "bg-red-50 text-red-700 border-red-100",
      dotClassName: "bg-red-500",
    },
    [ReviewStatus.Pending]: {
      labelKey: "vendor.reviews.status.pending" as const,
      icon: Clock3,
      className: "bg-amber-50 text-amber-700 border-amber-100",
      dotClassName: "bg-amber-500",
    },
  };
  return configs[status] || configs[ReviewStatus.Pending];
}

export function getRatingLabelKey(rating: number): TranslationKey {
  const keys: Record<number, TranslationKey> = {
    5: "vendor.reviews.rating.excellent",
    4: "vendor.reviews.rating.veryGood",
    3: "vendor.reviews.rating.average",
    2: "vendor.reviews.rating.belowAverage",
    1: "vendor.reviews.rating.poor",
  };

  return keys[rating] ?? "vendor.reviews.rating.notRated";
}

export function getTimeAgo(date: string, t: TFn, language: Language): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return t("vendor.reviews.timeAgo.justNow");
  if (minutes < 60) return t("vendor.reviews.timeAgo.minutes", { count: minutes });
  if (hours < 24) return t("vendor.reviews.timeAgo.hours", { count: hours });
  if (days < 7) return t("vendor.reviews.timeAgo.days", { count: days });

  return formatDate(date, LANGUAGE_DATE_LOCALE[language]);
}
