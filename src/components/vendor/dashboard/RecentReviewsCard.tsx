"use client";

import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import { useLanguage } from "@/context/LanguageContext";

import type { Review } from "@/types/review";
import { ReviewStatusBadge } from "./StatusBadges";

export function RecentReviewsCard({ reviews }: { reviews: Review[] }) {
  const { t, language } = useLanguage();

  return (
    <div className="rounded-3xl border border-[#e8dfd8] bg-white p-5 shadow-sm lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#30251f]">
            {t("vendor.dashboard.reviews.title")}
          </h3>
          <p className="text-xs text-[#9b8f86]">
            {t("vendor.dashboard.reviews.subtitle")}
          </p>
        </div>
        <Link
          href="/vendor/reviews"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#a47e43] hover:text-[#8b6d55]"
        >
          {t("vendor.dashboard.reviews.viewAll")}{" "}
          <ChevronRight size={14} className="rtl:rotate-180" />
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ded3cb] bg-[#fcfaf8] px-4 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f3ebe6]">
            <Star className="h-5 w-5 text-[#806b5e]" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-[#40352f]">
            {t("vendor.dashboard.reviews.emptyTitle")}
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-[#81746d]">
            {t("vendor.dashboard.reviews.emptyText")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-2 rounded-xl border border-[#f0eae5] bg-[#fcfaf8] p-3 transition hover:border-[#e3d9d1] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-[#30251f] text-sm">
                    {review.userFullName ||
                      t("vendor.dashboard.reviews.anonymous")}
                  </span>
                  <span className="text-[10px] text-[#9b8f86]">
                    {new Date(review.createdAt).toLocaleDateString(
                      LANGUAGE_DATE_LOCALE[language],
                    )}
                  </span>
                  <ReviewStatusBadge status={review.status} />
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-amber-500 text-sm">
                    {"⭐".repeat(Math.round(review.rating))}
                  </span>
                  <span className="text-xs text-[#9b8f86]">
                    {review.rating}/5
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-1 truncate text-xs text-[#625852]">
                    {review.comment}
                  </p>
                )}
              </div>
              <Link
                href={`/vendor/reviews?review=${encodeURIComponent(review.id)}`}
                className="text-xs font-medium text-[#a47e43] hover:text-[#8b6d55] whitespace-nowrap"
              >
                {t("vendor.dashboard.reviews.view")}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
