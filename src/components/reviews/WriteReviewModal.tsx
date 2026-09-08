"use client";

import { useState } from "react";
import { Loader2, Star, X } from "lucide-react";

import { useWriteReview } from "@/features/reviews/hooks/useWriteReview";
import { useToast } from "@/components/providers/ToastProvider";

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="p-0.5"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            size={26}
            className={
              star <= (hovered || value)
                ? "fill-[#b99a62] text-[#b99a62]"
                : "fill-transparent text-[#d8cdc0]"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function WriteReviewModal({
  roadmapItemId,
  categoryName,
  onClose,
}: {
  roadmapItemId: string;
  categoryName: string;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const { reviewableServices, loading, error, actionLoading, submit } =
    useWriteReview(roadmapItemId);

  const [serviceId, setServiceId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");

  const selectedService =
    reviewableServices.find((s) => s.id === serviceId) ||
    (reviewableServices.length === 1 ? reviewableServices[0] : undefined);

  const handleSubmit = async () => {
    const targetServiceId = serviceId || selectedService?.id;

    if (!targetServiceId) {
      setFormError("Please choose a service to review.");
      return;
    }

    if (rating < 1) {
      setFormError("Please select a star rating.");
      return;
    }

    setFormError("");

    const ok = await submit({
      roadmapItemId,
      serviceId: targetServiceId,
      rating,
      comment: comment.trim(),
    });

    if (ok) {
      toast("Thanks! Your review has been submitted for approval.", "success");
      onClose();
    } else {
      toast("We couldn't submit your review.", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#f0e9e0] px-6 py-5">
          <div>
            <h2 className="font-serif text-lg text-[#30251f]">
              Write a Review
            </h2>
            <p className="mt-1 text-sm text-[#9b8f86]">{categoryName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9b8f86] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-[#b99a62]" />
            </div>
          )}

          {!loading && error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && reviewableServices.length === 0 && (
            <p className="rounded-xl bg-[#faf7f4] px-4 py-3 text-sm text-[#766d67]">
              There&apos;s nothing available to review for this category yet.
            </p>
          )}

          {!loading && !error && reviewableServices.length > 0 && (
            <>
              {reviewableServices.length > 1 && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
                    Which service are you reviewing?
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full rounded-xl border border-[#e4dbd0] px-3 py-2.5 text-sm outline-none focus:border-[#b99a62]"
                  >
                    <option value="">Select a service</option>
                    {reviewableServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
                  Your rating
                </label>
                <StarRatingInput value={rating} onChange={setRating} />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
                  Your comment (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Share how it went..."
                  className="w-full resize-none rounded-xl border border-[#e4dbd0] px-3 py-2.5 text-sm outline-none focus:border-[#b99a62]"
                />
              </div>

              {formError && (
                <p className="text-xs font-medium text-red-600">
                  {formError}
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#f0e9e0] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="rounded-xl border border-[#e4dbd0] px-4 py-2.5 text-sm font-medium text-[#5f544d] transition hover:border-[#b99a62] disabled:opacity-50"
          >
            Cancel
          </button>

          {!loading && !error && reviewableServices.length > 0 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#42332a] disabled:opacity-60"
            >
              {actionLoading && (
                <Loader2 size={15} className="animate-spin" />
              )}
              Submit Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
