"use client";

import { useLanguage } from "@/context/LanguageContext";
import { normalizeStatus } from "./utils";

export default function StatusBadge({ status }: { status?: string }) {
  const { t } = useLanguage();
  const normalized = normalizeStatus(status);

  let classes = "border-gray-200 bg-gray-50 text-gray-600";

  if (normalized.includes("approve")) {
    classes = "border-emerald-200 bg-emerald-50 text-emerald-700";
  } else if (normalized.includes("pending")) {
    classes = "border-amber-200 bg-amber-50 text-amber-700";
  } else if (normalized.includes("reject")) {
    classes = "border-red-200 bg-red-50 text-red-700";
  } else if (normalized.includes("inactive") || normalized.includes("deactiv")) {
    classes = "border-gray-200 bg-gray-100 text-gray-600";
  }

  return (
    <span className={`rounded-full border px-2 py-1 text-[8px] font-semibold ${classes}`}>
      {normalized.includes("approve")
        ? t("admin.dashboard.approved")
        : normalized.includes("pending")
          ? t("admin.dashboard.pending")
          : normalized.includes("reject")
            ? t("admin.dashboard.rejected")
            : normalized.includes("inactive") || normalized.includes("deactiv")
              ? t("admin.dashboard.inactive")
              : status || t("admin.dashboard.unknown")}
    </span>
  );
}
