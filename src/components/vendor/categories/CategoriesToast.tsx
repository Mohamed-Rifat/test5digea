"use client";

import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorCategoriesPageState } from "./useVendorCategoriesPage";

/** Floating success toast. */
export function CategoriesToast({ page }: { page: VendorCategoriesPageState }) {
  const { t } = useLanguage();
  const { toastMessage } = page;

  return (
    <>
      {toastMessage && (
        <div className="fixed bottom-6 end-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#30251f]">
                {t("vendor.services.detail.toastTitle")}
              </p>
              <p className="text-xs text-[#9b8f86]">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
