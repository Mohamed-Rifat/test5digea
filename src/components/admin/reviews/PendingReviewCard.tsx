"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Check, Loader2, Store, X, Clock3, User } from "lucide-react";
import RatingStars from "@/components/shared/RatingStars";
import { LANGUAGE_DATE_LOCALE } from "@/locales";
import type { Review } from "@/types/review";

import { getTimeAgo } from "@/components/admin/reviews/reviewAdminUtils";

export const PendingReviewCard = ({
  review,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  review: Review;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
  isRejecting: boolean;
}) => {
  const { t, language } = useLanguage();
  const busy = isApproving || isRejecting;

  return (
    <div className="group rounded-2xl border border-amber-200 bg-linear-to-br from-white to-amber-50/40 p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <Clock3 size={16} className="text-amber-700" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-[#30251f] sm:text-base">
                {review.serviceName}
              </h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#756b65]">
                <Store size={11} />
                <span className="truncate">{review.vendorBusinessName}</span>
              </p>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#9b8f86]">
            <span className="inline-flex items-center gap-1">
              <User size={11} />
              {review.userFullName || t("admin.reviews.anonymous")}
            </span>
            <span className="h-1 w-1 rounded-full bg-[#d5c8be]" />
            <span>
              {getTimeAgo(review.createdAt, t, LANGUAGE_DATE_LOCALE[language])}
            </span>
          </div>
        </div>

        <div className="shrink-0 rounded-xl bg-white px-3 py-2 shadow-sm">
          <RatingStars rating={review.rating} size={14} />
        </div>
      </div>

      {review.comment && (
        <div className="mt-3 rounded-xl border border-amber-100 bg-white/80 p-3">
          <p className="whitespace-pre-line text-sm leading-6 text-[#5f544d]">
            {review.comment}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-amber-100 pt-3">
        <button
          type="button"
          disabled={busy}
          onClick={onReject}
          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
        >
          {isRejecting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <X size={14} />
          )}
          {t("admin.reviews.rejectLabel")}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={onApprove}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
        >
          {isApproving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Check size={14} />
          )}
          {t("admin.reviews.approveLabel")}
        </button>
      </div>
    </div>
  );
};
