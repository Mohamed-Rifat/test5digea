"use client";

import { RefreshCw, Search, X } from "lucide-react";
import { Tooltip } from "@mui/material";
import { useLanguage } from "@/context/LanguageContext";
import NotificationBell from "@/components/notifications/NotificationBell";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import SessionCountdownBadge from "@/components/shared/SessionCountdownBadge";

import type { VendorHeaderState } from "./useVendorHeader";

/** Mobile search toggle, refresh, language, notifications. */
export function HeaderActions({ header }: { header: VendorHeaderState }) {
  const { t } = useLanguage();
  const { isRefreshing, mobileSearchOpen, setMobileSearchOpen, handleRefresh } =
    header;

  return (
    <>
      {/* Mobile Search */}
      <button
        type="button"
        onClick={() => setMobileSearchOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eee7e1] text-[#756860] transition hover:bg-[#faf7f4] hover:text-[#30251f] md:hidden"
        aria-label={t("vendor.header.searchLabel")}
        aria-expanded={mobileSearchOpen}
      >
        {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
      </button>

      {/* Refresh */}
      <Tooltip title={t("vendor.header.refresh")} arrow>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eee7e1] text-[#756860] transition hover:bg-[#faf7f4] hover:text-[#30251f] disabled:opacity-50 sm:h-10 sm:w-10"
        >
          <RefreshCw
            size={16}
            strokeWidth={1.8}
            className={isRefreshing ? "animate-spin" : ""}
          />
        </button>
      </Tooltip>

      <SessionCountdownBadge compact />

      {/* Language switcher: compact code on phones, globe + name from sm up */}
      <LanguageSwitcher variant="compact" className="sm:hidden" />
      <LanguageSwitcher className="hidden sm:block" />

      {/* Notifications */}
      <NotificationBell viewAllHref="/vendor/notifications" />

      {/* Divider */}
      <div className="hidden h-7 w-px bg-[#eee7e1] sm:block" />
    </>
  );
}
