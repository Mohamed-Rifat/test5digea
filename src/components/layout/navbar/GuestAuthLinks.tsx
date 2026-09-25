"use client";

import Link from "next/link";
import { Handshake } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { SiteNavbarState } from "./useSiteNavbar";

/** Login / sign-up / join-as-vendor links for guests. */
export function GuestAuthLinks({ nav }: { nav: SiteNavbarState }) {
  const { t } = useLanguage();
  const { isActive, canJoinAsVendor } = nav;

  return (
    <div className="flex items-center gap-1.5 ps-2">
      <Link
        href="/login"
        className="whitespace-nowrap rounded-full px-3 py-2 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#5f544d] xl:px-4 transition-colors duration-200 hover:text-[#30251f]"
      >
        {t("navbar.login")}
      </Link>

      <Link
        href="/register"
        className="group relative overflow-hidden whitespace-nowrap rounded-full border border-[#c6a66f] bg-[#30251f] px-4 py-2.5 xl:px-5 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-[#dcb97c] hover:shadow-[0_14px_30px_-10px_rgba(164,126,67,0.55)]"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        <span className="relative">{t("navbar.signUp")}</span>
      </Link>

      {canJoinAsVendor && (
        <Link
          href="/become-a-vendor"
          className={`group hidden items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[12.5px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200 2xl:flex ${
            isActive("/become-a-vendor")
              ? "bg-[#faf3ea] text-[#8a6836]"
              : "text-[#a47e43] hover:bg-[#faf3ea] hover:text-[#8a6836]"
          }`}
        >
          <Handshake
            size={14}
            className="transition-transform duration-200 group-hover:-rotate-6"
          />
          {t("navbar.joinUs")}
        </Link>
      )}
    </div>
  );
}
