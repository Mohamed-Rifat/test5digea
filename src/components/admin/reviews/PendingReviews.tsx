"use client";

import { RequiredLabel, TextAreaField } from "@/components/ui";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import {
  Loader2,
  Store,
  X,
  AlertCircle,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Chip } from "@mui/material";
import { useAdminReviews } from "@/features/reviews/hooks/useAdminReviews";
import type { Review } from "@/types/review";

import { PendingReviewsSkeleton } from "@/components/admin/reviews/AdminReviewsSkeletons";
import { PendingReviewCard } from "@/components/admin/reviews/PendingReviewCard";

export function PendingReviews() {
  const { t } = useLanguage();
  const { reviews, loading, error, actionLoading, approve, reject } =
    useAdminReviews();

  const [rejectTarget, setRejectTarget] = useState<Review | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;

    const ok = await reject(rejectTarget.id, { reason: rejectReason.trim() });

    if (ok) {
      setRejectTarget(null);
      setRejectReason("");
    }
  };

  if (loading) {
    return <PendingReviewsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
        <div>
          <p className="text-sm font-semibold text-red-800">
            {t("admin.reviews.loadFailed")}
          </p>
          <p className="mt-0.5 text-xs text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-4 py-10 text-center sm:px-6 sm:py-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 sm:h-14 sm:w-14">
          <CheckCircle2 size={24} strokeWidth={1.8} />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-[#30251f] sm:mt-4 sm:text-base">
          {t("admin.reviews.allCaughtUp")}
        </h3>
        <p className="mx-auto mt-1 max-w-md text-xs text-[#756b65] sm:mt-2 sm:text-sm">
          {t("admin.reviews.noPending")}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-[#9b8f86] sm:text-sm">
          <span className="font-semibold text-[#30251f]">{reviews.length}</span>{" "}
          {reviews.length === 1
            ? t("admin.reviews.pendingOne", { count: reviews.length })
            : t("admin.reviews.pendingMany", { count: reviews.length })}
        </p>

        <Chip
          icon={<Clock3 size={12} />}
          label={t("admin.reviews.pending")}
          size="small"
          sx={{
            height: 24,
            fontSize: "10px",
            fontWeight: 600,
            backgroundColor: "#fef3c7",
            color: "#b45309",
            "& .MuiChip-icon": { color: "#b45309" },
          }}
        />
      </div>

      <div className="space-y-3">
        {reviews.map((review) => {
          const isApproving = actionLoading === `approve-${review.id}`;
          const isRejecting = actionLoading === `reject-${review.id}`;

          return (
            <PendingReviewCard
              key={review.id}
              review={review}
              onApprove={() => approve(review.id)}
              onReject={() => {
                setRejectTarget(review);
                setRejectReason("");
              }}
              isApproving={isApproving}
              isRejecting={isRejecting}
            />
          );
        })}
      </div>

      {rejectTarget && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-2 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4"
          onClick={() => setRejectTarget(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in slide-in-from-bottom-10 duration-300 sm:zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#f0eae5] bg-linear-to-br from-red-50 to-white px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  <XCircle size={18} className="text-red-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#30251f] sm:text-lg">
                    {t("admin.reviews.rejectTitle")}
                  </h2>
                  <p className="mt-0.5 text-xs text-[#9b8f86] sm:text-sm">
                    {t("admin.reviews.reasonRequired")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#9b8f86] transition hover:bg-white hover:text-[#30251f]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4 sm:px-6 sm:py-5">
              <div className="rounded-xl border border-[#f0eae5] bg-[#fcfaf8] p-3.5">
                <p className="text-sm font-semibold text-[#30251f]">
                  {rejectTarget.serviceName}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#756b65]">
                  <Store size={11} />
                  {rejectTarget.vendorBusinessName}
                </p>
              </div>

              <TextAreaField
                id="review-reject-reason"
                label={<RequiredLabel text={t("admin.reviews.rejectionReason")} />}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={t("admin.reviews.reasonPlaceholder")}
                rows={4}
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#f0eae5] bg-[#fcfaf8] px-5 py-3.5 sm:gap-3 sm:px-6 sm:py-4">
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="rounded-xl border border-[#e3d9d1] bg-white px-4 py-2.5 text-xs font-medium text-[#514740] transition hover:bg-[#f7f2ef] sm:text-sm"
              >
                {t("admin.reviews.cancel")}
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectReason.trim() || Boolean(actionLoading)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                {actionLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {t("admin.reviews.rejecting")}
                  </>
                ) : (
                  <>
                    <X size={14} />
                    {t("admin.reviews.rejectTitle")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
