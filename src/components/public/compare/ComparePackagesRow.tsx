"use client";

import { Package } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/format";
import { LabelCell, ValueCell } from "@/components/public/compare/CompareCells";
import { LABEL_COL_WIDTH } from "@/components/public/compare/compareUtils";

import type { CompareData } from "./useCompareData";

/** Price packages per service. */
export function ComparePackagesRow({ data }: { data: CompareData }) {
  const { t } = useLanguage();
  const { services, isServiceComparison, best, gridTemplate } = data;

  return (
    <>
      {isServiceComparison && (
        <div
          className="grid hover:bg-[#fafafa]"
          style={{
            gridTemplateColumns: `${LABEL_COL_WIDTH}px ${gridTemplate}`,
          }}
        >
          <LabelCell icon={<Package size={13} />}>
            {t("compare.packages")}
          </LabelCell>
          {services.map((service) => {
            const hasPrices = !!service.prices?.length;
            const minPrice = hasPrices
              ? Math.min(...(service.prices || []).map((p) => Number(p.price)))
              : Infinity;
            const isCheapest =
              best.hasMultiple && hasPrices && minPrice === best.overallMin;

            return (
              <ValueCell key={`pkg-${service.id}`} emphasized={isCheapest}>
                {hasPrices ? (
                  <div className="space-y-1.5">
                    {service.prices!.map((price) => {
                      const isRowBest =
                        best.hasMultiple &&
                        Number(price.price) === best.overallMin;
                      return (
                        <div
                          key={price.id}
                          className="flex items-baseline justify-between gap-3 rounded border border-[#f3f4f6] bg-[#fafafa] px-2.5 py-1.5"
                        >
                          <span className="min-w-0 truncate text-[12.5px] text-[#4b5563]">
                            {price.label}
                          </span>
                          <span
                            className={`shrink-0 text-[13px] tabular-nums ${
                              isRowBest
                                ? "font-semibold text-[#111827]"
                                : "font-medium text-[#374151]"
                            }`}
                          >
                            {formatPrice(price.price)}{" "}
                            <span className="text-[11px] font-normal text-[#6b7280]">
                              {t("common.currency")}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-[12.5px] text-[#6b7280]">
                    {t("compare.contactVendor")}
                  </span>
                )}
              </ValueCell>
            );
          })}
        </div>
      )}
    </>
  );
}
