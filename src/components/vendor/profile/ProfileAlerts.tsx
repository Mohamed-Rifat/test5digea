"use client";

import { AlertCircle, Clock3 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";

interface ProfileAlertsProps {
  vendor: Vendor | null;
  isLocked: boolean;
  /** Image-upload errors are shown here while the edit form is closed. */
  actionError: string | null;
  isEditingActive: boolean;
}

/** "Pending review", "rejected" and upload-error banners. */
export function ProfileAlerts({
  vendor,
  isLocked,
  actionError,
  isEditingActive,
}: ProfileAlertsProps) {
  const { t } = useLanguage();

  return (
    <>
      {isLocked && (
        <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">{t("vendor.profile.pending.title")}</p>
            <p className="mt-1 leading-6">{t("vendor.profile.pending.text")}</p>
          </div>
        </div>
      )}

      {/* =========================================================
          REJECTED ALERT
      ========================================================== */}
      {vendor?.status === "Rejected" && vendor.rejectionReason && (
        <div className="mb-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">
              {t("vendor.profile.needsAttention")}
            </p>
            <p className="mt-1">{vendor.rejectionReason}</p>
          </div>
        </div>
      )}

      {/* =========================================================
          IMAGE ACTION ERROR (shown outside the edit form)
      ========================================================== */}
      {!isEditingActive && actionError && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {actionError}
        </div>
      )}
    </>
  );
}
