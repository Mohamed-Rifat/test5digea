"use client";

import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { useSimilarServices } from "@/features/services/hooks/useSimilarServices";
import { formatPrice, startingPrice } from "@/lib/format";
import type { Service } from "@/types/service";

interface SimilarServicesProps {
  service: Service;
}

export default function SimilarServices({ service }: SimilarServicesProps) {
  const { t, localize } = useLanguage();
  const { mode, services, loading } = useSimilarServices(service);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#eee7e1] bg-white p-6">
        <div className="h-5 w-40 animate-pulse rounded bg-[#f0e8dd]" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-[#f7f2ec]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!mode || services.length === 0) return null;

  const isSameVendor = mode === "sameVendor";
  const category = localize(service.categoryName);

  return (
    <section className="rounded-2xl border border-[#eee7e1] bg-white p-6">
      <h2 className="font-serif text-lg text-[#30251f]">
        {isSameVendor
          ? t("services.detail.similar.sameVendorTitle")
          : t("services.detail.similar.otherVendorsTitle")}
      </h2>

      <p className="mt-1.5 text-xs leading-5 text-[#9b8f86]">
        {isSameVendor
          ? t("services.detail.similar.sameVendorSubtitle", {
              vendor: service.vendorBusinessName,
              category,
            })
          : t("services.detail.similar.otherVendorsSubtitle", { category })}
      </p>

      <div className="mt-4 space-y-3">
        {services.map((item) => {
          const image = [...(item.images ?? [])].sort(
            (a, b) => a.displayOrder - b.displayOrder
          )[0]?.url;
          const price = startingPrice(item.prices);

          return (
            <Link
              key={item.id}
              href={`/services/${item.id}`}
              className="group flex items-center gap-3 rounded-xl border border-[#f0e9e0] p-2.5 transition hover:border-[#b99a62] hover:bg-[#faf7f4]"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f4eee9]">
                {image ? (
                  <img
                    loading="lazy"
                    decoding="async"
                    src={image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#c9bcae]">
                    <ImageOff size={18} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-semibold text-[#30251f]">
                  {item.name}
                </p>

                {!isSameVendor && (
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-[#9b8f86]">
                    {t("common.byVendor", { name: item.vendorBusinessName })}
                  </p>
                )}

                <p className="mt-1 text-xs text-[#a47e43]">
                  {price !== null ? (
                    <>
                      <span className="text-[#9b8f86]">
                        {t("common.startingAt")}
                      </span>{" "}
                      <span className="font-semibold">
                        {formatPrice(price)} {t("common.currency")}
                      </span>
                    </>
                  ) : (
                    t("common.priceOnRequest")
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        href={`/services?categoryId=${service.categoryId}`}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full border border-[#e4dbd0] px-5 py-2.5 text-sm font-medium text-[#30251f] transition hover:border-[#b99a62]"
      >
        {category
          ? t("services.detail.similar.viewMore", { category })
          : t("common.viewAll")}
        <ArrowRight size={14} className="rtl:rotate-180" />
      </Link>
    </section>
  );
}
