"use client";

import { Plus, RefreshCw, Tags } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

interface CategoriesHeaderProps {
  loading: boolean;
  busy: boolean;
  onRefresh: () => void;
  onAdd: () => void;
}

export function CategoriesHeader({
  loading,
  busy,
  onRefresh,
  onAdd,
}: CategoriesHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-2.5 flex items-center gap-2 text-[11px] font-medium text-[#9b8e86]">
          <Tags size={13} />

          <span>{t("admin.categories.breadcrumb")}</span>

          <span>/</span>

          <span className="text-[#6f6057]">{t("admin.categories.title")}</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
          {t("admin.categories.title")}
        </h1>

        <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[#8b7e76]">
          {t("admin.categories.pageDesc")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading || busy}
          className="inline-flex items-center gap-2 rounded-xl border border-[#e8e0da] bg-white px-3.5 py-2.5 text-xs font-medium text-[#665951] shadow-sm transition hover:bg-[#faf7f4] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />

          {t("admin.categories.refresh")}
        </button>

        <button
          type="button"
          onClick={onAdd}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#43342c] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} />

          {t("admin.categories.add")}
        </button>
      </div>
    </div>
  );
}
