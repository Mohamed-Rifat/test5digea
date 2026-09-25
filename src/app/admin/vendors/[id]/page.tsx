"use client";

import { use } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { RejectReasonDialog } from "@/components/admin/VendorChangesReview";
import { VendorAboutSection } from "@/components/admin/vendor-details/VendorAboutSection";
import { VendorCategoriesSection } from "@/components/admin/vendor-details/VendorCategoriesSection";
import { VendorDetailsHeader } from "@/components/admin/vendor-details/VendorDetailsHeader";
import { VendorInfoSections } from "@/components/admin/vendor-details/VendorInfoSections";
import { VendorReviewPanel } from "@/components/admin/vendor-details/VendorReviewPanel";
import { useAdminVendorDetails } from "@/components/admin/vendor-details/useAdminVendorDetails";
import { useLanguage } from "@/context/LanguageContext";

import { DetailsSkeleton } from "@/components/admin/vendor-details/vendorDetailBits";

export default function AdminVendorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLanguage();
  const details = useAdminVendorDetails(id);
  const { vendor, error, reviewMessage, hasPendingChanges } = details;

  if (details.loading) {
    return <DetailsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#faf8f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <Link
          href="/admin/vendors"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#766b65] transition hover:text-[#30251f]"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {t("admin.vendorDetails.back")}
        </Link>

        {error || !vendor ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">
                  {t("admin.vendorDetails.unableTitle")}
                </p>
                <p className="mt-1 text-sm">
                  {error || t("admin.vendorDetails.notFound")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {reviewMessage && (
              <div
                role="status"
                className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
                  reviewMessage.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {reviewMessage.type === "success" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {reviewMessage.text}
              </div>
            )}

            <VendorReviewPanel vendor={vendor} details={details} />
            <VendorDetailsHeader vendor={vendor} details={details} />
            <VendorInfoSections vendor={vendor} details={details} />
            <VendorAboutSection vendor={vendor} details={details} />
            <VendorCategoriesSection vendor={vendor} details={details} />

            <RejectReasonDialog
              open={details.rejectOpen}
              title={
                hasPendingChanges
                  ? t("admin.vendorDetails.review.modal.title")
                  : t("admin.vendorDetails.review.modal.titleNew")
              }
              reason={details.rejectReason}
              onReasonChange={details.setRejectReason}
              loading={details.reviewAction === "reject"}
              onCancel={() => details.setRejectOpen(false)}
              onConfirm={details.handleReject}
            />
          </>
        )}
      </div>
    </div>
  );
}
