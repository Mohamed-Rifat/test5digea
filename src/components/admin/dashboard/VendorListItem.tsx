"use client";

import { MessageSquare, Star, Store } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";
import { formatNumber, formatRating } from "./utils";

export default function VendorListItem({
  vendor,
  rank,
  showRating = false,
  showReviews = false,
}: {
  vendor: Vendor;
  rank: number;
  showRating?: boolean;
  showReviews?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-[#fcfaf8] sm:px-6">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#f5eee9] text-[9px] font-semibold text-[#806d61]">
        {rank}
      </span>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f6f0ec]">
        {vendor.profileImageUrl ? (
          <img
            loading="lazy"
            decoding="async"
            src={vendor.profileImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <Store size={15} className="text-[#806d61]" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-[#40342d]">
          {vendor.businessName}
        </p>

        <div className="mt-0.5 flex items-center gap-2">
          <span className="truncate text-[9px] text-[#a39790]">
            {vendor.location || t('admin.dashboard.locationNotProvided')}
          </span>
        </div>
      </div>

      {showRating && (
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#fff8e9] px-2 py-1 text-[9px] font-semibold text-[#9a7b36]">
          <Star size={10} fill="currentColor" />

          {formatRating(Number(vendor.averageRating) || 0)}
        </div>
      )}

      {showReviews && (
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#f7f1ed] px-2 py-1 text-[9px] font-semibold text-[#806d61]">
          <MessageSquare size={10} />

          {formatNumber(Number(vendor.reviewsCount) || 0)}
        </div>
      )}
    </div>
  );
}
