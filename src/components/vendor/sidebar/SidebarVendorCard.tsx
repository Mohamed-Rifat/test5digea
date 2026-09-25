"use client";

import { Building2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorSidebarState } from "./useVendorSidebar";

/** Vendor avatar, name, status and quick stats. */
export function SidebarVendorCard({
  sidebar,
}: {
  sidebar: VendorSidebarState;
}) {
  const { t } = useLanguage();
  const {
    totalServices,
    totalReviews,
    pendingReviews,
    status,
    loading,
    vendor,
  } = sidebar;

  return (
    <div className="border-b border-[#eee7e1] px-4 py-4">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#f5eee9] to-[#e8dfd8]">
          {loading ? (
            <div className="h-full w-full animate-pulse bg-[#e8dfd8]" />
          ) : vendor?.profileImageUrl ? (
            <img
              loading="lazy"
              decoding="async"
              src={vendor.profileImageUrl}
              alt={vendor.businessName || t("vendor.header.vendor")}
              className="h-full w-full object-cover"
            />
          ) : (
            <Building2 size={22} className="text-[#8d7b70]" />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          {loading ? (
            <>
              <div className="h-4 w-28 animate-pulse rounded bg-[#eee7e1]" />

              <div className="mt-2 h-3 w-16 animate-pulse rounded bg-[#f3eeea]" />
            </>
          ) : (
            <>
              <p className="truncate text-sm font-semibold text-[#30251f]">
                {vendor?.businessName || t("vendor.sidebar.vendorAccount")}
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-flex h-1.5 w-1.5 rounded-full ${status.dotColor} animate-pulse`}
                />

                <span
                  className={`text-[10px] font-medium ${
                    vendor?.status === "Approved"
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }`}
                >
                  {status ? t(status.labelKey) : t("vendor.status.loading")}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {!loading && vendor && (
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <div className="rounded-lg bg-[#faf7f4] px-2 py-1.5 text-center">
            <p className="text-xs font-semibold text-[#30251f]">
              {totalServices}
            </p>

            <p className="text-[8px] text-[#9a8d84]">
              {t("vendor.sidebar.statServices")}
            </p>
          </div>

          <div className="rounded-lg bg-[#faf7f4] px-2 py-1.5 text-center">
            <p className="text-xs font-semibold text-[#30251f]">
              {totalReviews}
            </p>

            <p className="text-[8px] text-[#9a8d84]">
              {t("vendor.sidebar.statReviews")}
            </p>
          </div>

          <div className="rounded-lg bg-[#faf7f4] px-2 py-1.5 text-center">
            <p
              className={`text-xs font-semibold ${
                pendingReviews > 0 ? "text-amber-600" : "text-[#30251f]"
              }`}
            >
              {pendingReviews}
            </p>

            <p className="text-[8px] text-[#9a8d84]">
              {t("vendor.sidebar.statPending")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
