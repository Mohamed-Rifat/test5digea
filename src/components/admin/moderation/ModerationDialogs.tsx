"use client";

import { Check, Loader2, X } from "lucide-react";
import ImageLightbox from "@/components/shared/ImageLightbox";
import { useLanguage } from "@/context/LanguageContext";
import { ModerationStatus } from "@/types/moderation";

import { TextAreaField } from "@/components/ui";
import type { ModerationQueueState } from "./useModerationPage";

/** Reject-image dialog and the image preview lightbox. */
export function ModerationDialogs({ queue }: { queue: ModerationQueueState }) {
  const { t } = useLanguage();
  const {
    imageActionId,
    rejectTarget,
    rejectReason,
    setRejectReason,
    previewItem,
    setPreviewItem,
    handleApproveImage,
    openRejectModal,
    closeRejectModal,
    handleRejectImage,
  } = queue;

  return (
    <>
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-sm font-semibold text-[#30251f]">
              {t("admin.moderation.modal.title")}
            </h2>

            <p className="mt-1 text-xs text-[#958980]">
              {t("admin.moderation.modal.text", { title: rejectTarget.title })}
            </p>

            <TextAreaField
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              disabled={imageActionId === rejectTarget.entityId}
              placeholder={t("admin.moderation.modal.placeholder")}
              aria-label={t("admin.moderation.modal.title")}
              rows={4}
              containerClassName="mt-4"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeRejectModal}
                disabled={imageActionId === rejectTarget.entityId}
                className="rounded-full border border-[#e4dbd0] bg-white px-4 py-2 text-xs font-semibold text-[#30251f] transition hover:bg-[#faf7f4] disabled:opacity-60"
              >
                {t("admin.moderation.modal.cancel")}
              </button>

              <button
                type="button"
                onClick={handleRejectImage}
                disabled={
                  imageActionId === rejectTarget.entityId ||
                  !rejectReason.trim()
                }
                className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {imageActionId === rejectTarget.entityId ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <X size={13} />
                )}
                {t("admin.moderation.modal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image preview lightbox — view full size before deciding */}
      {previewItem?.imageUrl && (
        <>
          <ImageLightbox
            images={[{ id: previewItem.entityId, url: previewItem.imageUrl }]}
            open={!!previewItem}
            onClose={() => setPreviewItem(null)}
            title={previewItem.title}
          />

          {previewItem.status === ModerationStatus.Pending && (
            <div className="fixed inset-x-0 bottom-0 z-[110] flex justify-center px-4 pb-6 sm:pb-8">
              <div className="flex items-center gap-3 rounded-full bg-white/95 p-2 ps-4 shadow-2xl backdrop-blur">
                <span className="hidden text-xs font-medium text-[#30251f] sm:inline">
                  {previewItem.title}
                </span>

                <button
                  type="button"
                  disabled={imageActionId === previewItem.entityId}
                  onClick={() => handleApproveImage(previewItem)}
                  className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {imageActionId === previewItem.entityId ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  {t("admin.moderation.approve")}
                </button>

                <button
                  type="button"
                  disabled={imageActionId === previewItem.entityId}
                  onClick={() => openRejectModal(previewItem)}
                  className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  <X size={14} />
                  {t("admin.moderation.reject")}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
