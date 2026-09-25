"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { AlertCircle, User, Eye, EyeOff } from "lucide-react";
import { Tooltip } from "@mui/material";
import RatingStars from "@/components/shared/RatingStars";
import { formatDate } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import { ReviewStatus } from "@/types/review";
import type { Review } from "@/types/review";

import { StatusBadge } from "@/components/vendor/reviews/ReviewBits";
import { getRatingLabelKey, getTimeAgo } from "@/components/vendor/reviews/reviewUtils";

export const ReviewCard = memo(function ReviewCard({
  review,
  index,
  onViewDetails,
}: {
  review: Review;
  index: number;
  onViewDetails?: (review: Review) => void;
}) {
  const { t, language } = useLanguage();
  const ratingLabel = t(getRatingLabelKey(review.rating));
  const timeAgo = getTimeAgo(review.createdAt, t, language);
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = review.comment && review.comment.length > 150;
  const displayComment = shouldTruncate && !isExpanded
    ? review.comment.slice(0, 150) + "..."
    : review.comment;

  // ✅ تحديد لون الـ border حسب الحالة
  const getCardBorderClass = () => {
    if (review.status !== ReviewStatus.Approved) {
      return "border-[#eee7e1]"; // محايد للـ Pending و Rejected
    }
    return review.isDisplayed
      ? "border-emerald-300 hover:border-emerald-400" // ✅ أخضر للـ Visible
      : "border-red-300 hover:border-red-400"; // ❌ أحمر للـ Hidden
  };

  return (
    <article
      className={`group relative border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${getCardBorderClass()}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* ✅ شريط علوي ملون حسب الحالة */}
      {review.status === ReviewStatus.Approved && (
        <div
          className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl ${
            review.isDisplayed ? "bg-emerald-400" : "bg-red-400"
          }`}
        />
      )}

      {/* Top Section */}
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 flex-1 gap-2 sm:gap-3">
          <div
            className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${
              review.status === ReviewStatus.Approved
                ? review.isDisplayed
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
                : "bg-[#f5eee9] text-[#705b4e]"
            }`}
          >
            <User size={15} strokeWidth={1.8} className="sm:h-4.25 sm:w-4.25" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <p className="truncate text-xs font-semibold text-[#30251f] sm:text-sm">
                {review.userFullName || t("vendor.reviews.card.anonymous")}
              </p>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <p className="text-[10px] text-[#a39891] sm:text-[11px]">{t("vendor.reviews.card.customer")}</p>
              <span className="hidden h-1 w-1 rounded-full bg-[#d5c8be] sm:inline" />
              <p className="text-[10px] text-[#a39891] sm:text-[11px]">{timeAgo}</p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* ✅ Visibility Badge واضح */}
          {review.status === ReviewStatus.Approved && (
            <Tooltip
              title={review.isDisplayed ? t("vendor.reviews.card.visibleTooltip") : t("vendor.reviews.card.hiddenTooltip")}
              arrow
            >
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.04em] rtl:tracking-normal sm:gap-1.5 sm:px-2.5 sm:text-[10px] ${
                  review.isDisplayed
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {review.isDisplayed ? (
                  <>
                    <Eye size={11} strokeWidth={2.3} />
                    <span className="hidden xs:inline">{t("vendor.reviews.card.visible")}</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={11} strokeWidth={2.3} />
                    <span className="hidden xs:inline">{t("vendor.reviews.card.hidden")}</span>
                  </>
                )}
              </span>
            </Tooltip>
          )}
          <StatusBadge status={review.status} />
        </div>
      </div>

      {/* Service Info */}
      <div className="mt-3 rounded-xl border border-[#f0eae5] bg-[#fcfaf8] p-2.5 sm:mt-5 sm:p-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 text-[9px] font-medium uppercase tracking-[0.08em] rtl:tracking-normal text-[#a39891] sm:mb-1 sm:text-[10px]">
              {t("vendor.reviews.card.service")}
            </p>

            <Link
              href={`/vendor/services/${review.serviceId}`}
              className="block truncate text-xs font-semibold text-[#4a3c34] transition-colors hover:text-[#a47e43] sm:text-sm"
            >
              {review.serviceName}
            </Link>
          </div>

          <div className="shrink-0 rounded-lg bg-white px-2 py-1.5 shadow-sm sm:px-2.5 sm:py-2">
            <RatingStars rating={review.rating} size={11} />
            <p className="mt-0.5 text-center text-[8px] font-medium text-[#a39891] sm:text-[9px]">
              {ratingLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Comment */}
      {review.comment ? (
        <div className="mt-3 sm:mt-5">
          <p className="whitespace-pre-line text-xs leading-6 text-[#5f544d] sm:text-sm sm:leading-7">
            {displayComment}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1.5 text-[10px] font-semibold text-[#a47e43] hover:text-[#8b6d55] transition-colors sm:mt-2 sm:text-xs"
            >
              {isExpanded ? t("vendor.reviews.card.showLess") : t("vendor.reviews.card.readMore")}
            </button>
          )}
        </div>
      ) : (
        <p className="mt-3 text-xs italic text-[#aaa19b] sm:mt-5 sm:text-sm">
          {t("vendor.reviews.card.noComment")}
        </p>
      )}

      {/* Rejection Reason */}
      {review.status === ReviewStatus.Rejected && review.rejectionReason && (
        <div className="mt-3 rounded-xl border border-red-100 bg-red-50/70 p-2.5 sm:mt-5 sm:p-3.5">
          <div className="flex gap-2 sm:gap-2.5">
            <AlertCircle size={13} className="mt-0.5 shrink-0 text-red-500 sm:h-3.75 sm:w-3.75" />
            <div>
              <p className="text-[10px] font-semibold text-red-700 sm:text-xs">
                {t("vendor.reviews.card.moderationFeedback")}
              </p>
              <p className="mt-0.5 text-[10px] leading-4 text-red-600 sm:mt-1 sm:text-xs sm:leading-5">
                {review.rejectionReason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#f1ece8] pt-3 sm:mt-5 sm:gap-3 sm:pt-4">
        <p className="text-[10px] text-[#aaa19b] sm:text-[11px]">
          {formatDate(review.createdAt, LANGUAGE_DATE_LOCALE[language])}
        </p>

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(review)}
            className="text-[10px] font-medium text-[#8b6d55] hover:text-[#30251f] transition-colors sm:text-xs"
          >
            {t("vendor.reviews.card.view")}
          </button>
        )}
      </div>
    </article>
  );
});

ReviewCard.displayName = "ReviewCard";
