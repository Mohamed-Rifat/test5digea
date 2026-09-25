"use client";

import { Building2, Eye, EyeOff, Loader2, Store } from "lucide-react";
import { Chip, Tooltip } from "@mui/material";

import { useLanguage } from "@/context/LanguageContext";
import RatingStars from "@/components/shared/RatingStars";
import { LANGUAGE_DATE_LOCALE } from "@/locales";
import type { Review } from "@/types/review";
import { getTimeAgo } from "./reviewAdminUtils";

interface ApprovedReviewItemProps {
  review: Review;
  isBusy: boolean;
  onToggle: (review: Review) => void;
}

/** One approved review with a show / hide toggle. */
export function ApprovedReviewItem({
  review,
  isBusy,
  onToggle,
}: ApprovedReviewItemProps) {
  const { t, language } = useLanguage();

  return (
    <div
      className={`group rounded-xl border-2 bg-white p-3.5 transition-all hover:shadow-sm sm:p-4 ${
        review.isDisplayed
          ? "border-emerald-200 hover:border-emerald-300"
          : "border-red-200 hover:border-red-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Vendor first, then service below it */}
          <div className="mb-1.5 space-y-1">
            {review.vendorBusinessName && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#40352f] sm:text-xs">
                <Building2 size={11} className="shrink-0 text-[#a47e43]" />
                <span className="truncate">{review.vendorBusinessName}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[10px] text-[#9b8f86] sm:text-[11px]">
              <Store size={10} className="shrink-0 text-[#a47e43]" />
              <span className="truncate">{review.serviceName}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[#30251f]">
              {review.userFullName || t("admin.reviews.anonymous")}
            </p>
            <RatingStars rating={review.rating} size={12} />
            <Chip
              icon={
                review.isDisplayed ? <Eye size={10} /> : <EyeOff size={10} />
              }
              label={
                review.isDisplayed
                  ? t("admin.reviews.visible")
                  : t("admin.reviews.hidden")
              }
              size="small"
              sx={{
                height: 20,
                fontSize: "9px",
                fontWeight: 600,
                backgroundColor: review.isDisplayed ? "#ecfdf5" : "#fef2f2",
                color: review.isDisplayed ? "#047857" : "#b91c1c",
                "& .MuiChip-icon": {
                  color: review.isDisplayed ? "#047857" : "#b91c1c",
                },
              }}
            />
          </div>

          {review.comment && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#625852] sm:text-sm">
              {review.comment}
            </p>
          )}

          <p className="mt-1 text-[10px] text-[#9b8f86]">
            {getTimeAgo(review.createdAt, t, LANGUAGE_DATE_LOCALE[language])}
          </p>
        </div>

        <Tooltip
          title={
            review.isDisplayed
              ? t("admin.reviews.hide")
              : t("admin.reviews.show")
          }
          arrow
        >
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onToggle(review)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition disabled:opacity-50 ${
              review.isDisplayed
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            {isBusy ? (
              <Loader2 size={16} className="animate-spin" />
            ) : review.isDisplayed ? (
              <Eye size={16} />
            ) : (
              <EyeOff size={16} />
            )}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
