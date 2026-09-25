"use client";

import Link from "next/link";
import Image from "next/image";
import {
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  LayoutGrid,
  Handshake,
} from "lucide-react";
import { getHomePath } from "@/lib/auth-utils";
import { useLanguage } from "@/context/LanguageContext";

import { primaryLinks, secondaryLinks } from "./navConfig";
import type { SiteNavbarState } from "./useSiteNavbar";

/** Side drawer with links, categories and account actions (phones). */
export function MobileDrawer({ nav }: { nav: SiteNavbarState }) {
  const { t, localize } = useLanguage();
  const {
    isAuthenticated,
    isAdmin,
    isVendor,
    user,
    role,
    logout,
    mobileOpen,
    mobileCategoriesOpen,
    setMobileCategoriesOpen,
    isActive,
    activeCategories,
    canJoinAsVendor,
    closeMobile,
    goToCategory,
  } = nav;

  return (
    <div
      aria-hidden={!mobileOpen}
      className={`fixed inset-0 z-50 overflow-hidden xl:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
    >
      {/* backdrop */}
      <div
        onClick={closeMobile}
        className={`absolute inset-0 bg-[#20180f]/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* panel */}
      <div
        className={`absolute inset-e-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-[#f8f5ef] shadow-[0_0_60px_rgba(48,37,31,0.35)] transition-transform duration-300 ease-out ${
          mobileOpen
            ? "translate-x-0"
            : "translate-x-full rtl:-translate-x-full"
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-[#eee7e1] px-4 py-4">
          <Link
            href="/"
            onClick={closeMobile}
            className="flex items-center gap-2"
          >
            <Image
              src="/Logo.png"
              alt="5digea"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-serif text-base font-medium text-[#30251f]">
              5digea
            </span>
          </Link>
          <button
            type="button"
            aria-label={t("navbar.closeMenu")}
            onClick={closeMobile}
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#e4dbd0] text-[#30251f] transition-transform duration-200 hover:rotate-90 hover:border-[#c6a66f]"
          >
            <X size={18} />
          </button>
        </div>

        {/* scrollable content */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <nav className="flex flex-col gap-1">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  isActive(link.href)
                    ? "bg-[#30251f] text-white"
                    : "text-[#5f544d] hover:bg-[#f0e9e0]"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}

            {/* CATEGORIES accordion */}
            <button
              type="button"
              onClick={() => setMobileCategoriesOpen((v) => !v)}
              className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                mobileCategoriesOpen
                  ? "bg-[#f0e9e0] text-[#a47e43]"
                  : "text-[#a47e43]"
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutGrid size={16} />
                {t("navbar.categories")}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${mobileCategoriesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileCategoriesOpen && (
              <div className="animate-menu-pop ms-2 flex origin-top flex-col gap-0.5 border-s border-[#eee7e1] ps-3">
                {activeCategories.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-[#766d67]">
                    {t("navbar.noCategories")}
                  </p>
                ) : (
                  activeCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => goToCategory(category.id)}
                      className="rounded-lg px-3 py-2 text-start text-sm text-[#5f544d] transition-colors duration-150 hover:bg-[#f0e9e0] hover:text-[#30251f]"
                    >
                      {localize(category.name)}
                    </button>
                  ))
                )}
              </div>
            )}

            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  isActive(link.href)
                    ? "bg-[#30251f] text-white"
                    : "text-[#5f544d] hover:bg-[#f0e9e0]"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}

            {canJoinAsVendor && (
              <Link
                href="/become-a-vendor"
                onClick={closeMobile}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  isActive("/become-a-vendor")
                    ? "bg-[#30251f] text-white"
                    : "text-[#a47e43] hover:bg-[#f0e9e0]"
                }`}
              >
                <Handshake size={16} />
                {t("navbar.joinUs")}
              </Link>
            )}

            {(isAdmin || isVendor) && (
              <>
                <div className="my-1 border-t border-[#eee7e1]" />
                <Link
                  href={getHomePath(role)}
                  onClick={closeMobile}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[#5f544d] transition-colors duration-150 hover:bg-[#f0e9e0]"
                >
                  <LayoutDashboard size={16} />
                  {isAdmin
                    ? t("navbar.adminDashboard")
                    : t("navbar.vendorDashboard")}
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* footer */}
        <div className="border-t border-[#eee7e1] bg-[#fafafa] p-4">
          {!isAuthenticated ? (
            <div className="flex gap-2">
              <Link
                href="/login"
                onClick={closeMobile}
                className="flex-1 rounded-full border border-[#e4dbd0] px-4 py-2.5 text-center text-sm font-medium text-[#30251f] transition-colors duration-150 hover:border-[#c6a66f]"
              >
                {t("navbar.login")}
              </Link>
              <Link
                href="/register"
                onClick={closeMobile}
                className="flex-1 rounded-full border border-[#c6a66f] bg-[#30251f] px-4 py-2.5 text-center text-sm font-medium text-white transition-colors duration-150 hover:bg-[#42332a]"
              >
                {t("navbar.signUp")}
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate text-sm font-bold text-[#30251f]">
                  <UserIcon size={16} className="shrink-0 text-[#a47e43]" />
                  <span className="truncate">
                    {user?.fullName || t("navbar.account")}
                  </span>
                </p>
                <p className="text-xs text-[#766d67]">{t("navbar.signedIn")}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeMobile();
                  logout();
                }}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#f6dedb] px-3 py-2 text-sm font-medium text-[#b3453a] transition-colors duration-150 hover:bg-[#f0d0cc]"
              >
                <LogOut size={14} />
                {t("navbar.logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
