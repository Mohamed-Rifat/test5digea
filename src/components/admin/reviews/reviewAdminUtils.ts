import { Eye, EyeOff, Filter } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { TranslationKey } from "@/locales";

export const VISIBILITY_FILTERS = [
  { value: "all", labelKey: "admin.reviews.allVisibility", icon: Filter },
  { value: "visible", labelKey: "admin.reviews.visibleOnly", icon: Eye },
  { value: "hidden", labelKey: "admin.reviews.hiddenOnly", icon: EyeOff },
] as const;

export function getTimeAgo(
  date: string,
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
  locale: string,
): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return t("vendor.reviews.timeAgo.justNow");
  if (minutes < 60)
    return t("vendor.reviews.timeAgo.minutes", { count: minutes });
  if (hours < 24) return t("vendor.reviews.timeAgo.hours", { count: hours });
  if (days < 7) return t("vendor.reviews.timeAgo.days", { count: days });
  return formatDate(date, locale);
}
