"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorSidebarState } from "./useVendorSidebar";

/** Logo and the mobile close button. */
export function SidebarBrand({
  onClose,
}: {
  sidebar: VendorSidebarState;
  onClose: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex h-18 items-center justify-between border-b border-[#eee7e1] px-5">
      <Link href="/vendor" className="flex shrink-0 items-center gap-2">
        <Image
          src="/Logo.png"
          alt="5Digea"
          width={36}
          height={36}
          className="rounded-full"
        />

        <span className="font-serif text-lg font-medium text-[#30251f]">
          5Digea
        </span>
      </Link>

      <button
        type="button"
        onClick={onClose}
        aria-label={t("vendor.sidebar.close")}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-[#7d7169] transition hover:bg-[#faf7f4] hover:text-[#30251f] lg:hidden"
      >
        <X size={18} />
      </button>
    </div>
  );
}
