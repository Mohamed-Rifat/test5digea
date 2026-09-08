"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock3, MessageSquareText, Store } from "lucide-react";

import AuthGuard from "@/components/guards/AuthGuard";
import RatingStars from "@/components/shared/RatingStars";
import { useMyReviews } from "@/features/reviews/hooks/useMyReviews";
import { formatDate } from "@/lib/format";
import { ReviewStatus } from "@/types/review";
import type { Review } from "@/types/review";

function StatusBadge({ status }: { status: ReviewStatus }) {
  if (status === ReviewStatus.Approved) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
        <CheckCircle2 size={12} /> Approved
      </span>
    );
  }

  if (status === ReviewStatus.Rejected) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-700">
        <AlertCircle size={12} /> Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
      <Clock3 size={12} /> Pending
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-2xl border border-[#eee7e1] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <Link
            href={`/services/${review.serviceId}`}
            className="text-sm font-semibold text-[#30251f] hover:underline"
          >
            {review.serviceName}
          </Link>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#9b8f86]">
            <Store size={12} />
            {review.vendorBusinessName}
          </p>
        </div>

        <StatusBadge status={review.status} />
      </div>

      <div className="mt-3">
        <RatingStars rating={review.rating} size={13} />
      </div>

      {review.comment && (
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#5f544d]">
          {review.comment}
        </p>
      )}

      {review.status === ReviewStatus.Rejected && review.rejectionReason && (
        <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
          Reason: {review.rejectionReason}
        </p>
      )}

      <p className="mt-3 text-[11px] text-[#b0a598]">
        Submitted {formatDate(review.createdAt)}
      </p>
    </div>
  );
}

function MyReviewsContent() {
  const { reviews, loading, error } = useMyReviews();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-2">
        <MessageSquareText size={18} className="text-[#a47e43]" />
        <h1 className="font-serif text-2xl font-light text-[#30251f]">
          My Reviews
        </h1>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-[#eee7e1] bg-white"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="rounded-2xl border border-[#eee7e1] bg-white p-10 text-center">
          <p className="text-sm text-[#766d67]">
            You haven&apos;t written any reviews yet. Complete a category on
            your{" "}
            <Link href="/roadmap" className="font-medium text-[#a47e43] underline">
              wedding roadmap
            </Link>{" "}
            to leave one.
          </p>
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyReviewsPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#faf8f6]">
        <MyReviewsContent />
      </main>
    </AuthGuard>
  );
}
