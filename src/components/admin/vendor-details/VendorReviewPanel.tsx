"use client";

import { Check, Clock3, Loader2, X } from "lucide-react";
import { VendorChangesDiff } from "@/components/admin/VendorChangesReview";
import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";

import type { AdminVendorDetails } from "./useAdminVendorDetails";

/** Pending profile changes / new vendor review with approve & reject. */
export function VendorReviewPanel({
  vendor,
  details,
}: {
  vendor: Vendor;
  details: AdminVendorDetails;
}) {
  const { t } = useLanguage();
  const {
    reviewAction,
    setRejectOpen,
    setRejectReason,
    diffRows,
    hasPendingChanges,
    needsReview,
    handleApprove,
    isBusy,
  } = details;

  return (
    <>
      {needsReview && (
        <section className="mb-5 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-[0_8px_30px_rgba(180,120,20,0.08)]">
          <div className="flex flex-col gap-4 border-b border-amber-100 bg-amber-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Clock3 size={18} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#30251f]">
                  {hasPendingChanges
                    ? t("admin.vendorDetails.review.pendingTitle")
                    : t("admin.vendorDetails.review.newVendorTitle")}
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#7a6b5f]">
                  {hasPendingChanges
                    ? t("admin.vendorDetails.review.pendingText", {
                        name:
                          vendor.businessName ||
                          t("admin.vendorDetails.unnamed"),
                      })
                    : t("admin.vendorDetails.review.newVendorText")}
                </p>

                {hasPendingChanges && (
                  <p className="mt-1.5 text-xs font-semibold text-amber-700">
                    {diffRows.length === 1
                      ? t("admin.vendorDetails.review.changedOne")
                      : t("admin.vendorDetails.review.changedCount", {
                          count: diffRows.length,
                        })}
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setRejectReason("");
                  setRejectOpen(true);
                }}
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={16} />
                {hasPendingChanges
                  ? t("admin.vendorDetails.review.rejectChanges")
                  : t("admin.vendorDetails.review.reject")}
              </button>

              <button
                type="button"
                onClick={handleApprove}
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {reviewAction === "approve" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                {reviewAction === "approve"
                  ? t("admin.vendorDetails.review.working")
                  : hasPendingChanges
                    ? t("admin.vendorDetails.review.approveChanges")
                    : t("admin.vendorDetails.review.approve")}
              </button>
            </div>
          </div>

          {/* Field-by-field diff */}
          {hasPendingChanges && (
            <VendorChangesDiff vendor={vendor} rows={diffRows} />
          )}
        </section>
      )}
    </>
  );
}
