"use client";

import Link from "next/link";
import { ChevronRight, ImageOff, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";
import { Rank } from "@/components/public/compare/CompareCells";
import { LABEL_COL_WIDTH } from "@/components/public/compare/compareUtils";

import type { CompareData } from "./useCompareData";

/** Sticky row with each item's image, name and remove button. */
export function CompareHeaderRow({ data }: { data: CompareData }) {
  const { t } = useLanguage();
  const {
    vendorProfiles,
    setLightbox,
    isServiceComparison,
    items,
    serviceImages,
    vendorImages,
    handleRemove,
    gridTemplate,
  } = data;

  return (
    <div
      className="grid sticky top-0 z-30 border-b border-[#e5e7eb] bg-white"
      style={{
        gridTemplateColumns: `${LABEL_COL_WIDTH}px ${gridTemplate}`,
      }}
    >
      <div
        className="sticky start-0 z-20 flex items-end bg-[#fafafa] px-4 pb-4 pt-5"
        style={{
          width: LABEL_COL_WIDTH,
          minWidth: LABEL_COL_WIDTH,
        }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
          {t("compare.comparison")}
        </span>
      </div>

      {items.map((item, idx) => {
        const s = item as Service;
        const v = item as Vendor;

        // ── Header image ──
        // Services: vendor's profile photo, fetched separately
        // into vendorProfiles (service photos are shown in the
        // gallery row further down, never here).
        // Vendors:  profile photo (or first gallery image as fallback)
        const serviceGallery = isServiceComparison ? serviceImages(s) : [];
        const vendorGallery = !isServiceComparison ? vendorImages(v) : [];

        const headerImage = isServiceComparison
          ? vendorProfiles[s.vendorId] || null
          : v.profileImageUrl || vendorGallery[0]?.url || null;

        // ── Lightbox source ──
        const lightboxImages = isServiceComparison
          ? serviceGallery
          : vendorGallery;

        const title = isServiceComparison ? s.name : v.businessName;
        const href = isServiceComparison
          ? `/services/${item.id}`
          : `/vendors/${item.id}`;

        const canZoom = lightboxImages.length > 0;

        return (
          <div
            key={item.id}
            className="relative border-l border-[#e5e7eb] px-4 pb-4 pt-5"
          >
            {/* Remove btn */}
            {isServiceComparison && (
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                aria-label={t("compare.removeItem", { title })}
                className="absolute end-3 top-3 z-10 inline-flex h-6 w-6 items-center justify-center rounded-md text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#b91c1c]"
              >
                <X size={14} />
              </button>
            )}

            <div className="flex flex-col">
              {/* Rank */}
              <div className="mb-3 flex items-center gap-2">
                <Rank n={idx + 1} />
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#9ca3af]">
                  {t("compare.item")}
                </span>
              </div>

              {/* Header image */}
              <button
                type="button"
                onClick={() => {
                  if (canZoom) {
                    setLightbox({
                      images: lightboxImages,
                      index: 0,
                      title,
                    });
                  }
                }}
                disabled={!canZoom}
                className={`group relative mb-3 block aspect-[4/3] w-full overflow-hidden rounded-md border border-[#e5e7eb] bg-[#f9fafb] transition ${
                  canZoom
                    ? "cursor-zoom-in hover:border-[#d1d5db]"
                    : "cursor-default"
                }`}
              >
                {headerImage ? (
                  <>
                    <img
                      loading="lazy"
                      decoding="async"
                      src={headerImage}
                      alt={title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/[0.04]" />
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageOff size={20} className="text-[#d1d5db]" />
                  </div>
                )}
              </button>

              <h2 className="line-clamp-2 text-[14px] font-semibold leading-[1.4] text-[#111827]">
                {title}
              </h2>

              <Link
                href={href}
                className="mt-1.5 inline-flex w-fit items-center gap-0.5 text-[12.5px] font-medium text-[#1d4ed8] hover:underline"
              >
                {t("compare.viewDetails")}
                <ChevronRight size={12} className="rtl:rotate-180" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
