"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Tooltip, Badge } from "@mui/material";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorSidebarState } from "./useVendorSidebar";
import { navigationItems } from "@/components/vendor/sidebar/sidebarConfig";

/** Main navigation links. */
export function SidebarMainNav({
  sidebar,
  onClose,
}: {
  sidebar: VendorSidebarState;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const { isActive, pendingReviews } = sidebar;

  return (
    <>
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a99d94]">
        {t("vendor.sidebar.mainMenu")}
      </p>

      <div className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.disabled) {
            return (
              <Tooltip
                key={item.href}
                title={t("vendor.sidebar.userModeTooltip")}
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
                  items-center gap-3 rounded-xl
                  px-3.5 py-2.5
                  text-sm font-medium
                  text-[#b8aea7] opacity-60
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
              className={`
              group relative flex items-center gap-3
              rounded-xl px-3.5 py-2.5
              text-sm font-medium
              transition-all duration-200
              ${
                active
                  ? "bg-[#30251f] text-white shadow-lg shadow-[#30251f]/10"
                  : "text-[#665a52] hover:bg-[#faf7f4] hover:text-[#30251f]"
              }
            `}
            >
              {active && (
                <span className="absolute start-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-e-full bg-[#a47e43]" />
              )}

              <Icon
                size={18}
                strokeWidth={active ? 2.2 : 1.8}
                className={
                  active
                    ? "text-white"
                    : "text-[#9a8d84] group-hover:text-[#30251f]"
                }
              />

              <span className="flex-1">{t(item.labelKey)}</span>

              {item.href === "/vendor/reviews" && pendingReviews > 0 && (
                <Badge
                  badgeContent={pendingReviews}
                  color="warning"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: 10,
                      height: 20,
                      minWidth: 20,
                      fontWeight: 600,
                      backgroundColor: "#f59e0b",
                    },
                  }}
                />
              )}

              <ChevronRight
                size={14}
                className={`
                transition-all duration-200
                rtl:rotate-180
                ${
                  active
                    ? "translate-x-0 opacity-100 text-white"
                    : "-translate-x-1 rtl:translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                }
              `}
              />
            </Link>
          );
        })}
      </div>
    </>
  );
}
