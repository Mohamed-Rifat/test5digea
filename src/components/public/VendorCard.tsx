"use client";

import Link from "next/link";
import { Building2, Check, GitCompare, MapPin, ArrowUpRight } from "lucide-react";

import FavoriteButton from "@/components/shared/FavoriteButton";
import RatingStars from "@/components/shared/RatingStars";
import { useLanguage } from "@/context/LanguageContext";
import { FavoriteTargetType } from "@/types/favorite";
import type { Vendor } from "@/types/vendor";

interface VendorCardProps {
  vendor: Vendor;
  favorited?: boolean;
  favoriteLoading?: boolean;
  onToggleFavorite?: (targetType: FavoriteTargetType, targetId: string) => void;
  selected?: boolean;
  onSelect?: (vendorId: string) => void;
}

export default function VendorCard({
  vendor,
  favorited,
  favoriteLoading,
  onToggleFavorite,
  selected,
  onSelect,
}: VendorCardProps) {
  const { t, dir } = useLanguage();
  const isRtl = dir === "rtl";

  return (
    <article
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white",
        "transition-all duration-200",
        selected
          ? "border-[#30251f] ring-2 ring-[#30251f]/10"
          : "border-neutral-200 hover:border-neutral-300 hover:shadow-md",
      ].join(" ")}
    >
      {/* ============ Header ============ */}
      <div className="flex items-start gap-3 p-5 pb-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="h-12 w-12 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
            {vendor.profileImageUrl ? (
              <img
                src={vendor.profileImageUrl}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-neutral-100 to-neutral-200">
                <Building2 size={20} strokeWidth={1.5} className="text-[#a47e43]" />
              </div>
            )}
          </div>
        </div>

        {/* Identity + Actions */}
        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#30251f]">
              {vendor.businessName}
            </h3>
            {vendor.slogan && (
              <p className="mt-0.5 line-clamp-1 text-xs italic text-[#a47e43]">
                {vendor.slogan}
              </p>
            )}
          </div>

          {/* Actions inline */}
          <div className="flex shrink-0 items-center gap-1">
            {onToggleFavorite && (
              <FavoriteButton
                targetType={FavoriteTargetType.Vendor}
                targetId={vendor.id}
                isFavorited={!!favorited}
                loading={!!favoriteLoading}
                onToggle={onToggleFavorite}
                className="h-8 w-8"
              />
            )}
            {onSelect && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(vendor.id);
                }}
                aria-pressed={selected}
                aria-label={
                  selected
                    ? t("common.removeFromCompare")
                    : t("common.addToCompare")
                }
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                  selected
                    ? "border-[#30251f] bg-[#30251f] text-white"
                    : "border-neutral-200 text-neutral-400 hover:border-[#b99a62] hover:text-[#a47e43]",
                ].join(" ")}
              >
                {selected ? <Check size={14} /> : <GitCompare size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============ Meta: rating + location ============ */}
      <div className="flex min-h-5 items-center gap-2 px-5 pb-3 text-xs text-neutral-500">
        <RatingStars
          rating={vendor.averageRating}
          reviewsCount={vendor.reviewsCount}
          compact
        />
        {vendor.location && (
          <>
            <span className="text-neutral-300">·</span>
            <span className="flex min-w-0 items-center gap-1">
              <MapPin size={12} className="shrink-0 text-[#a47e43]" />
              <span className="truncate">{vendor.location}</span>
            </span>
          </>
        )}
      </div>

      {/* ============ Categories ============ */}
      {vendor.categories?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 pb-4">
          {vendor.categories.slice(0, 3).map((c) => (
            <span
              key={c}
              className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600"
            >
              {c}
            </span>
          ))}
          {vendor.categories.length > 3 && (
            <span className="rounded-md bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-400">
              +{vendor.categories.length - 3}
            </span>
          )}
        </div>
      )}

      {/* ============ CTA ============ */}
      <Link
        href={`/vendors/${vendor.id}`}
        aria-label={`${vendor.businessName} — ${
          isRtl ? "عرض الملف" : "View profile"
        }`}
        className="mt-auto flex items-center justify-between border-t border-neutral-100 px-5 py-3 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-[#30251f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30251f]/20"
      >
        <span>{isRtl ? "عرض الملف" : "View profile"}</span>
        <ArrowUpRight size={14} className={isRtl ? "-scale-x-100" : ""} />
      </Link>
    </article>
  );
}