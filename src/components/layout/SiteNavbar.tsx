"use client";

import SessionCountdownBadge from "@/components/shared/SessionCountdownBadge";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { DesktopAccountMenu } from "./navbar/DesktopAccountMenu";
import { DesktopNav } from "./navbar/DesktopNav";
import { GuestAuthLinks } from "./navbar/GuestAuthLinks";
import { MobileDrawer } from "./navbar/MobileDrawer";
import { MobileQuickActions } from "./navbar/MobileQuickActions";
import { MobileSearchPanel } from "./navbar/MobileSearchPanel";
import { NavBrand } from "./navbar/NavBrand";
import { NavSearch } from "./navbar/NavSearch";
import { NavUserShortcuts } from "./navbar/NavUserShortcuts";
import { useSiteNavbar } from "./navbar/useSiteNavbar";

/**
 * Public site header. State lives in `useSiteNavbar`; each piece is a
 * component in `./navbar/` (desktop nav, search, account menu, mobile
 * quick actions, search panel and drawer).
 */
export default function SiteNavbar() {
  const nav = useSiteNavbar();
  const { scrolled, hideOnScroll, anyOverlayOpen, isAuthenticated, isUser } =
    nav;

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ease-out ${
          scrolled
            ? "border-[#eee2d6] bg-[#faf8f6]/92 shadow-[0_18px_40px_-24px_rgba(48,37,31,0.35)] backdrop-blur-xl"
            : "border-transparent bg-[#f8f5ef]/85 backdrop-blur-md"
        } ${hideOnScroll && !anyOverlayOpen ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div
          className={`mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 transition-[height] duration-300 ease-out sm:px-6 lg:px-8 ${
            scrolled ? "h-15.5" : "h-18"
          }`}
        >
          <NavBrand scrolled={scrolled} />

          <DesktopNav nav={nav} />

          <div className="hidden items-center gap-2 xl:flex 2xl:gap-2.5">
            <NavSearch nav={nav} />

            {isAuthenticated && isUser && (
              <NavUserShortcuts isActive={nav.isActive} />
            )}

            {isAuthenticated && <SessionCountdownBadge compact />}

            <LanguageSwitcher />

            {!isAuthenticated ? (
              <GuestAuthLinks nav={nav} />
            ) : (
              <DesktopAccountMenu nav={nav} />
            )}
          </div>

          <MobileQuickActions nav={nav} />
        </div>

        <MobileSearchPanel nav={nav} />
      </header>

      <MobileDrawer nav={nav} />
    </>
  );
}
