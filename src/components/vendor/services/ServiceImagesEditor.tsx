"use client";

import { Images as ImagesIcon, Info, Plus, RotateCcw, Trash2, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { EditServiceForm } from "./useEditServiceForm";
import SectionCard from "./SectionCard";
import { MAX_SERVICE_IMAGES } from "./serviceStatus";

type Props = Pick<
  EditServiceForm,
  | "existingImages"
  | "newImages"
  | "removedImageIds"
  | "totalImageCount"
  | "remainingImageSlots"
  | "canAddImages"
  | "handleImagesSelected"
  | "removeNewImage"
  | "toggleRemoveExistingImage"
  | "saving"
> & { serviceName: string };

/** Existing images (removable), newly picked images and the "add photo" tile. */
export default function ServiceImagesEditor({
  serviceName,
  existingImages,
  newImages,
  removedImageIds,
  totalImageCount,
  remainingImageSlots,
  canAddImages,
  handleImagesSelected,
  removeNewImage,
  toggleRemoveExistingImage,
  saving,
}: Props) {
  const { t } = useLanguage();
  const full = totalImageCount >= MAX_SERVICE_IMAGES;

  return (
    <SectionCard
      icon={ImagesIcon}
      title={t("vendor.services.form.images")}
      subtitle={t("vendor.services.detail.imagesSub")}
      aside={
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${
            full ? "bg-amber-50 text-amber-700" : "bg-[#f5eee9] text-[#756b65]"
          }`}
        >
          {totalImageCount}/{MAX_SERVICE_IMAGES}
        </span>
      }
    >
      <div className="mb-4 flex items-start gap-2 rounded-xl bg-[#faf6f1] px-3 py-2.5 text-[11px] leading-5 text-[#6f5f52] sm:text-xs">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a47e43]" />
        <span>
          {t("vendor.services.detail.imagesReviewNote")}
          <span className="ms-1 font-semibold text-[#a47e43]">
            {MAX_SERVICE_IMAGES} {t("vendor.services.detail.imagesMaxLabel")}
          </span>
        </span>
      </div>

      {full && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700">
          <Info className="h-4 w-4 shrink-0" />
          <span>{t("vendor.services.detail.imagesMaxReached")}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {existingImages.map((image) => {
          const isRemoving = removedImageIds.includes(image.id);
          const actionLabel = isRemoving
            ? t("vendor.services.detail.imageStatus.undoRemove")
            : t("vendor.services.detail.imageStatus.remove");

          return (
            <div key={image.id} className="space-y-1.5">
              <div className="group relative aspect-square overflow-hidden rounded-xl border-2 border-[#e3d9d1]">
                <img
                  loading="lazy"
                  decoding="async"
                  src={image.url}
                  alt={serviceName}
                  className={`h-full w-full object-cover transition ${isRemoving ? "opacity-30 grayscale" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => toggleRemoveExistingImage(image.id)}
                  disabled={saving}
                  aria-label={actionLabel}
                  title={actionLabel}
                  className="absolute end-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75 focus-visible:opacity-100 disabled:opacity-60 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  {isRemoving ? <RotateCcw className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                </button>
              </div>

              {isRemoving && (
                <p className="text-[10px] leading-4 text-red-600">
                  {t("vendor.services.detail.imageStatus.removeOnSave")}
                </p>
              )}
            </div>
          );
        })}

        {newImages.map((item, index) => (
          <div key={item.preview} className="space-y-1.5">
            <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-[#a47e43]">
              <img
                loading="lazy"
                decoding="async"
                src={item.preview}
                alt={serviceName}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-1.5 start-1.5 inline-flex items-center gap-1 rounded-full bg-[#a47e43] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                <Plus className="h-3 w-3" />
                {t("vendor.services.detail.imageStatus.new")}
              </span>
              <button
                type="button"
                onClick={() => removeNewImage(index)}
                disabled={saving}
                aria-label={t("vendor.services.detail.imageStatus.removeNew")}
                title={t("vendor.services.detail.imageStatus.removeNew")}
                className="absolute end-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75 disabled:opacity-60"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-[10px] leading-4 text-[#a47e43]">
              {t("vendor.services.detail.imageStatus.willBeSent")}
            </p>
          </div>
        ))}

        {canAddImages && (
          <label
            className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#d5c8be] bg-[#fcfaf8] text-[#9b8f86] transition hover:border-[#a47e43] hover:text-[#a47e43] ${
              saving ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="px-1 text-center text-[10px]">{t("vendor.services.form.addPhoto")}</span>
            <span className="text-[9px] text-[#b0a39a]">
              {remainingImageSlots} {t("vendor.services.detail.imagesRemaining")}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={saving}
              onChange={handleImagesSelected}
              className="hidden"
            />
          </label>
        )}
      </div>

      {existingImages.length === 0 && newImages.length === 0 && (
        <p className="mt-3 text-[10px] text-[#9b8f86] sm:text-xs">{t("vendor.services.detail.noImages")}</p>
      )}
    </SectionCard>
  );
}
