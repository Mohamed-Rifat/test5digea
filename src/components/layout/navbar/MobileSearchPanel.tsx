"use client";

import { Search } from "lucide-react";
import { TextField } from "@/components/ui";
import { useLanguage } from "@/context/LanguageContext";

import { searchTargets } from "./navConfig";
import type { SiteNavbarState } from "./useSiteNavbar";

/** Search panel that slides open under the header on phones. */
export function MobileSearchPanel({ nav }: { nav: SiteNavbarState }) {
  const { t } = useLanguage();
  const {
    search,
    setSearch,
    mobileSearchOpen,
    mobileSearchInputRef,
    goToSearch,
    handleSearchSubmit,
  } = nav;

  return (
    <>
      {mobileSearchOpen && (
        <div className="animate-menu-pop absolute inset-x-0 top-full z-30 origin-top border-b border-[#eee2d6] bg-white/98 p-3 shadow-[0_24px_50px_-16px_rgba(48,37,31,0.3)] backdrop-blur-xl xl:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <TextField
              ref={mobileSearchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("navbar.searchPlaceholderMobile")}
              aria-label={t("navbar.searchPlaceholderMobile")}
              startIcon={<Search size={16} />}
            />
          </form>

          <div className="mt-2 space-y-1">
            {searchTargets.map((target) => {
              const Icon = target.icon;
              return (
                <button
                  key={target.href}
                  type="button"
                  onClick={() => goToSearch(target.href)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm text-[#5f544d] transition-colors duration-150 hover:bg-[#faf3ea] hover:text-[#30251f]"
                >
                  <Icon size={15} className="text-[#a47e43]" />
                  {search.trim() ? (
                    <span>
                      {t("navbar.searchPrefix")}{" "}
                      <span className="font-semibold">
                        {t(target.labelKey)}
                      </span>
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
        </div>
      )}
    </>
  );
}
