"use client";

import Link from "next/link";
import { ArrowUpRight, ImageOff, Star } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { formatPrice, startingPrice } from "@/lib/format";
import type { DisplayedService } from "./useVendorDetail";

/** Image-led service card in the vendor's services grid. */
export function VendorServiceCard({ service }: { service: DisplayedService }) {
  const { t } = useLanguage();
  const price = startingPrice(service.prices);
  const image = service.images?.[0]?.url;
  const serviceRating = service._avgRating > 0 ? service._avgRating : null;

  return (
    <Link
            href={`/services/${service.id}`}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-[30px] border border-[#e9dfd6] bg-white shadow-[0_10px_35px_rgba(48,37,31,0.045)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d8c4ae] hover:shadow-[0_24px_60px_rgba(48,37,31,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
    >
      {/* Image */}
      <div className="relative aspect-[1.08/1] overflow-hidden bg-[#f4eee9]">
        {image ? (
          <img
            src={image}
            alt={service.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/70 text-[#c9bcae] shadow-sm backdrop-blur">
              <ImageOff size={23} />
            </div>
          </div>
        )}

        {/* Editorial image overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#241b17]/55 via-transparent to-[#241b17]/5 opacity-80" />



        {/* Rating */}
        {serviceRating !== null && (
          <span className="absolute end-4 top-4 flex items-center gap-1.5 rounded-full border border-white/50 bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold text-[#30251f] shadow-lg backdrop-blur-md">
            <Star
              size={11}
              className="fill-[#a47e43] text-[#a47e43]"
            />
            {Number(serviceRating).toFixed(1)}
          </span>
        )}

        {/* Bottom image eyebrow */}
        <div className="absolute bottom-4 start-4 end-4 flex items-end justify-between gap-3">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-white/80">
            {t("vendors.detail.services.weddingService")}
          </span>

          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#30251f] shadow-lg backdrop-blur transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <ArrowUpRight size={15} className="rtl:-scale-x-100" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-5.5">
        <h3 className="line-clamp-2 min-h-[3.4rem] font-serif text-[20px] font-light leading-[1.7] text-[#30251f] transition-colors duration-300 group-hover:text-[#8f6d3d]">
          {service.name}
        </h3>

        {service.description ? (
          <p className="mt-2.5 line-clamp-2 text-[12px] leading-6 text-[#94877e]">
            {service.description}
          </p>
        ) : (
          <p className="mt-2.5 line-clamp-2 text-[12px] leading-6 text-[#b2a59c]">
            {t("vendors.detail.services.defaultDescription")}
          </p>
        )}

        {/* Divider */}
        <div className="my-5 h-px bg-linear-to-r from-[#eadfd5] via-[#eee7e1] to-transparent" />

        {/* Footer */}
        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] rtl:tracking-normal text-[#a99a90]">
              {t("vendors.detail.services.startingFrom")}
            </p>

            <p className="mt-1 truncate text-[14px] font-semibold text-[#a47e43]">
              {price !== null
                ? `${formatPrice(price)} ${t("common.currency")}`
                : t("vendors.detail.services.contactForPricing")}
            </p>
          </div>

          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#e7ddd4] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] rtl:tracking-normal text-[#30251f] transition-all duration-300 group-hover:border-[#cbb08d] group-hover:bg-[#faf6f2]">
            {t("vendors.detail.services.explore")}
            <ArrowUpRight
              size={12}
              className="rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function VendorServicesSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[30px] border border-[#eee7e1] bg-white shadow-[0_10px_35px_rgba(48,37,31,0.04)]"
        >
          <div className="aspect-[1.08/1] animate-pulse bg-[#f4eee9]" />

          <div className="space-y-4 p-5">
            <div className="h-6 w-4/5 animate-pulse rounded-lg bg-[#f4eee9]" />
            <div className="h-3 w-full animate-pulse rounded bg-[#f4eee9]" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-[#f4eee9]" />
            <div className="my-4 h-px bg-[#eee7e1]" />
            <div className="flex justify-between">
              <div className="h-8 w-24 animate-pulse rounded-lg bg-[#f4eee9]" />
              <div className="h-9 w-20 animate-pulse rounded-full bg-[#f4eee9]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
