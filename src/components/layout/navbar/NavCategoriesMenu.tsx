"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import { navLinkClass, navUnderlineClass } from "./navConfig";
import type { SiteNavbarState } from "./useSiteNavbar";

/** Desktop "Categories" mega-menu. */
export function NavCategoriesMenu({ nav }: { nav: SiteNavbarState }) {
  const { t, localize } = useLanguage();
  const {
    categoriesOpen,
    setCategoriesOpen,
    categoriesRef,
    activeCategories,
    goToCategory,
  } = nav;

  return (
    <div className="relative" ref={categoriesRef}>
      <button
        type="button"
        onClick={() => setCategoriesOpen((v) => !v)}
        className={`${navLinkClass(categoriesOpen)} flex items-center gap-1`}
      >
        {t("navbar.categories")}
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${
            categoriesOpen ? "rotate-180 text-[#a47e43]" : ""
          }`}
        />
        <span className={navUnderlineClass(categoriesOpen)} />
      </button>

      {categoriesOpen && (
        <div className="animate-menu-pop absolute start-1/2 top-full z-30 mt-4 w-[min(90vw,720px)] origin-top -translate-x-1/2 rtl:translate-x-1/2 overflow-hidden rounded-[1.75rem] border border-[#eee2d6] bg-white/98 p-5 shadow-[0_32px_70px_-20px_rgba(48,37,31,0.3)] backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2 px-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#a47e43]">
              {t("navbar.browseByCategory")}
            </p>
            <span className="h-px flex-1 bg-gradient-to-r from-[#e7d5b8] to-transparent rtl:bg-gradient-to-l" />
          </div>
          {activeCategories.length === 0 ? (
            <p className="px-1 py-2 text-sm text-[#766d67]">
              {t("navbar.noCategories")}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {activeCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => goToCategory(category.id)}
                  className="rounded-2xl px-3.5 py-2.5 text-start text-sm text-[#5f544d] transition-all duration-200 hover:bg-[#faf3ea] hover:text-[#30251f] hover:shadow-[inset_0_0_0_1px_#eadfce]"
                >
                  {localize(category.name)}
                </button>
              ))}
            </div>
          )}
          <div className="mt-3 border-t border-[#f1ece2] pt-3">
            <Link
              href="/vendors"
              onClick={() => setCategoriesOpen(false)}
              className="group inline-flex items-center gap-1 px-1 py-1 text-sm font-semibold text-[#a47e43] transition-colors hover:text-[#8a6836]"
            >
              {t("navbar.viewAllVendors")}
              <ChevronRight
                size={14}
                className="transition-transform duration-200 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
