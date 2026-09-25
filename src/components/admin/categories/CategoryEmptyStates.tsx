"use client";

import { Plus, RefreshCw, Search, Tags } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export function CategoriesError({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-[#f0d4d1] bg-white p-8 text-center shadow-sm sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0ee]">
        <RefreshCw size={23} className="text-[#ad5b54]" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-[#30251f]">
        {t("admin.categories.errorTitle")}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8f8179]">
        {error}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#43342c]"
      >
        <RefreshCw size={15} />

        {t("admin.categories.tryAgain")}
      </button>
    </div>
  );
}

export function CategoriesEmpty({ onAdd }: { onAdd: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-[#ebe3dd] bg-white p-10 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f7f1ed] text-[#806d61]">
        <Tags size={28} strokeWidth={1.7} />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-[#30251f]">
        {t("admin.categories.emptyTitle")}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#93857c]">
        {t("admin.categories.emptyDesc")}
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#43342c]"
      >
        <Plus size={16} />

        {t("admin.categories.add")}
      </button>
    </div>
  );
}

export function CategoriesNoMatch({ onClear }: { onClear: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-[#ebe3dd] bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f1ed] text-[#806d61]">
        <Search size={24} />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-[#30251f]">
        {t("admin.categories.noMatch")}
      </h2>

      <p className="mt-2 text-sm text-[#93857c]">
        {t("admin.categories.noMatchDesc")}
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-xl border border-[#e7ded8] px-4 py-2.5 text-sm font-medium text-[#665951] transition hover:bg-[#faf7f4]"
      >
        {t("admin.categories.clearFilters")}
      </button>
    </div>
  );
}
