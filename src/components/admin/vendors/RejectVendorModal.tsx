"use client";

import { Loader2, UserX } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { TextAreaField } from "@/components/ui";
import { CloseButton, InlineError, ModalOverlay } from "./VendorModal";

interface RejectVendorModalProps {
  reason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
  error?: string;
}

export default function RejectVendorModal({
  reason,
  onReasonChange,
  onConfirm,
  onClose,
  loading,
  error,
}: RejectVendorModalProps) {
  const { t } = useLanguage();

  return (
    <ModalOverlay onClose={onClose} zIndex="z-[60]">
      <div
        className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#e7dfda] bg-white shadow-[0_30px_90px_rgba(48,37,31,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-[#eee8e4] px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <UserX size={19} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-500">
                  {t('admin.vendors.reviewAction')}
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#30251f]">
                  {t('admin.vendors.rejectTitle')}
                </h2>

                <p className="mt-1 text-sm leading-5 text-[#766b65]">
                  {t('admin.vendors.rejectDesc')}
                </p>
              </div>
            </div>

            <CloseButton onClick={onClose} />
          </div>
        </div>


        <div className="p-5">
          <TextAreaField
            id="rejectReason"
            label={t("admin.vendors.rejectionReason")}
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder={t("admin.vendors.rejectionPlaceholder")}
            rows={5}
            autoFocus
          />

          {error && (
            <div className="mt-3">
              <InlineError message={error} />
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-12 flex-1 rounded-2xl border border-[#ddd4ce] px-4 text-sm font-semibold text-[#5f544e] transition hover:bg-[#f8f5f3]"
            >
              {t('admin.vendors.cancel')}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#8b3d3d] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(139,61,61,0.55)] transition hover:bg-[#773535] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  {t('admin.vendors.rejecting')}
                </>
              ) : (
                <>
                  <UserX size={16} />
                  {t('admin.vendors.rejectTitle')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
