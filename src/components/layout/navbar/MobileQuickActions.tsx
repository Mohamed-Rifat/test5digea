"use client";

import Link from "next/link";
import {
  Heart,
  Map,
  Menu,
  X,
  User as UserIcon,
  User,
  Search,
  KeyRound,
} from "lucide-react";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import SessionCountdownBadge from "@/components/shared/SessionCountdownBadge";
import { useLanguage } from "@/context/LanguageContext";

import type { SiteNavbarState } from "./useSiteNavbar";

/** Phone search / favourites / account quick-menu / hamburger. */
export function MobileQuickActions({ nav }: { nav: SiteNavbarState }) {
  const { t } = useLanguage();
  const {
    isAuthenticated,
    isUser,
    mobileSearchOpen,
    setMobileSearchOpen,
    mobileAccountOpen,
    setMobileAccountOpen,
    mobileAccountRef,
    isActive,
    openMobileDrawer,
  } = nav;

  return (
    <div className="flex items-center gap-1.5 xl:hidden">
      <button
        type="button"
        onClick={() => {
          setMobileAccountOpen(false);
          setMobileSearchOpen((v) => !v);
        }}
        aria-label={t("common.search")}
        aria-expanded={mobileSearchOpen}
        className={`flex h-9 w-9 items-center justify-center rounded-2xl border transition-all duration-200 ${
          mobileSearchOpen
            ? "border-[#c6a66f] bg-[#faf3ea] text-[#30251f]"
            : "border-[#e4dbd0] text-[#5f544d] hover:border-[#b99a62]"
        }`}
      >
        <span
          className={`inline-flex transition-transform duration-300 ${
            mobileSearchOpen ? "rotate-90" : "rotate-0"
          }`}
        >
          {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
        </span>
      </button>

      {isAuthenticated && isUser && (
        <>
          <Link
            href="/favorites"
            aria-label={t("navbar.favorites")}
            className={`flex h-9 w-9 items-center justify-center rounded-2xl border transition-all duration-200 ${
              isActive("/favorites")
                ? "border-[#c6a66f] bg-[#faf3ea] text-[#a47e43]"
                : "border-[#e4dbd0] text-[#5f544d] hover:border-[#b99a62] hover:text-[#a47e43]"
            }`}
          >
            <Heart size={17} />
          </Link>

          {/* Account quick-menu: tapping the user icon drops down
            Wedding Roadmap, My Profile and Security (change
            password) — no need to open the hamburger drawer. */}
          <div className="relative" ref={mobileAccountRef}>
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen(false);
                setMobileAccountOpen((v) => !v);
              }}
              aria-label={t("navbar.accountMenu")}
              aria-expanded={mobileAccountOpen}
              className={`flex h-9 w-9 items-center justify-center rounded-2xl border transition-all duration-200 ${
                mobileAccountOpen
                  ? "border-[#c6a66f] bg-[#faf3ea] text-[#30251f]"
                  : "border-[#e4dbd0] text-[#5f544d] hover:border-[#b99a62]"
              }`}
            >
              <UserIcon size={17} />
            </button>

            {mobileAccountOpen && (
              <div className="animate-menu-pop absolute inset-e-0 z-30 mt-2.5 w-52 origin-top-right rtl:origin-top-left overflow-hidden rounded-2xl border border-[#eee2d6] bg-white/98 py-2 shadow-[0_24px_50px_-16px_rgba(48,37,31,0.3)] backdrop-blur-xl">
                <Link
                  href="/roadmap"
                  onClick={() => setMobileAccountOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#5f544d] transition-colors duration-150 hover:bg-[#faf3ea] hover:text-[#30251f]"
                >
                  <Map size={16} className="text-[#a47e43]" />
                  {t("navbar.weddingRoadmap")}
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileAccountOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#5f544d] transition-colors duration-150 hover:bg-[#faf3ea] hover:text-[#30251f]"
                >
                  <User size={16} className="text-[#a47e43]" />
                  {t("navbar.myProfile")}
                </Link>
                <Link
                  href="/change-password"
                  onClick={() => setMobileAccountOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#5f544d] transition-colors duration-150 hover:bg-[#faf3ea] hover:text-[#30251f]"
                >
                  <KeyRound size={16} className="text-[#a47e43]" />
                  {t("navbar.security")}
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {isAuthenticated && <SessionCountdownBadge compact />}

      {/* Language switcher (hidden on very narrow phones, where it lives
        in the drawer instead so the header row never overflows). */}
      <LanguageSwitcher
        variant="compact"
        className="hidden min-[360px]:block"
      />

      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        aria-label={t("navbar.openMenu")}
        onClick={openMobileDrawer}
        className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e4dbd0] text-[#30251f] transition-all duration-200 hover:border-[#c6a66f]"
      >
        <Menu size={18} />
      </button>
    </div>
  );
}
