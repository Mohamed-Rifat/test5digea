"use client";

import { FilePenLine, RotateCcw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorUpdatesState } from "./useVendorUpdates";

/** Title and refresh button. */
export function VendorUpdatesHeader({
  updates,
}: {
  updates: VendorUpdatesState;
}) {
  const { t } = useLanguage();
  const { loading, refetch } = updates;

  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
          <FilePenLine size={13} />
          {t("admin.vendorUpdates.eyebrow")}
        </p>

        <h1 className="font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
          {t("admin.vendorUpdates.title")}
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-[#958980]">
          {t("admin.vendorUpdates.subtitle")}
        </p>
      </div>

      <button
        type="button"
        onClick={refetch}
        disabled={loading}
        className="flex shrink-0 items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-4 py-2 text-xs font-semibold text-[#30251f] transition hover:border-[#b99a62] hover:bg-[#faf7f4] disabled:opacity-60"
      >
        <RotateCcw size={13} className={loading ? "animate-spin" : ""} />
        {t("admin.vendorUpdates.refresh")}
      </button>
    </div>
  );
}
