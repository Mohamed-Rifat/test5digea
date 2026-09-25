"use client";

import { Loader2, Lock, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { delay } from "./motion";

interface OnboardingSubmitBarProps {
  requiredDone: number;
  requiredTotal: number;
  requiredPercent: number;
  submitting: boolean;
  isRejected: boolean;
}

/** Required-fields progress bar + submit button. */
export function OnboardingSubmitBar({
  requiredDone,
  requiredTotal,
  requiredPercent,
  submitting,
  isRejected,
}: OnboardingSubmitBarProps) {
  const { t } = useLanguage();

  return (
    <section
      className="onb-rise rounded-4xl border border-[#e8dfd8] bg-white p-5 shadow-[0_10px_40px_rgba(48,37,31,0.05)] sm:p-6"
      style={delay(460)}
    >
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-[#756b65]">
        <span>
          {t("vendorOnboarding.form.progress", {
            done: requiredDone,
            total: requiredTotal,
          })}
        </span>
        <span dir="ltr" className="tabular-nums text-[#a47e43]">
          {requiredPercent}%
        </span>
      </div>

      <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-[#f1ebe6]">
        <div
          className="h-full rounded-full bg-[#30251f] transition-all duration-700"
          style={{ width: `${requiredPercent}%` }}
        />
        <div className="onb-sweep absolute inset-y-0 start-0 w-1/5 bg-linear-to-r from-transparent via-white/50 to-transparent" />
      </div>

      <p className="mt-2 text-[11px] text-[#9b8f86]">
        {t("vendorOnboarding.form.requiredNote")}
      </p>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-xs leading-6 text-[#756b65] sm:max-w-md">
          <Lock className="mt-1 h-3.5 w-3.5 shrink-0 text-[#a47e43]" />
          {t("vendorOnboarding.form.submitNote")}
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="group relative inline-flex h-12 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#30251f] px-7 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(48,37,31,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#45362d] disabled:translate-y-0 disabled:opacity-60"
        >
          <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

          {submitting ? (
            <Loader2 className="relative h-4 w-4 animate-spin" />
          ) : (
            <Send className="relative h-4 w-4 rtl:-scale-x-100" />
          )}

          <span className="relative">
            {submitting
              ? isRejected
                ? t("vendorOnboarding.form.resubmitting")
                : t("vendorOnboarding.form.submitting")
              : isRejected
                ? t("vendorOnboarding.form.resubmit")
                : t("vendorOnboarding.form.submit")}
          </span>
        </button>
      </div>
    </section>
  );
}
