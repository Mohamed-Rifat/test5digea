"use client";

import { Search, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { TextField } from "@/components/ui";
import { SupportFaq } from "./hub/SupportFaq";
import { SupportFooterNote } from "./hub/SupportFooterNote";
import { SupportHeader } from "./hub/SupportHeader";
import { SupportInfoCards } from "./hub/SupportInfoCards";
import { SupportOptionsList } from "./hub/SupportOptionsList";
import { SupportQuickActions } from "./hub/SupportQuickActions";
import { useSupportHub } from "./hub/useSupportHub";

/** Support page shared by the public site, the vendor and the admin areas. */
export default function SupportHubPage() {
  const { t } = useLanguage();
  const hub = useSupportHub();

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
        <SupportHeader hub={hub} />

        <TextField
          value={hub.searchQuery}
          onChange={(event) => hub.setSearchQuery(event.target.value)}
          placeholder={t("support.searchPlaceholder")}
          aria-label={t("support.searchPlaceholder")}
          startIcon={<Search size={18} />}
          containerClassName="mb-6"
          endAdornment={
            hub.searchQuery ? (
              <button
                type="button"
                onClick={() => hub.setSearchQuery("")}
                aria-label={t("support.clearSearch")}
                className="rounded-md p-1 text-[#9b8f86] transition hover:bg-[#f5eee9] hover:text-[#30251f]"
              >
                <X size={14} />
              </button>
            ) : undefined
          }
        />

        <SupportQuickActions hub={hub} />
        <SupportOptionsList hub={hub} />
        <SupportInfoCards hub={hub} />
        <SupportFaq />
        <SupportFooterNote />
      </div>
    </div>
  );
}
