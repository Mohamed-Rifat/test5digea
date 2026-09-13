"use client";

import Link from "next/link";
import { Building2, MapPin, Check, GitCompare } from "lucide-react";

import FavoriteButton from "@/components/shared/FavoriteButton";
import RatingStars from "@/components/shared/RatingStars";
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
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(48,37,31,0.1)] ${
        selected ? "border-[#30251f] ring-2 ring-[#30251f]/10" : "border-[#eee7e1]"
      }`}
    >
      <Link href={`/vendors/${vendor.id}`} className="flex min-h-0 flex-1 flex-col">
        <div className="relative h-36 w-full shrink-0 bg-linear-to-br sm:h-40 from-[#f0e9e0] to-[#e4d8c8]">
          <div className="absolute -bottom-8 left-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#f4eee9] shadow-sm">
            {vendor.profileImageUrl ? (
              <img
                src={vendor.profileImageUrl}
                alt={vendor.businessName}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 size={24} className="text-[#a47e43]" />
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-4 pt-11 sm:p-5 sm:pt-11">
          <h3 className="line-clamp-1 text-base font-semibold text-[#30251f]">
            {vendor.businessName}
          </h3>

          {vendor.slogan && (
            <p className="mt-1 line-clamp-1 text-xs italic text-[#a47e43]">
              {vendor.slogan}
            </p>
          )}

          <div className="mt-3">
            <RatingStars rating={vendor.averageRating} reviewsCount={vendor.reviewsCount} />
          </div>

          {vendor.location && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-[#9b8f86]">
              <MapPin size={12} />
              {vendor.location}
            </p>
          )}

          {vendor.categories && vendor.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#f0e9e0] pt-4">
              {vendor.categories.slice(0, 3).map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-[#f0e9e0] px-2.5 py-1 text-[11px] font-medium text-[#5f544d]"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      {onToggleFavorite && (
        <FavoriteButton
          targetType={FavoriteTargetType.Vendor}
          targetId={vendor.id}
          isFavorited={!!favorited}
          loading={!!favoriteLoading}
          onToggle={onToggleFavorite}
          className="absolute right-3 top-3 z-10 shadow-sm"
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
          aria-label={selected ? "Remove from comparison" : "Add to comparison"}
          className={`absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition ${
            selected
              ? "border-[#30251f] bg-[#30251f] text-white"
              : "border-[#e4dbd0] bg-white/90 text-[#8d7b70] hover:border-[#b99a62] hover:text-[#a47e43]"
          }`}
        >
          {selected ? <Check size={16} /> : <GitCompare size={16} />}
        </button>
      )}
    </div>
  );
}
