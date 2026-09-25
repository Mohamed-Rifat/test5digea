"use client";

import { RefreshCw, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-72 rounded-xl bg-[#e9e1db]" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-72 rounded-2xl bg-white shadow-sm" />
            <div className="h-72 rounded-2xl bg-white shadow-sm" />
          </div>
          <div className="h-80 rounded-2xl bg-white shadow-sm" />
          <div className="h-96 rounded-2xl bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}

export function ErrorState({ onRefresh }: { onRefresh: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-4">
      <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 sm:mb-5 sm:h-16 sm:w-16">
          <XCircle className="h-7 w-7 text-red-500 sm:h-8 sm:w-8" />
        </div>
        <h1 className="text-lg font-semibold text-[#30251f] sm:text-xl">
          {t("vendor.dashboard.error.title")}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#756b65]">
          {t("vendor.dashboard.error.text")}
        </p>
        <button
          type="button"
          onClick={onRefresh}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#463831] sm:mt-6 sm:px-5 sm:py-3"
        >
          <RefreshCw className="h-4 w-4" />
          {t("vendor.dashboard.error.retry")}
        </button>
      </div>
    </div>
  );
}
