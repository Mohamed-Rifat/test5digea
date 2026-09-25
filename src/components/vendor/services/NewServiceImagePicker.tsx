"use client";

import { Plus, Trash2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { MAX_SERVICE_IMAGES } from "./serviceStatus";

interface NewServiceImagePickerProps {
  previews: string[];
  onSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

/** Thumbnails of the picked images + an "add photo" tile. */
export default function NewServiceImagePicker({
  previews,
  onSelect,
  onRemove,
}: NewServiceImagePickerProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between sm:mb-2">
        <p className="text-xs font-medium text-[#40352f] sm:text-sm">{t("vendor.services.form.images")}</p>
        <span className="text-[10px] font-medium text-[#9b8f86] sm:text-xs">
          {previews.length}/{MAX_SERVICE_IMAGES}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {previews.map((src, index) => (
          <div
            key={src}
            className="group relative h-20 w-20 overflow-hidden rounded-xl border border-[#e3d9d1] sm:h-24 sm:w-24"
          >
            <img
              loading="lazy"
              decoding="async"
              src={src}
              alt={t("vendor.services.form.selectedImageAlt", { number: index + 1 })}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute inset-e-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}

        {previews.length < MAX_SERVICE_IMAGES && (
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#d5c8be] bg-[#fcfaf8] text-[#9b8f86] transition hover:border-[#a47e43] hover:text-[#a47e43] sm:h-24 sm:w-24">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px]">{t("vendor.services.form.addPhoto")}</span>
            <input type="file" accept="image/*" multiple onChange={onSelect} className="hidden" />
          </label>
        )}
      </div>

      <p className="mt-1.5 text-[10px] text-[#9b8f86] sm:mt-2 sm:text-xs">
        {t("vendor.services.form.imagesHint")}{" "}
        <span className="font-medium text-[#756b65]">
          ({previews.length}/{MAX_SERVICE_IMAGES})
        </span>
      </p>
    </div>
  );
}
