"use client";

import { Loader2, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { TextAreaField } from "@/components/ui";

interface RejectServiceModalProps {
  serviceName: string;
  vendorName?: string;
  reason: string;
  onReasonChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
  subtitle?: string;
  placeholder?: string;
}

/** Asks for a rejection reason before rejecting a service. */
export function RejectServiceModal({
  serviceName,
  vendorName,
  reason,
  onReasonChange,
  onConfirm,
  onClose,
  loading,
  subtitle,
  placeholder,
}: RejectServiceModalProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t("admin.services.rejectTitle")}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {subtitle ?? t("admin.services.reasonRequired")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {t("admin.services.service")}
            </p>
            <p className="mt-1 font-medium text-gray-900">{serviceName}</p>
            {vendorName && (
              <p className="mt-0.5 text-sm text-gray-500">{vendorName}</p>
            )}
          </div>

          <TextAreaField
            id="rejectionReason"
            label={t("admin.services.rejectionReason")}
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder={placeholder ?? t("admin.services.reasonPlaceholder")}
            rows={5}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {t("admin.services.cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || !reason.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t("admin.services.rejecting")}
              </>
            ) : (
              <>
                <X size={16} />
                {t("admin.services.rejectTitle")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
