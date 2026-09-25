"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

/** Red "needs attention" and green "action completed" banners. */
export default function FeedbackBanners({
  error,
  success,
}: {
  error?: string | null;
  success?: string;
}) {
  const { t } = useLanguage();

  if (!error && !success) return null;

  return (
    <div className="mb-6 space-y-3">
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700 shadow-sm">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100">
            <AlertCircle size={16} />
          </div>

          <div className="min-w-0">
            <p className="font-semibold">
              {t('admin.vendors.needAttentionMessage')}
            </p>

            <p className="mt-0.5 leading-5">
              {error}
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-700 shadow-sm">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
            <CheckCircle2 size={16} />
          </div>

          <div>
            <p className="font-semibold">
              {t('admin.vendors.actionCompleted')}
            </p>

            <p className="mt-0.5 break-all leading-5">
              {success}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
