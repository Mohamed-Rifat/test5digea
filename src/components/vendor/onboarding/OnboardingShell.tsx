"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, LogOut } from "lucide-react";

import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import SessionCountdownBadge from "@/components/shared/SessionCountdownBadge";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import { delay } from "./motion";

/**
 * Page frame shared by every pre-approval screen: a slim header (brand,
 * language, logout — there is no dashboard yet) over a softly animated
 * wedding-themed background.
 */
export default function OnboardingShell({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf8f6]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -end-32 -top-32 h-96 w-96 rounded-full bg-[#f4eadc] opacity-70 blur-3xl" />
        <div className="absolute -bottom-40 -start-32 h-112 w-112 rounded-full bg-[#f7e9e5] opacity-60 blur-3xl" />

        <Heart
          size={22}
          className="onb-float absolute start-[7%] top-[22%] fill-[#f3e4d0] text-[#d9bd85]/60"
          style={delay(0)}
        />
        <Heart
          size={16}
          className="onb-float absolute end-[9%] top-[38%] fill-[#f7e1e0] text-[#e3a8a8]/50"
          style={delay(1800)}
        />
        <Heart
          size={26}
          className="onb-float absolute start-[12%] top-[70%] fill-[#f7e1e0] text-[#e3a8a8]/40"
          style={delay(3200)}
        />
        <Heart
          size={18}
          className="onb-float absolute end-[14%] top-[82%] fill-[#f3e4d0] text-[#d9bd85]/50"
          style={delay(900)}
        />
      </div>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#eee7e1] bg-white/85 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-2.5">
          <Image
            src="/Logo.png"
            alt="5Digea"
            width={34}
            height={34}
            className="rounded-full"
          />
          <div className="leading-tight">
            <p className="font-serif text-base font-medium text-[#30251f]">
              5Digea
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a47e43] rtl:tracking-normal">
              {t("vendorOnboarding.header.portal")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SessionCountdownBadge compact />

          <LanguageSwitcher variant="compact" className="sm:hidden" />
          <LanguageSwitcher className="hidden sm:block" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#756860] transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} className="rtl:rotate-180" />
            <span className="hidden sm:inline">
              {t("vendorOnboarding.header.logout")}
            </span>
          </button>
        </div>
      </header>

      <div className="relative">{children}</div>
    </div>
  );
}
