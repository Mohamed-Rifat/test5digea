"use client";

import { Check, Clock3, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatDateTime } from "@/lib/format";
import { delay } from "../motion";

import type { UnderReviewState } from "./useUnderReview";
import { CARD } from "@/components/vendor/onboarding/under-review/underReviewParts";

/** Where the request stands. */
export function ReviewTimeline({ review }: { review: UnderReviewState }) {
  const { t } = useLanguage();
  const { locale, submittedAt } = review;

  return (
    <section className={`onb-rise ${CARD} p-6 sm:p-8`} style={delay(160)}>
      <h2 className="font-serif text-xl font-light text-[#30251f]">
        {t("vendorOnboarding.review.timelineTitle")}
      </h2>

      <ol className="mt-6">
        {/* 1 — submitted */}
        <li className="relative flex gap-4 pb-8">
          <span
            className="onb-fill absolute start-4.25 top-9 bottom-0 w-0.5 rounded-full bg-[#b99a62]"
            style={delay(500)}
          />

          <span
            className="onb-pop relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b99a62] text-white"
            style={delay(250)}
          >
            <Check size={17} strokeWidth={3} />
          </span>

          <div className="min-w-0 pt-1">
            <p className="text-sm font-semibold text-[#30251f]">
              {t("vendorOnboarding.review.timelineSubmitted")}
            </p>
            <p className="mt-1 text-xs leading-6 text-[#81746d]">
              {t("vendorOnboarding.review.timelineSubmittedText")}
            </p>
            {submittedAt && (
              <p className="mt-1 text-[11px] font-semibold text-[#a47e43]">
                {t("vendorOnboarding.review.timelineSubmittedAt", {
                  date: formatDateTime(submittedAt, locale),
                })}
              </p>
            )}
          </div>
        </li>

        {/* 2 — under review (active) */}
        <li className="relative flex gap-4 pb-8">
          <span className="absolute start-4.25 top-9 bottom-0 w-0.5 overflow-hidden rounded-full bg-[#eee5df]">
            <span className="onb-sweep absolute inset-x-0 top-0 block h-1/3 bg-linear-to-b from-transparent via-[#b99a62] to-transparent" />
          </span>

          {/* pop-in and pulse are separate elements: two animations
              can't share one element's `animation` property */}
          <span className="onb-pop relative shrink-0" style={delay(450)}>
            <span className="onb-dot flex h-9 w-9 items-center justify-center rounded-full bg-[#30251f] text-white">
              <Clock3 size={16} />
            </span>
          </span>

          <div className="min-w-0 pt-1">
            <p className="text-sm font-semibold text-[#30251f]">
              {t("vendorOnboarding.review.timelineReview")}
            </p>
            <p className="mt-1 text-xs leading-6 text-[#81746d]">
              {t("vendorOnboarding.review.timelineReviewText")}
            </p>
          </div>
        </li>

        {/* 3 — decision (upcoming) */}
        <li className="relative flex gap-4">
          <span
            className="onb-pop flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#d9ccc2] bg-white text-[#b3a69e]"
            style={delay(650)}
          >
            <ShieldCheck size={16} />
          </span>

          <div className="min-w-0 pt-1">
            <p className="text-sm font-semibold text-[#9b8f86]">
              {t("vendorOnboarding.review.timelineDecision")}
            </p>
            <p className="mt-1 text-xs leading-6 text-[#a3958c]">
              {t("vendorOnboarding.review.timelineDecisionText")}
            </p>
          </div>
        </li>
      </ol>
    </section>
  );
}
