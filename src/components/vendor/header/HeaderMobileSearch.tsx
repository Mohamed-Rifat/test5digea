"use client";

import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { TextField } from "@/components/ui";

import type { VendorHeaderState } from "./useVendorHeader";

/** Mobile search panel. */
export function HeaderMobileSearch({ header }: { header: VendorHeaderState }) {
  const { t } = useLanguage();
  const { query, setQuery, mobileSearchOpen, mobileSearchInputRef, runSearch } =
    header;

  return (
    <>
      {mobileSearchOpen && (
        <div className="absolute inset-x-0 top-full z-30 border-b border-[#eee7e1] bg-white p-3 shadow-lg md:hidden">
          <form onSubmit={runSearch} className="relative">
            <TextField
              ref={mobileSearchInputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("vendor.header.searchPlaceholder")}
              startIcon={<Search size={16} />}
            />
          </form>
        </div>
      )}
    </>
  );
}
