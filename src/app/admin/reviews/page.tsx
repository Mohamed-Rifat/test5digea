"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  MessageSquareText,
  Search,
  Store,
  X,
} from "lucide-react";

import RatingStars from "@/components/shared/RatingStars";
import { useAdminReviews } from "@/features/reviews/hooks/useAdminReviews";
import { useAdminServices } from "@/features/services/hooks/useAdminServices";
import {
  fetchApprovedReviews,
  toggleReviewDisplay,
} from "@/features/reviews/api";
import { formatDate } from "@/lib/format";
import type { Review } from "@/types/review";

/* =========================
   Pending Reviews
========================= */

function PendingReviews() {
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
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-[#c59b6d]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-sm text-gray-500">
          No reviews are waiting for moderation.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {reviews.map((review) => {
          const isApproving = actionLoading === `approve-${review.id}`;
          const isRejecting = actionLoading === `reject-${review.id}`;
          const busy = isApproving || isRejecting;

          return (
            <div
              key={review.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {review.serviceName}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                    <Store size={12} />
                    {review.vendorBusinessName}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    By {review.userFullName || "Anonymous"} &middot;{" "}
                    {formatDate(review.createdAt)}
                  </p>
                </div>

                <RatingStars rating={review.rating} size={13} />
              </div>

              {review.comment && (
                <p className="mt-3 whitespace-pre-line rounded-xl bg-gray-50 p-3 text-sm leading-6 text-gray-700">
                  {review.comment}
                </p>
              )}

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setRejectTarget(review);
                    setRejectReason("");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isRejecting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <X size={14} />
                  )}
                  Reject
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => approve(review.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isApproving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  Approve
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Reject Review
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Please provide a reason for rejecting this review.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Review
                </p>
                <p className="mt-1 font-medium text-gray-900">
                  {rejectTarget.serviceName}
                </p>
                <p className="mt-0.5 text-sm text-gray-500">
                  {rejectTarget.vendorBusinessName}
                </p>
              </div>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter the reason..."
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#c59b6d] focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectReason.trim() || Boolean(actionLoading)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <X size={16} />
                )}
                Reject Review
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================
   Manage reviews for a specific service
   (approve/reject only affects the pending queue above — this section
   lets an admin show/hide already-approved reviews on a service page)
========================= */

function ServiceReviewsManager() {
  const { services } = useAdminServices();

  const [serviceId, setServiceId] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) {
      setReviews([]);
      setError(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        /*
         * Admin endpoint:
         * Get all approved reviews that are currently hidden.
         */
        const data = await fetchApprovedReviews({
          isDisplayed: false,
        });

        console.log("APPROVED HIDDEN REVIEWS:", data);

        /*
         * The endpoint filters by vendorId, not serviceId,
         * so we filter by serviceId on the frontend.
         */
        const serviceReviews = data.filter(
          (review) => review.serviceId === serviceId
        );

        console.log("SELECTED SERVICE ID:", serviceId);
        console.log("REVIEWS FOR SELECTED SERVICE:", serviceReviews);

        if (!cancelled) {
          setReviews(serviceReviews);
        }
      } catch (err) {
        console.error("Failed to load approved reviews:", err);

        if (!cancelled) {
          setError("Failed to load approved reviews for this service.");
          setReviews([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  const handleToggle = async (review: Review) => {
    try {
      setBusyId(review.id);

      const nextDisplayed = !review.isDisplayed;

      await toggleReviewDisplay(review.id, {
        isDisplayed: nextDisplayed,
      });

      /*
       * Update local state immediately.
       */
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id
            ? {
                ...r,
                isDisplayed: nextDisplayed,
              }
            : r
        )
      );
    } catch (err) {
      console.error("Failed to toggle review display:", err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Search size={16} className="text-[#c59b6d]" />

        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Manage approved reviews
          </h3>

          <p className="mt-0.5 text-xs text-gray-500">
            Activate or hide approved reviews for a specific service.
          </p>
        </div>
      </div>

      <select
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c59b6d] focus:bg-white"
      >
        <option value="">Select a service...</option>

        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} — {s.vendorBusinessName}
          </option>
        ))}
      </select>

      {loading && (
        <div className="mt-4 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-[#c59b6d]" />
        </div>
      )}

      {!loading && error && (
        <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && serviceId && reviews.length === 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">
            This service has no approved hidden reviews.
          </p>
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="mt-4 space-y-3">
          {reviews.map((review) => {
            const isBusy = busyId === review.id;

            return (
              <div
                key={review.id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {review.userFullName || "Anonymous"}
                      </p>

                      <RatingStars
                        rating={review.rating}
                        size={12}
                      />
                    </div>

                    {review.comment && (
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {review.comment}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span>{review.serviceName}</span>

                      <span>•</span>

                      <span>{review.vendorBusinessName}</span>

                      <span>•</span>

                      <span>
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleToggle(review)}
                    title={
                      review.isDisplayed
                        ? "Hide from public"
                        : "Activate and show publicly"
                    }
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      review.isDisplayed
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "border-gray-200 bg-white text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {isBusy ? (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    ) : review.isDisplayed ? (
                      <Eye size={15} />
                    ) : (
                      <EyeOff size={15} />
                    )}
                  </button>
                </div>

                <div className="mt-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      review.isDisplayed
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {review.isDisplayed
                      ? "Active"
                      : "Approved • Hidden"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================
   Page
========================= */

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <MessageSquareText size={20} className="text-[#c59b6d]" />
          <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Moderate pending reviews and manage what's shown publicly.
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Pending approval
        </h2>
        <PendingReviews />
      </div>

      <ServiceReviewsManager />
    </div>
  );
}
