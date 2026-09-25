"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

import {
  navLinkClass,
  navUnderlineClass,
  primaryLinks,
  secondaryLinks,
} from "./navConfig";
import { NavCategoriesMenu } from "./NavCategoriesMenu";
import type { SiteNavbarState } from "./useSiteNavbar";

/** Primary links, the categories menu and secondary links (xl+). */
export function DesktopNav({ nav }: { nav: SiteNavbarState }) {
  const { t } = useLanguage();
  const { isActive } = nav;

  return (
    <nav className="hidden items-center gap-0.5 xl:flex">
      {primaryLinks.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={navLinkClass(active)}
          >
            {t(link.labelKey)}
            <span className={navUnderlineClass(active)} />
          </Link>
        );
      })}

      {/* CATEGORIES (mega-menu) — browse by category, separate from
        the standalone "Services" link above. */}
      <NavCategoriesMenu nav={nav} />

      {secondaryLinks.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={navLinkClass(active)}
          >
            {t(link.labelKey)}
            <span className={navUnderlineClass(active)} />
          </Link>
        );
      })}
    </nav>
  );
}
