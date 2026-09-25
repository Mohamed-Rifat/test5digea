"use client";

import { useEffect, useState } from "react";
import { Loader2, Star, X } from "lucide-react";

import { useWriteReview } from "@/features/reviews/hooks/useWriteReview";
import {
  isAlreadyReviewedMessage,
  type MyReview,
  type MyReviews,
} from "@/features/reviews/hooks/useMyReviews";
import { ReviewStatus } from "@/types/review";
import { useToast } from "@/components/providers/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label={t("reviews.write.yourRating")}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="p-0.5"
          role="radio"
          aria-checked={value === star}
          aria-label={t("reviews.write.stars", { count: star })}
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
  myReviews,
  onViewReview,
}: {
  roadmapItemId: string;
  categoryName: string;
  onClose: () => void;
  /** The couple's known reviews - used to hide / lock already reviewed services. */
  myReviews?: MyReviews;
  /** Open the read-only view of an existing review. */
  onViewReview?: (review: MyReview) => void;
}) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { reviewableServices: allReviewable, loading, error, actionLoading, submit } =
    useWriteReview(roadmapItemId);
  const reviewedServiceIds = myReviews?.reviewedServiceIds;
  const reviewableServices = reviewedServiceIds
    ? allReviewable.filter((s) => !reviewedServiceIds.has(s.id))
    : allReviewable;
  const alreadyReviewed = myReviews?.reviews.find((r) =>
    allReviewable.some((s) => s.id === r.serviceId)
  );

  // Before showing the form, make sure none of these services already has a
  // (published) review from this couple - e.g. written on another device.
  const [checking, setChecking] = useState(false);
  const checkServices = myReviews?.checkServices;
  const serviceKey = allReviewable.map((s) => s.id).join(",");
  useEffect(() => {
    if (!checkServices || !serviceKey) return;
    let cancelled = false;
    setChecking(true);
    checkServices(serviceKey.split(",")).finally(() => {
      if (!cancelled) setChecking(false);
    });
    return () => {
      cancelled = true;
    };
  }, [checkServices, serviceKey]);

  const [serviceId, setServiceId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");

  // Close with Escape.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !actionLoading) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [actionLoading, onClose]);

  const selectedService =
    reviewableServices.find((s) => s.id === serviceId) ||
    (reviewableServices.length === 1 ? reviewableServices[0] : undefined);

  const handleSubmit = async () => {
    const targetServiceId = serviceId || selectedService?.id;

    if (!targetServiceId) {
      setFormError(t("reviews.write.errorChooseService"));
      return;
    }

    if (rating < 1) {
      setFormError(t("reviews.write.errorRating"));
      return;
    }

    setFormError("");

    const result = await submit({
      roadmapItemId,
      serviceId: targetServiceId,
      rating,
      comment: comment.trim(),
    });

    const target = reviewableServices.find((s) => s.id === targetServiceId);
    const base = {
      serviceId: targetServiceId,
      vendorId: target?.vendorId ?? "",
      serviceName: target?.name,
      vendorBusinessName: target?.vendorBusinessName,
    };

    if (result === true) {
      myReviews?.remember([
        {
          ...base,
          rating,
          comment: comment.trim(),
          status: ReviewStatus.Pending,
          createdAt: new Date().toISOString(),
        },
      ]);
      toast(t("reviews.write.success"), "success");
      onClose();
    } else if (isAlreadyReviewedMessage(result)) {
      // The API says this service was already reviewed: lock it from now on.
      myReviews?.remember([base]);
      toast(t("reviews.mine.alreadyToast"), "info");
      onClose();
    } else {
      toast(result || t("reviews.write.failed"), "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="write-review-title"
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-dialog-in"
      >
        <div className="flex items-start justify-between border-b border-[#f0e9e0] px-6 py-5">
          <div>
            <h2 id="write-review-title" className="text-lg font-semibold text-[#30251f]">
              {t("reviews.write.title")}
            </h2>
            <p className="mt-1 text-sm text-[#9b8f86]">{categoryName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9b8f86] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {(loading || (checking && reviewableServices.length > 0)) && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-[#b99a62]" />
            </div>
          )}

          {!loading && error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {!loading && !checking && !error && reviewableServices.length === 0 && (
            <p className="rounded-xl bg-[#faf7f4] px-4 py-3 text-sm text-[#766d67]">
              {alreadyReviewed
                ? t("reviews.mine.alreadyAll")
                : t("reviews.write.nothingToReview")}
              {alreadyReviewed && onViewReview && (
                <button
                  type="button"
                  onClick={() => onViewReview(alreadyReviewed)}
                  className="mt-3 flex h-10 items-center justify-center rounded-xl bg-[#30251f] px-4 text-sm font-semibold text-white transition hover:bg-[#46382f]"
                >
                  {t("reviews.mine.seeYours")}
                </button>
              )}
            </p>
          )}

          {!loading && !checking && !error && reviewableServices.length > 0 && (
            <>
              {reviewableServices.length > 1 && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
                    {t("reviews.write.chooseService")}
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full rounded-xl border border-[#e4dbd0] px-3 py-2.5 text-sm outline-none focus:border-[#b99a62]"
                  >
                    <option value="">{t("reviews.write.selectService")}</option>
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
                  {t("reviews.write.yourRating")}
                </label>
                <StarRatingInput value={rating} onChange={setRating} />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
                  {t("reviews.write.yourComment")}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder={t("reviews.write.commentPlaceholder")}
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
            {t("common.cancel")}
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
              {t("reviews.write.submit")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
