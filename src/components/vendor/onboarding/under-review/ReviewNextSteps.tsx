"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { delay } from "../motion";

import { CARD } from "@/components/vendor/onboarding/under-review/underReviewParts";

/** What happens next. */
export function ReviewNextSteps() {
  const { t } = useLanguage();

  return (
    <section className={`onb-rise ${CARD} p-6 sm:p-8`} style={delay(240)}>
      <h2 className="font-serif text-xl font-light text-[#30251f]">
        {t("vendorOnboarding.review.nextTitle")}
      </h2>

      <div className="mt-5 space-y-3">
        <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <p className="text-sm leading-6 text-emerald-800">
            {t("vendorOnboarding.review.nextApproved")}
          </p>
        </div>

        <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
          <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm leading-6 text-amber-800">
            {t("vendorOnboarding.review.nextRejected")}
          </p>
        </div>
      </div>
    </section>
  );
}
