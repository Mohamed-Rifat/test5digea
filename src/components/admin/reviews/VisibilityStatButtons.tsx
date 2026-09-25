"use client";

import { useLanguage } from "@/context/LanguageContext";

interface VisibilityStatButtonsProps {
  stats: { total: number; visible: number; hidden: number };
  visibilityFilter: string;
  onChange: (value: string) => void;
}

/** Total / visible / hidden counters that also act as quick filters. */
export function VisibilityStatButtons({
  stats,
  visibilityFilter,
  onChange,
}: VisibilityStatButtonsProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
      <button
        onClick={() => onChange("all")}
        className={`rounded-xl border p-3 text-left transition ${
          visibilityFilter === "all"
            ? "border-[#a47e43] bg-[#fbf6f1] shadow-sm"
            : "border-[#e8dfd8] bg-white hover:border-[#d5c8be]"
        }`}
      >
        <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-[#8d8077] sm:text-[10px]">
          {t("admin.reviews.total")}
        </p>
        <p className="mt-0.5 text-lg font-semibold text-[#30251f] sm:text-xl">
          {stats.total}
        </p>
      </button>

      <button
        onClick={() => onChange("visible")}
        className={`rounded-xl border p-3 text-left transition ${
          visibilityFilter === "visible"
            ? "border-emerald-400 bg-emerald-50 shadow-sm"
            : "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300"
        }`}
      >
        <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-emerald-700 sm:text-[10px]">
          {t("admin.reviews.visible")}
        </p>
        <p className="mt-0.5 text-lg font-semibold text-emerald-700 sm:text-xl">
          {stats.visible}
        </p>
      </button>

      <button
        onClick={() => onChange("hidden")}
        className={`rounded-xl border p-3 text-left transition ${
          visibilityFilter === "hidden"
            ? "border-red-400 bg-red-50 shadow-sm"
            : "border-red-200 bg-red-50/50 hover:border-red-300"
        }`}
      >
        <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-red-700 sm:text-[10px]">
          {t("admin.reviews.hidden")}
        </p>
        <p className="mt-0.5 text-lg font-semibold text-red-700 sm:text-xl">
          {stats.hidden}
        </p>
      </button>
    </div>
  );
}
