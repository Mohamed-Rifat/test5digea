"use client";

import Link from "next/link";
import { Tooltip } from "@mui/material";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorSidebarState } from "./useVendorSidebar";
import { quickActions } from "@/components/vendor/sidebar/sidebarConfig";

/** Support / quick-action links. */
export function SidebarQuickActions({
  onClose,
}: {
  sidebar: VendorSidebarState;
  onClose: () => void;
}) {
  const { t } = useLanguage();

  return (
    <>
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a99d94]">
        {t("vendor.sidebar.support")}
      </p>

      <div className="space-y-1">
        {quickActions.map((item) => {
          const Icon = item.icon;

          {
            /* Disabled Support */
          }
          if (item.disabled) {
            return (
              <Tooltip
                key={item.href}
                title={t("vendor.sidebar.comingSoon")}
                placement="right"
                arrow
                slotProps={{
                  tooltip: {
                    sx: {
                      maxWidth: 280,
                      fontSize: "12px",
                      lineHeight: 1.6,
                      textAlign: "start",
                      padding: "10px 12px",
                      borderRadius: "10px",
                    },
                  },
                }}
              >
                <div
                  className="
                  group relative flex cursor-not-allowed
                  items-center gap-3
                  rounded-xl px-3.5 py-2.5
                  text-sm font-medium
                  text-[#b8aea7]
                  opacity-60
                "
                >
                  <Icon
                    size={18}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#b8aea7]"
                  />

                  <span className="flex-1">{t(item.labelKey)}</span>

                  <span
                    className="
                    shrink-0 rounded-full
                    bg-[#f5f1ed]
                    px-2 py-0.5
                    text-[8px] font-medium
                    text-[#a99d94]
                  "
                  >
                    {t("vendor.sidebar.comingSoon")}
                  </span>
                </div>
              </Tooltip>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="
              flex items-center gap-3
              rounded-xl px-3.5 py-2.5
              text-sm font-medium
              text-[#665a52]
              transition
              hover:bg-[#faf7f4]
              hover:text-[#30251f]
            "
            >
              <Icon size={18} strokeWidth={1.8} className="text-[#9a8d84]" />

              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
