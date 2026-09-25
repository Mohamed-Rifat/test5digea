"use client";

import { Check, X, Zap } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

interface CategoryAlertsProps {
  successMessage: string | null;
  actionError: string | null;
  servicesError: string | null;
  /** Messages are shown inside the modal while one is open. */
  modalOpen: boolean;
  onDismissSuccess: () => void;
  onDismissError: () => void;
}

/** Success / error banners and the "service counts unavailable" warning. */
export function CategoryAlerts({
  successMessage,
  actionError,
  servicesError,
  modalOpen,
  onDismissSuccess,
  onDismissError,
}: CategoryAlertsProps) {
  const { t } = useLanguage();

  return (
    <>
      {successMessage && !modalOpen && (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-[#d9e8dc] bg-[#f7fbf8] px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e4f0e6] text-[#628069]">
              <Check size={14} />
            </div>

            <p className="truncate text-xs font-medium text-[#58705f]">
              {successMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={onDismissSuccess}
            className="shrink-0 rounded-lg p-1 text-[#819187] transition hover:bg-[#e8f1ea]"
            aria-label={t("admin.categories.dismiss")}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {servicesError && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#ead9b9] bg-[#fffaf0] px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f8edcf] text-[#9b7945]">
            <Zap size={15} />
          </div>

          <div>
            <p className="text-xs font-semibold text-[#725a35]">
              {t("admin.categories.servicesLoadError")}
            </p>

            <p className="mt-0.5 text-[11px] text-[#9a8567]">
              {t("admin.categories.serviceCountsWarning")}
            </p>
          </div>
        </div>
      )}

      {actionError && !modalOpen && (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-[#f1d1ce] bg-[#fff7f6] px-4 py-3">
          <p className="text-xs font-medium text-[#a34f49]">{actionError}</p>

          <button
            type="button"
            onClick={onDismissError}
            className="rounded-lg p-1 text-[#b76b65] transition hover:bg-[#fce8e6]"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
}
