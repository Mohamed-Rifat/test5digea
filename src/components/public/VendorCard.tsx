"use client";

import Link from "next/link";
import { Heart, MapPin, Star, ArrowUpRight } from "lucide-react";
import type { Vendor } from "@/types/vendor";

export default function VendorCard({ vendor, favorite, onFavorite }: { vendor: Vendor; favorite?: boolean; onFavorite?: () => void }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#eee5df] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f5efeb]">
        {vendor.profileImageUrl ? <img src={vendor.profileImageUrl} alt={vendor.businessName} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-4xl text-[#a39287]">✦</div>}
        {onFavorite && <button onClick={onFavorite} className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md ${favorite ? "bg-[#30251f] text-white" : "bg-white/90 text-[#675b54]"}`}><Heart size={18} fill={favorite ? "currentColor" : "none"} /></button>}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-lg font-semibold text-[#30251f]">{vendor.businessName}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#55483f]"><Star size={15} fill="currentColor" /> {Number(vendor.averageRating || 0).toFixed(1)}</span>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-[#9a8c83]">{vendor.slogan || "Wedding specialist"}</p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#81746d]"><MapPin size={14} /> {vendor.location || "Location not specified"} <span>•</span> {vendor.reviewsCount || 0} reviews</div>
        <div className="mt-4 flex items-center justify-between border-t border-[#f1eae5] pt-4">
          <div className="flex flex-wrap gap-1.5">{(vendor.categories || []).slice(0, 2).map((c) => <span key={c} className="rounded-full bg-[#faf5f1] px-2.5 py-1 text-[10px] font-medium text-[#806f64]">{c}</span>)}</div>
          <Link href={`/vendors/${vendor.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#514740]">View <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </article>
  );
}
