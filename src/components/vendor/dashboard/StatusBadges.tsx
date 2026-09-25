"use client";

import { ReviewStatus } from "@/types/review";
import { useLanguage } from "@/context/LanguageContext";

export const ServiceStatus = ({ status }: { status: string }) => {
  const { t } = useLanguage();

  const config: Record<string, { label: string; className: string }> = {
    Approved: {
      label: `✅ ${t("vendor.dashboard.itemStatus.approved")}`,
      className: "bg-emerald-50 text-emerald-700",
    },
    Pending: {
      label: `⏳ ${t("vendor.dashboard.itemStatus.pending")}`,
      className: "bg-amber-50 text-amber-700",
    },
    Rejected: {
      label: `❌ ${t("vendor.dashboard.itemStatus.rejected")}`,
      className: "bg-red-50 text-red-700",
    },
    Inactive: {
      label: `⚪ ${t("vendor.dashboard.itemStatus.inactive")}`,
      className: "bg-gray-100 text-gray-700",
    },
  };

  const current = config[status] ?? config.Pending;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs ${current.className}`}
    >
      {current.label}
    </span>
  );
};

export const ReviewStatusBadge = ({ status }: { status: ReviewStatus }) => {
  const { t } = useLanguage();

  const config = {
    [ReviewStatus.Approved]: {
      label: `✅ ${t("vendor.dashboard.itemStatus.approved")}`,
      className: "bg-emerald-50 text-emerald-700",
    },
    [ReviewStatus.Pending]: {
      label: `⏳ ${t("vendor.dashboard.itemStatus.pending")}`,
      className: "bg-amber-50 text-amber-700",
    },
    [ReviewStatus.Rejected]: {
      label: `❌ ${t("vendor.dashboard.itemStatus.rejected")}`,
      className: "bg-red-50 text-red-700",
    },
  };

  const current = config[status] ?? config[ReviewStatus.Pending];

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${current.className}`}
    >
      {current.label}
    </span>
  );
};
