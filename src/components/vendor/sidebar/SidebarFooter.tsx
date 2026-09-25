"use client";

import { LogOut } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorSidebarState } from "./useVendorSidebar";

/** Logout button and footer. */
export function SidebarFooter({ sidebar }: { sidebar: VendorSidebarState }) {
  const { t } = useLanguage();
  const { isLoggingOut, handleLogout } = sidebar;

  return (
    <div className="border-t border-[#eee7e1] p-4">
      {/* Logout Button */}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="
          group flex w-full items-center gap-3
          rounded-xl px-3.5 py-2.5
          text-sm font-medium
          text-[#756860]
          transition-all
          hover:bg-red-50
          hover:text-red-600
          disabled:opacity-50
        "
      >
        <LogOut
          size={18}
          strokeWidth={1.8}
          className="transition-colors group-hover:text-red-500"
        />

        <span>
          {isLoggingOut
            ? t("vendor.sidebar.loggingOut")
            : t("vendor.sidebar.logout")}
        </span>

        {isLoggingOut && (
          <span className="ms-auto inline-flex h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
        )}
      </button>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between px-3">
        <p className="text-[9px] text-[#b1a59d]">
          © {new Date().getFullYear()} 5digea
        </p>

        <div className="flex items-center gap-1.5">
          <span className="text-[8px] text-[#b1a59d]">v2.0</span>

          <span className="h-1 w-1 rounded-full bg-[#d5c8be]" />

          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
