"use client";

import { Ban, Loader2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { InlineError, ModalOverlay } from "./VendorModal";

interface DeactivateVendorModalProps {
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
  error?: string;
}

export default function DeactivateVendorModal({
  onConfirm,
  onClose,
  loading,
  error,
}: DeactivateVendorModalProps) {
  const { t } = useLanguage();

  return (
    <ModalOverlay onClose={onClose} zIndex="z-[60]">
      <div
        className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#e7dfda] bg-white shadow-[0_30px_90px_rgba(48,37,31,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-6 sm:p-7">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Ban size={23} />
          </div>

          <div className="mt-5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-500">
              {t('admin.vendors.accountAccess')}
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#30251f]">
              {t('admin.vendors.deactivateConfirm')}
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#766b65]">
              {t('admin.vendors.deactivateDesc')}
            </p>
          </div>

          {error && (
            <div className="mt-5">
              <InlineError message={error} />
            </div>
          )}

          <div className="mt-6 flex gap-3">
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
              disabled={
                loading
              }
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#8b3d3d] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(139,61,61,0.55)] transition hover:bg-[#773535] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  {t('admin.vendors.deactivating')}
                </>
              ) : (
                <>
                  <Ban size={16} />
                  {t('admin.vendors.deactivate')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
