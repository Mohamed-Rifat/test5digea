"use client";

import { HeaderActions } from "./header/HeaderActions";
import { HeaderBrand } from "./header/HeaderBrand";
import { HeaderClock } from "./header/HeaderClock";
import { HeaderMobileSearch } from "./header/HeaderMobileSearch";
import { HeaderSearch } from "./header/HeaderSearch";
import { HeaderUserMenu } from "./header/HeaderUserMenu";
import { useVendorHeader } from "./header/useVendorHeader";

interface VendorHeaderProps {
  onMenuClick: () => void;
}

export default function VendorHeader({ onMenuClick }: VendorHeaderProps) {
  const header = useVendorHeader();

  return (
    <header className="sticky top-0 z-30 flex h-15 items-center justify-between border-b border-[#eee7e1] bg-white/95 px-3 backdrop-blur-md supports-backdrop-filter:bg-white/80 sm:h-18 sm:px-6 lg:px-8">
      <HeaderBrand header={header} onMenuClick={onMenuClick} />
      <HeaderSearch header={header} />
      <HeaderClock header={header} />

      <div className="flex items-center gap-1 sm:gap-2">
        <HeaderActions header={header} />
        <HeaderUserMenu header={header} />
      </div>

      <HeaderMobileSearch header={header} />
    </header>
  );
}
