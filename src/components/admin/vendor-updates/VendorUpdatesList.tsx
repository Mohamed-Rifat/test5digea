"use client";

import Link from "next/link";
import { Check, ChevronDown, Loader2, ArrowUpRight, X } from "lucide-react";
import {
  getDiffRows,
  ROW_LABEL_KEYS,
  VendorChangesDiff,
} from "@/components/admin/VendorChangesReview";
import { formatDateTime } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorUpdatesState } from "./useVendorUpdates";

/** Expandable list of vendors with pending changes. */
export function VendorUpdatesList({
  updates,
}: {
  updates: VendorUpdatesState;
}) {
  const { t } = useLanguage();
  const {
    dateLocale,
    expandedId,
    setExpandedId,
    busy,
    setRejectTarget,
    setRejectReason,
    handleApprove,
    vendors,
  } = updates;

  return (
    <>
      {vendors.length > 0 && (
        <div className="space-y-3">
          {vendors.map((vendor) => {
            const rows = getDiffRows(vendor);
            const expanded = expandedId === vendor.id;
            const isBusy = busy?.id === vendor.id;

            return (
              <section
                key={vendor.id}
                className="overflow-hidden rounded-2xl border border-[#eee7e1] bg-white shadow-[0_8px_30px_rgba(48,37,31,0.04)]"
              >
                <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    {vendor.profileImageUrl ? (
                      <img
                        loading="lazy"
                        decoding="async"
                        src={vendor.profileImageUrl}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f1ebe7] text-lg font-semibold text-[#806d60]">
                        {vendor.businessName?.charAt(0)?.toUpperCase() || "V"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#30251f] sm:text-base">
                        {vendor.businessName ||
                          t("admin.vendorDetails.unnamed")}
                      </p>

                      <p className="mt-0.5 text-xs text-[#9b8f86]">
                        {t("admin.vendorUpdates.lastEdited", {
                          date: formatDateTime(vendor.updatedAt, dateLocale),
                        })}
                      </p>

                      <div
                        className="mt-2 flex flex-wrap gap-1.5"
                        aria-label={t("admin.vendorUpdates.fieldsChanged")}
                      >
                        {rows.map((row) => (
                          <span
                            key={row}
                            className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700"
                          >
                            {t(ROW_LABEL_KEYS[row])}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/vendors/${vendor.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#8b7464] transition hover:bg-[#faf7f4]"
                    >
                      {t("admin.vendorUpdates.openProfile")}
                      <ArrowUpRight size={13} className="rtl:-scale-x-100" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : vendor.id)}
                      aria-expanded={expanded}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#e4dbd0] bg-white px-3 py-2 text-xs font-semibold text-[#30251f] transition hover:bg-[#faf7f4]"
                    >
                      {expanded
                        ? t("admin.vendorUpdates.hideChanges")
                        : t("admin.vendorUpdates.reviewChanges")}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRejectReason("");
                        setRejectTarget(vendor);
                      }}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      <X size={14} />
                      {t("admin.vendorDetails.review.reject")}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApprove(vendor)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {isBusy && busy?.action === "approve" ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Check size={14} />
                      )}
                      {t("admin.vendorDetails.review.approve")}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-[#f1ebe6] bg-[#fdfcfb]">
                    <VendorChangesDiff vendor={vendor} rows={rows} />
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
