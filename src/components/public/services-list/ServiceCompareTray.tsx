"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { GitCompare } from "lucide-react";

import type { ServicesListState } from "./useServicesList";

/** Bottom tray with the services picked for comparison. */
export function ServiceCompareTray({ state }: { state: ServicesListState }) {
  const { t, localize } = useLanguage();
  const { handleClearCompare, selected } = state;

  return (
    <>
      {selected.length > 0 && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#30251f] px-4 pt-3 text-white shadow-[0_-12px_30px_rgba(48,37,31,0.25)] sm:px-6"
          style={{
            paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm">
              {selected.length > 1
                ? t("services.list.selectedMany", {
                    count: selected.length,
                    category: localize(selected[0].categoryName),
                  })
                : t("services.list.selectedOne", {
                    count: selected.length,
                    category: localize(selected[0].categoryName),
                  })}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearCompare}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-white/80 hover:text-white"
              >
                {t("compare.clearAll")}
              </button>

              <Link
                href={
                  selected.length >= 2
                    ? `/compare?type=service&ids=${selected.map((s) => s.id).join(",")}&categoryId=${selected[0].categoryId}`
                    : "#"
                }
                aria-disabled={selected.length < 2}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold ${
                  selected.length >= 2
                    ? "bg-white text-[#30251f]"
                    : "pointer-events-none bg-white/30 text-white/60"
                }`}
              >
                <GitCompare size={15} />
                {t("services.list.compareButton", { count: selected.length })}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
