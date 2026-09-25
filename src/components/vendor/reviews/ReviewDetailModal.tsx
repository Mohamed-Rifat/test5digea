"use client";

import { User, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import RatingStars from "@/components/shared/RatingStars";
import { formatDate } from "@/lib/format";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import { ReviewStatus } from "@/types/review";
import type { Review } from "@/types/review";
import { StatusBadge } from "./ReviewBits";
import { getRatingLabelKey } from "./reviewUtils";

export function ReviewDetailModal({ review: selectedReview, onClose }: { review: Review; onClose: () => void }) {
  const { t, language } = useLanguage();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-2 sm:items-center sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 sm:max-h-[90vh] sm:p-6 sm:zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3 sm:gap-4 sm:mb-4">
          <h3 className="text-base font-semibold text-[#30251f] sm:text-lg">{t("vendor.reviews.detail.title")}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-[#f5eee9] transition-colors"
          >
            <X size={18} className="text-[#8d8077] sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-10 w-10 rounded-full bg-[#f5eee9] flex items-center justify-center sm:h-12 sm:w-12">
              <User size={16} className="text-[#705b4e] sm:h-5 sm:w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#30251f] sm:text-base">
                {selectedReview.userFullName || t("vendor.reviews.card.anonymous")}
              </p>
              <p className="text-[10px] text-[#a39891] sm:text-xs">
                {formatDate(selectedReview.createdAt, LANGUAGE_DATE_LOCALE[language])}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-[#fcfaf8] p-3 border border-[#f0eae5] sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div>
              <p className="text-[10px] font-medium text-[#a39891] sm:text-xs">{t("vendor.reviews.detail.service")}</p>
              <p className="text-sm font-semibold text-[#30251f] sm:text-base">{selectedReview.serviceName}</p>
            </div>
            <div className="text-start sm:text-end">
              <RatingStars rating={selectedReview.rating} size={16} />
              <p className="mt-0.5 text-[10px] text-[#a39891] sm:text-xs">{t(getRatingLabelKey(selectedReview.rating))}</p>
            </div>
          </div>

          {selectedReview.comment && (
            <div>
              <p className="text-[10px] font-medium text-[#a39891] mb-1 sm:text-xs">{t("vendor.reviews.detail.comment")}</p>
              <p className="whitespace-pre-line text-sm leading-6 text-[#5f544d] bg-[#fcfaf8] p-3 rounded-xl border border-[#f0eae5] sm:p-4 sm:text-sm sm:leading-7">
                {selectedReview.comment}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-[#f1ece8] pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-4">
            <div>
              <p className="text-[10px] font-medium text-[#a39891] sm:text-xs">{t("vendor.reviews.detail.status")}</p>
              <StatusBadge status={selectedReview.status} />
            </div>
            {selectedReview.status === ReviewStatus.Rejected && selectedReview.rejectionReason && (
              <div className="text-start sm:text-end">
                <p className="text-[10px] font-medium text-[#a39891] sm:text-xs">{t("vendor.reviews.detail.rejectionReason")}</p>
                <p className="text-sm text-red-600">{selectedReview.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
