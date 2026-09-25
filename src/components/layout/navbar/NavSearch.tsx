"use client";

import { Search } from "lucide-react";
import { TextField } from "@/components/ui";
import { useLanguage } from "@/context/LanguageContext";

import { searchTargets } from "./navConfig";
import type { SiteNavbarState } from "./useSiteNavbar";

/** Desktop search with the "vendors / services" target picker. */
export function NavSearch({ nav }: { nav: SiteNavbarState }) {
  const { t } = useLanguage();
  const {
    search,
    setSearch,
    showSearchTargets,
    setShowSearchTargets,
    searchRef,
    goToSearch,
    handleSearchSubmit,
  } = nav;

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <TextField
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSearchTargets(true);
          }}
          onFocus={() => setShowSearchTargets(true)}
          placeholder={t("navbar.searchPlaceholder")}
          aria-label={t("navbar.searchPlaceholder")}
          startIcon={<Search size={16} />}
          size="sm"
          containerClassName="w-32 transition-all duration-300 focus-within:w-64 2xl:w-40"
        />
      </form>

      {showSearchTargets && (
        <div className="animate-menu-pop absolute inset-e-0 top-full z-30 mt-2.5 w-64 origin-top-right rtl:origin-top-left overflow-hidden rounded-2xl border border-[#eee2d6] bg-white/98 p-1.5 shadow-[0_24px_50px_-16px_rgba(48,37,31,0.3)] backdrop-blur-xl">
          {searchTargets.map((target) => {
            const Icon = target.icon;
            return (
              <button
                key={target.href}
                type="button"
                onClick={() => goToSearch(target.href)}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-start text-sm text-[#5f544d] transition-colors duration-150 hover:bg-[#faf3ea] hover:text-[#30251f]"
              >
                <Icon size={15} className="text-[#a47e43]" />
                {search.trim() ? (
                  <span>
                    {t("navbar.searchPrefix")}{" "}
                    <span className="font-semibold">{t(target.labelKey)}</span>{" "}
                    {t("navbar.searchQuery", { query: search.trim() })}
                  </span>
                ) : (
                  <span>
                    {t("navbar.browse", { target: t(target.labelKey) })}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
