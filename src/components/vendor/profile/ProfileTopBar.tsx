"use client";

import { Clock3, RotateCcw, Settings2, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

interface ProfileTopBarProps {
  businessName: string;
  isRejected: boolean;
  isResubmitting: boolean;
  isLocked: boolean;
  isEditing: boolean;
  onResubmit: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

/** Page title + resubmit / edit / cancel buttons. */
export function ProfileTopBar({
  businessName,
  isRejected,
  isResubmitting,
  isLocked,
  isEditing,
  onResubmit,
  onEdit,
  onCancel,
}: ProfileTopBarProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] rtl:tracking-normal text-[#9b8171]">
          {t("vendor.profile.eyebrow")}
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
          {businessName || t("vendor.profile.defaultName")}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {isRejected && (
          <button
            type="button"
            onClick={onResubmit}
            disabled={isResubmitting}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 text-sm font-medium text-[#514740] transition hover:bg-[#f7f2ef] disabled:opacity-60"
          >
            <RotateCcw
              className={`h-4 w-4 ${isResubmitting ? "animate-spin" : ""}`}
            />
            {t("vendor.profile.resubmit")}
          </button>
        )}

        {isLocked ? (
          <button
            type="button"
            disabled
            title={t("vendor.profile.pending.buttonHint")}
            className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 text-sm font-semibold text-amber-700 opacity-90"
          >
            <Clock3 className="h-4 w-4" />
            {t("vendor.profile.pending.button")}
          </button>
        ) : !isEditing ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#30251f] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#463831]"
          >
            <Settings2 className="h-4 w-4" />
            {t("vendor.profile.profileSettings")}
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-5 text-sm font-semibold text-[#514740] transition hover:bg-[#f7f2ef]"
          >
            <X className="h-4 w-4" />
            {t("vendor.profile.cancel")}
          </button>
        )}
      </div>
    </div>
  );
}
