"use client";

import Link from "next/link";
import { Heart, Star, ArrowUpRight, Check } from "lucide-react";
import type { Service } from "@/types/service";

interface Props {
  service: Service;
  favorite?: boolean;
  onFavorite?: () => void;
  selected?: boolean;
  onSelect?: () => void;
}

export default function ServiceCard({ service, favorite, onFavorite, selected, onSelect }: Props) {
  const image = service.images?.[0]?.url;
  const price = service.prices?.length ? Math.min(...service.prices.map((p) => Number(p.price))) : null;

  return (
    <article className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${selected ? "border-[#30251f] ring-2 ring-[#30251f]/10" : "border-[#eee5df]"}`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f5efeb]">
        {image ? <img src={image} alt={service.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : (
          <div className="flex h-full items-center justify-center text-[#a39287]"><span className="text-4xl">✦</span></div>
        )}
        {onFavorite && (
          <button onClick={onFavorite} className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition ${favorite ? "bg-[#30251f] text-white" : "bg-white/90 text-[#675b54] hover:bg-white"}`} aria-label="Favorite">
            <Heart size={18} fill={favorite ? "currentColor" : "none"} />
          </button>
        )}
        {onSelect && (
          <button onClick={onSelect} className={`absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold backdrop-blur ${selected ? "bg-[#30251f] text-white" : "bg-white/90 text-[#514740]"}`}>
            <span className={`flex h-4 w-4 items-center justify-center rounded border ${selected ? "border-white bg-white text-[#30251f]" : "border-[#cbbdb4]"}`}>{selected && <Check size={11} />}</span>
            Compare
          </button>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#a08c7d]">{service.categoryName}</p>
            <h3 className="mt-1 line-clamp-1 text-lg font-semibold text-[#30251f]">{service.name}</h3>
          </div>
          {service.vendorBusinessName && <span className="rounded-full bg-[#faf5f1] px-2.5 py-1 text-[10px] font-medium text-[#806f64]">Verified vendor</span>}
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#81746d]">{service.description || "A curated wedding service for your special day."}</p>
        <div className="mt-4 flex items-center justify-between border-t border-[#f1eae5] pt-4">
          <div>
            {price !== null ? <><span className="text-xs text-[#a09289]">Starting from</span><p className="text-base font-semibold text-[#30251f]">{price.toLocaleString()}</p></> : <span className="text-sm text-[#81746d]">Contact vendor</span>}
          </div>
          <Link href={`/services/${service.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#514740] hover:text-[#9a665e]">
            View details <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
