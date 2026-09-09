"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MessageSquareText, User } from "lucide-react";

import RatingStars from "@/components/shared/RatingStars";
import { useServiceReviews } from "@/features/reviews/hooks/useServiceReviews";
import { formatDate } from "@/lib/format";

const PAGE_SIZE = 5;

export default function ReviewsSection({ serviceId }: { serviceId: string }) {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useServiceReviews(
    serviceId,
    page,
    PAGE_SIZE
  );

  const reviews = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
console.log("REVIEWS SECTION SERVICE ID:", serviceId);
console.log("REVIEWS SECTION DATA:", data);
console.log("REVIEWS SECTION REVIEWS:", reviews);
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquareText size={18} className="text-[#a47e43]" />
        <h2 className="font-serif text-lg text-[#30251f]">
          Reviews{data && data.totalCount > 0 ? ` (${data.totalCount})` : ""}
        </h2>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl border border-[#eee7e1] bg-white"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p className="rounded-2xl border border-[#eee7e1] bg-white p-6 text-center text-sm text-[#9b8f86]">
          No reviews yet. Be the first to share your experience.
        </p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-[#eee7e1] bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0e9e0] text-[#a47e43]">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#30251f]">
                        {review.userFullName || "Anonymous"}
                      </p>
                      <p className="text-xs text-[#9b8f86]">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  <RatingStars rating={review.rating} size={13} />
                </div>

                {review.comment && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#5f544d]">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4dbd0] text-[#5f544d] transition hover:border-[#b99a62] disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>

              <span className="text-xs text-[#766d67]">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4dbd0] text-[#5f544d] transition hover:border-[#b99a62] disabled:opacity-40"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
