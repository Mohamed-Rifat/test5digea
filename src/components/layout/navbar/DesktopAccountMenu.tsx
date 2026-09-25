"use client";

import Link from "next/link";
import {
  Heart,
  Map,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  User,
  ChevronDown,
  KeyRound,
} from "lucide-react";
import { getHomePath } from "@/lib/auth-utils";
import { useLanguage } from "@/context/LanguageContext";

import type { SiteNavbarState } from "./useSiteNavbar";

/** Account dropdown for signed-in users. */
export function DesktopAccountMenu({ nav }: { nav: SiteNavbarState }) {
  const { t } = useLanguage();
  const {
    isAdmin,
    isVendor,
    isUser,
    user,
    role,
    logout,
    menuOpen,
    setMenuOpen,
  } = nav;

  return (
    <div className="relative ps-2">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className={`flex items-center gap-2.5 rounded-full border py-1.5 ps-1.5 pe-3.5 text-sm font-medium transition-all duration-200 ${
          menuOpen
            ? "border-[#c6a66f] bg-[#faf3ea] text-[#30251f] shadow-[0_10px_24px_-14px_rgba(164,126,67,0.5)]"
            : "border-[#e4dbd0] text-[#30251f] hover:border-[#c6a66f] hover:bg-[#faf7f4]"
        }`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#f2e2c6] to-[#d9b988] text-[#5c431f] shadow-inner">
          <UserIcon size={16} />
        </span>
        <span className="max-w-27.5 truncate">
          {user?.fullName || t("navbar.account")}
        </span>
        <ChevronDown
          size={13}
          className={`text-[#a89c92] transition-transform duration-300 ${
            menuOpen ? "rotate-180 text-[#a47e43]" : ""
          }`}
        />
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
          />
          <div className="animate-menu-pop absolute inset-e-0 z-20 mt-2.5 w-56 origin-top-right rtl:origin-top-left overflow-hidden rounded-2xl border border-[#eee2d6] bg-white/98 shadow-[0_28px_60px_-18px_rgba(48,37,31,0.3)] backdrop-blur-xl">
            <div className="border-b border-[#f1ece2] px-4 pb-3 pt-3.5">
              <p className="truncate text-sm font-semibold text-[#30251f]">
                {user?.fullName || t("navbar.account")}
              </p>
              <p className="text-xs text-[#9b8f86]">{t("navbar.signedIn")}</p>
            </div>

            <div className="py-1.5">
              {(isAdmin || isVendor) && (
                <Link
                  href={getHomePath(role)}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#5f544d] transition-colors duration-150 hover:bg-[#faf3ea] hover:text-[#30251f]"
                >
                  <LayoutDashboard size={16} className="text-[#a47e43]" />
                  {isAdmin
                    ? t("navbar.adminDashboard")
                    : t("navbar.vendorDashboard")}
                </Link>
              )}

              {isUser && (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#5f544d] transition-colors duration-150 hover:bg-[#faf3ea] hover:text-[#30251f]"
                  >
                    <User size={16} className="text-[#a47e43]" />
                    {t("navbar.myProfile")}
                  </Link>
                  <Link
                    href="/favorites"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#5f544d] transition-colors duration-150 hover:bg-[#faf3ea] hover:text-[#30251f]"
                  >
                    <Heart size={16} className="text-[#a47e43]" />
                    {t("navbar.favorites")}
                  </Link>
                  <Link
                    href="/roadmap"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#5f544d] transition-colors duration-150 hover:bg-[#faf3ea] hover:text-[#30251f]"
                  >
                    <Map size={16} className="text-[#a47e43]" />
                    {t("navbar.weddingRoadmap")}
                  </Link>
                  <Link
                    href="/change-password"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#5f544d] transition-colors duration-150 hover:bg-[#faf3ea] hover:text-[#30251f]"
                  >
                    <KeyRound size={16} className="text-[#a47e43]" />
                    {t("navbar.security")}
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2.5 border-t border-[#f1ece2] px-4 py-2.5 text-start text-sm text-[#b3453a] transition-colors duration-150 hover:bg-[#fbf0ee]"
            >
              <LogOut size={16} />
              {t("navbar.logout")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
