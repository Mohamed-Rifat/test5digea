"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export function EditServiceSkeleton() {
  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-40 rounded bg-[#e9e1db]" />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="h-64 rounded-3xl bg-white shadow-sm" />
              <div className="h-64 rounded-3xl bg-white shadow-sm" />
            </div>
            <div className="h-96 rounded-3xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceNotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-6">
      <div className="w-full max-w-md rounded-3xl border border-[#e8dfd8] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
          <AlertCircle className="h-7 w-7 text-red-500" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-[#30251f]">
          {t("vendor.services.detail.notFoundTitle")}
        </h1>
        <p className="mt-2 text-sm text-[#756b65]">{t("vendor.services.detail.notFoundText")}</p>
        <Link
          href="/vendor/services"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#463831]"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t("vendor.services.detail.back")}
        </Link>
      </div>
    </div>
  );
}

/** Bottom-corner success toast. */
export function SuccessToast({ message }: { message: string }) {
  const { t } = useLanguage();

  if (!message) return null;

  return (
    <div className="fixed bottom-24 end-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-xl">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#30251f]">{t("vendor.services.detail.toastTitle")}</p>
          <p className="text-xs text-[#9b8f86]">{message}</p>
        </div>
      </div>
    </div>
  );
}
