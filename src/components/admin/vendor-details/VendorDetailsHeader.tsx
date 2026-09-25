"use client";

import { Clock3, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";

import type { AdminVendorDetails } from "./useAdminVendorDetails";
import { STATUS_STYLES, STATUS_KEYS } from "./vendorDetailBits";

/** Avatar, name, status and dates. */
export function VendorDetailsHeader({
  vendor,
  details,
}: {
  vendor: Vendor;
  details: AdminVendorDetails;
}) {
  const { t } = useLanguage();
  const { hasPendingChanges } = details;

  return (
    <section className="rounded-2xl border border-[#e9e1dc] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.04)] sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {vendor.profileImageUrl ? (
            <img
              loading="lazy"
              decoding="async"
              src={vendor.profileImageUrl}
              alt={vendor.businessName || t("admin.vendorDetails.unnamed")}
              className="h-20 w-20 shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#f1ebe7] text-xl font-semibold text-[#806d60]">
              {vendor.businessName?.charAt(0)?.toUpperCase() || "V"}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-semibold tracking-tight rtl:tracking-normal text-[#30251f] sm:text-2xl">
                {vendor.businessName || t("admin.vendorDetails.unnamed")}
              </h1>

              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[vendor.status]}`}
              >
                {t(STATUS_KEYS[vendor.status])}
              </span>

              {hasPendingChanges && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                  <Clock3 size={12} />
                  {t("admin.vendorDetails.review.pendingTitle")}
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-[#766b65]">
              {vendor.slogan || t("admin.vendorDetails.noSlogan")}
            </p>

            <p className="mt-2 text-xs text-[#9b918b]">
              {t("admin.vendorDetails.vendorId", { id: vendor.id })}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-xl bg-[#f8f5f3] px-4 py-3">
          <Star size={17} className="fill-current text-[#b08b55]" />

          <span className="text-sm font-semibold text-[#403630]">
            {Number(vendor.averageRating || 0).toFixed(1)}
          </span>

          <span className="text-xs text-[#9b918b]">
            {t("admin.vendorDetails.reviewsCount", {
              count: vendor.reviewsCount || 0,
            })}
          </span>
        </div>
      </div>
    </section>
  );
}
