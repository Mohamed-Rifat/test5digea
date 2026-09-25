"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";
import { LabelCell, ValueCell } from "@/components/public/compare/CompareCells";
import { LABEL_COL_WIDTH } from "@/components/public/compare/compareUtils";

import type { CompareData } from "./useCompareData";

/** Image thumbnails per item (open the lightbox). */
export function CompareGalleryRow({ data }: { data: CompareData }) {
  const { t } = useLanguage();
  const {
    setLightbox,
    isServiceComparison,
    items,
    serviceImages,
    vendorImages,
    gridTemplate,
  } = data;

  return (
    <div
      className="grid hover:bg-[#fafafa]"
      style={{
        gridTemplateColumns: `${LABEL_COL_WIDTH}px ${gridTemplate}`,
      }}
    >
      <LabelCell>{t("compare.gallery")}</LabelCell>
      {items.map((item) => {
        const s = item as Service;
        const v = item as Vendor;
        const images = isServiceComparison ? serviceImages(s) : vendorImages(v);
        const title = isServiceComparison ? s.name : v.businessName;
        const visible = images.slice(0, 4);
        const extra = images.length - visible.length;

        return (
          <ValueCell key={`gal-${item.id}`}>
            {images.length ? (
              <div className="grid grid-cols-4 gap-1">
                {visible.map((img, i) => {
                  const isLast = i === visible.length - 1;
                  const showOverlay = isLast && extra > 0;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setLightbox({ images, index: i, title })}
                      className="group relative aspect-square overflow-hidden rounded border border-[#e5e7eb] bg-[#f9fafb] transition hover:border-[#d1d5db]"
                    >
                      <img
                        loading="lazy"
                        decoding="async"
                        src={img.url}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      {showOverlay && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-[11px] font-semibold text-white">
                          +{extra}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-14 items-center justify-center rounded border border-dashed border-[#e5e7eb] text-[11.5px] text-[#9ca3af]">
                {t("compare.noImages")}
              </div>
            )}
          </ValueCell>
        );
      })}
    </div>
  );
}
