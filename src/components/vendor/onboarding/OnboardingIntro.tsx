"use client";

import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";
import { delay } from "./motion";

/** Eyebrow, title, subtitle and (when rejected) the admin's reason. */
export function OnboardingIntro({
  vendor,
  isRejected,
}: {
  vendor: Vendor;
  isRejected: boolean;
}) {
  const { t } = useLanguage();

  return (
    <>
      <div className="onb-rise" style={delay(60)}>
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a47e43] rtl:tracking-normal">
          {t("vendorOnboarding.form.eyebrow")}
        </p>

        <h1 className="mt-2 font-serif text-3xl font-light tracking-tight text-[#30251f] rtl:leading-snug sm:text-4xl">
          {isRejected
            ? t("vendorOnboarding.form.rejectedTitle")
            : t("vendorOnboarding.form.title")}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#81746d]">
          {isRejected
            ? t("vendorOnboarding.form.rejectedHint")
            : t("vendorOnboarding.form.subtitle")}
        </p>
      </div>

      {isRejected && (
        <div
          className="onb-rise mt-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          style={delay(120)}
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div className="min-w-0">
            <p className="font-semibold">
              {t("vendorOnboarding.form.rejectedReason")}
            </p>
            <p className="mt-1 whitespace-pre-line leading-6">
              {vendor.rejectionReason ||
                t("vendorOnboarding.form.rejectedNoReason")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
