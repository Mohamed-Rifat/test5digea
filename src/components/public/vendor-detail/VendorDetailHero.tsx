"use client";

import Link from "next/link";
import { ArrowLeft, Check, Share2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import FavoriteButton from "@/components/shared/FavoriteButton";
import { FavoriteTargetType } from "@/types/favorite";

export interface VendorFavoriteProps {
  vendorId: string;
  isFavorited: boolean;
  loading: boolean;
  onToggle: Parameters<typeof FavoriteButton>[0]["onToggle"];
}

interface VendorDetailHeroProps extends VendorFavoriteProps {
  shareCopied: boolean;
  onShare: () => void;
}

/** Decorative banner with back link, share and favourite buttons. */
export function VendorDetailHero({
  vendorId,
  isFavorited,
  loading,
  onToggle,
  shareCopied,
  onShare,
}: VendorDetailHeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative h-48 overflow-hidden sm:h-64">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(145deg,#f1e8dc_0%,#e8d9c6_55%,#ddc8a8_100%)]"
      />

      {/* Texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #30251f 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Soft decorative glow */}
      <div
        aria-hidden
        className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/20 blur-3xl"
      />

      <div
        aria-hidden
        className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
      />

      {/* Fade */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#faf8f6] to-transparent"
      />

      {/* Hero controls */}
      <div className="relative mx-auto flex h-full lg:max-w-10/12 items-start justify-between px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">

        <Link
          href="/vendors"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#30251f]transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
        >
          <ArrowLeft size={15} className="rtl:rotate-180" />
          <span className="text-[#9A8F86] hover:text-[#6b3203]">{t("vendors.detail.back")}</span>
        </Link>

        <div className="flex items-center gap-2">

          {/* Share */}
          <button
            type="button"
            onClick={onShare}
            aria-label={t("vendors.detail.share")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/85 text-[#30251f] shadow-sm backdrop-blur transition-all duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
          >
            {shareCopied ? (
              <Check size={16} />
            ) : (
              <Share2 size={16} />
            )}

            {shareCopied && (
              <span className="absolute end-0 top-12 whitespace-nowrap rounded-lg bg-[#30251f] px-2.5 py-1.5 text-[10px] text-white shadow-lg">
                {t("vendors.detail.linkCopied")}
              </span>
            )}
          </button>

          {/* Favorite */}
          <div className="rounded-full border border-white/60 bg-white/85 p-0.5 shadow-sm backdrop-blur">
            <FavoriteButton
              targetType={FavoriteTargetType.Vendor}
              targetId={vendorId}
                isFavorited={isFavorited}
                loading={loading}
                onToggle={onToggle}
              size="sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
