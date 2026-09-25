"use client";

import { ArrowUpRight, Check, Share2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import FavoriteButton from "@/components/shared/FavoriteButton";
import { FavoriteTargetType } from "@/types/favorite";
import type { VendorFavoriteProps } from "./VendorDetailHero";

/** Sticky bottom bar on phones: contact, favourite, share. */
export function MobileContactBar({
  vendorId,
  isFavorited,
  loading,
  onToggle,
  shareCopied,
  onShare,
}: VendorFavoriteProps & { shareCopied: boolean; onShare: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e7ded6] bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(48,37,31,0.08)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-2.5">

        <a
          href="#contact"
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#30251f] px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#49382f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
        >
          {t("vendors.detail.contact.cta")}
          <ArrowUpRight size={15} className="rtl:-scale-x-100" />
        </a>

        <div className="rounded-full border border-[#e9e0d8] p-0.5">
          <FavoriteButton
            targetType={FavoriteTargetType.Vendor}
            targetId={vendorId}
                isFavorited={isFavorited}
                loading={loading}
                onToggle={onToggle}
            size="sm"
          />
        </div>

        <button
          type="button"
          onClick={onShare}
          aria-label={t("vendors.detail.share")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e9e0d8] bg-white text-[#30251f] transition-all duration-200 hover:bg-[#faf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
        >
          {shareCopied ? (
            <Check size={16} />
          ) : (
            <Share2 size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
