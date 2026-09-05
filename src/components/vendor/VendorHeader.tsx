"use client";

import {
  Menu,
  Bell,
  ChevronDown,
  Building2,
} from "lucide-react";

import { useVendor } from "@/features/vendors/hooks/useVendor";

interface VendorHeaderProps {
  onMenuClick: () => void;
}

export default function VendorHeader({
  onMenuClick,
}: VendorHeaderProps) {
  const { vendor } = useVendor();

  return (
    <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-[#eee7e1] bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#eee7e1] text-[#5f544d] transition hover:bg-[#faf7f4] lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#a99d94]">
            Vendor Portal
          </p>

          <h1 className="mt-0.5 text-base font-semibold text-[#30251f] sm:text-lg">
            Welcome back
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#eee7e1] text-[#756860] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
        >
          <Bell size={18} strokeWidth={1.8} />

          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#30251f]" />
        </button>

        <div className="hidden h-8 w-px bg-[#eee7e1] sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#f4eee9]">
            {vendor?.profileImageUrl ? (
              <img
                src={vendor.profileImageUrl}
                alt={vendor.businessName}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 size={18} className="text-[#8d7b70]" />
            )}
          </div>

          <div className="hidden min-w-0 max-w-[170px] sm:block">
            <p className="truncate text-sm font-semibold text-[#30251f]">
              {vendor?.businessName || "Vendor"}
            </p>

            <p className="text-xs text-[#9a8d84]">
              Company Account
            </p>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-[#9a8d84] sm:block"
          />
        </div>
      </div>
    </header>
  );
}
