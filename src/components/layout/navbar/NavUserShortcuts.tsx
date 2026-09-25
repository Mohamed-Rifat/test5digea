"use client";

import Link from "next/link";
import { Heart, Map } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** Favourites + roadmap icon buttons for signed-in couples. */
export function NavUserShortcuts({
  isActive,
}: {
  isActive: (href: string) => boolean;
}) {
  const { t } = useLanguage();

  return (
    <>
      <Link
        href="/favorites"
        aria-label={t("navbar.favorites")}
        className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
          isActive("/favorites")
            ? "border-[#b99a62] bg-[#faf3ea] text-[#a47e43]"
            : "border-[#e4dbd0] text-[#5f544d] hover:border-[#b99a62] hover:text-[#a47e43]"
        }`}
      >
        <Heart size={18} />
      </Link>

      <Link
        href="/roadmap"
        aria-label={t("navbar.weddingRoadmap")}
        className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
          isActive("/roadmap")
            ? "border-[#b99a62] bg-[#faf3ea] text-[#a47e43]"
            : "border-[#e4dbd0] text-[#5f544d] hover:border-[#b99a62] hover:text-[#a47e43]"
        }`}
      >
        <Map size={18} />
      </Link>
    </>
  );
}
