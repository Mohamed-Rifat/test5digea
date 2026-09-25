"use client";

import { Info } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import ImageLightbox from "@/components/shared/ImageLightbox";
import { CompareAttributeRows } from "@/components/public/compare/CompareAttributeRows";
import { CompareGalleryRow } from "@/components/public/compare/CompareGalleryRow";
import { CompareHeaderRow } from "@/components/public/compare/CompareHeaderRow";
import { ComparePackagesRow } from "@/components/public/compare/ComparePackagesRow";
import {
  EmptyState,
  ErrorStateBlock,
  LoadingState,
} from "@/components/public/compare/CompareStates";
import { CompareTitle } from "@/components/public/compare/CompareTitle";
import { CompareTopBar } from "@/components/public/compare/CompareTopBar";
import {
  LABEL_COL_WIDTH,
  MAX_COMPARE,
} from "@/components/public/compare/compareUtils";
import { useCompareData } from "@/components/public/compare/useCompareData";

/** Side-by-side comparison of services (same category) or vendors. */
export default function ComparePage() {
  const { t } = useLanguage();
  const data = useCompareData();
  const { loading, error, items, isServiceComparison, lightbox } = data;

  return (
    <main className="min-h-screen bg-white">
      <CompareTopBar data={data} />

      <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        <CompareTitle data={data} />

        {loading ? (
          <LoadingState
            columns={Math.max(
              2,
              Math.min(MAX_COMPARE, data.urlIds.length || 2),
            )}
          />
        ) : error ? (
          <ErrorStateBlock
            text={data.errorText}
            href={isServiceComparison ? "/services" : "/vendors"}
            cta={t("compare.backToMarketplace")}
          />
        ) : items.length < 2 ? (
          <EmptyState text={t("compare.errors.selectTwo")} />
        ) : (
          <>
            {isServiceComparison && (
              <div className="mt-5 flex items-start gap-2 rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-2.5 text-[12.5px] text-[#4b5563]">
                <Info size={14} className="mt-0.5 shrink-0 text-[#6b7280]" />
                <span>{t("compare.sameCategoryNotice")}</span>
              </div>
            )}

            <div className="mt-5 overflow-hidden rounded-lg border border-[#e5e7eb]">
              <div className="overflow-x-auto">
                <div style={{ minWidth: LABEL_COL_WIDTH + items.length * 220 }}>
                  <CompareHeaderRow data={data} />
                  <CompareAttributeRows data={data} />
                  <ComparePackagesRow data={data} />
                  <CompareGalleryRow data={data} />
                </div>
              </div>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-[#9ca3af]">
              <Info size={12} />
              {t("compare.tip")}
            </p>
          </>
        )}
      </div>

      <ImageLightbox
        images={lightbox?.images || []}
        initialIndex={lightbox?.index || 0}
        open={lightbox !== null}
        onClose={() => data.setLightbox(null)}
        title={lightbox?.title}
      />
    </main>
  );
}
