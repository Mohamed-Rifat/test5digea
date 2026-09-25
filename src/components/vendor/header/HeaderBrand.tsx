"use client";

import { Menu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorHeaderState } from "./useVendorHeader";

/** Menu button and brand. */
export function HeaderBrand({
  header,
  onMenuClick,
}: {
  header: VendorHeaderState;
  onMenuClick: () => void;
}) {
  const { t } = useLanguage();
  const { status, StatusIcon } = header;

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Menu Button */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label={t("vendor.header.openSidebar")}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee7e1] text-[#5f544d] transition hover:border-[#d5c8be] hover:bg-[#faf7f4] lg:hidden"
      >
        <Menu size={18} />
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2.5">
        {/* <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-9 sm:w-9">
          <Sparkles
            size={15}
            className="text-[#a47e43] sm:h-4.5 sm:w-4.5"
          />
        </div> */}

        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[#30251f] sm:text-base">
              {t("vendor.header.dashboard")}
            </p>

            <span
              className={`hidden items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${status?.className || ""} sm:inline-flex`}
            >
              <StatusIcon size={10} />
              {status ? t(status.labelKey) : ""}
            </span>
          </div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] rtl:tracking-normal text-[#a99d94] sm:text-[10px]">
            {t("vendor.header.portal")}
          </p>
        </div>
      </div>
    </div>
  );
}
