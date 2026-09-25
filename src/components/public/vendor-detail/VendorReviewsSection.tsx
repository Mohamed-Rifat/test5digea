"use client";

import Link from "next/link";
import { ArrowUpRight, MessageSquareText, User } from "lucide-react";
import RatingStars from "@/components/shared/RatingStars";
import { formatDate } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales";
import type { Review } from "@/types/review";
import type { Vendor } from "@/types/vendor";

import { REVIEWS_PAGE_SIZE } from "@/components/public/vendor-detail/vendorDetailUtils";

export function VendorReviewsSection({
  vendor,
  reviews,
  loading,
}: {
  vendor: Vendor;
  reviews: Review[];
  loading: boolean;
}) {
  const { t, language } = useLanguage();

  // The vendor profile is intentionally kept editorial and compact:
  // only the five newest reviews are shown here.
  const latestReviews = reviews.slice(0, REVIEWS_PAGE_SIZE);
  const hasMoreReviews = reviews.length > REVIEWS_PAGE_SIZE;

  return (
    <section className="mt-12 border-t border-[#e9e0d8] pt-9">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
            {t("vendors.detail.reviews.eyebrow")}
          </p>

          <h2 className="flex items-center gap-2 font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
            <MessageSquareText
              size={20}
              className="text-[#a47e43]"
            />
            {t("vendors.detail.reviews.title")}
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {vendor.reviewsCount > 0 && (
            <RatingStars
              rating={vendor.averageRating}
              reviewsCount={vendor.reviewsCount}
            />
          )}

          {hasMoreReviews && (
            <Link
              href={`/vendors/${vendor.id}/reviews`}
              className="hidden items-center gap-1.5 rounded-full border border-[#e4dbd0] bg-white px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] rtl:tracking-normal text-[#30251f] transition-all duration-200 hover:border-[#cbb08d] hover:bg-[#faf7f4] sm:inline-flex"
            >
              {t("vendors.detail.reviews.viewAll")}
              <ArrowUpRight size={12} className="rtl:-scale-x-100" />
            </Link>
          )}
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl border border-[#eee7e1] bg-white"
            />
          ))}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <p className="rounded-2xl border border-[#eee7e1] bg-white p-6 text-center text-sm text-[#9b8f86]">
          {t("vendors.detail.reviews.empty", { name: vendor.businessName })}
        </p>
      )}

      {!loading && reviews.length > 0 && (
        <>
          <div className="space-y-4">
            {latestReviews.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-[#eee7e1] bg-white p-4 shadow-[0_8px_28px_rgba(48,37,31,0.035)] transition-all duration-300 hover:border-[#e1d3c6] hover:shadow-[0_14px_36px_rgba(48,37,31,0.06)] sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3e9e2] text-[#a47e43]">
                      <User size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#30251f]">
                        {review.userFullName || t("vendors.detail.reviews.anonymous")}
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-[#9b8f86]">
                        {review.serviceName} ·{" "}
                        {formatDate(review.createdAt, LANGUAGE_DATE_LOCALE[language])}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <RatingStars rating={review.rating} size={13} />
                  </div>
                </div>

                {review.comment && (
                  <p dir="auto" className="mt-3 whitespace-pre-line text-sm leading-7 text-[#5f544d]">
                    {review.comment}
                  </p>
                )}
              </article>
            ))}
          </div>

          {hasMoreReviews && (
            <div className="mt-6 flex justify-center sm:hidden">
              <Link
                href={`/vendors/${vendor.id}/reviews`}
                className="inline-flex items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-5 py-2.5 text-xs font-semibold text-[#30251f] transition-all duration-200 hover:border-[#b99a62] hover:bg-[#faf7f4]"
              >
                {t("vendors.detail.reviews.viewAllReviews")}
                <ArrowUpRight size={13} className="rtl:-scale-x-100" />
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
