"use client";

import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { TextField } from "@/components/ui";

import type { VendorHeaderState } from "./useVendorHeader";

/** Desktop search box. */
export function HeaderSearch({ header }: { header: VendorHeaderState }) {
  const { t } = useLanguage();
  const { query, setQuery, runSearch } = header;

  return (
    <div className="relative hidden max-w-xs flex-1 md:block">
      <form onSubmit={runSearch} className="relative">
        <TextField
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("vendor.header.searchPlaceholder")}
          startIcon={<Search size={16} />}
        />
      </form>
    </div>
  );
}
