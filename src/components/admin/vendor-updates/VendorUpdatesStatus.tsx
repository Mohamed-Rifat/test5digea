"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorUpdatesState } from "./useVendorUpdates";

/** Scan progress / result count line. */
export function VendorUpdatesStatus({
  updates,
}: {
  updates: VendorUpdatesState;
}) {
  const { t } = useLanguage();
  const { scanning, vendors, loading, progress, failedCount } = updates;

  return (
    <div className="mb-4 flex min-h-6 flex-wrap items-center gap-3 text-xs text-[#8a7f78]">
      {scanning && (
        <span className="inline-flex items-center gap-2">
          <Loader2 size={13} className="animate-spin text-[#a47e43]" />
          {t("admin.vendorUpdates.checking", {
            done: progress.done,
            total: progress.total,
          })}
        </span>
      )}

      {vendors.length > 0 && (
        <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
          {vendors.length === 1
            ? t("admin.vendorUpdates.awaitingOne")
            : t("admin.vendorUpdates.awaitingMany", { count: vendors.length })}
        </span>
      )}

      {!loading && failedCount > 0 && (
        <span className="inline-flex items-center gap-1.5 text-amber-700">
          <AlertCircle size={13} />
          {t("admin.vendorUpdates.partialWarning", { count: failedCount })}
        </span>
      )}
    </div>
  );
}
