"use client";

import { ChevronDown, ImageOff, SlidersHorizontal } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { SortMode } from "./vendorDetailUtils";
import type { VendorDetail } from "./useVendorDetail";
import { VendorServiceCard, VendorServicesSkeleton } from "./VendorServiceCard";

type VendorServicesSectionProps = Pick<
  VendorDetail,
  | "servicesLoading"
  | "availableServices"
  | "categoryOptions"
  | "hasMultipleCategories"
  | "activeCategoryId"
  | "setActiveCategoryId"
  | "sortMode"
  | "setSortMode"
  | "sortOptions"
  | "orderedServices"
  | "displayedServices"
>;

/** "Services" block: count, category chips, sort menu and the cards grid. */
export function VendorServicesSection({
  servicesLoading,
  availableServices,
  categoryOptions,
  hasMultipleCategories,
  activeCategoryId,
  setActiveCategoryId,
  sortMode,
  setSortMode,
  sortOptions,
  orderedServices,
  displayedServices,
}: VendorServicesSectionProps) {
  const { t, localize } = useLanguage();

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">

        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
            {t("vendors.detail.services.eyebrow")}
          </p>

          <h2 className="font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
            {t("vendors.detail.services.title")}
          </h2>
        </div>

        {!servicesLoading &&
          availableServices.length > 0 && (
            <span className="shrink-0 text-xs text-[#9b8f86]">
              {availableServices.length === 1
                ? t("vendors.detail.services.countOne", {
                    count: availableServices.length,
                  })
                : t("vendors.detail.services.countMany", {
                    count: availableServices.length,
                  })}
            </span>
          )}
      </div>

      {/* Category filter + sort */}
      {!servicesLoading &&
        availableServices.length > 1 && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

            {hasMultipleCategories ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategoryId("")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    activeCategoryId === ""
                      ? "bg-[#30251f] text-white"
                      : "border border-[#e4dbd0] bg-white text-[#5f544d] hover:border-[#c9bcae]"
                  }`}
                >
                  {t("vendors.detail.services.all")}
                </button>

                {categoryOptions.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setActiveCategoryId(category.id)
                    }
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      activeCategoryId === category.id
                        ? "bg-[#30251f] text-white"
                        : "border border-[#e4dbd0] bg-white text-[#5f544d] hover:border-[#c9bcae]"
                    }`}
                  >
                    {localize(category.name)}{" "}
                    <span
                      className={
                        activeCategoryId === category.id
                          ? "text-white/70"
                          : "text-[#9b8f86]"
                      }
                    >
                      ({category.count})
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <span />
            )}

            <div className="relative shrink-0">
              <SlidersHorizontal
                size={13}
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#a47e43]"
              />

              <select
                value={sortMode}
                onChange={(e) =>
                  setSortMode(e.target.value as SortMode)
                }
                className="appearance-none rounded-full border border-[#e4dbd0] bg-white py-1.5 ps-8 pe-8 text-xs font-semibold text-[#5f544d] outline-none transition hover:border-[#c9bcae] focus-visible:ring-2 focus-visible:ring-[#b99a62]/40"
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={13}
                className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#a47e43]"
              />
            </div>
          </div>
        )}

      {/* Loading */}
      {servicesLoading && (
        <VendorServicesSkeleton />
      )}

      {/* Empty */}
      {!servicesLoading &&
        availableServices.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#dfd2c5] bg-white px-6 py-14 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4eee9]">
              <ImageOff
                size={22}
                className="text-[#b99a62]"
              />
            </div>

            <p className="text-sm font-medium text-[#30251f]">
              {t("vendors.detail.services.emptyTitle")}
            </p>

            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-[#9b8f86]">
              {t("vendors.detail.services.emptyText")}
            </p>
          </div>
        )}

      {/* No services match the selected category */}
      {!servicesLoading &&
        availableServices.length > 0 &&
        orderedServices.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#dfd2c5] bg-white px-6 py-10 text-center">
            <p className="text-sm font-medium text-[#30251f]">
              {t("vendors.detail.services.noneInCategory")}
            </p>

            <button
              type="button"
              onClick={() => setActiveCategoryId("")}
              className="mt-3 text-xs font-semibold text-[#a47e43] underline-offset-2 hover:underline"
            >
              {t("vendors.detail.services.clearFilter")}
            </button>
          </div>
        )}

      {/* =================================================
          PREMIUM SERVICE CARDS
      ================================================= */}

      {!servicesLoading &&
        displayedServices.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {displayedServices.map((service) => (
              <VendorServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

    </section>
  );
}
