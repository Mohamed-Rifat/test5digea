"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Award, GitCompare, ImageOff, MapPin, X } from "lucide-react";

import RatingStars from "@/components/shared/RatingStars";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice, startingPrice } from "@/lib/format";
import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";

interface FavoritesCompareModalProps {
  open: boolean;
  onClose: () => void;
  type: "service" | "vendor";
  services: Service[];
  vendors: Vendor[];
  /** Link to the full comparison page (hidden when it can't be built). */
  fullPageHref?: string;
  onRemove: (id: string) => void;
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-e border-[#eee5df] bg-[#faf8f6] p-4 text-xs font-semibold text-[#665951]">
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#faf2e4] px-2 py-0.5 text-[10px] font-semibold text-[#8a6a2c]">
      <Award size={11} />
      {children}
    </span>
  );
}

export default function FavoritesCompareModal({
  open,
  onClose,
  type,
  services,
  vendors,
  fullPageHref,
  onRemove,
}: FavoritesCompareModalProps) {
  const { t } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes, the page behind doesn't scroll while the popup is open.
  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const isService = type === "service";
  const count = isService ? services.length : vendors.length;

  // "Best" hints — only shown when the items actually differ.
  const servicePrices = services.map((s) => startingPrice(s.prices));
  const pricedValues = servicePrices.filter((p): p is number => p !== null);
  const lowestPrice =
    pricedValues.length >= 2 && new Set(pricedValues).size > 1
      ? Math.min(...pricedValues)
      : null;

  const ratings = vendors.map((v) => Number(v.averageRating || 0));
  const topRating =
    ratings.length >= 2 && new Set(ratings).size > 1 ? Math.max(...ratings) : null;

  const serviceImage = (service: Service) =>
    [...(service.images ?? [])].sort((a, b) => a.displayOrder - b.displayOrder)[0]
      ?.url;

  return (
    <div
      className="fixed inset-0 z-80 flex items-end justify-center bg-[#30251f]/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="favorites-compare-title"
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_30px_80px_rgba(48,37,31,0.35)] sm:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#eee5df] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[#a47e43]">
              <GitCompare size={15} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] rtl:tracking-normal">
                {t("compare.eyebrow")}
              </span>
            </div>
            <h2
              id="favorites-compare-title"
              className="mt-1 font-serif text-2xl font-light text-[#30251f]"
            >
              {isService ? t("compare.titleServices") : t("compare.titleVendors")}
            </h2>
            <p className="mt-1 text-xs leading-5 text-[#81746d]">
              {t("favorites.compare.modalSubtitle")}
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#9b8f86] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <div
            className="grid min-w-160"
            style={{
              gridTemplateColumns: `130px repeat(${count}, minmax(190px, 1fr))`,
            }}
          >
            {/* Item headers */}
            <div className="border-b border-e border-[#eee5df] bg-[#faf8f6] p-4 text-[10px] font-semibold uppercase tracking-[0.25em] rtl:tracking-normal text-[#a09289]">
              {t("compare.comparison")}
            </div>

            {isService
              ? services.map((service, index) => {
                  const image = serviceImage(service);
                  const price = servicePrices[index];

                  return (
                    <div
                      key={service.id}
                      className="border-b border-[#eee5df] p-4"
                    >
                      <div className="relative mb-3 flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-[#f4eee9]">
                        {image ? (
                          <img
                            loading="lazy"
                            decoding="async"
                            src={image}
                            alt={service.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageOff size={24} className="text-[#c8bbb0]" />
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[#30251f]">
                          {service.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemove(service.id)}
                          aria-label={t("favorites.compare.removeFromCompare", {
                            title: service.name,
                          })}
                          className="shrink-0 rounded-full p-1.5 text-[#9b8f86] transition hover:bg-[#f7f0eb] hover:text-[#30251f]"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {lowestPrice !== null && price === lowestPrice && (
                        <div className="mt-2">
                          <Badge>{t("favorites.compare.lowestPrice")}</Badge>
                        </div>
                      )}

                      <Link
                        href={`/services/${service.id}`}
                        className="mt-2 inline-flex text-xs font-semibold text-[#a47e43] hover:underline"
                      >
                        {t("compare.viewDetails")}
                      </Link>
                    </div>
                  );
                })
              : vendors.map((vendor) => {
                  const rating = Number(vendor.averageRating || 0);

                  return (
                    <div
                      key={vendor.id}
                      className="border-b border-[#eee5df] p-4"
                    >
                      <div className="relative mb-3 flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-[#f4eee9]">
                        {vendor.profileImageUrl ? (
                          <img
                            loading="lazy"
                            decoding="async"
                            src={vendor.profileImageUrl}
                            alt={vendor.businessName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageOff size={24} className="text-[#c8bbb0]" />
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[#30251f]">
                          {vendor.businessName}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemove(vendor.id)}
                          aria-label={t("favorites.compare.removeFromCompare", {
                            title: vendor.businessName,
                          })}
                          className="shrink-0 rounded-full p-1.5 text-[#9b8f86] transition hover:bg-[#f7f0eb] hover:text-[#30251f]"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {topRating !== null && rating === topRating && (
                        <div className="mt-2">
                          <Badge>{t("favorites.compare.topRated")}</Badge>
                        </div>
                      )}

                      <Link
                        href={`/vendors/${vendor.id}`}
                        className="mt-2 inline-flex text-xs font-semibold text-[#a47e43] hover:underline"
                      >
                        {t("compare.viewDetails")}
                      </Link>
                    </div>
                  );
                })}

            {/* Rows */}
            {isService ? (
              <>
                <RowLabel>{t("compare.rows.vendor")}</RowLabel>
                {services.map((service) => (
                  <div
                    key={`vendor-${service.id}`}
                    className="border-b border-[#eee5df] p-4 text-xs leading-6 text-[#756960]"
                  >
                    {service.vendorBusinessName || "—"}
                  </div>
                ))}

                <RowLabel>{t("compare.rows.category")}</RowLabel>
                {services.map((service) => (
                  <div
                    key={`category-${service.id}`}
                    className="border-b border-[#eee5df] p-4 text-xs leading-6 text-[#756960]"
                  >
                    {service.categoryName || "—"}
                  </div>
                ))}

                <RowLabel>{t("common.startingAt")}</RowLabel>
                {services.map((service, index) => {
                  const price = servicePrices[index];
                  const isLowest = lowestPrice !== null && price === lowestPrice;

                  return (
                    <div
                      key={`from-${service.id}`}
                      className="border-b border-[#eee5df] p-4"
                    >
                      <span
                        className={`font-serif text-lg ${
                          isLowest ? "text-[#8a6a2c]" : "text-[#a47e43]"
                        }`}
                      >
                        {price !== null
                          ? `${formatPrice(price)} ${t("common.currency")}`
                          : t("common.priceOnRequest")}
                      </span>
                    </div>
                  );
                })}

                <RowLabel>{t("compare.packages")}</RowLabel>
                {services.map((service) => (
                  <div
                    key={`packages-${service.id}`}
                    className="border-b border-[#eee5df] p-4"
                  >
                    {service.prices?.length ? (
                      <div className="space-y-2">
                        {service.prices.map((price) => (
                          <div
                            key={price.id}
                            className="flex items-center justify-between gap-3 rounded-xl bg-[#faf7f4] px-3 py-2"
                          >
                            <span className="min-w-0 truncate text-xs text-[#5f544d]">
                              {price.label}
                            </span>
                            <span className="shrink-0 text-xs font-semibold text-[#a47e43]">
                              {formatPrice(price.price)} {t("common.currency")}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-[#9b8f86]">
                        {t("compare.contactVendor")}
                      </span>
                    )}
                  </div>
                ))}

                <RowLabel>{t("compare.rows.description")}</RowLabel>
                {services.map((service) => (
                  <div
                    key={`description-${service.id}`}
                    className="border-b border-[#eee5df] p-4 text-xs leading-6 text-[#756960]"
                  >
                    <p className="line-clamp-5">{service.description || "—"}</p>
                  </div>
                ))}
              </>
            ) : (
              <>
                <RowLabel>{t("compare.rows.rating")}</RowLabel>
                {vendors.map((vendor) => (
                  <div
                    key={`rating-${vendor.id}`}
                    className="border-b border-[#eee5df] p-4"
                  >
                    <RatingStars
                      rating={Number(vendor.averageRating || 0)}
                      reviewsCount={vendor.reviewsCount}
                    />
                  </div>
                ))}

                <RowLabel>{t("compare.rows.location")}</RowLabel>
                {vendors.map((vendor) => (
                  <div
                    key={`location-${vendor.id}`}
                    className="border-b border-[#eee5df] p-4 text-xs leading-6 text-[#756960]"
                  >
                    {vendor.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={12} className="shrink-0 text-[#a47e43]" />
                        {vendor.location}
                      </span>
                    ) : (
                      "—"
                    )}
                  </div>
                ))}

                <RowLabel>{t("compare.rows.category")}</RowLabel>
                {vendors.map((vendor) => (
                  <div
                    key={`categories-${vendor.id}`}
                    className="border-b border-[#eee5df] p-4"
                  >
                    {vendor.categories?.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {vendor.categories.map((category) => (
                          <span
                            key={category}
                            className="rounded-full bg-[#f0e9e0] px-2.5 py-1 text-[11px] font-medium text-[#5f544d]"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-[#756960]">—</span>
                    )}
                  </div>
                ))}

                <RowLabel>{t("compare.rows.description")}</RowLabel>
                {vendors.map((vendor) => (
                  <div
                    key={`bio-${vendor.id}`}
                    className="border-b border-[#eee5df] p-4 text-xs leading-6 text-[#756960]"
                  >
                    <p className="line-clamp-5">{vendor.bio || "—"}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eee5df] bg-[#faf8f6] px-5 py-3.5 sm:px-6">
          {fullPageHref ? (
            <Link
              href={fullPageHref}
              className="text-xs font-semibold text-[#8c6a3c] transition hover:text-[#30251f]"
            >
              {t("favorites.compare.openFullPage")}
            </Link>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#30251f] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#42332a]"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
