"use client";

import { AlertCircle, MessageCircle, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function ApplicationFormHeader() {
  const { t } = useLanguage();

  return (
    <div className="border-b border-[#eee7e1] px-5 py-5 sm:px-7">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#faf6f1] text-[#a47e43]">
            <MessageCircle size={18} strokeWidth={1.7} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#30251f]">
              {t("becomeVendor.formCard.heading")}
            </h2>

            <p className="mt-0.5 text-[11px] text-[#958980]">
              {t("becomeVendor.formCard.subheading")}
            </p>
          </div>
        </div>

        <span className="hidden rounded-full bg-[#faf6f1] px-3 py-1.5 text-[10px] font-medium text-[#8d796b] sm:block">
          {t("becomeVendor.formCard.step")}
        </span>
      </div>
    </div>
  );
}

export function ApplicationError({
  error,
  onDismiss,
}: {
  error: string;
  onDismiss: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#efd0cb] bg-[#fdf3f1] px-4 py-3.5 text-xs text-[#a3453c]">
      <AlertCircle size={16} className="mt-0.5 shrink-0" />

      <div className="min-w-0">
        <p className="font-semibold">{t("becomeVendor.error.heading")}</p>
        <p className="mt-0.5 leading-5">{error}</p>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="ml-auto shrink-0 rounded-md p-1 text-[#a3453c]/60 transition hover:bg-[#f4dedb] hover:text-[#a3453c]"
        aria-label={t("becomeVendor.error.dismiss")}
      >
        <X size={14} />
      </button>
    </div>
  );
}
