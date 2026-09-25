"use client";

import { useLanguage } from "@/context/LanguageContext";
import { statusConfig } from "@/components/vendor/dashboard/dashboardConfig";

import type { Vendor } from "@/types/vendor";

/** Pending / rejected notice for vendors that aren't approved yet. */
export function VendorStatusAlert({ vendor }: { vendor: Vendor }) {
  const { t } = useLanguage();

  if (vendor.status === "Approved") return null;

  const status = statusConfig[vendor.status] ?? statusConfig.Pending;
  const StatusIcon = status.icon;

  return (
    <div className="mb-6 rounded-2xl border border-[#e8ddd5] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${vendor.status === "Rejected" ? "bg-red-50" : "bg-amber-50"}`}
        >
          <StatusIcon
            className={`h-4 w-4 sm:h-5 sm:w-5 ${vendor.status === "Rejected" ? "text-red-500" : "text-amber-600"}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
            {vendor.status === "Rejected"
              ? t("vendor.dashboard.alert.rejectedTitle")
              : t("vendor.dashboard.alert.pendingTitle")}
          </h2>
          <p className="mt-0.5 text-xs leading-5 text-[#756b65] sm:mt-1 sm:text-sm sm:leading-6">
            {vendor.status === "Rejected"
              ? vendor.rejectionReason ||
                t("vendor.dashboard.alert.rejectedDefault")
              : t("vendor.dashboard.alert.pendingText")}
          </p>
        </div>
      </div>
    </div>
  );
}
