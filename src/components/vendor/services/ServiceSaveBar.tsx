"use client";

import { CheckCircle, Loader2, Save } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

interface ServiceSaveBarProps {
  hasChanges: boolean;
  saving: boolean;
  savedImagesCount: number | null;
  onDiscard: () => void;
}

/** Sticky bar at the bottom of the edit form: status text + discard / save. */
export default function ServiceSaveBar({
  hasChanges,
  saving,
  savedImagesCount,
  onDiscard,
}: ServiceSaveBarProps) {
  const { t } = useLanguage();

  return (
    <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-2xl border border-[#e8dfd8] bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {hasChanges ? (
          <>
            <p className="text-sm font-semibold text-[#30251f]">{t("vendor.services.detail.unsavedTitle")}</p>
            <p className="mt-0.5 text-xs text-[#756b65]">{t("vendor.services.detail.unsavedText")}</p>
          </>
        ) : savedImagesCount !== null ? (
          <div className="flex items-start gap-2 text-emerald-700">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="text-sm font-semibold">{t("vendor.services.detail.savedAll")}</p>
              {savedImagesCount > 0 && (
                <p className="mt-0.5 text-xs text-[#756b65]">
                  {t(
                    savedImagesCount === 1
                      ? "vendor.services.detail.savedImagesOne"
                      : "vendor.services.detail.savedImagesMany",
                    { count: savedImagesCount }
                  )}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#9b8f86]">{t("vendor.services.detail.noChanges")}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {hasChanges && !saving && (
          <button
            type="button"
            onClick={onDiscard}
            className="h-10 rounded-xl px-4 text-xs font-medium text-[#514740] transition hover:bg-[#f7f2ef] sm:h-11 sm:text-sm"
          >
            {t("vendor.services.detail.discard")}
          </button>
        )}

        <button
          type="submit"
          disabled={!hasChanges || saving}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-5 text-xs font-medium text-white transition hover:bg-[#463831] disabled:opacity-50 sm:h-11 sm:px-6 sm:text-sm"
        >
          {saving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
              {t("vendor.services.detail.saving")}
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {t("vendor.services.detail.saveAll")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
