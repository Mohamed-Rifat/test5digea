"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { GitCompare } from "lucide-react";

import type { VendorsListState } from "./useVendorsList";

/** Sticky bar that collects vendors to compare. */
export function VendorCompareBar({ state }: { state: VendorsListState }) {
  const { t } = useLanguage();
  const { categoryId, selected, clearSelected } = state;

  return (
    <>
      {selected.length > 0 && (
        <div className="sticky bottom-4 z-20 mb-6 overflow-hidden rounded-2xl bg-linear-to-r from-[#30251f] to-[#42332a] px-4 py-3.5 text-white shadow-[0_16px_40px_rgba(48,37,31,0.28)] sm:flex sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
              {selected.length}
            </span>
            <span className="text-sm font-medium">
              {selected.length === 1
                ? t("vendors.list.selectedOne")
                : t("vendors.list.selectedMany")}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 sm:mt-0">
            <button
              type="button"
              onClick={clearSelected}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:text-white"
            >
              {t("compare.clearAll")}
            </button>
            <Link
              href={
                selected.length >= 2 && categoryId
                  ? `/compare?type=vendor&ids=${selected.join(
                      ",",
                    )}&categoryId=${categoryId}`
                  : "#"
              }
              aria-disabled={selected.length < 2 || !categoryId}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                selected.length >= 2 && categoryId
                  ? "bg-white text-[#30251f] hover:bg-[#f5efe8]"
                  : "pointer-events-none bg-white/20 text-white/50"
              }`}
            >
              <GitCompare size={15} />
              {t("vendors.list.compareButton", { count: selected.length })}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
