"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Clock3, CheckCircle2, XCircle, X, MessageSquareQuote } from "lucide-react";

import RatingStars from "@/components/shared/RatingStars";
import { useLanguage } from "@/context/LanguageContext";
import { formatDate } from "@/lib/format";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import { ReviewStatus } from "@/types/review";
import type { MyReview } from "@/features/reviews/hooks/useMyReviews";

/** Read-only view of a review the couple already wrote. */
export default function ViewReviewModal({
  review,
  onClose,
}: {
  review: MyReview;
  onClose: () => void;
}) {
  const { t, language } = useLanguage();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hasDetails = typeof review.rating === "number" && review.rating > 0;
  const status =
    review.status === ReviewStatus.Approved
      ? { label: t("reviews.mine.statusApproved"), Icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" }
      : review.status === ReviewStatus.Rejected
        ? { label: t("reviews.mine.statusRejected"), Icon: XCircle, cls: "bg-red-50 text-red-600 ring-red-200" }
        : { label: t("reviews.mine.statusPending"), Icon: Clock3, cls: "bg-amber-50 text-amber-700 ring-amber-200" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm animate-fade-in">
      <button
        type="button"
        aria-label={t("common.close")}
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-review-title"
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-dialog-in"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#f0e9e0] px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7eee5] text-[#a9773c]">
              <MessageSquareQuote size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 id="view-review-title" className="text-lg font-bold text-[#30251f]">
                {t("reviews.mine.title")}
              </h2>
              <p className="truncate text-sm text-[#8b7e76]">
                {[review.serviceName, review.vendorBusinessName].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#9b8f86] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {typeof review.rating === "number" && review.rating > 0 ? (
              <RatingStars rating={review.rating} size={18} />
            ) : (
              <span />
            )}
            {review.status !== undefined && (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${status.cls}`}>
                <status.Icon size={13} aria-hidden="true" />
                {status.label}
              </span>
            )}
          </div>

          {!hasDetails && (
            <p className="rounded-2xl bg-[#faf7f4] p-4 text-sm leading-relaxed text-[#5f544d]">
              {t("reviews.mine.alreadyToast")}
            </p>
          )}

          {hasDetails && (
            <p dir="auto" className="whitespace-pre-line rounded-2xl bg-[#faf7f4] p-4 text-start text-sm leading-relaxed text-[#5f544d]">
              {review.comment?.trim() || t("reviews.mine.noComment")}
            </p>
          )}

          {review.status === ReviewStatus.Rejected && review.rejectionReason && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {t("reviews.mine.reason", { reason: review.rejectionReason })}
            </p>
          )}

          {review.createdAt && (
            <p className="text-xs text-[#9b8f86]">
              {t("reviews.mine.reviewedOn", {
                date: formatDate(review.createdAt, LANGUAGE_DATE_LOCALE[language]),
              })}
            </p>
          )}

          <p className="rounded-xl bg-[#fdf6ec] px-4 py-3 text-sm text-[#8c6a3c]">
            {t("reviews.mine.onceNote")}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#f0e9e0] px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-[#e4dbd0] px-5 text-sm font-semibold text-[#5f544d] transition hover:border-[#b99a62]"
          >
            {t("common.close")}
          </button>
          <Link
            href={`/services/${review.serviceId}`}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#30251f] px-5 text-sm font-semibold text-white transition hover:bg-[#46382f]"
          >
            {t("reviews.mine.viewService")}
          </Link>
        </div>
      </div>
    </div>
  );
}
