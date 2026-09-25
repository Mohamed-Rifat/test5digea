"use client";

import { ArrowRight, BadgeCheck, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function ApplicationSubmit({
  isFormValid,
  loading,
}: {
  isFormValid: boolean;
  loading: boolean;
}) {
  const { t, isArabic } = useLanguage();

  return (
    <div className="pt-1">
      <button
        type="submit"
        disabled={!isFormValid || loading}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-200 ${
          isFormValid && !loading
            ? "bg-[#30251f] text-white shadow-[0_8px_25px_rgba(48,37,31,0.14)] hover:-translate-y-0.5 hover:bg-[#403129] hover:shadow-[0_12px_30px_rgba(48,37,31,0.18)] active:translate-y-0"
            : "cursor-not-allowed border border-[#e7ded7] bg-[#f2eeea] text-[#b0a69f]"
        }`}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {t("becomeVendor.submit.sending")}
          </>
        ) : (
          <>
            {t("becomeVendor.submit.button")}
            <ArrowRight size={16} className={isArabic ? "rotate-180" : ""} />
          </>
        )}
      </button>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] leading-5 text-[#a0968f]">
        <BadgeCheck size={12} className="shrink-0 text-[#b99a62]" />
        <span>{t("becomeVendor.submit.note")}</span>
      </div>
    </div>
  );
}
