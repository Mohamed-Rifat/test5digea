"use client";

import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export function ServicesHeader({
  loading,
  onRefresh,
}: {
  loading: boolean;
  onRefresh: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/admin" className="transition hover:text-gray-900">
            {t("admin.services.breadcrumb")}
          </Link>

          <ChevronRight size={15} />

          <span className="text-gray-900">
            {t("admin.services.servicePlural")}
          </span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
          {t("admin.services.title")}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {t("admin.services.subtitle")}
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
      >
        <Loader2 size={17} className={loading ? "animate-spin" : ""} />

        {t("admin.services.refresh")}
      </button>
    </div>
  );
}
