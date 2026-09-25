"use client";

import { useLanguage } from "@/context/LanguageContext";

import { SidebarBrand } from "./sidebar/SidebarBrand";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { SidebarMainNav } from "./sidebar/SidebarMainNav";
import { SidebarQuickActions } from "./sidebar/SidebarQuickActions";
import { SidebarVendorCard } from "./sidebar/SidebarVendorCard";
import { useVendorSidebar } from "./sidebar/useVendorSidebar";

interface VendorSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function VendorSidebar({
  mobileOpen,
  onClose,
}: VendorSidebarProps) {
  const { t } = useLanguage();
  const sidebar = useVendorSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label={t("vendor.sidebar.close")}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 start-0 z-50 flex w-70 flex-col
          border-e border-[#eee7e1] bg-white
          transition-transform duration-300 ease-in-out
          lg:static lg:z-auto lg:translate-x-0 lg:rtl:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full rtl:translate-x-full"
          }
        `}
      >
        <SidebarBrand sidebar={sidebar} onClose={onClose} />
        <SidebarVendorCard sidebar={sidebar} />

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarMainNav sidebar={sidebar} onClose={onClose} />

          <div className="my-4 border-t border-[#f0eae5]" />

          <SidebarQuickActions sidebar={sidebar} onClose={onClose} />
        </nav>

        <SidebarFooter sidebar={sidebar} />
      </aside>
    </>
  );
}
