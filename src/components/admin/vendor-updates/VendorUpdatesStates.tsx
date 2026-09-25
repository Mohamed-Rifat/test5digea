"use client";

import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorUpdatesState } from "./useVendorUpdates";

/** Skeleton, error and empty states. */
export function VendorUpdatesStates({
  updates,
}: {
  updates: VendorUpdatesState;
}) {
  const { t } = useLanguage();
  const { vendors, loading, error } = updates;

  return (
    <>
      {loading && vendors.length === 0 && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-[#eee7e1] bg-white"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {t("admin.vendorUpdates.loadFailed")}
        </p>
      )}

      {/* Empty */}
      {!loading && !error && vendors.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[#dfd2c5] bg-white px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 size={24} className="text-emerald-600" />
          </div>

          <p className="text-sm font-medium text-[#30251f]">
            {t("admin.vendorUpdates.emptyTitle")}
          </p>

          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-[#9b8f86]">
            {t("admin.vendorUpdates.emptyText")}
          </p>
        </div>
      )}
    </>
  );
}
