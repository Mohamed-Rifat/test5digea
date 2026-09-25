"use client";

import { AlertCircle, ChevronDown, RefreshCw } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Review } from "@/types/review";
import { EmptyState, ReviewSkeleton } from "./ReviewBits";
import { ReviewCard } from "./VendorReviewCard";

interface ReviewsResultsProps {
  loading: boolean;
  error: string | null;
  total: number;
  filteredCount: number;
  displayedReviews: Review[];
  hasMore: boolean;
  onRefresh: () => void;
  onClearFilters: () => void;
  onLoadMore: () => void;
  onView: (review: Review) => void;
}

export function ReviewsResults({
  loading,
  error,
  total,
  filteredCount,
  displayedReviews,
  hasMore,
  onRefresh,
  onClearFilters,
  onLoadMore,
  onView,
}: ReviewsResultsProps) {
  const { t } = useLanguage();

  return (
    <section aria-label={t("vendor.reviews.listAria")} className="mt-4 sm:mt-6 lg:mt-8">
      {loading && <ReviewSkeleton count={3} />}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center sm:p-8">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm sm:h-12 sm:w-12">
            <AlertCircle size={18} className="sm:h-5.25 sm:w-5.25" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-red-800 sm:mt-4">{t("vendor.reviews.error.title")}</h3>
          <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-red-600 sm:mt-2">{error}</p>
          <button
            onClick={onRefresh}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-100 px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors sm:mt-4 sm:px-4 sm:py-2"
          >
            <RefreshCw size={14} />
            {t("vendor.reviews.error.tryAgain")}
          </button>
        </div>
      )}

      {!loading && !error && total === 0 && (
        <EmptyState filtered={false} />
      )}

      {!loading && !error && total > 0 && filteredCount === 0 && (
        <EmptyState filtered onClear={onClearFilters} />
      )}

      {!loading && !error && displayedReviews.length > 0 && (
        <>
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <div>
              <h3 className="text-xs font-semibold text-[#40342e] sm:text-sm">
                {t("vendor.reviews.feedback")}
              </h3>
              <p className="mt-0.5 text-[10px] text-[#9b8f86] sm:text-xs">
                {t("vendor.reviews.showing", { shown: displayedReviews.length, total: filteredCount })}
              </p>
            </div>

            {/* ✅ Legend للـ Visibility */}
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-[#9b8f86]">{t("vendor.reviews.card.visible")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="text-[10px] text-[#9b8f86]">{t("vendor.reviews.card.hidden")}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {displayedReviews.map((review, index) => (
              <ReviewCard
                key={review.id}
                review={review}
                index={index}
                onViewDetails={onView}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-4 text-center sm:mt-6">
              <button
                onClick={onLoadMore}
                className="inline-flex items-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 py-2 text-xs font-medium text-[#665950] transition-all hover:border-[#cfc1b7] hover:bg-[#faf8f6] sm:px-6 sm:py-3 sm:text-sm"
              >
                {t("vendor.reviews.loadMore")}
                <ChevronDown size={14} className="sm:h-4 sm:w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
