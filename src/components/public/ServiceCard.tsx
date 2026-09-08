"use client";

import Link from "next/link";
import { Check, ImageOff } from "lucide-react";

import FavoriteButton from "@/components/shared/FavoriteButton";
import { FavoriteTargetType } from "@/types/favorite";
import { formatPrice, startingPrice } from "@/lib/format";
import type { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
  favorited?: boolean;
  favoriteLoading?: boolean;
  onToggleFavorite?: (targetType: FavoriteTargetType, targetId: string) => void;
  selected?: boolean;
  onSelect?: (service: Service) => void;
}

export default function ServiceCard({
  service,
  favorited,
  favoriteLoading,
  onToggleFavorite,
  selected,
  onSelect,
}: ServiceCardProps) {
  const price = startingPrice(service.prices);
  const image = [...(service.images ?? [])].sort((a, b) => a.displayOrder - b.displayOrder)[0]?.url;

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(48,37,31,0.1)] ${
        selected ? "border-[#30251f] ring-2 ring-[#30251f]/10" : "border-[#eee7e1]"
      }`}
    >
      <Link href={`/services/${service.id}`} className="flex min-h-0 flex-1 flex-col">
        <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-52 bg-[#f4eee9]">
          {image ? (
            <img
              src={image}
              alt={service.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#c9bcae]">
              <ImageOff size={28} />
            </div>
          )}

          {service.categoryName && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-[#5f544d] backdrop-blur">
              {service.categoryName}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <h3 className="line-clamp-1 text-base font-semibold text-[#30251f]">
            {service.name}
          </h3>

          <p className="mt-1 text-xs text-[#9b8f86]">
            by {service.vendorBusinessName}
          </p>

          <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-[#766d67]">
            {service.description}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-[#f0e9e0] pt-4">
            <span className="text-xs text-[#9b8f86]">Starting at</span>
            <span className="font-serif text-lg text-[#a47e43]">
              {price !== null ? `${formatPrice(price)} EGP` : "Contact"}
            </span>
          </div>
        </div>
      </Link>

      {onToggleFavorite && (
        <FavoriteButton
          targetType={FavoriteTargetType.Service}
          targetId={service.id}
          isFavorited={!!favorited}
          loading={!!favoriteLoading}
          onToggle={onToggleFavorite}
          className="absolute right-3 top-3 z-10 shadow-sm"
        />
      )}

      {onSelect && (
        <div className="border-t border-[#f0e9e0] px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onSelect(service); }}
            aria-pressed={selected}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
              selected
                ? "bg-[#30251f] text-white shadow-sm"
                : "border border-[#e4dbd0] bg-white text-[#514740] hover:border-[#b99a62] hover:bg-[#faf7f4]"
            }`}
          >
            <span className={`flex h-4 w-4 items-center justify-center rounded border ${selected ? "border-white bg-white text-[#30251f]" : "border-[#cbbdb4]"}`}>
              {selected && <Check size={11} />}
            </span>
            {selected ? "Selected for comparison" : "Add to compare"}
          </button>
        </div>
      )}
    </div>
  );
}
